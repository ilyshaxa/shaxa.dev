import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { removeSession } from '@/lib/session-store';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('keys_auth');
    
    // Remove session from store if exists
    if (authCookie?.value) {
      removeSession(authCookie.value);
    }
    
    // Delete cookie
    cookieStore.delete('keys_auth');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

