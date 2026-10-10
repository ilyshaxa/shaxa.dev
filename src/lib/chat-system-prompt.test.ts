import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SYSTEM_PROMPT } from './chat-system-prompt.ts';
import { getAllProjects, getProfile, stackRows } from './data.ts';

const ROW_LABELS = {
  cloud: 'Cloud',
  containers: 'Containers',
  cicd: 'CI/CD',
  observability: 'Observability',
  systems: 'Systems',
  data: 'Data',
  scripting: 'Scripting',
} as const;

test('the prompt never claims a certification', () => {
  assert.ok(!/AWS Certified/.test(SYSTEM_PROMPT), 'prompt mentions an AWS Certified title');
  assert.ok(/not AWS certified/i.test(SYSTEM_PROMPT), 'prompt should say he is not AWS certified');
});

test('the SKILLS block is exactly the stack on the site', () => {
  const { stack } = getProfile();
  for (const row of stackRows) {
    assert.ok(SYSTEM_PROMPT.includes(`${ROW_LABELS[row]}: ${stack[row].join(', ')}`), `SKILLS line for ${row} is out of date`);
  }
});

test('each project lists exactly the technologies shown on its page', () => {
  for (const project of getAllProjects()) {
    assert.ok(
      SYSTEM_PROMPT.includes(`EXACT Technologies Used: ${project.technologies.join(', ')}`),
      `${project.slug} technology list is out of date in the prompt`
    );
  }
});

test('the prompt carries none of the stale claims', () => {
  for (const stale of ['kpi.com', '2+ years', 'Containers: Docker, Kubernetes', 'Infrastructure: Terraform', 'English: Fluent', 'Russian: Native']) {
    assert.ok(!SYSTEM_PROMPT.includes(stale), `stale text still in prompt: ${stale}`);
  }
});
