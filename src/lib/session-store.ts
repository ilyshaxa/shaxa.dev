// Shared session store for authentication
// In production with multiple servers, consider using Redis or a database

interface SessionToken {
  token: string;
  expiresAt: number;
}

const validSessions = new Map<string, SessionToken>();

export function addValidSession(token: string, maxAgeSeconds: number) {
  validSessions.set(token, {
    token,
    expiresAt: Date.now() + maxAgeSeconds * 1000,
  });
}

export function isValidSession(token: string): boolean {
  // Check format: 64 character hex string (32 bytes)
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return false;
  }

  // Lazy cleanup: Check if token exists and is not expired
  const session = validSessions.get(token);
  if (!session) {
    return false;
  }

  const now = Date.now();
  if (now >= session.expiresAt) {
    // Clean up expired token immediately
    validSessions.delete(token);
    return false;
  }

  return true;
}

export function removeSession(token: string) {
  validSessions.delete(token);
}

