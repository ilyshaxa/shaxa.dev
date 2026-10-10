// Interaction checks that screenshots can't show: rapid toggles end in the state of the last input, the language
// switch works, the theme toggle flips, and Escape closes the mobile sheet.
// Usage: node interact.mjs <baseUrl>      e.g. node interact.mjs http://localhost:3100
// Exit code is 1 if any check fails.
import { createRequire } from 'node:module';

const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const base = process.argv[2];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
let failures = 0;
const report = (ok, message) => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`);
};

// Mobile nav sheet: five fast taps leave it open, one more closes it, Escape also closes it.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/en`, { waitUntil: 'networkidle' });
  const burger = page.locator('button[aria-controls="mobile-nav"]');
  for (let i = 0; i < 5; i += 1) await burger.click({ delay: 0 });
  await page.waitForTimeout(700);
  report((await burger.getAttribute('aria-expanded')) === 'true', 'mobile nav: five fast taps end open');
  report(await page.locator('#mobile-nav').isVisible(), 'mobile nav: sheet is visible after five taps');
  await burger.click();
  await page.waitForTimeout(700);
  report((await burger.getAttribute('aria-expanded')) === 'false', 'mobile nav: sixth tap closes');
  report((await page.locator('#mobile-nav').count()) === 0, 'mobile nav: sheet is removed after closing');
  await burger.click();
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  report((await burger.getAttribute('aria-expanded')) === 'false', 'mobile nav: Escape closes');
  await context.close();
}

// Desktop: chat launcher, language switch, theme toggle.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto(`${base}/en`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  const launcher = page.locator('button[aria-label*="chat assistant" i]').first();
  report((await launcher.count()) === 1, 'chat: launcher is present');
  await launcher.click({ delay: 0 });
  await launcher.click({ delay: 0 });
  await page.waitForTimeout(700);
  report(/open/i.test((await launcher.getAttribute('aria-label')) ?? ''), 'chat: two fast clicks end closed (launcher offers to open)');
  await launcher.click();
  await page.waitForTimeout(700);
  report(/close/i.test((await launcher.getAttribute('aria-label')) ?? ''), 'chat: third click opens');
  await launcher.click();
  await page.waitForTimeout(500);

  const wasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await page.locator('button[aria-label*="mode" i]').first().click();
  await page.waitForTimeout(600);
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  report(wasDark !== isDark, 'theme: toggle flips the dark class');

  await page.locator('button[aria-label="Change language"]').click();
  await page.getByRole('menuitem', { name: /Русский/ }).click();
  await page.waitForURL(/\/ru(\/|$)/, { timeout: 5000 }).catch(() => {});
  report(/\/ru(\/|$)/.test(page.url()), `language: switched to ru (${page.url()})`);
  await context.close();
}

await browser.close();
process.exit(failures ? 1 : 0);
