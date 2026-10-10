import { notFound } from 'next/navigation';

// Unmatched paths under a locale (e.g. /ru/anything) would otherwise fall through to the English root not-found page.
// Calling notFound() inside the locale segment renders [locale]/not-found.tsx with the site chrome and translated copy.
export default function CatchAll() {
  notFound();
}
