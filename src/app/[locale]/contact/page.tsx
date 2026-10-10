'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GroupedList, GroupedListItem } from '@/components/grouped-list';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionHeader } from '@/components/section-header';
import { getProfile } from '@/lib/data';
import { spring } from '@/lib/motion';
import { isValidEmail } from '@/lib/validation';

const MAX_MESSAGE_LENGTH = 3000; // Telegram has a 4096 character limit, leaving some buffer
const emptyForm = { name: '', email: '', subject: '', message: '' };

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'sent' } | { kind: 'error'; detail?: string };

function RowIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-8 items-center justify-center rounded-[9px] bg-primary-fill text-white">
      <Icon className="size-4" />
    </span>
  );
}

export default function ContactPage() {
  const profile = getProfile();
  const t = useTranslations('contact');
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

  const responseLabel = (key: 'email' | 'phone' | 'socialMedia') => t(`responseTimes.${key}`).replace(/:$/, '');

  return (
    <div className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <SectionHeader as="h1" title={t('header.title')} />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ScrollReveal>
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
                    className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                  >
                    <CheckCircle2 className="size-14 text-success" strokeWidth={1.5} aria-hidden />
                    <p className="mt-6 text-title-2">{t('form.success')}</p>
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
                  >
                    <h2 className="text-title-2">{t('form.title')}</h2>
                    <p className="mt-2 text-body text-muted-foreground">{t('form.description')}</p>

                    <div className="mt-8 space-y-5">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('form.name')}</Label>
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
                          <Label htmlFor="email">{t('form.email')}</Label>
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
                          <Label htmlFor="message">{t('form.message')}</Label>
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
                          <p className="text-caption text-amber-600 dark:text-amber-400">{t('form.charLimitWarning')}</p>
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
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.05} className="space-y-12">
            <section>
              <h2 className="text-title-2">{t('info.title')}</h2>
              <p className="mt-2 text-body text-muted-foreground">{t('info.description')}</p>
              <GroupedList className="mt-6">
                <GroupedListItem
                  leading={<RowIcon icon={Mail} />}
                  title={profile.email}
                  subtitle={t('info.email')}
                  href={`mailto:${profile.email}`}
                />
                <GroupedListItem
                  leading={<RowIcon icon={Phone} />}
                  title={profile.phone}
                  subtitle={t('info.phone')}
                  href={`tel:${profile.phone.replace(/\s/g, '')}`}
                />
                <GroupedListItem leading={<RowIcon icon={MapPin} />} title={profile.location} subtitle={t('info.location')} />
              </GroupedList>
            </section>

            <section>
              <h2 className="text-title-2">{t('responseTimes.title')}</h2>
              <p className="mt-2 text-body text-muted-foreground">{t('responseTimes.description')}</p>
              <GroupedList className="mt-6">
                <GroupedListItem leading={<RowIcon icon={Mail} />} title={responseLabel('email')} trailing={t('responseTimes.emailTime')} />
                <GroupedListItem leading={<RowIcon icon={Phone} />} title={responseLabel('phone')} trailing={t('responseTimes.phoneTime')} />
                <GroupedListItem
                  leading={<RowIcon icon={MessageCircle} />}
                  title={responseLabel('socialMedia')}
                  trailing={t('responseTimes.socialMediaTime')}
                />
              </GroupedList>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
