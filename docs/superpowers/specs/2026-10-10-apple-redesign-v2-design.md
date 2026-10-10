# Apple redesign v2: editorial restructure — design spec

**Date:** 2026-10-10
**Branch:** `apple-redesign` (v1 is built on it; `main` untouched)
**Status:** Draft, awaiting your review. No product code until you approve this spec and the plan.
**Companion:** `2026-10-10-apple-redesign-v2-copy.md` (every new string in EN / RU / UZ, for your review)

## 1. Why v2

Your verdict on v1: "looks good but not perfect, something is off, maybe because it was built on top of AI
slop. Try even harder to make it professional and elegant. Adding or deleting parts is fine."

v1 got the *materials* right (tokens, type, springs, nav, chat, viewer). What reads as "off" is the
*content and composition* on top of them:

1. Every section is the same block: centered title, gray filler subtitle, content. Nothing leads.
2. The copy is generic ("comprehensive DevOps toolkit", "values", emoji fun facts) and Title Case.
3. The site contradicts itself and your CV (see §9, the fact audit).
4. No shared grid: 980 / 1200 px widths and uneven, very large gaps between sections.
5. Decoration stands in for content: rainbow bento icons, tag clutter ("+7"), a carousel with nothing to
   scroll (3 cards fit at ≥1024 px), a "Show all" toggle on a 3-item list, an emoji flag as the language switcher.

v2 changes **what is on the page and how it is arranged**. The token, type, motion and primitive layers from
v1 stay.

## 2. Decisions

| # | Decision | Made by |
|---|---|---|
| D1 | Copy is rewritten by me from facts already on the site or in your CV only. No invented metrics. RU and UZ included. You review it. | You |
| D2 | You are not AWS certified. "AWS Certified" is removed everywhere, and so is the certifications section. | You |
| D3 | Layout previews are ASCII, no browser companion. | You |
| D4 | Hero is left-aligned: text left, photo right on desktop; a 112 px circle above the text on mobile. Photo file, crop, `object-cover`, `quality={75}` and blur placeholder unchanged; 270 px on desktop. | You |
| D5 | Stop asking non-urgent questions; I decide and list the call here. Everything below marked *veto-able* is mine. | You |
| D6 | Home is five blocks: Hero, Selected work, Experience, Stack, Contact. Home is the overview; About is the depth. | Me, veto-able |
| D7 | The project carousel, skills bento, "Show all" toggles, values, fun-fact tiles, certifications, response-times block and `ScrollReveal` on page sections are deleted. | Me, veto-able |
| D8 | Stack lists only what your CV, a job entry or a project shows. Site-only skills are cut (list in §9.3); name any you want back. | Me, veto-able |
| D9 | Metrics appear only when the site **and** the CV agree. Three site-only numbers are dropped (§9.2). | Me, veto-able |
| D10 | Projects are shown as short write-ups (summary, what I built, stack), not a Problem/Outcome template, because the data has no problem statements. An optional one-line outcome appears only where the CV already states one. If you can give real outcomes, they slot into the same field. | Me, veto-able |
| D11 | "CV" leaves the nav bar (it stays in the hero and on About). Nav becomes About, Projects, Contact; the wordmark is Home. | Me, veto-able |
| D12 | The footer is one hairline row: copyright left, text links right. The X glyph replaces the bird; text links replace icon buttons. Credits, "last updated" and the template link are removed. | Me, veto-able |
| D13 | The chatbot stays (CLAUDE.md feature). Its *system-prompt facts* are updated so the bot never contradicts the site; its behavior, rate limiting and logging are untouched. | Me, veto-able |

## 3. Approaches considered

**A. Restyle pass.** Keep v1's structure; fix copy, spacing, widths. Lowest risk and fastest, but it keeps
the "same block repeated" structure you said feels off.

**B. Editorial restructure (recommended).** One grid, left-aligned type, fewer and stronger sections,
rows and tiles instead of carousel and bento, facts-only copy. Reuses v1's tokens, motion, primitives, chat,
viewer and nav. Moderate scope: about ten components change, five are deleted.

**C. One long page.** Fold About, Projects and Contact into Home as anchored sections. Most dramatic, but it
breaks the route structure, per-page SEO, the project and experience detail pages, and the i18n URLs. Rejected.

## 4. Principles

1. **One grid.** A single content width of **980 px** with gutters of 20 px (< 768) and 32 px (≥ 768),
   used by the nav, every section and the footer, so everything shares one left edge.
   Prose paragraphs cap at 40 rem. One `page-container` utility in `globals.css`; nothing else sets a max-width.
