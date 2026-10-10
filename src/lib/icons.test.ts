import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../../', import.meta.url);
const pngSize = (file: string) => {
  const png = readFileSync(new URL(`public${file}`, root));
  assert.equal(png.subarray(1, 4).toString('latin1'), 'PNG', `${file} is not a PNG`);
  return `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`;
};

test('every manifest icon exists and is really the size it declares', () => {
  const manifest = JSON.parse(readFileSync(new URL('public/site.webmanifest', root), 'utf8'));
  assert.ok(manifest.icons.length > 0);
  for (const icon of manifest.icons) {
    assert.equal(icon.type, 'image/png', icon.src);
    assert.equal(pngSize(icon.src), icon.sizes, icon.src);
  }
  // Chrome needs a 192 and a 512 icon to offer installation.
  const declared = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
  assert.ok(declared.includes('192x192') && declared.includes('512x512'));
});

test('every PNG icon declared in the root layout metadata is really the size it declares', () => {
  const source = readFileSync(new URL('src/app/layout.tsx', root), 'utf8');
  const icons = [...source.matchAll(/url: '([^']+\.png)', type: 'image\/png', sizes: '(\d+x\d+)'/g)];
  assert.ok(icons.length >= 5, 'expected the PNG icon entries in src/app/layout.tsx');
  for (const [, url, sizes] of icons) assert.equal(pngSize(url), sizes, url);
  assert.equal(pngSize('/apple-touch-icon.png'), '180x180');
});

test('/favicon.ico has one source (src/app/favicon.ico) and the layout does not link it a second time', () => {
  assert.ok(existsSync(new URL('src/app/favicon.ico', root)));
  assert.ok(!existsSync(new URL('public/favicon.ico', root)));
  assert.ok(!/url: '\/favicon\.ico'/.test(readFileSync(new URL('src/app/layout.tsx', root), 'utf8')));
});
