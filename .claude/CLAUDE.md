# shaxa.dev

Personal portfolio site for Shaxriyor Jabborov, DevOps Engineer.

## Stack
- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Animations:** Framer Motion (springs and fades in `src/lib/motion.ts`)
- **State/theme:** next-themes (dark/light), sonner (toasts)
- **i18n:** next-intl (en/ru/uz), messages in `messages/`
- **API runtime:** Edge (chat), Node (contact, deployment)

## Project structure
```
src/
  app/[locale]/         — Page routes (home, about, projects, contact)
    about/[slug]/       — Experience detail pages
    projects/[slug]/    — Project detail pages
  app/api/
    chat/               — AI chatbot (edge runtime, OpenAI gpt-3.5-turbo)
    contact/            — Contact form (POST → Telegram bot)
    deployment/         — Deployment webhook
  components/
    ui/                 — shadcn/ui primitives (button, card, dialog, etc.)
    icons/              — Custom SVG icons
    *.tsx               — Feature components (chatbot, navigation, footer, etc.)
  lib/                  — Utilities (seo, data, link-parser, chat-*)
  types/                — Shared TypeScript types
```

## Content pipeline
- `src/lib/data.ts` — Language-neutral facts: links, stack, experience and project structure, media paths
- `messages/{en,ru,uz}.json` — All copy, including `data.projects.<slug>` and `data.experiences.<slug>` (title, summary, points) and `data.education.<slug>`
- `localizeProjects` / `localizeExperiences` / `localizeEducation` in `src/lib/data.ts` merge the two
- Facts rule: the CV and the site must agree. A claim that only one of them makes stays off the site (see `docs/superpowers/specs/2026-10-10-apple-redesign-v2-design.md` §9). Tests in `src/lib/*.test.ts` enforce key parity, the stack list and the chatbot prompt

## Key conventions
- No barrel exports — import components directly
- Server components by default; `'use client'` only where interactivity needed
- `.env.example` documents required env vars
- Vercel deployment with analytics & speed-insights
- New copy goes through all three message files; `npm test` fails on mismatched keys, placeholders or numbers

## Chatbot architecture
- `src/lib/chat-system-prompt.ts` — System prompt with full profile/projects info
- `src/lib/chat-rate-limit.ts` — In-memory rate limiting for off-topic questions
- `src/lib/chat-logger.ts` — Telegram logging of chatbot interactions
- `src/lib/link-parser.tsx` — Detects and renders URLs/mentions in chat responses
- `src/components/chatbot.tsx` — Client-side chatbot UI with popup welcome
