# Apple-style redesign of shaxa.dev — design spec

**Date:** 2026-10-09
**Branch:** `apple-redesign`
**Status:** Approved in conversation; awaiting written-spec review

## 1. Intent

Give the whole portfolio an Apple look **and** feel: apple.com-style visuals (type, color,
whitespace, translucent materials) plus fluid, interruptible, spring-based motion, following
the principles in the `apple-design` skill (WWDC *Designing Fluid Interfaces* and related talks).

### What the user decided
- Scope is **look + feel** (visual system and interaction layer), not one or the other.
- Layouts **may be rethought**; all pages, routes, content, i18n (en/ru/uz), chatbot, and CV
  downloads stay.
- Accent is **Apple blue**: `#0071e3` (light) / `#2997ff` (dark). Everything else neutral.
- Approach is **foundation first**: tokens, motion presets, and primitives, then rebuild each
  surface on top.

### Assumptions confirmed with the user
- Particle canvas, floating icons, grid overlay, typewriter, gradient text, and the
  `glass`/`liquid-glass` utilities are removed.
- Font: SF Pro on Apple devices via `-apple-system`, Inter (with Cyrillic) elsewhere.
- The homepage avatar photo, crop, and 270px display size are unchanged (see the
  `pfp-framing-preference` memory).
- API routes, SEO/structured data, and content data are untouched. New UI strings get
  en/ru/uz keys.

### Success criteria
1. Every animation is a spring from `lib/motion.ts` or a deliberate short opacity fade; no
   fixed-duration tweens on interactive elements.
2. No input is ever blocked by an animation (page change, chat open/close, menus, nav sheet).
3. Buttons and pressable rows give feedback on press (`:active`), not by growing on hover.
4. Nav is a translucent material layer with content scrolling under it.
5. `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast: more` are
   all honored.
6. `npm run lint` and `npm run build` pass; every page looks correct at 390px and 1440px, in
   light and dark, in `en` and `ru`.

## 2. Foundation

### 2.1 Color tokens (`src/app/globals.css`)

Replace the shadcn grayscale defaults. Token names stay the same so existing utilities
(`bg-background`, `text-muted-foreground`, `bg-primary`, …) keep working.

| Token | Light | Dark |
|---|---|---|
| `--background` | `#ffffff` | `#000000` |
| `--secondary`, `--muted`, `--card`, `--accent` (surface) | `#f5f5f7` | `#1d1d1f` |
| `--foreground`, `--card-foreground`, `--secondary-foreground` | `#1d1d1f` | `#f5f5f7` |
| `--muted-foreground` | `#6e6e73` | `#86868b` |
| `--primary`, `--ring` | `#0071e3` | `#2997ff` |
| `--primary-foreground` | `#ffffff` | `#ffffff` |
| `--border`, `--input` | `rgb(0 0 0 / 8%)` | `rgb(255 255 255 / 10%)` |
| `--popover` | `#ffffff` | `#1d1d1f` |
| `--destructive` | `#e30000` | `#ff453a` |
| `--bubble-incoming` (chat) | `#e9e9eb` | `#262628` |

Remove the unused `--chart-*` and `--sidebar-*` tokens and their `@theme` mappings.
Remove the `.glass`, `.glass-dark`, `.liquid-glass*`, `.gradient-bg*`, `.text-gradient`,
`.animate-float*`, `.animate-pulse-slow`, `@keyframes float`, and `.scroll-smooth` component
classes. Keep `.line-clamp-*`. Update `<meta name="theme-color">` to `#ffffff` / `#000000`.

### 2.2 Typography

- `src/app/layout.tsx`: replace Geist/Geist Mono with `Inter` (subsets `latin`, `latin-ext`,
  `cyrillic`; variable `--font-inter`) and keep a mono face for code (`Geist_Mono` stays,
  subsets `latin`).
