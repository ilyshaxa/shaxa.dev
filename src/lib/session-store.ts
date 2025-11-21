// Shared session store for authentication
// In production with multiple servers, consider using Redis or a database

interface SessionToken {
  token: string;
  expiresAt: number;
}

const validSessions = new Map<string, SessionToken>();

// Clean up expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of validSessions.entries()) {
    if (now > session.expiresAt) {
      validSessions.delete(token);
    }
  }
}, 5 * 60 * 1000);

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

  // Check if token exists and is not expired
  const session = validSessions.get(token);
  return session ? Date.now() < session.expiresAt : false;
}

export function removeSession(token: string) {
  validSessions.delete(token);
}

