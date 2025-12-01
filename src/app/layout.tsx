import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ParticleBackground } from "@/components/particle-background";
import { FloatingElements } from "@/components/floating-elements";
import { PageTransition } from "@/components/page-transition";
import { Chatbot } from "@/components/chatbot";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getProfile } from "@/lib/data";
import { StructuredData } from "@/components/structured-data";
import { getBaseUrl, getPrimaryDomain } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const profile = getProfile();
const primaryDomain = getPrimaryDomain();

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();
  const siteName = baseUrl.includes('shaxriyor.com') ? 'shaxriyor.com' : 'shaxa.dev';
  
  return {
    title: `${profile.name} - ${profile.title}`,
    description: profile.shortBio,
    keywords: [
      "Shaxriyor Jabborov",
      "Shaxriyor DevOps",
      "Shaxriyor DevOps",
      "Shaxriyor Devops",
      "Shaxriyor Devops",
      "DevOps Engineer",
      "Cloud Engineer",
      "Infrastructure Engineer",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "Terraform",
      "CI/CD",
      "Jenkins",
      "GitLab",
      "Ansible",
      "Linux",
      "Monitoring",
      "DevOps",
      "Cloud Infrastructure",
      "Automation",
      "Portfolio"
    ],
    authors: [{ name: profile.name, url: primaryDomain }],
    creator: profile.name,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: primaryDomain,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: `${profile.name} - ${profile.title}`,
      description: profile.shortBio,
      siteName: siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} - ${profile.title}`,
      description: profile.shortBio,
      creator: "@shaxa_dev",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const canonicalUrl = getPrimaryDomain();
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Favicon and Icons - Google Search requires multiples of 48x48 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/android-chrome-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0b0b" />
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider>
          <div className="min-h-screen relative overflow-hidden bg-background">
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-10" />
            <div className="fixed inset-0 pointer-events-none">
              <ParticleBackground />
              <FloatingElements />
            </div>
            
            <Navigation />
            <main className="relative z-10 pt-16">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTop />
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <StructuredData />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