- `--font-sans`: `-apple-system, BlinkMacSystemFont, "SF Pro Text", var(--font-inter), system-ui, sans-serif`.
- Type scale as Tailwind 4 `@theme` font-size tokens (`--text-display`,
  `--text-display--line-height`, `--text-display--letter-spacing`,
  `--text-display--font-weight`, …), which generate the `text-*` utilities below with leading,
  tracking, and weight attached. Tracking and leading are size-specific.

| Utility | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| `text-display` | `clamp(2.75rem, 6vw, 5rem)` | 1.05 | −0.025em | 600 |
| `text-title-1` | `clamp(2rem, 4vw, 3rem)` | 1.08 | −0.02em | 600 |
| `text-title-2` | `clamp(1.5rem, 3vw, 2rem)` | 1.15 | −0.015em | 600 |
| `text-headline` | 1.25rem | 1.3 | −0.01em | 600 |
| `text-body-lg` | 1.25rem | 1.45 | −0.005em | 400 |
| `text-body` | 1.0625rem | 1.5 | 0 | 400 |
| `text-caption` | 0.8125rem | 1.4 | +0.01em | 400 |
| `text-eyebrow` | 0.875rem | 1.3 | +0.01em | 600 |

All sizes are in `rem` so user text-size settings scale the layout.

### 2.3 Materials

Three `@utility` classes:

| Utility | Use | Light | Dark |
|---|---|---|---|
| `material-bar` | Nav bar | `rgb(255 255 255 / 72%)` + `blur(20px) saturate(180%)` | `rgb(22 22 23 / 72%)` + same |
| `material-sheet` | Chat panel, menus, popovers, mobile nav sheet, notifications | `rgb(255 255 255 / 80%)` + `blur(40px) saturate(180%)` + `0 12px 48px rgb(0 0 0 / 16%)` | `rgb(30 30 32 / 80%)` + same blur + `0 12px 48px rgb(0 0 0 / 48%)` |
| `material-chip` | Small floating controls (scroll-to-top, viewer controls) | `rgb(255 255 255 / 70%)` + `blur(16px)` | `rgb(44 44 46 / 70%)` + `blur(16px)` |

- `@media (prefers-reduced-transparency: reduce)`: all three become solid (`--background` /
  `--popover`) with no `backdrop-filter`.
- `@media (prefers-contrast: more)`: solid backgrounds plus a `1px solid var(--foreground)`
  border at 40% opacity.
- Never stack one material on another.

**Radii:** `--radius` becomes `1.125rem` (18px, cards). Add `--radius-chip: 0.75rem` (12px)
and `--radius-tile: 1.75rem` (28px). Pills use `rounded-full`. The derived
`--radius-sm/md/lg/xl` grow accordingly (14/16/18/22px); untouched shadcn primitives (dialog,
popover, tooltip, tabs, accordion) inherit the softer corners, which is intended. Components
restyled in this spec set their radius explicitly.

### 2.4 Motion presets (`src/lib/motion.ts`, new)

```ts
export const spring = {
  default: { type: 'spring', bounce: 0, duration: 0.4 },   // critically damped, most UI
  snappy:  { type: 'spring', bounce: 0, duration: 0.3 },   // menus, toggles, pills
  momentum:{ type: 'spring', bounce: 0.2, duration: 0.4 }, // only after a flick/drag release
} as const;

// Apple's projection (Designing Fluid Interfaces sample code). velocity in px/s.
export function project(velocity: number, decelerationRate = 0.998): number;

// Progressive resistance past a boundary.
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number;
```

`ScrollReveal`, `TypewriterEffect` (deleted), `ParticleBackground` (deleted), and
`FloatingElements` (deleted) each hand-roll a `matchMedia` listener; `ScrollReveal` switches
to framer-motion's `useReducedMotion`.

### 2.5 Primitives

**`Button` (`components/ui/button.tsx`)**
- Base: remove every `hover:scale-*` and `hover:shadow-*`; add
  `active:scale-[0.97] transition-[transform,background-color,color] duration-100 ease-out`.
  Default shape becomes `rounded-full`.
