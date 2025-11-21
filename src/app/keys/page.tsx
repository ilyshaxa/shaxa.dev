'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Key, Loader2, AlertCircle, Lock, LogOut, Eye, EyeOff, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface SSHKey {
  name: string;
  key: string;
  type?: 'private' | 'public';
}

export default function KeysPage() {
  const [keys, setKeys] = useState<SSHKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [countdownMinutes, setCountdownMinutes] = useState<number | null>(null);

  useEffect(() => {
    checkAuth();
    checkRateLimitCookie();
  }, []);

  // Check for rate limit cookie on page load
  const checkRateLimitCookie = () => {
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
  };

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

  const checkAuth = async () => {
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
  };

  const fetchKeys = async () => {
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
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
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
          // Invalid password
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
          throw new Error(data.error + remaining || 'Invalid password');
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
      toast.success('Authentication successful!');
      fetchKeys();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate';
      setError(errorMessage);
      if (errorMessage.includes('Too many attempts')) {
        toast.error(errorMessage);
      } else {
        toast.error('Invalid password');
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
                  <span className="text-gradient">SSH Keys</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Enter password to access your SSH keys
              </p>
            </div>

            {/* Login Form */}
            <Card className="glass-dark border border-gray-300/40 dark:border-white/20">
              <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>
                  Please enter your password to view SSH keys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
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

                  {isRateLimited && countdownMinutes !== null && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-yellow-500/20">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-600 dark:text-yellow-400">
                          Rate limit exceeded
                        </p>
                        <p className="text-xs mt-1">
                          Try again in {countdownMinutes} minute{countdownMinutes !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  )}

                  {remainingAttempts !== null && remainingAttempts > 0 && !isRateLimited && !error && (
                    <div className="text-sm text-muted-foreground">
                      {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoggingIn || !password || isRateLimited}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : isRateLimited ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Rate Limited
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Login
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
                <span className="text-gradient">SSH Keys</span>
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4">
              <p className="text-lg text-muted-foreground">
                Access your SSH keys from anywhere
              </p>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
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
                    <p className="font-semibold text-destructive">Error</p>
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
                  Copy All Keys
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
                                      Private
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="h-3 w-3" />
                                      Public
                                    </>
                                  )}
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Click the copy button to copy the entire key
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
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copy
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
                <p className="text-lg font-semibold mb-2">No SSH keys found</p>
                <p className="text-sm text-muted-foreground">
                  Configure SSH keys in your environment variables
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