2. **One rhythm.** Sections are separated by a single gap token: 80 px (< 768) / 112 px (≥ 768).
   Sections set no vertical padding of their own. Heading-to-content gap is 24 / 32 px.
3. **Left-aligned, sentence case.** Page titles `text-title-1`; section headings `text-title-2` with an
   optional trailing plain link on the right (Apple's "Heading … See all ›"). **No section subtitles.**
   Hero name is the only `text-display`.
4. **Monochrome plus one accent.** Blue is for links, the primary button and focus. The seven system-color
   icon tints go. Color survives only in the status dot.
5. **Few surfaces.** Gray `bg-secondary` is for project tiles and grouped lists. The Stack list and the footer
   use hairlines (`border-border`), not fills, so the page isn't a column of gray boxes.
6. **Calm motion.** Keep: hero entrance, route cross-fade, press feedback, nav pill, theme transition, chat
   and viewer behavior from v1. Remove scroll-triggered reveals on page sections.
7. **Content leads.** If a block can't say something specific, it doesn't exist.

## 5. Site map

| Route | v1 | v2 |
|---|---|---|
| `/` Home | Hero, Skills bento, Experience, Projects carousel, CTA | **Hero, Selected work, Experience, Stack, Contact** |
| `/about` | Bio, Experience, Education + Certifications, Skills + Languages, Values, Fun facts | **Intro, Experience, Education, Languages** |
| `/about/[slug]` | Hero + two columns + neighbors | Same route; one "What I did" list, slim spec sheet, neighbors kept |
| `/projects` | Header + 2-column card grid | **Title + stacked project rows (all 4)** |
| `/projects/[slug]` | Header, viewer, description + specs | Same route; summary, viewer, "What I built", slim spec sheet |
| `/contact` | Form + info lists + response times | **Form + three contact rows** |

All routes, slugs, locales, CV downloads, SEO, sitemap and the 404 stay.

## 6. Global chrome

**Nav (48 px, `material-bar`, kept from v1).** Wordmark `shaxa.dev` on the container's left edge; right side:
About · Projects · Contact (13 px text, sliding pill kept), then a language control and the theme toggle.
- Language control: a text pill `EN ▾` opening the existing menu with **endonyms** (English, Русский,
  O'zbekcha), no flags.
- Mobile sheet: the three links, then language and theme inside the same sheet. CV is not in the nav (D11).
- `navigation.home` stays only as the wordmark's aria-label.

**Footer.** Hairline top border, no fill. One row on desktop, stacked on mobile:
`© 2026 Shaxriyor Jabborov` left; `GitHub · LinkedIn · X · Instagram · Email` right as 13 px text links.
Delete `last-updated.tsx` (the `/api/deployment` route stays; it is out of scope).

**`ScrollToTop`, `PageTransition`, `MotionProvider`, theme transition:** unchanged.

## 7. Pages

### 7.1 Home

```
DESKTOP 1440 (content column 980 px, centered)
┌───────────────────────────────────────────────────────────────────────────┐
│ shaxa.dev                                    About  Projects  Contact EN▾ ◐ │ nav
│                                                                           │
│  Shaxriyor                                                  ╭──────────╮  │
│  Jabborov                          display, 2 lines         │          │  │
│  DevOps engineer                   title-2, muted           │  photo   │  │
│                                                             │  270 px  │  │
│  I build cloud infrastructure, CI/CD pipelines              │          │  │
│  and monitoring on AWS and GCP.    body-lg, muted           ╰──────────╯  │
│  ⌖ Tashkent, Uzbekistan            caption                                │
│  [ Download CV ▾ ]   Get in touch ›                                       │
│                                                                           │
│  Selected work                                          All projects ›    │ 112 px gap
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ ┌────────────┐  PraaktisGo · 2025                                   │  │
│  │ │  diagram   │  Jenkins CI/CD pipeline                  title-2     │  │
│  │ │  on plate  │  An automated build, test and deploy pipeline on     │  │
│  │ │            │  Jenkins and AWS, with Prometheus watching it.       │  │
│  │ └────────────┘  Deployment time down 50%.               foreground  │  │
│  │                 Jenkins · AWS CodeDeploy · S3 · Prometheus  caption  │  │
│  │                 Learn more ›                                         │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│  ┌─ HikGateway integration (KPI · 2025) ───────────────────────────────┐  │ 16 px gaps
│  └─ Monitoring stack (KPI · 2023) ─────────────────────────────────────┘  │
│                                                                           │
│  Experience                                           More about me ›     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ [logo] KPI                                      May 2023 – present ›│  │
│  │        DevOps engineer · Full-time                                  │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │ [logo] PraaktisGo                               Jan 2025 – Jul 2026 ›│  │
│  │        DevOps engineer · Freelance                                  │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │ [logo] DataSite Technology                      Sep 2022 – May 2023 ›│  │
│  │        Frontend engineer · Internship                               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  Stack                                                                    │
│  ───────────────────────────────────────────────────────────────────────  │
│  Cloud            AWS · GCP                                               │
│  Containers       Docker                                                  │
│  CI/CD            Jenkins · GitLab CI · GitHub Actions                    │
│  Observability    Prometheus · Grafana · Loki · Alertmanager · ELK · …    │
│  Systems          Linux · Nginx · Tomcat · Vault · DNS · Load balancing   │
│  Data             PostgreSQL · MySQL · MongoDB · Redis · Kafka · …        │
│  Scripting        Python · Bash                                           │
│  ───────────────────────────────────────────────────────────────────────  │
│                                                                           │
│  Get in touch                                       title-1               │
│  For work, projects or questions, write to shaxriyor@shaxa.dev.           │
│  [ Get in touch ]                                                         │
├───────────────────────────────────────────────────────────────────────────┤
│ © 2026 Shaxriyor Jabborov            GitHub · LinkedIn · X · Instagram · Email │
└───────────────────────────────────────────────────────────────────────────┘

MOBILE 390
  nav · photo 112 px · name (2 lines) · role · lead · location · [Download CV ▾] · Get in touch ›
  Selected work: tile = diagram plate on top, text below, one column
  Experience rows: dates move under the role line (no trailing column)
  Stack rows: label above items
```

- **Hero.** Grid `md:grid-cols-[1fr_auto]`, `items-center`, 64 px gap; photo is the second column on desktop
  and the first element on mobile. The avatar `Image` props stay as they are in `page.tsx`; only the wrapper
  size changes (`size-28 md:size-[270px]`). Entrance is the v1 12 px rise on `spring.default`.
- **Project tile (`ProjectRow`, replaces `ProjectCard` + `ProjectCarousel`).** The whole tile is one `Link`.
  `rounded-tile bg-secondary`, `md:grid-cols-[5fr_6fr]`. The cover sits on an inset plate
  (`bg-background`, 12 px inset, `rounded-[calc(var(--radius-tile)-12px)]`, `aspect-[4/3]`, `object-contain`,
  24 px padding) so the Excalidraw diagrams, which range from 2.7:1 to 1.1:1, get a clean canvas in both
  themes. Eyebrow = company · year; title `text-title-2`; summary `text-body text-muted-foreground`; optional
  outcome line in foreground; four curated key technologies as one caption line; "Learn more ›" in accent.
  Press feedback is v1's `whileTap` on `spring.snappy`. No status dot on rows (all four are "Completed").
- **Experience rows** reuse `ExperienceList` + `GroupedList`, with `initialCount` removed (three rows, no
  toggle). Dates are a trailing caption; employment type explains the KPI/PraaktisGo overlap.
- **Stack** is a new `StackList`: seven hairline-separated rows, label column 176 px (`text-caption`, muted)
  and items `text-body` joined by ` · `, wrapping. No icons, no color.
- **Contact block.** Left-aligned, `text-title-1`; one sentence with the email as a link (`t.rich`); one
  primary `lg` button to `/contact`.

### 7.2 About

```
About                                                         title-1
─
I'm a DevOps engineer based in Tashkent. I build and run cloud infrastructure on AWS and GCP, automate
delivery with Jenkins and Docker, and set up the monitoring that tells a team when something is wrong.

I started in frontend development as an intern at DataSite Technology, then moved into DevOps at KPI
in 2023. I'm also studying economics at Tashkent State University of Economics.

Outside work I use Linux, go to the gym and play Clash Royale.          body-lg, 40 rem measure
[ Download CV ▾ ]

Experience                                                            title-2
  grouped list, three rows, each with a one-line summary (from the CV), links to /about/[slug]
Education
  one row: TSUE logo · Bachelor's degree in economics · 2022 – 2027
Languages
  Uzbek — Native · English — Advanced (C1) · Russian — Basic (A1)     three plain rows
```

- No photo on About (the hero has it) and no Stack (Home has it), so the two pages never repeat a block.
- The Clash Royale line is the only personality kept from the old fun facts; it is the first thing to
  cut if you'd rather not have it.

### 7.3 Projects and project detail

- `/projects`: `text-title-1` "Projects", then four `ProjectRow`s (the three featured plus SaveThis4Me).
  Empty state keeps its copy.
- `/projects/[slug]`: `‹ Projects` back link; eyebrow (company · year); `text-title-1` title; one-sentence
  summary in `text-body-lg`; the existing `MediaViewer` at full container width; then two columns
  (`lg`): **What I built** (3–6 bullets) left, a spec sheet right (Company, Year, Status, Link when present).
  The full technology list renders under the spec sheet as one muted ` · ` line, not pills.
  SaveThis4Me keeps its video, and gets an "Open in Telegram ›" link.

### 7.4 Experience detail

`‹ About` back link; logo (56 px), role `text-title-1`, company, dates. One **What I did** list (CV bullets,
§ copy deck) replaces the duplicated Responsibilities / Achievements pair. Right column: spec sheet
(Company with site link, Dates, Type). Team size, industry and location are dropped (§9.2). The technologies
line is the job's tech list as a muted ` · ` line. Prev/next neighbor rows stay.

### 7.5 Contact

`text-title-1` "Get in touch", no subtitle. `lg:grid-cols-[7fr_5fr]`: form (Name, Email, Subject, Message)
left; three contact rows (Email, Phone, Location) right. The "Contact information" and "Response times"
blocks are deleted. Validation, in-place success, inline error and the spinner button are v1's.

## 8. Components

| Action | Component |
|---|---|
| **New** | `project-row.tsx` (replaces `project-card.tsx`), `stack-list.tsx` |
| **Rewrite** | `app/[locale]/page.tsx`, `about/page.tsx`, `about/[slug]/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `contact/page.tsx`, `footer.tsx`, `navigation.tsx` (links, language control, no CV) |
| **Adjust** | `experience-list.tsx` (no toggle; `summary` line variant), `section-header.tsx` (left only, optional trailing link, no subtitle), `globals.css` (`page-container`, section-gap token), `not-found` page (translated), `chatbot` strings, `chat-system-prompt.ts` (facts only) |
| **Delete** | `project-card.tsx`, `project-carousel.tsx`, `skills-bento.tsx`, `last-updated.tsx`, `scroll-reveal.tsx` (if no remaining use), and their now-dead tests/helpers (`scroll-edges` if only the carousel used it) |
| **Keep as is** | `media-viewer`, `chat-conversation`, `cv-menu`, `grouped-list`, `status-dot`, `themed-image`, `crossfade-icon`, `motion.ts`, `pan-zoom.ts`, primitives in `ui/` |

Conventions unchanged: no barrel exports; server components by default; every new string in all three message
files; JSON edited by a script that round-trips `JSON.stringify(obj, null, 2)` with no trailing newline.

## 9. Fact audit (site vs your CV)

### 9.1 Corrections

| Item | Site today | CV / evidence | v2 |
|---|---|---|---|
| "AWS Certified" in hero (EN/RU/UZ) | Shown | Not certified | Removed (D2) |
| Certifications section | "Coming soon" placeholder | n/a | Removed (D2) |
| Chatbot prompt | Lists three AWS certs as "Planned" and an expired English certificate | n/a | Certification lines removed |
| DataSite (EN/RU/UZ messages) | "Frontend Developer", Oct 2021 – Apr 2023, "mentored junior developers", "improved page load by 30%" | "Frontend Engineer (Intern)", **Sep 2022 – May 2023**, three bullets; `data.ts` agrees | CV version |
| Company names | "PraaktisGo" and "Praaktisgo"; "KPI" | "PraaktisGo"; "kpi.com" | "PraaktisGo" and "KPI" everywhere (say if you prefer "kpi.com") |
| Footer | "Made with … Claude ☕", template link, "last updated: just now" | n/a | Removed |
| Contact page | Email and phone shown twice | n/a | Once |
| Languages | `data.ts`: English Fluent, Russian Basic, Uzbek Native (unused `profile.yaml` still says Russian Native) | Uzbek native, English C1, Russian A1 | CV levels |

### 9.2 Metrics and fields I'm leaving out because only one source has them

| Claim | Where | Why out |
|---|---|---|
| "visibility and reliability metrics by 40%" (KPI) | site only | not on CV; vague |
| "GitLab upgrade … performance by 30%" (KPI) | site only | CV says "strengthened security and performance", no number |
| "cut deployment times by 50%" at **KPI** | site only | CV attributes the 50% to PraaktisGo |
| Team size (50+, 10+, 20+/100–200) and industry | site only; DataSite conflicts between files | not on CV |
| Work location (On-site/Remote) | DataSite conflicts between files | not on CV |

Kept because both agree: AWS cost −20%, incident response −60%, 99.9% uptime, deploy time −50% (PraaktisGo),
$100K GCP credits, $10K AWS Activate credits, 15% overhead reduction, zero-downtime AWS migration.

**One inference to confirm:** I attach "Deployment time down 50%" to the PraaktisGo Jenkins project. The CV
ties the 50% to Jenkins CI/CD automation at PraaktisGo in the same period, but doesn't name the project.

### 9.3 Skills cut because no CV line, job entry or project shows them

Azure, Alibaba Cloud, DigitalOcean, Kubernetes, Podman, Containerd, Helm, Terraform, Ansible, Pulumi,
CloudFormation, ARM Templates, CDK, CircleCI, Azure DevOps, ArgoCD, Elasticsearch, DynamoDB, and the padding
items Git, YAML, JSON. "Google Cloud" is shown as "GCP" (as on the CV). Tell me any you can stand behind and
they go back, perhaps as a separate "Also worked with" row.

## 10. Data model

- `messages/*.json`, `data.projects.<slug>`: `title`, `summary` (one sentence), `outcome` (optional),
  `points` (string[]), `status`, `companyName`. `shortDescription` and `fullDescription` are retired.
- `messages/*.json`, `data.experiences.<slug>`: `company`, `position`, `duration`, `summary` (About row),
  `points` (string[]). `description`, `responsibilities`, `achievements`, `location`, `teamSize`,
  `industry` are retired.
- `src/lib/data.ts` (language-neutral): projects gain `highlights: string[]` (four key technologies);
  experiences keep `technologies`, `slug`, dates, logo, `employmentType`; `certifications` and the unused
  `skills` categories are replaced by the Stack structure (`stack: Record<StackRow, string[]>`).
  `localizeProjects` / `localizeExperiences` and the async twins are updated to the new fields.
- `profile.bio` is rewritten; `profile.shortBio` and `profile.lastUpdated` are removed.
- Old message keys that nothing uses after the rewrite are deleted (checked by a script, not by eye).

## 11. Copy and i18n

Voice: first person, plain, specific, sentence case, no adjectives that don't carry a fact ("seamless",
"comprehensive", "passionate", "modern"). Every sentence maps to a CV line or a current site fact; the copy deck
marks the source of each. Russian and Uzbek are translated from the final English, keeping the terms already used on
the site; Uzbek keeps the straight apostrophe the site uses (`o'`, `g'`). Native-speaker review is yours.

## 12. Accessibility and performance

- Everything from v1 §6 still holds (reduced motion / transparency / contrast, focus ring, 44 px targets).
- The footer text links and the language pill have visible names, so the English-only `ariaLabels.*` social
  strings go away.
- Whole-tile links get one accessible name (the project title) and no nested interactive elements.
- 404 text becomes translated (was English only).
- The hero photo stays the LCP element with `priority`; at 112 px on mobile it still ships the existing
  source set.

## 13. Verification

The cloud environment has Chromium (`/opt/pw-browsers`), Node 22 (v1 used 24) and no `node_modules`, so the
first plan task is `npm ci`, then `npm test`, `npm run lint`, `npm run build` as the baseline (v1: 19/19, 0
warnings, build passes). Per-task: lint + build. At the end, screenshots with headless Chromium at a normal
window height (tall windows break `whileInView`) of Home, About, Projects, one project, one experience, Contact:
**1440 and 390, light and dark, EN and RU**, plus `scrollWidth <= clientWidth` at 390 for EN/RU/UZ, rapid
toggle checks, and the chat launcher in a real (non-headless-artifact) run, which v1 never confirmed.
Final grep: no `awsCertified`, `AWS Certified`, `certifications`, `ProjectCarousel`, `SkillsBento`, `LastUpdated`,
`ScrollReveal` (if deleted), `shortDescription`, `fullDescription` left in `src/` or `messages/`.

## 14. Out of scope, unless you say so

- API routes, chatbot behavior, rate limiting, logging, CV PDFs (they don't claim certification), SEO structure.
- `public/favicon.ico` vs `src/app/favicon.ico` conflict (Next warns on every request): deleting one fixes it.
  I'll do it if you say which to keep.
- Missing `<html lang>` (root layout doesn't know the locale): a small restructure; worth doing, say go.
- v1 polish debt: focus traps on the chat sheet and fullscreen viewer, ref-counted scroll lock, viewer zoom sync.

## 15. For your review

1. **Copy deck** (companion file): the main item. Mark anything wrong or off-voice.
2. **§9.2 and §9.3:** anything cut that you want back.
3. **D6, D7, D11, D12:** the structural calls. Say "veto D#" and I revise.
4. **Real outcomes:** if you have a real number or result for any project, send it and I'll add it as that
   project's `outcome` line.