- Variants:
  - `default`: filled `bg-primary text-primary-foreground`, hover darkens slightly.
  - `secondary`: `bg-secondary text-foreground`, hover `bg-black/[0.06] dark:bg-white/[0.12]`
    blended over it.
  - `plain`: blue text link, no background, used with a trailing `›` (`ChevronRight`),
    `active:opacity-60` instead of scale.
  - `ghost`: transparent, hover `bg-secondary`.
  - `glass`: alias of `secondary` so untouched call sites keep compiling; removed once every
    page is rebuilt (final step greps for zero usages).
  - `outline`, `destructive`, `link`: kept, restyled to the new tokens.
- Sizes: `sm` h-8, `default` h-10, `lg` h-12 (≥44px touch target), `icon` size-10.

**`Card` (`components/ui/card.tsx`)**: `bg-card rounded-[var(--radius)]`, no border, no
shadow. `prefers-contrast: more` adds a hairline border (via a `contrast-more:border` class).

**`Badge` (`components/ui/badge.tsx`)**: gray pill (`rounded-full bg-secondary text-caption`).
New `StatusDot` usage pattern: a 6px colored dot + label. Colors: Completed `#34c759`,
In progress → accent, Discontinued `#8e8e93`.

**`SectionHeader` (`components/section-header.tsx`, new)**: props `eyebrow?`, `title`,
`subtitle?`, `align?: 'center' | 'left'`. Renders `text-eyebrow` (accent), `text-title-1`,
`text-body-lg text-muted-foreground`. Replaces every gradient `<h2>` block.

**Dropdown menu (`components/ui/dropdown-menu.tsx`)**: content uses `material-sheet`,
radius 14px, `origin-(--radix-dropdown-menu-content-transform-origin)` so it scales from its
trigger; items get `rounded-[8px]` and a press highlight.

**Inputs (`input.tsx`, `textarea.tsx`)**: `min-h-11` (44px), radius 12px, `bg-secondary`,
no border at rest, 2px accent ring on focus.

## 3. Global chrome

### 3.1 Locale layout (`app/[locale]/layout.tsx`)
- Remove the grid overlay `<div>`, `ParticleBackground`, and `FloatingElements`.
- Root wrapper: `overflow-hidden` → `overflow-x-clip`.
- Wrap children in `<MotionConfig reducedMotion="user">` (via a small client wrapper, since
  the layout is a server component — `components/motion-provider.tsx`).
- `main` top padding matches the new 48px nav (`pt-12`).
- Delete `particle-background.tsx`, `floating-elements.tsx`, `typewriter-effect.tsx`,
  `parallax-section.tsx`.
- Remove the `scroll-smooth` class from `<html>`; add `scroll-behavior: smooth` inside
  `@media (prefers-reduced-motion: no-preference)` in CSS.

### 3.2 `PageTransition`
Drop `AnimatePresence mode="wait"` and the exit animation. Each route renders inside a
`motion.div` keyed by pathname with `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` over
200ms. Nothing blocks input.

### 3.3 Navigation (`components/navigation.tsx`)
- Bar: fixed, 48px, `material-bar`, no border/shadow. A bottom hairline (`--border`) fades in
  only when `scrollY > 0`.
- No slide-in on load.
- Wordmark `shaxa.dev` in `text-foreground font-semibold tracking-tight`.
- Desktop links: `text-[0.8125rem]`, muted, active = foreground. Keep the measured sliding
  pill, now `bg-secondary` with `spring.snappy`. Remove `hover:scale-105`.
- Right side: language, theme, CV as `ghost` icon/pill buttons, each ≥ 40px.
- Theme toggle: icon swap via `AnimatePresence` with opacity + scale 0.8→1 on `spring.snappy`
  (no rotation). Switching theme runs inside `document.startViewTransition` when available and
  motion is allowed, giving a ~250ms cross-fade; otherwise switches instantly.
- Mobile: hamburger opens a full-width `material-sheet` that grows down from the bar
  (`height` + opacity on `spring.default`), links stagger in (0.03s each), no `mode="wait"`,
  so tapping again mid-open reverses it. The menu/close icon cross-fades. Body scroll is
  locked while open; Esc and link taps close it.
