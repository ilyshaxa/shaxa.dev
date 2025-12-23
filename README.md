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
- **SSH Keys Management**: Multi-factor authenticated page (`/keys`) for accessing SSH keys
  - **Two-Factor Authentication (TOTP)**: Google Authenticator, Authy, or any TOTP app
  - **Simple Recovery**: Remove TOTP_SECRET to reset MFA (no backup codes needed)
  - Rate limiting (5 attempts per 15 minutes)
  - Login tracking with Telegram notifications
  - 7-day secure sessions with HTTP-only cookies
- **Interactive Projects**: Zoom, pan, fullscreen for images; video support with custom controls
- **Contact Form**: Server-side validation with Telegram notifications
- **SEO**: Dynamic sitemap, robots.txt, Schema.org structured data, canonical URLs

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15.5.7 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19.1.0, Tailwind CSS 4, shadcn/ui (Radix UI) |
| **Animations** | Framer Motion 12 |
| **AI** | OpenAI GPT-3.5-turbo |
| **Authentication** | Speakeasy (TOTP), QRCode (2FA setup) |
| **Notifications** | Telegram Bot API, Sonner (toasts) |
| **Theme** | next-themes |
| **Deployment** | Vercel (Edge runtime for chat API) |

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── check/           # Session validation
│   │   │   ├── login/           # Password + MFA login
│   │   │   ├── logout/          # Session termination
│   │   │   ├── mfa-status/      # Check if MFA is enabled
│   │   │   └── setup-mfa/       # Generate QR code & verify TOTP
│   │   ├── chat/                # AI chatbot (Edge runtime)
│   │   ├── contact/             # Contact form
│   │   ├── deployment/          # Deployment webhook
│   │   └── keys/                # SSH keys retrieval (MFA protected)
│   ├── about/                   # About & experience detail pages
│   ├── contact/                 # Contact page
│   ├── keys/                    # SSH keys management
│   │   ├── page.tsx             # Login page (MFA required)
│   │   └── setup-mfa/           # MFA setup wizard with QR code
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
│   └── session-store.ts         # In-memory session management
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
| `KEYS_PAGE_PASSWORD` | Password for SSH keys page | Yes* | - |
| `TOTP_SECRET` | TOTP secret for MFA (base32) | Yes* | - |
| `SSH_KEYS` | SSH keys in JSON format | No | - |
| `PRIMARY_DOMAIN` | Primary domain for canonical URLs | No | `https://shaxa.dev` |

\* Required only if using the `/keys` page

### SSH Keys Format

```bash
# JSON Array (Recommended)
SSH_KEYS='[{"name":"Server Key","type":"private","key":"-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"}]'

# Or numbered keys
SSH_KEY_1="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
SSH_KEY_2="ssh-rsa AAAAB3..."
```

### Setting Up Multi-Factor Authentication (MFA)

The `/keys` page uses **TOTP-based two-factor authentication** for maximum security. Both password and MFA code are required and validated together.

#### Why MFA?

✅ **Protection against password leaks** - Even if password is compromised, attacker needs your phone  
✅ **No information leakage** - System doesn't reveal which credential (password or MFA) is incorrect  
✅ **Industry standard** - Same technology used by Google, GitHub, AWS  
✅ **Simple recovery** - Just remove TOTP_SECRET to reset (no backup codes to manage)  

#### Initial Setup (One-time)

1. **Set your password** in environment variables:
   ```bash
   KEYS_PAGE_PASSWORD="your-secure-password-here"
   ```

2. **Deploy with password** and navigate to `/keys/setup-mfa`

3. **Generate your MFA credentials**:
   - Enter your password
   - Click "Generate QR Code"
   - A unique TOTP secret will be generated

4. **Add to authenticator app**:
   - **Scan QR code** with your phone (recommended)
   - Or **manually enter** the secret key shown
   - Supported apps: Google Authenticator, Authy, Microsoft Authenticator, 1Password, Bitwarden

5. **Verify it works**:
   - Enter the 6-digit code from your app
   - If correct, you'll see your `TOTP_SECRET`

6. **Save to environment variables**:
   ```bash
   TOTP_SECRET="JBSWY3DPEHPK3PXP"
   ```
   
   ⚠️ **Important**: Copy this immediately! It won't be shown again.

7. **Redeploy** with the new environment variable

#### Daily Usage

**Login Flow:**
1. Navigate to `/keys`
2. **Both fields shown immediately** (if MFA is enabled)
3. Enter your password
4. Enter current 6-digit code from authenticator app
5. Click Login (button disabled until both fields filled)
6. System validates both credentials together
7. Access granted! ✅

