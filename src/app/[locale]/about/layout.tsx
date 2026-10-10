import type { Metadata } from 'next';
import { sectionMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return sectionMetadata(locale, 'about');
}

// The page is a client component and cannot export metadata, so this server layout carries it.
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
