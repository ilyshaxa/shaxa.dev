'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { getProfile } from '@/lib/data';

export default function ContactPage() {
  const profile = getProfile();
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
        alert('Thank you for your message! I\'ll get back to you soon.');
      } else {
        alert(`Error: ${result.error || 'Failed to send message. Please try again.'}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to send message. Please check your connection and try again.');
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
            <span className="text-gradient">Get In Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have a project in mind or just want to chat? I&apos;d love to hear from you!
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
                  Send me a message
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="glass-dark border-white/10 hover:border-white/20 transition-colors h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="glass-dark border-white/10 hover:border-white/20 transition-colors h-12"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="glass-dark border-white/10 hover:border-white/20 transition-colors h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.message.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project or just say hello!"
                      className="glass-dark border-white/10 hover:border-white/20 transition-colors min-h-[140px] resize-none"
                      maxLength={MAX_MESSAGE_LENGTH}
                      required
                    />
                    {formData.message.length > MAX_MESSAGE_LENGTH * 0.9 && (
                      <p className="text-sm text-amber-500 flex items-center gap-2">
                        <span>⚠️</span>
                        Message is getting close to the character limit
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
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
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
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription className="text-base">
                  Reach out through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email</h4>
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
                    <h4 className="font-semibold text-lg">Phone</h4>
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
                    <h4 className="font-semibold text-lg">Location</h4>
                    <p className="text-muted-foreground">{profile.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card className="glass-dark border-white/20 hover:border-white/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Response Times
                </CardTitle>
                <CardDescription className="text-base">
                  When you can expect to hear back
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">Email:</span>
                    </div>
                    <span className="font-semibold">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">Phone:</span>
                    </div>
                    <span className="font-semibold">Same day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">Social Media:</span>
                    </div>
                    <span className="font-semibold">Within 2-3 days</span>
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
