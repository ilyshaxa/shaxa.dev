import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const locales = ['en', 'ru', 'uz'] as const;
type Locale = (typeof locales)[number];

function load(locale: Locale): unknown {
  return JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), 'utf8'));
}

/** Flattens to dotted paths. Array items become `path.0`, `path.1`, … so list lengths are compared too. */
function flatten(value: unknown, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (typeof value === 'string') {
    out.set(prefix, value);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}.${index}`).forEach((text, key) => out.set(key, text)));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      flatten(item, prefix ? `${prefix}.${key}` : key).forEach((text, k) => out.set(k, text));
    }
  }
  return out;
}

const flat = Object.fromEntries(locales.map((locale) => [locale, flatten(load(locale))])) as Record<Locale, Map<string, string>>;
const others = ['ru', 'uz'] as const;

// Legacy strings the pre-v2 pages still read, which Task 11 deletes. This one RU text spells "1-year" out as a word,
// so its digits differ from the English. Delete this set (and its `continue`) in Task 11.
const LEGACY_UNTIL_PRUNE = new Set(['data.experiences.praaktisgo-devops-engineer.achievements.3']);

test('every locale has exactly the same keys', () => {
  const reference = [...flat.en.keys()].sort();
  for (const locale of others) {
    assert.deepEqual([...flat[locale].keys()].sort(), reference, `${locale} keys differ from en`);
  }
});

test('placeholders and tags match across locales', () => {
  const tokens = (text: string) => (text.match(/\{\w+\}|<\/?\w+>/g) ?? []).sort();
  for (const [key, text] of flat.en) {
    for (const locale of others) {
      assert.deepEqual(tokens(flat[locale].get(key) ?? ''), tokens(text), `${locale} ${key}`);
    }
  }
});

test('numbers match across locales', () => {
  // 99,9% and 99.9% are the same number.
  const numbers = (text: string) => (text.replace(/,/g, '.').match(/\$?\d+(?:\.\d+)?[%K]?/g) ?? []).sort();
  for (const [key, text] of flat.en) {
    if (LEGACY_UNTIL_PRUNE.has(key)) continue;
    for (const locale of others) {
      assert.deepEqual(numbers(flat[locale].get(key) ?? ''), numbers(text), `${locale} ${key}`);
    }
  }
});
