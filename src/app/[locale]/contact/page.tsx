'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { getProfile } from '@/lib/data';

export default function ContactPage() {
  const profile = getProfile();
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const MAX_MESSAGE_LENGTH = 3000; // Telegram has a 4096 character limit, leaving some buffer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Reset form on success
        setFormData({ name: '', email: '', subject: '', message: '' });
        alert(t('form.success'));
      } else {
        alert(`${t('form.error')}: ${result.error || t('form.error')}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply character limit to message field
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return; // Don't update if exceeding limit
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
            <span className="text-gradient">{t('header.title')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('header.subtitle')}
          </p>
        </motion.div>

        {/* Symmetric Layout - 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Card className="glass-dark border-white/20 hover:border-white/40 transition-all duration-300 h-full">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  {t('form.title')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">{t('form.name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('form.namePlaceholder')}
                        className="glass-dark border-white/10 hover:border-white/20 transition-colors h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">{t('form.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('form.emailPlaceholder')}
                        className="glass-dark border-white/10 hover:border-white/20 transition-colors h-12"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">{t('form.subjectLabel')}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('form.subjectPlaceholder')}
                      className="glass-dark border-white/10 hover:border-white/20 transition-colors h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="message" className="text-sm font-medium">{t('form.message')}</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.message.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('form.messagePlaceholder')}
                      className="glass-dark border-white/10 hover:border-white/20 transition-colors min-h-[140px] resize-none"
                      maxLength={MAX_MESSAGE_LENGTH}
                      required
                    />
                    {formData.message.length > MAX_MESSAGE_LENGTH * 0.9 && (
                      <p className="text-sm text-amber-500 flex items-center gap-2">
                        <span>⚠️</span>
                        {t('form.charLimitWarning')}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="glass"
                    size="lg"
                    className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('form.sending')}
                      </div>
                    ) : (
                      t('form.send')
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information & Response Times */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <Card className="glass-dark border-white/20 hover:border-white/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">{t('info.title')}</CardTitle>
                <CardDescription className="text-base">
                  {t('info.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{t('info.email')}</h4>
                    <a 
                      href={`mailto:${profile.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{t('info.phone')}</h4>
                    <a 
                      href={`tel:${profile.phone}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{t('info.location')}</h4>
                    <p className="text-muted-foreground">{profile.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card className="glass-dark border-white/20 hover:border-white/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t('responseTimes.title')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('responseTimes.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{t('responseTimes.email')}</span>
                    </div>
                    <span className="font-semibold">{t('responseTimes.emailTime')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{t('responseTimes.phone')}</span>
                    </div>
                    <span className="font-semibold">{t('responseTimes.phoneTime')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{t('responseTimes.socialMedia')}</span>
                    </div>
                    <span className="font-semibold">{t('responseTimes.socialMediaTime')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
