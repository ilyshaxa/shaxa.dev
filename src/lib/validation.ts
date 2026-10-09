const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Light client-side check (local@domain.tld); the API remains the source of truth. */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
