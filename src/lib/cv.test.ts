import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { countPages, renderHtml } from '../../cv/build.mjs';
import { getProfile } from './data.ts';

const locales = ['en', 'ru', 'uz'] as const;
type Locale = (typeof locales)[number];

interface CvContent {
  lang: string;
  name: string;
  titles: string;
  labels: Record<string, string>;
  contact: Record<string, string>;
  summary: string;
  experience: { role: string; company: string; type: 'full' | 'part' | 'intern'; dates: string; bullets: string[] }[];
  skills: { label: string; items: string[] }[];
  education: { school: string; degree: string; dates: string };
  languages: string[];
}

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const cv = Object.fromEntries(locales.map((l) => [l, JSON.parse(read(`../../cv/content/${l}.json`))])) as Record<Locale, CvContent>;
const site = Object.fromEntries(locales.map((l) => [l, read(`../../messages/${l}.json`)])) as Record<Locale, string>;

// Same list as CUT_SKILLS in data.test.ts: skills no CV line, job entry or project shows.
const CUT_SKILLS = [
  'Azure', 'Alibaba Cloud', 'DigitalOcean', 'Kubernetes', 'Podman', 'Containerd', 'Helm', 'Terraform', 'Ansible', 'Pulumi',
  'CloudFormation', 'ARM Templates', 'CDK', 'CircleCI', 'Azure DevOps', 'ArgoCD', 'Elasticsearch', 'DynamoDB', 'Git', 'YAML', 'JSON',
];
// Figures that sit in CV text but not in a site message as such (the ISUP protocol version).
const ALLOWED_NUMBERS = ['5.0'];

const keyPaths = (value: unknown, prefix = ''): string[] =>
  Array.isArray(value)
    ? [`${prefix}[]`, ...(value[0] !== undefined ? keyPaths(value[0], `${prefix}[]`) : [])]
    : value && typeof value === 'object'
      ? Object.entries(value).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k))
      : [prefix];

const allText = (c: CvContent) => [c.summary, ...c.experience.flatMap((e) => e.bullets)];

test('every CV locale has the same keys', () => {
  const base = keyPaths(cv.en).sort();
  for (const l of locales) assert.deepEqual(keyPaths(cv[l]).sort(), base, `${l} keys differ from en`);
});

test('every locale lists the same experience entries, bullet counts and skills rows', () => {
  for (const l of locales) {
    const { experience, skills } = cv[l];
    assert.deepEqual(experience.map((e) => e.type), ['full', 'part', 'intern'], `${l} role order or types`);
    assert.equal(experience.map((e) => e.company).join('|'), 'kpi.com|PraaktisGo|DataSite Technology', `${l} companies`);
    assert.deepEqual(experience.map((e) => e.bullets.length), cv.en.experience.map((e) => e.bullets.length), `${l} bullet counts`);
    assert.equal(skills.length, cv.en.skills.length, `${l} skills rows`);
    skills.forEach((row, i) => assert.deepEqual(row.items, cv.en.skills[i].items, `${l} skills row ${i}`));
  }
  const [kpi, praaktis, datasite] = cv.en.experience.map((e) => e.bullets.length);
  assert.ok(kpi >= 4 && kpi <= 5, 'KPI has 4-5 bullets');
  assert.ok(praaktis >= 4 && praaktis <= 5, 'PraaktisGo has 4-5 bullets');
  assert.ok(datasite >= 2 && datasite <= 3, 'DataSite has 2-3 bullets');
});

test('contact facts match the site', () => {
  const profile = getProfile();
  const bare = (url: string) => url.replace(/^https?:\/\//, '');
  for (const l of locales) {
    const { contact } = cv[l];
    assert.equal(contact.email, profile.email);
    assert.equal(contact.phone, profile.phone);
    assert.equal(contact.linkedin, bare(profile.linkedin));
    assert.equal(contact.github, bare(profile.github));
    assert.equal(contact.site, bare(profile.website));
    assert.equal(contact.telegram, '@shaxadev');
  }
});

test('every number on the CV already appears on the site', () => {
  for (const l of locales) {
    for (const text of allText(cv[l])) {
      for (const figure of text.match(/(?<![\w.])\$?\d+(?:\.\d+)?%?K?/g) ?? []) {
        if (ALLOWED_NUMBERS.includes(figure)) continue;
        assert.ok(site[l].includes(figure) || site.en.includes(figure), `${l}: "${figure}" is not on the site`);
      }
    }
  }
});

test('no site-only skills and no AWS certification claim', () => {
  for (const l of locales) {
    const items = cv[l].skills.flatMap((row) => row.items);
    for (const skill of CUT_SKILLS) assert.ok(!items.includes(skill), `${l} lists ${skill}`);
    for (const text of allText(cv[l])) assert.ok(!/certified|сертифиц|sertifikat/i.test(text), `${l} claims a certificate: ${text}`);
  }
});

test('the header names the DevOps / Cloud role and no system administrator title', () => {
  for (const l of locales) {
    assert.ok(cv[l].titles.includes('DevOps') && cv[l].titles.includes('Cloud'), `${l} titles`);
    assert.ok(!/administrat|администратор/i.test(`${cv[l].titles} ${cv[l].summary}`), `${l} still names a system administrator role`);
  }
});

test('the rendered CV has working links, one h1, ordered sections and one part-time badge', () => {
  for (const l of locales) {
    const html = renderHtml(cv[l]);
    assert.ok(html.includes('href="mailto:ilyshaxa@gmail.com"'));
    assert.ok(html.includes('href="tel:+998937665010"'));
    assert.ok(html.includes('href="https://t.me/shaxadev"'));
    assert.equal(html.match(/<h1>/g)?.length, 1);
    const { summary, experience, skills, education, languages } = cv[l].labels;
    const at = [summary, experience, skills, education, languages].map((label) => html.indexOf(`<h2>${label}</h2>`));
    assert.ok(at.every((i) => i > 0) && [...at].sort((a, b) => a - b).join() === at.join(), `${l} section order`);
    assert.equal(html.split(`<span class="badge">${cv[l].labels.part}</span>`).length - 1, 1, `${l} part-time badge`);
    assert.equal(html.split(`<span class="badge">${cv[l].labels.full}</span>`).length - 1, 1, `${l} full-time badge`);
  }
});

test('renderHtml escapes markup in content and countPages counts page objects', () => {
  const evil = { ...cv.en, summary: '<b>"x" & y</b>' };
  const html = renderHtml(evil);
  assert.ok(html.includes('&lt;b&gt;&quot;x&quot; &amp; y&lt;/b&gt;'));
  assert.ok(!html.includes('<b>"x"'));
  const pdf = Buffer.from('<< /Type /Pages /Count 2 >> << /Type /Page >> << /Type /Page >>');
  assert.equal(countPages(pdf), 2);
});
