import { NextRequest } from 'next/server';

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_OFF_TOPIC_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    return { allowed: true, remaining: MAX_OFF_TOPIC_ATTEMPTS, resetAt: now + WINDOW_MS };
  }

  if (now - entry.firstAttempt > WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true, remaining: MAX_OFF_TOPIC_ATTEMPTS, resetAt: now + WINDOW_MS };
  }

  if (entry.attempts >= MAX_OFF_TOPIC_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetAt: entry.firstAttempt + WINDOW_MS };
  }

  return {
    allowed: true,
    remaining: MAX_OFF_TOPIC_ATTEMPTS - entry.attempts,
    resetAt: entry.firstAttempt + WINDOW_MS,
  };
}

export function incrementRateLimit(ip: string): void {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, { attempts: 1, firstAttempt: now, lastAttempt: now });
  } else {
    entry.attempts++;
    entry.lastAttempt = now;
    rateLimitStore.set(ip, entry);
  }
}
