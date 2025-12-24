import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../../i18n';
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
    description: t('description', { bio: profile.shortBio }),
    keywords: [
      "Shaxriyor Jabborov",
      "Shaxriyor DevOps",
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
      description: t('description', { bio: profile.shortBio }),
      siteName: siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: t('title', { name: profile.name, title: profile.title }),
      description: t('description', { bio: profile.shortBio }),
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
    <NextIntlClientProvider locale={locale} messages={messages} key={locale}>
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
    </NextIntlClientProvider>
  );
}

