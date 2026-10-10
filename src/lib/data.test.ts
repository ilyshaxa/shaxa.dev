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
      // Read the message entry directly: localizeProjects may fall back to English text, which would hide a gap.
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

test('only projects marked featured are featured, and exactly three are', () => {
  const featured = getAllProjects().filter((project) => project.featured).map((project) => project.slug);
  assert.deepEqual(featured.sort(), ['comprehensive-monitoring-stack', 'hikcentral-remote-device-integration', 'jenkins-cicd-pipeline']);
});