- De-duplicate: the language menu, theme toggle, and CV menu are each rendered once as a small
  local component and reused for desktop and mobile.

### 3.4 Footer (`components/footer.tsx`)
- Full-width band on `bg-secondary`, `text-caption text-muted-foreground`.
- Row of social icons as `ghost` icon buttons; then copyright, `LastUpdated`, credit line.
- Remove the `whileInView` fade (footer is chrome, not content) and the `next-themes`
  `useTheme` import (the theme-dependent border goes away).

### 3.5 `ScrollToTop`
`material-chip`, 44px circle, positioned above the chat launcher. Enters/exits with opacity +
scale 0.9↔1 on `spring.snappy`. Uses `behavior: 'auto'` under reduced motion. Uses a passive
scroll listener.

### 3.6 `ScrollReveal`
- Transition → `spring.default`; default distance 30px → 16px.
- `delay` callers cap stagger at `Math.min(index * 0.05, 0.2)`.
- Reduced motion via `useReducedMotion` (renders children without transform).

## 4. Pages

### 4.1 Home (`app/[locale]/page.tsx`)

**Hero**
- Avatar: same `Image` source, crop, and 270px size; border becomes a 1px hairline ring.
- Name in `text-display`.
- Static role line: `hero.roles.devops` · `hero.roles.awsCertified` (e.g. "DevOps Engineer ·
  AWS Certified"), replacing the typewriter. The longer roles ("Observability & Monitoring
  Expert", …) are dropped from the hero because they wrap on mobile; their keys stay.
- Location as `text-caption` with `MapPin`.
- Short bio in `text-body-lg text-muted-foreground`, max-width 40rem.
- Actions: `default` lg pill **Download CV ▾** (existing dropdown) + `plain` **Get in touch ›**
  linking to `/{locale}/contact` (existing `cta.getInTouch` key).
- Entrance: one opacity + 12px rise on `spring.default`, no staggered delays beyond 0.1s.

**Skills → `components/skills-bento.tsx` (new, shared with About)**
- Props: `skills: Profile['skills']`.
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, `gap-4`, tiles `rounded-[var(--radius-tile)] bg-secondary p-6`.
- `cloud` and `containers` span `lg:col-span-2`; `cloud` also `lg:row-span-2` with a larger
  icon and skills listed vertically. Others are 1×1.
- Icon per category (existing Lucide icons) tinted with Apple system colors: cloud `#0a84ff`,
  containers `#30d158`, infrastructure `#bf5af2`, cicd `#ff9f0a`, monitoring `#ff453a`,
  database `#ff375f`, tools `#64d2ff`. Only icons are colored.
- Skills render as `text-body` lines/pills, not outline badges.
- One shared `categoryConfig` lives here (removes the duplicate in home and about).

**Experience → `components/experience-list.tsx` (new, shared with About)**
- Props: `experiences`, `initialCount?: number`, `variant?: 'compact' | 'detailed'`.
- Inset grouped list: `rounded-[var(--radius)] bg-secondary divide-y divide-border`.
- Row = `Link` to `/{locale}/about/{slug}`: logo (40px, rounded 10px), position (`text-headline`
  at row scale), company · employment type, duration (`text-caption`), trailing `ChevronRight`.
  `active:bg-black/[0.04] dark:active:bg-white/[0.06]` press highlight.
- `detailed` variant adds location and top-3 technologies as a caption line.
- If more than `initialCount`, a `plain` button toggles "Show all (n)" / "Show less"
  (existing keys); extra rows enter via `layout` animation on `spring.default`.

**Projects row → `components/project-carousel.tsx` (new)**
- Horizontal `overflow-x-auto snap-x snap-mandatory` row, scrollbar hidden, cards
  `snap-start`, widths `85%` (mobile) / `45%` (md) / `calc((100% - 2*gap)/3)` (lg).
- Native scrolling provides momentum and rubber-banding on touch/trackpad.
- Desktop paddles ‹ › (`material-chip`, 44px) below the row, right-aligned; each scrolls by
  the row's `clientWidth` with `scrollBy({ left, behavior: 'smooth' })` (`'auto'` under
  reduced motion); snapping then lands on the nearest card.
  Disabled state at each end tracked via a scroll listener.
