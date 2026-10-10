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
const others = locales.filter((locale) => locale !== 'en');

test('every locale has exactly the same keys', () => {
  const reference = new Set(flat.en.keys());
  for (const locale of others) {
    const keys = new Set(flat[locale].keys());
    const missing = [...reference].filter((key) => !keys.has(key));
    const extra = [...keys].filter((key) => !reference.has(key));
    assert.deepEqual({ missing, extra }, { missing: [], extra: [] }, `${locale} keys differ from en`);
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

test('no apostrophe quotes a placeholder or tag', () => {
  // In ICU MessageFormat (next-intl), an apostrophe directly before { } < or > turns what follows into literal text,
  // so the placeholder silently stops working. `o'zbek` or `Shaxriyor's {x}` (apostrophe, then a letter or a space) is fine.
  for (const locale of locales) {
    for (const [key, text] of flat[locale]) {
      assert.ok(!/'[{}<>]/.test(text), `${locale} ${key} has an apostrophe before a brace or angle bracket`);
    }
  }
});

test('numbers match across locales', () => {
  // 99,9% and 99.9% are the same number.
  const numbers = (text: string) => (text.replace(/,/g, '.').match(/\$?\d+(?:\.\d+)?[%K]?/g) ?? []).sort();
  for (const [key, text] of flat.en) {
    for (const locale of others) {
      assert.deepEqual(numbers(flat[locale].get(key) ?? ''), numbers(text), `${locale} ${key}`);
    }
  }
});

test('no message claims a certification', () => {
  for (const locale of locales) {
    for (const [key, text] of flat[locale]) {
      assert.ok(!/AWS\s+(Certified|Сертифицирован|Sertifikatlangan)/i.test(text), `${locale} ${key} claims an AWS certification`);
      assert.ok(!key.includes('awsCertified'), `${locale} still has ${key}`);
    }
  }
});
