# shaxa.dev - Personal Portfolio Website

A modern, responsive portfolio website built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion. Features an AI chatbot with Telegram notifications, multi-domain SEO support, and a secure SSH keys management system.

## 🚀 Features

### Core
- **Modern Design**: Light/dark theme with glassmorphism effects and smooth animations
- **Responsive**: Fully responsive design for all devices
- **Multi-Domain**: Supports both `shaxa.dev` and `shaxriyor.com` with proper SEO
- **AI Chatbot**: GPT-powered "Ask Shaxriyor" assistant with Telegram notifications
- **TypeScript**: Full type safety throughout the application

### Advanced
- **SSH Keys Management**: Password-protected page (`/keys`) for accessing SSH keys
  - Rate limiting (5 attempts per 15 minutes)
  - Login tracking with Telegram notifications
  - 7-day secure sessions with HTTP-only cookies
- **Interactive Projects**: Zoom, pan, fullscreen for images; video support with custom controls
- **Contact Form**: Server-side validation with Telegram notifications
- **SEO**: Dynamic sitemap, robots.txt, Schema.org structured data, canonical URLs

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15.5.4 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19.1.0, Tailwind CSS 4, shadcn/ui (Radix UI) |
| **Animations** | Framer Motion 12 |
| **AI** | OpenAI GPT-3.5-turbo |
| **Notifications** | Telegram Bot API, Sonner (toasts) |
| **Theme** | next-themes |
| **Deployment** | Vercel (Edge runtime for chat API) |

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/                # Login, logout, session check
│   │   ├── chat/                # AI chatbot (Edge runtime)
│   │   ├── contact/             # Contact form
│   │   └── keys/                # SSH keys (protected)
│   ├── about/                   # About & experience detail pages
│   ├── contact/                 # Contact page
│   ├── keys/                    # SSH keys page (password protected)
│   ├── projects/                # Projects listing & detail pages
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page
│   ├── robots.ts                # Dynamic robots.txt
│   └── sitemap.ts               # Dynamic sitemap
├── components/                  # React components
│   ├── ui/                      # shadcn/ui components
│   ├── chatbot.tsx              # AI chatbot
│   ├── navigation.tsx           # Site navigation
│   └── ...                      # Backgrounds, animations, etc.
├── lib/                         # Utilities
│   ├── data.ts                  # Profile & projects data
│   ├── seo.ts                   # SEO utilities
│   └── session-store.ts         # Session management
└── data/                        # Legacy YAML (reference only)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API key
- Telegram Bot Token & Chat ID

### Installation

```bash
# Clone repository
git clone https://github.com/ilyshaxa/shaxa.dev.git
cd shaxa.dev

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for notifications | Yes | - |
| `TELEGRAM_CHAT_ID` | Telegram chat ID for notifications | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Yes | - |
| `KEYS_PAGE_PASSWORD` | Password for SSH keys page | No | - |
| `SSH_KEYS` | SSH keys in JSON format | No | - |
| `PRIMARY_DOMAIN` | Primary domain for canonical URLs | No | `https://shaxa.dev` |

### SSH Keys Format

```bash
# JSON Array (Recommended)
SSH_KEYS='[{"name":"Server Key","type":"private","key":"-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"}]'

# Or numbered keys
SSH_KEY_1="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
SSH_KEY_2="ssh-rsa AAAAB3..."
```

## 📝 Customization

### Profile & Projects Data

Edit `src/lib/data.ts` to update:
- **profileData**: Personal info, skills, experience, education, certifications
- **projectsData**: Featured and all projects

### Adding a Project

```typescript
{
  title: "Project Name",
  shortDescription: "Brief description",
  fullDescription: "Detailed description",
  technologies: ["Tech1", "Tech2"],
  coverImage: "/projects/image-dark.svg",
  coverImageLight: "/projects/image-light.svg",
  featured: true,
  status: "Completed",
  year: "2025",
  companyName: "Company Name",
  slug: "project-slug"
}
```

### AI Chatbot

Customize the chatbot's knowledge by editing `SYSTEM_PROMPT` in `src/app/api/chat/route.ts`.

### Styling

Custom classes in `src/app/globals.css`:
- `.glass` / `.glass-dark` - Glassmorphism effects
- `.text-gradient` - Gradient text
- `.animate-float` - Floating animation

## 🌐 Multi-Domain SEO

- **Canonical URLs**: All pages point to primary domain (`shaxa.dev`)
- **Sitemap**: Always uses primary domain URLs regardless of access domain
- **Robots.txt**: Blocks `/keys` and `/api/` from indexing
- **Structured Data**: Schema.org JSON-LD (Person, WebSite, CreativeWork)

## 🔐 Security

- HTTP-only cookies for session management
- Secure cookies in production (HTTPS only)
- Rate limiting prevents brute force attacks
- 64-character random hex session tokens
- Login attempt monitoring via Telegram
- Input validation and sanitization

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add environment variables in dashboard
3. Configure domains: `shaxa.dev` and `shaxriyor.com`
4. Deploy automatically on push

The `vercel.json` includes:
- Edge runtime for chat API
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)

## 📞 Contact

- **Email**: shaxriyor@shaxa.dev
- **Website**: [shaxa.dev](https://shaxa.dev)
- **GitHub**: [@ilyshaxa](https://github.com/ilyshaxa)
- **LinkedIn**: [Shaxriyor Jabborov](https://linkedin.com/in/shaxriyor)
- **Telegram**: [@shaxadev](https://t.me/shaxadev)

## 📄 License

[MIT License](LICENSE)

---

**Built with ❤️ by [Shaxriyor Jabborov](https://shaxa.dev)** 💻
