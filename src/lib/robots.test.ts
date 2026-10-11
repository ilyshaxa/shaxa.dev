import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { GET } from '../app/robots.txt/route.ts';
import { buildRobotsTxt } from './robots.ts';

type Line = [field: string, value: string];

/** The lines of the group that applies to every crawler (`User-Agent: *`); groups are separated by blank lines. */
function wildcardGroup(text: string): Line[] {
  const groups = text.split(/\n\s*\n/).map((block) =>
    block.split('\n').filter(Boolean).map((line): Line => {
      const at = line.indexOf(':');
      return [line.slice(0, at).trim().toLowerCase(), line.slice(at + 1).trim()];
    }),
  );
  const group = groups.find((lines) => lines.some(([field, value]) => field === 'user-agent' && value === '*'));
  assert.ok(group, 'robots.txt has no group for User-Agent: *');
  return group;
}

const valuesOf = (group: Line[], field: string) => group.filter(([name]) => name === field).map(([, value]) => value);

test('every crawler may read the site but not /api/', () => {
  const group = wildcardGroup(buildRobotsTxt('https://shaxa.dev'));
  assert.deepEqual(valuesOf(group, 'allow'), ['/']);
  assert.deepEqual(valuesOf(group, 'disallow'), ['/api/']);
});

test('the * group declares the content signals: search and AI answers yes, training no', () => {
  const signals = valuesOf(wildcardGroup(buildRobotsTxt('https://shaxa.dev')), 'content-signal');
  assert.equal(signals.length, 1);
  const declared = Object.fromEntries(signals[0].split(',').map((pair) => pair.trim().split('=')));
  assert.deepEqual(declared, { search: 'yes', 'ai-input': 'yes', 'ai-train': 'no' });
});

test('the sitemap line names the domain it is given', () => {
  assert.match(buildRobotsTxt('https://example.test'), /^Sitemap: https:\/\/example\.test\/sitemap\.xml$/m);
});

test('GET /robots.txt serves the file as plain text for the primary domain', async () => {
  const response = GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /^text\/plain\b/);
  const body = await response.text();
  assert.match(body, /^User-Agent: \*$/m);
  assert.match(body, /^Sitemap: https:\/\/shaxa\.dev\/sitemap\.xml$/m);
});

test('robots.txt has one source: public/robots.txt would shadow the route, src/app/robots.ts would collide with it', () => {
  assert.ok(!existsSync(new URL('../../public/robots.txt', import.meta.url)));
  assert.ok(!existsSync(new URL('../app/robots.ts', import.meta.url)));
});
