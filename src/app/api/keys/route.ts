import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/session-store';

export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('keys_auth');

    if (!authCookie?.value || !isValidSession(authCookie.value)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Get SSH keys from environment variables
    // Support multiple formats:
    // 1. SSH_KEY_1, SSH_KEY_2, etc.
    // 2. SSH_KEYS as JSON array
    // 3. SSH_KEY as single key
    
    const keys: Array<{ name: string; key: string; type?: 'private' | 'public' }> = [];
    
    // Try JSON format first
    const sshKeysJson = process.env.SSH_KEYS;
    if (sshKeysJson) {
      try {
        const parsed = JSON.parse(sshKeysJson);
        if (Array.isArray(parsed)) {
          parsed.forEach((item, index) => {
            if (typeof item === 'string') {
              // Auto-detect type from key content
              const keyType = item.includes('BEGIN RSA PRIVATE KEY') || item.includes('BEGIN OPENSSH PRIVATE KEY') 
                ? 'private' 
                : item.includes('BEGIN PUBLIC KEY') || item.includes('ssh-rsa') || item.includes('ssh-ed25519')
                ? 'public'
                : undefined;
              keys.push({ 
                name: `SSH Key ${index + 1}`, 
                key: item,
                type: keyType
              });
            } else if (item && typeof item === 'object' && item.key) {
              keys.push({ 
                name: item.name || `SSH Key ${index + 1}`, 
                key: item.key,
                type: item.type || (item.key.includes('BEGIN RSA PRIVATE KEY') || item.key.includes('BEGIN OPENSSH PRIVATE KEY') 
                  ? 'private' 
                  : item.key.includes('BEGIN PUBLIC KEY') || item.key.includes('ssh-rsa') || item.key.includes('ssh-ed25519')
                  ? 'public'
                  : undefined)
              });
            }
          });
        }
      } catch {
        // If JSON parsing fails, continue to other methods
      }
    }
    
    // Try numbered keys (SSH_KEY_1, SSH_KEY_2, etc.)
    if (keys.length === 0) {
      let index = 1;
      while (true) {
        const key = process.env[`SSH_KEY_${index}`];
        if (!key) break;
        const keyType = key.includes('BEGIN RSA PRIVATE KEY') || key.includes('BEGIN OPENSSH PRIVATE KEY') 
          ? 'private' 
          : key.includes('BEGIN PUBLIC KEY') || key.includes('ssh-rsa') || key.includes('ssh-ed25519')
          ? 'public'
          : undefined;
        keys.push({ name: `SSH Key ${index}`, key, type: keyType });
        index++;
      }
    }
    
    // Try single SSH_KEY
    if (keys.length === 0) {
      const singleKey = process.env.SSH_KEY;
      if (singleKey) {
        const keyType = singleKey.includes('BEGIN RSA PRIVATE KEY') || singleKey.includes('BEGIN OPENSSH PRIVATE KEY') 
          ? 'private' 
          : singleKey.includes('BEGIN PUBLIC KEY') || singleKey.includes('ssh-rsa') || singleKey.includes('ssh-ed25519')
          ? 'public'
          : undefined;
        keys.push({ name: 'SSH Key', key: singleKey, type: keyType });
      }
    }
    
    if (keys.length === 0) {
      return NextResponse.json(
        { error: 'No SSH keys found in environment variables' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ keys });
  } catch (error) {
    console.error('Error fetching SSH keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SSH keys' },
      { status: 500 }
    );
  }
}

