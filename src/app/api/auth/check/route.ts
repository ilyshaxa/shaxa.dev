import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/session-store';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('keys_auth');

    if (!authCookie?.value) {
      return NextResponse.json({ authenticated: false });
    }

    const isAuthenticated = isValidSession(authCookie.value);

    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

