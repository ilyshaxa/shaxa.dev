# Shaxriyor.dev - Personal Portfolio Website

A modern, responsive personal portfolio website built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion. Features a dark-mode first design with glassmorphism effects, smooth animations, and an integrated AI chatbot with Telegram notifications.

## 🚀 Features

- **Modern Design**: Dark-mode first with glassmorphism effects and smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **AI Chatbot**: Integrated "Ask Shaxriyor" chatbot powered by OpenAI API with Telegram notifications
- **Performance**: Built with Next.js 15 and optimized for speed
- **SEO Ready**: Comprehensive SEO optimization and meta tags
- **Accessibility**: Built with accessibility best practices
- **TypeScript**: Full type safety throughout the application
- **Component Library**: Built with shadcn/ui components
- **Telegram Integration**: Real-time notifications for chatbot interactions and contact form submissions
- **Clickable Links**: Automatic link parsing and clickable URLs in chatbot responses

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data**: YAML files for easy content management
- **AI**: OpenAI GPT API
- **Notifications**: Telegram Bot API
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # AI chatbot API with Telegram notifications
│   │   └── contact/       # Contact form API with Telegram notifications
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── chatbot.tsx       # AI chatbot component with auto-focus
│   ├── navigation.tsx    # Navigation component
│   ├── project-card.tsx  # Project card component
│   ├── skill-badge.tsx   # Skill badge component
│   ├── link-parser.tsx   # Link parsing utility
│   ├── animated-gradient.tsx
│   ├── floating-elements.tsx
│   ├── particle-background.tsx
│   ├── scroll-reveal.tsx
│   ├── typewriter-effect.tsx
│   └── theme-provider.tsx
├── data/                 # Content data
│   ├── profile.yaml      # Profile information
│   └── projects.yaml     # Projects data
└── lib/                  # Utility functions
    ├── data.ts           # Data loading functions
    ├── link-parser.tsx   # Link parsing for chatbot
    └── utils.ts          # Utility functions
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
   
   Edit `.env.local` and add your API keys:
   ```
   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   TELEGRAM_CHAT_ID=your_telegram_chat_id_here
   
   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here
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

Edit the YAML files in `src/data/`:

- `profile.yaml` - Personal information, skills, experience, certifications
- `projects.yaml` - Project portfolio data

### Styling

The design uses Tailwind CSS with custom glassmorphism classes defined in `src/app/globals.css`. Key custom classes:

- `.glass` - Light glassmorphism effect
- `.glass-dark` - Dark glassmorphism effect
- `.text-gradient` - Gradient text effect
- `.animate-float` - Floating animation

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Update navigation in `src/components/navigation.tsx`

## 🤖 AI Chatbot

The integrated chatbot uses OpenAI's GPT API to answer questions about Shaxriyor's work and experience with real-time Telegram notifications.

### Features

- **Auto-focus**: Input field automatically focuses after responses
- **Clickable Links**: Automatic link parsing and clickable URLs
- **Telegram Notifications**: Real-time notifications with user IP tracking
- **Fallback Responses**: Works even when OpenAI API is unavailable
- **Smart Responses**: Only provides information from training data

### Setup

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a Telegram bot via [@BotFather](https://t.me/BotFather)
3. Get your Telegram Chat ID
4. Add all keys to your `.env.local` file

### Customization

Edit the `SYSTEM_PROMPT` in `src/app/api/chat/route.ts` to customize the chatbot's knowledge and responses.

## 📧 Contact Form

The contact form includes:

- **Form Validation**: Client and server-side validation
- **Telegram Notifications**: Real-time notifications with user details
- **Responsive Design**: Works on all devices
- **Success/Error Handling**: Clear feedback to users

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
   - Add environment variables in Vercel dashboard:
     - `TELEGRAM_BOT_TOKEN`
     - `TELEGRAM_CHAT_ID`
     - `OPENAI_API_KEY`
   - Deploy automatically

3. **Configure Domain**
   - Point your domain to Vercel
   - Update environment variables as needed

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for notifications | Yes |
| `TELEGRAM_CHAT_ID` | Telegram chat ID for notifications | Yes |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Yes |

### Vercel Configuration

The `vercel.json` file includes:
- Edge runtime for the chat API
- Security headers
- Performance optimizations

## 📱 Features Overview

### Home Page
- Hero section with animated introduction
- Skills showcase with categorized badges
- Featured projects grid
- Experience timeline
- Call-to-action section

### Projects Page
- Complete project portfolio
- Featured and all projects sections
- Live demo and GitHub links
- Technology tags
- Project status indicators

### About Page
- Detailed biography
- Education and certifications
- Skills breakdown
- Experience timeline
- Personal interests

### Contact Page
- Contact form with validation
- Social media links
- Response time information
- Multiple contact methods

### AI Chatbot
- Real-time conversation with auto-focus
- Knowledge about Shaxriyor's work and experience
- Mobile-friendly interface
- Clickable links in responses
- Telegram notifications for all interactions
- Fallback responses when API unavailable

## 🎨 Design System

### Colors
- Primary: Blue gradient (#667eea to #764ba2)
- Background: Dark gradient (slate-900 to purple-900)
- Glass: Semi-transparent with backdrop blur
- Text: High contrast for accessibility

### Typography
- Font: Geist Sans (primary), Geist Mono (code)
- Responsive sizing with Tailwind utilities
- Proper heading hierarchy

### Animations
- Framer Motion for smooth transitions
- Staggered animations for lists
- Hover effects and micro-interactions
- Scroll-triggered animations
- Particle backgrounds and floating elements

## 🔒 Security

- Content Security Policy headers
- XSS protection
- CSRF protection
- Secure API endpoints
- Input validation and sanitization
- IP address tracking for notifications

## 📈 Performance

- Next.js 15 with App Router
- Edge runtime for API routes
- Optimized images and assets
- Lazy loading and code splitting
- Minimal bundle size
- Vercel Analytics and Speed Insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon library
- [OpenAI](https://openai.com/) - AI API
- [Telegram Bot API](https://core.telegram.org/bots/api) - Notifications

## 📞 Support

If you have any questions or need help:

- Email: shaxriyor@shaxa.dev
- GitHub: [@ilyshaxa](https://github.com/ilyshaxa)
- LinkedIn: [Shaxriyor Jabborov](https://linkedin.com/in/shaxriyor)
- Telegram: [@ilyshaxa](https://t.me/ilyshaxa)

---

Vibecoded by [Shaxriyor Jabborov](https://shaxa.dev) 💻✨