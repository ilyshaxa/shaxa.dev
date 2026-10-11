import assert from 'node:assert/strict';
import { test } from 'node:test';
import sitemap, { CONTENT_LAST_MODIFIED } from '../app/sitemap.ts';

const entries = await sitemap();

test('the sitemap lists every page of every locale (33 URLs)', () => {
  // 4 main pages + 3 jobs + 4 projects = 11 pages, in 3 locales.
  assert.equal(entries.length, 33);
  assert.equal(new Set(entries.map((entry) => entry.url)).size, 33);
  for (const entry of entries) assert.match(entry.url, /^https:\/\/shaxa\.dev\/(en|ru|uz)(\/|$)/);
});

test('every entry lists its en, uz, ru versions and x-default (English)', () => {
  for (const entry of entries) {
    const path = new URL(entry.url).pathname.replace(/^\/(en|ru|uz)/, '');
    const languages = entry.alternates?.languages as Record<string, string> | undefined;
    assert.deepEqual(languages, {
      en: `https://shaxa.dev/en${path}`,
      uz: `https://shaxa.dev/uz${path}`,
      ru: `https://shaxa.dev/ru${path}`,
      'x-default': `https://shaxa.dev/en${path}`,
    }, entry.url);
  }
});

test('lastModified is one fixed date that is not in the future', () => {
  assert.match(CONTENT_LAST_MODIFIED, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(new Date(CONTENT_LAST_MODIFIED).getTime() <= Date.now());
  assert.ok(entries.every((entry) => entry.lastModified === CONTENT_LAST_MODIFIED));
});