- Edge fade via `mask-image` on the row, only on the side with more content.
- Shows featured projects; a `plain` **See all projects ›** link to `/{locale}/projects`
  replaces the show-all toggle.
- New i18n keys (en/ru/uz): `home.projects.seeAll`, `home.projects.previous`,
  `home.projects.next`. Remove now-unused `home.projects.showAll` / `showLess` only if no
  other usage remains.

**Closing CTA**: `text-title-1` centered, subtitle, `default` **Get in touch** + `secondary`
**View full profile** (existing keys).

**Section rhythm**: sections use `py-24 md:py-32`; content `max-w-[980px]` (Apple's content
width) except the bento and carousel at `max-w-[1200px]`. Alternate background bands
(`bg-background` / `bg-secondary`) are not used — tiles carry the surface instead.

### 4.2 `ProjectCard` (`components/project-card.tsx`)
- Whole card is one `Link` to `/{locale}/projects/{slug}` (fixes current locale-less hrefs),
  `rounded-[var(--radius-tile)] bg-secondary overflow-hidden`, `active:scale-[0.98]` on
  `spring.snappy` via `whileTap`.
- Cover: `aspect-[16/10]`, `object-contain`, padded; hover nudges image scale to 1.03 on
  `spring.default` (pointer devices only, `@media (hover: hover)`).
- Body: status dot + status label + year (`text-caption`), title `text-headline`,
  `shortDescription` `text-body text-muted-foreground line-clamp-3`, tech as a single
  `text-caption` line joined by ` · ` (first 5, then `+n`).
- Company name is plain text (no nested link).
- Theme-dependent cover uses `actualTheme` from `components/theme-provider` (resolved theme),
  not `theme === 'light'`.
- Remove the "View details" button (the card is the link) and the `featured` gradient badge.

### 4.3 Projects page (`app/[locale]/projects/page.tsx`)
`SectionHeader` (as `h1`, `text-title-1`), then `grid-cols-1 md:grid-cols-2 gap-6` of
`ProjectCard`. Empty state keeps its copy, restyled.

### 4.4 About page (`app/[locale]/about/page.tsx`)
Order and treatment:
1. Header: `text-title-1` title + subtitle.
2. Bio: 680px column, `text-body-lg`, no card.
3. Experience: `ExperienceList` `variant="detailed"`, all rows.
4. Education and Certifications: two inset grouped lists side by side on `lg`, each row with
   logo (light/dark variants via `actualTheme`), name, issuer/degree, year.
5. Skills: `SkillsBento`.
6. Languages: inset grouped list (flag, name, level).
7. Values and Fun Facts: 2×2 tiles (`bg-secondary rounded-[var(--radius-tile)] p-6`) with the
   existing icons tinted using the system colors.
All hover-overlay gradients and `glass-dark` classes are removed.

### 4.5 Experience detail (`app/[locale]/about/[slug]/page.tsx`)
- Top: `plain` **‹ Back to About** link.
- Header: logo, position `text-title-1`, company, duration, employment type.
- Two columns on `lg` (content 2/3, specs 1/3); single column on mobile.
- Content: Responsibilities and Achievements as clean lists (`Check` icon in accent for
  achievements, bullets for responsibilities), `text-body`.
- Specs sheet: inset grouped list of label/value rows (Company, Website, Location, Team size,
  Industry, Type), then Technologies as gray pills.
- Bottom: existing prev/next navigation as two large tappable rows.

### 4.6 Project detail (`app/[locale]/projects/[slug]/page.tsx`)
- Top: `plain` **‹ Back to Projects** link.
- Header: title `text-title-1`, status dot + year + company caption.
- Media: the viewer (§5.2), full content width, `rounded-[var(--radius-tile)] bg-secondary`.
- Below: description column + specs sheet (Status, Year, Company, Links) + technologies pills,
  same pattern as §4.5.
