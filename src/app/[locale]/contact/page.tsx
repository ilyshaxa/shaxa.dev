'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Loader2, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { SectionHeader } from '@/components/section-header';
import { getProfile } from '@/lib/data';
import { spring } from '@/lib/motion';
import { isValidEmail } from '@/lib/validation';

const MAX_MESSAGE_LENGTH = 3000; // Telegram has a 4096 character limit, leaving some buffer
const emptyForm = { name: '', email: '', subject: '', message: '' };

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'sent' } | { kind: 'error'; detail?: string };

function RowIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-[10px] bg-background text-muted-foreground">
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

/** Gives the address one break opportunity, after the @, so the row wraps instead of overflowing at 320px. */
function BreakableEmail({ address }: { address: string }) {
  const at = address.indexOf('@') + 1;
  return (
    <>
      {address.slice(0, at)}
      <wbr />
      {address.slice(at)}
    </>
  );
}

export default function ContactPage() {
  const profile = getProfile();
  const t = useTranslations('contact');
  const tProfile = useTranslations('profile');
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [emailError, setEmailError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Apply character limit to message field
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;
    if (name === 'email' && emailError && isValidEmail(value)) setEmailError(false);
    if (status.kind === 'error') setStatus({ kind: 'idle' });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)) {
      setEmailError(true);
      return;
    }
    setStatus({ kind: 'submitting' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setFormData(emptyForm);
        setStatus({ kind: 'sent' });
      } else {
        // Typed text is kept so the visitor can retry.
        setStatus({ kind: 'error', detail: result.error });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({ kind: 'error' });
    }
  };

  return (
    <div className="page-container pb-24 pt-12 md:pb-32 md:pt-20">
      <SectionHeader as="h1" title={t('header.title')} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <Card className="gap-0 p-6 md:p-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {status.kind === 'sent' ? (
              <motion.div
                key="sent"
                role="status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={spring.default}
                className="flex min-h-[24rem] flex-col items-center justify-center text-center"
              >
                <CheckCircle2 className="size-14 text-success" strokeWidth={1.5} aria-hidden />
                <p className="mt-6 text-title-2 text-balance">{t('form.success')}</p>
                <Button variant="plain" className="mt-4" onClick={() => setStatus({ kind: 'idle' })}>
                  {t('form.sendAnother')}
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={spring.default}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('form.nameLabel')}</Label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('form.namePlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('form.emailLabel')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => setEmailError(formData.email.trim() !== '' && !isValidEmail(formData.email))}
                      aria-invalid={emailError}
                      aria-describedby={emailError ? 'email-error' : undefined}
                      placeholder={t('form.emailPlaceholder')}
                      required
                    />
                    {emailError && (
                      <p id="email-error" className="text-caption text-destructive">
                        {t('form.invalidEmail')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t('form.subjectLabel')}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('form.subjectPlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message">{t('form.messageLabel')}</Label>
                    <span className="text-caption tabular-nums text-muted-foreground">
                      {formData.message.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  </div>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('form.messagePlaceholder')}
                    className="min-h-[140px] resize-none"
                    maxLength={MAX_MESSAGE_LENGTH}
                    required
                  />
                  {formData.message.length > MAX_MESSAGE_LENGTH * 0.9 && (
                    <p className="text-caption text-muted-foreground">{t('form.charLimitWarning')}</p>
                  )}
                </div>

                {status.kind === 'error' && (
                  <p role="alert" className="rounded-chip bg-destructive/10 px-4 py-3 text-caption text-destructive">
                    {t('form.error')}
                    {status.detail ? ` (${status.detail})` : ''}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={status.kind === 'submitting'}>
                  {status.kind === 'submitting' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t('form.sending')}
                    </>
                  ) : (
                    t('form.send')
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>

        <GroupedList className="self-start">
          <GroupedListItem
            leading={<RowIcon icon={Mail} />}
            title={<BreakableEmail address={profile.email} />}
            subtitle={t('info.email')}
            href={`mailto:${profile.email}`}
          />
          <GroupedListItem
            leading={<RowIcon icon={Phone} />}
            title={<span className="block text-balance">{profile.phone}</span>}
            subtitle={t('info.phone')}
            href={`tel:${profile.phone.replace(/\s/g, '')}`}
          />
          <GroupedListItem leading={<RowIcon icon={MapPin} />} title={tProfile('location')} subtitle={t('info.location')} />
        </GroupedList>
      </div>
    </div>
  );
}