**Lost Your Device?**
- Remove `TOTP_SECRET` from environment variables
- Redeploy your application
- Visit `/keys/setup-mfa` again to generate new credentials
- No backup codes to manage or track!

#### Security Features

🔒 **Simultaneous Validation**
- Password and MFA validated together
- Generic "Invalid credentials" error (no hints about which failed)
- Prevents credential enumeration attacks

🔒 **Time-Based Codes**
- TOTP codes change every 30 seconds
- ±60 second tolerance window (allows for clock drift)
- Codes are impossible to guess or brute force

🔒 **Rate Limiting**
- Maximum 5 login attempts per 15 minutes
- Applies to all attempts (not separate for password/MFA)
- Rate limit persists via cookies even if page refreshed

🔒 **Monitoring & Alerts**
- All login attempts sent to Telegram (success and failure)
- Failed attempts include IP address and timestamp
- Real-time security monitoring

🔒 **Session Security**
- 64-character random hex tokens
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- 7-day expiration with automatic cleanup

#### Troubleshooting

**"Authentication code required" error:**
- Make sure TOTP_SECRET is set in environment variables
- Restart your application after adding the variable

**Code not working:**
- Check your device's clock is accurate (TOTP is time-based)
- Wait for next code (30-second cycle)
- If still failing, consider resetting MFA (see below)

**Lost authenticator app:**
- Remove `TOTP_SECRET` from environment variables
- Redeploy your application  
- Visit `/keys/setup-mfa` to generate new MFA
- Scan new QR code with your authenticator app

**MFA Setup Already Done:**
- Cannot setup again while TOTP_SECRET exists
- To reset: remove TOTP_SECRET from environment, redeploy, setup again

#### Optional: Password-Only Mode

If you prefer password-only authentication (not recommended for production):
- Simply don't set `TOTP_SECRET` and `BACKUP_CODES`
- System will automatically use password-only mode
- MFA fields won't be shown on login page

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

### Multi-Factor Authentication (MFA)
- **TOTP-based 2FA**: Industry-standard time-based one-time passwords
- **Simultaneous validation**: Password and MFA code validated together (no progressive disclosure)
- **Simple recovery**: Remove TOTP_SECRET to reset (no backup codes to manage)
- **No information leakage**: Generic error messages prevent credential enumeration
- **30-second rotation**: TOTP codes expire quickly with ±60s tolerance window

### Session Management
- **64-character random hex tokens**: Cryptographically secure session IDs
- **HTTP-only cookies**: Not accessible via JavaScript (XSS protection)
- **Secure flag in production**: HTTPS-only transmission
- **7-day expiration**: Automatic session cleanup
- **In-memory store**: Sessions stored server-side with automatic TTL cleanup

### Rate Limiting
- **5 attempts per 15 minutes**: Per IP address
- **Persistent via cookies**: Rate limit survives page refresh
- **Applies to all attempts**: Password and MFA counted together
- **Automatic IP tracking**: X-Forwarded-For and X-Real-IP support

### Monitoring & Alerts
- **Real-time Telegram notifications**: All login attempts (success and failure)
- **IP address tracking**: Know who's accessing your keys
- **Timestamp logging**: Audit trail of all authentication events
- **Failed attempt details**: Wrong passwords sent to Telegram for analysis

### Input Security
- **Server-side validation**: All inputs validated on backend
- **Type safety**: Full TypeScript type checking
- **Sanitization**: XSS and injection prevention
- **CORS protection**: API routes restricted to same-origin

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository** to Vercel

2. **Add environment variables** in Vercel dashboard:
   ```
   Required:
   - TELEGRAM_BOT_TOKEN
   - TELEGRAM_CHAT_ID
   - OPENAI_API_KEY
   
   Optional (for /keys page):
   - KEYS_PAGE_PASSWORD
   - TOTP_SECRET (generate via /keys/setup-mfa)
   - SSH_KEYS or SSH_KEY_1, SSH_KEY_2, etc.
   ```

3. **Configure domains**: `shaxa.dev` and `shaxriyor.com`

4. **Deploy automatically** on push to main branch

5. **Setup MFA** (if using /keys page):
   - First deploy with only `KEYS_PAGE_PASSWORD` set
   - Visit `yourdomain.com/keys/setup-mfa`
   - Follow setup wizard to generate `TOTP_SECRET`
   - Add this to Vercel environment variables
   - Redeploy

### Configuration Files

**`vercel.json`** includes:
- Edge runtime for chat API (faster response times)
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Route configuration for API endpoints

### Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`
- **Node Version**: 18.x or higher

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
