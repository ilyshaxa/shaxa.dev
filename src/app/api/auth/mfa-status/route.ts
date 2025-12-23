import { NextResponse } from 'next/server';

// Public endpoint to check if MFA is enabled
// This doesn't leak sensitive information - just whether MFA is required
export async function GET() {
  try {
    const mfaEnabled = !!process.env.TOTP_SECRET;
    
    return NextResponse.json({ 
      mfaEnabled 
    });
  } catch (error) {
    console.error('MFA status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

