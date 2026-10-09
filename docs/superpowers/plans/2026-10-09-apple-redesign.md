# Apple-Style Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild shaxa.dev's visual system and interaction layer in Apple's style: apple.com typography, color, and materials, plus spring-based, interruptible motion. Every page, route, piece of content, and locale stays.

**Architecture:** Build the foundation first: color/type/material tokens in `globals.css`, a tested `lib/motion.ts` with spring presets and gesture math, and restyled shadcn primitives plus a few shared building blocks (`SectionHeader`, `GroupedList`, `StatusDot`, `CrossfadeIcon`). Then rebuild each surface on top of them: chrome → nav → projects → home → about → detail pages → contact → chatbot. Every task leaves the site building and working.

**Tech Stack:** Next.js 15.5 (App Router, Turbopack), React 19, TypeScript 5.9, Tailwind CSS 4.1, framer-motion 12.23, next-intl 4, Radix/shadcn, tailwind-merge 3.3, Node 24 built-in test runner.

**Spec:** `docs/superpowers/specs/2026-10-09-apple-redesign-design.md`. Read it alongside this plan.

**Baseline (verified 2026-10-09 on `apple-redesign`):** `npm run lint` gives 0 errors and 2 warnings, both in `src/components/navigation.tsx`, which Task 5 removes. `npm run build` passes.

## Spec deviations (flagged for the user's review)

1. **`--primary-fill` token.** Filled surfaces (primary buttons, user chat bubbles, chat launcher, send button, default badge) use `#0071e3` in both themes. White text on the dark-mode accent `#2997ff` is only 3.0:1, which fails WCAG AA; `#0071e3` gives 4.7:1. apple.com does the same: `#2997ff` for dark-mode links, `#0071e3` for buttons. `--primary` stays `#0071e3` / `#2997ff` for text, links, rings, and eyebrows, as specced.
2. **Translucent fills.** The `secondary` button, the `secondary` badge, and inputs use translucent fills (`black/5%`, `white/10%`) instead of `bg-secondary`, so they stay visible when placed on a `bg-secondary` card.
3. **Carousel arrows.** They use a translucent gray fill, not `material-chip`. A light material on the plain white page background is invisible.
4. **New strings.** Previous/Next live under `common.previous` / `common.next`, shared by the carousel and the experience prev/next nav. The spec only listed `home.projects.*`. Strings the spec implied but didn't list are also added: `contact.form.invalidEmail`, viewer and video control labels, and `chatbot.today`.
5. **Experience-detail specs sheet.** Rows are labelled with icons (location, team size, industry, dates, type, website) instead of text labels, so no new label strings are needed.
6. **Contact methods.** The list has no Telegram row, because the profile data has no Telegram link.
7. **Fullscreen and browser Back.** The fullscreen image viewer no longer closes on browser Back. The old code pushed a history entry on every open and never removed it, so Back needed two presses.
8. **Chat input.** The input stays enabled while a reply loads; only Send is disabled ("never lock out input"). The message list uses a native scroll container instead of Radix `ScrollArea`.
9. **Icon buttons.** `size="icon"` is 44px (`size-11`), not 40px, to meet the spec's 44px touch-target rule.
10. **Pure-function tests.** These run on Node's built-in `node:test` through a new `npm test` script, with no new dependency. This needs `allowImportingTsExtensions` in `tsconfig.json`.

## Global Constraints

- Work on branch `apple-redesign`, with one commit per task. End every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **No new npm dependencies.**
- Colors are exactly as in spec §2.1 plus deviation 1. Light: background `#ffffff`, surface `#f5f5f7`, text `#1d1d1f`, muted `#6e6e73`, accent `#0071e3`. Dark: background `#000000`, surface `#1d1d1f`, text `#f5f5f7`, muted `#86868b`, accent `#2997ff`. `--primary-fill` is `#0071e3` in both.
- **Motion:**
  - Every transition on an interactive element uses `spring.default`, `spring.snappy`, or `spring.momentum` from `src/lib/motion.ts`.
  - Allowed non-spring exceptions: opacity-only fades of 250ms or less (page enter 200ms, theme view-transition 250ms, fullscreen scrim 250ms), Radix menu CSS enter/exit, the typing-dots pulse, and 100ms CSS `scale` press feedback.
  - Bounce (`spring.momentum`) only after a drag or flick release.
- No `hover:scale-*` anywhere. Press feedback uses `active:` or framer `whileTap`.
- New and changed text uses the type tokens (`text-display`, `text-title-1`, `text-title-2`, `text-headline`, `text-body-lg`, `text-body`, `text-caption`, `text-eyebrow`). No `text-3xl`-style sizes in new code.
- Content width is `max-w-[980px]`. Bento, carousel, projects grid, project detail, and contact use `max-w-[1200px]`.
- Primary controls have touch targets of at least 44px.
- Never stack one `material-*` surface on another.
- Every new user-facing string exists in `messages/en.json`, `ru.json`, and `uz.json`.
- The homepage avatar keeps its photo, crop, `object-cover`, 270px size, and `quality={75}`.
- CLAUDE.md conventions: no barrel exports, and server components by default (`'use client'` only when a file uses hooks, state, or event handlers).
- Tailwind 4 animates `scale` and `translate` as separate CSS properties. Arbitrary transition lists must name `scale` (for example `transition-[scale,opacity]`), not `transform`.

## Review Focus

These are the inputs most likely to bite real users that the spec implies but doesn't spell out. Each line has a check in the task that owns the code.

1. **Long Russian/Uzbek strings at 390px.** The nav, hero role line, bento tiles, grouped-list rows, and buttons must not cause horizontal page scroll. Check with `document.documentElement.scrollWidth <= document.documentElement.clientWidth` in the console, which should log `true`. Owned by Tasks 5, 7, and 13.
2. **Rapid repeated input on animated toggles.** Applies to the hamburger, chat launcher, fullscreen viewer, and "Show all". The end state must match the last input, never stuck half-open or blank. Owned by Tasks 5, 7, 10, and 12.
3. **OS dark mode with no saved theme.** Theme-dependent images (project covers, cert/education logos, project media) must show their dark variant, with no hydration warnings in the console. Owned by Tasks 6 and 8.
4. **Chat sends while a reply is pending.** Closing the chat mid-request, then reopening, shows the reply exactly once. Pressing Enter repeatedly while loading sends nothing extra. Owned by Task 12.
5. **Carousel when every card fits.** With 3 featured projects at 1024px wide or more, both arrows are disabled and there is no edge fade. A unit test covers this in Task 6, plus a browser check.

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/app/globals.css` | rewrite (T1) | Tokens, type scale, materials, base a11y rules, keyframes |
| `src/app/layout.tsx` | rewrite (T1) | Fonts (Inter + Geist Mono), theme-color, theme script |
| `src/lib/utils.ts` | modify (T1) | `cn()` that knows the custom type scale and radii |
| `src/lib/utils.test.ts` | create (T1) | `cn()` merge tests |
| `messages/{en,ru,uz}.json` | modify (T1) | New UI strings |
| `src/lib/motion.ts` (+ `.test.ts`) | create (T2) | Spring presets, projection, rubber-banding, velocity tracking, dismissal |
| `src/components/motion-provider.tsx` | create (T2) | `MotionConfig` with reduced motion and default spring |
| `src/components/scroll-reveal.tsx` | rewrite (T2) | Spring-based reveal |
| `src/components/ui/{button,card,badge,input,textarea}.tsx` | rewrite (T3) | Apple-style primitives |
| `src/components/ui/dropdown-menu.tsx` | modify (T3) | Material menu that scales from its trigger |
| `src/components/{section-header,status-dot,grouped-list,crossfade-icon}.tsx` | create (T3) | Shared building blocks |
| `src/app/[locale]/layout.tsx` | modify (T2, T4) | `MotionProvider`; decorative layers removed |
| `src/components/{page-transition,scroll-to-top,footer}.tsx` | rewrite (T4) | Chrome |
| `src/components/{particle-background,floating-elements}.tsx`, `public/grid.svg` | delete (T4) | |
| `src/components/navigation.tsx` | rewrite (T5) | Frosted bar, mobile sheet, menus |
| `src/components/cv-menu.tsx` | create (T5) | Shared CV download menu |
| `src/lib/use-themed-src.ts`, `src/components/themed-image.tsx` | create (T6) | Hydration-safe light/dark asset choice |
| `src/lib/scroll-edges.ts` (+ `.test.ts`) | create (T6) | Carousel edge detection |
| `src/components/{project-card,project-carousel}.tsx` | rewrite/create (T6) | Project tiles and snap row |
| `src/app/[locale]/projects/page.tsx` | rewrite (T6) | |
| `src/lib/avatar.ts`, `src/lib/employment-type.ts` | create (T7) | Avatar blur constant; employment-type key map |
| `src/components/{skills-bento,experience-list}.tsx` | create (T7) | Shared with About |
| `src/app/[locale]/page.tsx` | rewrite (T7) | Home |
| `src/components/{typewriter-effect,parallax-section}.tsx` | delete (T7) | |
| `src/app/[locale]/about/page.tsx` | rewrite (T8) | |
| `src/app/[locale]/about/[slug]/page.tsx` | rewrite (T9) | |
| `src/lib/pan-zoom.ts` (+ `.test.ts`), `src/components/media-viewer.tsx` | create (T10) | Pan/zoom math and viewer |
| `src/app/[locale]/projects/[slug]/page.tsx` | rewrite (T10) | |
| `src/lib/validation.ts` (+ `.test.ts`) | create (T11) | Email check |
| `src/app/[locale]/contact/page.tsx` | rewrite (T11) | |
| `src/lib/use-media-query.ts`, `src/components/chat-conversation.tsx` | create (T12) | |
| `src/components/chatbot.tsx` | rewrite (T12) | |
| `src/app/[locale]/not-found.tsx`, `src/app/not-found.tsx` | rewrite (T13) | |
| `src/components/skill-badge.tsx` | delete (T13) | Dead code (no importers) |

## Verification conventions (used by every task)

- **Unit tests:** run `npm test`. It runs `src/lib/**/*.test.ts` on Node's runner.
- **Lint:** run `npm run lint`. It must report 0 errors, and warnings must not exceed the baseline (2 before Task 5, 0 from Task 5 on).
- **Build:** run `npm run build`. It must end with the route table and no `Failed to compile` / `Type error`. Stop any running `npm run dev` first, since both write `.next/`.
- **Browser check:**
  - Start `npm run dev` and open `http://localhost:3000/en` (and `/ru`).
  - Test at 390px with DevTools device toolbar and at 1440px wide, in light and dark (nav theme toggle, or set the OS theme and clear `localStorage.theme`).
  - Emulate media features under DevTools → Rendering: `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`.
  - The console must show no errors and no hydration warnings.

---

### Task 1: Foundation: tokens, type scale, materials, fonts, `cn()`, strings

**Files:**
- Modify: `package.json` (scripts), `tsconfig.json` (compilerOptions)
- Create: `src/lib/utils.test.ts`
- Modify: `src/lib/utils.ts`
- Rewrite: `src/app/globals.css`, `src/app/layout.tsx`
- Modify: `messages/en.json`, `messages/ru.json`, `messages/uz.json`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - Tailwind utilities:
    - type: `text-display`, `text-title-1`, `text-title-2`, `text-headline`, `text-body-lg`, `text-body`, `text-caption`, `text-eyebrow`
    - colors: `bg-primary-fill`, `bg-bubble-incoming`, `text-success` / `bg-success`
    - radii: `rounded-chip` (12px), `rounded-tile` (28px), `rounded-lg` (18px)
    - other: `animate-typing`, `scrollbar-none`
  - CSS classes `material-bar`, `material-sheet`, `material-chip`.
  - `cn()` correctly merges those classes.
  - `npm test`.
  - Message keys (en/ru/uz):
    - `common.previous`, `common.next`
    - `home.projects.seeAll`
    - `contact.form.sendAnother`, `contact.form.invalidEmail`
    - `projects.zoomIn`, `projects.zoomOut`, `projects.resetZoom`, `projects.enterFullscreen`
    - `projects.play`, `projects.pause`, `projects.mute`, `projects.unmute`
    - `chatbot.today` (takes `{time}`)

- [ ] **Step 1: Add the test script and allow `.ts` import extensions**

In `package.json`, change the `scripts` block to:

```json
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "test": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test \"src/lib/**/*.test.ts\""
  },
```

In `tsconfig.json`, add one line after `"noEmit": true,`:

```json
    "noEmit": true,
    "allowImportingTsExtensions": true,
```