- Video projects: existing custom controls restyled as `material-chip` buttons.
- Media theme selection uses `actualTheme`.

### 4.7 Contact (`app/[locale]/contact/page.tsx`)
- Header `text-title-1` + subtitle.
- `lg:grid-cols-2`: form card (`Card`) and an inset grouped list of contact methods (email,
  phone, location, Telegram) plus the response-times block as a second grouped list.
- Inputs per §2.5. Email validated inline on blur (shows a `text-caption text-destructive`
  message under the field; cleared on valid input).
- Remove all `alert()` calls:
  - Success: the form is replaced (opacity cross-fade) by a confirmation panel with a
    `CheckCircle2` in `#34c759`, the existing `form.success` text, and a `plain`
    "Send another" button that restores the empty form. New key: `contact.form.sendAnother`.
  - Error: inline message above the submit button using the existing `form.error` text plus
    the server's error; typed data is kept.
- Submit button shows a spinner while submitting and stays the same width.

## 5. Interaction-heavy components

### 5.1 Chatbot (`components/chatbot.tsx`)
**Launcher**
- 52px circle, `bg-primary text-primary-foreground`, soft shadow, `active:scale-[0.94]`.
- Appears after 2s: opacity + scale 0.9→1 on `spring.default` (no rotation).
- Icon cross-fades between `MessageCircle` and `X`.

**Desktop panel (≥640px)**
- `material-sheet`, 360×560, `rounded-[24px]`, anchored above the launcher,
  `transform-origin: bottom right`.
- Open: opacity 0→1, scale 0.9→1 on `spring.default`. Close: the reverse, same path.
- Remove `isClosing` and the `setTimeout(300)`; closing is an `AnimatePresence` exit, so
  re-opening mid-close retargets from the current value.
- No scrim (parallel, non-blocking panel).

**Mobile sheet (<640px)**
- Full-width bottom sheet, `h-[85dvh]`, `rounded-t-[24px]`, grabber bar at top, dimming
  scrim `bg-black/30` that fades with the sheet.
- `motion.div` with `drag="y"`, `dragConstraints={{ top: 0, bottom: 0 }}`,
  `dragElastic={{ top: 0.1, bottom: 1 }}` (rubber-band upward, 1:1 downward),
  `dragMomentum={false}`.
- `onDragEnd`: `const end = offset.y + project(velocity.y)`; if `end > sheetHeight * 0.4`
  dismiss by animating `y` to `sheetHeight` with `{ ...spring.momentum, velocity: velocity.y }`,
  otherwise animate back to 0 with the same velocity handoff.
- Drag starts only from the header/grabber (`dragListener={false}` + `useDragControls`) so the
  message list still scrolls.
- `role="dialog" aria-modal="true"`, labelled by the title. Esc closes. Focus returns to the
  launcher on close.

**Conversation**
- Header: title `text-headline` + status `text-caption`, no colored bar.
- A single `text-caption` timestamp ("Today 14:02", from the first message) at the top.
- Bubbles: user right, `bg-primary text-primary-foreground`; assistant left,
  `bg-[var(--bubble-incoming)] text-foreground`; `rounded-[18px]`, max-width 80%, no avatars,
  no per-message timestamps. New bubbles enter with opacity + 8px rise on `spring.snappy`.
- Typing indicator: three dots in an incoming bubble, opacity pulse (CSS, 1.2s); static under
  reduced motion.
- Input: pill field (`bg-secondary`, 40px) with the send button inside on the right, an
  `ArrowUp` in a 30px circle, `bg-primary` when enabled, `bg-muted-foreground/30` when not.
- `onKeyPress` → `onKeyDown`. Scroll-to-bottom runs in an effect via
  `requestAnimationFrame` instead of `setTimeout(100)`. Input focus uses `autoFocus` on open
  (desktop) instead of timeouts.

