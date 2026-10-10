// Merges the approved v2 copy patch (docs/superpowers/plans/2026-10-10-apple-redesign-v2-copy-patch/<locale>.json)
// into messages/<locale>.json. Additive: nothing is removed here (legacy keys go in the final prune task).
// Usage: node apply-copy.mjs <repoRoot>
import fs from 'node:fs';

const root = process.argv[2] ?? '.';
const patchDir = `${root}/docs/superpowers/plans/2026-10-10-apple-redesign-v2-copy-patch`;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Objects merge key by key; strings and arrays are replaced wholesale.
function merge(target, patch) {
  for (const [key, value] of Object.entries(patch)) {
    if (isObject(value) && isObject(target[key])) merge(target[key], value);
    else target[key] = value;
  }
}

for (const locale of ['en', 'ru', 'uz']) {
  const file = `${root}/messages/${locale}.json`;
  const messages = JSON.parse(fs.readFileSync(file, 'utf8'));
  merge(messages, JSON.parse(fs.readFileSync(`${patchDir}/${locale}.json`, 'utf8')));
  // ru and uz carry a stray fullDescription for this project that en never had; drop it so the three files stay in key parity.
  delete messages.data.projects['hikcentral-remote-device-integration'].fullDescription;
  // Same format as the existing files: 2-space indent, no trailing newline.
  fs.writeFileSync(file, JSON.stringify(messages, null, 2));
  console.log(`${locale}: merged`);
}