(Node's type-stripping runner needs explicit `.ts` import paths in tests, and `next build` type-checks the test files.)

- [ ] **Step 2: Write the failing test**

Create `src/lib/utils.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './utils.ts';

test('type-scale classes survive next to text colors', () => {
  assert.equal(cn('text-body', 'text-muted-foreground'), 'text-body text-muted-foreground');
  assert.equal(cn('text-caption text-primary'), 'text-caption text-primary');
});

test('a later type-scale class replaces an earlier one', () => {
  assert.equal(cn('text-body', 'text-caption'), 'text-caption');
});

test('custom radii conflict with built-in radii', () => {
  assert.equal(cn('rounded-tile', 'rounded-full'), 'rounded-full');
  assert.equal(cn('rounded-full', 'rounded-chip'), 'rounded-chip');
});
```

- [ ] **Step 3: Run it and confirm it fails**

Run: `npm test`
Expected: 2 failures. `type-scale classes survive…` gets `'text-muted-foreground'`, because stock tailwind-merge reads `text-body` as a text color and drops it. `custom radii…` gets `'rounded-tile rounded-full'`. One test passes.

- [ ] **Step 4: Teach `cn()` the custom scale**

Replace the entire contents of `src/lib/utils.ts` with:

```ts
import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register the custom type scale and radii from globals.css. Without this, tailwind-merge
// treats `text-body` as a text color and silently drops it next to `text-muted-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "title-1", "title-2", "headline", "body-lg", "body", "caption", "eyebrow"],
      radius: ["chip", "tile"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npm test`
Expected: `pass 3`, `fail 0`.

- [ ] **Step 6: Rewrite the global stylesheet**

Replace the entire contents of `src/app/globals.css` with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--font-inter), system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", var(--font-geist-mono), monospace;
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-fill: var(--primary-fill);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-bubble-incoming: var(--bubble-incoming);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-chip: 0.75rem;
  --radius-tile: 1.75rem;
}

/* Type scale: leading and tracking tighten as size grows; body stays near zero tracking. */
@theme {
  --text-display: clamp(2.75rem, 6vw, 5rem);
  --text-display--line-height: 1.05;
  --text-display--letter-spacing: -0.025em;
  --text-display--font-weight: 600;
  --text-title-1: clamp(2rem, 4vw, 3rem);
  --text-title-1--line-height: 1.08;
  --text-title-1--letter-spacing: -0.02em;
  --text-title-1--font-weight: 600;
  --text-title-2: clamp(1.5rem, 3vw, 2rem);
  --text-title-2--line-height: 1.15;
  --text-title-2--letter-spacing: -0.015em;
  --text-title-2--font-weight: 600;
  --text-headline: 1.25rem;
  --text-headline--line-height: 1.3;
  --text-headline--letter-spacing: -0.01em;
  --text-headline--font-weight: 600;
  --text-body-lg: 1.25rem;
  --text-body-lg--line-height: 1.45;
  --text-body-lg--letter-spacing: -0.005em;
  --text-body: 1.0625rem;
  --text-body--line-height: 1.5;
  --text-body--letter-spacing: 0em;
  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.4;
  --text-caption--letter-spacing: 0.01em;
  --text-eyebrow: 0.875rem;
  --text-eyebrow--line-height: 1.3;
  --text-eyebrow--letter-spacing: 0.01em;
  --text-eyebrow--font-weight: 600;

  --animate-typing: typing 1.2s ease-in-out infinite;

  @keyframes typing {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 1; }
  }
}

:root {
  --radius: 1.125rem;
  --background: #ffffff;
  --foreground: #1d1d1f;
  --card: #f5f5f7;
  --card-foreground: #1d1d1f;
  --popover: #ffffff;
  --popover-foreground: #1d1d1f;
  --primary: #0071e3;
  --primary-fill: #0071e3;
  --primary-foreground: #ffffff;
  --secondary: #f5f5f7;
  --secondary-foreground: #1d1d1f;
  --muted: #f5f5f7;
  --muted-foreground: #6e6e73;
  --accent: #f5f5f7;
  --accent-foreground: #1d1d1f;
  --destructive: #e30000;
  --success: #34c759;
  --border: rgb(0 0 0 / 8%);
  --input: rgb(0 0 0 / 8%);
  --ring: #0071e3;
  --bubble-incoming: #e9e9eb;
  --material-bar: rgb(255 255 255 / 72%);
  --material-sheet: rgb(255 255 255 / 80%);
  --material-chip: rgb(255 255 255 / 70%);
  --material-shadow: 0 12px 48px rgb(0 0 0 / 16%);
}

.dark {
  --background: #000000;
  --foreground: #f5f5f7;
  --card: #1d1d1f;
  --card-foreground: #f5f5f7;
  --popover: #1d1d1f;
  --popover-foreground: #f5f5f7;
  --primary: #2997ff;
  --primary-fill: #0071e3;
  --primary-foreground: #ffffff;
  --secondary: #1d1d1f;
  --secondary-foreground: #f5f5f7;
  --muted: #1d1d1f;
  --muted-foreground: #86868b;
  --accent: #1d1d1f;
  --accent-foreground: #f5f5f7;
  --destructive: #ff453a;
  --success: #30d158;
  --border: rgb(255 255 255 / 10%);
  --input: rgb(255 255 255 / 10%);
  --ring: #2997ff;
  --bubble-incoming: #262628;
  --material-bar: rgb(22 22 23 / 72%);
  --material-sheet: rgb(30 30 32 / 80%);
  --material-chip: rgb(44 44 46 / 70%);
  --material-shadow: 0 12px 48px rgb(0 0 0 / 48%);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
  :focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }

  /* Respect user's motion preferences for better performance and accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer components {
  /* Translucent materials: content scrolls underneath; heavier blur for bigger surfaces. */
  .material-bar {
    background-color: var(--material-bar);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);
  }

  .material-sheet {
    background-color: var(--material-sheet);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    backdrop-filter: blur(40px) saturate(180%);
    box-shadow: var(--material-shadow);
  }

  .material-chip {
    background-color: var(--material-chip);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    backdrop-filter: blur(16px) saturate(180%);
  }

  @media (prefers-reduced-transparency: reduce) {
    .material-bar,
    .material-chip {
      background-color: var(--background);
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
    .material-sheet {
      background-color: var(--popover);
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
  }

  @media (prefers-contrast: more) {
    .material-bar,
    .material-chip,
    .material-sheet {
      background-color: var(--background);
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
      border: 1px solid color-mix(in srgb, var(--foreground) 40%, transparent);
    }
  }

  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}

@utility scrollbar-none {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

/* Theme switch cross-fade (see ThemeToggle in navigation.tsx). */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 250ms;
}
```

- [ ] **Step 7: Switch fonts and theme-color in the root layout**

Replace the entire contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

// Apple platforms render SF Pro through -apple-system (see --font-sans in globals.css);
// everyone else gets Inter, including Cyrillic for the Russian locale.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* DNS Prefetch & Preconnect for external resources */}
        <link rel="preconnect" href="https://vercel.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://vercel.com" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const storageKey = 'theme';
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
    const systemDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const wantDark = stored === 'dark' || (!stored || stored === 'system') && systemDark;
    const root = document.documentElement;
    if (wantDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  } catch {}
})();`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

(The font variables move from `<body>` to `<html>`, so `var(--font-inter)` resolves wherever `font-sans` is used. `scroll-smooth` moves into CSS behind `prefers-reduced-motion: no-preference`.)

- [ ] **Step 8: Add the new UI strings in all three locales**

Run, from the repo root:

```bash
node <<'EOF'
const fs = require('fs');
const additions = {
  en: {
    'common.previous': 'Previous',
    'common.next': 'Next',
    'home.projects.seeAll': 'See all projects',
    'contact.form.sendAnother': 'Send another message',
    'contact.form.invalidEmail': 'Enter a valid email address.',
    'projects.zoomIn': 'Zoom in',
    'projects.zoomOut': 'Zoom out',
    'projects.resetZoom': 'Reset zoom',
    'projects.enterFullscreen': 'Full screen',
    'projects.play': 'Play',
    'projects.pause': 'Pause',
    'projects.mute': 'Mute',
    'projects.unmute': 'Unmute',
    'chatbot.today': 'Today {time}',
  },
  ru: {
    'common.previous': 'Назад',
    'common.next': 'Далее',
    'home.projects.seeAll': 'Все проекты',
    'contact.form.sendAnother': 'Отправить ещё одно сообщение',
    'contact.form.invalidEmail': 'Введите корректный адрес электронной почты.',
    'projects.zoomIn': 'Увеличить',
    'projects.zoomOut': 'Уменьшить',
    'projects.resetZoom': 'Сбросить масштаб',
    'projects.enterFullscreen': 'Во весь экран',
    'projects.play': 'Воспроизвести',
    'projects.pause': 'Пауза',
    'projects.mute': 'Выключить звук',
    'projects.unmute': 'Включить звук',
    'chatbot.today': 'Сегодня, {time}',
  },
  uz: {
    'common.previous': 'Oldingi',
    'common.next': 'Keyingi',
    'home.projects.seeAll': 'Barcha loyihalar',
    'contact.form.sendAnother': 'Yana xabar yuborish',
    'contact.form.invalidEmail': "To'g'ri elektron pochta manzilini kiriting.",
    'projects.zoomIn': 'Kattalashtirish',
    'projects.zoomOut': 'Kichiklashtirish',
    'projects.resetZoom': 'Masshtabni tiklash',
    'projects.enterFullscreen': "To'liq ekran",
    'projects.play': 'Ijro etish',
    'projects.pause': 'Pauza',
    'projects.mute': "Ovozni o'chirish",
    'projects.unmute': 'Ovozni yoqish',
    'chatbot.today': 'Bugun, {time}',
  },
};
for (const [locale, entries] of Object.entries(additions)) {
  const file = `messages/${locale}.json`;
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [path, value] of Object.entries(entries)) {
    const keys = path.split('.');
    const last = keys.pop();
    let node = json;
    for (const key of keys) node = node[key];
    if (node[last] !== undefined) throw new Error(`${locale}: ${path} already exists`);
    node[last] = value;
  }
  // The files are 2-space JSON with no trailing newline; this round-trips them byte-for-byte.
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
}
console.log('added', Object.keys(additions.en).length, 'keys to', Object.keys(additions).join(', '));
EOF
```

Expected: `added 14 keys to en, ru, uz`. Then run `git diff --stat messages/`. Expected: 3 files changed with insertions only (about 14 lines each, plus touched commas).

- [ ] **Step 9: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: tests pass, lint shows 0 errors (2 baseline warnings), and the build succeeds.

- [ ] **Step 10: Browser check**

`npm run dev`, then check these on `/en`:
- The page background is pure white (light) or pure black (dark).
- Headings no longer show the blue→purple gradient. They are plain text: `.text-gradient` is gone, and later tasks restyle the pages.
- In DevTools → Elements → `<body>` → Computed → *Rendered Fonts*, the font is `Inter` (or `SF Pro` on macOS).
- On `/ru`, select a Cyrillic heading: Rendered Fonts shows `Inter`, not a system fallback.

- [ ] **Step 11: Commit**

```bash
git add package.json tsconfig.json src/lib/utils.ts src/lib/utils.test.ts src/app/globals.css src/app/layout.tsx messages/
git commit -m "feat(design): Apple tokens, type scale, materials, Inter font, cn() merge fix" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Motion system: spring presets, gesture math, `MotionConfig`, `ScrollReveal`

**Files:**
- Create: `src/lib/motion.test.ts`, `src/lib/motion.ts`, `src/components/motion-provider.tsx`
- Rewrite: `src/components/scroll-reveal.tsx`
- Modify: `src/app/[locale]/layout.tsx` (import plus the `return` block)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces (`@/lib/motion`):
  - `spring.default`: `{ type: 'spring', bounce: 0, duration: 0.4 }`
  - `spring.snappy`: `{ type: 'spring', bounce: 0, duration: 0.3 }`
  - `spring.momentum`: `{ type: 'spring', bounce: 0.2, duration: 0.4 }`
  - `project(velocityPxPerSec: number, decelerationRate = 0.998): number`: distance the gesture would coast
  - `rubberband(overshoot: number, dimension: number, constant = 0.55): number`
  - `clamp(value, min, max): number`
  - `rubberbandClamp(value, min, max, dimension): number`: identity inside `[min,max]`, resists outside
  - `shouldDismiss(offset: number, velocity: number, threshold: number): boolean`: `offset + project(velocity) > threshold`
  - `createVelocityTracker(windowMs = 100): { add(timeMs: number, position: number): void; velocity(): number /* px/s */; reset(): void }`
- Produces (`@/components/motion-provider`): `MotionProvider({ children })`, which wraps the app in `MotionConfig reducedMotion="user"` with `spring.default` as the default transition.
- `ScrollReveal` props become `{ children, direction?, delay?, distance? = 16, className? }`. `duration` is removed and `delay` is capped at 0.2s.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/motion.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  createVelocityTracker,
  project,
  rubberband,
  rubberbandClamp,
  shouldDismiss,
  spring,
} from './motion.ts';

const close = (actual: number, expected: number) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≉ ${expected}`);

test('springs are critically damped except momentum', () => {
  assert.equal(spring.default.type, 'spring');
  assert.equal(spring.default.bounce, 0);
  assert.equal(spring.default.duration, 0.4);
  assert.equal(spring.snappy.bounce, 0);
  assert.equal(spring.snappy.duration, 0.3);
  assert.equal(spring.momentum.bounce, 0.2);
});

test('project uses Apple\'s exponential-decay projection', () => {
  assert.equal(project(0), 0);
  close(project(1000), 499);
  close(project(-500), -249.5);
  close(project(1000, 0.99), 99);
});

test('rubberband resists progressively and never exceeds the dimension', () => {
  assert.equal(rubberband(0, 300), 0);
  const small = rubberband(10, 300);
  const large = rubberband(1000, 300);
  assert.ok(small > 0 && small < 10);
  assert.ok(large > small && large < 300);
  assert.equal(rubberband(-10, 300), -small);
});

test('clamp and rubberbandClamp', () => {
  assert.equal(clamp(5, 0, 3), 3);
  assert.equal(clamp(-1, 0, 3), 0);
  assert.equal(rubberbandClamp(40, 0, 100, 300), 40);
  const below = rubberbandClamp(-50, 0, 100, 300);
  assert.ok(below < 0 && below > -50);
  const above = rubberbandClamp(150, 0, 100, 300);
  assert.ok(above > 100 && above < 150);
});

test('shouldDismiss judges the projected position, not the release position', () => {
  assert.equal(shouldDismiss(100, 0, 300), false); // short, slow drag
  assert.equal(shouldDismiss(100, 1000, 300), true); // short drag, fast flick down
  assert.equal(shouldDismiss(350, 0, 300), true); // long, slow drag
  assert.equal(shouldDismiss(350, -1000, 300), false); // dragged far, flicked back up
});

test('velocity tracker reports px/s over the recent window only', () => {
  const tracker = createVelocityTracker(100);
  assert.equal(tracker.velocity(), 0);
  tracker.add(0, 0);
  tracker.add(50, 50);
  assert.equal(tracker.velocity(), 1000);
  tracker.add(300, 60); // finger paused before lifting: older samples fall out
  assert.equal(tracker.velocity(), 0);
  tracker.reset();
  assert.equal(tracker.velocity(), 0);
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `npm test`
Expected: FAIL. `src/lib/motion.test.ts` errors with `ERR_MODULE_NOT_FOUND` for `./motion.ts`. The `utils` tests still pass.

- [ ] **Step 3: Implement `src/lib/motion.ts`**

```ts
// Motion vocabulary for the whole site, after Apple's "Designing Fluid Interfaces" (WWDC18).
// Critically damped springs by default; bounce only when a gesture carried momentum.

export const spring = {
  default: { type: 'spring', bounce: 0, duration: 0.4 },
  snappy: { type: 'spring', bounce: 0, duration: 0.3 },
  momentum: { type: 'spring', bounce: 0.2, duration: 0.4 },
} as const;

/** Distance a gesture released at `velocity` (px/s) would coast, using Apple's deceleration curve. */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary: the further past, the less the element follows. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Passes `value` through inside [min, max]; rubber-bands it outside. */
export function rubberbandClamp(value: number, min: number, max: number, dimension: number): number {
  if (value < min) return min - rubberband(min - value, dimension);
  if (value > max) return max + rubberband(value - max, dimension);
  return value;
}

/** Decide a sheet dismissal from where the gesture is going, not where it was released. */
export function shouldDismiss(offset: number, velocity: number, threshold: number): boolean {
  return offset + project(velocity) > threshold;
}

