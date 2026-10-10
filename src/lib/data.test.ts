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

test('every project has four highlights and complete copy in every locale', () => {
  for (const locale of locales) {
    const projects = localizeProjects(getAllProjects(), messages[locale]);
    assert.equal(projects.length, 4);
    for (const project of projects) {
      const where = `${locale} ${project.slug}`;
      assert.equal(project.highlights.length, 4, `${where} highlights`);
      assert.ok(project.title && project.summary && project.companyName, `${where} title, summary, companyName`);
      assert.ok(project.points.length >= 3, `${where} points`);
      assert.ok(project.technologies.length > 0, `${where} technologies`);
    }
  }
});

test('every experience has complete copy in every locale', () => {
  for (const locale of locales) {
    const experiences = localizeExperiences(getAllExperiences(), messages[locale]);
    assert.equal(experiences.length, 3);
    for (const experience of experiences) {
      const where = `${locale} ${experience.slug}`;
      assert.ok(experience.position && experience.duration && experience.summary, `${where} position, duration, summary`);
      assert.ok(experience.points.length >= 3, `${where} points`);
    }
  }
});

test('only projects marked featured are featured, and exactly three are', () => {
  const featured = getAllProjects().filter((project) => project.featured).map((project) => project.slug);
  assert.deepEqual(featured.sort(), ['comprehensive-monitoring-stack', 'hikcentral-remote-device-integration', 'jenkins-cicd-pipeline']);
});
