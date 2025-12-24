'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Key, Loader2, AlertCircle, Lock, LogOut, Eye, EyeOff, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface SSHKey {
  name: string;
  key: string;
  type?: 'private' | 'public';
}

export default function KeysPage() {
  const t = useTranslations('keys');
  const [keys, setKeys] = useState<SSHKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState<boolean | null>(null); // null = loading, true/false = loaded
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [countdownMinutes, setCountdownMinutes] = useState<number | null>(null);

  // Check for rate limit cookie on page load
  const checkRateLimitCookie = useCallback(() => {
    const cookies = document.cookie.split(';');
    const rateLimitCookie = cookies.find(c => c.trim().startsWith('keys_rate_limit='));
    
    if (rateLimitCookie) {
      const resetAt = parseInt(rateLimitCookie.split('=')[1]);
      const now = Date.now();
      
      if (resetAt > now) {
        // Still rate limited
        setIsRateLimited(true);
        setRateLimitResetAt(resetAt);
      } else {
        // Rate limit expired, clear cookie
        document.cookie = 'keys_rate_limit=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }
  }, []);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/keys');
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        throw new Error(data.error || 'Failed to fetch keys');
      }
      
      setKeys(data.keys || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SSH keys');
      console.error('Error fetching keys:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkMfaStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/mfa-status');
      const data = await response.json();
      console.log('MFA Status Response:', data);
      setMfaEnabled(data.mfaEnabled || false);
      console.log('MFA Enabled State:', data.mfaEnabled || false);
    } catch (err) {
      console.error('MFA status check error:', err);
      setMfaEnabled(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      setIsAuthenticated(data.authenticated || false);
      
      if (data.authenticated) {
        fetchKeys();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [fetchKeys]);

  useEffect(() => {
    checkAuth();
    checkRateLimitCookie();
    checkMfaStatus();
  }, [checkAuth, checkRateLimitCookie, checkMfaStatus]);

  // Countdown timer for rate limit
  useEffect(() => {
    if (!isRateLimited || !rateLimitResetAt) {
      setCountdownMinutes(null);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = rateLimitResetAt - now;
      
      if (remaining <= 0) {
        setIsRateLimited(false);
        setRateLimitResetAt(null);
        setCountdownMinutes(null);
        setError(null);
        // Clear rate limit cookie
        document.cookie = 'keys_rate_limit=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        return;
      }

      const minutes = Math.ceil(remaining / 1000 / 60);
      setCountdownMinutes(minutes);
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isRateLimited, rateLimitResetAt]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't allow submission until we know MFA status
    if (mfaEnabled === null) {
      return;
    }
    
    // Validate all required fields are filled
    if (!password) {
      setError(t('auth.password') + ' is required');
      return;
    }
    
    // If MFA is enabled, require MFA code before submission
    if (mfaEnabled === true && !totpCode) {
      setError(t('auth.authCode') + ' is required');
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    try {
      const body: { password: string; totpCode?: string } = { password };
      
      // Add TOTP code if provided
      if (totpCode) {
        body.totpCode = totpCode;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          const resetAt = data.resetAt ? new Date(data.resetAt).getTime() : Date.now() + 15 * 60 * 1000;
          setIsRateLimited(true);
          setRateLimitResetAt(resetAt);
          // Set cookie to persist rate limit state
          const maxAge = Math.ceil((resetAt - Date.now()) / 1000);
          document.cookie = `keys_rate_limit=${resetAt}; max-age=${maxAge}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
          const resetIn = Math.ceil((resetAt - Date.now()) / 1000 / 60);
          throw new Error(data.error || `Too many attempts. Try again in ${resetIn} minute(s).`);
        } else if (response.status === 401) {
          // Invalid credentials
          if (data.remainingAttempts !== undefined) {
            setRemainingAttempts(data.remainingAttempts);
            if (data.remainingAttempts === 0) {
              // Last attempt used, will be rate limited on next try
              const resetAt = Date.now() + 15 * 60 * 1000;
              setIsRateLimited(true);
              setRateLimitResetAt(resetAt);
              // Set cookie to persist rate limit state
              const maxAge = Math.ceil((resetAt - Date.now()) / 1000);
              document.cookie = `keys_rate_limit=${resetAt}; max-age=${maxAge}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
            }
          }
          const remaining = data.remainingAttempts !== undefined 
            ? ` (${data.remainingAttempts} attempts remaining)`
            : '';
          throw new Error(data.error + remaining || 'Invalid credentials');
        } else {
          throw new Error(data.error || 'Login failed');
        }
      }

      // Successful login - clear rate limit state
      setIsRateLimited(false);
      setRateLimitResetAt(null);
      setRemainingAttempts(null);

      setIsAuthenticated(true);
      setPassword('');
      setTotpCode('');
      toast.success('Authentication successful!');
      fetchKeys();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate';
      setError(errorMessage);
      if (errorMessage.includes('Too many attempts')) {
        toast.error(errorMessage);
      } else if (errorMessage.includes('Authentication code required')) {
        // Don't show toast for this - it's shown in the form
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setKeys([]);
      setPassword('');
      setTotpCode('');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('SSH key copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
      console.error('Copy error:', err);
    }
  };

  const copyAllKeys = async () => {
    const allKeys = keys.map(k => `${k.name}:\n${k.key}`).join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(allKeys);
      toast.success('All SSH keys copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy all keys');
      console.error('Copy error:', err);
    }
  };

  // Show login form if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Lock className="h-8 w-8 text-primary" />
                <h1 className="text-4xl sm:text-5xl font-bold">
                  <span className="text-gradient">{t('title')}</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                {t('auth.subtitle')}
              </p>
            </div>

            {/* Login Form */}
            <Card className="glass-dark border border-gray-300/40 dark:border-white/20">
              <CardHeader>
                <CardTitle>{t('auth.title')}</CardTitle>
                <CardDescription>
                  {mfaEnabled ? t('auth.descriptionWithMFA') : t('auth.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.passwordPlaceholder')}
                        required
                        className="pr-10"
                        disabled={isLoggingIn || isRateLimited}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoggingIn || isRateLimited}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {mfaEnabled === true && (
                    <div className="space-y-4 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium">{t('auth.mfaTitle')}</span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totpCode">{t('auth.authCode')}</Label>
                        <Input
                          id="totpCode"
                          type="text"
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder={t('auth.authCodePlaceholder')}
                          maxLength={6}
                          className="text-left text-lg tracking-widest font-mono"
                          disabled={isLoggingIn || isRateLimited}
                          autoComplete="off"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          {t('auth.authCodeHint')}
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  {isRateLimited && countdownMinutes !== null && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-yellow-500/20">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-600 dark:text-yellow-400">
                          {t('auth.rateLimitExceeded')}
                        </p>
                        <p className="text-xs mt-1">
                          {t('auth.tryAgainIn', { minutes: countdownMinutes, plural: countdownMinutes !== 1 ? 's' : '' })}
                        </p>
                      </div>
                    </div>
                  )}

                  {remainingAttempts !== null && remainingAttempts > 0 && !isRateLimited && !error && (
                    <div className="text-sm text-muted-foreground">
                      {t('auth.attemptsRemaining', { count: remainingAttempts, plural: remainingAttempts !== 1 ? 's' : '' })}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      mfaEnabled === null || // Still loading MFA status
                      isLoggingIn || 
                      !password || 
                      isRateLimited || 
                      (mfaEnabled === true && !totpCode) // MFA enabled but no code
                    }
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('auth.authenticating')}
                      </>
                    ) : isRateLimited ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {t('auth.rateLimited')}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {t('auth.login')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Key className="h-8 w-8 text-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold">
                <span className="text-gradient">{t('title')}</span>
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4">
              <p className="text-lg text-muted-foreground">
                {t('subtitle')}
              </p>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('auth.logout')}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-semibold text-destructive">{t('list.error')}</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keys List */}
          {!loading && !error && keys.length > 0 && (
            <>
              <div className="flex justify-end">
                <Button
                  onClick={copyAllKeys}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {t('list.copyAll')}
                </Button>
              </div>

              <div className="space-y-4">
                {keys.map((sshKey, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="glass-dark border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 flex-wrap">
                              <Key className="h-5 w-5 text-primary" />
                              {sshKey.name}
                              {sshKey.type && (
                                <Badge 
                                  variant={sshKey.type === 'private' ? 'destructive' : 'default'}
                                  className="ml-2 gap-1"
                                >
                                  {sshKey.type === 'private' ? (
                                    <>
                                      <Shield className="h-3 w-3" />
                                      {t('list.private')}
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="h-3 w-3" />
                                      {t('list.public')}
                                    </>
                                  )}
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {t('list.clickToCopy')}
                            </CardDescription>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(sshKey.key, index)}
                            variant="outline"
                            size="sm"
                            className="gap-2 min-w-[100px]"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="h-4 w-4" />
                                {t('list.copied')}
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                {t('list.copy')}
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <pre className="p-4 rounded-lg bg-muted/50 dark:bg-muted/30 border border-gray-300/20 dark:border-white/10 overflow-x-auto text-sm font-mono">
                            <code className="text-foreground break-all whitespace-pre-wrap">
                              {sshKey.key}
                            </code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && !error && keys.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">{t('list.empty.title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('list.empty.description')}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

