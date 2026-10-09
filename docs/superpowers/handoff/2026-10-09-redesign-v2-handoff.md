# Handoff: Apple redesign v2 ("make it professional and elegant")

Written 2026-10-09 at the end of a local Claude Code session, to continue in cloud Claude Code.
Repo: `github.com/ilyshaxa/shaxa.dev`. Branch: **`apple-redesign`** (not merged; `main` is untouched).

## 1. Where things stand

### v1 is done (on this branch)
An Apple-style look-and-feel redesign was designed, planned and implemented in 13 tasks, then reviewed.
- Spec: `docs/superpowers/specs/2026-10-09-apple-redesign-design.md`
- Plan: `docs/superpowers/plans/2026-10-09-apple-redesign.md`. Read its "Spec deviations" and "Global Constraints" sections; the user approved them.
- Commits `67a52d4..33f006a` are on top of `main` at `c0c3e9f`.
- State at handoff:
  - `npm test` (Node 24 built-in runner, `src/lib/**/*.test.ts`): 19/19 pass.
  - `npm run lint`: 0 errors and 0 warnings.
  - `npm run build`: passes.
- The work was executed subagent-driven, with every implementer and reviewer on **Sonnet 5.5**, as the user asked. A final whole-branch review passed after one fix wave (`33f006a`).
- The v1 building blocks to reuse:
  - Tokens, type scale and materials: `src/app/globals.css`
  - Spring presets and gesture math, with tests: `src/lib/motion.ts`
  - `cn()` that knows the custom classes: `src/lib/utils.ts`
  - Primitives in `src/components/ui/*`, plus `section-header`, `grouped-list`, `status-dot`, `crossfade-icon`, `themed-image`, `cv-menu`, `media-viewer`, `project-carousel`, `skills-bento`, `experience-list`, `chat-conversation`

### The user's verdict on v1
"It looks good but not perfect, something is off, maybe because it was built on top of AI slop. Try even harder to make it professional. I don't mind if you add or delete parts to make the website even more elegant."

### v2 is mid-brainstorm (superpowers:brainstorming, **architectural path**)
Nothing for v2 has been written to code. Resume brainstorming at the step below.

## 2. Diagnosis already given to the user (from headless-Chrome screenshots of the dev server)
1. **Every section is the same block:** centered title + gray filler subtitle + content. Nothing leads or builds; it reads as a template.
2. **Generic copy (the main "AI slop" tell).**
   - Subtitles like "A comprehensive DevOps toolkit for modern infrastructure", "My professional journey and key achievements", "A showcase of my recent work and side projects", "I'm always interested in new opportunities…".
   - About-page value cards ("User-Centric Design / Continuous Learning / Collaboration / Code Quality") and emoji fun facts ("⚔️ Clash Royale Pro", "🐧 Linux Aficionado").
   - Title Case buttons and headings ("Get In Touch", "View Full Profile", "Send Message"). Apple uses sentence case.
3. **Credibility leaks.**
   - The hero says "AWS Certified", but About says "Certifications coming soon".
   - Footer: "Made with Next.js, TypeScript & Claude ☕", "Feel free to use this template from my GitHub", "Last updated: just now".
   - The contact page lists email and phone twice ("Contact Information" plus "Response Times").
4. **No shared grid.** Different left edges for the skills bento (1200px), experience list (980px), projects row and nav. The vertical gaps between sections are huge and uneven, so the page feels empty rather than calm.
5. **Decoration instead of content.**
   - The bento uses 7 rainbow icon colors, its Cloud tile is mostly empty, and the skill list pads with "YAML, JSON".
   - The language switcher is an emoji flag 🇬🇧.
   - Project cards end in tag clutter ("+7", "+16") and truncated descriptions. Company spelling is inconsistent ("PraaktisGo" vs "Praaktisgo").
6. **Mobile hero.** The 270px avatar fills the first screen, and the role line wraps into a dangling "· AWS Certified".

**Proposed direction (stated, not yet approved):**
- Change what's on the page and how it's arranged, not just restyle again: one alignment grid, left-aligned editorial typography, fewer and stronger sections.
- Show projects as short case studies.
- Cut the filler sections: values, fun facts, the certifications placeholder, response times, and footer credits.

## 3. Decisions the user has made in v2 (binding)
- **Copy:** "I rewrite, you review."
  - Claude drafts tight, specific, first-person English copy using **only facts already on the site or CV**, with no invented metrics or achievements, plus ru/uz translations.
  - The user reviews and corrects before anything ships.
  - Sentence case.