**Welcome popup**
- Same timing (show at 3s, auto-hide at 8s, paused on hover).
- `material-sheet` notification, 300px, `rounded-[20px]`, rises from the launcher
  (`transform-origin: bottom right`, `spring.default`). Buttons: `default` sm **Start chat** +
  `ghost` sm **Maybe later**.

### 5.2 Project media viewer (`components/media-viewer.tsx`, new — extracted from the
project detail page)
- Props: `src`, `alt`, `isVideo`, plus the existing video props.
- Image panning uses `useMotionValue` x/y and `scale`.
- Pointer Events with `setPointerCapture`; grab offset preserved; works with mouse, touch, pen.
- Panning is enabled only when `scale > 1`. At `scale === 1` the element has
  `touch-action: pan-y` so the page scrolls normally; when zoomed, `touch-action: none`.
- **No page-scroll hijack:** remove the `body.style.overflow = 'hidden'` on mouse enter.
  Plain wheel scrolls the page; `ctrlKey`/`metaKey` + wheel (trackpad pinch on macOS) zooms
  around the pointer.
- Zoom buttons (+, −, reset, fullscreen) as `material-chip` buttons overlaid bottom-center;
  zoom animates from the current scale on `spring.default`; range 1×–3×.
- During drag, positions past the pan bounds pass through `rubberband()`.
- On release: `target = clamp(current + project(velocity), bounds)`; animate x/y to it with
  `{ ...spring.momentum, velocity }` (independent X and Y springs).
- Fullscreen: inline and fullscreen media share a `layoutId`, so the image expands from its
  inline position and returns there on close. Scrim `bg-black/90` (both themes) fades in;
  Esc and the close chip dismiss; body scroll locked only while fullscreen is open.
- Video keeps current behavior (autoplay muted, play/pause, mute) with restyled controls;
  fullscreen for video keeps the existing "not available" message.

## 6. Accessibility

- `MotionConfig reducedMotion="user"` at the root; global CSS reduced-motion rule kept as a
  backstop.
- Smooth scrolling, the theme view-transition, and the carousel `smooth` scroll are skipped
  under reduced motion.
- Materials honor `prefers-reduced-transparency` and `prefers-contrast: more` (§2.3).
- Focus: `focus-visible:outline-2 outline-offset-2 outline-[var(--ring)]` on all interactive
  elements (replaces the 3px ring).
- Touch targets ≥ 44px for all primary controls.
- Existing `aria-label`s are preserved; new controls (carousel paddles, viewer chips, sheet
  grabber) get translated labels.

## 7. Verification

No test suite exists and the work is visual, so each implementation step must:
1. Pass `npm run lint` and `npm run build`.
2. Be checked in a browser (`npm run dev`) on the affected pages:
   - widths 390px and 1440px, light and dark themes, `en` and `ru` locales;
   - keyboard tab-through (visible focus, logical order, Esc closes overlays);
   - DevTools emulation of `prefers-reduced-motion`, `prefers-reduced-transparency`, and
     `prefers-contrast: more`.
3. Interaction checks where relevant:
   - chat launcher clicked twice quickly (panel reverses mid-flight, never stuck);
   - mobile chat sheet flicked down (dismisses) and dragged slightly (snaps back);
   - mobile nav sheet tapped open/closed rapidly;
   - carousel paddles disabled at both ends; native swipe snaps to cards;
   - zoomed image dragged past an edge (resists, then springs back inside);
   - route changes never block clicks.
4. Final step: `grep` confirms no remaining `glass`, `glass-dark`, `text-gradient`,
   `liquid-glass`, `hover:scale-`, or `variant="glass"` usages, and the removed components
   have no imports.

Work happens on the `apple-redesign` branch, one commit per step.

## 8. Out of scope

- API routes (`/api/chat`, `/api/contact`, `/api/deployment`), chatbot prompt/logging/rate limits.
- Content and data (`src/data/*`, `src/lib/data.ts`), CV PDFs, the avatar image.
- SEO metadata, `structured-data.tsx`, sitemap, robots.
- Touch pinch-zoom in the media viewer (buttons cover zoom on touch).
- New pages or routes; adding a test framework.
