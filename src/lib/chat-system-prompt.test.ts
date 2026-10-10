import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { SYSTEM_PROMPT } from './chat-system-prompt.ts';
import { getAllProjects, getProfile, stackRows } from './data.ts';

const messages = JSON.parse(readFileSync(new URL('../../messages/en.json', import.meta.url), 'utf8'));

const ROW_LABELS = {
  cloud: 'Cloud',
  containers: 'Containers',
  cicd: 'CI/CD',
  observability: 'Observability',
  systems: 'Systems',
  data: 'Data',
  scripting: 'Scripting',
} as const;

// Skills the site dropped in v2 (the list in data.test.ts, minus Git, YAML and JSON, which are real project technologies).
const CUT_SKILLS = [
  'Azure', 'Alibaba Cloud', 'DigitalOcean', 'Kubernetes', 'Podman', 'Containerd', 'Helm', 'Terraform', 'Ansible', 'Pulumi',
  'CloudFormation', 'ARM Templates', 'CDK', 'CircleCI', 'Azure DevOps', 'ArgoCD', 'Elasticsearch', 'DynamoDB',
];

const lines = SYSTEM_PROMPT.split('\n');

/** The lines between a heading such as "SKILLS" and the next blank line. */
function blockAfter(heading: RegExp): string[] {
  const start = lines.findIndex((line) => heading.test(line));
  assert.ok(start >= 0, `prompt has no ${heading} heading`);
  const end = lines.findIndex((line, index) => index > start && line.trim() === '');
  return lines.slice(start + 1, end === -1 ? undefined : end).map((line) => line.trim());
}

const NOT_AWS_CERTIFIED = /\bnot AWS certified\b/gi;

/** A certificate's date the way the prompt writes it: "September 2, 2026", or "September 2026" for a YYYY-MM date. */
function issuedLabel(issued: string): string {
  const monthOnly = issued.length === 7;
  const format = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...(monthOnly ? { month: 'long', year: 'numeric' } : { dateStyle: 'long' }) });
  return format.format(new Date(`${monthOnly ? `${issued}-01` : issued}T00:00:00Z`));
}

test('the prompt never claims an AWS certification', () => {
  const disclaimer = lines.filter((line) => line.search(NOT_AWS_CERTIFIED) >= 0);
  assert.equal(disclaimer.length, 1, 'prompt should say once that he is not AWS certified');
  assert.ok(blockAfter(/^CERTIFICATIONS\b/).includes(disclaimer[0].trim()), 'the disclaimer belongs in the CERTIFICATIONS block');
  // Only the negation itself is exempt, so a claim added to the disclaimer line still fails.
  const claims = SYSTEM_PROMPT.replace(NOT_AWS_CERTIFIED, '');
  assert.ok(!/AWS Certified|Cloud Practitioner|Solutions Architect|DevOps Engineer Professional/i.test(claims), 'prompt claims an AWS certification');
});

test('the CERTIFICATIONS block is exactly the certificates on the site', () => {
  const block = blockAfter(/^CERTIFICATIONS\b/);
  const listed = block.filter((line) => line.search(NOT_AWS_CERTIFIED) < 0);
  const expected = getProfile().certifications.map(({ title, issuer, issued }) => `- ${title} (${issuer}, ${issuedLabel(issued)})`);
  assert.deepEqual(listed, expected);
  const elsewhere = lines.filter((line) => !block.includes(line.trim())).join('\n');
  assert.ok(!/certified|certificate|IELTS|British Council/i.test(elsewhere), 'prompt names a certificate outside the CERTIFICATIONS block');
});

test('the SKILLS block is exactly the stack on the site', () => {
  const { stack } = getProfile();
  const expected = stackRows.map((row) => `${ROW_LABELS[row]}: ${stack[row].join(', ')}`);
  assert.deepEqual(blockAfter(/^SKILLS\b/), expected);
});

test('each project lists exactly the technologies shown on its page', () => {
  const listed = lines
    .map((line) => /^\s*- EXACT Technologies Used: (.*)$/.exec(line)?.[1])
    .filter((value): value is string => value !== undefined);
  const expected = getAllProjects().map((project) => project.technologies.join(', '));
  assert.deepEqual([...listed].sort(), [...expected].sort());
});

test('no skill the site dropped appears outside the NOT USED lines and the do-not-hallucinate rules', () => {
  const claims = lines.filter((line) => !/NOT USED/.test(line) && !/^1[34]\. /.test(line)).join('\n');
  for (const skill of CUT_SKILLS) {
    const pattern = new RegExp(`(^|[^\\w])${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\w])`);
    assert.ok(!pattern.test(claims), `${skill} appears in the prompt as a claim`);
  }
});

test('every percentage and dollar figure in the prompt is on the site', () => {
  const figures = (text: string) => new Set(text.match(/\d+(?:\.\d+)?%|\$\d+K/g) ?? []);
  const onSite = figures(JSON.stringify(messages.data));
  for (const figure of figures(SYSTEM_PROMPT)) assert.ok(onSite.has(figure), `${figure} is in the prompt but not in the site copy`);
});

test('languages and their levels match the site', () => {
  for (const { name, level } of getProfile().languages) {
    const label = messages.about.languages.level[level];
    assert.ok(lines.some((line) => line.trim() === `- ${name}: ${label}`), `prompt is missing "${name}: ${label}"`);
  }
});

test('the prompt carries none of the stale claims', () => {
  for (const stale of ['kpi.com', '2+ years', 'English: Fluent', 'Russian: Native']) {
    assert.ok(!SYSTEM_PROMPT.includes(stale), `stale text still in prompt: ${stale}`);
  }
});
