# Apple Redesign v2 (Editorial Restructure) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. If those skills are unavailable, follow "Execution protocol" below, which is the same process. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change what is on shaxa.dev and how it is arranged, so it reads as a specific, professional portfolio instead of a template: one 980px grid, left-aligned sentence-case type, five home blocks, project and job write-ups rewritten from the CV and existing site facts, and no claim the CV does not support (notably "AWS Certified"). The v1 token, type, motion and primitive layers stay.

**Architecture:** Land the approved copy in `messages/*.json` first (additive, guarded by tests), then add the data layer additively, then rebuild each surface on a new grid (`page-container` + `section-stack`) in this order: chrome, Home, Projects, About and experience detail, Contact, 404s, SEO and chatbot facts. Only after every consumer is rebuilt, a final prune task deletes the legacy fields, components, YAML, certification badges and dead message keys. Every task leaves the site building and working; only the *final* state is visually verified.

**Tech Stack:** Next.js 15.5 (App Router, Turbopack), React 19, TypeScript 5.9, Tailwind CSS 4.1, framer-motion 12, next-intl 4, Radix/shadcn, Node's built-in test runner (`npm test`).

**Spec:** `docs/superpowers/specs/2026-10-10-apple-redesign-v2-design.md` (approved).
**Copy:** `docs/superpowers/specs/2026-10-10-apple-redesign-v2-copy.md` (approved; the three **[confirm]** items ship as written because the spec and deck were approved without changes. If any is wrong, edit `messages/*.json` and the deck, it is a one-line change).
**Machine-readable copy:** `docs/superpowers/plans/2026-10-10-apple-redesign-v2-copy-patch/{en,ru,uz}.json`, generated from the deck's tables. Task 1 merges them by script, so no string is retyped by hand.
**Validated before approval:** every whole-file code block in this plan was extracted into a throwaway copy of the repo in the scratchpad (outside the repo), the plan's partial edits and message migration were applied to it as written, and that final state passed `tsc --noEmit`, `npm test` (29/29), `npm run lint` (0 warnings), `npm run build`, the layout probe (68 checks across 14 pages, three locales, 1440 and 390) and the interaction checks (10). Screenshots of it showed two defects, both fixed in this plan: stray leading dots in wrapped lists, and the HikGateway light-theme image path. The intermediate state after Tasks 1–3 (the riskiest transitional step, the additive `data.ts` split) was validated the same way (`tsc`, 26/26 tests, lint, build). The states between Tasks 4–10 were *not* built separately; each task's own checks do that during execution.
**Tools:** `docs/superpowers/plans/2026-10-10-apple-redesign-v2-tools/` (`apply-copy.mjs`, `dead-keys.mjs`, `shoot.mjs`, `probe.mjs`, `interact.mjs`), all tested before this plan was written.

**Baseline (verified 2026-10-10 on `apple-redesign` @ `160d806`, Node 22.22, after `npm ci`):** `npm test` 19/19, `npm run lint` 0 errors and 0 warnings, `npm run build` passes. Message files round-trip byte-identically through `JSON.stringify(obj, null, 2)` (no trailing newline) and are in key parity except one stray RU/UZ key that Task 1 removes. The layout probe fails on v1 as expected: left edges of 152/359/495/336px on four elements at 1440, and 0px between sections. All interaction checks pass on v1 and must keep passing.

## Spec deviations and additions (flagged for your review)

