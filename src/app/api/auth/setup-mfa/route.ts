import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Verify the password first
    const correctPassword = process.env.KEYS_PAGE_PASSWORD;
    if (!correctPassword || password !== correctPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Check if MFA is already set up
    const existingSecret = process.env.TOTP_SECRET;
    if (existingSecret) {
      return NextResponse.json(
        { error: 'MFA is already configured. Contact administrator to reset.' },
        { status: 400 }
      );
    }

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: 'shaxa.dev SSH Keys',
      issuer: 'shaxa.dev',
      length: 32,
    });

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      manual: {
        issuer: 'shaxa.dev',
        account: 'SSH Keys',
        secret: secret.base32,
      }
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup MFA' },
      { status: 500 }
    );
  }
}

// Verify a TOTP code during setup
export async function PUT(request: NextRequest) {
  try {
    const { password, secret, code } = await request.json();

    // Verify the password first
    const correctPassword = process.env.KEYS_PAGE_PASSWORD;
    if (!correctPassword || password !== correctPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
      window: 2, // Allow 2 time steps before and after
    });

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'MFA verified successfully. Please add the secret to your environment variables.'
    });
  } catch (error) {
    console.error('MFA verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify MFA' },
      { status: 500 }
    );
  }
}

