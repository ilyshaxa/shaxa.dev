// Layout probe: shared left edge, section rhythm and horizontal overflow, at 1440 and 390.
// Usage: node probe.mjs <baseUrl> <path> [path...]     e.g. node probe.mjs http://localhost:3100 /en /ru /uz
// Needs the global Playwright install and the pre-installed Chromium (see the plan's "Verification conventions").
// Exit code is 1 if any check fails.
import { createRequire } from 'node:module';

const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const [base, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const widths = [
  { name: '1440', viewport: { width: 1440, height: 900 }, gap: 112 },
  { name: '390', viewport: { width: 390, height: 844 }, gap: 80 },
];

let failures = 0;
const report = (ok, message) => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`);
};

for (const { name, viewport, gap } of widths) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  for (const path of paths) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const result = await page.evaluate(() => {
      const left = (element) => Math.round(element.getBoundingClientRect().left * 10) / 10;
      const h1 = document.querySelector('main h1');
      const sections = [...document.querySelectorAll('main > div > div > section')];
      return {
        lefts: {
          wordmark: left(document.querySelector('nav a')),
          // A page title inside a <header> (detail pages put a logo tile before it) is measured by the header's edge.
          ...(h1 ? { h1: left(h1.closest('header') ?? h1) } : {}),
          footer: left(document.querySelector('footer p')),
          // Section headings only (title-2 and up, not inside a link): caption headings in a detail page's aside sit in
          // column two, and project tile titles are headings inside their tile link.
          ...Object.fromEntries(
            [...document.querySelectorAll('main h2')]
              .filter((heading) => parseFloat(getComputedStyle(heading).fontSize) >= 20 && !heading.closest('a'))
              .map((heading, i) => [`h2#${i}`, left(heading)])
          ),
        },
        gaps: sections
          .slice(1)
          .map((section, i) => Math.round(section.getBoundingClientRect().top - sections[i].getBoundingClientRect().bottom)),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    const values = Object.values(result.lefts);
    report(Math.max(...values) - Math.min(...values) <= 1, `${name} ${path} shared left edge ${JSON.stringify(result.lefts)}`);
    if (result.gaps.length) report(result.gaps.every((g) => g === gap), `${name} ${path} section gaps [${result.gaps}] (expected ${gap})`);
    report(!result.overflow, `${name} ${path} no horizontal scroll`);
  }
  await context.close();
}

await browser.close();
process.exit(failures ? 1 : 0);