1. **`about.headings.*`, not `about.sections.*`.** The legacy `about.sections.<name>` entries are objects; the deck's heading strings would collide with them during the additive merge. They are renamed in the patch.
2. **Language names in menus come from `languageNames` in `src/types/i18n.ts`** (already endonyms), not from message keys. `navigation.languageNames.*` stays because the CV-downloaded toast uses it inside a sentence (RU needs the prepositional case there).
3. **Per-project `status` leaves the messages.** `status` stays the static key (`'Completed'`); labels come from `projects.status.*`. (The spec's data-model section listed `status` under messages.)
4. **Degree text** uses the existing `data.education.tsue-economics.degree` key (patched), not a new `about.education.degree` key.
5. **CV menu also drops its flag emoji**, for consistency with the language control.
6. **Contact method icons become neutral tiles** (`bg-background`, muted icon) instead of blue squares, matching the "one accent" rule.
7. **The contact sentence uses an ICU tag** (`<mail>{address}</mail>`), because next-intl's `t.rich` only accepts strings and tag functions as values. The deck row was updated to match.
8. **Additions the spec's goals imply** (each is small; veto any): fix the HikGateway project's light-theme image path (`…integrationsvg`, missing a dot, a broken image in light mode since v1); delete the stale, unloaded `src/data/*.yaml` files (they still contain AWS-certificate entries, "Russian: Native" and placeholder projects) and correct `.claude/CLAUDE.md`'s "Content pipeline"; delete the five unused AWS/IELTS badge PNGs in `public/images/certifications/` (they are publicly served URLs for certifications that were not earned); rewrite the root `src/app/not-found.tsx` (it jokes about "DevOps best practices" and says "Page Not Found"); replace SEO keywords and JSON-LD `knowsAbout` that name cut skills (Kubernetes, Azure, Terraform, Ansible); trim padding from two project technology lists ("Monitoring", "Observability", "Log Aggregation", "Alerting", "Metrics Collection" and a duplicate "TLS Encryption"); point the X link at `https://x.com/ilyshaxa`; translate the scroll-to-top label with its existing key; drop the unused `flagcdn.com` image host.
9. **`metadata.about/projects/contact.*` stay** even though no code reads them today (those pages are client components and cannot export metadata). Wiring per-page metadata is out of scope.
10. **Three new test files** (`messages.test.ts`, `data.test.ts`, `chat-system-prompt.test.ts`) keep the content consistent so the contradictions this redesign removes cannot creep back.

## Global constraints

- Work on branch `apple-redesign`, one commit per task (fix waves are separate commits). End every commit message with these two lines, and no model identifier anywhere else in the repo:
  ```
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_015t6NroevzsuvMLcRgmvr2D
  ```
- Never merge to or push `main`. Push only `apple-redesign`. Don't stage `.claude/settings.local.json` if it exists.
- **No new npm dependencies.** Don't run `npm install`, `npm uninstall` or touch `package-lock.json`.
- **Grid:** content width is 980px with gutters of 20px (< 768) and 32px (≥ 768), applied only through the `page-container` utility. **Rhythm:** sections are separated only by the `section-stack` gap token (80 / 112px) and carry no vertical padding of their own. Nothing else sets a max-width on page content.
- **Type:** page titles `text-title-1`; section headings `text-title-2`; the hero name is the only `text-display`; no `text-3xl`-style sizes. **No section subtitles.** Sentence case everywhere in new text.
- **Color:** blue only for links, primary buttons, focus. No per-category icon tints. Status dot colors stay.
- **Motion:** keep v1's rules (springs from `lib/motion.ts`, opacity-only fades ≤ 250ms, 100ms CSS press scale, no `hover:scale-*`). Remove scroll-triggered reveals from page sections; the hero keeps its one entrance.
- Never stack one `material-*` surface on another. Primary controls ≥ 44px; `sm` / `default` buttons (32 / 40px) only for secondary controls (v1 ruling).
- Every user-facing string exists in `messages/en.json`, `ru.json` and `uz.json`. Edit the JSON only with a script that writes `JSON.stringify(obj, null, 2)` with no trailing newline.
- The homepage avatar keeps its file, crop, `object-cover`, `quality={75}` and blur placeholder; only its wrapper size changes (`size-28` below `md`, `size-[270px]` from `md`).
- CLAUDE.md conventions: no barrel exports; server components by default. **Any component imported directly by a server component (the locale layout) that uses next-intl hooks must keep `'use client'`** (`Footer`, `ScrollToTop`, `Navigation`), so rendering mode doesn't change.
- Tailwind 4 animates `scale` / `translate` as separate properties: arbitrary transition lists name `scale`, not `transform`.
- **Intermediate states:** between tasks, pages that haven't been rebuilt yet may show small blemishes (English-only status text on the old project page, a legacy heading). Only `npm test`, `npm run lint` and `npm run build` must be green at every commit. The end state is verified in Task 12.
- Every subagent runs on **Sonnet 5.5** (`model: "sonnet"`).

## Review focus

Inputs most likely to bite real users that the spec implies but doesn't spell out. Each has a check in the task that owns it.

1. **Long Russian and Uzbek strings at 390px**: project summaries and bullets, experience rows, the mobile nav sheet's language buttons, the contact form. `probe.mjs` must report no horizontal scroll for `/en`, `/ru`, `/uz` on every page. Owned by Tasks 4–8, 12.
2. **Shared left edge and rhythm**: nav wordmark, `h1`, every `h2` and the footer text share one `left` at 1440 and 390; section gaps equal 112 / 80px. Owned by Tasks 3, 5, 7, 12.
3. **Rapid repeated input**: hamburger, chat launcher; the end state must match the last input. `interact.mjs` covers it. Owned by Tasks 4, 12.
4. **OS dark mode with no saved theme**: project covers (`ThemedImage`) and the education logo show their dark variants with no hydration warnings. Owned by Tasks 5–7, 12.
5. **`t.rich` email link and `<mail>` tags**: renders a working `mailto:` link in all three locales. Owned by Task 5.
6. **Whole-tile links**: one accessible name, no nested interactive elements, visible focus ring. Owned by Task 5.
7. **Nav active state on detail pages**: `/about/<slug>` highlights About, `/projects/<slug>` highlights Projects, Home highlights nothing. Owned by Task 4.
8. **Wrapped dot lists** (Stack rows, tile highlights, technology lines) never start a line with "·": check `/ru` at 390 and the HikGateway page. Owned by Tasks 5–7.
9. **The cut-skills list never returns**: stack, SEO keywords, JSON-LD and the chatbot prompt. Owned by Tasks 2, 10, 11.

## Execution protocol

(The superpowers skills are not installed in the cloud environment; this is the same process.)

For each task, in order:
1. **Implementer** (Agent, `model: "sonnet"`, a fresh subagent per task): give it the task text verbatim plus "Global constraints", "Review focus" and "Verification conventions". It implements, runs the task's checks, and commits.
2. **Spec-compliance reviewer** (fresh Sonnet 5.5 subagent): reads the task text and the diff (`git show HEAD`), reports gaps or extras. The controller fixes or sends back.
3. **Code-quality reviewer** (fresh Sonnet 5.5 subagent): reads the diff for bugs, a11y and convention issues. Findings go into a fix commit.
4. The controller (not a subagent) runs `npm run lint`, `npm test` and `npm run build` before moving on. Don't dispatch two implementers in parallel; tasks touch shared files.

Subagents don't see this conversation; paste what they need. Keep screenshots and scratch output in the scratchpad directory, never in the repo.

## File structure

**Created**
- `src/lib/messages.test.ts`, `src/lib/data.test.ts`, `src/lib/chat-system-prompt.test.ts`
- `src/components/project-row.tsx`, `src/components/stack-list.tsx`, `src/components/dot-list.tsx`

**Rewritten**
- `src/app/[locale]/page.tsx`, `about/page.tsx`, `about/[slug]/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `contact/page.tsx`, `not-found.tsx`; `src/app/not-found.tsx`
- `src/components/footer.tsx`, `navigation.tsx`, `experience-list.tsx`, `section-header.tsx`, `cv-menu.tsx`
- `src/lib/data.ts` (additive in Task 2, final shape in Task 11)

**Edited**
- `src/app/globals.css` (grid and rhythm tokens), `src/app/[locale]/layout.tsx` (metadata), `src/components/structured-data.tsx`, `src/components/scroll-to-top.tsx`, `src/types/i18n.ts`, `src/lib/chat-system-prompt.ts`, `src/app/sitemap.ts`, `next.config.ts`, `messages/{en,ru,uz}.json`, `.claude/CLAUDE.md`, `README.md`

**Deleted**
- `src/components/project-card.tsx`, `project-carousel.tsx`, `skills-bento.tsx`, `last-updated.tsx`, `scroll-reveal.tsx`; `src/lib/scroll-edges.ts` and `scroll-edges.test.ts`
- `src/data/profile.yaml`, `src/data/projects.yaml`; `public/images/certifications/*`

## Verification conventions

Environment: Node 22, Playwright installed globally, Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. All scratch files go in the scratchpad directory (`$SCRATCH` below: the scratchpad path from your system prompt). `$TOOLS=docs/superpowers/plans/2026-10-10-apple-redesign-v2-tools`.

**Every task:** `npm run lint` (0 errors, 0 warnings), `npm test` (all pass), `npm run build` (passes).

**Visual checks (tasks that change what a page looks like):**
```bash
# Dev server in the background on 3100.
npx next dev --turbopack -p 3100 > "$SCRATCH/dev.log" 2>&1 &
sleep 8
# Screenshots: 1440 and 390, light and dark, one PNG per combination, into $SCRATCH/shots/<task>/
mkdir -p "$SCRATCH/shots/task-N"
node $TOOLS/shoot.mjs "$SCRATCH/shots/task-N" http://localhost:3100 /en /ru
# Layout probe (shared left edge, rhythm, overflow); exit code 1 on failure
node $TOOLS/probe.mjs http://localhost:3100 /en /ru /uz
# Interaction checks
node $TOOLS/interact.mjs http://localhost:3100
# Stop it. The bracket trick keeps the pattern from matching this very command line; killing only the `npx` wrapper's
# PID would leave the real server running. Run this as its own command, never in the same command as text that
# contains "next dev" or "next start", or it kills your own shell.
for p in $(pgrep -f "[n]ext-server|[n]ext dev|[n]ext start"); do kill "$p"; done
```
Open the PNGs with the Read tool and look at them. `shoot.mjs` scrolls the page once before capture, so lazy images load. A task's checks name the paths to pass. First load on the dev server compiles each route (slow); the scripts wait for `networkidle`.

---

## Task 1: Land the approved copy in the message files

**Why first and additive:** nothing in the code reads the new keys yet, so merging them (and the sentence-case fixes) can't break a page. Legacy keys stay until Task 11.

**Files:**
- Modify: `messages/en.json`, `messages/ru.json`, `messages/uz.json` (via `$TOOLS/apply-copy.mjs`)
- Create: `src/lib/messages.test.ts`

- [ ] **Step 1: Confirm the starting point**
  ```bash
  git status --short          # clean
  git log --oneline -1        # note this hash as V2_BASE for the final review (the commit that added this plan)
  npm test 2>&1 | tail -8     # 19 pass
  ```

- [ ] **Step 2: Apply the patch**
  ```bash
  node docs/superpowers/plans/2026-10-10-apple-redesign-v2-tools/apply-copy.mjs .
  git diff --stat messages/     # three files, additions plus a few replaced strings, one deletion in ru/uz
  ```
  It prints `en: merged`, `ru: merged`, `uz: merged`. It merges 117 patch entries per locale (arrays counted as one), replaces the strings the deck rewrote (`profile.bio`, `metadata.*.description`, `chatbot.*`, `contact.form.*`, `data.projects.*.title`, `data.experiences.*.position/duration`, `data.education.tsue-economics.degree`, and the sentence-case fixes: `projects.exitFullscreen` and, in ru/uz, `metadata.about.title`), and deletes the stray `fullDescription` under `data.projects.hikcentral-remote-device-integration` in ru/uz.

- [ ] **Step 3: Write `src/lib/messages.test.ts`**
  ```ts
  import assert from 'node:assert/strict';
  import { readFileSync } from 'node:fs';
  import { test } from 'node:test';

  const locales = ['en', 'ru', 'uz'] as const;
  type Locale = (typeof locales)[number];

  function load(locale: Locale): unknown {
    return JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), 'utf8'));
  }

  /** Flattens to dotted paths. Array items become `path.0`, `path.1`, … so list lengths are compared too. */
  function flatten(value: unknown, prefix = ''): Map<string, string> {
    const out = new Map<string, string>();
    if (typeof value === 'string') {
      out.set(prefix, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => flatten(item, `${prefix}.${index}`).forEach((text, key) => out.set(key, text)));
    } else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        flatten(item, prefix ? `${prefix}.${key}` : key).forEach((text, k) => out.set(k, text));
      }
    }
    return out;
  }

  const flat = Object.fromEntries(locales.map((locale) => [locale, flatten(load(locale))])) as Record<Locale, Map<string, string>>;
  const others = locales.filter((locale) => locale !== 'en');

  // Legacy strings the pre-v2 pages still read, which the prune step deletes. This Russian text spells "1-year" out as a
  // word, so its digits differ from the English. Delete this set (and its `continue`) when the legacy copy is removed.
  const LEGACY_UNTIL_PRUNE = new Set(['data.experiences.praaktisgo-devops-engineer.achievements.3']);

  test('every locale has exactly the same keys', () => {
    const reference = new Set(flat.en.keys());
    for (const locale of others) {
      const keys = new Set(flat[locale].keys());
      const missing = [...reference].filter((key) => !keys.has(key));
      const extra = [...keys].filter((key) => !reference.has(key));
      assert.deepEqual({ missing, extra }, { missing: [], extra: [] }, `${locale} keys differ from en`);
    }
  });

  test('placeholders and tags match across locales', () => {
    const tokens = (text: string) => (text.match(/\{\w+\}|<\/?\w+>/g) ?? []).sort();
    for (const [key, text] of flat.en) {
      for (const locale of others) {
        assert.deepEqual(tokens(flat[locale].get(key) ?? ''), tokens(text), `${locale} ${key}`);
      }
    }
  });

  test('no apostrophe quotes a placeholder or tag', () => {
    // In ICU MessageFormat (next-intl), an apostrophe directly before { } < or > turns what follows into literal text,
    // so the placeholder silently stops working. `o'zbek` or `Shaxriyor's {x}` (apostrophe, then a letter or a space) is fine.
    for (const locale of locales) {
      for (const [key, text] of flat[locale]) {
        assert.ok(!/'[{}<>]/.test(text), `${locale} ${key} has an apostrophe before a brace or angle bracket`);
      }
    }
  });

  test('numbers match across locales', () => {
    // 99,9% and 99.9% are the same number.
    const numbers = (text: string) => (text.replace(/,/g, '.').match(/\$?\d+(?:\.\d+)?[%K]?/g) ?? []).sort();
    for (const [key, text] of flat.en) {
      for (const locale of others) {
        if (locale === 'ru' && LEGACY_UNTIL_PRUNE.has(key)) continue;
        assert.deepEqual(numbers(flat[locale].get(key) ?? ''), numbers(text), `${locale} ${key}`);
      }
    }
  });
  ```

- [ ] **Step 4: Verify**
  ```bash
  npm test 2>&1 | tail -12     # 23 pass (19 + 4)
  npm run lint && npm run build
  ```
  Also watch the parity test fail once: `cp messages/ru.json "$SCRATCH/ru.bak"`, delete one leaf from `messages/ru.json`, run `npm test`, confirm the parity test fails and names that key, then restore with `cp "$SCRATCH/ru.bak" messages/ru.json` and re-run `npm test` (back to all pass).

- [ ] **Step 5: Commit**
  ```bash
  git add messages src/lib/messages.test.ts
  git commit -F - <<'EOF'
  feat(copy): land approved v2 copy in en/ru/uz and add message consistency tests

  Additive merge of the approved copy deck (stack, hero, about intro, experience
  and project write-ups, contact, chatbot, metadata) plus two sentence-case
  fixes. Tests assert identical keys, placeholders/tags and numbers across locales.

  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_015t6NroevzsuvMLcRgmvr2D
  EOF
  ```

---

## Task 2: Data layer (additive) with consistency tests

**Files:**
- Modify: `src/lib/data.ts`, `src/components/project-card.tsx`, `src/app/[locale]/projects/[slug]/page.tsx` (two tiny status edits)
- Create: `src/lib/data.test.ts`

Everything here is additive or a type split, so the pages that haven't been rebuilt keep compiling. The legacy fields are removed in Task 11.

- [ ] **Step 1: Types in `src/lib/data.ts`.** Replace the `Experience` and `Project` interfaces and the `ProjectsData` interface with the following, add the stack types above them, and add `stack` and the `ExperienceSource` type to `Profile`:
  ```ts
  export const stackRows = ['cloud', 'containers', 'cicd', 'observability', 'systems', 'data', 'scripting'] as const;
  export type StackRow = (typeof stackRows)[number];

  /** Language-neutral experience facts. Copy lives in messages/*.json under data.experiences.<slug>. */
  export interface ExperienceBase {
    slug: string;
    company: string;
    website?: string;
    logo?: string;
    employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    technologies: string[];
  }

  /** English copy that pages not yet rebuilt still read. Deleted with those pages in the final prune task. */
  export interface ExperienceLegacyText {
    position: string;
    duration: string;
    description: string;
    location?: string;
    responsibilities: string[];
    achievements: string[];
    teamSize?: string;
    industry?: string;
  }

  export type ExperienceSource = ExperienceBase & ExperienceLegacyText;

  /** `summary` and `points` come from messages; a locale missing the entry yields '' and [] (data.test.ts fails on that). */
  export interface Experience extends ExperienceSource {
    summary: string;
    points: string[];
  }

  /** Language-neutral project facts. Copy lives in messages/*.json under data.projects.<slug>. */
  export interface ProjectBase {
    slug: string;
    technologies: string[];
    /** Four key technologies shown on the project tile. */
    highlights: string[];
    coverImage: string;
    coverImageLight?: string;
    expandedImage?: string;
    expandedImageLight?: string;
    expandedVideo?: string;
    expandedVideoLight?: string;
    isVideo?: boolean;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    /** Untranslated key ('Completed'); the label comes from projects.status.* in messages. */
    status: string;
    year: string;
  }

  /** English copy that pages not yet rebuilt still read. Deleted with those pages in the final prune task. */
  export interface ProjectLegacyText {
    title: string;
    shortDescription: string;
    fullDescription: string;
    companyName?: string;
  }

  export type ProjectSource = ProjectBase & ProjectLegacyText;

  /** `summary` and `points` come from messages; a locale missing the entry yields '' and [] (data.test.ts fails on that). */
  export interface Project extends ProjectSource {
    summary: string;
    outcome?: string;
    points: string[];
  }

  export interface ProjectsData {
    featured: ProjectSource[];
    all: ProjectSource[];
  }
  ```
  In `Profile`: change `experience: Experience[]` to `experience: ExperienceSource[]` and add `stack: Record<StackRow, string[]>;` next to `skills`. Remove the `import type { Locale } from '../types/i18n';` line (its only users are deleted in Step 4).

- [ ] **Step 2: Static data.** In `profileData` add, right after `skills`:
  ```ts
  stack: {
    cloud: ['AWS', 'GCP'],
    containers: ['Docker'],
    cicd: ['Jenkins', 'GitLab CI', 'GitHub Actions'],
    observability: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'ELK', 'Datadog', 'Sentry'],
    systems: ['Linux', 'Nginx', 'Tomcat', 'Vault', 'Networking', 'Load balancing', 'DNS'],
    data: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka', 'RabbitMQ', 'Solr'],
    scripting: ['Python', 'Bash'],
  },
  ```
  Set `twitter: "https://x.com/ilyshaxa"`. In the four project records add `highlights` (after `technologies`):
  - `jenkins-cicd-pipeline`: `['Jenkins', 'AWS CodeDeploy', 'S3', 'Prometheus']`
  - `hikcentral-remote-device-integration`: `['ISUP 5.0', 'HikGateway', 'ISAPI', 'TLS']`
  - `comprehensive-monitoring-stack`: `['Prometheus', 'Grafana', 'Loki', 'Alertmanager']`
  - `savethis4me-telegram-bot`: `['Python', 'FastAPI', 'PostgreSQL', 'Docker']`

  Fix a v1 bug in the HikGateway record: its light-theme image path is `"/projects/hikcentral-remote-device-integrationsvg"` (missing the dot), so the detail page shows a broken image in light mode. Set `expandedImageLight` to `"/projects/hikcentral-remote-device-integration.svg"`.

  Trim padding from two technology lists: in `comprehensive-monitoring-stack` delete `"Monitoring"`, `"Observability"`, `"Log Aggregation"`, `"Alerting"`, `"Metrics Collection"`; in `hikcentral-remote-device-integration` delete the duplicate `"TLS Encryption"` (keep `"TLS"`). Change the DataSite entry's `duration` to `"September 2022 - May 2023"` only if it differs (it should already match). Make every project's `slug` present (all four already are).

- [ ] **Step 3: Localize functions.** Replace `localizeProjects` and `localizeExperiences` with:
  ```ts
  const text = (value: unknown, fallback = ''): string => (typeof value === 'string' && value ? value : fallback);
  const list = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.length > 0) : [];

  export function localizeProjects(projects: ProjectSource[], translations: Record<string, unknown>): Project[] {
    const projectsData = ((translations?.data as Record<string, unknown>)?.projects as Record<string, unknown>) || {};
    return projects.map((project) => {
      const copy = (projectsData[project.slug] ?? {}) as Record<string, unknown>;
      return {
        ...project,
        title: text(copy.title, project.title),
        shortDescription: text(copy.shortDescription, project.shortDescription),
        fullDescription: text(copy.fullDescription, project.fullDescription),
        companyName: text(copy.companyName, project.companyName) || undefined,
        summary: text(copy.summary),
        outcome: text(copy.outcome) || undefined,
        points: list(copy.points),
      };
    });
  }

  export function localizeExperiences(experiences: ExperienceSource[], translations: Record<string, unknown>): Experience[] {
    const experiencesData = ((translations?.data as Record<string, unknown>)?.experiences as Record<string, unknown>) || {};
    return experiences.map((experience) => {
      const copy = (experiencesData[experience.slug] ?? {}) as Record<string, unknown>;
      return {
        ...experience,
        company: text(copy.company, experience.company),
        position: text(copy.position, experience.position),
        duration: text(copy.duration, experience.duration),
        description: text(copy.description, experience.description),
        location: text(copy.location, experience.location) || undefined,
        responsibilities: list(copy.responsibilities).length ? list(copy.responsibilities) : experience.responsibilities,
        achievements: list(copy.achievements).length ? list(copy.achievements) : experience.achievements,
        teamSize: text(copy.teamSize, experience.teamSize) || undefined,
        industry: text(copy.industry, experience.industry) || undefined,
        summary: text(copy.summary),
        points: list(copy.points),
      };
    });
  }
  ```
  Update the signatures of `getExperienceBySlug` and `getAllExperiences` to return `ExperienceSource`, and of `getProjects`, `getFeaturedProjects`, `getAllProjects` to return `ProjectSource`. Keep `localizeEducation` as is.

- [ ] **Step 4: Delete dead code.** `grep -rn "getLocalized" src` shows no callers outside `data.ts`. Delete `getLocalizedProjects`, `getLocalizedFeaturedProjects`, `getLocalizedProjectBySlug`, `getLocalizedExperiences`, `getLocalizedExperienceBySlug` (the async functions that `import()` the message files).

- [ ] **Step 5: Two tiny consumer edits** (status is no longer overwritten by messages, so the old pages compute their label):
  - `src/components/project-card.tsx`: add `import { useTranslations } from 'next-intl';`, inside the component `const t = useTranslations('projects'); const statusLabel = t(project.status === 'Completed' ? 'status.completed' : 'status.inProgress');`, and change the `StatusDot` line to `<StatusDot status={project.status} label={`${statusLabel} · ${project.year}`} />`.
  - `src/app/[locale]/projects/[slug]/page.tsx`: replace `const status = project.originalStatus ?? project.status;` with `const status = project.status; const statusLabel = t(status === 'Completed' ? 'status.completed' : 'status.inProgress');` and use `statusLabel` instead of `project.status` in both `StatusDot` `label` props.
  `originalStatus` no longer exists on the type, so the compiler finds any other use.

- [ ] **Step 6: Write `src/lib/data.test.ts`**
  ```ts
  import assert from 'node:assert/strict';
  import { readFileSync } from 'node:fs';
  import { test } from 'node:test';
  import { getAllExperiences, getAllProjects, getProfile, localizeExperiences, localizeProjects, stackRows } from './data.ts';

  const locales = ['en', 'ru', 'uz'] as const;
  const messages = Object.fromEntries(
    locales.map((locale) => [locale, JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), 'utf8'))])
  ) as Record<(typeof locales)[number], Record<string, unknown>>;

  // Skills the site used to list that no CV line, job entry or project shows (spec section 9.3).
  const CUT_SKILLS = [
    'Azure', 'Alibaba Cloud', 'DigitalOcean', 'Kubernetes', 'Podman', 'Containerd', 'Helm', 'Terraform', 'Ansible', 'Pulumi',
    'CloudFormation', 'ARM Templates', 'CDK', 'CircleCI', 'Azure DevOps', 'ArgoCD', 'Elasticsearch', 'DynamoDB', 'Git', 'YAML', 'JSON',
  ];

  test('the stack has every row, no duplicates and none of the cut skills', () => {
    const { stack } = getProfile();
    assert.deepEqual(Object.keys(stack).sort(), [...stackRows].sort());
    const items = stackRows.flatMap((row) => stack[row]);
    for (const row of stackRows) assert.ok(stack[row].length > 0, `${row} is empty`);
    assert.equal(new Set(items).size, items.length, 'duplicate stack item');
    for (const skill of CUT_SKILLS) assert.ok(!items.includes(skill), `${skill} was cut in v2`);
  });

  type Copy = Record<string, Record<string, Record<string, unknown>>>;
  const rawCopy = (locale: (typeof locales)[number], section: 'projects' | 'experiences', slug: string) =>
    ((messages[locale].data as Copy)[section]?.[slug] ?? {}) as Record<string, unknown>;

  test('every project has four highlights and complete copy in every locale', () => {
    const projects = getAllProjects();
    assert.equal(projects.length, 4, 'expected four projects');
    for (const project of projects) assert.equal(project.highlights.length, 4, `${project.slug} highlights`);
    assert.ok(projects.every((project) => project.technologies.length > 0), 'a project has no technologies');
    for (const locale of locales) {
      for (const project of projects) {
        // Read the message entry directly: localizeProjects may fall back to English text, which would hide a gap.
        const entry = rawCopy(locale, 'projects', project.slug);
        for (const field of ['title', 'summary', 'companyName']) {
          assert.ok(typeof entry[field] === 'string' && entry[field], `${locale} ${project.slug} is missing ${field}`);
        }
        assert.ok(Array.isArray(entry.points) && entry.points.length >= 3, `${locale} ${project.slug} needs at least 3 points`);
      }
      const localized = localizeProjects(projects, messages[locale]);
      assert.ok(localized.every((project) => project.summary && project.points.length >= 3), `${locale} localizeProjects lost copy`);
    }
  });

  test('every experience has complete copy in every locale', () => {
    const experiences = getAllExperiences();
    assert.equal(experiences.length, 3, 'expected three experiences');
    for (const locale of locales) {
      for (const experience of experiences) {
        const entry = rawCopy(locale, 'experiences', experience.slug);
        for (const field of ['position', 'duration', 'summary']) {
          assert.ok(typeof entry[field] === 'string' && entry[field], `${locale} ${experience.slug} is missing ${field}`);
        }
        assert.ok(Array.isArray(entry.points) && entry.points.length >= 3, `${locale} ${experience.slug} needs at least 3 points`);
      }
      const localized = localizeExperiences(experiences, messages[locale]);
      assert.ok(localized.every((experience) => experience.summary && experience.points.length >= 3), `${locale} localizeExperiences lost copy`);
    }
  });

  test('only projects marked featured are featured, and exactly three are', () => {
    const featured = getAllProjects().filter((project) => project.featured).map((project) => project.slug);
    assert.deepEqual(featured.sort(), ['comprehensive-monitoring-stack', 'hikcentral-remote-device-integration', 'jenkins-cicd-pipeline']);
  });
  ```

- [ ] **Step 7: Verify.** `npm test` (all pass), `npm run lint`, `npm run build`. Also run `npx tsc --noEmit` and expect no output. Then `grep -rn "originalStatus" src` must print nothing.

- [ ] **Step 8: Commit** `feat(data): add stack, project highlights and localized summaries/points (additive)`.

---

## Task 3: Grid, rhythm and the section header

**Files:**
- Modify: `src/app/globals.css`, `src/components/section-header.tsx`, and the callers in `src/app/[locale]/page.tsx`, `about/page.tsx`, `projects/page.tsx`, `contact/page.tsx`

- [ ] **Step 1: Tokens in `globals.css`.** Add to the `:root` block (after `--material-shadow`): `--page-gutter: 1.25rem;` and `--section-gap: 5rem;`. After the `.dark { … }` block add:
  ```css
  @media (min-width: 48rem) {
    :root {
      --page-gutter: 2rem;
      --section-gap: 7rem;
    }
  }
  ```
  After the existing `@utility scrollbar-none { … }` add:
  ```css
  /* One grid: 980px of content, centered, shared by the nav, every section and the footer. */
  @utility page-container {
    margin-inline: auto;
    width: 100%;
    max-width: calc(980px + 2 * var(--page-gutter));
    padding-inline: var(--page-gutter);
  }

  /* One rhythm: sections are spaced by a single token and carry no vertical padding of their own. */
  @utility section-stack {
    display: flex;
    flex-direction: column;
    gap: var(--section-gap);
  }
  ```

- [ ] **Step 2: Rewrite `src/components/section-header.tsx`:**
  ```tsx
  import { cn } from '@/lib/utils';

  interface SectionHeaderProps {
    title: string;
    /** `h1` for a page title (larger), `h2` for a section heading. */
    as?: 'h1' | 'h2';
    /** Trailing link, baseline-aligned with the heading ("All projects ›"). */
    action?: React.ReactNode;
    className?: string;
  }

  export function SectionHeader({ title, as: Heading = 'h2', action, className }: SectionHeaderProps) {
    return (
      <div className={cn('mb-6 flex items-baseline justify-between gap-4 md:mb-8', className)}>
        <Heading className={cn('text-balance', Heading === 'h1' ? 'text-title-1' : 'text-title-2')}>{title}</Heading>
        {action}
      </div>
    );
  }
  ```

- [ ] **Step 3: Update the callers** so the build stays green: in `src/app/[locale]/page.tsx`, `about/page.tsx`, `projects/page.tsx` and `contact/page.tsx`, delete the `subtitle={t('…')}` prop **on `<SectionHeader …/>` elements only** (11 usages: 3 in Home, 6 in About including its `h1`, 1 in Projects, 1 in Contact; `grep -n "SectionHeader" <file>` lists them). Leave `GroupedListItem`'s `subtitle` prop alone: it is a different component and About, Contact and the detail pages rely on it. No caller passes `eyebrow` or `align`. These pages are rebuilt in later tasks; this is only the minimal edit.

- [ ] **Step 4: Verify.** lint, test, build. No visual check yet; the pages are about to be rebuilt.

- [ ] **Step 5: Commit** `feat(layout): add page-container and section-stack tokens, simplify SectionHeader`.

---

## Task 4: Chrome: navigation, footer, CV menu, scroll-to-top

**Files:**
- Modify: `src/components/navigation.tsx` (rewrite), `src/components/footer.tsx` (rewrite), `src/components/cv-menu.tsx`, `src/components/scroll-to-top.tsx`, `src/types/i18n.ts`
- Delete: `src/components/last-updated.tsx`

- [ ] **Step 1: `src/types/i18n.ts`**: delete the `languageFlags` constant (nothing else uses it after this task; `grep -rn languageFlags src` confirms).

- [ ] **Step 2: `src/components/cv-menu.tsx`**: replace the local `cvOptions` list with the shared constants. New file:
  ```tsx
  'use client';

  import { Check } from 'lucide-react';
  import { useLocale, useTranslations } from 'next-intl';
  import { toast } from 'sonner';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { languageNames, locales, type Locale } from '@/types/i18n';

  interface CvMenuProps {
    /** The trigger, rendered via DropdownMenuTrigger asChild. */
    children: React.ReactNode;
    align?: 'start' | 'center' | 'end';
  }

  export function CvMenu({ children, align = 'end' }: CvMenuProps) {
    const locale = useLocale();
    const t = useTranslations('navigation');

    const download = (cvLocale: Locale) => {
      const link = document.createElement('a');
      link.href = `/cv/shaxriyor-jabborov-cv-${cvLocale}.pdf`;
      link.download = `shaxriyor-jabborov-cv-${cvLocale}.pdf`;
      link.click();
      toast.success(t('cvDownloaded', { language: t(`languageNames.${cvLocale}`) }));
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          {locales.map((code) => (
            <DropdownMenuItem key={code} onClick={() => download(code)} className="cursor-pointer">
              <span lang={code}>{languageNames[code]}</span>
              {locale === code && <Check className="ml-auto size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  ```

- [ ] **Step 3: `src/components/scroll-to-top.tsx`**: add `import { useTranslations } from 'next-intl';`, `const t = useTranslations('ariaLabels');` in the component, and replace the hardcoded `aria-label="Scroll to top of page"` with `aria-label={t('scrollToTop')}`.

- [ ] **Step 4: Rewrite `src/components/navigation.tsx`.** Same sliding pill, hairline, view-transition theme toggle and body scroll lock as v1; the changes are: the bar uses `page-container`; links are About, Projects, Contact; the language control is an `EN ▾` text pill with endonym items; no CV; on mobile the bar shows only the wordmark and hamburger, and the sheet holds the links plus language buttons and the theme toggle.
  ```tsx
  'use client';

  import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from 'react';
  import { flushSync } from 'react-dom';
  import Link from 'next/link';
  import { usePathname, useRouter } from 'next/navigation';
  import { useLocale, useTranslations } from 'next-intl';
  import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
  import { Check, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { ClientOnly } from '@/components/client-only';
  import { CrossfadeIcon } from '@/components/crossfade-icon';
  import { useTheme } from '@/components/theme-provider';
  import { spring } from '@/lib/motion';
  import { useMediaQuery } from '@/lib/use-media-query';
  import { cn } from '@/lib/utils';
  import { languageNames, locales, type Locale } from '@/types/i18n';

  function stripLocale(path: string) {
    return path.replace(/^\/(en|uz|ru)/, '') || '/';
  }

  function useLanguageSwitch() {
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const router = useRouter();
    const [, startTransition] = useTransition();

    const switchTo = (code: Locale) => {
      startTransition(() => {
        router.replace(`/${code}${stripLocale(pathname)}`);
        router.refresh();
      });
    };

    return { locale, switchTo };
  }

  /** Desktop: an "EN ▾" pill that opens a menu of endonyms. */
  function LanguageMenu() {
    const { locale, switchTo } = useLanguageSwitch();
    const t = useTranslations('navigation');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-11 gap-1 px-3 text-[0.8125rem] uppercase"
            aria-label={t('changeLanguage')}
            title={t('changeLanguage')}
          >
            {locale}
            <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((code) => (
            <DropdownMenuItem key={code} onClick={() => switchTo(code)} className="cursor-pointer">
              <span lang={code}>{languageNames[code]}</span>
              {locale === code && <Check className="ml-auto size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  /** Mobile sheet: the three languages inline, so no menu opens over the sheet. */
  function LanguageList() {
    const { locale, switchTo } = useLanguageSwitch();
    const t = useTranslations('navigation');

    return (
      <div role="group" aria-label={t('changeLanguage')} className="flex flex-wrap gap-2">
        {locales.map((code) => (
          <Button
            key={code}
            lang={code}
            variant={locale === code ? 'default' : 'secondary'}
            aria-pressed={locale === code}
            onClick={() => switchTo(code)}
            className="h-9 px-4 text-[0.875rem]"
          >
            {languageNames[code]}
          </Button>
        ))}
      </div>
    );
  }

  function ThemeToggle() {
    const { setTheme, actualTheme } = useTheme();
    const reduceMotion = useReducedMotion();
    const t = useTranslations('navigation');
    const isDark = actualTheme === 'dark';

    // Cross-fade the whole page instead of flashing between light and dark.
    // flushSync makes next-themes apply the class inside the view-transition callback.
    const toggle = () => {
      const next = isDark ? 'light' : 'dark';
      if (reduceMotion || typeof document.startViewTransition !== 'function') {
        setTheme(next);
        return;
      }
      document.startViewTransition(() => {
        flushSync(() => setTheme(next));
      });
    };

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
        title={t('currentTheme', { theme: t(isDark ? 'themeNames.dark' : 'themeNames.light') })}
      >
        <CrossfadeIcon showAlt={isDark} icon={Sun} altIcon={Moon} />
      </Button>
    );
  }

  export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('navigation');
    const currentPath = stripLocale(pathname);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const navItems = useMemo(
      () => [
        { href: `/${locale}/about`, label: t('about'), path: '/about' },
        { href: `/${locale}/projects`, label: t('projects'), path: '/projects' },
        { href: `/${locale}/contact`, label: t('contact'), path: '/contact' },
      ],
      [locale, t]
    );

    // Home highlights nothing: the wordmark is Home.
    const activeHref = navItems.find((item) => currentPath.startsWith(item.path))?.href ?? null;

    // Sliding pill: measure the active link and spring the indicator to it.
    const linksRef = useRef<HTMLDivElement>(null);
    const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);

    const measureIndicator = useCallback(() => {
      const container = linksRef.current;
      const active = activeHref ? linkRefs.current[activeHref] : null;
      if (!container || !active) {
        setIndicator(null);
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      setIndicator({ x: activeRect.left - containerRect.left, width: activeRect.width });
    }, [activeHref]);

    useLayoutEffect(() => {
      measureIndicator();
      // Label widths change once the web font arrives.
      document.fonts?.ready.then(measureIndicator);
    }, [measureIndicator]);

    useEffect(() => {
      window.addEventListener('resize', measureIndicator);
      return () => window.removeEventListener('resize', measureIndicator);
    }, [measureIndicator]);

    // Hairline under the bar only once content scrolls beneath it.
    useEffect(() => {
      const onScroll = () => setIsScrolled(window.scrollY > 0);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
      setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
      if (isDesktop) setIsOpen(false);
    }, [isDesktop]);

    useEffect(() => {
      if (!isOpen) return;
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setIsOpen(false);
      };
      const root = document.documentElement;
      const previousOverflow = root.style.overflow;
      root.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
      return () => {
        root.style.overflow = previousOverflow;
        document.removeEventListener('keydown', onKey);
      };
    }, [isOpen]);

    return (
      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="material-bar relative">
          <div className="page-container flex h-12 items-center justify-between">
            <Link href={`/${locale}`} className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground">
              shaxa.dev
            </Link>

            <div ref={linksRef} className="relative hidden items-center gap-1 md:flex">
              {indicator && (
                <motion.div
                  aria-hidden
                  className="absolute inset-y-2 left-0 rounded-full bg-black/[0.05] dark:bg-white/[0.1]"
                  initial={false}
                  animate={{ x: indicator.x, width: indicator.width }}
                  transition={spring.snappy}
                />
              )}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(element) => {
                    linkRefs.current[item.href] = element;
                  }}
                  aria-current={item.href === activeHref ? 'page' : undefined}
                  className={cn(
                    'relative flex h-11 items-center rounded-full px-3.5 text-[0.8125rem] transition-colors',
                    item.href === activeHref ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center">
              <div className="hidden items-center md:flex">
                <LanguageMenu />
                <ClientOnly fallback={<div className="size-11" />}>
                  <ThemeToggle />
                </ClientOnly>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? t('closeMenu') : t('openMenu')}
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
              >
                <CrossfadeIcon showAlt={isOpen} icon={Menu} altIcon={X} />
              </Button>
            </div>
          </div>
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px bg-border"
            initial={false}
            animate={{ opacity: isScrolled || isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="mobile-scrim"
              aria-hidden
              className="fixed inset-x-0 bottom-0 top-12 -z-10 bg-black/20 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
          {isOpen && (
            <motion.div
              key="mobile-nav"
              id="mobile-nav"
              className="material-sheet overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={spring.default}
            >
              <div className="page-container pb-6 pt-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring.default, delay: index * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={item.href === activeHref ? 'page' : undefined}
                      className={cn(
                        'block border-b border-border py-3 text-title-2',
                        item.href === activeHref ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <LanguageList />
                  <ClientOnly fallback={<div className="size-11" />}>
                    <ThemeToggle />
                  </ClientOnly>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  }
  ```

- [ ] **Step 5: Rewrite `src/components/footer.tsx`** (keeps `'use client'`; no fill, no icons, no credits):
  ```tsx
  'use client';

  import { useTranslations } from 'next-intl';
  import { getProfile } from '@/lib/data';

  export function Footer() {
    const profile = getProfile();
    const t = useTranslations('footer');

    // Brand names are not translated; only "Email" is.
    const links = [
      { href: profile.github, label: 'GitHub', external: true },
      { href: profile.linkedin, label: 'LinkedIn', external: true },
      { href: profile.twitter, label: 'X', external: true },
      { href: profile.instagram, label: 'Instagram', external: true },
      { href: `mailto:${profile.email}`, label: t('email'), external: false },
    ];

    return (
      <footer className="relative z-10 border-t border-border">
        <div className="page-container flex flex-col gap-1 py-6 text-caption text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{t('copyright', { year: new Date().getFullYear(), name: profile.name })}</p>
          <ul className="flex flex-wrap gap-x-5">
            {links.map(({ href, label, external }) => (
              <li key={label}>
                <a
                  href={href}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    );
  }
  ```

- [ ] **Step 6: Delete `src/components/last-updated.tsx`** (`grep -rn LastUpdated src` must then show only nothing; the `/api/deployment` route stays).

- [ ] **Step 7: Verify.** lint, test, build; then the visual checks on `/en` and `/ru` (the pages below the chrome are still old). Look for: nav wordmark and links on the page grid, `EN ▾` pill, no CV in the bar; footer is one hairline row with text links; at 390 the bar shows only wordmark and hamburger and the sheet shows the links plus three language buttons and the theme toggle (open it with `page.click('button[aria-controls="mobile-nav"]')` in a throwaway script, or by hand). Run `interact.mjs` (all `ok`). Check the active pill on `/en/about`, `/en/projects/jenkins-cicd-pipeline` (Projects) and Home (none).

- [ ] **Step 8: Commit** `feat(chrome): grid-aligned nav with text language control, one-row footer, endonym CV menu`.

---

## Task 5: Home

**Files:**
- Create: `src/components/dot-list.tsx`, `src/components/project-row.tsx`, `src/components/stack-list.tsx`
- Rewrite: `src/components/experience-list.tsx`, `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/about/page.tsx` (one line)
- Delete: `src/components/project-carousel.tsx`, `src/lib/scroll-edges.ts`, `src/lib/scroll-edges.test.ts`

- [ ] **Step 1: `src/components/dot-list.tsx`.** Middle-dot separated items whose dot *trails* its item, so when a long list wraps (a Russian stack row at 390px, the 20 Hikvision technologies) no line ever starts with a stray "·":
  ```tsx
  import { cn } from '@/lib/utils';

  export function DotList({ items, className }: { items: string[]; className?: string }) {
    return (
      <ul className={cn('flex flex-wrap gap-x-2', className)}>
        {items.map((item) => (
          <li key={item} className="after:ml-2 after:text-muted-foreground after:content-['·'] last:after:content-none">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  ```

- [ ] **Step 2: `src/components/stack-list.tsx`**
  ```tsx
  import { useTranslations } from 'next-intl';
  import { DotList } from '@/components/dot-list';
  import { stackRows, type Profile } from '@/lib/data';

  /** Seven hairline rows: a muted label and the tools, separated by middle dots. No icons, no color. */
  export function StackList({ stack }: { stack: Profile['stack'] }) {
    const t = useTranslations('home.stack.rows');

    return (
      <dl className="border-t border-border">
        {stackRows.map((row) => (
          <div key={row} className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:gap-6">
            <dt className="shrink-0 text-caption text-muted-foreground sm:w-44 sm:pt-[0.2rem]">{t(row)}</dt>
            <dd>
              <DotList items={stack[row]} className="text-body" />
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  ```

- [ ] **Step 3: `src/components/project-row.tsx`**
  ```tsx
  'use client';

  import React, { useId } from 'react';
  import Link from 'next/link';
  import { motion } from 'framer-motion';
  import { ChevronRight } from 'lucide-react';
  import { useLocale, useTranslations } from 'next-intl';
  import { DotList } from '@/components/dot-list';
  import { ThemedImage } from '@/components/themed-image';
  import type { Project } from '@/lib/data';
  import { spring } from '@/lib/motion';

  const MotionLink = motion.create(Link);

  /**
   * One project as a full-width tile: the diagram on an inset plate, then company · year, title, summary,
   * an optional outcome, four key technologies and "Learn more ›". The whole tile is one link whose
   * accessible name is the title.
   */
  export const ProjectRow = React.memo(function ProjectRow({ project }: { project: Project }) {
    const locale = useLocale();
    const t = useTranslations('common');
    const titleId = useId();
    const eyebrow = [project.companyName, project.year].filter(Boolean).join(' · ');

    return (
      <MotionLink
        href={`/${locale}/projects/${project.slug}`}
        aria-labelledby={titleId}
        whileTap={{ scale: 0.99 }}
        transition={spring.snappy}
        className="grid overflow-hidden rounded-tile bg-secondary contrast-more:border contrast-more:border-foreground/40 md:grid-cols-[5fr_6fr]"
      >
        <div className="p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-tile)-0.75rem)] bg-background">
            <ThemedImage
              src={project.coverImage}
              lightSrc={project.coverImageLight}
              alt=""
              fill
              sizes="(min-width: 768px) 440px, 100vw"
              className="object-contain p-6"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3 px-6 pb-7 pt-3 md:px-8 md:py-8">
          <p className="text-caption text-muted-foreground">{eyebrow}</p>
          <h3 id={titleId} className="text-title-2 text-balance">
            {project.title}
          </h3>
          <p className="text-body text-muted-foreground text-pretty">{project.summary}</p>
          {project.outcome && <p className="text-body">{project.outcome}</p>}
          <DotList items={project.highlights} className="text-caption text-muted-foreground" />
          <span className="mt-1 inline-flex items-center gap-0.5 text-body text-primary">
            {t('learnMore')}
            <ChevronRight className="size-4" aria-hidden />
          </span>
        </div>
      </MotionLink>
    );
  });
  ```

- [ ] **Step 4: Rewrite `src/components/experience-list.tsx`** (no state, no toggle, no animation):
  ```tsx
  import Image from 'next/image';
  import Link from 'next/link';
  import { ChevronRight } from 'lucide-react';
  import { useLocale, useTranslations } from 'next-intl';
  import { GroupedList } from '@/components/grouped-list';
  import type { Experience } from '@/lib/data';
  import { employmentTypeKeys } from '@/lib/employment-type';

  interface ExperienceListProps {
    experiences: Experience[];
    /** About shows a one-line summary under each row; Home doesn't. */
    showSummary?: boolean;
  }

  export function ExperienceList({ experiences, showSummary = false }: ExperienceListProps) {
    const locale = useLocale();
    const t = useTranslations('about');

    return (
      <GroupedList>
        {experiences.map((exp) => (
          <li key={exp.slug} className="border-b border-border last:border-b-0">
            <Link
              href={`/${locale}/about/${exp.slug}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-black/[0.02] active:bg-black/[0.05] dark:hover:bg-white/[0.03] dark:active:bg-white/[0.07]"
            >
              <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-background">
                {exp.logo && <Image src={exp.logo} alt="" width={28} height={28} className="object-contain" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-headline">{exp.company}</span>
                <span className="block text-caption text-muted-foreground">
                  {exp.position} · {t(`employmentTypes.${employmentTypeKeys[exp.employmentType]}`)}
                </span>
                <span className="block text-caption text-muted-foreground sm:hidden">{exp.duration}</span>
                {showSummary && <span className="mt-1.5 block text-body text-muted-foreground">{exp.summary}</span>}
              </span>
              <span className="hidden shrink-0 text-caption text-muted-foreground sm:block">{exp.duration}</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </GroupedList>
    );
  }
  ```
  In `src/app/[locale]/about/page.tsx` change `<ExperienceList experiences={experiences} variant="detailed" />` to `<ExperienceList experiences={experiences} />` (the page is rebuilt in Task 7).

- [ ] **Step 5: Rewrite `src/app/[locale]/page.tsx`**
  ```tsx
  'use client';

  import { useMemo } from 'react';
  import Image from 'next/image';
  import Link from 'next/link';
  import { motion } from 'framer-motion';
  import { useLocale, useMessages, useTranslations } from 'next-intl';
  import { ChevronDown, ChevronRight, Download, MapPin } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { CvMenu } from '@/components/cv-menu';
  import { ExperienceList } from '@/components/experience-list';
  import { ProjectRow } from '@/components/project-row';
  import { SectionHeader } from '@/components/section-header';
  import { StackList } from '@/components/stack-list';
  import { AVATAR_BLUR_DATA_URL } from '@/lib/avatar';
  import { getAllProjects, getProfile, localizeExperiences, localizeProjects } from '@/lib/data';
  import { spring } from '@/lib/motion';

  function SeeMore({ href, children }: { href: string; children: React.ReactNode }) {
    return (
      <Button asChild variant="plain">
        <Link href={href}>
          {children}
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    );
  }

  export default function Home() {
    const profile = getProfile();
    const locale = useLocale();
    const messages = useMessages();
    const t = useTranslations('home');
    const tProfile = useTranslations('profile');

    const projects = useMemo(() => localizeProjects(getAllProjects(), messages), [messages]);
    const featured = projects.filter((project) => project.featured);
    const experiences = useMemo(() => localizeExperiences(profile.experience, messages), [profile.experience, messages]);

    return (
      <div className="section-stack pb-24 md:pb-32">
        {/* Hero: text left, photo right on desktop; a small photo above the text on mobile. */}
        <section className="page-container pt-12 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.default}
            className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16"
          >
            <div className="size-28 overflow-hidden rounded-full ring-1 ring-border md:order-2 md:size-[270px]">
              <Image
                src="/images/profile.jpg"
                alt="Shaxriyor Jabborov"
                width={270}
                height={270}
                className="size-full object-cover"
                quality={75}
                priority
                fetchPriority="high"
                placeholder="blur"
                blurDataURL={AVATAR_BLUR_DATA_URL}
              />
            </div>
            <div className="md:order-1">
              <h1 className="text-display text-balance">{profile.name}</h1>
              <p className="mt-3 text-title-2 text-muted-foreground">{t('hero.role')}</p>
              <p className="mt-6 max-w-[34rem] text-body-lg text-muted-foreground text-pretty">{t('hero.lead')}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden />
                {tProfile('location')}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <CvMenu align="start">
                  <Button size="lg">
                    <Download className="size-5" />
                    {t('hero.downloadCV')}
                    <ChevronDown className="size-4 opacity-80" />
                  </Button>
                </CvMenu>
                <Button asChild variant="plain" size="lg">
                  <Link href={`/${locale}/contact`}>
                    {t('hero.getInTouch')}
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="page-container">
          <SectionHeader
            title={t('work.title')}
            action={<SeeMore href={`/${locale}/projects`}>{t('work.all')}</SeeMore>}
          />
          <div className="flex flex-col gap-4">
            {featured.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section className="page-container">
          <SectionHeader
            title={t('experience.title')}
            action={<SeeMore href={`/${locale}/about`}>{t('experience.more')}</SeeMore>}
          />
          <ExperienceList experiences={experiences} />
        </section>

        <section className="page-container">
          <SectionHeader title={t('stack.title')} />
          <StackList stack={profile.stack} />
        </section>

        <section className="page-container">
          <h2 className="text-title-1 text-balance">{t('contact.title')}</h2>
          <p className="mt-4 max-w-[34rem] text-body-lg text-muted-foreground text-pretty">
            {t.rich('contact.body', {
              address: profile.email,
              mail: (chunks) => (
                <a href={`mailto:${profile.email}`} className="text-primary underline-offset-4 hover:underline">
                  {chunks}
                </a>
              ),
            })}
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href={`/${locale}/contact`}>{t('contact.cta')}</Link>
          </Button>
        </section>
      </div>
    );
  }
  ```

- [ ] **Step 6: Delete** `project-carousel.tsx`, `src/lib/scroll-edges.ts`, `src/lib/scroll-edges.test.ts` (`grep -rn "scroll-edges\|ProjectCarousel" src` must then print nothing). `project-card.tsx` and `skills-bento.tsx` stay until their last callers are rebuilt.

- [ ] **Step 7: Verify.** lint, test (the test count drops by the scroll-edges tests; that's expected), build. Visual: `/en`, `/ru`, `/uz`. Check against the spec §7.1: hero text left with the photo right at 1440; at 390 a 112px photo above the text and no horizontal scroll; the role line reads "DevOps engineer" and nothing about AWS; three project tiles with diagram plates, no status dot, an outcome line on two of them, "Learn more ›"; three experience rows with dates trailing (under the role on mobile) and no toggle; the seven Stack rows; the contact block with a working `mailto:` link (click it: `href` is `mailto:shaxriyor@shaxa.dev`) in **all three locales** (confirms the `<mail>` tag renders). Run the probe on `/en /ru /uz`: shared left edge, gaps 112 / 80 and no overflow must all pass on Home. Dark mode: the project plates are black with the dark diagram variants. At 390 in `/ru`, wrapped Stack rows never start a line with a dot.

- [ ] **Step 8: Commit** `feat(home): left-aligned hero, selected-work tiles, grouped experience, stack list, contact block`.

---

## Task 6: Projects index and project detail

**Files:**
- Rewrite: `src/app/[locale]/projects/page.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`
- Delete: `src/components/project-card.tsx`

- [ ] **Step 1: `src/app/[locale]/projects/page.tsx`**
  ```tsx
  'use client';

  import { useMemo } from 'react';
  import { FolderOpen } from 'lucide-react';
  import { useMessages, useTranslations } from 'next-intl';
  import { ProjectRow } from '@/components/project-row';
  import { SectionHeader } from '@/components/section-header';
  import { getAllProjects, localizeProjects } from '@/lib/data';

  export default function ProjectsPage() {
    const messages = useMessages();
    const projects = useMemo(() => localizeProjects(getAllProjects(), messages), [messages]);
    const t = useTranslations('projects');

    return (
      <div className="page-container pb-24 pt-12 md:pb-32 md:pt-20">
        <SectionHeader as="h1" title={t('title')} />
        {projects.length > 0 ? (
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="max-w-md py-12">
            <FolderOpen className="size-10 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 text-headline">{t('empty.title')}</h2>
            <p className="mt-2 text-body text-muted-foreground">{t('empty.description')}</p>
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: `src/app/[locale]/projects/[slug]/page.tsx`**
  ```tsx
  'use client';

  import { useMemo } from 'react';
  import Link from 'next/link';
  import { notFound, useParams } from 'next/navigation';
  import { useLocale, useMessages, useTranslations } from 'next-intl';
  import { ChevronLeft } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { DotList } from '@/components/dot-list';
  import { GroupedList, GroupedListItem } from '@/components/grouped-list';
  import { MediaViewer } from '@/components/media-viewer';
  import { StatusDot } from '@/components/status-dot';
  import { getAllProjects, getExperienceSlugByCompany, localizeProjects } from '@/lib/data';
  import { useThemedSrc } from '@/lib/use-themed-src';

  export default function ProjectPage() {
    const t = useTranslations('projects');
    const locale = useLocale();
    const { slug } = useParams<{ slug: string }>();
    const messages = useMessages();
    const projects = useMemo(() => localizeProjects(getAllProjects(), messages), [messages]);
    const project = projects.find((p) => p.slug === slug);

    // Hooks run before notFound() so their order never changes between renders.
    const defaultMedia = project
      ? project.isVideo
        ? project.expandedVideo || project.expandedImage || project.coverImage
        : project.expandedImage || project.coverImage
      : '';
    const lightMedia = project?.isVideo ? project.expandedVideoLight : project?.expandedImageLight;
    const mediaSrc = useThemedSrc(defaultMedia, lightMedia);

    if (!project) {
      notFound();
    }

    const statusLabel = t(project.status === 'Completed' ? 'status.completed' : 'status.inProgress');
    // Only company projects link to a job entry; a personal project has none.
    const companySlug = project.companyName ? getExperienceSlugByCompany(project.companyName) : null;
    const eyebrow = [project.companyName, project.year].filter(Boolean).join(' · ');
    // The only project with a live URL is the Telegram bot; any other host falls back to its hostname.
    const liveHost = project.liveUrl ? new URL(project.liveUrl).hostname : null;
    const liveLabel = liveHost === 't.me' ? t('openInTelegram') : liveHost;

    return (
      <article className="page-container pb-24 pt-10 md:pb-32 md:pt-16">
        <Button asChild variant="plain" size="sm">
          <Link href={`/${locale}/projects`}>
            <ChevronLeft className="size-4" />
            {t('back')}
          </Link>
        </Button>

        <header className="mt-8 max-w-[44rem]">
          <p className="text-caption text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-2 text-title-1 text-balance">{project.title}</h1>
          <p className="mt-4 text-body-lg text-muted-foreground text-pretty">{project.summary}</p>
        </header>

        <div className="mt-10">
          <MediaViewer src={mediaSrc} alt={project.title} isVideo={project.isVideo} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          <section>
            <h2 className="text-title-2">{t('whatIBuilt')}</h2>
            <ul className="mt-6 space-y-4">
              {project.points.map((point) => (
                <li key={point} className="flex gap-3 text-body text-muted-foreground">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <aside className="space-y-8">
            <GroupedList>
              {project.companyName && (
                <GroupedListItem
                  title={t('company')}
                  trailing={project.companyName}
                  href={companySlug ? `/${locale}/about/${companySlug}` : undefined}
                />
              )}
              <GroupedListItem title={t('year')} trailing={project.year} />
              <GroupedListItem title={t('status.label')} trailing={<StatusDot status={project.status} label={statusLabel} />} />
              {project.liveUrl && liveLabel && <GroupedListItem title={liveLabel} href={project.liveUrl} />}
            </GroupedList>
            <section>
              <h2 className="text-caption text-muted-foreground">{t('technologies')}</h2>
              <DotList items={project.technologies} className="mt-2 text-body" />
            </section>
          </aside>
        </div>
      </article>
    );
  }
  ```

- [ ] **Step 3: Delete `src/components/project-card.tsx`** (`grep -rn ProjectCard src` prints nothing).

- [ ] **Step 4: Verify.** lint, test, build. Visual on `/en/projects`, `/en/projects/jenkins-cicd-pipeline`, `/en/projects/hikcentral-remote-device-integration`, `/en/projects/savethis4me-telegram-bot` (video), and the same Jenkins page in `/ru` and `/uz`. Check: four tiles on the index; the detail page has back link, eyebrow, title, summary, the existing viewer (zoom/pan/fullscreen still work: run `interact.mjs`; it doesn't cover the viewer, so click zoom-in once by hand in a throwaway script), "What I built" bullets, a spec sheet (Company is a link for KPI/PraaktisGo and plain for the personal project; Year; Status with the green dot and a translated label; "Open in Telegram" on SaveThis4Me), and the technologies as a dot list whose wrapped lines never start with a dot (the Hikvision list has 20 items). No horizontal scroll at 390 in ru/uz (long bullets must wrap).

- [ ] **Step 5: Commit** `feat(projects): stacked project tiles and a what-I-built detail page`.

---

## Task 7: About and experience detail

**Files:**
- Rewrite: `src/app/[locale]/about/page.tsx`, `src/app/[locale]/about/[slug]/page.tsx`
- Modify: `src/lib/data.ts` (languages, education year)
- Delete: `src/components/skills-bento.tsx`

- [ ] **Step 1: Languages in `src/lib/data.ts`.** In `Profile` replace the `languages` type with `languages: Language[]` and add
  ```ts
  export interface Language {
    name: 'Uzbek' | 'English' | 'Russian';
    level: 'native' | 'advanced' | 'basic';
  }
  ```
  Replace the static `languages` array with `[{ name: 'Uzbek', level: 'native' }, { name: 'English', level: 'advanced' }, { name: 'Russian', level: 'basic' }]` (CV order and levels). Change the education `year` to `"2022 – 2027"` (en dash).

- [ ] **Step 2: `src/app/[locale]/about/page.tsx`**
  ```tsx
  'use client';

  import { useMemo } from 'react';
  import { ChevronDown, Download, GraduationCap } from 'lucide-react';
  import { useMessages, useTranslations } from 'next-intl';
  import { Button } from '@/components/ui/button';
  import { CvMenu } from '@/components/cv-menu';
  import { ExperienceList } from '@/components/experience-list';
  import { GroupedList, GroupedListItem } from '@/components/grouped-list';
  import { SectionHeader } from '@/components/section-header';
  import { ThemedImage } from '@/components/themed-image';
  import { getAllExperiences, getProfile, localizeEducation, localizeExperiences } from '@/lib/data';

  function LogoTile({ children }: { children: React.ReactNode }) {
    return (
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-background">
        {children}
      </span>
    );
  }

  export default function AboutPage() {
    const profile = getProfile();
    const messages = useMessages();
    const experiences = useMemo(() => localizeExperiences(getAllExperiences(), messages), [messages]);
    const education = useMemo(() => localizeEducation(profile.education, messages), [profile.education, messages]);
    const t = useTranslations('about');
    const tHero = useTranslations('home.hero');
    const tProfile = useTranslations('profile');

    return (
      <div className="section-stack pb-24 md:pb-32">
        <section className="page-container pt-12 md:pt-20">
          <h1 className="text-title-1 text-balance">{t('title')}</h1>
          <div className="mt-8 max-w-[40rem] space-y-5 text-body-lg text-muted-foreground text-pretty">
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
            <p>{t('intro.p3')}</p>
          </div>
          <CvMenu align="start">
            <Button size="lg" variant="secondary" className="mt-8">
              <Download className="size-5" />
              {tHero('downloadCV')}
              <ChevronDown className="size-4 opacity-80" />
            </Button>
          </CvMenu>
        </section>

        <section className="page-container">
          <SectionHeader title={t('headings.experience')} />
          <ExperienceList experiences={experiences} showSummary />
        </section>

        <section className="page-container">
          <SectionHeader title={t('headings.education')} />
          <GroupedList>
            {education.map((edu) => {
              const logo = edu.logo || edu.logoLight || edu.logoDark;
              return (
                <GroupedListItem
                  key={edu.slug}
                  leading={
                    <LogoTile>
                      {logo ? (
                        <ThemedImage
                          src={logo}
                          lightSrc={edu.logoLight}
                          darkSrc={edu.logoDark}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <GraduationCap className="size-5 text-muted-foreground" />
                      )}
                    </LogoTile>
                  }
                  title={edu.degree}
                  subtitle={`${edu.institution} · ${edu.year}`}
                  href={edu.website}
                />
              );
            })}
          </GroupedList>
        </section>

        <section className="page-container">
          <SectionHeader title={t('headings.languages')} />
          <GroupedList>
            {profile.languages.map((language) => (
              <GroupedListItem
                key={language.name}
                title={tProfile(`languages.${language.name}`)}
                trailing={t(`languages.level.${language.level}`)}
              />
            ))}
          </GroupedList>
        </section>
      </div>
    );
  }
  ```

- [ ] **Step 3: `src/app/[locale]/about/[slug]/page.tsx`**
  ```tsx
  'use client';

  import { use, useMemo } from 'react';
  import Image from 'next/image';
  import Link from 'next/link';
  import { notFound } from 'next/navigation';
  import { useLocale, useMessages, useTranslations } from 'next-intl';
  import { ChevronLeft, ChevronRight } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { DotList } from '@/components/dot-list';
  import { GroupedList, GroupedListItem } from '@/components/grouped-list';
  import { getAllExperiences, localizeExperiences } from '@/lib/data';
  import { employmentTypeKeys } from '@/lib/employment-type';

  interface ExperienceDetailPageProps {
    params: Promise<{
      slug: string;
    }>;
  }

  const neighborClass =
    'block rounded-lg bg-secondary p-5 transition-[scale,background-color] duration-100 active:scale-[0.98] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]';

  export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
    const t = useTranslations('experienceDetail');
    const tAbout = useTranslations('about');
    const tHome = useTranslations('home.stack');
    const tCommon = useTranslations('common');
    const locale = useLocale();
    const { slug } = use(params);
    const messages = useMessages();
    const allExperiences = useMemo(() => localizeExperiences(getAllExperiences(), messages), [messages]);
    const index = allExperiences.findIndex((exp) => exp.slug === slug);

    if (index === -1) {
      notFound();
    }

    const experience = allExperiences[index];
    const prev = index > 0 ? allExperiences[index - 1] : null;
    const next = index < allExperiences.length - 1 ? allExperiences[index + 1] : null;
    const employmentType = tAbout(`employmentTypes.${employmentTypeKeys[experience.employmentType]}`);

    return (
      <article className="page-container pb-24 pt-10 md:pb-32 md:pt-16">
        <Button asChild variant="plain" size="sm">
          <Link href={`/${locale}/about`}>
            <ChevronLeft className="size-4" />
            {t('back')}
          </Link>
        </Button>

        <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
          {experience.logo && (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-[18px] bg-secondary">
              <Image src={experience.logo} alt={`${experience.company} logo`} width={40} height={40} className="object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-title-1 text-balance">{experience.position}</h1>
            <p className="mt-2 text-body-lg text-muted-foreground">
              {experience.company} · {experience.duration}
            </p>
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          <section>
            <h2 className="text-title-2">{t('whatIDid')}</h2>
            <ul className="mt-6 space-y-4">
              {experience.points.map((point) => (
                <li key={point} className="flex gap-3 text-body text-muted-foreground">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <aside className="space-y-8">
            <GroupedList>
              <GroupedListItem title={t('company')} trailing={experience.company} />
              <GroupedListItem title={t('dates')} trailing={experience.duration} />
              <GroupedListItem title={t('type')} trailing={employmentType} />
              {experience.website && <GroupedListItem title={t('website')} href={experience.website} />}
            </GroupedList>
            <section>
              <h2 className="text-caption text-muted-foreground">{tHome('title')}</h2>
              <DotList items={experience.technologies} className="mt-2 text-body" />
            </section>
          </aside>
        </div>

        <nav className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={`/${locale}/about/${prev.slug}`} className={neighborClass}>
              <span className="flex items-center gap-1 text-caption text-muted-foreground">
                <ChevronLeft className="size-3.5" aria-hidden />
                {tCommon('previous')}
              </span>
              <span className="mt-1 block text-headline">{prev.company}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link href={`/${locale}/about/${next.slug}`} className={`${neighborClass} sm:text-right`}>
              <span className="flex items-center gap-1 text-caption text-muted-foreground sm:justify-end">
                {tCommon('next')}
                <ChevronRight className="size-3.5" aria-hidden />
              </span>
              <span className="mt-1 block text-headline">{next.company}</span>
            </Link>
          )}
        </nav>
      </article>
    );
  }
  ```

- [ ] **Step 4: Delete `src/components/skills-bento.tsx`** (`grep -rn SkillsBento src` prints nothing).

- [ ] **Step 5: Verify.** lint, test, build (TypeScript will flag any other reader of the old `languages` shape: `grep -rn "\.flag\|\.country" src` should print nothing). Visual: `/en/about`, `/ru/about`, `/uz/about`, and `/en/about/kpi-com-devops-engineer`, `/en/about/praaktisgo-devops-engineer`, `/en/about/datasite-technology-frontend-developer`. Check: intro in three short paragraphs with a CV button; three experience rows each with a one-line summary; one education row with the TSUE logo (dark variant in dark mode, **with OS dark and no saved theme**: open with `colorScheme: 'dark'`, which `shoot.mjs` does); languages as three plain rows (Uzbek Native, English Advanced (C1), Russian Basic (A1)); **no** skills, certifications, values or fun-fact blocks anywhere. Detail pages show one "What I did" list (KPI 8 bullets, PraaktisGo 8, DataSite 3, in the right language), a three-row spec sheet plus a website link, the technologies as a dot list, and prev/next. Run the probe on `/en/about /ru/about /uz/about`.

- [ ] **Step 6: Commit** `feat(about): intro, grouped experience with summaries, education and languages; one-list experience detail`.

---

## Task 8: Contact

**Files:**
- Rewrite: `src/app/[locale]/contact/page.tsx`

- [ ] **Step 1: Replace the file.** The form logic, validation, success and error states are v1's; the layout loses the subtitle, the form's own heading and description, the "Contact information" and "Response times" blocks, `ScrollReveal`, and the blue icon squares, and reads the `*Label` keys.
  ```tsx
  'use client';

  import { useState } from 'react';
  import { AnimatePresence, motion } from 'framer-motion';
  import { useTranslations } from 'next-intl';
  import { CheckCircle2, Loader2, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Card } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import { GroupedList, GroupedListItem } from '@/components/grouped-list';
  import { SectionHeader } from '@/components/section-header';
  import { getProfile } from '@/lib/data';
  import { spring } from '@/lib/motion';
  import { isValidEmail } from '@/lib/validation';

  const MAX_MESSAGE_LENGTH = 3000; // Telegram has a 4096 character limit, leaving some buffer
  const emptyForm = { name: '', email: '', subject: '', message: '' };

  type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'sent' } | { kind: 'error'; detail?: string };

  function RowIcon({ icon: Icon }: { icon: LucideIcon }) {
    return (
      <span className="flex size-10 items-center justify-center rounded-[10px] bg-background text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
    );
  }

  export default function ContactPage() {
    const profile = getProfile();
    const t = useTranslations('contact');
    const [formData, setFormData] = useState(emptyForm);
    const [status, setStatus] = useState<Status>({ kind: 'idle' });
    const [emailError, setEmailError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      // Apply character limit to message field
      if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;
      if (name === 'email' && emailError && isValidEmail(value)) setEmailError(false);
      if (status.kind === 'error') setStatus({ kind: 'idle' });
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValidEmail(formData.email)) {
        setEmailError(true);
        return;
      }
      setStatus({ kind: 'submitting' });
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
          setFormData(emptyForm);
          setStatus({ kind: 'sent' });
        } else {
          // Typed text is kept so the visitor can retry.
          setStatus({ kind: 'error', detail: result.error });
        }
      } catch (error) {
        console.error('Form submission error:', error);
        setStatus({ kind: 'error' });
      }
    };

    return (
      <div className="page-container pb-24 pt-12 md:pb-32 md:pt-20">
        <SectionHeader as="h1" title={t('header.title')} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <Card className="gap-0 p-6 md:p-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {status.kind === 'sent' ? (
                <motion.div
                  key="sent"
                  role="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring.default}
                  className="flex min-h-[24rem] flex-col items-center justify-center text-center"
                >
                  <CheckCircle2 className="size-14 text-success" strokeWidth={1.5} aria-hidden />
                  <p className="mt-6 text-title-2 text-balance">{t('form.success')}</p>
                  <Button variant="plain" className="mt-4" onClick={() => setStatus({ kind: 'idle' })}>
                    {t('form.sendAnother')}
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring.default}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('form.nameLabel')}</Label>
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('form.namePlaceholder')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('form.emailLabel')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => setEmailError(formData.email.trim() !== '' && !isValidEmail(formData.email))}
                        aria-invalid={emailError}
                        aria-describedby={emailError ? 'email-error' : undefined}
                        placeholder={t('form.emailPlaceholder')}
                        required
                      />
                      {emailError && (
                        <p id="email-error" className="text-caption text-destructive">
                          {t('form.invalidEmail')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('form.subjectLabel')}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('form.subjectPlaceholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message">{t('form.messageLabel')}</Label>
                      <span className="text-caption tabular-nums text-muted-foreground">
                        {formData.message.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('form.messagePlaceholder')}
                      className="min-h-[140px] resize-none"
                      maxLength={MAX_MESSAGE_LENGTH}
                      required
                    />
                    {formData.message.length > MAX_MESSAGE_LENGTH * 0.9 && (
                      <p className="text-caption text-muted-foreground">{t('form.charLimitWarning')}</p>
                    )}
                  </div>

                  {status.kind === 'error' && (
                    <p role="alert" className="rounded-chip bg-destructive/10 px-4 py-3 text-caption text-destructive">
                      {t('form.error')}
                      {status.detail ? ` (${status.detail})` : ''}
                    </p>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={status.kind === 'submitting'}>
                    {status.kind === 'submitting' ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t('form.sending')}
                      </>
                    ) : (
                      t('form.send')
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>

          <GroupedList className="self-start">
            <GroupedListItem
              leading={<RowIcon icon={Mail} />}
              title={profile.email}
              subtitle={t('info.email')}
              href={`mailto:${profile.email}`}
            />
            <GroupedListItem
              leading={<RowIcon icon={Phone} />}
              title={profile.phone}
              subtitle={t('info.phone')}
              href={`tel:${profile.phone.replace(/\s/g, '')}`}
            />
            <GroupedListItem leading={<RowIcon icon={MapPin} />} title={profile.location} subtitle={t('info.location')} />
          </GroupedList>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify.** lint, test, build. Visual on `/en/contact`, `/ru/contact`, `/uz/contact`: no subtitle, form left and three rows right, no "Response times". Interaction (throwaway Playwright script or by hand): blur an invalid email → inline message; submit with the `/api/contact` route intercepted to return 200 → the confirmation replaces the form and "Send another message" restores it; intercepted to return 500 → the inline error shows and typed text stays. (Do not send a real message: intercept with `page.route('**/api/contact', …)`.) No horizontal scroll at 390 in all three locales.

- [ ] **Step 3: Commit** `feat(contact): form and three contact rows; remove duplicate info and response-time blocks`.

---

## Task 9: 404 pages

**Files:**
- Rewrite: `src/app/[locale]/not-found.tsx`, `src/app/not-found.tsx`

- [ ] **Step 1: `src/app/[locale]/not-found.tsx`**
  ```tsx
  'use client';

  import Link from 'next/link';
  import { ChevronRight } from 'lucide-react';
  import { useLocale, useTranslations } from 'next-intl';
  import { Button } from '@/components/ui/button';

  export default function NotFound() {
    const t = useTranslations('notFound');
    const locale = useLocale();

    return (
      <div className="page-container flex min-h-[60vh] flex-col justify-center pb-24 pt-12">
        <p className="text-title-2 text-muted-foreground">404</p>
        <h1 className="mt-2 text-title-1 text-balance">{t('title')}</h1>
        <p className="mt-4 max-w-[34rem] text-body-lg text-muted-foreground text-pretty">{t('body')}</p>
        <Button asChild variant="plain" size="lg" className="mt-6 self-start">
          <Link href={`/${locale}`}>
            {t('cta')}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }
  ```

- [ ] **Step 2: `src/app/not-found.tsx`** (no locale is available here, so it stays English; it loses the jokes and the "Pro Tip"):
  ```tsx
  import Link from 'next/link';
  import { Button } from '@/components/ui/button';

  export default function NotFound() {
    return (
      <div className="page-container flex min-h-screen flex-col justify-center py-24">
        <p className="text-title-2 text-muted-foreground">404</p>
        <h1 className="mt-2 text-title-1">Page not found</h1>
        <p className="mt-4 max-w-[34rem] text-body-lg text-muted-foreground">This page doesn&apos;t exist or has moved.</p>
        <Button asChild variant="plain" size="lg" className="mt-6 self-start">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }
  ```

- [ ] **Step 3: Verify.** lint, test, build. Visit `/en/definitely-missing`, `/ru/definitely-missing`, `/uz/definitely-missing` (translated, left-aligned, "404" in muted title-2) and a path outside any locale if the middleware lets it through (root version: English, no jokes).

- [ ] **Step 4: Commit** `feat(404): translated, left-aligned not-found pages without the jokes`.

---

## Task 10: SEO facts and chatbot facts

**Files:**
- Modify: `src/app/[locale]/layout.tsx`, `src/components/structured-data.tsx`, `src/app/sitemap.ts`, `src/lib/chat-system-prompt.ts`
- Create: `src/lib/chat-system-prompt.test.ts`

- [ ] **Step 1: `src/app/[locale]/layout.tsx` metadata.** The three `description: t('description', { bio: profile.shortBio })` become `description: t('description')` (the message is now a full sentence). Replace the `keywords` array with only evidenced terms:
  ```ts
  keywords: [
    "Shaxriyor Jabborov",
    "DevOps engineer",
    "Cloud engineer",
    "Tashkent",
    "AWS",
    "GCP",
    "Docker",
    "Jenkins",
    "GitLab CI",
    "Prometheus",
    "Grafana",
    "Linux",
    "CI/CD",
    "Observability",
    "Portfolio"
  ],
  ```

- [ ] **Step 2: `src/components/structured-data.tsx`.** Make it read localized content and the new stack:
  - imports: `import { useMessages, useTranslations } from 'next-intl';` and `import { getAllExperiences, getAllProjects, getProfile, localizeExperiences, localizeProjects, stackRows } from '@/lib/data';`
  - at the top of the component: `const messages = useMessages(); const tProfile = useTranslations('profile'); const bio = tProfile('bio');`
  - inside the effect: `const projects = localizeProjects(getAllProjects(), messages); const experiences = localizeExperiences(getAllExperiences(), messages); const skills = stackRows.flatMap((row) => profile.stack[row]);`
  - `description: profile.bio` (both schemas) becomes `description: bio`
  - `knowsAbout: [ ...skills, "DevOps", "Cloud infrastructure", "CI/CD", "Observability" ]`; `hasOccupation.skills: skills`
  - project items: `"description": project.summary`, `"@id"`/`"url"` use `project.slug`
  - `serviceType`: remove `"Container Orchestration"` (nothing on the CV supports orchestration); keep the rest
  - the effect's dependency array becomes `[messages, bio]`
  - `worksFor` keeps `exp.position`, which is now localized
  Then in `src/app/sitemap.ts` change the project slug line to `const projectSlug = project.slug;`.

- [ ] **Step 3: `src/lib/chat-system-prompt.ts`.** Replace everything between the `BIO:` heading and the `Your role is to:` heading with the block below. Don't touch the intro lines, `PROFILE:` (including age, origin and links), `CAREER BACKGROUND:`, `EDUCATION:`, or anything from `Your role is to:` to the end (behavior, refusal policy, rate-limit-relevant rules and the JSON format are out of scope). Also change rule 11's text `kpi.com` to `KPI` (it appears once, in "Currently that is only kpi.com").

  ```
  BIO:
  DevOps engineer in Tashkent building cloud infrastructure, CI/CD pipelines and monitoring on AWS and GCP.

  CAREER BACKGROUND:
  - Started career as a frontend developer
  - Learned HTML, CSS, and React at fundamental levels
  - Transitioned to DevOps engineering

  SKILLS (only these; do not claim others):
  Cloud: AWS, GCP
  Containers: Docker
  CI/CD: Jenkins, GitLab CI, GitHub Actions
  Observability: Prometheus, Grafana, Loki, Alertmanager, ELK, Datadog, Sentry
  Systems: Linux, Nginx, Tomcat, Vault, Networking, Load balancing, DNS
  Data: PostgreSQL, MySQL, MongoDB, Redis, Kafka, RabbitMQ, Solr
  Scripting: Python, Bash

  EXPERIENCE:
  - DevOps Engineer at KPI (May 2023 - Present)(Full-time):
    - Built a central observability stack (Prometheus, Grafana, Loki, Alertmanager), cutting incident response time by 60%
    - Designed a secure attendance integration for Hikvision face-recognition devices over ISUP 5.0 with outbound TLS, so client sites need no inbound exposure
    - Wrote a Python Prometheus exporter that exposes business KPIs for real-time monitoring
    - Automated database schema synchronization across dev, stage and prod with a Python CLI tool
    - Cut monthly AWS costs by 20% (EC2 and S3 optimization, Savings Plans)
    - Prevented production outages by finding Tomcat thread-exhaustion bottlenecks and adding automated recovery
    - Upgraded the legacy GitLab Omnibus installation to the latest stable release
    - Deployed and managed Docker-based applications across environments and automated builds with Jenkins
  - DevOps Engineer at PraaktisGo (January 2025 - July 2026)(Freelance, ended):
    - Led a zero-downtime migration of production AWS infrastructure to a new account and region, with no data loss
    - Reached 99.9% uptime with proactive monitoring, alerting and incident prevention
    - Cut deployment time by 50% with Jenkins CI/CD automation and Docker-based environment standardization
    - Designed cross-cloud cost tracking and performance monitoring for a hybrid-cloud strategy
    - Secured $100K in Google Cloud credits (GFS Cloud Program 2024) and $10K in AWS Activate Portfolio credits
    - Cut operational overhead by 15% through the Google Workspace Business Plan and cloud cost governance
    - Enforced security best practices across AWS and GCP (IAM hardening, network segmentation, controlled access policies)
    - Documented the architecture, deployment workflows and operating standards
  - Frontend Engineer (Intern) at DataSite Technology (Sep 2022 - May 2023)(Internship):
    - Built responsive web interfaces with HTML5, CSS3, JavaScript and React
    - Turned Figma designs into production-ready pages
    - Worked with backend and DevOps teams and got early exposure to deployment workflows and version control

  EDUCATION:
  - Bachelor's in Economics, Tashkent State University of Economics (2022 - 2027, part-time): Economics degree, attends university for 2 months each year as part of the part-time program.

  CERTIFICATIONS:
  - He is not AWS certified. Do not claim or imply any certification.

  LANGUAGES:
  - Uzbek: Native
  - English: Advanced (C1)
  - Russian: Basic (A1)

  PROJECTS (ONLY mention technologies explicitly listed for each project - DO NOT assume or add other technologies):

  1. Jenkins CI/CD pipeline (PraaktisGo, 2025):
     - Description: An automated build, test and deploy pipeline on Jenkins and AWS, with Prometheus watching the build infrastructure. Automates builds, tests and deployments across dev and prod, with AWS CodeDeploy handling the rollout. Jenkins agents run on custom AMIs with the build tools preinstalled (JDK, Ant, Git, AWS CLI), and the pipeline provisions agents on demand. Build artifacts go to S3 and are deployed with CodeDeploy. Post-build scripts send changelogs and build status to a Telegram group. Prometheus and node_exporter track resource usage on the Jenkins controller and agents. Deployment time down 50%.
     - EXACT Technologies Used: Jenkins, AWS EC2, AWS S3, AWS CodeDeploy, AWS IAM, AWS CLI, Git, Bash, Telegram API, Prometheus, Node Exporter, Ant
     - NOT USED: Kubernetes, Docker, Terraform, Ansible, Azure, GCP (these are NOT part of this project)

  2. HikGateway integration (KPI, 2025):
     - Description: A remote-device platform that lets Hikvision devices behind NAT and firewalls connect to the cloud, with no inbound exposure at customer sites. Devices open persistent, encrypted outbound ISUP connections to a cloud-hosted HikGateway, so customer sites need no static IP and no inbound ports. HikGateway is the control plane for device registration, session lifecycle, status monitoring and events. Backend services manage devices, read events and send control commands through HikGateway's ISAPI interfaces over HTTPS, without touching the devices directly.
     - EXACT Technologies Used: Hikvision Devices, ISUP 5.0 Protocol, ISUP over TCP, TCP/IP, TLS, HTTPS, NAT, Firewall, NTP, DNS, Hikvision Firmware, HikGateway (Device Gateway), HikGateway ISUP Service, HikGateway ISAPI API, REST API, JSON, API Tokens & Authentication, Google Cloud Platform (GCP), Compute Engine, Linux Server
     - NOT USED: AWS, Kubernetes, Docker (these are NOT part of this project)

  3. Monitoring stack (KPI, 2023):
     - Description: A central observability stack for metrics, logs and alerts across KPI's infrastructure and applications. Prometheus collects metrics from node_exporter, jmx_exporter, cAdvisor and a custom exporter. Grafana provides dashboards. Loki aggregates logs, with Promtail collecting and forwarding them. Alertmanager routes and deduplicates alerts and sends critical ones to Telegram. The whole stack runs in containers and is built for high availability. Incident response time down 60%.
     - EXACT Technologies Used: Grafana, Prometheus, Loki, Node Exporter, JMX Exporter, Custom Exporter, cAdvisor, Promtail, Alertmanager, Telegram API, PostgreSQL, Docker, Linux
     - NOT USED: Kubernetes, AWS, Azure (these are NOT part of this project)

  4. SaveThis4Me Telegram bot (Personal Project, 2024, rebuilt as a public bot in 2026, Completed):
     <keep the existing description, EXACT Technologies Used, Live URL and NOT USED lines unchanged>
  ```
  The technology lists above equal `data.ts` after Task 2's trims; the test below keeps the prompt and `data.ts` from drifting.

- [ ] **Step 4: `src/lib/chat-system-prompt.test.ts`**
  ```ts
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
  ```
  Note: the SaveThis4Me technologies in the prompt (`Python, python-telegram-bot, FastAPI, PostgreSQL, yt-dlp, gallery-dl, FFmpeg, Meta Webhooks, Docker, Linux, Git`) already equals `data.ts`; if the test reports a mismatch for any project, fix the prompt line, not the test. The test also catches the `kpi.com` in rule 11.

- [ ] **Step 5: Verify.** `npm test` (new file passes; if a test fails, it names the line to fix), lint, build. Run the dev server and open `/en` view-source or the browser console: the JSON-LD scripts contain no cut skills (`document.querySelectorAll('script[type="application/ld+json"]')`, search for `Kubernetes`/`Terraform`/`Azure`: none). `grep -rn "Kubernetes\|Terraform\|Ansible\|Azure" src | grep -v test` should only show the prompt's `NOT USED` lines and rule 13/14 example text.

- [ ] **Step 6: Commit** `fix(facts): evidenced SEO keywords and JSON-LD, chatbot prompt aligned with the site`.

---

## Task 11: Prune legacy and finish the data model

Everything that read the legacy fields is rebuilt now. This task deletes the legacy, tightens the types, and removes dead messages and files. After it, `grep` must find nothing from the old model.

**Files:**
- Rewrite: `src/lib/data.ts` (final shape)
- Modify: `messages/*.json`, `src/app/sitemap.ts` (if any slug fallback remains), `next.config.ts`, `.claude/CLAUDE.md`, `README.md`, `src/lib/messages.test.ts`
- Delete: `src/components/scroll-reveal.tsx`, `src/data/profile.yaml`, `src/data/projects.yaml`, `public/images/certifications/` (all files)

- [ ] **Step 1: Confirm each deletion is safe**
  ```bash
  grep -rn "ScrollReveal\|scroll-reveal" src                       # nothing
  grep -rn "profile.yaml\|projects.yaml\|from 'js-yaml'" src next.config.ts   # nothing
  grep -rn "images/certifications" src                              # only the commented-out block in data.ts
  ls src/data                                                       # only the two yaml files
  ```
  If any command prints a live reference, stop and fix the reference first.

- [ ] **Step 2: Replace `src/lib/data.ts` with its final shape.** This removes the legacy text types, the English fallback copy, `skills`, `certifications`, `shortBio`, `bio`, the unused `cvUrl` (it points at a file that doesn't exist), the `ProjectsData` wrapper, `generateProjectSlug`, and the three exports nothing calls (`getExperienceBySlug`, `getProjects`, `getFeaturedProjects`; confirm with `grep -rn` first). Write the whole file:
  ```ts
  // Language-neutral facts. All copy (titles, summaries, bullet points, durations, personal-project labels) lives in
  // messages/*.json under data.projects.<slug>, data.experiences.<slug> and data.education.<slug>;
  // localizeProjects / localizeExperiences / localizeEducation merge it in.

  export const stackRows = ['cloud', 'containers', 'cicd', 'observability', 'systems', 'data', 'scripting'] as const;
  export type StackRow = (typeof stackRows)[number];

  export interface ExperienceBase {
    slug: string;
    company: string;
    website?: string;
    logo?: string;
    employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    technologies: string[];
  }

  /** Copy comes from messages; a locale missing the entry yields '' (data.test.ts fails on that). */
  export interface Experience extends ExperienceBase {
    position: string;
    duration: string;
    summary: string;
    points: string[];
  }

  export interface Education {
    slug: string;
    institution: string;
    degree: string;
    year: string;
    logo?: string;
    logoLight?: string;
    logoDark?: string;
    website?: string;
  }

  export interface Language {
    name: 'Uzbek' | 'English' | 'Russian';
    level: 'native' | 'advanced' | 'basic';
  }

  export interface Profile {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    stack: Record<StackRow, string[]>;
    experience: ExperienceBase[];
    education: Education[];
    languages: Language[];
  }

  export interface ProjectBase {
    slug: string;
    technologies: string[];
    /** Four key technologies shown on the project tile. */
    highlights: string[];
    coverImage: string;
    coverImageLight?: string;
    expandedImage?: string;
    expandedImageLight?: string;
    expandedVideo?: string;
    expandedVideoLight?: string;
    isVideo?: boolean;
    liveUrl?: string;
    featured: boolean;
    /** Untranslated key ('Completed'); the label comes from projects.status.* in messages. */
    status: string;
    year: string;
  }

  /** Copy comes from messages; a locale missing the entry yields '' and [] (data.test.ts fails on that). */
  export interface Project extends ProjectBase {
    title: string;
    summary: string;
    outcome?: string;
    points: string[];
    companyName?: string;
  }

  const profileData: Profile = {
    name: 'Shaxriyor Jabborov',
    title: 'DevOps Engineer',
    location: 'Tashkent, Uzbekistan',
    email: 'shaxriyor@shaxa.dev',
    phone: '+998 93 766 50 10',
    website: 'https://shaxa.dev',
    github: 'https://github.com/ilyshaxa',
    linkedin: 'https://linkedin.com/in/shaxriyor',
    twitter: 'https://x.com/ilyshaxa',
    instagram: 'https://instagram.com/ilyshaxa',
    stack: {
      cloud: ['AWS', 'GCP'],
      containers: ['Docker'],
      cicd: ['Jenkins', 'GitLab CI', 'GitHub Actions'],
      observability: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'ELK', 'Datadog', 'Sentry'],
      systems: ['Linux', 'Nginx', 'Tomcat', 'Vault', 'Networking', 'Load balancing', 'DNS'],
      data: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka', 'RabbitMQ', 'Solr'],
      scripting: ['Python', 'Bash'],
    },
    experience: [
      {
        slug: 'kpi-com-devops-engineer',
        company: 'KPI',
        website: 'https://kpi.com',
        logo: '/images/companies/kpi-logo.png',
        employmentType: 'Full-time',
        startDate: '2023-05-01',
        isCurrent: true,
        technologies: [
          'AWS', 'GCP', 'Docker', 'Linux', 'Jenkins', 'GitLab CI', 'Git', 'Python', 'Bash', 'Sentry', 'Prometheus', 'Grafana',
          'Loki', 'Alertmanager', 'Tomcat', 'Nginx', 'Solr', 'Kafka', 'RabbitMQ', 'Redis', 'MongoDB', 'PostgreSQL',
        ],
      },
      {
        slug: 'praaktisgo-devops-engineer',
        company: 'PraaktisGo',
        website: 'https://praaktisgo.com',
        logo: '/images/companies/praaktisgo-logo.png',
        employmentType: 'Freelance',
        startDate: '2025-01-01',
        endDate: '2026-07-01',
        isCurrent: false,
        technologies: [
          'AWS', 'GCP', 'Docker', 'Linux', 'Jenkins', 'Git', 'Python', 'Bash', 'Prometheus', 'Grafana', 'Alertmanager', 'Tomcat',
          'Nginx', 'Solr', 'Kafka', 'RabbitMQ', 'Redis', 'MongoDB', 'PostgreSQL',
        ],
      },
      {
        slug: 'datasite-technology-frontend-developer',
        company: 'DataSite Technology',
        website: 'https://dst.uz/',
        logo: '/images/companies/datasite-logo.png',
        employmentType: 'Internship',
        startDate: '2022-09-01',
        endDate: '2023-05-01',
        isCurrent: false,
        technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Figma'],
      },
    ],
    education: [
      {
        slug: 'tsue-economics',
        institution: 'Tashkent State University of Economics',
        degree: "Bachelor's degree in economics",
        year: '2022 – 2027',
        logo: '/images/education/tsue-light.png',
        logoLight: '/images/education/tsue-light.png',
        logoDark: '/images/education/tsue-dark.png',
        website: 'https://tsue.uz',
      },
    ],
    languages: [
      { name: 'Uzbek', level: 'native' },
      { name: 'English', level: 'advanced' },
      { name: 'Russian', level: 'basic' },
    ],
  };

  const projectList: ProjectBase[] = [
    {
      slug: 'jenkins-cicd-pipeline',
      technologies: [
        'Jenkins', 'AWS EC2', 'AWS S3', 'AWS CodeDeploy', 'AWS IAM', 'AWS CLI', 'Git', 'Bash', 'Telegram API', 'Prometheus',
        'Node Exporter', 'Ant',
      ],
      highlights: ['Jenkins', 'AWS CodeDeploy', 'S3', 'Prometheus'],
      coverImage: '/projects/praaktisgo-jenkins-ci-cd-dark.svg',
      coverImageLight: '/projects/praaktisgo-jenkins-ci-cd-light.svg',
      expandedImage: '/projects/praaktisgo-jenkins-ci-cd-dark.svg',
      expandedImageLight: '/projects/praaktisgo-jenkins-ci-cd-light.svg',
      featured: true,
      status: 'Completed',
      year: '2025',
    },
    {
      slug: 'hikcentral-remote-device-integration',
      technologies: [
        'Hikvision Devices', 'ISUP 5.0 Protocol', 'ISUP over TCP', 'TCP/IP', 'TLS', 'HTTPS', 'NAT', 'Firewall', 'NTP', 'DNS',
        'Hikvision Firmware', 'HikGateway (Device Gateway)', 'HikGateway ISUP Service', 'HikGateway ISAPI API', 'REST API', 'JSON',
        'API Tokens & Authentication', 'Google Cloud Platform (GCP)', 'Compute Engine', 'Linux Server',
      ],
      highlights: ['ISUP 5.0', 'HikGateway', 'ISAPI', 'TLS'],
      coverImage: '/projects/hikcentral-remote-device-integration.svg',
      coverImageLight: '/projects/hikcentral-remote-device-integration.svg',
      expandedImage: '/projects/hikcentral-remote-device-integration.svg',
      expandedImageLight: '/projects/hikcentral-remote-device-integration.svg',
      featured: true,
      status: 'Completed',
      year: '2025',
    },
    {
      slug: 'comprehensive-monitoring-stack',
      technologies: [
        'Grafana', 'Prometheus', 'Loki', 'Node Exporter', 'JMX Exporter', 'Custom Exporter', 'cAdvisor', 'Promtail',
        'Alertmanager', 'Telegram API', 'PostgreSQL', 'Docker', 'Linux',
      ],
      highlights: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager'],
      coverImage: '/projects/kpi-monitoring-stack-dark.svg',
      coverImageLight: '/projects/kpi-monitoring-stack-light.svg',
      expandedImage: '/projects/kpi-monitoring-stack-dark.svg',
      expandedImageLight: '/projects/kpi-monitoring-stack-light.svg',
      featured: true,
      status: 'Completed',
      year: '2023',
    },
    {
      slug: 'savethis4me-telegram-bot',
      technologies: [
        'Python', 'python-telegram-bot', 'FastAPI', 'PostgreSQL', 'yt-dlp', 'gallery-dl', 'FFmpeg', 'Meta Webhooks', 'Docker',
        'Linux', 'Git',
      ],
      highlights: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      coverImage: '/projects/ST4M-Transparent-Logo.svg',
      coverImageLight: '/projects/ST4M-Transparent-Logo.svg',
      expandedImage: '/projects/ST4M-Transparent-Logo.svg',
      expandedImageLight: '/projects/ST4M-Transparent-Logo.svg',
      expandedVideo: '/projects/savethis4me-demo.mp4',
      expandedVideoLight: '/projects/savethis4me-demo.mp4',
      isVideo: true,
      liveUrl: 'https://t.me/SaveThis4Me_Bot',
      featured: false,
      status: 'Completed',
      year: '2024',
    },
  ];

  export function getProfile(): Profile {
    return profileData;
  }

  export function getAllProjects(): ProjectBase[] {
    return projectList;
  }

  export function getAllExperiences(): ExperienceBase[] {
    return profileData.experience;
  }

  export function getExperienceSlugByCompany(companyName: string): string | null {
    const name = companyName.toLowerCase();
    const match = getAllExperiences().find((exp) => {
      const company = exp.company.toLowerCase();
      return company === name || company.includes(name) || name.includes(company);
    });
    return match?.slug ?? null;
  }

  type MessageTree = Record<string, unknown>;

  const text = (value: unknown): string => (typeof value === 'string' ? value : '');
  const list = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.length > 0) : [];

  function dataSection(translations: MessageTree, section: 'projects' | 'experiences' | 'education'): Record<string, MessageTree> {
    const data = translations?.data as Record<string, Record<string, MessageTree>> | undefined;
    return data?.[section] ?? {};
  }

  export function localizeProjects(projects: ProjectBase[], translations: MessageTree): Project[] {
    const copy = dataSection(translations, 'projects');
    return projects.map((project) => {
      const entry = copy[project.slug] ?? {};
      return {
        ...project,
        title: text(entry.title),
        summary: text(entry.summary),
        outcome: text(entry.outcome) || undefined,
        points: list(entry.points),
        companyName: text(entry.companyName) || undefined,
      };
    });
  }

  export function localizeExperiences(experiences: ExperienceBase[], translations: MessageTree): Experience[] {
    const copy = dataSection(translations, 'experiences');
    return experiences.map((experience) => {
      const entry = copy[experience.slug] ?? {};
      return {
        ...experience,
        position: text(entry.position),
        duration: text(entry.duration),
        summary: text(entry.summary),
        points: list(entry.points),
      };
    });
  }

  export function localizeEducation(education: Education[], translations: MessageTree): Education[] {
    const copy = dataSection(translations, 'education');
    return education.map((edu) => {
      const entry = copy[edu.slug] ?? {};
      return { ...edu, institution: text(entry.institution) || edu.institution, degree: text(entry.degree) || edu.degree };
    });
  }
  ```
  Static `education` keeps its English `institution` and `degree` as the fallback (it has always been the pattern for that one record; the test in Step 3 pins it to the English messages). The Hik project's light image path is the corrected one. Callers that passed `useMessages()` output still type-check (`MessageTree` is `Record<string, unknown>`). Run `npx tsc --noEmit`; any error means a consumer missed a rebuild in an earlier task, so fix it minimally there (for example, `src/app/sitemap.ts` must use `project.slug`, set in Task 10).

- [ ] **Step 3: Extend `src/lib/data.test.ts`** with one check that the static education fallback equals the English messages (so the one remaining duplicate can't drift):
  ```ts
  test('the static education fallback matches the English messages', () => {
    const { education } = getProfile();
    const copy = (messages.en.data as Record<string, Record<string, Record<string, string>>>).education;
    for (const edu of education) {
      assert.equal(edu.institution, copy[edu.slug].institution, `${edu.slug} institution`);
      assert.equal(edu.degree, copy[edu.slug].degree, `${edu.slug} degree`);
    }
  });
  ```
  and make sure the other tests still pass against the final types.

- [ ] **Step 4: Delete files**
  ```bash
  git rm src/components/scroll-reveal.tsx src/data/profile.yaml src/data/projects.yaml
  git rm -r public/images/certifications
  ```
  (`src/data/` is then empty and disappears.)

- [ ] **Step 5: Remove legacy message keys.** Save this as `$SCRATCH/prune-messages.mjs` and run it. It removes the legacy keys the spec listed, in all three files, with the repo's JSON format:
  ```js
  // node prune-messages.mjs <repoRoot>
  import fs from 'node:fs';
  const root = process.argv[2] ?? '.';
  const REMOVE = [
    'home.hero.roles', 'home.hero.greeting', 'home.skills', 'home.projects', 'home.cta', 'home.experience.subtitle',
    'home.experience.viewDetails', 'home.experience.showAll', 'home.experience.showLess', 'home.experience.visit',
    'about.subtitle', 'about.sections',
    'projects.subtitle', 'projects.featured', 'projects.featuredBadge', 'projects.all', 'projects.viewProject',
    'projects.viewProjectDetails', 'projects.viewCode', 'projects.liveDemo', 'projects.aboutProject', 'projects.projectLinks',
    'projects.backToProjects', 'projects.status.title', 'projects.status.planned',
    'contact.header.subtitle', 'contact.form.title', 'contact.form.description', 'contact.form.name', 'contact.form.email',
    'contact.form.message', 'contact.info.title', 'contact.info.description', 'contact.responseTimes',
    'experienceDetail.current', 'experienceDetail.visitWebsite', 'experienceDetail.responsibilities', 'experienceDetail.achievements',
    'experienceDetail.companyInfo', 'experienceDetail.skillsAndTech', 'experienceDetail.backToAbout',
    'footer.template', 'footer.github', 'profile.lastUpdated', 'profile.shortBio', 'profile.industries',
    'ariaLabels.visitGitHub', 'ariaLabels.connectLinkedIn', 'ariaLabels.followTwitter', 'ariaLabels.sendEmail', 'ariaLabels.followInstagram',
    // Dead after v2 (the CV button leaves the nav; the rest were already unused in v1):
    'navigation.home', 'navigation.downloadCV', 'navigation.cv', 'navigation.selectLanguage', 'navigation.downloadInEnglish',
    'navigation.downloadInUzbek', 'navigation.downloadInRussian', 'navigation.downloadingCV', 'projects.fullscreenNotAvailable',
    'chatbot.errors.offTopicNote', 'chatbot.aria.closeWelcome', 'ariaLabels.closeFullscreen', 'common.loading', 'common.error',
    'common.notFound', 'common.backToHome', 'common.readMore', 'common.viewAll', 'common.showMore', 'common.showLess', 'common.more',
    'common.and', 'common.justNow', 'common.minutesAgo', 'common.hoursAgo', 'common.daysAgo', 'profile.languages.Turkish',
  ];
  const PROJECT_DROP = ['shortDescription', 'fullDescription', 'status'];
  const EXPERIENCE_DROP = ['company', 'description', 'location', 'responsibilities', 'achievements', 'teamSize', 'industry'];
  function remove(tree, path) {
    const parts = path.split('.');
    let node = tree;
    for (const part of parts.slice(0, -1)) {
      node = node?.[part];
      if (typeof node !== 'object' || node === null) return false;
    }
    return delete node[parts.at(-1)];
  }
  for (const locale of ['en', 'ru', 'uz']) {
    const file = `${root}/messages/${locale}.json`;
    const messages = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const path of REMOVE) if (!remove(messages, path)) console.warn(`${locale}: ${path} not found`);
    for (const entry of Object.values(messages.data.projects)) for (const key of PROJECT_DROP) delete entry[key];
    for (const entry of Object.values(messages.data.experiences)) for (const key of EXPERIENCE_DROP) delete entry[key];
    fs.writeFileSync(file, JSON.stringify(messages, null, 2));
  }
  ```
  Careful: `projects.status` keeps `label`, `completed`, `inProgress` (added by the patch); only `title` and `planned` go. Then run the dead-key scan:
  ```bash
  node $TOOLS/dead-keys.mjs . 2>&1 | grep -v '^metadata\.'
  ```
  It must report **0 unused keys** apart from `metadata.*` (kept on purpose, see deviation 9). If it reports anything else, verify the key really is unreferenced (the scan handles `t('key')`, template keys, ternaries and `t(variable)`), add it to `REMOVE`, re-run the script (it is idempotent) and re-run the scan. Then `npm test`: key parity, placeholders and numbers still pass.

- [ ] **Step 6: Edit `src/lib/messages.test.ts`:** delete the `LEGACY_UNTIL_PRUNE` set and its `continue` line (the string it exempted was removed in Step 5), then add the claims guard:
  ```ts
  test('no message claims a certification', () => {
    for (const locale of locales) {
      for (const [key, text] of flat[locale]) {
        assert.ok(!/AWS\s+(Certified|Сертифицирован|Sertifikatlangan)/i.test(text), `${locale} ${key} claims an AWS certification`);
        assert.ok(!key.includes('awsCertified'), `${locale} still has ${key}`);
      }
    }
  });
  ```

- [ ] **Step 7: Config and docs**
  - `next.config.ts`: delete the `flagcdn.com` entry from `images.remotePatterns` (no flags remain: `grep -rn flagcdn src` prints nothing). Leave `serverExternalPackages` and the `js-yaml` dependency alone (removing a dependency is out of scope: no `npm uninstall`).
  - `.claude/CLAUDE.md`: delete the line `data/                 — YAML content (profile.yaml, projects.yaml)` from the structure block, and replace the **Content pipeline** section with:
    ```
    ## Content pipeline
    - `src/lib/data.ts` — Language-neutral facts: links, stack, experience and project structure, media paths
    - `messages/{en,ru,uz}.json` — All copy, including `data.projects.<slug>` and `data.experiences.<slug>` (title, summary, points) and `data.education.<slug>`
    - `localizeProjects` / `localizeExperiences` / `localizeEducation` in `src/lib/data.ts` merge the two
    - Facts rule: the CV and the site must agree. A claim that only one of them makes stays off the site (see `docs/superpowers/specs/2026-10-10-apple-redesign-v2-design.md` §9). Tests in `src/lib/*.test.ts` enforce key parity, the stack list and the chatbot prompt
    ```
    Also change the structure line `lib/ — Utilities (seo, data, link-parser, chat-*)` only if it mentions anything deleted (it doesn't), and add one line under **Key conventions**: `- New copy goes through all three message files; `npm test` fails on mismatched keys, placeholders or numbers`.
  - `README.md`: update the line mentioning `profileData` ("Personal info, skills, experience, education, certifications") to match reality (`profileData`: links, stack, experience and education structure; copy lives in `messages/`), and `grep -n -i "yaml\|certif\|skills" README.md` for any other claim of YAML content or certifications; fix or delete those lines.

- [ ] **Step 8: Verify.** `npm test` (29 pass: the original 19 minus the 4 scroll-edges tests, plus 5 messages, 5 data and 4 prompt tests), `npm run lint`, `npm run build`, `npx tsc --noEmit` (no output). Then the legacy grep, which must print nothing:
  ```bash
  grep -rniE "awsCertified|AWS Certified|ProjectCarousel|SkillsBento|LastUpdated|ScrollReveal|shortDescription|fullDescription|originalStatus|ProjectLegacyText|ExperienceLegacyText|shortBio|\.certifications|skills-bento|project-card|flagcdn|languageFlags" src messages next.config.ts .claude/CLAUDE.md README.md
  ```
  (A hit in `src/lib/messages.test.ts` or the prompt test's own assertions is fine; anything else is not.) Open `/en`, `/ru`, `/uz` once more; they must look exactly as after Task 10.

- [ ] **Step 9: Commit** `chore(prune): remove legacy fields, components, YAML, certification badges and dead message keys`.

---

## Task 12: Verification matrix

No product code unless a defect is found; defects get their own fix commits (`fix(...)`), each followed by a re-run of the affected checks. Use a **production build**, not dev.

- [ ] **Step 1: Build and serve**
  ```bash
  npm run build
  npx next start -p 3100 > "$SCRATCH/start.log" 2>&1 &
  sleep 5
  ```

- [ ] **Step 2: Screenshots: 1440 and 390, light and dark, `en` and `ru`**
  ```bash
  mkdir -p "$SCRATCH/shots/final"
  node $TOOLS/shoot.mjs "$SCRATCH/shots/final" http://localhost:3100 \
    /en /en/about /en/projects /en/projects/jenkins-cicd-pipeline /en/projects/savethis4me-telegram-bot \
    /en/about/kpi-com-devops-engineer /en/contact /en/missing \
    /ru /ru/about /ru/projects /ru/projects/jenkins-cicd-pipeline /ru/about/kpi-com-devops-engineer /ru/contact
  ```
  Read the PNGs. For **every** page confirm: nothing is clipped or overlapping; the left edge is shared by nav, headings, tiles and footer; sentence case; no "AWS Certified" anywhere; no emoji flags; the chat launcher bottom-right (visible in the desktop captures after 2 seconds, which settles the handoff's open question: in v1 the launcher was present in a real Chromium run); dark mode shows black pages with `#1d1d1f` tiles and the dark diagram variants; at 390 the Home hero has a 112px photo above the text and the first screen shows the name, role and lead. Compare Home against the spec's §7.1 ASCII.

- [ ] **Step 3: Probe, three locales**
  ```bash
  node $TOOLS/probe.mjs http://localhost:3100 /en /ru /uz /en/about /ru/about /uz/about /en/projects /ru/projects /uz/projects /en/contact /ru/contact /uz/contact
  ```
  Every line `ok`. (For pages with a single `section`, the gap line is simply absent.) Also run it on one detail page per locale (`/en/projects/jenkins-cicd-pipeline /ru/about/kpi-com-devops-engineer /uz/projects/comprehensive-monitoring-stack`): the probe only measures headings of 20px and up, so the small caption headings in the aside don't count, and every line should be `ok` there too.

- [ ] **Step 4: Interactions**
  ```bash
  node $TOOLS/interact.mjs http://localhost:3100
  ```
  All `ok` (the mobile nav, chat launcher, theme and language checks pass, as they did on v1). Then by hand in a throwaway script or the browser: Tab through Home (wordmark, About, Projects, Contact, language pill, theme, CV button, Get in touch, project tiles, …) with a visible focus ring on each and a logical order; Esc closes the CV menu and the language menu; the project viewer on a detail page zooms, pans and goes fullscreen; the contact form states from Task 8; route changes never block clicks.

- [ ] **Step 5: Accessibility media**: with Playwright `page.emulateMedia({ reducedMotion: 'reduce' })` and (via CDP `Emulation.setEmulatedMedia`) `prefers-reduced-transparency: reduce` and `prefers-contrast: more`, load `/en` and confirm the nav and menus are solid, tiles gain a hairline border, and nothing animates (or fails to appear).

- [ ] **Step 6: Final greps**
  ```bash
  grep -rniE "awsCertified|AWS Certified|Kubernetes|Terraform|Ansible|Azure|Alibaba|Podman|Helm" src messages | grep -v "\.test\.ts" | grep -v "NOT USED" 
  ```
  The only acceptable hits are rule 13/14 example text in the chatbot prompt. Also `grep -rn "glass\|text-gradient\|hover:scale-\|variant=\"glass\"" src` prints nothing, and `npm run lint` is 0 warnings.

- [ ] **Step 7: Stop the server** (as its own command: `for p in $(pgrep -f "[n]ext-server|[n]ext start"); do kill "$p"; done`), commit any fixes, and write a short results note for the controller (which pages and viewports were checked, any known issues).

---

## Task 13: Whole-branch review and finish

- [ ] **Step 1: Final review.** Dispatch one Sonnet 5.5 reviewer with the spec, the copy deck, this plan's "Spec deviations", and the diff `git diff <V2_BASE>..HEAD` (V2_BASE from Task 1 Step 1). Ask it to check, in this order: every spec §7 page against the code; facts (any string that makes a claim the CV doesn't support); a11y (names for whole-tile links, focus order, the `<mail>` link, the language buttons' `aria-pressed`); i18n completeness (RU/UZ read naturally and are sentence case); dead code (`grep` for anything unused); and the Review focus list. Triage findings; blocking ones become a fix commit, re-run `npm test`, lint and build, and re-run the probe.

- [ ] **Step 2: Hand-off.** Push `apple-redesign` only if the user has said to (the cloud container is ephemeral, so ask once: "push apple-redesign now?"). Then present the finishing options and **wait for the user's choice**; do not merge or push `main`, and do not open a pull request unless asked:
  1. Merge `apple-redesign` into `main` locally.
  2. Push and open a pull request.
  3. Keep the branch as is.
  Offer the summary the user needs: the pages, the facts decisions, the three **[confirm]** items, the favicon and `<html lang>` follow-ups, and the optional per-page metadata wiring.

---

## Out of scope (unchanged from the spec, plus what implementation surfaced)

- API routes, chatbot behavior, rate limiting and logging, CV PDFs (they don't claim certification), SEO structure and `/api/deployment`.
- `public/favicon.ico` vs `src/app/favicon.ico` (Next warns on every request): delete one once you say which to keep.
- Missing `<html lang>`: the root layout doesn't know the locale; a small restructure, say go.
- Per-page metadata for About, Projects and Contact: the `metadata.*` strings exist but nothing reads them; each page would need a tiny server `layout.tsx` with `generateMetadata`.
- Removing the now-unused `js-yaml` and `@types/js-yaml` dependencies (needs `npm uninstall`).
- v1 polish debt from the final review: focus traps on the mobile chat sheet and fullscreen viewer, ref-counted scroll lock, viewer zoom sync between inline and fullscreen.
