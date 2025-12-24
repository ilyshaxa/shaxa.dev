// Locale types
export type Locale = 'en' | 'uz' | 'ru';

export const locales: readonly Locale[] = ['en', 'uz', 'ru'] as const;

export const defaultLocale: Locale = 'en';

// Language display names
export const languageNames: Record<Locale, string> = {
  en: 'English',
  uz: "O'zbekcha",
  ru: 'Русский',
};

// Language flags
export const languageFlags: Record<Locale, string> = {
  en: '🇬🇧',
  uz: '🇺🇿',
  ru: '🇷🇺',
};

// Locale metadata for SEO
export const localeMetadata: Record<Locale, { code: string; name: string; dir: 'ltr' | 'rtl' }> = {
  en: { code: 'en_US', name: 'English', dir: 'ltr' },
  uz: { code: 'uz_UZ', name: 'Uzbek', dir: 'ltr' },
  ru: { code: 'ru_RU', name: 'Russian', dir: 'ltr' },
};

