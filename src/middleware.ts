import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '../i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix for routes
  localePrefix: 'always',

  // The pages already declare hreflang in their <head> (src/lib/seo.ts). The middleware's Link header would repeat
  // them with a conflicting x-default (the unprefixed path, which only redirects), so it is switched off.
  alternateLinks: false
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all locales
    '/',
    '/(en|uz|ru)/:path*'
  ]
};

