import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import { addValidSession } from '@/lib/session-store';

// In-memory rate limiting store
// In production, consider using Redis or a database for distributed systems
interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.lastAttempt > WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

// Check rate limit
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, {
      attempts: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetAt: now + WINDOW_MS };
  }

  // Reset if window has passed
  if (now - entry.firstAttempt > WINDOW_MS) {
    rateLimitStore.set(ip, {
      attempts: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetAt: now + WINDOW_MS };
  }

  // Check if exceeded
  if (entry.attempts >= MAX_ATTEMPTS) {
    const resetAt = entry.firstAttempt + WINDOW_MS;
    return { allowed: false, remaining: 0, resetAt };
  }

  // Increment attempts
  entry.attempts++;
  entry.lastAttempt = now;
  rateLimitStore.set(ip, entry);

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.attempts,
    resetAt: entry.firstAttempt + WINDOW_MS,
  };
}

// Send Telegram notification for login attempts
async function sendLoginAttemptNotification(
  ip: string,
  success: boolean,
  timestamp: string,
  wrongPassword?: string
) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram bot configuration missing');
      return;
    }

    const emoji = success ? '✅' : '❌';
    const status = success ? 'Successful Login' : 'Failed Login Attempt';
    const passwordInfo = wrongPassword
      ? `\n🔑 *Attempted Password:* \`${wrongPassword.replace(/`/g, '\\`')}\``
      : '';

    const telegramMessage = `
${emoji} *SSH Keys Page ${status}*

🌐 *IP Address:* ${ip}
🕐 *Time:* ${timestamp}
${passwordInfo}
---
*From shaxa.dev SSH Keys page*
    `.trim();

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API error:', errorData);
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password, totpCode } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Get client IP
    const clientIP = getClientIP(request);
    const timestamp = new Date().toISOString();

    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
      
      // Send notification for rate limit exceeded
      await sendLoginAttemptNotification(
        clientIP,
        false,
        timestamp,
        password
      );

      // Set rate limit cookie (readable by client to persist state)
      const cookieStore = await cookies();
      cookieStore.set('keys_rate_limit', rateLimit.resetAt.toString(), {
        httpOnly: false, // Allow client to read it
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        path: '/',
      });

      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${resetIn} minute(s).`,
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Get the password from environment variables
    const correctPassword = process.env.KEYS_PAGE_PASSWORD;

    if (!correctPassword) {
      console.error('KEYS_PAGE_PASSWORD environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check if MFA is enabled
    const totpSecret = process.env.TOTP_SECRET;
    const mfaEnabled = !!totpSecret;

    // If MFA is enabled, require both password AND MFA code
    if (mfaEnabled && !totpCode) {
      return NextResponse.json(
        {
          error: 'Authentication code required',
          remainingAttempts: rateLimit.remaining,
          mfaRequired: true,
        },
        { status: 401 }
      );
    }

    // Validate password
    const passwordMatch = password === correctPassword;

    // Validate MFA (if enabled)
    let mfaValid = !mfaEnabled; // If MFA not enabled, consider it valid

    if (mfaEnabled && totpCode) {
      mfaValid = speakeasy.totp.verify({
        secret: totpSecret,
        encoding: 'base32',
        token: totpCode,
        window: 2, // Allow 2 time steps before and after (±60 seconds)
      });
    }

    // Check both credentials together - don't reveal which one failed
    if (!passwordMatch || !mfaValid) {
      // Send notification for failed attempt
      await sendLoginAttemptNotification(
        clientIP,
        false,
        timestamp,
        password
      );

      return NextResponse.json(
        {
          error: 'Invalid credentials',
          remainingAttempts: rateLimit.remaining,
          mfaRequired: mfaEnabled,
        },
        { status: 401 }
      );
    }

    // Successful login - send notification
    await sendLoginAttemptNotification(clientIP, true, timestamp);

    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds

    // Store valid session
    addValidSession(sessionToken, maxAge);

    // Set authentication cookie (valid for 7 days)
    const cookieStore = await cookies();
    cookieStore.set('keys_auth', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    // Clear rate limit on successful login
    rateLimitStore.delete(clientIP);
    
    // Clear rate limit cookie
    cookieStore.delete('keys_rate_limit');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

