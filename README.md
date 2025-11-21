# shaxa.dev / shaxriyor.com - Personal Portfolio Website

A modern, responsive personal portfolio website built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion. Features a browser theme preference design with glassmorphism effects, smooth animations, an integrated AI chatbot with Telegram notifications, and a secure SSH keys management system.

## 🚀 Features

### Core Features
- **Modern Design**: Browser theme preference with glassmorphism effects and smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Multi-Domain Support**: Supports both `shaxa.dev` and `shaxriyor.com` with dynamic SEO
- **AI Chatbot**: Integrated "Ask Shaxriyor" chatbot powered by OpenAI GPT-3.5-turbo API with Telegram notifications
- **Performance**: Built with Next.js 15.5.4 and optimized for speed
- **SEO Optimized**: Dynamic sitemap, robots.txt, structured data (Schema.org), and multi-domain canonical URLs
- **Accessibility**: Built with accessibility best practices and ARIA labels
- **TypeScript**: Full type safety throughout the application
- **Component Library**: Built with shadcn/ui components and Radix UI primitives

### Advanced Features
- **SSH Keys Management**: Password-protected page (`/keys`) for accessing SSH keys from anywhere
  - Rate limiting (5 attempts per 15 minutes)
  - Login attempt tracking with Telegram notifications
  - Secure session tokens with HTTP-only cookies
  - Support for private and public keys
- **Interactive Project Images**: Zoom, pan, and fullscreen support for project diagrams
- **Video Support**: Video project demos with custom controls
- **Theme Switching**: Light/dark mode with system preference detection
- **Telegram Integration**: Real-time notifications for:
  - Chatbot interactions (with user IP tracking)
  - Contact form submissions
  - SSH keys page login attempts (successful and failed)
- **Clickable Links**: Automatic link parsing and clickable URLs in chatbot responses
- **Dynamic Sitemap**: Automatically generated sitemap including all pages
- **Structured Data**: Comprehensive Schema.org JSON-LD for better search engine understanding

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12.23.22
- **Icons**: Lucide React 0.544.0
- **Notifications**: Sonner 2.0.7 (toast notifications)
- **Theme**: next-themes 0.4.6

### Backend & APIs
- **AI**: OpenAI GPT-3.5-turbo API
- **Notifications**: Telegram Bot API
- **Runtime**: Node.js 18+ (Edge runtime for chat API)

### Data & Configuration
- **Data Storage**: TypeScript static data (migrated from YAML)
- **Environment**: Vercel (with multi-domain support)

### Development Tools
- **Build Tool**: Turbopack (Next.js)
- **Linting**: ESLint 9 with Next.js config
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── check/           # Session validation
│   │   │   ├── login/           # Password authentication with rate limiting
│   │   │   └── logout/          # Session termination
│   │   ├── chat/                # AI chatbot API with Telegram notifications
│   │   ├── contact/             # Contact form API with Telegram notifications
│   │   ├── deployment/          # Deployment info API
│   │   └── keys/                # SSH keys API (protected)
│   ├── about/                   # About page
│   │   ├── [slug]/              # Experience detail pages
│   │   └── page.tsx              # Main about page
│   ├── contact/                 # Contact page
│   ├── keys/                    # SSH keys management page (password protected)
│   ├── projects/               # Projects pages
│   │   ├── [slug]/              # Individual project pages
│   │   └── page.tsx             # Projects listing page
│   ├── globals.css              # Global styles and Tailwind config
│   ├── layout.tsx               # Root layout with dynamic metadata
│   ├── page.tsx                 # Home page
│   ├── robots.ts                # Dynamic robots.txt generator
│   └── sitemap.ts               # Dynamic sitemap generator
├── components/                  # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── sonner.tsx           # Toast notifications
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   ├── animated-gradient.tsx
│   ├── chatbot.tsx             # AI chatbot component
│   ├── client-only.tsx
│   ├── dynamic-gradient-background.tsx
│   ├── floating-elements.tsx
│   ├── footer.tsx
│   ├── geometric-animated-background.tsx
│   ├── icons/
│   │   └── telegram-icon.tsx
│   ├── last-updated.tsx
│   ├── matrix-animated-background.tsx
│   ├── modern-animated-background.tsx
│   ├── navigation.tsx
│   ├── page-transition.tsx
│   ├── parallax-section.tsx
│   ├── particle-background.tsx
│   ├── project-card.tsx
│   ├── scroll-reveal.tsx
│   ├── scroll-to-top.tsx
│   ├── skill-badge.tsx
│   ├── structured-data.tsx      # Schema.org JSON-LD
│   └── theme-provider.tsx
├── lib/                         # Utility functions
│   ├── data.ts                  # Profile and projects data
│   ├── link-parser.tsx          # Link parsing for chatbot
│   ├── seo.ts                   # SEO utilities (domain detection)
│   ├── session-store.ts         # Session management for SSH keys
│   └── utils.ts                 # General utilities
└── data/                        # Data files (legacy YAML, now using TypeScript)
    ├── profile.yaml             # Profile information (reference)
    └── projects.yaml            # Projects data (reference)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for chatbot functionality)
