// Usage: node shoot.mjs <outDir> <baseUrl> <path> [path...]
// Captures every combination of 1440/390 x light/dark for each path, plus a chat-launcher check.
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [outDir, base, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const sizes = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
for (const [sizeName, viewport] of Object.entries(sizes)) {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    for (const p of paths) {
      await page.goto(base + p, { waitUntil: 'networkidle' });
      // Scroll through once so lazy images and any in-view reveals have fired, then return to top.
      await page.evaluate(async () => {
        const step = Math.max(300, Math.floor(window.innerHeight * 0.8));
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      const name = `${p.replace(/\//g, '_').replace(/^_/, '') || 'root'}-${sizeName}-${scheme}`;
      await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
      console.log(name, 'noHorizontalScroll=' + overflow);
    }
    await ctx.close();
  }
}
// Chat launcher: appears 2s after load.
const ctx = await browser.newContext({ viewport: sizes.desktop });
const page = await ctx.newPage();
await page.goto(base + paths[0], { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
const launcher = await page.locator('button[aria-label*="chat" i]').count();
console.log('chat launcher buttons found:', launcher);
await browser.close();
