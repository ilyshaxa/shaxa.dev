import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { getAllExperiences, getAllProjects, getProfile, localizeExperiences, localizeProjects, stackRows } from './data.ts';

const locales = ['en', 'ru', 'uz'] as const;
const messages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), 'utf8'))])
) as Record<(typeof locales)[number], Record<string, unknown>>;

// Skills the site used to list that no CV line, job entry or project shows (spec section 9.3).
const CUT_SKILLS = [
  'Azure', 'Alibaba Cloud', 'DigitalOcean', 'Kubernetes', 'Podman', 'Containerd', 'Helm', 'Terraform', 'Ansible', 'Pulumi',
  'CloudFormation', 'ARM Templates', 'CDK', 'CircleCI', 'Azure DevOps', 'ArgoCD', 'Elasticsearch', 'DynamoDB', 'Git', 'YAML', 'JSON',
];

test('the stack has every row, no duplicates and none of the cut skills', () => {
  const { stack } = getProfile();
  assert.deepEqual(Object.keys(stack).sort(), [...stackRows].sort());
  const items = stackRows.flatMap((row) => stack[row]);
  for (const row of stackRows) assert.ok(stack[row].length > 0, `${row} is empty`);
  assert.equal(new Set(items).size, items.length, 'duplicate stack item');
  for (const skill of CUT_SKILLS) assert.ok(!items.includes(skill), `${skill} was cut in v2`);
});

type Copy = Record<string, Record<string, Record<string, unknown>>>;
const rawCopy = (locale: (typeof locales)[number], section: 'projects' | 'experiences', slug: string) =>
  ((messages[locale].data as Copy)[section]?.[slug] ?? {}) as Record<string, unknown>;

test('every project has four highlights and complete copy in every locale', () => {
  const projects = getAllProjects();
  assert.equal(projects.length, 4, 'expected four projects');
  for (const project of projects) assert.equal(project.highlights.length, 4, `${project.slug} highlights`);
  assert.ok(projects.every((project) => project.technologies.length > 0), 'a project has no technologies');
  for (const locale of locales) {
    for (const project of projects) {
      // Read the message entry directly, so a gap is reported by field name instead of as an empty rendered value.
      const entry = rawCopy(locale, 'projects', project.slug);
      for (const field of ['title', 'summary', 'companyName']) {
        assert.ok(typeof entry[field] === 'string' && entry[field], `${locale} ${project.slug} is missing ${field}`);
      }
      assert.ok(Array.isArray(entry.points) && entry.points.length >= 3, `${locale} ${project.slug} needs at least 3 points`);
    }
    const localized = localizeProjects(projects, messages[locale]);
    assert.ok(localized.every((project) => project.summary && project.points.length >= 3), `${locale} localizeProjects lost copy`);
  }
});

test('every experience has complete copy in every locale', () => {
  const experiences = getAllExperiences();
  assert.equal(experiences.length, 3, 'expected three experiences');
  for (const locale of locales) {
    for (const experience of experiences) {
      const entry = rawCopy(locale, 'experiences', experience.slug);
      for (const field of ['position', 'duration', 'summary']) {
        assert.ok(typeof entry[field] === 'string' && entry[field], `${locale} ${experience.slug} is missing ${field}`);
      }
      assert.ok(Array.isArray(entry.points) && entry.points.length >= 3, `${locale} ${experience.slug} needs at least 3 points`);
    }
    const localized = localizeExperiences(experiences, messages[locale]);
    assert.ok(localized.every((experience) => experience.summary && experience.points.length >= 3), `${locale} localizeExperiences lost copy`);
  }
});

test('every project live URL is a valid absolute URL', () => {
  for (const project of getAllProjects()) {
    if (project.liveUrl) assert.doesNotThrow(() => new URL(project.liveUrl as string), `${project.slug} liveUrl`);
  }
});

test('only projects marked featured are featured, and exactly three are', () => {
  const featured = getAllProjects().filter((project) => project.featured).map((project) => project.slug);
  assert.deepEqual(featured.sort(), ['comprehensive-monitoring-stack', 'hikcentral-remote-device-integration', 'jenkins-cicd-pipeline']);
});

test('the static education fallback matches the English messages', () => {
  const { education } = getProfile();
  const copy = (messages.en.data as Record<string, Record<string, Record<string, string>>>).education;
  for (const edu of education) {
    assert.equal(edu.institution, copy[edu.slug].institution, `${edu.slug} institution`);
    assert.equal(edu.degree, copy[edu.slug].degree, `${edu.slug} degree`);
  }
});

test('certifications have unique slugs, a way to verify each, and issue and expiry dates that are real and not in the future', () => {
  const { certifications } = getProfile();
  assert.ok(certifications.length > 0, 'no certifications');
  assert.equal(new Set(certifications.map((certification) => certification.slug)).size, certifications.length, 'duplicate slug');
  const urls = certifications.map((certification) => certification.url).filter(Boolean);
  assert.equal(new Set(urls).size, urls.length, 'duplicate url');
  const ids = certifications.map((certification) => certification.credentialId).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, 'duplicate credential id');
  const today = new Date().toISOString().slice(0, 10);
  for (const { slug, title, issuer, issued, expires, url, credentialId } of certifications) {
    assert.ok(slug && title.trim() && issuer.trim(), `${slug} needs a slug, a title and an issuer`);
    assert.ok(url || credentialId, `${slug} needs a verification url or a credential id`);
    if (url) {
      const { protocol, hostname } = new URL(url);
      assert.equal(protocol, 'https:', `${slug} url`);
      if (issuer === 'KodeKloud') assert.equal(hostname, 'learn.kodekloud.com', `${slug} url`);
    }
    if (expires) {
      assert.match(expires, /^\d{4}-\d{2}$/, `${slug} expires must be YYYY-MM`);
      assert.ok(expires > issued.slice(0, 7), `${slug} expires before it was issued`);
    }
    // KodeKloud uses the credential ID as the last path segment, so a mismatch means two entries were mixed up.
    if (credentialId && url) assert.ok(url.endsWith(`/${credentialId}`), `${slug} url does not point at its credential`);
    assert.match(issued, /^\d{4}-\d{2}(-\d{2})?$/, `${slug} issued must be YYYY-MM or YYYY-MM-DD`);
    // Round-tripping rejects dates such as 2026-13 or 2026-02-30, which Date either refuses or rolls over.
    const parsed = new Date(`${issued.length === 7 ? `${issued}-01` : issued}T00:00:00Z`);
    assert.ok(!Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(issued), `${slug} issued is not a real date`);
    assert.ok(issued <= today.slice(0, issued.length), `${slug} is issued in the future`);
  }
});
