import { headers } from 'next/headers';

/**
 * Get the current base URL (domain) from the request
 * Supports both shaxa.dev and shaxriyor.com
 */
export async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // In production, use the current domain
  return `${protocol}://${host}`;
}

/**
 * Get the primary domain (for canonical URLs)
 * Defaults to shaxa.dev but can be overridden
 */
export function getPrimaryDomain(): string {
  return process.env.PRIMARY_DOMAIN || 'https://shaxa.dev';
}

/**
 * Check if the current domain is the primary domain
 */
export async function isPrimaryDomain(): Promise<boolean> {
  const baseUrl = await getBaseUrl();
  const primaryDomain = getPrimaryDomain();
  return baseUrl === primaryDomain || baseUrl.includes('shaxa.dev');
}

