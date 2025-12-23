'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Shield, Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface SetupData {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  manual: {
    issuer: string;
    account: string;
    secret: string;
  };
}

export default function SetupMFAPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState<number[]>([]);

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/setup-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup MFA');
      }

      setSetupData(data);
      toast.success('MFA setup initiated! Scan the QR code with your authenticator app.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to setup MFA';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData) return;

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/setup-mfa', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          secret: setupData.secret,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setIsVerified(true);
      toast.success('MFA verified successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'secret' | number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'secret') {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else {
        setCopiedBackupCodes([...copiedBackupCodes, type]);
        setTimeout(() => {
          setCopiedBackupCodes(copiedBackupCodes.filter(i => i !== type));
        }, 2000);
      }
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
      console.error('Copy error:', err);
    }
  };

  const copyAllBackupCodes = async () => {
    if (!setupData) return;
    const allCodes = setupData.backupCodes.join('\n');
    try {
      await navigator.clipboard.writeText(allCodes);
      toast.success('All backup codes copied to clipboard!');
    } catch {
      toast.error('Failed to copy backup codes');
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold">
                <span className="text-gradient">Setup MFA</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Secure your SSH keys with Two-Factor Authentication
            </p>
          </div>

          {/* Step 1: Enter Password */}
          {!setupData && (
            <Card className="glass-dark border border-gray-300/40 dark:border-white/20">
              <CardHeader>
                <CardTitle>Step 1: Verify Your Identity</CardTitle>
                <CardDescription>
                  Enter your password to generate your MFA setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateQR} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading || !password}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Generate QR Code
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Scan QR Code */}
          {setupData && !isVerified && (
            <>
              <Card className="glass-dark border border-gray-300/40 dark:border-white/20">
                <CardHeader>
                  <CardTitle>Step 2: Scan QR Code</CardTitle>
                  <CardDescription>
                    Use Google Authenticator, Authy, or any TOTP authenticator app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* QR Code */}
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <Image
                      src={setupData.qrCode}
                      alt="MFA QR Code"
                      width={256}
                      height={256}
                      className="w-64 h-64"
                    />
                  </div>

                  {/* Manual Entry */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Can&apos;t scan? Enter manually:</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 rounded-lg bg-muted/50 dark:bg-muted/30 border border-gray-300/20 dark:border-white/10 text-sm font-mono break-all">
                        {setupData.manual.secret}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(setupData.manual.secret, 'secret')}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        {copiedSecret ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Issuer:</strong> {setupData.manual.issuer}</p>
                      <p><strong>Account:</strong> {setupData.manual.account}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Verify */}
              <Card className="glass-dark border border-gray-300/40 dark:border-white/20">
                <CardHeader>
                  <CardTitle>Step 3: Verify Setup</CardTitle>
                  <CardDescription>
                    Enter the 6-digit code from your authenticator app
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">Verification Code</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="XXXXXX"
                        maxLength={6}
                        className="text-left text-2xl tracking-widest font-mono"
                        disabled={isVerifying}
                        autoComplete="off"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isVerifying || verificationCode.length !== 6}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Code
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 4: Backup Codes */}
          {setupData && isVerified && (
            <Card className="glass-dark border border-green-500/40 dark:border-green-400/40">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle>MFA Verified Successfully!</CardTitle>
                </div>
                <CardDescription>
                  Save your backup codes in a secure location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Environment Variable Instructions */}
                <div className="space-y-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    Important: Add these to your environment variables
                  </p>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex items-start gap-2">
                      <code className="flex-1 p-2 rounded bg-muted/50 dark:bg-muted/30 text-xs break-all">
                        TOTP_SECRET={setupData.secret}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(`TOTP_SECRET=${setupData.secret}`, 'secret')}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        {copiedSecret ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <div className="flex items-start gap-2">
                      <code className="flex-1 p-2 rounded bg-muted/50 dark:bg-muted/30 text-xs break-all">
                        BACKUP_CODES={JSON.stringify(setupData.backupCodes)}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(`BACKUP_CODES=${JSON.stringify(setupData.backupCodes)}`, 'secret')}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Backup Codes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Backup Codes</Label>
                    <Button
                      onClick={copyAllBackupCodes}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Each code can be used once if you lose access to your authenticator
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {setupData.backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 dark:bg-muted/30 border border-gray-300/20 dark:border-white/10"
                      >
                        <code className="flex-1 font-mono text-sm">{code}</code>
                        <Button
                          onClick={() => copyToClipboard(code, index)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          {copiedBackupCodes.includes(index) ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    <strong>⚠️ Warning:</strong> Store these backup codes securely. They provide access to your SSH keys if you lose your authenticator device.
                  </p>
                </div>

                <Button
                  onClick={() => window.location.href = '/keys'}
                  className="w-full"
                  variant="default"
                >
                  Go to SSH Keys Page
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