/** Tracks recent pointer samples; velocity() is px/s across the last `windowMs`. */
export function createVelocityTracker(windowMs = 100) {
  let samples: Array<{ time: number; position: number }> = [];
  return {
    add(time: number, position: number) {
      samples.push({ time, position });
      samples = samples.filter((sample) => time - sample.time <= windowMs);
    },
    velocity(): number {
      if (samples.length < 2) return 0;
      const first = samples[0];
      const last = samples[samples.length - 1];
      const elapsed = last.time - first.time;
      return elapsed > 0 ? ((last.position - first.position) / elapsed) * 1000 : 0;
    },
    reset() {
      samples = [];
    },
  };
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npm test`
Expected: `pass 9`, `fail 0`.

- [ ] **Step 5: Create the motion provider**

Create `src/components/motion-provider.tsx`:

```tsx
'use client';

import { MotionConfig } from 'framer-motion';
import { spring } from '@/lib/motion';

// reducedMotion="user": under prefers-reduced-motion, framer drops transform/layout animation
// and keeps opacity. Unspecified transitions default to the critically damped spring.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={spring.default}>
      {children}
    </MotionConfig>
  );
}
```

- [ ] **Step 6: Wire it into the locale layout**

In `src/app/[locale]/layout.tsx`, add this import below `import { ThemeProvider } from "@/components/theme-provider";`:

```tsx
import { MotionProvider } from "@/components/motion-provider";
```

Replace the whole `return ( … );` block of `LocaleLayout` with:

```tsx
  return (
    <NextIntlClientProvider locale={locale} messages={messages} key={locale}>
      <ThemeProvider>
        <MotionProvider>
          <div className="min-h-screen relative overflow-hidden bg-background">
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-10" />
            <div className="fixed inset-0 pointer-events-none">
              <ParticleBackground />
              <FloatingElements />
            </div>

            <Navigation />
            <main className="relative z-10 pt-16">
              <ErrorBoundary>
                <PageTransition>
                  {children}
                </PageTransition>
              </ErrorBoundary>
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTop />
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <StructuredData />
          </div>
        </MotionProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
```

(The decorative layers stay for now; Task 4 removes them.)

- [ ] **Step 7: Rewrite `ScrollReveal` on springs**

Replace the entire contents of `src/components/scroll-reveal.tsx` with:

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { spring } from '@/lib/motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Stagger offset in seconds; capped at 0.2s so content never waits on a long cascade. */
  delay?: number;
  distance?: number;
  className?: string;
}

const offsets = {
  up: [0, 1],
  down: [0, -1],
  left: [1, 0],
  right: [-1, 0],
} as const;

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 16,
  className = '',
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const [dx, dy] = offsets[direction];

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: dx * distance, y: dy * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px', amount: 0.2 }}
      transition={{ ...spring.default, delay: Math.min(delay, 0.2) }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 8: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass (lint still shows only the 2 baseline warnings). A build failure mentioning `duration` on `ScrollReveal` means a caller passes the removed prop; delete that prop at the call site.

- [ ] **Step 9: Browser check**

`npm run dev`, then go to `/en`:
- Scroll down. Section headers rise 16px and fade in with no overshoot, and the cards no longer wait up to 1s+ in sequence.
- With DevTools → Rendering → `prefers-reduced-motion: reduce`, reload and scroll. Sections only fade, with no movement.

- [ ] **Step 10: Commit**

```bash
git add src/lib/motion.ts src/lib/motion.test.ts src/components/motion-provider.tsx src/components/scroll-reveal.tsx "src/app/[locale]/layout.tsx"
git commit -m "feat(motion): spring presets, gesture math, MotionConfig, spring ScrollReveal" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Primitives and shared building blocks

**Files:**
- Rewrite: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`
- Modify: `src/components/ui/dropdown-menu.tsx` (two class strings)
- Create: `src/components/section-header.tsx`, `src/components/status-dot.tsx`, `src/components/grouped-list.tsx`, `src/components/crossfade-icon.tsx`

**Interfaces:**
- Consumes: Task 1 tokens and `cn`; Task 2 `spring`.
- Produces:
  - `Button` variants: `default | destructive | outline | secondary | glass (deprecated alias of secondary; removed in Task 13) | ghost | plain | link`. Sizes: `default | sm | lg | icon (44px) | icon-sm | icon-lg`.
  - `Badge` variants: `default | secondary | destructive | outline`.
  - `SectionHeader({ eyebrow?, title, subtitle?, align?: 'center' | 'left', as?: 'h1' | 'h2', className? })`.
  - `StatusDot({ status, label?, className? })`. `status` is the *untranslated* status (`Project.originalStatus`): `Completed` is green, `Discontinued` gray, anything else accent.
  - `GroupedList({ className?, children })` renders a `<ul>`, and `GroupedListItem({ leading?, title, subtitle?, trailing?, href? })` renders an `<li>`. Internal paths use `next/link`, `http(s)` links open a new tab with an `ExternalLink` glyph, and `mailto:`/`tel:` render a plain `<a>`.
  - `CrossfadeIcon({ showAlt, icon, altIcon, className? = 'size-5' })`: two stacked Lucide icons that cross-fade and can be retargeted mid-flight.

- [ ] **Step 1: Button: press feedback, pills, new variants**

Replace the entire contents of `src/components/ui/button.tsx` with:

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Translucent fill so secondary buttons stay visible on both the page and bg-secondary cards.
const fill = "bg-black/[0.05] hover:bg-black/[0.08] dark:bg-white/[0.1] dark:hover:bg-white/[0.14]"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-normal transition-[scale,background-color,color,opacity] duration-100 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:outline-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary-fill text-white hover:bg-primary-fill/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-border bg-background text-foreground hover:bg-secondary",
        secondary: `text-foreground ${fill}`,
        // Deprecated alias kept until every call site is migrated; removed in the final task.
        glass: `text-foreground ${fill}`,
        ghost: "text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.1]",
        plain: "text-primary underline-offset-4 hover:underline active:scale-100 active:opacity-60",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-10 px-5 text-[0.9375rem] has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3.5 text-[0.8125rem] has-[>svg]:px-3",
        lg: "h-12 px-7 text-[1.0625rem] has-[>svg]:px-6",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    compoundVariants: [
      { variant: ["plain", "link"], className: "h-auto gap-0.5 rounded-none px-0 has-[>svg]:px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 2: Card: flat surface, no border or shadow**

Replace the entire contents of `src/components/ui/card.tsx` with:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-lg py-6 contrast-more:border contrast-more:border-foreground/40",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-headline", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-[0.9375rem]", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
```

- [ ] **Step 3: Badge: gray pills**

Replace the entire contents of `src/components/ui/badge.tsx` with:

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full px-2.5 py-0.5 text-caption font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary-fill text-white",
        secondary: "bg-black/[0.05] text-foreground dark:bg-white/[0.1]",
        destructive: "bg-destructive text-white",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
```

- [ ] **Step 4: Inputs: 44px fields, translucent fill, focus ring**

Replace the entire contents of `src/components/ui/input.tsx` with:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-chip bg-black/[0.05] px-4 text-body text-foreground outline-none transition-[box-shadow] placeholder:text-muted-foreground selection:bg-primary selection:text-white dark:bg-white/[0.08]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-destructive contrast-more:border contrast-more:border-foreground/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

Replace the entire contents of `src/components/ui/textarea.tsx` with:

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-chip bg-black/[0.05] px-4 py-3 text-body text-foreground outline-none transition-[box-shadow] placeholder:text-muted-foreground dark:bg-white/[0.08]",
        "focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-destructive contrast-more:border contrast-more:border-foreground/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
```

- [ ] **Step 5: Dropdown menu: material surface that scales from its trigger**

In `src/components/ui/dropdown-menu.tsx`, inside `DropdownMenuContent`, replace this exact string:

```
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md"
```

with:

```
"material-sheet text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[12rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[14px] p-1.5"
```

Inside `DropdownMenuItem`, replace this exact string:

```
"focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
```

with:

```
"focus:bg-black/[0.05] active:bg-black/[0.08] dark:focus:bg-white/[0.1] dark:active:bg-white/[0.14] data-[variant=destructive]:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-[8px] px-2.5 py-2 text-[0.9375rem] outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
```

- [ ] **Step 6: SectionHeader**

Create `src/components/section-header.tsx`:

```tsx
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 max-w-3xl md:mb-16', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="mb-3 text-eyebrow text-primary">{eyebrow}</p>}
      <Heading className="text-title-1 text-balance">{title}</Heading>
      {subtitle && <p className="mt-4 text-body-lg text-muted-foreground text-pretty">{subtitle}</p>}
    </div>
  );
}
```

- [ ] **Step 7: StatusDot**

Create `src/components/status-dot.tsx`:

```tsx
import { cn } from '@/lib/utils';

// Keyed by the untranslated status (Project.originalStatus); anything else reads as in progress.
const dotColors: Record<string, string> = {
  Completed: 'bg-success',
  Discontinued: 'bg-muted-foreground',
};

interface StatusDotProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusDot({ status, label, className }: StatusDotProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-caption text-muted-foreground', className)}>
      <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', dotColors[status] ?? 'bg-primary')} />
      {label ?? status}
    </span>
  );
}
```

- [ ] **Step 8: GroupedList (iOS inset grouped list)**

Create `src/components/grouped-list.tsx`:

```tsx
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GroupedList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <ul className={cn('overflow-hidden rounded-lg bg-secondary contrast-more:border contrast-more:border-foreground/40', className)}>
      {children}
    </ul>
  );
}

interface GroupedListItemProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Internal paths use next/link; http(s) opens a new tab; mailto:/tel: open natively. */
  href?: string;
}

const rowClass = 'flex min-h-14 items-center gap-4 px-5 py-3';
const pressableClass =
  'transition-colors hover:bg-black/[0.02] active:bg-black/[0.05] dark:hover:bg-white/[0.03] dark:active:bg-white/[0.07]';

export function GroupedListItem({ leading, title, subtitle, trailing, href }: GroupedListItemProps) {
  const isExternal = href?.startsWith('http') ?? false;
  const TrailingIcon = isExternal ? ExternalLink : ChevronRight;

  const content = (
    <>
      {leading && <span className="flex shrink-0 items-center">{leading}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-body">{title}</span>
        {subtitle && <span className="mt-0.5 block text-caption text-muted-foreground">{subtitle}</span>}
      </span>
      {trailing && <span className="shrink-0 text-right text-body text-muted-foreground">{trailing}</span>}
      {href && <TrailingIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
    </>
  );

  let row: React.ReactNode = <div className={rowClass}>{content}</div>;
  if (href && isExternal) {
    row = (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(rowClass, pressableClass)}>
        {content}
      </a>
    );
  } else if (href && /^(mailto|tel):/.test(href)) {
    row = (
      <a href={href} className={cn(rowClass, pressableClass)}>
        {content}
      </a>
    );
  } else if (href) {
    row = (
      <Link href={href} className={cn(rowClass, pressableClass)}>
        {content}
      </Link>
    );
  }

  return <li className="border-b border-border last:border-b-0">{row}</li>;
}
```

- [ ] **Step 9: CrossfadeIcon**

Create `src/components/crossfade-icon.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface CrossfadeIconProps {
  showAlt: boolean;
  icon: LucideIcon;
  altIcon: LucideIcon;
  className?: string;
}

/** Two stacked icons that cross-fade. Both stay mounted, so a mid-flight toggle just retargets. */
export function CrossfadeIcon({ showAlt, icon: Icon, altIcon: AltIcon, className = 'size-5' }: CrossfadeIconProps) {
  return (
    <span aria-hidden className={cn('relative inline-flex', className)}>
      <motion.span
        className="absolute inset-0 flex"
        initial={false}
        animate={{ opacity: showAlt ? 0 : 1, scale: showAlt ? 0.8 : 1 }}
        transition={spring.snappy}
      >
        <Icon className="size-full" />
      </motion.span>
      <motion.span
        className="absolute inset-0 flex"
        initial={false}
        animate={{ opacity: showAlt ? 1 : 0, scale: showAlt ? 1 : 0.8 }}
        transition={spring.snappy}
      >
        <AltIcon className="size-full" />
      </motion.span>
    </span>
  );
}
```

- [ ] **Step 10: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass. The new components have no importers yet, which is fine.

- [ ] **Step 11: Browser check**

`npm run dev`, then check `/en`:
- Hold the mouse down on any button (hero "Download CV", "Show all"). It shrinks slightly *while pressed* and springs back on release. Hovering doesn't enlarge it.
- Open the CV dropdown. It's frosted, has 14px corners, and grows from the button that opened it.
- Tab through the page. Every focused control shows a 2px blue outline with a gap.

- [ ] **Step 12: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/card.tsx src/components/ui/badge.tsx src/components/ui/input.tsx src/components/ui/textarea.tsx src/components/ui/dropdown-menu.tsx src/components/section-header.tsx src/components/status-dot.tsx src/components/grouped-list.tsx src/components/crossfade-icon.tsx
git commit -m "feat(ui): Apple-style primitives, SectionHeader, StatusDot, GroupedList, CrossfadeIcon" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Global chrome: layout cleanup, page transition, scroll-to-top, footer

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Rewrite: `src/components/page-transition.tsx`, `src/components/scroll-to-top.tsx`, `src/components/footer.tsx`
- Delete: `src/components/particle-background.tsx`, `src/components/floating-elements.tsx`, `public/grid.svg`

**Interfaces:**
- Consumes: `MotionProvider` (Task 2), `spring` (Task 2), `Button` `ghost`/`icon` (Task 3).
- Produces: `<main>` with `pt-12`, matching the 48px nav that Task 5 builds. The root wrapper uses `overflow-x-clip`, so `position: sticky` works inside pages.

- [ ] **Step 1: Remove the decorative layers from the locale layout**

In `src/app/[locale]/layout.tsx`, delete these two import lines:

```tsx
import { ParticleBackground } from "@/components/particle-background";
import { FloatingElements } from "@/components/floating-elements";
```

Replace the whole `return ( … );` block of `LocaleLayout` with:

```tsx
  return (
    <NextIntlClientProvider locale={locale} messages={messages} key={locale}>
      <ThemeProvider>
        <MotionProvider>
          <div className="relative min-h-screen overflow-x-clip bg-background">
            <Navigation />
            <main className="relative z-10 pt-12">
              <ErrorBoundary>
                <PageTransition>{children}</PageTransition>
              </ErrorBoundary>
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTop />
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <StructuredData />
          </div>
        </MotionProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
```

- [ ] **Step 2: Delete the now-unused files**

```bash
git rm src/components/particle-background.tsx src/components/floating-elements.tsx public/grid.svg
grep -rn "particle-background\|floating-elements\|grid.svg" src || echo "no references left"
```

Expected: `no references left`.

- [ ] **Step 3: Page transition that never blocks input**

Replace the entire contents of `src/components/page-transition.tsx` with:

```tsx
'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// Opacity-only enter; no exit and no mode="wait", so clicks are never blocked during navigation.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Scroll-to-top chip**

Replace the entire contents of `src/components/scroll-to-top.tsx` with:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { spring } from '@/lib/motion';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileTap={{ scale: 0.92 }}
          transition={spring.snappy}
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
          className="material-chip fixed bottom-24 right-7 z-40 flex size-11 items-center justify-center rounded-full text-foreground shadow-sm"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
```

(`right-7` centers the 44px chip over the 52px chat launcher at `right-6`.)

- [ ] **Step 5: Footer band**

Replace the entire contents of `src/components/footer.tsx` with:

```tsx
'use client';

import { Github, Instagram, Linkedin, Mail, Twitter, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LastUpdated } from '@/components/last-updated';
import { getProfile } from '@/lib/data';

export function Footer() {
  const profile = getProfile();
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const socials: Array<{ href: string; label: string; icon: LucideIcon; external: boolean }> = [
    { href: profile.github, label: "Visit Shaxriyor's GitHub profile", icon: Github, external: true },
    { href: profile.linkedin, label: 'Connect with Shaxriyor on LinkedIn', icon: Linkedin, external: true },
    { href: profile.twitter, label: 'Follow Shaxriyor on Twitter', icon: Twitter, external: true },
    { href: `mailto:${profile.email}`, label: 'Send email to Shaxriyor', icon: Mail, external: false },
    { href: profile.instagram, label: 'Follow Shaxriyor on Instagram', icon: Instagram, external: true },
  ];

  return (
    <footer className="relative z-10 bg-secondary px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-5 text-center text-caption text-muted-foreground">
        <div className="flex flex-wrap justify-center gap-1">
          {socials.map(({ href, label, icon: Icon, external }) => (
            <Button
              key={label}
              asChild
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <a href={href} aria-label={label} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <Icon className="size-5" />
              </a>
            </Button>
          ))}
        </div>
        <div aria-hidden className="h-px w-full max-w-md bg-border" />
        <p>{t('copyright', { year: currentYear, name: profile.name })}</p>
        <LastUpdated />
        <p>
          {t('template')}{' '}
          <a
            href="https://github.com/ilyshaxa/shaxa.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {t('github')}
          </a>
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 7: Browser check**

`npm run dev`, then check `/en`:
- There are no drifting code glyphs, floating icons, or grid behind the content.
- Click between Home/About/Projects quickly. Each page fades in and every click registers immediately, with no ~0.4s dead time.
- Scroll past 300px. The scroll-to-top chip fades and scales in from 0.9, sits centered above the chat launcher, and shrinks while pressed. Clicking it scrolls to the top (instantly under reduced motion).
- The footer is a light-gray band with gray caption text, round icon buttons, and a blue GitHub link.

- [ ] **Step 8: Commit**

```bash
git add -A "src/app/[locale]/layout.tsx" src/components/page-transition.tsx src/components/scroll-to-top.tsx src/components/footer.tsx src/components/particle-background.tsx src/components/floating-elements.tsx public/grid.svg
git commit -m "feat(chrome): drop decorative layers, non-blocking page transition, new footer and scroll-to-top" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Navigation: frosted bar, mobile sheet, shared CV menu, theme cross-fade

**Files:**
- Create: `src/components/cv-menu.tsx`
- Rewrite: `src/components/navigation.tsx`

**Interfaces:**
- Consumes: `Button`, `DropdownMenu*`, `CrossfadeIcon` (Task 3); `spring` (Task 2); `useTheme` from `@/components/theme-provider` (existing; returns `{ theme, setTheme, actualTheme: 'light' | 'dark' }`); `ClientOnly` (existing).
- Produces: `CvMenu({ children, align? = 'end' })` from `@/components/cv-menu`. `children` is the trigger element (rendered through `DropdownMenuTrigger asChild`). It lists EN/UZ/RU, downloads `/cv/shaxriyor-jabborov-cv-{code}.pdf`, and shows the existing success toast. Task 7 uses it in the hero.

- [ ] **Step 1: Shared CV menu**

Create `src/components/cv-menu.tsx`:

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

const cvOptions = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'uz', flag: '🇺🇿', name: "O'zbekcha" },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
] as const;

