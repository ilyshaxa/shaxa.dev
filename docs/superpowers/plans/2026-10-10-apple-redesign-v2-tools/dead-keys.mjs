// Lists messages/en.json leaf keys that no source file references.
// Usage: node dead-keys.mjs <repoRoot>
//
// How a key counts as used:
//   - A translator bound by `const t = useTranslations('ns')` / `getTranslations(...)` is called as t('key'),
//     t(`key.${x}`) or t(cond ? 'a' : 'b'). Every string literal in the first argument is a key under that
//     namespace; a template literal marks everything under its prefix as used.
//   - A call whose first argument has no string literal at all (t(row)) marks the whole namespace as used.
//   - The full dotted path appears as a string literal anywhere in src.
// It errs on the side of keeping keys. `data.*` is skipped: it is read by slug through useMessages() and is checked by
// data.test.ts instead.
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ?? '.';
const en = JSON.parse(fs.readFileSync(path.join(root, 'messages/en.json'), 'utf8'));

function leaves(obj, prefix = []) {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const next = [...prefix, k];
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...leaves(v, next));
    else out.push(next.join('.'));
  }
  return out;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

/** Returns the text of the first argument of the call whose "(" is at `open`. */
function firstArgument(text, open) {
  let depth = 0;
  let quote = null;
  for (let i = open + 1; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') quote = ch;
    else if (ch === '(' || ch === '[' || ch === '{') depth += 1;
    else if (ch === ')' || ch === ']' || ch === '}') {
      if (depth === 0) return text.slice(open + 1, i);
      depth -= 1;
    } else if (ch === ',' && depth === 0) return text.slice(open + 1, i);
  }
  return text.slice(open + 1);
}

const files = walk(path.join(root, 'src')).filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('.test.ts'));
const usedFull = new Set();
const usedPrefix = new Set();
const literals = new Set();

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/(['"`])((?:[A-Za-z0-9_-]+\.)+[A-Za-z0-9_-]+)\1/g)) literals.add(m[2]);

  const bindings = {};
  for (const m of text.matchAll(/const\s+(\w+)\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\(([^)]*)\)/g)) {
    const ns = /namespace:\s*['"`]([^'"`]+)['"`]/.exec(m[2]) ?? /^\s*['"`]([^'"`]+)['"`]/.exec(m[2]);
    bindings[m[1]] = ns ? ns[1] : '';
  }

  for (const [name, ns] of Object.entries(bindings)) {
    const qualify = (key) => (ns ? `${ns}.${key}` : key);
    const callRe = new RegExp(`\\b${name}(?:\\.rich|\\.raw|\\.markup)?\\(`, 'g');
    for (const m of text.matchAll(callRe)) {
      const arg = firstArgument(text, m.index + m[0].length - 1);
      const strings = [...arg.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)].map((s) => s[2]);
      if (strings.length === 0) {
        if (ns) usedPrefix.add(`${ns}.`);
        continue;
      }
      for (const key of strings) {
        const dyn = key.indexOf('${');
        if (dyn >= 0) usedPrefix.add(qualify(key.slice(0, dyn)));
        else usedFull.add(qualify(key));
      }
    }
  }
}

const dead = leaves(en).filter((k) => {
  if (k.startsWith('data.')) return false;
  if (usedFull.has(k) || literals.has(k)) return false;
  for (const p of usedPrefix) if (k.startsWith(p)) return false;
  return true;
});
console.log(dead.join('\n'));
console.error(`\n${dead.length} unused keys (data.* excluded)`);
