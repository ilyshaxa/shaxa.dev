import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';
import { getAllExperiences, getAllProjects, getProfile, localizeExperiences, localizeProjects } from './data.ts';
import { buildAlternates, buildPageMetadata, getTwitterHandle, OG_IMAGE, TITLE_TEMPLATE, withSiteName } from './seo.ts';

const locales = ['en', 'ru', 'uz'] as const;
type Messages = Record<string, unknown> & { metadata: Record<string, { title: string; description: string }> };
const messages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), 'utf8'))])
) as Record<(typeof locales)[number], Messages>;

const base = 'https://shaxa.dev';
const { name, title: role } = getProfile();
const fill = (text: string) => text.replaceAll('{name}', name).replaceAll('{title}', role);

/** Every indexable page of one locale with the title and description its metadata produces. */
function pagesOf(locale: (typeof locales)[number]) {
  const m = messages[locale];
  const pages = [
    { path: '', title: fill(m.metadata.home.title), description: fill(m.metadata.home.description) },
    ...(['about', 'projects', 'contact'] as const).map((section) => ({
      path: `/${section}`,
      title: fill(m.metadata[section].title),
      description: fill(m.metadata[section].description),
    })),
    ...localizeExperiences(getAllExperiences(), m).map((e) => ({
      path: `/about/${e.slug}`,
      title: withSiteName(`${e.position}, ${e.company}`),
      description: e.summary,
    })),
    ...localizeProjects(getAllProjects(), m).map((p) => ({
      path: `/projects/${p.slug}`,
      title: withSiteName(p.title),
      description: p.summary,
    })),
  ];
  return pages;
}

test('canonical is the page itself and hreflang covers every locale plus x-default (English)', () => {
  const alternates = buildAlternates(base, 'ru', '/projects/jenkins-cicd-pipeline');
  assert.equal(alternates.canonical, `${base}/ru/projects/jenkins-cicd-pipeline`);
  assert.deepEqual(alternates.languages, {
    en: `${base}/en/projects/jenkins-cicd-pipeline`,
    uz: `${base}/uz/projects/jenkins-cicd-pipeline`,
    ru: `${base}/ru/projects/jenkins-cicd-pipeline`,
    'x-default': `${base}/en/projects/jenkins-cicd-pipeline`,
  });
  assert.equal(buildAlternates(base, 'uz').canonical, `${base}/uz`);
});

test('a page supplies complete Open Graph and Twitter objects (a child replaces the parent wholesale)', () => {
  const meta = buildPageMetadata({ baseUrl: base, locale: 'uz', path: '/contact', title: 'T - N', description: 'D' });
  const image = { url: `${base}${OG_IMAGE.path}`, width: 1200, height: 630, alt: `${name}, ${role}` };
  assert.deepEqual(meta.openGraph, {
    type: 'website',
    url: `${base}/uz/contact`,
    title: 'T - N',
    description: 'D',
    siteName: 'shaxa.dev',
    locale: 'uz_UZ',
    images: [image],
  });
  assert.deepEqual(meta.twitter, {
    card: 'summary_large_image',
    title: 'T - N',
    description: 'D',
    creator: '@ilyshaxa',
    images: [image],
  });
  assert.deepEqual(meta.alternates?.canonical, `${base}/uz/contact`);
});

test('og:locale follows the page locale and the site name follows the host', () => {
  const ru = buildPageMetadata({ baseUrl: 'https://shaxriyor.com', locale: 'ru', title: 't', description: 'd' });
  assert.equal((ru.openGraph as { locale: string }).locale, 'ru_RU');
  assert.equal((ru.openGraph as { siteName: string }).siteName, 'shaxriyor.com');
});

test('the Twitter handle comes from the profile link', () => {
  assert.equal(getTwitterHandle(), '@ilyshaxa');
});

test('titles are unique per page, carry the name once and stay short', () => {
  assert.equal(TITLE_TEMPLATE, `%s - ${name}`);
  for (const locale of locales) {
    const pages = pagesOf(locale);
    const titles = pages.map((page) => page.title);
    assert.equal(new Set(titles).size, titles.length, `${locale}: duplicate titles ${JSON.stringify(titles)}`);
    for (const title of titles) {
      assert.equal(title.split(name).length - 1, 1, `${locale}: "${title}" must contain the name exactly once`);
      // Search results cut by pixel width (about 60 characters); the longest, the DataSite internship, is 68 and still leads with role and company.
      assert.ok(title.length <= 70, `${locale}: "${title}" is ${title.length} characters`);
    }
  }
});

test('descriptions are present, snippet-sized and localized', () => {
  const english = new Map(pagesOf('en').map((page) => [page.path, page.description]));
  for (const locale of locales) {
    for (const page of pagesOf(locale)) {
      assert.ok(page.description.length >= 40 && page.description.length <= 160, `${locale}${page.path}: ${page.description.length} characters`);
      assert.ok(!page.description.includes('{'), `${locale}${page.path}: unfilled placeholder`);
      if (locale !== 'en') assert.notEqual(page.description, english.get(page.path), `${locale}${page.path} repeats the English text`);
    }
  }
});

test('public/og.png is a 1200x630 PNG under 300 KB', () => {
  const file = new URL('../../public/og.png', import.meta.url);
  const png = readFileSync(file);
  assert.equal(png.subarray(1, 4).toString('latin1'), 'PNG');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [OG_IMAGE.width, OG_IMAGE.height]);
  assert.ok(statSync(file).size < 300 * 1024);
});