type CvLocale = (typeof cvOptions)[number]['code'];

interface CvMenuProps {
  /** The trigger, rendered via DropdownMenuTrigger asChild. */
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function CvMenu({ children, align = 'end' }: CvMenuProps) {
  const locale = useLocale();
  const t = useTranslations('navigation');

  const download = (cvLocale: CvLocale) => {
    const link = document.createElement('a');
    link.href = `/cv/shaxriyor-jabborov-cv-${cvLocale}.pdf`;
    link.download = `shaxriyor-jabborov-cv-${cvLocale}.pdf`;
    link.click();
    toast.success(`${t(`languageNames.${cvLocale}`)} CV download complete`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {cvOptions.map((option) => (
          <DropdownMenuItem key={option.code} onClick={() => download(option.code)} className="cursor-pointer">
            <span>{option.flag}</span>
            <span>{option.name}</span>
            {locale === option.code && <Check className="ml-auto size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 2: Rewrite the navigation**

Replace the entire contents of `src/components/navigation.tsx` with:

```tsx
'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, Download, Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClientOnly } from '@/components/client-only';
import { CrossfadeIcon } from '@/components/crossfade-icon';
import { CvMenu } from '@/components/cv-menu';
import { useTheme } from '@/components/theme-provider';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

function stripLocale(path: string) {
  return path.replace(/^\/(en|uz|ru)/, '') || '/';
}

function LanguageMenu() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation');
  const [, startTransition] = useTransition();
  const current = languages.find((language) => language.code === locale);

  const switchTo = (code: string) => {
    startTransition(() => {
      router.replace(`/${code}${stripLocale(pathname)}`);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('changeLanguage')} title={t('changeLanguage')}>
          <span className="text-base leading-none">{current?.flag ?? '🌐'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} onClick={() => switchTo(language.code)} className="cursor-pointer">
            <span>{language.flag}</span>
            <span>{language.name}</span>
            {locale === language.code && <Check className="ml-auto size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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

  const navItems = useMemo(
    () => [
      { href: `/${locale}`, label: t('home'), path: '/' },
      { href: `/${locale}/about`, label: t('about'), path: '/about' },
      { href: `/${locale}/projects`, label: t('projects'), path: '/projects' },
      { href: `/${locale}/contact`, label: t('contact'), path: '/contact' },
    ],
    [locale, t]
  );

  const activeHref =
    navItems.find((item) => (item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)))?.href ??
    null;

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
        <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground">
            shaxa.dev
          </Link>

          <div ref={linksRef} className="relative hidden items-center gap-1 md:flex">
            {indicator && (
              <motion.div
                aria-hidden
                className="absolute inset-y-1 left-0 rounded-full bg-black/[0.05] dark:bg-white/[0.1]"
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
                  'relative rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors',
                  item.href === activeHref ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <LanguageMenu />
            <ClientOnly fallback={<div className="size-11" />}>
              <ThemeToggle />
            </ClientOnly>
            <CvMenu>
              <Button variant="ghost" size="sm" className="hidden md:inline-flex" title={t('downloadCV')} aria-label={t('downloadCV')}>
                <Download className="size-4" />
                {t('cv')}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </CvMenu>
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
            <div className="px-6 pb-6 pt-2">
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
              <CvMenu align="start">
                <Button variant="secondary" className="mt-6 w-full">
                  <Download className="size-4" />
                  {t('downloadCV')}
                  <ChevronDown className="ml-auto size-4" />
                </Button>
              </CvMenu>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

- [ ] **Step 3: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, and lint now reports **0 warnings** (the two baseline `exhaustive-deps` warnings are gone).

- [ ] **Step 4: Browser check (desktop, 1440px)**

`npm run dev`, then check `/en`:
- The bar is 48px tall and frosted. Scroll so a photo or card passes under it: the content shows through blurred. At the very top there's no line under the bar; after scrolling, a hairline fades in.
- Clicking About → Projects → Contact slides the gray pill between links with a spring and no overshoot.
- Theme toggle in Chrome: the page cross-fades over about 250ms and the sun/moon icons cross-fade. If the page snaps instantly with no fade, `flushSync` didn't apply the class in time. Check `document.documentElement.className` inside the callback while debugging, and don't ship without the fade.
- The language menu and CV menu are frosted and grow from their buttons. Switching to RU keeps the current page.

- [ ] **Step 5: Browser check (mobile, 390px) — Review Focus #1 and #2**

- Tap the hamburger. The sheet grows down from the bar, links slide in one after another, the page behind dims and doesn't scroll, and the icon cross-fades to ✕.
- **Rapid toggle:** tap the hamburger 5 times quickly. It ends open after an odd count and closed after an even one, never stuck half-height. Tapping the dimmed area or pressing Esc closes it.
- Switch to `/ru` and `/uz`, then open the sheet. In the console, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` must log `true`, and the bar must not wrap.
- With `prefers-reduced-transparency: reduce` emulated, the bar and sheet are solid (no blur).

- [ ] **Step 6: Commit**

```bash
git add src/components/cv-menu.tsx src/components/navigation.tsx
git commit -m "feat(nav): frosted bar, interruptible mobile sheet, shared CV menu, theme cross-fade" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Projects: themed images, project card, snap carousel, projects page

**Files:**
- Create: `src/lib/use-themed-src.ts`, `src/components/themed-image.tsx`, `src/lib/scroll-edges.test.ts`, `src/lib/scroll-edges.ts`, `src/components/project-carousel.tsx`
- Rewrite: `src/components/project-card.tsx`, `src/app/[locale]/projects/page.tsx`
- Modify: `src/app/[locale]/page.tsx` (ProjectCard call site only; Task 7 rewrites the file)

**Interfaces:**
- Consumes: `spring` (Task 2); `StatusDot`, `SectionHeader` (Task 3); `ScrollReveal` (Task 2); `Project`, `generateProjectSlug`, `getAllProjects`, `localizeProjects` from `@/lib/data` (existing); `useTheme` (existing).
- Produces:
  - `useThemedSrc(defaultSrc: string, lightSrc?: string, darkSrc?: string): string`. It returns `defaultSrc` during SSR and hydration, then the variant for the resolved theme.
  - `ThemedImage(props: Omit<ImageProps,'src'> & { src: string; lightSrc?: string; darkSrc?: string })`.
  - `getScrollEdges(scrollLeft, scrollWidth, clientWidth, tolerance = 1): { atStart: boolean; atEnd: boolean }`.
  - `ProjectCard({ project })`. The props `index`, `featured`, and `viewDetailsText` are removed. The whole card is one link to `/{locale}/projects/{slug}`.
  - `ProjectCarousel({ projects })`.

- [ ] **Step 1: Write the failing scroll-edge tests**

Create `src/lib/scroll-edges.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getScrollEdges } from './scroll-edges.ts';

test('at the start of a scrollable row', () => {
  assert.deepEqual(getScrollEdges(0, 1000, 400), { atStart: true, atEnd: false });
});

test('in the middle', () => {
  assert.deepEqual(getScrollEdges(300, 1000, 400), { atStart: false, atEnd: false });
});

test('at the end, tolerating sub-pixel scroll positions', () => {
  assert.deepEqual(getScrollEdges(599.5, 1000, 400), { atStart: false, atEnd: true });
});

test('everything fits: both edges reached, so both arrows disable', () => {
  assert.deepEqual(getScrollEdges(0, 400, 400), { atStart: true, atEnd: true });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `./scroll-edges.ts`.

- [ ] **Step 3: Implement**

Create `src/lib/scroll-edges.ts`:

```ts
export interface ScrollEdges {
  atStart: boolean;
  atEnd: boolean;
}

/** Whether a horizontal scroller is at either end; `tolerance` absorbs sub-pixel scroll positions. */
export function getScrollEdges(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  tolerance = 1
): ScrollEdges {
  return {
    atStart: scrollLeft <= tolerance,
    atEnd: scrollLeft + clientWidth >= scrollWidth - tolerance,
  };
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npm test`
Expected: `pass 13`, `fail 0`.

- [ ] **Step 5: Hydration-safe themed assets**

Create `src/lib/use-themed-src.ts`:

```ts
'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from '@/components/theme-provider';

const subscribe = () => () => {};

/**
 * Picks the light/dark variant of an asset. The server and the hydration render both return
 * `defaultSrc` (the theme is unknown there), so there's no mismatch; the variant swaps in right after.
 */
export function useThemedSrc(defaultSrc: string, lightSrc?: string, darkSrc?: string): string {
  const { actualTheme } = useTheme();
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  if (!isClient) return defaultSrc;
  if (actualTheme === 'light' && lightSrc) return lightSrc;
  if (actualTheme === 'dark' && darkSrc) return darkSrc;
  return defaultSrc;
}
```

Create `src/components/themed-image.tsx`:

```tsx
'use client';

import Image, { type ImageProps } from 'next/image';
import { useThemedSrc } from '@/lib/use-themed-src';

interface ThemedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  lightSrc?: string;
  darkSrc?: string;
}

export function ThemedImage({ src, lightSrc, darkSrc, alt, ...props }: ThemedImageProps) {
  return <Image src={useThemedSrc(src, lightSrc, darkSrc)} alt={alt} {...props} />;
}
```

- [ ] **Step 6: Rewrite the project card**

Replace the entire contents of `src/components/project-card.tsx` with:

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { StatusDot } from '@/components/status-dot';
import { ThemedImage } from '@/components/themed-image';
import { generateProjectSlug, type Project } from '@/lib/data';
import { spring } from '@/lib/motion';

const MotionLink = motion.create(Link);

// Hover nudges the cover (pointer devices only; framer ignores touch "hover").
const coverVariants = { rest: { scale: 1 }, hover: { scale: 1.03 } };

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = React.memo(function ProjectCard({ project }: ProjectCardProps) {
  const locale = useLocale();
  const slug = project.slug || generateProjectSlug(project.title);
  const shownTech = project.technologies.slice(0, 5);
  const extraTech = project.technologies.length - shownTech.length;
  const techLine = [...shownTech, ...(extraTech > 0 ? [`+${extraTech}`] : [])].join(' · ');

  return (
    <MotionLink
      href={`/${locale}/projects/${slug}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      className="flex h-full flex-col overflow-hidden rounded-tile bg-secondary contrast-more:border contrast-more:border-foreground/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.div className="absolute inset-0" variants={coverVariants} transition={spring.default}>
          <ThemedImage
            src={project.coverImage}
            lightSrc={project.coverImageLight}
            alt=""
            fill
            sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 400px"
            className="object-contain p-6"
          />
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-6 pb-6">
        <StatusDot status={project.originalStatus ?? project.status} label={`${project.status} · ${project.year}`} />
        <h3 className="text-headline">{project.title}</h3>
        <p className="line-clamp-3 text-body text-muted-foreground">{project.shortDescription}</p>
        {project.companyName && <p className="text-caption text-muted-foreground">{project.companyName}</p>}
        <p className="mt-auto pt-2 text-caption text-muted-foreground">{techLine}</p>
      </div>
    </MotionLink>
  );
});
```

- [ ] **Step 7: Snap carousel**

Create `src/components/project-carousel.tsx`:

```tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/lib/data';
import { getScrollEdges, type ScrollEdges } from '@/lib/scroll-edges';

// Native scroll-snap: on touch screens and trackpads the OS supplies momentum and rubber-banding.
// Mouse users get arrows that page by the row's visible width.
const arrowClass =
  'flex size-11 items-center justify-center rounded-full bg-black/[0.07] text-foreground transition-[scale,opacity] duration-100 active:scale-[0.94] disabled:pointer-events-none disabled:opacity-35 dark:bg-white/[0.12]';

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const t = useTranslations('home.projects');
  const tCommon = useTranslations('common');
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<ScrollEdges>({ atStart: true, atEnd: true });

  const updateEdges = useCallback(() => {
    const scroller = scrollerRef.current;
    if (scroller) setEdges(getScrollEdges(scroller.scrollLeft, scroller.scrollWidth, scroller.clientWidth));
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateEdges();
    scroller.addEventListener('scroll', updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener('scroll', updateEdges);
      observer.disconnect();
    };
  }, [updateEdges]);

  const page = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  // Fade only the edge that has more content beyond it.
  const mask = `linear-gradient(to right, ${edges.atStart ? '#000' : 'transparent'} 0, #000 48px, #000 calc(100% - 48px), ${edges.atEnd ? '#000' : 'transparent'} 100%)`;

  return (
    <div>
      <div
        ref={scrollerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t('title')}
        tabIndex={0}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-8"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {projects.map((project) => (
          <div key={project.slug ?? project.title} className="w-[85%] shrink-0 snap-start md:w-[45%] lg:w-[calc((100%-2.5rem)/3)]">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      <div className="mt-4 hidden justify-end gap-3 px-4 sm:px-6 md:flex lg:px-8">
        <button type="button" onClick={() => page(-1)} disabled={edges.atStart} aria-label={tCommon('previous')} className={arrowClass}>
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => page(1)} disabled={edges.atEnd} aria-label={tCommon('next')} className={arrowClass}>
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Rewrite the projects page**

Replace the entire contents of `src/app/[locale]/projects/page.tsx` with:

```tsx
'use client';

import { useMemo } from 'react';
import { FolderOpen } from 'lucide-react';
import { useMessages, useTranslations } from 'next-intl';
import { ProjectCard } from '@/components/project-card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionHeader } from '@/components/section-header';
import { getAllProjects, localizeProjects } from '@/lib/data';

export default function ProjectsPage() {
  const baseProjects = getAllProjects();
  const messages = useMessages();
  const projects = useMemo(() => localizeProjects(baseProjects, messages), [baseProjects, messages]);
  const t = useTranslations('projects');

  return (
    <div className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <SectionHeader as="h1" title={t('title')} subtitle={t('subtitle')} />
        </ScrollReveal>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ScrollReveal key={project.slug ?? project.title} delay={index * 0.05} className="h-full">
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md py-20 text-center">
            <FolderOpen className="mx-auto size-12 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-6 text-headline">{t('empty.title')}</h2>
            <p className="mt-2 text-body text-muted-foreground">{t('empty.description')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Fix the home page call site**

In `src/app/[locale]/page.tsx`, replace:

```tsx
                <div className="h-full">
                  <ProjectCard
                    project={project}
                    index={index}
                    viewDetailsText={tProjects('viewProjectDetails')}
                  />
                </div>
```

with:

```tsx
                <div className="h-full">
                  <ProjectCard project={project} />
                </div>
```

and delete the now-unused line `  const tProjects = useTranslations('projects');`.

- [ ] **Step 10: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, 0 lint warnings.

- [ ] **Step 11: Browser check — Review Focus #3**

`npm run dev`, then check `/en/projects`:
- Two-column grid of gray tiles with 28px corners. Each shows a status dot with year, title, gray description, company, and a `·`-joined tech line. There are no buttons inside the cards.
- Hover a card: the cover image grows about 3% with a spring. Press and hold: the whole card shrinks to 0.98. Clicking opens `/en/projects/<slug>`, now with the locale in the URL.
- **Review Focus #3:**
  1. Set the OS/browser to dark mode.
  2. Run `localStorage.removeItem('theme')` and hard-reload.
  3. Covers that have light variants show their dark variant, and the console has no "hydration" warning.
  4. Repeat in light mode and confirm the light variants show.

- [ ] **Step 12: Commit**

```bash
git add src/lib/use-themed-src.ts src/components/themed-image.tsx src/lib/scroll-edges.ts src/lib/scroll-edges.test.ts src/components/project-card.tsx src/components/project-carousel.tsx "src/app/[locale]/projects/page.tsx" "src/app/[locale]/page.tsx"
git commit -m "feat(projects): Apple-style project cards, snap carousel, hydration-safe themed images" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(Task 7 checks the carousel in a browser once the home page uses it.)

---

### Task 7: Home: hero, skills bento, experience list, projects row, closing CTA

**Files:**
- Create: `src/lib/avatar.ts`, `src/lib/employment-type.ts`, `src/components/skills-bento.tsx`, `src/components/experience-list.tsx`
- Rewrite: `src/app/[locale]/page.tsx`
- Delete: `src/components/typewriter-effect.tsx`, `src/components/parallax-section.tsx`

**Interfaces:**
- Consumes:
  - From earlier tasks: `CvMenu` (T5); `ProjectCarousel` (T6); `SectionHeader`, `GroupedList`, `Button` `plain`/`secondary` (T3); `ScrollReveal`, `spring` (T2).
  - From `@/lib/data`: `Profile`, `Experience`, `getProfile`, `getAllProjects`, `localizeProjects`, `localizeExperiences`.
- Produces:
  - `AVATAR_BLUR_DATA_URL: string` (`@/lib/avatar`).
  - `employmentTypeKeys` (`@/lib/employment-type`), mapping `Experience['employmentType']` to its key under `about.employmentTypes` (`fullTime | partTime | contract | freelance | internship`).
  - `SkillsBento({ skills: Profile['skills'] })`.
  - `ExperienceList({ experiences: Experience[]; initialCount?: number; variant?: 'compact' | 'detailed' })`. Without `initialCount` it shows every row.

- [ ] **Step 1: Move the avatar blur placeholder into a module (byte-for-byte)**

Run this *before* touching the page, since it reads the current file:

```bash
printf "// Blur placeholder for /images/profile.jpg, moved verbatim from the old hero.\nexport const AVATAR_BLUR_DATA_URL =\n  '%s';\n" \
  "$(grep -o 'blurDataURL="data:image/jpeg[^"]*"' 'src/app/[locale]/page.tsx' | sed 's/^blurDataURL="//; s/"$//')" \
  > src/lib/avatar.ts
grep -c "data:image/jpeg;base64,/9j/" src/lib/avatar.ts && wc -c src/lib/avatar.ts
```

Expected: `1`, and a size of about 1,440 bytes. If it prints `0`, the grep found nothing. Stop and check that the old hero `<Image>` is still in the file.

- [ ] **Step 2: Employment-type key map**

Create `src/lib/employment-type.ts`:

```ts
import type { Experience } from '@/lib/data';

/** Maps Experience.employmentType to its key under `about.employmentTypes` in messages/*.json. */
export const employmentTypeKeys = {
  'Full-time': 'fullTime',
  'Part-time': 'partTime',
  Contract: 'contract',
  Freelance: 'freelance',
  Internship: 'internship',
} as const satisfies Record<Experience['employmentType'], string>;
```

- [ ] **Step 3: Skills bento**

Create `src/components/skills-bento.tsx`:

```tsx
'use client';

import { Activity, Cloud, Container, Database, GitBranch, Server, Wrench, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/scroll-reveal';
import type { Profile } from '@/lib/data';
import { cn } from '@/lib/utils';

type SkillCategory = keyof Profile['skills'];

// Apple system colors (light / dark). Only the icons carry color.
// Grid: 4 columns on lg. Cloud is 2×2; containers and tools span 2, so every row is full.
const categoryConfig: Record<SkillCategory, { icon: LucideIcon; color: string; tile: string }> = {
  cloud: { icon: Cloud, color: 'text-[#007aff] dark:text-[#0a84ff]', tile: 'md:col-span-2 lg:row-span-2' },
  containers: { icon: Container, color: 'text-[#34c759] dark:text-[#30d158]', tile: 'lg:col-span-2' },
  infrastructure: { icon: Server, color: 'text-[#af52de] dark:text-[#bf5af2]', tile: '' },
  cicd: { icon: GitBranch, color: 'text-[#ff9500] dark:text-[#ff9f0a]', tile: '' },
  monitoring: { icon: Activity, color: 'text-[#ff3b30] dark:text-[#ff453a]', tile: '' },
  database: { icon: Database, color: 'text-[#ff2d55] dark:text-[#ff375f]', tile: '' },
  tools: { icon: Wrench, color: 'text-[#32ade6] dark:text-[#64d2ff]', tile: 'lg:col-span-2' },
};

export function SkillsBento({ skills }: { skills: Profile['skills'] }) {
  const t = useTranslations('home.skills.categories');
  const categories = Object.keys(skills) as SkillCategory[];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => {
        const { icon: Icon, color, tile } = categoryConfig[category];
        const isHero = category === 'cloud';
        return (
          <ScrollReveal
            key={category}
            delay={index * 0.05}
            className={cn('rounded-tile bg-secondary p-6 md:p-8 contrast-more:border contrast-more:border-foreground/40', tile)}
          >
            <Icon className={cn(isHero ? 'size-10' : 'size-7', color)} strokeWidth={1.75} aria-hidden />
            <h3 className={cn('mt-4', isHero ? 'text-title-2' : 'text-headline')}>{t(category)}</h3>
            <ul
              className={cn(
                'mt-3 text-muted-foreground',
                isHero ? 'space-y-1.5 text-body-lg' : 'flex flex-wrap gap-x-3 gap-y-1 text-body'
              )}
            >
              {skills[category].map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Experience list**

Create `src/components/experience-list.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { GroupedList } from '@/components/grouped-list';
import type { Experience } from '@/lib/data';
import { employmentTypeKeys } from '@/lib/employment-type';
import { spring } from '@/lib/motion';

interface ExperienceListProps {
  experiences: Experience[];
  /** Rows shown before "Show all"; omit to show every row. */
  initialCount?: number;
  variant?: 'compact' | 'detailed';
}

export function ExperienceList({ experiences, initialCount, variant = 'compact' }: ExperienceListProps) {
  const locale = useLocale();
  const tHome = useTranslations('home.experience');
  const tAbout = useTranslations('about');
  const [showAll, setShowAll] = useState(false);
  const limit = Math.min(initialCount ?? experiences.length, experiences.length);
  const hiddenCount = experiences.length - limit;
  const visible = showAll ? experiences : experiences.slice(0, limit);

  return (
    <div>
      <GroupedList>
        <AnimatePresence initial={false}>
          {visible.map((exp) => {
            const details = [exp.location, ...exp.technologies.slice(0, 3)].filter(Boolean).join(' · ');
            return (
              <motion.li
                key={exp.slug}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring.default}
                className="overflow-hidden border-b border-border last:border-b-0"
              >
                <Link
                  href={`/${locale}/about/${exp.slug}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-black/[0.02] active:bg-black/[0.05] dark:hover:bg-white/[0.03] dark:active:bg-white/[0.07]"
                >
                  <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-background">
                    {exp.logo && <Image src={exp.logo} alt="" width={28} height={28} className="object-contain" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[1.0625rem] font-semibold tracking-[-0.01em]">{exp.position}</span>
                    <span className="block truncate text-caption text-muted-foreground">
                      {exp.company} · {tAbout(`employmentTypes.${employmentTypeKeys[exp.employmentType]}`)}
                    </span>
                    <span className="block truncate text-caption text-muted-foreground sm:hidden">{exp.duration}</span>
                    {variant === 'detailed' && details && (
                      <span className="mt-0.5 block truncate text-caption text-muted-foreground">{details}</span>
                    )}
                  </span>
                  <span className="hidden shrink-0 text-caption text-muted-foreground sm:block">{exp.duration}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </GroupedList>

      {hiddenCount > 0 && (
        <div className="mt-6 text-center">
          <Button variant="plain" onClick={() => setShowAll((value) => !value)} aria-expanded={showAll}>
            {showAll ? tHome('showLess') : tHome('showAll', { count: hiddenCount })}
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Rewrite the home page**

Replace the entire contents of `src/app/[locale]/page.tsx` with:

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
import { ProjectCarousel } from '@/components/project-carousel';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionHeader } from '@/components/section-header';
import { SkillsBento } from '@/components/skills-bento';
import { AVATAR_BLUR_DATA_URL } from '@/lib/avatar';
import { getAllProjects, getProfile, localizeExperiences, localizeProjects } from '@/lib/data';
import { spring } from '@/lib/motion';

export default function Home() {
  const profile = getProfile();
  const baseProjects = getAllProjects();
  const locale = useLocale();
  const messages = useMessages();
  const t = useTranslations('home');
  const tProfile = useTranslations('profile');

  const projects = useMemo(() => localizeProjects(baseProjects, messages), [baseProjects, messages]);
  const experiences = useMemo(() => localizeExperiences(profile.experience, messages), [profile.experience, messages]);
  const featuredProjects = projects.filter((project) => project.featured);
  const carouselProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <div>
      {/* Hero */}
      <section className="px-4 pb-24 pt-16 sm:px-6 md:pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.default}
          className="mx-auto flex max-w-[980px] flex-col items-center text-center"
        >
          <div className="size-[270px] overflow-hidden rounded-full ring-1 ring-border">
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
          <h1 className="mt-8 text-display text-balance">{profile.name}</h1>
          <p className="mt-3 text-title-2 text-muted-foreground text-balance">
            {t('hero.roles.devops')} · {t('hero.roles.awsCertified')}
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            {tProfile('location')}
          </p>
          <p className="mt-6 max-w-[40rem] text-body-lg text-muted-foreground text-pretty">{tProfile('shortBio')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <CvMenu align="center">
              <Button size="lg">
                <Download className="size-5" />
                {t('hero.downloadCV')}
                <ChevronDown className="size-4 opacity-80" />
              </Button>
            </CvMenu>
            <Button asChild variant="plain" size="lg">
              <Link href={`/${locale}/contact`}>
                {t('cta.getInTouch')}
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      <section className="px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <SectionHeader title={t('skills.title')} subtitle={t('skills.subtitle')} />
          </ScrollReveal>
          <SkillsBento skills={profile.skills} />
        </div>
      </section>

      {/* Experience */}
      <section className="px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-[980px]">
          <ScrollReveal>
            <SectionHeader title={t('experience.title')} subtitle={t('experience.subtitle')} />
          </ScrollReveal>
          <ScrollReveal>
            <ExperienceList experiences={experiences} initialCount={3} />
          </ScrollReveal>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal className="px-4 sm:px-6 lg:px-8">
            <SectionHeader title={t('projects.title')} subtitle={t('projects.subtitle')} />
          </ScrollReveal>
          <ProjectCarousel projects={carouselProjects} />
          <div className="mt-8 text-center">
            <Button asChild variant="plain">
              <Link href={`/${locale}/projects`}>
                {t('projects.seeAll')}
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 pb-32 pt-24 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-title-1 text-balance">{t('cta.title')}</h2>
          <p className="mt-4 text-body-lg text-muted-foreground text-pretty">{t('cta.subtitle')}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/${locale}/contact`}>{t('cta.getInTouch')}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/${locale}/about`}>{t('cta.viewFullProfile')}</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Delete the typewriter and parallax components**

```bash
git rm src/components/typewriter-effect.tsx src/components/parallax-section.tsx
grep -rn "TypewriterEffect\|ParallaxSection\|typewriter-effect\|parallax-section" src || echo "no references left"
```

Expected: `no references left`.

- [ ] **Step 7: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, 0 lint warnings.

- [ ] **Step 8: Browser check (1440px) — Review Focus #5**

`npm run dev`, then check `/en`:
- **Hero:** the avatar is the same photo, crop, and 270px size as before, now with a hairline ring. Below it: a large tight name, then "DevOps Engineer · AWS Certified" in gray, the location caption, the bio, a blue **Download CV ▾** pill, and a blue **Get in touch ›** text link. The CV menu grows from the pill.
- **Skills:** a bento of gray tiles. Cloud is the big 2×2 tile, and every row is full with no empty cell. Only the icons are colored.
- **Experience:** a gray grouped list with 3 rows. "Show all (N more)" grows the extra rows in with a spring, and "Show less" collapses them.
  - **Review Focus #2:** click Show all/Show less 6 times fast. The list ends in the state matching the last click, never blank or overlapped.
- **Projects (Review Focus #5):** with 3 featured projects at 1440px, all three cards fit. Both arrows are disabled at 35% opacity, and neither edge is faded.

- [ ] **Step 9: Browser check (390px)**

- The project row shows about 85%-wide cards. Swiping snaps card by card, and the arrows are hidden. A trackpad two-finger swipe on desktop at 900px wide also snaps, and the arrows enable and disable at the ends.
- Switch to `/ru` and `/uz`. `document.documentElement.scrollWidth <= document.documentElement.clientWidth` logs `true`. The role line and bento tiles wrap cleanly.
- Under emulated `prefers-reduced-motion: reduce`, the hero and sections fade without moving, and the arrows jump instead of smooth-scrolling.

- [ ] **Step 10: Commit**

```bash
git add -A src/lib/avatar.ts src/lib/employment-type.ts src/components/skills-bento.tsx src/components/experience-list.tsx "src/app/[locale]/page.tsx" src/components/typewriter-effect.tsx src/components/parallax-section.tsx
git commit -m "feat(home): Apple hero, skills bento, grouped experience list, project snap row" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: About page

**Files:**
- Rewrite: `src/app/[locale]/about/page.tsx`

**Interfaces:**
- Consumes: `ExperienceList`, `SkillsBento` (T7); `GroupedList`, `GroupedListItem`, `SectionHeader` (T3); `ThemedImage` (T6); `ScrollReveal` (T2); `getProfile`, `getAllExperiences`, `localizeExperiences`, `localizeEducation` from `@/lib/data`.
- Produces: nothing new.

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `src/app/[locale]/about/page.tsx` with:

```tsx
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Award, Code, Globe, GraduationCap, Heart, type LucideIcon } from 'lucide-react';
import { useMessages, useTranslations } from 'next-intl';
import { ExperienceList } from '@/components/experience-list';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionHeader } from '@/components/section-header';
import { SkillsBento } from '@/components/skills-bento';
import { ThemedImage } from '@/components/themed-image';
import { getAllExperiences, getProfile, localizeEducation, localizeExperiences } from '@/lib/data';
import { cn } from '@/lib/utils';

const values: Array<{
  key: 'codeQuality' | 'userCentric' | 'continuousLearning' | 'collaboration';
  icon: LucideIcon;
  color: string;
}> = [
  { key: 'codeQuality', icon: Code, color: 'text-[#007aff] dark:text-[#0a84ff]' },
  { key: 'userCentric', icon: Heart, color: 'text-[#ff2d55] dark:text-[#ff375f]' },
  { key: 'continuousLearning', icon: GraduationCap, color: 'text-[#af52de] dark:text-[#bf5af2]' },
  { key: 'collaboration', icon: Globe, color: 'text-[#34c759] dark:text-[#30d158]' },
];

const funFacts = ['linux', 'fitness', 'gaming', 'learner'] as const;

const tileClass = 'rounded-tile bg-secondary p-6 md:p-8 contrast-more:border contrast-more:border-foreground/40';
const sectionClass = 'mt-24 md:mt-32';

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
  const tProfile = useTranslations('profile');

  const activeCertifications = profile.certifications.filter(
    (cert) => cert.status !== 'Planned' && cert.status !== 'Expired'
  );

  const languageName = (name: string) => {
    try {
      return tProfile(`languages.${name}`);
    } catch {
      return name;
    }
  };

  return (
    <div className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[980px]">
        <ScrollReveal>
          <SectionHeader as="h1" title={t('title')} subtitle={t('subtitle')} />
        </ScrollReveal>

        {/* Bio */}
        <ScrollReveal className="mx-auto max-w-[680px] space-y-6 text-body-lg text-muted-foreground text-pretty">
          <p>{tProfile('bio')}</p>
          <p>{t('sections.bio.additionalText')}</p>
        </ScrollReveal>

        {/* Experience */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.experience.title')} subtitle={t('sections.experience.subtitle')} />
          </ScrollReveal>
          <ScrollReveal>
            <ExperienceList experiences={experiences} variant="detailed" />
          </ScrollReveal>
        </section>

        {/* Education & certifications */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.education.title')} subtitle={t('sections.education.subtitle')} />
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <ScrollReveal>
              <h3 className="mb-3 px-1 text-headline">{t('sections.education.educationTab')}</h3>
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
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <h3 className="mb-3 px-1 text-headline">{t('sections.education.certificationsTab')}</h3>
              {activeCertifications.length > 0 ? (
                <GroupedList>
                  {activeCertifications.map((cert) => {
                    const logo = cert.logo || cert.logoLight || cert.logoDark;
                    return (
                      <GroupedListItem
                        key={cert.name}
                        leading={
                          <LogoTile>
                            {logo ? (
                              <ThemedImage
                                src={logo}
                                lightSrc={cert.logoLight}
                                darkSrc={cert.logoDark}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-contain p-1.5"
                                unoptimized={cert.logo?.includes('british-council')}
                              />
                            ) : (
                              <Award className="size-5 text-muted-foreground" />
                            )}
                          </LogoTile>
                        }
                        title={cert.name}
                        subtitle={`${cert.issuer} · ${cert.year}`}
                      />
                    );
                  })}
                </GroupedList>
              ) : (
                <div className="rounded-lg bg-secondary px-6 py-10 text-center">
                  <p className="text-headline">{t('sections.education.comingSoon')}</p>
                  <p className="mt-1 text-caption text-muted-foreground">{t('sections.education.comingSoonDesc')}</p>
                </div>
              )}
            </ScrollReveal>
          </div>
        </section>

        {/* Skills & languages */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.skills.title')} subtitle={t('sections.skills.subtitle')} />
          </ScrollReveal>
          <SkillsBento skills={profile.skills} />
          <ScrollReveal className="mt-16">
            <h3 className="mb-3 px-1 text-headline">{t('sections.skills.languages')}</h3>
            <GroupedList>
              {profile.languages.map((language) => (
                <GroupedListItem
                  key={language.name}
                  leading={
                    language.flag ? (
                      <span className="relative block h-6 w-8 overflow-hidden rounded-[4px]">
                        <Image src={language.flag} alt="" fill sizes="32px" className="object-cover" />
                      </span>
                    ) : (
                      <Globe className="size-5 text-muted-foreground" />
                    )
                  }
                  title={languageName(language.name)}
                  trailing={language.level}
                />
              ))}
            </GroupedList>
          </ScrollReveal>
        </section>

        {/* Values */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.values.title')} subtitle={t('sections.values.subtitle')} />
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {values.map(({ key, icon: Icon, color }, index) => (
              <ScrollReveal key={key} delay={index * 0.05} className={tileClass}>
                <Icon className={cn('size-7', color)} strokeWidth={1.75} aria-hidden />
                <h3 className="mt-4 text-headline">{t(`sections.values.${key}.title`)}</h3>
                <p className="mt-2 text-body text-muted-foreground">{t(`sections.values.${key}.description`)}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Fun facts (titles already start with an emoji) */}
        <section className={sectionClass}>
          <ScrollReveal>
            <SectionHeader title={t('sections.funFacts.title')} subtitle={t('sections.funFacts.subtitle')} />
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {funFacts.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.05} className={tileClass}>
                <h3 className="text-headline">{t(`sections.funFacts.${key}.title`)}</h3>
                <p className="mt-2 text-body text-muted-foreground">{t(`sections.funFacts.${key}.description`)}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, 0 lint warnings.

- [ ] **Step 3: Browser check — Review Focus #3**

`npm run dev`, then check `/en/about`:
- Title and subtitle are centered. The bio is a narrow, readable 680px column with no card around it.
- **Experience:** every role appears as a grouped-list row, with a caption line of location and top 3 technologies. Rows highlight on press and open the detail page.
- **Education and Certifications:** two grouped lists side by side at 1440px, stacked at 390px. Logos sit in white rounded squares. Education rows with a website show an external-link glyph and open in a new tab.
  - **Review Focus #3:** in OS dark mode with `localStorage.theme` removed, logos that have dark variants show them, with no hydration warning.
- Skills bento, then a Languages grouped list (flag, localized name, level on the right).
- Values: 2×2 tiles with tinted icons. Fun facts: 2×2 tiles.
- At 390px in `/ru`, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` logs `true`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/about/page.tsx"
git commit -m "feat(about): grouped lists, bento skills, value and fun-fact tiles" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Experience detail page

**Files:**
- Rewrite: `src/app/[locale]/about/[slug]/page.tsx`

**Interfaces:**
- Consumes: `employmentTypeKeys` (T7); `GroupedList`, `GroupedListItem`, `Badge`, `Button` `plain` (T3); `ScrollReveal` (T2); `getAllExperiences`, `localizeExperiences`; message keys `experienceDetail.*`, `about.employmentTypes.*`, `common.previous`, `common.next` (T1).
- Produces: nothing new.

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `src/app/[locale]/about/[slug]/page.tsx` with:

```tsx
'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLocale, useMessages, useTranslations } from 'next-intl';
import { Briefcase, Building, Calendar, Check, ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { ScrollReveal } from '@/components/scroll-reveal';
import { getAllExperiences, localizeExperiences } from '@/lib/data';
import { employmentTypeKeys } from '@/lib/employment-type';

interface ExperienceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const rowIconClass = 'size-5 text-muted-foreground';
const neighborClass =
  'block rounded-lg bg-secondary p-5 transition-[scale,background-color] duration-100 active:scale-[0.98] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]';

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const t = useTranslations('experienceDetail');
  const tAbout = useTranslations('about');
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
    <article className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-[980px]">
        <Button asChild variant="plain" size="sm">
          <Link href={`/${locale}/about`}>
            <ChevronLeft className="size-4" />
            {t('backToAbout')}
          </Link>
        </Button>

        <ScrollReveal className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          {experience.logo && (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-[22px] bg-secondary">
              <Image src={experience.logo} alt={`${experience.company} logo`} width={52} height={52} className="object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-title-1 text-balance">{experience.position}</h1>
            <p className="mt-2 text-body-lg text-muted-foreground">
              {experience.company} · {experience.duration}
            </p>
            {experience.isCurrent && (
              <Badge className="mt-3 bg-success/15 text-success">
                <span aria-hidden className="size-1.5 rounded-full bg-success" />
                {t('current')}
              </Badge>
            )}
          </div>
        </ScrollReveal>

        <p className="mt-8 max-w-[680px] text-body-lg text-pretty">{experience.description}</p>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <section>
              <h2 className="text-title-2">{t('responsibilities.title')}</h2>
              <ul className="mt-6 space-y-3">
                {experience.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3 text-body text-muted-foreground">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-title-2">{t('achievements.title')}</h2>
              <ul className="mt-6 space-y-3">
                {experience.achievements.map((item) => (
                  <li key={item} className="flex gap-3 text-body text-muted-foreground">
                    <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-10">
            <section>
              <h2 className="mb-3 px-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                {t('companyInfo.title')}
              </h2>
              <GroupedList>
                {experience.location && (
                  <GroupedListItem leading={<MapPin className={rowIconClass} />} title={experience.location} />
                )}
                {experience.teamSize && (
                  <GroupedListItem
                    leading={<Users className={rowIconClass} />}
                    title={t('companyInfo.teamSize', { size: experience.teamSize })}
                  />
                )}
                {experience.industry && (
                  <GroupedListItem leading={<Building className={rowIconClass} />} title={experience.industry} />
                )}
                <GroupedListItem leading={<Calendar className={rowIconClass} />} title={experience.duration} />
                <GroupedListItem leading={<Briefcase className={rowIconClass} />} title={employmentType} />
                {experience.website && <GroupedListItem title={t('visitWebsite')} href={experience.website} />}
              </GroupedList>
            </section>
            <section>
              <h2 className="mb-3 px-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                {t('skillsAndTech')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((item) => (
                  <Badge key={item} variant="secondary" className="px-3 py-1 text-[0.9375rem] font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
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
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, 0 lint warnings.

- [ ] **Step 3: Browser check**

`npm run dev`, then open `/en/about/kpi-com-devops-engineer`:
- **‹ Back to About** sits at the top left and goes to `/en/about`.
- The header has the logo in a gray rounded square, the position in `title-1`, "company · dates", and a green **Current** pill.
- Responsibilities use gray bullets and achievements use blue checkmarks, in a readable column. The sidebar has an icon-labelled grouped list and gray technology pills. At 390px the sidebar stacks below.
- The employment type is translated on `/ru` and `/uz`.
- The Previous/Next tiles at the bottom stay on the current locale and shrink while pressed. The first experience shows only "Next".
- An unknown slug (`/en/about/does-not-exist`) shows the 404 page.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/about/[slug]/page.tsx"
git commit -m "feat(about): article layout for experience detail with spec sheet and neighbor nav" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Media viewer (pan/zoom with momentum, shared-element fullscreen) and project detail

**Files:**
- Create: `src/lib/pan-zoom.test.ts`, `src/lib/pan-zoom.ts`, `src/components/media-viewer.tsx`
- Rewrite: `src/app/[locale]/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `spring`, `clamp`, `rubberbandClamp`, `project`, `createVelocityTracker` (T2); `useThemedSrc` (T6); `GroupedList`, `GroupedListItem`, `StatusDot`, `Badge`, `Button` `plain` (T3); `ScrollReveal` (T2); message keys `projects.zoomIn|zoomOut|resetZoom|enterFullscreen|exitFullscreen|play|pause|mute|unmute` (T1).
- Produces:
  - `@/lib/pan-zoom`:
    - `type Point = { x: number; y: number }`
    - `type Size = { width: number; height: number }`
    - `MIN_ZOOM = 1`, `MAX_ZOOM = 3`
    - `getPanBounds(container: Size, scale: number): Point`: the max absolute offset per axis
    - `zoomAt(offset: Point, focus: Point, fromScale: number, toScale: number): Point`: keeps the content under `focus`, measured from the center, fixed
  - `MediaViewer({ src, alt, isVideo? })`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/pan-zoom.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPanBounds, MAX_ZOOM, MIN_ZOOM, zoomAt } from './pan-zoom.ts';

test('no panning at 1x; half the overflow per side when zoomed', () => {
  assert.deepEqual(getPanBounds({ width: 400, height: 300 }, 1), { x: 0, y: 0 });
  assert.deepEqual(getPanBounds({ width: 400, height: 300 }, 2), { x: 200, y: 150 });
  assert.deepEqual(getPanBounds({ width: 400, height: 300 }, 0.5), { x: 0, y: 0 });
});

test('zoomAt keeps the point under the cursor fixed', () => {
  assert.deepEqual(zoomAt({ x: 0, y: 0 }, { x: 0, y: 0 }, 1, 2), { x: 0, y: 0 });
  assert.deepEqual(zoomAt({ x: 0, y: 0 }, { x: 100, y: 50 }, 1, 2), { x: -100, y: -50 });
  assert.deepEqual(zoomAt({ x: -100, y: -50 }, { x: 100, y: 50 }, 2, 1), { x: 0, y: 0 });
});

test('zoom range is 1x to 3x', () => {
  assert.equal(MIN_ZOOM, 1);
  assert.equal(MAX_ZOOM, 3);
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `./pan-zoom.ts`.

- [ ] **Step 3: Implement**

Create `src/lib/pan-zoom.ts`:

```ts
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

/** Content scaled about its center overflows by size·(scale−1)/2 on each side; that is the pan range. */
export function getPanBounds(container: Size, scale: number): Point {
  return {
    x: Math.max(0, (container.width * (scale - 1)) / 2),
    y: Math.max(0, (container.height * (scale - 1)) / 2),
  };
}

/** New offset that keeps the content point under `focus` (relative to the center) in place while zooming. */
export function zoomAt(offset: Point, focus: Point, fromScale: number, toScale: number): Point {
  const ratio = toScale / fromScale;
  return {
    x: focus.x - (focus.x - offset.x) * ratio,
    y: focus.y - (focus.y - offset.y) * ratio,
  };
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npm test`
Expected: `pass 16`, `fail 0`.

- [ ] **Step 5: Media viewer component**

Create `src/components/media-viewer.tsx`:

```tsx
'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { Maximize, Pause, Play, RotateCcw, Volume2, VolumeX, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { clamp, createVelocityTracker, project, rubberbandClamp, spring } from '@/lib/motion';
import { getPanBounds, MAX_ZOOM, MIN_ZOOM, zoomAt, type Point } from '@/lib/pan-zoom';
import { cn } from '@/lib/utils';

type VelocityTracker = ReturnType<typeof createVelocityTracker>;

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  trackX: VelocityTracker;
  trackY: VelocityTracker;
}

function stageSize(element: HTMLElement | null) {
  return { width: element?.clientWidth ?? 0, height: element?.clientHeight ?? 0 };
}

interface ViewerChipProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  children: React.ReactNode;
}

function ViewerChip({ label, onClick, disabled, autoFocus, children }: ViewerChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      aria-label={label}
      title={label}
      className="material-chip flex size-11 items-center justify-center rounded-full text-foreground shadow-sm transition-[scale,opacity] duration-100 active:scale-[0.92] disabled:opacity-40 [&_svg]:size-[18px]"
    >
      {children}
    </button>
  );
}

interface ZoomPanStageProps {
  src: string;
  alt: string;
  layoutId: string;
  /** False while the same image is shown fullscreen, so the shared layout animation has one owner. */
  showImage: boolean;
  sizes: string;
  className?: string;
  priority?: boolean;
  extraControls?: React.ReactNode;
}

function ZoomPanStage({ src, alt, layoutId, showImage, sizes, className, priority = false, extraControls }: ZoomPanStageProps) {
  const t = useTranslations('projects');
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  // Spring to a resting state inside the pan bounds, inheriting any release velocity.
  const settle = useCallback(
    (toScale: number, offset: Point, velocity: Point = { x: 0, y: 0 }) => {
      const bounds = getPanBounds(stageSize(stageRef.current), toScale);
      const hasMomentum = velocity.x !== 0 || velocity.y !== 0;
      animate(scale, toScale, spring.default);
      animate(x, clamp(offset.x, -bounds.x, bounds.x), hasMomentum ? { ...spring.momentum, velocity: velocity.x } : spring.default);
      animate(y, clamp(offset.y, -bounds.y, bounds.y), hasMomentum ? { ...spring.momentum, velocity: velocity.y } : spring.default);
      setZoom(toScale);
    },
    [scale, x, y]
  );

  // Zoom around a point (relative to the stage center), starting from the live on-screen values.
  const zoomTo = (toScale: number, focus: Point = { x: 0, y: 0 }) => {
    const next = clamp(toScale, MIN_ZOOM, MAX_ZOOM);
    settle(next, zoomAt({ x: x.get(), y: y.get() }, focus, scale.get(), next));
  };

  // Ctrl/⌘ + wheel (a trackpad pinch on macOS) zooms 1:1 around the pointer.
  // A plain wheel is left alone, so the page keeps scrolling.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      const focus = { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
      const current = scale.get();
      const next = clamp(current * Math.exp(-event.deltaY * 0.01), MIN_ZOOM, MAX_ZOOM);
      const offset = zoomAt({ x: x.get(), y: y.get() }, focus, current, next);
      const bounds = getPanBounds(stageSize(stage), next);
      scale.jump(next);
      x.jump(clamp(offset.x, -bounds.x, bounds.x));
      y.jump(clamp(offset.y, -bounds.y, bounds.y));
      setZoom(next);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [scale, x, y]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= MIN_ZOOM || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    x.stop();
    y.stop();
    const trackX = createVelocityTracker();
    const trackY = createVelocityTracker();
    trackX.add(event.timeStamp, event.clientX);
    trackY.add(event.timeStamp, event.clientY);
    // Origin = the live position, so the image stays under the finger exactly where it was grabbed.
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: x.get(),
      originY: y.get(),
      trackX,
      trackY,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const size = stageSize(stageRef.current);
    const bounds = getPanBounds(size, scale.get());
    x.set(rubberbandClamp(drag.originX + event.clientX - drag.startX, -bounds.x, bounds.x, size.width));
    y.set(rubberbandClamp(drag.originY + event.clientY - drag.startY, -bounds.y, bounds.y, size.height));
    drag.trackX.add(event.timeStamp, event.clientX);
    drag.trackY.add(event.timeStamp, event.clientY);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    // A release sample makes a pause-then-lift read as zero velocity (no accidental fling).
    drag.trackX.add(event.timeStamp, event.clientX);
    drag.trackY.add(event.timeStamp, event.clientY);
    const velocity = { x: drag.trackX.velocity(), y: drag.trackY.velocity() };
    settle(scale.get(), { x: x.get() + project(velocity.x), y: y.get() + project(velocity.y) }, velocity);
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        'relative select-none overflow-hidden rounded-tile bg-secondary',
        zoom > MIN_ZOOM && 'cursor-grab active:cursor-grabbing',
        className
      )}
      style={{ touchAction: zoom > MIN_ZOOM ? 'none' : 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {showImage && (
        <motion.div layoutId={layoutId} className="absolute inset-0" transition={spring.default}>
          <motion.div className="absolute inset-0" style={{ x, y, scale }}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              draggable={false}
              className="pointer-events-none object-contain p-4"
            />
          </motion.div>
        </motion.div>
      )}
      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <ViewerChip label={t('zoomOut')} onClick={() => zoomTo(scale.get() / 1.5)} disabled={zoom <= MIN_ZOOM}>
          <ZoomOut />
        </ViewerChip>
        <span className="material-chip flex h-11 min-w-16 items-center justify-center rounded-full px-3 text-caption tabular-nums shadow-sm">
          {Math.round(zoom * 100)}%
        </span>
        <ViewerChip label={t('zoomIn')} onClick={() => zoomTo(scale.get() * 1.5)} disabled={zoom >= MAX_ZOOM}>
          <ZoomIn />
        </ViewerChip>
        <ViewerChip label={t('resetZoom')} onClick={() => settle(MIN_ZOOM, { x: 0, y: 0 })} disabled={zoom === MIN_ZOOM}>
          <RotateCcw />
        </ViewerChip>
        {extraControls}
      </div>
    </div>
  );
}

interface FullscreenViewerProps {
  src: string;
  alt: string;
  layoutId: string;
  onClose: () => void;
}

function FullscreenViewer({ src, alt, layoutId, onClose }: FullscreenViewerProps) {
  const t = useTranslations('projects');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={alt}>
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      <ZoomPanStage
        src={src}
        alt={alt}
        layoutId={layoutId}
        showImage
        sizes="95vw"
        className="h-[90dvh] w-full max-w-[1400px] rounded-none bg-transparent"
        extraControls={
          <ViewerChip label={t('exitFullscreen')} onClick={onClose} autoFocus>
            <X />
          </ViewerChip>
        }
      />
    </div>
  );
}

function VideoViewer({ src }: { src: string }) {
  const t = useTranslations('projects');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => setIsPlaying(!video.paused);
    sync();
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('ended', sync);
    return () => {
      video.removeEventListener('play', sync);
      video.removeEventListener('pause', sync);
      video.removeEventListener('ended', sync);
    };
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(console.error);
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="relative h-96 overflow-hidden rounded-tile bg-secondary lg:h-[500px]">
      <video
        key={src}
        ref={videoRef}
        src={src}
        className="size-full object-contain"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <ViewerChip label={isPlaying ? t('pause') : t('play')} onClick={togglePlay}>
          {isPlaying ? <Pause /> : <Play />}
        </ViewerChip>
        <ViewerChip label={isMuted ? t('unmute') : t('mute')} onClick={toggleMute}>
          {isMuted ? <VolumeX /> : <Volume2 />}
        </ViewerChip>
      </div>
    </div>
  );
}

interface MediaViewerProps {
  src: string;
  alt: string;
  isVideo?: boolean;
}

export function MediaViewer({ src, alt, isVideo = false }: MediaViewerProps) {
  const t = useTranslations('projects');
  const layoutId = useId();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  if (isVideo) return <VideoViewer src={src} />;

  return (
    <>
      <ZoomPanStage
        src={src}
        alt={alt}
        layoutId={layoutId}
        showImage={!isFullscreen}
        sizes="(max-width: 1200px) 100vw, 1200px"
        priority
        className="h-96 lg:h-[500px]"
        extraControls={
          <ViewerChip label={t('enterFullscreen')} onClick={() => setIsFullscreen(true)}>
            <Maximize />
          </ViewerChip>
        }
      />
      <AnimatePresence>
        {isFullscreen && (
          <FullscreenViewer key="fullscreen" src={src} alt={alt} layoutId={layoutId} onClose={closeFullscreen} />
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 6: Rewrite the project detail page**

Replace the entire contents of `src/app/[locale]/projects/[slug]/page.tsx` with:

```tsx
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useLocale, useMessages, useTranslations } from 'next-intl';
import { Building2, ChevronLeft, ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { MediaViewer } from '@/components/media-viewer';
import { ScrollReveal } from '@/components/scroll-reveal';
import { StatusDot } from '@/components/status-dot';
import { generateProjectSlug, getAllProjects, getExperienceSlugByCompany, localizeProjects } from '@/lib/data';
import { useThemedSrc } from '@/lib/use-themed-src';

const rowIconClass = 'size-5 text-muted-foreground';

export default function ProjectPage() {
  const t = useTranslations('projects');
  const locale = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const messages = useMessages();
  const projects = useMemo(() => localizeProjects(getAllProjects(), messages), [messages]);
  const project = projects.find((p) => p.slug === slug || generateProjectSlug(p.title) === slug);

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

  const status = project.originalStatus ?? project.status;
  const companySlug = project.companyName ? getExperienceSlugByCompany(project.companyName) : null;
  const companyHref = companySlug ? `/${locale}/about/${companySlug}` : `/${locale}/about`;

  return (
    <article className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <Button asChild variant="plain" size="sm">
          <Link href={`/${locale}/projects`}>
            <ChevronLeft className="size-4" />
            {t('backToProjects')}
          </Link>
        </Button>

        <ScrollReveal className="mt-8 max-w-[800px]">
          <h1 className="text-title-1 text-balance">{project.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StatusDot status={status} label={project.status} />
            <span className="text-caption text-muted-foreground">{project.year}</span>
            {project.companyName && <span className="text-caption text-muted-foreground">{project.companyName}</span>}
          </div>
        </ScrollReveal>

        <div className="mt-10">
          <MediaViewer src={mediaSrc} alt={project.title} isVideo={project.isVideo} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="text-title-2">{t('aboutProject')}</h2>
              <p className="mt-4 max-w-[680px] text-body-lg text-muted-foreground text-pretty">{project.fullDescription}</p>
            </section>
            <section>
              <h2 className="text-title-2">{t('technologies')}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1 text-[0.9375rem] font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <GroupedList>
              <GroupedListItem title={t('status.title')} trailing={<StatusDot status={status} label={project.status} />} />
              <GroupedListItem title={t('year')} trailing={project.year} />
              {project.companyName && (
                <GroupedListItem leading={<Building2 className={rowIconClass} />} title={project.companyName} href={companyHref} />
              )}
              {project.liveUrl && (
                <GroupedListItem leading={<ExternalLink className={rowIconClass} />} title={t('liveDemo')} href={project.liveUrl} />
              )}
              {project.githubUrl && (
                <GroupedListItem leading={<Github className={rowIconClass} />} title={t('viewCode')} href={project.githubUrl} />
              )}
            </GroupedList>
          </aside>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 7: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, 0 lint warnings.

- [ ] **Step 8: Browser check (image project, 1440px)**

`npm run dev`, then open `/en/projects/<an image project slug>`. Take it from the URL of a non-video card on `/en/projects`.
- **‹ Back to Projects** at the top, then the title, a status dot, and the year.
- **No scroll hijack:** with the mouse over the image, the plain wheel scrolls the page. The old code froze the page here.
- **Pinch zoom:** a trackpad pinch (or Ctrl + wheel) zooms around the pointer and tracks the fingers 1:1. The % chip updates.
- **Pan:** at 200%, drag the image. It stays under the cursor from the grab point. Drag past an edge and it resists more the further you go; release and it springs back inside. Flick and release, and it coasts and settles with a slight bounce.
- **Buttons:** +/− zoom animate from wherever the image is, even mid-animation.
- **Fullscreen:** ⤢ grows the image out of its inline spot to fill the screen over a black scrim. ✕, Esc, or a scrim click shrinks it back into place.
  - **Review Focus #2:** open and close fullscreen 4 times quickly. It ends in the state of the last action and the inline image is visible, never missing.
- **Touch at 390px:** a one-finger vertical swipe over the image at 100% scrolls the page. After zooming with +, a one-finger drag pans the image.

- [ ] **Step 9: Browser check (video project)**

Open a project whose card is a video. It autoplays muted and loops. The play/pause and mute chips work and their labels swap. The page shows no native controls.

- [ ] **Step 10: Commit**

```bash
git add src/lib/pan-zoom.ts src/lib/pan-zoom.test.ts src/components/media-viewer.tsx "src/app/[locale]/projects/[slug]/page.tsx"
git commit -m "feat(projects): pointer-driven pan/zoom with momentum, shared-element fullscreen, article layout" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Contact: inline validation, in-place confirmation, grouped contact methods

**Files:**
- Create: `src/lib/validation.test.ts`, `src/lib/validation.ts`
- Rewrite: `src/app/[locale]/contact/page.tsx`

**Interfaces:**
- Consumes: `Card`, `Button`, `Input`, `Textarea`, `GroupedList`, `GroupedListItem`, `SectionHeader` (T3); `Label` (existing `@/components/ui/label`); `ScrollReveal`, `spring` (T2); message keys `contact.*`, including `contact.form.sendAnother` and `contact.form.invalidEmail` (T1). The `/api/contact` POST contract is unchanged: `{ name, email, subject, message }` in, `{ error? }` back on failure.
- Produces: `isValidEmail(value: string): boolean` (`@/lib/validation`). It trims, then requires `local@domain.tld` with no whitespace.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/validation.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail } from './validation.ts';

test('accepts ordinary addresses', () => {
  assert.equal(isValidEmail('a@b.co'), true);
  assert.equal(isValidEmail('first.last+tag@example.co.uk'), true);
});

test('ignores surrounding whitespace', () => {
  assert.equal(isValidEmail('  a@b.co  '), true);
});

test('rejects incomplete or spaced addresses', () => {
  for (const value of ['', 'a', 'a@b', '@b.co', 'a@.co', 'a b@c.com', 'a@b .co']) {
    assert.equal(isValidEmail(value), false, `expected "${value}" to be rejected`);
  }
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `./validation.ts`.

- [ ] **Step 3: Implement**

Create `src/lib/validation.ts`:

```ts
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Light client-side check (local@domain.tld); the API remains the source of truth. */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npm test`
Expected: `pass 19`, `fail 0`.

- [ ] **Step 5: Rewrite the contact page**

Replace the entire contents of `src/app/[locale]/contact/page.tsx` with:

```tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionHeader } from '@/components/section-header';
import { getProfile } from '@/lib/data';
import { spring } from '@/lib/motion';
import { isValidEmail } from '@/lib/validation';

const MAX_MESSAGE_LENGTH = 3000; // Telegram has a 4096 character limit, leaving some buffer
const emptyForm = { name: '', email: '', subject: '', message: '' };

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'sent' } | { kind: 'error'; detail?: string };

function RowIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-8 items-center justify-center rounded-[9px] bg-primary-fill text-white">
      <Icon className="size-4" />
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

  const responseLabel = (key: 'email' | 'phone' | 'socialMedia') => t(`responseTimes.${key}`).replace(/:$/, '');

  return (
    <div className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <SectionHeader as="h1" title={t('header.title')} subtitle={t('header.subtitle')} />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ScrollReveal>
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
                    className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                  >
                    <CheckCircle2 className="size-14 text-success" strokeWidth={1.5} aria-hidden />
                    <p className="mt-6 text-title-2">{t('form.success')}</p>
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
                  >
                    <h2 className="text-title-2">{t('form.title')}</h2>
                    <p className="mt-2 text-body text-muted-foreground">{t('form.description')}</p>

                    <div className="mt-8 space-y-5">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('form.name')}</Label>
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
                          <Label htmlFor="email">{t('form.email')}</Label>
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
                          <Label htmlFor="message">{t('form.message')}</Label>
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
                          <p className="text-caption text-amber-600 dark:text-amber-400">{t('form.charLimitWarning')}</p>
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
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.05} className="space-y-12">
            <section>
              <h2 className="text-title-2">{t('info.title')}</h2>
              <p className="mt-2 text-body text-muted-foreground">{t('info.description')}</p>
              <GroupedList className="mt-6">
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
            </section>

            <section>
              <h2 className="text-title-2">{t('responseTimes.title')}</h2>
              <p className="mt-2 text-body text-muted-foreground">{t('responseTimes.description')}</p>
              <GroupedList className="mt-6">
                <GroupedListItem leading={<RowIcon icon={Mail} />} title={responseLabel('email')} trailing={t('responseTimes.emailTime')} />
                <GroupedListItem leading={<RowIcon icon={Phone} />} title={responseLabel('phone')} trailing={t('responseTimes.phoneTime')} />
                <GroupedListItem
                  leading={<RowIcon icon={MessageCircle} />}
                  title={responseLabel('socialMedia')}
                  trailing={t('responseTimes.socialMediaTime')}
                />
              </GroupedList>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, 0 lint warnings.

- [ ] **Step 7: Browser check**

`npm run dev`, then open `/en/contact`:
- The form sits on a gray card with 44px translucent fields. Focusing a field shows a blue ring.
- Type `a@b` in Email and tab away. A red caption appears under the field, the field gets a red ring, and fixing the address clears it as you type.
- **Error path:** in DevTools → Network, set the request-blocking pattern `*/api/contact` and submit a valid form. A red inline alert appears above the button, every typed value is still there, and no `alert()` dialog shows. Remove the block.
- **Success path** (needs the Telegram env vars from `.env.example` in `.env.local`; skip this bullet if they're not set): submit. The form cross-fades into a green checkmark with "Message sent successfully!". **Send another message** brings back an empty form.
- While submitting, the button shows a spinner and "Sending…" and keeps its full width.
- The right column has grouped lists with blue icon squares. Email opens the mail client and phone uses `tel:`. Response-time labels have no trailing colon.

- [ ] **Step 8: Commit**

```bash
git add src/lib/validation.ts src/lib/validation.test.ts "src/app/[locale]/contact/page.tsx"
git commit -m "feat(contact): inline email validation, in-place confirmation, grouped contact methods" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Chatbot: interruptible panel, draggable mobile sheet, iMessage bubbles

**Files:**
- Create: `src/lib/use-media-query.ts`, `src/components/chat-conversation.tsx`
- Rewrite: `src/components/chatbot.tsx`

**Interfaces:**
- Consumes:
  - From earlier tasks: `spring`, `shouldDismiss` (T2); `CrossfadeIcon`, `Button` (T3); `animate-typing`, `bg-bubble-incoming`, `bg-primary-fill`, `material-sheet` (T1); message keys `chatbot.*`, including `chatbot.today` (T1).
  - Existing: `LinkParser` (`@/lib/link-parser`).
  - `/api/chat` POST contract unchanged: `{ message, history: {role, content}[] }` in, `{ response }` back, 429 for off-topic rate limiting.
- Produces:
  - `useMediaQuery(query: string): boolean` (`@/lib/use-media-query`). It returns `false` on the server.
  - `ChatMessage` type and `ChatConversation` props (see code).

- [ ] **Step 1: Media-query hook**

Create `src/lib/use-media-query.ts`:

```ts
'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Live `matchMedia` result; false during SSR and hydration. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query]
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
```

- [ ] **Step 2: Conversation view**

Create `src/components/chat-conversation.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LinkParser } from '@/lib/link-parser';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatConversationProps {
  messages: ChatMessage[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  /** Desktop focuses the field on open; mobile doesn't, so the keyboard doesn't cover the sheet. */
  autoFocus?: boolean;
  /** Mobile sheet: show a grabber and let the header start the drag. */
  showGrabber?: boolean;
  onHeaderPointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void;
}

export function ChatConversation({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  onClose,
  autoFocus = false,
  showGrabber = false,
  onHeaderPointerDown,
}: ChatConversationProps) {
  const t = useTranslations('chatbot');
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view once the DOM has painted it.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const list = listRef.current;
      if (list) list.scrollTop = list.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, isLoading]);

  const startedAt = messages[0]?.timestamp;
  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="flex h-full flex-col">
      <div
        onPointerDown={onHeaderPointerDown}
        className={cn('shrink-0 border-b border-border px-5 pb-3', showGrabber ? 'touch-none pt-2' : 'pt-4')}
      >
        {showGrabber && <div aria-hidden className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-muted-foreground/40" />}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="chat-title" className="text-headline">
              {t('title')}
            </h2>
            <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-success" />
              {t('status')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('aria.closeChat')}
            className="flex size-8 items-center justify-center rounded-full bg-black/[0.05] text-muted-foreground transition-transform duration-100 active:scale-90 dark:bg-white/[0.1]"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div ref={listRef} aria-live="polite" className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {startedAt && (
          <p className="mb-3 text-center text-caption text-muted-foreground">
            {t('today', { time: startedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
          </p>
        )}
        <div className="space-y-2">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring.snappy}
              className={cn('flex', message.isUser ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] whitespace-pre-wrap break-words rounded-[18px] px-3.5 py-2 text-[0.9375rem] leading-snug',
                  message.isUser
                    ? 'bg-primary-fill text-white [&_a]:text-white [&_a:hover]:text-white'
                    : 'bg-bubble-incoming text-foreground [&_a]:text-primary [&_a:hover]:text-primary'
                )}
              >
                <LinkParser text={message.content} />
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div aria-hidden className="flex justify-start">
              <div className="flex gap-1 rounded-[18px] bg-bubble-incoming px-4 py-3">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="size-2 rounded-full bg-muted-foreground/70 motion-safe:animate-typing"
                    style={{ animationDelay: `${dot * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
        className="shrink-0 border-t border-border p-3"
      >
        <div className="relative">
          <input
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={t('placeholder')}
            aria-label={t('placeholder')}
            autoFocus={autoFocus}
            enterKeyHint="send"
            className="h-10 w-full rounded-full bg-black/[0.05] pl-4 pr-12 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/[0.08]"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={t('aria.sendMessage')}
            className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary-fill text-white transition-[scale,background-color] duration-100 active:scale-90 disabled:bg-muted-foreground/30"
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite the chatbot shell**

Replace the entire contents of `src/components/chatbot.tsx` with:

```tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, type PanInfo } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ChatConversation, type ChatMessage } from '@/components/chat-conversation';
import { CrossfadeIcon } from '@/components/crossfade-icon';
import { shouldDismiss, spring } from '@/lib/motion';
import { useMediaQuery } from '@/lib/use-media-query';
import { cn } from '@/lib/utils';

const SHEET_HEIGHT_RATIO = 0.85; // matches h-[85dvh]

export function Chatbot() {
  const t = useTranslations('chatbot');
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [isOpen, setIsOpen] = useState(false);
  const [launcherReady, setLauncherReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: '1', content: t('welcome'), isUser: false, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exitVelocity, setExitVelocity] = useState(0);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const dragControls = useDragControls();
  const sheetY = useMotionValue(0);

  // Launcher appears after 2s; welcome popup after 3s, auto-hiding after 8s unless hovered.
  useEffect(() => {
    const timer = setTimeout(() => setLauncherReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showWelcome || isHovering) return;
    const timer = setTimeout(() => setShowWelcome(false), 8000);
    return () => clearTimeout(timer);
  }, [showWelcome, isHovering]);

  const open = () => {
    setExitVelocity(0);
    setIsOpen(true);
    setShowWelcome(false);
  };
  const close = useCallback(() => setIsOpen(false), []);

  // Esc closes; the mobile sheet locks page scroll; focus returns to the launcher after closing.
  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) launcherRef.current?.focus();
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    if (isMobile) root.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, isMobile, close]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), content: text, isUser: true, timestamp: new Date() };
    // History for context excludes the initial welcome message.
    const history = [...messages.slice(1), userMessage].map((message) => ({
      role: message.isUser ? 'user' : 'assistant',
      content: message.content,
    }));
    const reply = (content: string) =>
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), content, isUser: false, timestamp: new Date() }]);

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowWelcome(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      if (response.status === 429) {
        reply(t('errors.tooManyOffTopic'));
        return;
      }
      if (!response.ok) {
        reply(t('errors.generic'));
        return;
      }
      const data = await response.json();
      reply(data.response || t('errors.generic'));
    } catch (error) {
      console.error('Chatbot error:', error);
      reply(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  // Decide from where the flick is heading; hand the release velocity to the exit or snap-back spring.
  const handleSheetDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const sheetHeight = window.innerHeight * SHEET_HEIGHT_RATIO;
    if (shouldDismiss(sheetY.get(), info.velocity.y, sheetHeight * 0.4)) {
      setExitVelocity(info.velocity.y);
      close();
    } else {
      animate(sheetY, 0, { ...spring.momentum, velocity: info.velocity.y });
    }
  };

  const sheetVariants = {
    hidden: (velocity: number) => ({
      y: window.innerHeight,
      transition: velocity > 0 ? { ...spring.momentum, velocity } : spring.default,
    }),
    visible: { y: 0, transition: spring.default },
  };

  const conversationProps = {
    messages,
    isLoading,
    input,
    onInputChange: setInput,
    onSend: sendMessage,
    onClose: close,
  };

  const launcherVisible = launcherReady && !(isOpen && isMobile);

  return (
    <>
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        initial={false}
        animate={{ opacity: launcherVisible ? 1 : 0, scale: launcherVisible ? 1 : 0.9 }}
        whileTap={{ scale: 0.94 }}
        transition={spring.default}
        tabIndex={launcherVisible ? 0 : -1}
        aria-hidden={!launcherVisible}
        aria-label={isOpen ? t('aria.closeChat') : t('aria.openChat')}
        aria-expanded={isOpen}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex size-[52px] items-center justify-center rounded-full bg-primary-fill text-white shadow-[0_8px_24px_rgb(0_0_0/0.18)]',
          !launcherVisible && 'pointer-events-none'
        )}
      >
        <CrossfadeIcon showAlt={isOpen} icon={MessageCircle} altIcon={X} className="size-6" />
      </motion.button>

      {/* Desktop: a parallel panel that grows from the launcher; no scrim, the page stays usable. */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            key="chat-panel"
            role="dialog"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring.default}
            style={{ transformOrigin: 'bottom right' }}
            className="material-sheet fixed bottom-[88px] right-6 z-50 h-[min(560px,calc(100dvh-120px))] w-[360px] overflow-hidden rounded-[24px]"
          >
            <ChatConversation {...conversationProps} autoFocus />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: a modal bottom sheet with a dimming scrim; drag the header down to dismiss. */}
      <AnimatePresence custom={exitVelocity}>
        {isOpen && isMobile && (
          <motion.div
            key="chat-scrim"
            aria-hidden
            className="fixed inset-0 z-[55] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring.default}
            onClick={close}
          />
        )}
        {isOpen && isMobile && (
          <motion.div
            key="chat-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            custom={exitVelocity}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.1 }}
            dragMomentum={false}
            onDragEnd={handleSheetDragEnd}
            style={{ y: sheetY }}
            className="material-sheet fixed inset-x-0 bottom-0 z-[60] h-[85dvh] overflow-hidden rounded-t-[24px] pb-[env(safe-area-inset-bottom)]"
          >
            <ChatConversation
              {...conversationProps}
              showGrabber
              onHeaderPointerDown={(event) => dragControls.start(event)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome notification rises from the launcher. */}
      <AnimatePresence>
        {showWelcome && !isOpen && (
          <motion.div
            key="chat-welcome"
            role="status"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={spring.default}
            style={{ transformOrigin: 'bottom right' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="material-sheet fixed bottom-[88px] right-6 z-[45] w-[300px] max-w-[calc(100vw-3rem)] rounded-[20px] p-4"
          >
            <p className="text-[0.9375rem] font-semibold">{t('popup.title')}</p>
            <p className="mt-1 text-caption text-muted-foreground">{t('popup.subtitle')}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={open}>
                {t('popup.startChat')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowWelcome(false)}>
                {t('popup.maybeLater')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 4: Lint and build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, 0 lint warnings.

- [ ] **Step 5: Browser check (desktop, 1440px) — Review Focus #2 and #4**

`npm run dev`, then go to `/en` and wait:
- At about 2s the blue launcher fades and scales in, with no spin. At about 3s a frosted notification rises from it. Hovering keeps it open; otherwise it leaves after 8s.
- Click the launcher. A frosted panel grows out of the launcher's corner, the icon cross-fades to ✕, the input is focused, and the page behind stays usable.
- **Interrupt:** click the launcher twice quickly. The panel reverses mid-flight from wherever it was, with no jump and no stuck half-open state. Repeat 6 clicks. The final state matches an even (closed) or odd (open) count.
- Esc closes the panel and moves focus back to the launcher (it shows a visible focus ring).
- Send "What does Shaxriyor do?" (needs `OPENAI_API_KEY` in `.env.local`; without it, you get the generic error bubble, which is also fine for this check). Your message shows as a blue right-aligned bubble, the gray typing dots pulse, and the reply arrives as a gray bubble. A single "Today …" caption sits at the top.
- **Review Focus #4:**
  1. Send a message and immediately close the panel.
  2. Wait 5s and reopen. The reply is there exactly once.
  3. While a reply is loading, press Enter 5 times with text in the field. Nothing extra is sent (Send is disabled), and you can still type.

- [ ] **Step 6: Browser check (mobile, 390px)**

- Tap the launcher. A sheet rises from the bottom over a dimmed page, the launcher hides, and the keyboard doesn't auto-open.
- Drag the header down slowly about 100px and release. It springs back to the top.
- Flick the header down quickly from about 50px. It dismisses, continuing at the finger's speed.
- Drag a long way down slowly (past 40%) and release. It dismisses.
- Drag up from the top. It resists (rubber-band) and returns.
- Scrolling the message list scrolls messages, not the sheet. Tapping the scrim closes the sheet.
- Under `prefers-reduced-motion: reduce`, the panel and sheet only fade and the typing dots are static.

- [ ] **Step 7: Commit**

```bash
git add src/lib/use-media-query.ts src/components/chat-conversation.tsx src/components/chatbot.tsx
git commit -m "feat(chat): interruptible panel, flick-to-dismiss mobile sheet, iMessage-style bubbles" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Final sweep: 404 pages, remove the `glass` alias, dead code, full verification

**Files:**
- Rewrite: `src/app/[locale]/not-found.tsx`, `src/app/not-found.tsx`
- Modify: `src/components/ui/button.tsx` (delete the `glass` variant)
- Delete: `src/components/skill-badge.tsx`

**Interfaces:**
- Consumes: everything above.
- Produces: `Button` no longer accepts `variant="glass"`.

- [ ] **Step 1: Locale 404**

Replace the entire contents of `src/app/[locale]/not-found.tsx` with:

```tsx
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-display text-muted-foreground">404</p>
        <h1 className="mt-4 text-title-2">{t('notFound')}</h1>
        <p className="mx-auto mt-3 max-w-md text-body text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild variant="plain" className="mt-6">
          <Link href={`/${locale}`}>
            {t('backToHome')}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Root 404 (rendered outside the locale layout, so it uses no providers)**

Replace the entire contents of `src/app/not-found.tsx` with:

```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-display text-muted-foreground">404</p>
        <h1 className="mt-4 text-title-1">Page Not Found</h1>
        <p className="mt-4 text-body-lg text-muted-foreground text-pretty">
          Oops! The page you&apos;re looking for seems to have vanished into the digital void. Don&apos;t worry,
          even the best DevOps engineers encounter 404s sometimes!
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/projects">Browse Projects</Link>
          </Button>
        </div>
        <p className="mt-12 rounded-lg bg-secondary p-6 text-caption text-muted-foreground">
          💡 <strong className="text-foreground">Pro Tip:</strong> This 404 page is deployed with zero-downtime CI/CD
          pipelines. Even this error page follows DevOps best practices!
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Remove the deprecated `glass` alias and the dead badge component**

In `src/components/ui/button.tsx`, delete these two lines:

```tsx
        // Deprecated alias kept until every call site is migrated; removed in the final task.
        glass: `text-foreground ${fill}`,
```

Then:

```bash
git rm src/components/skill-badge.tsx
```

- [ ] **Step 4: Prove the old look is gone**

```bash
grep -rnE "glass|text-gradient|gradient-bg|bg-gradient-to|hover:scale-|ParticleBackground|FloatingElements|TypewriterEffect|ParallaxSection|skill-badge" src || echo "clean"
grep -rnE "text-(xs|sm|base|lg|xl|[2-9]xl)\b" "src/app/[locale]" src/components --include=*.tsx | grep -v "src/components/ui/" || echo "no ad-hoc sizes in pages/components"
```

Expected:
- The first command prints `clean`. Every hit is a leftover: fix it with the token or primitive from Tasks 1–3, then rerun.
- The second command lists only these intentional exceptions:
  - `text-base` on the chat input in `chat-conversation.tsx` (16px stops iOS from zooming the page on focus)
  - `text-base` on the flag emoji in `navigation.tsx`
  - `last-updated.tsx` and `error-boundary.tsx`, which this redesign leaves untouched (spec §8 scope)

  Anything else should move to a type token.

- [ ] **Step 5: Unit tests, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: `pass 19`, `fail 0`, 0 lint errors and 0 warnings, and a clean build showing all routes from the baseline table (`/[locale]`, `/about`, `/about/[slug]`, `/contact`, `/projects`, `/projects/[slug]`, the three API routes, robots, sitemap).

- [ ] **Step 6: Full verification matrix (spec §7)**

With `npm run dev`, walk **every** route: `/`, `/about`, `/about/kpi-com-devops-engineer`, `/projects`, a project detail page, `/contact`, `/en/nope` (locale 404), and `/nope` (root 404). Walk each at:

| Width | Theme | Locale |
|---|---|---|
| 390px | light | en |
| 390px | dark | ru |
| 1440px | dark | en |
| 1440px | light | uz |

On each page:
1. **Review Focus #1:** `document.documentElement.scrollWidth <= document.documentElement.clientWidth` logs `true`.
2. The console shows no errors and no hydration warnings.
3. Content scrolls blurred under the nav, and the nav hairline appears only after scrolling.
4. **Keyboard:** Tab reaches every control in order, the 2px blue focus ring is visible, and Esc closes the open menu, sheet, chat, or fullscreen viewer.

Then on `/en` and one detail page, with DevTools → Rendering:
- `prefers-reduced-motion: reduce`: no transforms animate (only fades), the theme toggle doesn't cross-fade, and the carousel arrows and scroll-to-top jump instead of smooth-scrolling.
- `prefers-reduced-transparency: reduce`: the nav, menus, chat panel, and viewer chips are solid.
- `prefers-contrast: more`: materials are solid with a visible border, and cards and lists show hairline borders.

Interaction spot-checks, each redone once:
- Click the chat launcher twice quickly.
- Flick the mobile chat sheet.
- Tap the mobile nav rapidly.
- Push the carousel arrows to both ends.
- Drag a zoomed image past an edge.
- Click between routes rapidly.

Every check must end in the state of the last input.

- [ ] **Step 7: Commit**

```bash
git add -A "src/app/[locale]/not-found.tsx" src/app/not-found.tsx src/components/ui/button.tsx src/components/skill-badge.tsx
git commit -m "chore(design): Apple-style 404s, drop glass alias and dead SkillBadge" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 8: Hand off**

Report the branch state (`git log --oneline main..apple-redesign`) and anything that failed in Step 6. Then use superpowers:finishing-a-development-branch to decide how to merge.