- **AWS certification:** the user is **not** certified yet (the data lists Cloud Practitioner, SA Pro and DevOps Pro all as "Planned").
  - Remove "AWS Certified" everywhere. The hero role line currently uses `home.hero.roles.awsCertified` in `src/app/[locale]/page.tsx`.
  - Remove the certifications section and its "coming soon" empty state until a certification is earned.
- **Visual companion (browser mockups): declined.** Show layout options as ASCII previews in AskUserQuestion instead. This worked well in v1.

## 4. Next steps (resume here)
1. Continue clarifying questions, **one at a time** (multiple choice with ASCII previews where it's a layout question). Still open:
   - **Hero composition.** Left-aligned editorial vs centered, and photo size and placement. **Constraint:** keep the user's current photo `public/images/profile.jpg` and its framing. They care about it: head centered horizontally, tight crop with the head filling 60%+ of the circle, high quality, `quality={75}` with the blur placeholder in `src/lib/avatar.ts`. Don't swap or re-crop the photo without asking.
   - **Section list for Home and About.** What to keep, cut or merge. Proposed cuts are listed in §2. Also decide whether the skills bento stays (monochrome, curated) or becomes a compact "What I work with" list.
   - **Projects as case studies.** Problem, approach and stack, without invented outcome numbers. Ask the user whether they can supply real outcomes.
   - **Footer contents.** Socials only? Twitter's bird icon is outdated; ask about an X icon or dropping it.
   - Whether to keep the chatbot. It is a CLAUDE.md feature, so the default is keep.
2. Propose 2–3 approaches with a recommendation.
3. Present the design in sections and get approval on each.
4. Write the spec to `docs/superpowers/specs/2026-10-09-apple-redesign-v2-design.md` (use the real date if later), self-review it, commit, and ask the user to review.
5. Run superpowers:writing-plans to write the plan to `docs/superpowers/plans/…-apple-redesign-v2.md`. Ask for an execution method; last time the user chose **subagent-driven with Sonnet 5.5**, so confirm.
6. After implementation, take screenshots of the result (desktop 1440 and mobile 390, light and dark, en and ru) before claiming done. The user values visual verification. Locally this was done with `google-chrome --headless=new --screenshot` at a normal window height; tall windows break `whileInView` reveals. In the cloud, use whatever headless browser is available. If none is, say so.
7. Finish with superpowers:finishing-a-development-branch (merge, PR, or keep). Nothing is merged yet.

## 5. Things to verify or keep in mind
- **Chat launcher visibility.** In headless screenshots the chat launcher (bottom-right, appears after 2s) never showed up. That could be a headless or lazy-load artifact. Verify in a real browser.
- **Pre-existing, not caused by the redesign:**
  - `public/favicon.ico` and `src/app/favicon.ico` conflict, and Next warns on every favicon request. Deleting one fixes it; ask first.
  - `<html lang>` is missing, because the root layout doesn't know the locale.
- **Known polish debt from the v1 final review**, all judged OK to ship:
  - no focus trap on the mobile chat sheet or the fullscreen viewer
  - scroll-lock helpers aren't ref-counted
  - the 404 text, scroll-to-top label and footer social labels are English-only
  - small duplicated constants (language list in `navigation.tsx` and `cv-menu.tsx`; pressable row classes)
  - in the image viewer, inline and fullscreen zoom aren't synced
- **v1 controller rulings still in force** (don't relitigate):
  - every subagent runs on Sonnet 5.5
  - arbitrary rem text sizes are OK on component-level text
  - `transition-colors` hover changes are allowed
  - 100ms CSS `scale` press feedback is allowed
  - `sm` and `default` buttons stay 32 and 40px for secondary controls, and primary CTAs use `lg` (48px)
  - the CV menu may open over the mobile nav sheet
  - commit trailers credit the model that wrote the commit
- **Apple-design principles in use.** The local `apple-design` skill isn't available in the cloud, so this is a summary:
  - springs, interruptible and velocity-aware; critically damped by default, bounce only after a flick
  - feedback on press, not hover
  - momentum projection (`project()` in `lib/motion.ts`) and rubber-banding at edges
  - translucent materials with reduced-transparency and high-contrast fallbacks
  - size-specific tracking and leading
  - sentence case
  - purpose, simplicity and craft over decoration
- **Project conventions (CLAUDE.md):** no barrel exports; server components by default; i18n strings live in `messages/{en,ru,uz}.json` and every new string needs all three. Edit the JSON with a script that round-trips `JSON.stringify(obj, null, 2)` with no trailing newline.
- **Commits** end with a `Co-Authored-By:` trailer for the model that wrote them. Don't stage `.claude/settings.local.json`.
