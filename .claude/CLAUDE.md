# shaxa.dev

Personal portfolio site for Shaxriyor Jabborov, DevOps Engineer.

## Stack
- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Animations:** Framer Motion + custom ScrollReveal component
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
  data/                 — YAML content (profile.yaml, projects.yaml)
  types/                — Shared TypeScript types
```

## Content pipeline
- `src/data/profile.yaml` — Name, bio, links, skills, experience, education
- `src/data/projects.yaml` — Project cards displayed on home/projects pages
- `src/lib/data.ts` — Loads & transforms YAML into typed objects

## Key conventions
- No barrel exports — import components directly
- Server components by default; `'use client'` only where interactivity needed
- `.env.example` documents required env vars
- Vercel deployment with analytics & speed-insights

## Chatbot architecture
- `src/lib/chat-system-prompt.ts` — System prompt with full profile/projects info
- `src/lib/chat-rate-limit.ts` — In-memory rate limiting for off-topic questions
- `src/lib/chat-logger.ts` — Telegram logging of chatbot interactions
- `src/lib/link-parser.tsx` — Detects and renders URLs/mentions in chat responses
- `src/components/chatbot.tsx` — Client-side chatbot UI with popup welcome
