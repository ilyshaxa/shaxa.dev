# CV remake: design

Date: 2026-11-25. Status: awaiting approval.

## Intent and why

Shaxriyor is open to work and finds the current CV unprofessional. It is a two-page LaTeX "RenderCV" file with
a centered serif header, 18 dense bullets, and a second page that is mostly empty. It also looks nothing like the
redesigned site. The new CV must get him interviews with **local (Uzbekistan) companies** for **DevOps / Cloud
Engineer** and **System Administrator** roles, on-site, hybrid or remote.

## Goals

- One page per language (en, ru, uz), single column, text-based PDF that hiring software and `hh.uz` parsers read in order.
- Header names both target titles: "DevOps / Cloud Engineer · System Administrator".
- Photo (head centered, tight crop), top right, from `/home/ilyshaxa/Pictures/corporate-me.jpeg` (1792x2400, head about 650 px wide, never upscaled).
- Contact line: Tashkent, email, phone, Telegram `@shaxadev`, LinkedIn, GitHub, shaxa.dev.
- Visual language shared with the site: Inter (incl. Cyrillic), restrained single accent, generous but tight spacing.
- Strongest real outcomes first; about 4-5 bullets per role instead of 8.
- Skills grouped the way local job posts group them (Cloud, CI/CD, Observability, Linux & infrastructure, Databases, Scripting).
- Source stays in the repo and the three PDFs rebuild with one command.

## Non-goals

- No change to the website UI, copy, chatbot or the homepage avatar.
- No second layout (no sidebar, no multi-page variant).
- No English-first "international" tailoring; local market is the target.

## Anti-goals (failure even if it renders)

- Any claim, metric, tool, certificate or project the CV owner has not actually earned. This includes plausible additions "that fit the stack". Items are only reworded, reordered, grouped or cut.
- Two columns or text inside images that scramble a parser's reading order.
- A page that overflows to two pages in any language (Russian runs longest).
- Contradicting the website. The facts rule in `.claude/CLAUDE.md` still holds: every figure on the CV (60%, 20%, 50%, 99.9%, 15%, $100K, $10K) is already on the site, and nothing site-only is added.
- Claiming an AWS certification (not certified).

## Constraints

- Facts come from `public/tex/en.tex`, `src/lib/data.ts` and `messages/*.json`.
- KPI role is full-time (May 2023 - Oct 2026). PraaktisGo is **part-time** (Jan 2025 - Jul 2026) and is labeled so, so the overlap reads as intentional. DataSite is an internship (Sep 2022 - May 2023). Education: TSUE, Economics, 2022 - 2027.
- Languages: Uzbek (native), English (C1), Russian (A1). The Russian CV should say so honestly.
- No LaTeX on this machine; Chrome (`/usr/bin/google-chrome`) is available. Playwright is not installed (see memory); use Chrome headless directly or `playwright-core` from a scratch directory.
- Russian and Uzbek translations are written by Claude and reviewed by the owner before they ship.

## Approaches considered

1. **One page, single column (chosen).** Most robust for parsers and for recruiters skimming on `hh.uz` or Telegram. Photo is a small block at the top right and easy to drop.
2. One page, two columns with a sidebar. Looks more designed and is common locally, but some parsers interleave the columns, and it forces harder cuts.
3. Two pages, single column. Keeps every bullet but page 2 is rarely read; it is what exists today.

Tooling, decided by Claude as the owner delegated it: **HTML/CSS printed to PDF with headless Chrome**, not LaTeX in Docker. No large install, shares fonts and colours with the site, handles Cyrillic and the Uzbek apostrophes (oʻ, gʻ) without package fiddling, and produces tagged text PDFs.

## Design

- `cv/` (new top-level folder, not served): `template.html`, `cv.css`, `content/{en,ru,uz}.json`, `photo.jpg` (cropped), `build.mjs`.
- `build.mjs` renders each locale to `public/cv/shaxriyor-jabborov-cv-<locale>.pdf` (same file names, so `cv-menu.tsx` is untouched) and fails if any PDF is not exactly one page.
- Sections in order: header (name, titles, contact, photo), Summary (3 lines), Experience, Skills, Education, Languages.
- Experience entries: role, company, "Full-time" / "Part-time", dates right aligned, then bullets. Order: KPI, PraaktisGo, DataSite.
- Fonts embedded in the PDF; links are real hyperlinks; document title and author set.
- `public/tex/` (publicly downloadable LaTeX sources) and the old PDFs are replaced; the `.tex` files are deleted since the HTML source supersedes them.
- Tests: a small test checks that each content file has the same keys and bullet counts across locales and that every number on the CV appears in the site messages (extends the existing facts guard). The build's one-page check is the layout test.

## Left to the builder

- Exact font sizes, spacing, accent colour (derive from the site's tokens), the crop of the photo (center on the head silhouette, eyes about 44% from the top, preview before committing).
- Which 4-5 bullets per role survive and their final wording, within the facts above. Fewer than 4 is fine if the page is tight.
- How Inter is obtained for Chrome (local file or bundled font package), as long as it is embedded.
- The Summary wording per language.

## Open item

Depth for system-administrator keywords (scale of servers or environments, backups, access management, VPN, firewall, team size) is not yet provided. The first build uses only what the current CV and site already state. If the owner supplies real details later they slot into the bullets without layout changes.
