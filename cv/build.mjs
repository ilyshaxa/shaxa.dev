// Builds public/cv/shaxriyor-jabborov-cv-<locale>.pdf from cv/content/<locale>.json.
// Usage: node cv/build.mjs [en|ru|uz ...]   (no arguments builds all three; needs Google Chrome)
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const repo = join(root, '..');
const LOCALES = ['en', 'ru', 'uz'];
const CHROME = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const FONT_FILES = ['latin', 'latin-ext', 'cyrillic'].map((s) => `inter-${s}-wght-normal.woff2`);

const escapeHtml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Renders one locale's CV as a complete HTML document (fonts, stylesheet and photo are referenced relatively). */
export function renderHtml(c) {
  const e = escapeHtml;
  const { contact: k, labels: l } = c;
  const link = (href, text) => `<a href="${e(href)}">${e(text)}</a>`;
  // Two fixed rows, so a separator never dangles at a line break.
  const contact = [
    [
      `<span>${e(k.location)}</span>`,
      link(`mailto:${k.email}`, k.email),
      link(`tel:${k.phone.replace(/[^\d+]/g, '')}`, k.phone),
      link(`https://t.me/${k.telegram.replace(/^@/, '')}`, k.telegram),
    ],
    [link(`https://${k.linkedin}`, k.linkedin), link(`https://${k.github}`, k.github), link(`https://${k.site}`, k.site)],
  ];
  const role = (x) => `
    <article class="job">
      <div class="job-head">
        <h3><span class="role">${e(x.role)}</span><span class="company">${e(x.company)}</span><span class="badge">${e(l[x.type])}</span></h3>
        <span class="dates">${e(x.dates)}</span>
      </div>
      <ul>${x.bullets.map((b) => `<li>${e(b)}</li>`).join('')}</ul>
    </article>`;
  const skills = c.skills
    .map((s) => `<dt>${e(s.label)}</dt><dd>${s.items.map(e).join(', ')}</dd>`)
    .join('');
  const body = `
  <header class="top">
    <div class="id">
      <h1>${e(c.name)}</h1>
      <p class="titles">${e(c.titles)}</p>
      ${contact.map((row) => `<p class="contact">${row.join('')}</p>`).join('')}
    </div>
    <img class="photo" src="photo.jpg" alt="">
  </header>
  <section><h2>${e(l.summary)}</h2><p class="summary">${e(c.summary)}</p></section>
  <section><h2>${e(l.experience)}</h2>${c.experience.map(role).join('')}</section>
  <section><h2>${e(l.skills)}</h2><dl class="skills">${skills}</dl></section>
  <section class="pair">
    <div><h2>${e(l.education)}</h2>
      <div class="job-head"><p><strong>${e(c.education.school)}</strong><br>${e(c.education.degree)}</p><span class="dates">${e(c.education.dates)}</span></div>
    </div>
    <div><h2>${e(l.languages)}</h2><p>${c.languages.map(e).join('<br>')}</p></div>
  </section>`;
  return readFileSync(join(root, 'template.html'), 'utf8')
    .replace('{{lang}}', e(c.lang))
    .replace('{{title}}', `${e(c.name)} – ${e(l.cv)}`)
    .replace('{{author}}', e(c.name))
    .replace('{{body}}', body);
}

/** Counts the page objects of a PDF (Chrome writes them uncompressed as "/Type /Page"). */
export function countPages(pdf) {
  return (pdf.toString('latin1').match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
}

function fontFaces() {
  const ranges = {
    latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
    'latin-ext': 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
    cyrillic: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116',
  };
  return Object.entries(ranges)
    .map(([s, r]) => `@font-face{font-family:"Inter";font-weight:100 900;font-style:normal;src:url(inter-${s}-wght-normal.woff2) format("woff2");unicode-range:${r}}`)
    .join('\n');
}

function build(locale) {
  const content = JSON.parse(readFileSync(join(root, 'content', `${locale}.json`), 'utf8'));
  const dir = mkdtempSync(join(tmpdir(), `cv-${locale}-`));
  try {
    writeFileSync(join(dir, 'index.html'), renderHtml(content));
    writeFileSync(join(dir, 'cv.css'), `${fontFaces()}\n${readFileSync(join(root, 'cv.css'), 'utf8')}`);
    copyFileSync(join(root, 'photo.jpg'), join(dir, 'photo.jpg'));
    for (const f of FONT_FILES) copyFileSync(join(repo, 'node_modules/@fontsource-variable/inter/files', f), join(dir, f));
    const out = join(repo, 'public/cv', `shaxriyor-jabborov-cv-${locale}.pdf`);
    const draft = join(dir, 'draft.pdf');
    mkdirSync(dirname(out), { recursive: true });
    const run = spawnSync(
      CHROME,
      ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=5000', `--print-to-pdf=${draft}`, pathToFileURL(join(dir, 'index.html')).href],
      { encoding: 'utf8' },
    );
    if (run.status !== 0) throw new Error(`Chrome failed for ${locale}: ${run.stderr}`);
    const pages = countPages(readFileSync(draft));
    if (pages !== 1) throw new Error(`${locale} CV is ${pages} pages, expected 1`);
    copyFileSync(draft, out); // only a one-page PDF replaces the shipped file
    console.log(`${locale}: ${out} (1 page)`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const wanted = process.argv.slice(2);
  const targets = wanted.length ? wanted : LOCALES;
  for (const t of targets) if (!LOCALES.includes(t)) throw new Error(`unknown locale "${t}"`);
  let failed = false;
  for (const t of targets) {
    try { build(t); } catch (error) { failed = true; console.error(String(error.message ?? error)); }
  }
  process.exit(failed ? 1 : 0);
}
