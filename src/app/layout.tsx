import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ParticleBackground } from "@/components/particle-background";
import { FloatingElements } from "@/components/floating-elements";
import { PageTransition } from "@/components/page-transition";
import { getProfile } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const profile = getProfile();

export const metadata: Metadata = {
  title: `${profile.name} - ${profile.title}`,
  description: profile.shortBio,
  keywords: [
    "Shaxriyor Jabborov",
    "Full-Stack Developer",
    "Software Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "Web Development",
    "Portfolio"
  ],
  authors: [{ name: profile.name, url: profile.website }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: profile.website,
    title: `${profile.name} - ${profile.title}`,
    description: profile.shortBio,
    siteName: "shaxa.dev",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={profile.website} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3c72" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="shaxa-theme"
        >
          <div className="min-h-screen relative overflow-hidden">
            {/* Global Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-colors duration-300" />
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
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
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