- Telegram Bot Token (for notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ilyshaxa/shaxa.dev.git
   cd shaxa.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```bash
   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   TELEGRAM_CHAT_ID=your_telegram_chat_id_here
   
   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # SSH Keys Page (Optional)
   KEYS_PAGE_PASSWORD=your_secure_password_here
   SSH_KEYS='[{"name":"Key Name","type":"private","key":"-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"}]'
   
   # SEO Configuration (Optional)
   PRIMARY_DOMAIN=https://shaxa.dev  # Default: https://shaxa.dev
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Customization

### Updating Profile Information

Edit the data in `src/lib/data.ts`:
- `profileData` - Personal information, skills, experience, certifications, education
- `projectsData` - Project portfolio data (featured and all projects)

### Adding New Projects

Add projects to `projectsData.featured` or `projectsData.all` in `src/lib/data.ts`:

```typescript
{
  title: "Project Name",
  shortDescription: "Brief description",
  fullDescription: "Detailed description",
  technologies: ["Tech1", "Tech2"],
  coverImage: "/projects/image-dark.svg",
  coverImageLight: "/projects/image-light.svg",
  expandedImage: "/projects/image-dark.svg",
  expandedImageLight: "/projects/image-light.svg",
  liveUrl: "https://example.com",
  githubUrl: "https://github.com/user/repo",
  featured: true,
  status: "Completed",
  year: "2025",
  companyName: "Company Name",
  slug: "project-slug"
}
```

### Styling

The design uses Tailwind CSS 4 with custom glassmorphism classes defined in `src/app/globals.css`. Key custom classes:

- `.glass` - Light glassmorphism effect
- `.glass-dark` - Dark glassmorphism effect
- `.text-gradient` - Gradient text effect
- `.animate-float` - Floating animation

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Update navigation in `src/components/navigation.tsx` (if needed)

## 🤖 AI Chatbot

The integrated chatbot uses OpenAI's GPT-3.5-turbo API to answer questions about Shaxriyor's work and experience with real-time Telegram notifications.

### Features

- **Auto-focus**: Input field automatically focuses after responses
- **Clickable Links**: Automatic link parsing and clickable URLs
- **Telegram Notifications**: Real-time notifications with user IP tracking
- **Fallback Responses**: Works even when OpenAI API is unavailable
- **Smart Responses**: Only provides information from training data
- **Scope Restriction**: Only answers questions about Shaxriyor's work and experience

### Setup

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a Telegram bot via [@BotFather](https://t.me/BotFather)
3. Get your Telegram Chat ID
4. Add all keys to your `.env.local` file

### Customization

Edit the `SYSTEM_PROMPT` in `src/app/api/chat/route.ts` to customize the chatbot's knowledge and responses.

## 🔐 SSH Keys Management

A secure, password-protected page for accessing SSH keys from anywhere.

### Features

- **Password Authentication**: Secure login with HTTP-only cookies
- **Rate Limiting**: 5 attempts per 15 minutes per IP address
- **Login Tracking**: All login attempts logged with Telegram notifications
- **Secure Sessions**: Random 64-character session tokens (not predictable)
- **Multiple Key Support**: JSON format with custom names and types
- **Private/Public Key Types**: Visual badges to distinguish key types
- **Copy Functionality**: One-click copy for individual or all keys
- **Persistent State**: Rate limit state persists across page refreshes

### Setup

1. Set `KEYS_PAGE_PASSWORD` in environment variables
2. Add SSH keys in JSON format to `SSH_KEYS` environment variable:
   ```json
   [
     {
       "name": "Server Key",
       "type": "private",
       "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
     }
   ]
   ```
3. Access at `/keys` route (hidden from sitemap)

### Security Features

- HTTP-only cookies (not accessible via JavaScript)
- Secure cookies in production (HTTPS only)
- Rate limiting prevents brute force attacks
- Login attempt monitoring via Telegram
- Secure session tokens (64-char hex)
- 7-day session expiration

## 📧 Contact Form

The contact form includes:

- **Form Validation**: Client and server-side validation
- **Telegram Notifications**: Real-time notifications with user details
- **Responsive Design**: Works on all devices
- **Success/Error Handling**: Clear feedback to users
- **Message Length Limits**: Prevents abuse

## 🌐 Multi-Domain SEO

The portfolio supports multiple domains with proper SEO configuration:

- **Primary Domain**: `shaxa.dev` (default canonical)
- **Secondary Domain**: `shaxriyor.com`
- **Dynamic Sitemap**: Automatically generated with URLs matching the current domain
  - Accessing `https://shaxriyor.com/sitemap.xml` returns sitemap with `shaxriyor.com` URLs
  - Accessing `https://shaxa.dev/sitemap.xml` returns sitemap with `shaxa.dev` URLs
- **Dynamic Robots.txt**: Automatically generated with sitemap reference matching current domain
  - Accessing `https://shaxriyor.com/robots.txt` references `https://shaxriyor.com/sitemap.xml`
  - Accessing `https://shaxa.dev/robots.txt` references `https://shaxa.dev/sitemap.xml`
- **Canonical URLs**: All pages point to primary domain (prevents duplicate content)
- **Structured Data**: Schema.org JSON-LD with correct domain URLs
- **Open Graph Tags**: Dynamic based on current domain

### Configuration

Set `PRIMARY_DOMAIN` environment variable to change the canonical domain:
```bash
PRIMARY_DOMAIN=https://shaxriyor.com  # Optional, defaults to https://shaxa.dev
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard (see Configuration section)
   - Configure domains: Add both `shaxa.dev` and `shaxriyor.com`
   - Deploy automatically

3. **Configure DNS**
   - Point both domains to Vercel
   - SSL certificates are automatically provisioned

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

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

SSH keys can be provided in three formats:

**Option 1: JSON Array (Recommended)**
```bash
SSH_KEYS='[{"name":"Server Key","type":"private","key":"-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"}]'
```

**Option 2: Numbered Keys**
```bash
SSH_KEY_1="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
SSH_KEY_2="ssh-rsa AAAAB3..."
```

**Option 3: Single Key**
```bash
SSH_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
```

### Vercel Configuration

The `vercel.json` file includes:
- Edge runtime for the chat API
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Performance optimizations

## 📱 Features Overview

### Home Page
- Hero section with animated introduction and typewriter effect
- Skills showcase with categorized badges (Cloud, Containers, Infrastructure, CI/CD, Monitoring, Tools)
- Featured projects grid with hover effects
- Experience timeline with company logos
- Call-to-action section
- Scroll-to-top button
- Parallax effects and animated backgrounds

### Projects Page
- Complete project portfolio with featured and all projects
- Interactive project cards with hover animations
- Technology tags with color coding
- Project status indicators (Completed, In Progress)
- Company name links to experience pages
- Year and featured badges

### Individual Project Pages
- Interactive image viewer with zoom, pan, and fullscreen
- Video support with custom playback controls
- Technology badges
- Project description and details
- Live demo and GitHub links
- Theme-aware images (light/dark variants)
- Responsive layout optimized for both images and videos

### About Page
- Detailed biography and professional summary
- Education section with institution logos
- Certifications with logos and status
- Skills breakdown by category
- Experience timeline with:
  - Company logos
  - Employment type badges
  - Responsibilities and achievements
  - Technology stacks
  - Team size and industry
- Clickable experience cards linking to detail pages

### Experience Detail Pages
- Comprehensive experience information
- Responsibilities and achievements
- Technology stack used
- Company information and links
- Employment duration and type

### Contact Page
- Contact form with validation
- Social media links (GitHub, LinkedIn, Twitter, Instagram, Telegram)
- Response time information
- Multiple contact methods
- Email and phone display

### SSH Keys Page (`/keys`)
- Password-protected access
- Rate limiting with visual feedback
- Login attempt tracking
- Support for multiple SSH keys
- Private/public key type indicators
- One-click copy functionality
- Real-time countdown for rate limits

### AI Chatbot
- Real-time conversation with auto-focus
- Knowledge about Shaxriyor's work, experience, skills, and projects
- Mobile-friendly interface
- Clickable links in responses
- Telegram notifications for all interactions
- Fallback responses when API unavailable
- Scope restriction (only answers about Shaxriyor)

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Background**: Adaptive gradient (follows system theme)
- **Glass**: Semi-transparent with backdrop blur
- **Text**: High contrast for accessibility
- **Theme**: Follows browser/system preference (light/dark) with manual override

### Typography
- **Font**: Geist Sans (primary), Geist Mono (code)
- **Responsive sizing**: Tailwind utilities with proper scaling
- **Heading hierarchy**: Semantic HTML structure

### Animations
- **Framer Motion**: Smooth transitions and page animations
- **Staggered animations**: Lists animate in sequence
- **Hover effects**: Micro-interactions on interactive elements
- **Scroll-triggered**: Animations activate on scroll
- **Background effects**: Particle backgrounds and floating elements
- **Page transitions**: Smooth transitions between pages

### Components
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Gradient text**: Animated gradient text effects
- **Badges**: Color-coded technology and status badges
- **Cards**: Interactive cards with hover effects
- **Toasts**: Bottom-left positioned notifications

## 🔒 Security

### Authentication & Authorization
- Password-protected SSH keys page
- HTTP-only cookies for session management
- Secure cookies in production (HTTPS only)
- Rate limiting (5 attempts per 15 minutes)
- Secure session tokens (64-character random hex)
- Login attempt tracking and notifications

### API Security
- Input validation and sanitization
- CSRF protection (SameSite cookies)
- XSS protection headers
- Content Security Policy ready
- IP address tracking for security monitoring

### Data Protection
- Environment variables for sensitive data
- No hardcoded credentials
- Secure password storage (environment variables)
- SSH keys encrypted in environment variables

## 📈 Performance

- **Next.js 15.5.4**: Latest App Router with optimizations
- **Turbopack**: Fast development and build times
- **Edge Runtime**: Chat API uses edge runtime for low latency
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic code splitting and lazy loading
- **Static Generation**: Pre-rendered pages where possible
- **Dynamic Routes**: Server-rendered for dynamic content
- **Minimal Bundle**: Optimized bundle sizes
- **Vercel Analytics**: Built-in analytics and speed insights

## 🔍 SEO Features

- **Dynamic Sitemap**: Automatically generated sitemap (`/sitemap.xml`)
  - URLs in the sitemap match the domain being accessed
  - Each domain has its own sitemap with domain-specific URLs
  - Includes all pages, projects, and experience routes
- **Dynamic Robots.txt**: Automatically generated robots.txt (`/robots.txt`)
  - Sitemap reference matches the current domain
  - Blocks `/keys` and `/api/` routes from indexing
- **Structured Data**: Comprehensive Schema.org JSON-LD:
  - Person schema
  - ProfessionalService schema
  - WebSite schema
  - BreadcrumbList schema
  - CreativeWork schemas for projects
- **Meta Tags**: Comprehensive Open Graph and Twitter Card tags
- **Canonical URLs**: Proper canonical URL handling for multi-domain
  - All pages use primary domain (`shaxa.dev`) as canonical to prevent duplicate content
- **Multi-Domain Support**: Works with both shaxa.dev and shaxriyor.com
  - Each domain can be indexed independently
  - Sitemap and robots.txt adapt to the current domain
- **Mobile-Friendly**: Responsive design for mobile search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Unstyled UI primitives
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon library
- [OpenAI](https://openai.com/) - AI API
- [Telegram Bot API](https://core.telegram.org/bots/api) - Notifications
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support & Contact

If you have any questions or need help:

- **Email**: shaxriyor@shaxa.dev
- **Website**: [shaxa.dev](https://shaxa.dev) / [shaxriyor.com](https://shaxriyor.com)
- **GitHub**: [@ilyshaxa](https://github.com/ilyshaxa)
- **LinkedIn**: [Shaxriyor Jabborov](https://linkedin.com/in/shaxriyor)
- **Telegram**: [@ilyshaxa](https://t.me/ilyshaxa)
- **Twitter/X**: [@ilyshaxa](https://x.com/ilyshaxa)

---

**Built with ❤️ by [Shaxriyor Jabborov](https://shaxa.dev)** 💻✨
