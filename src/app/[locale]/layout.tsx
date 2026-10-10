import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../../i18n';
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";
import { PageTransition } from "@/components/page-transition";
import dynamic from 'next/dynamic';
import { ScrollToTop } from "@/components/scroll-to-top";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getProfile } from "@/lib/data";
import { StructuredData } from "@/components/structured-data";
import { getBaseUrl, getPrimaryDomain } from "@/lib/seo";
import { ErrorBoundary } from "@/components/error-boundary";
import { fontVariables } from "@/lib/fonts";
import { themeScript } from "@/lib/theme-script";
import "../globals.css";

// Lazy load Chatbot component
const Chatbot = dynamic(() => import('@/components/chatbot').then(mod => ({ default: mod.Chatbot })), {
  loading: () => null,
});

const profile = getProfile();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  const baseUrl = await getBaseUrl();
  const siteName = baseUrl.includes('shaxriyor.com') ? 'shaxriyor.com' : 'shaxa.dev';
  
  const localeMap: Record<string, string> = {
    en: 'en_US',
    uz: 'uz_UZ',
    ru: 'ru_RU'
  };
  
  return {
    title: t('title', { name: profile.name, title: profile.title }),
    description: t('description'),
    keywords: [
      "Shaxriyor Jabborov",
      "DevOps engineer",
      "Cloud engineer",
      "Tashkent",
      "AWS",
      "GCP",
      "Docker",
      "Jenkins",
      "GitLab CI",
      "Prometheus",
      "Grafana",
      "Linux",
      "CI/CD",
      "Observability",
      "Portfolio"
    ],
    authors: [{ name: profile.name, url: getPrimaryDomain() }],
    creator: profile.name,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'uz': `${baseUrl}/uz`,
        'ru': `${baseUrl}/ru`,
      },
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale] || 'en_US',
      url: `${baseUrl}/${locale}`,
      title: t('title', { name: profile.name, title: profile.title }),
      description: t('description'),
      siteName: siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: t('title', { name: profile.name, title: profile.title }),
      description: t('description'),
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as 'en' | 'uz' | 'ru')) {
    notFound();
  }

  // Enable static rendering
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* DNS Prefetch & Preconnect for external resources */}
        <link rel="preconnect" href="https://vercel.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://vercel.com" />

        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages} key={locale}>
          <ThemeProvider>
            <MotionProvider>
              <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background">
                <Navigation />
                <main className="relative z-10 flex-1 pt-12">
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
      </body>
    </html>
  );
}
