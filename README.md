# shaxa.dev

Personal portfolio of Shaxriyor Jabborov, a DevOps engineer based in Tashkent. Live at [shaxa.dev](https://shaxa.dev).

A quiet, Apple-style site: one 980px content column, a black-and-white palette with one blue accent, system fonts on Apple devices and Inter everywhere else, and springs only where motion helps. English, Russian and Uzbek.

## Pages

| Route | What it shows |
| --- | --- |
| `/<locale>` | Hero, selected work, experience, stack, contact |
| `/<locale>/about` | Intro, experience, stack, education, certifications, languages |
| `/<locale>/about/<slug>` | One job: what I did, company, dates, type, technologies |
| `/<locale>/projects` | All projects |
| `/<locale>/projects/<slug>` | One project: media viewer (zoom, pan, fullscreen), what I built, spec sheet |
| `/<locale>/contact` | Contact form (delivered to Telegram) and direct contact links |

`<locale>` is `en`, `ru` or `uz`; the prefix is always present and `/` redirects to the visitor's language.

Also: an AI chat assistant ("Ask Shaxriyor") that answers only questions about me, a light/dark theme that follows the system, downloadable CVs in three languages, and translated 404 pages.

## Stack

- **Next.js 15** (App Router, Turbopack), **React 19**, **TypeScript 5**
- **Tailwind CSS 4** with design tokens in `src/app/globals.css`, **shadcn/ui** (Radix) primitives
- **Framer Motion** for springs, gestures and the image viewer
- **next-intl 4** for i18n, **next-themes** for dark mode, **sonner** for toasts
- **OpenAI** (`gpt-3.5-turbo`, edge runtime) for the chat assistant, **Telegram Bot API** for the contact form
- **Vercel** hosting with Analytics and Speed Insights

## Getting started

Requires Node.js 22 or newer (`npm test` runs the TypeScript test files directly).

```bash
git clone https://github.com/ilyshaxa/shaxa.dev.git
cd shaxa.dev
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm test` | Node's built-in test runner over `src/lib/**/*.test.ts` |

### Environment variables

| Variable | Required | Used for |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | For the contact form and chat logs | Bot token from [@BotFather](https://t.me/botfather) |
| `TELEGRAM_CHAT_ID` | For the contact form and chat logs | Chat that receives messages (ask [@userinfobot](https://t.me/userinfobot)) |
| `OPENAI_API_KEY` | For the chat assistant | OpenAI API key |
| `PRIMARY_DOMAIN` | No (default `https://shaxa.dev`) | Canonical URLs, hreflang, sitemap and robots |

Without the Telegram variables the contact form returns an error; without the OpenAI key the chat assistant is unavailable. The rest of the site works.

## Project structure

```
src/
  app/
    layout.tsx            Pass-through root layout (icons, manifest)
    not-found.tsx         English 404 for paths outside any locale
    sitemap.ts, robots.ts Served at /sitemap.xml and /robots.txt
    [locale]/
      layout.tsx          <html lang>, theme script, nav, footer, chat, metadata
      page.tsx            Home
      about/, projects/, contact/   Pages; each has a server layout.tsx for metadata
      about/[slug]/, projects/[slug]/   Detail pages
      not-found.tsx       Translated 404
      [...rest]/page.tsx  Sends unmatched locale paths to the translated 404
    api/
      chat/               AI assistant (edge runtime)
      contact/            Contact form -> Telegram
      deployment/         Deployment info webhook
  components/             Feature components (navigation, project-row, media-viewer, chatbot, ...)
    ui/                   shadcn/ui primitives
  lib/
    data.ts               Language-neutral facts (see "Content" below)
    seo.ts                Titles, canonical, hreflang, Open Graph builders
    chat-system-prompt.ts System prompt for the assistant
    *.test.ts             Tests (copy parity, facts, SEO, motion math, ...)
messages/                 en.json, ru.json, uz.json: all user-facing copy
public/                   Images, project media, CV PDFs (public/cv), icons, og.png
docs/superpowers/         Design specs, plans and handoff notes for the redesign
```

## Content

Facts and copy are separate, and the CV and the site must agree.

- **`src/lib/data.ts`** holds language-neutral facts: links, the stack, experience, education, certifications, languages, and each project's slug, technologies, year, status and media paths.
- **`messages/{en,ru,uz}.json`** hold all copy. Project and job text lives under `data.projects.<slug>` and `data.experiences.<slug>` (title, summary, points); education under `data.education.<slug>`.
- `localizeProjects`, `localizeExperiences` and `localizeEducation` in `data.ts` merge the two.

### Adding a project

1. Add an entry to `projectList` in `src/lib/data.ts` (slug, year, status, technologies, media, `highlights`).
2. Add `data.projects.<slug>` (`title`, `companyName`, `summary`, `points`, `outcome` if any) to **all three** message files.
3. Put images or video under `public/projects/`. Use a `-light` and `-dark` variant when the diagram has a theme.
4. Run `npm test`.

### Adding a certification

Add an entry to `profileData.certifications` in `data.ts` (title and issuer are proper names and stay untranslated; `url`, `expires` and `result` are optional) and the same line to the `CERTIFICATIONS` block in `src/lib/chat-system-prompt.ts`. `npm test` fails if the two differ.

### Tests that guard the content

`npm test` fails when the message files have different keys, placeholders or numbers; when a skill the CV does not support (Kubernetes, Terraform, Azure, ...) reappears in the stack or the chatbot prompt; when the prompt's skills, technologies, figures, languages or certificates differ from the site; or when any text claims an AWS certification. Adding copy therefore means adding it to all three languages.

## Internationalisation

Locales are defined in `i18n.ts`; `src/middleware.ts` always prefixes the locale and negotiates the default from the browser. Each language has its own CV in `public/cv/`. Language names in menus are shown in their own language (English, Русский, O'zbekcha).

## SEO

- Per-page titles, descriptions, canonical URLs and `hreflang` (en, ru, uz and `x-default`) come from `src/lib/seo.ts`; canonical URLs always name the primary domain.
- `public/og.png` is the shared 1200x630 link preview.
- Structured data (Person, ProfessionalService, WebSite, projects and certificates) is added by `src/components/structured-data.tsx`.
- `sitemap.xml` lists every page in every language with alternates; `robots.txt` blocks `/api/`.
- The site is also served on `shaxriyor.com`; its pages still canonicalise to `shaxa.dev`.

## AI assistant

- The prompt is `src/lib/chat-system-prompt.ts` and is built only from facts that are on the site.
- Off-topic questions are refused and rate-limited to 5 per IP per 15 minutes (`src/lib/chat-rate-limit.ts`, in memory). Questions about me are not limited.
- Conversations can be logged to Telegram (`src/lib/chat-logger.ts`).

## Deployment

Deployed on Vercel from `main`. Set the environment variables above in the project settings. `vercel.json` runs the chat route on the edge runtime and adds security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`). Both `shaxa.dev` and `shaxriyor.com` can be attached as domains.

## Contact

- Email: [shaxriyor@shaxa.dev](mailto:shaxriyor@shaxa.dev)
- GitHub: [@ilyshaxa](https://github.com/ilyshaxa)
- LinkedIn: [Shaxriyor Jabborov](https://linkedin.com/in/shaxriyor)
- Telegram: [@shaxadev](https://t.me/shaxadev)

## License

[MIT](LICENSE)
