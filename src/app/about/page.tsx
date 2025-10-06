'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Globe, Code, Heart } from 'lucide-react';
import { getProfile } from '@/lib/data';

export default function AboutPage() {
  const profile = getProfile();

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-gradient">About Me</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know more about my journey, values, and what drives me as a developer
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16"
        >
          <Card className="glass-dark border-white/20">
            <CardContent className="pt-8">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-xl leading-relaxed mb-6">
                  {profile.bio}
                </p>
                <p className="text-lg leading-relaxed">
                  I believe in the power of technology to solve real-world problems and create 
                  meaningful experiences. My approach to development is rooted in clean code, 
                  user-centered design, and continuous learning. I&apos;m passionate about building 
                  applications that not only work well but also provide genuine value to users.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="glass-dark border-white/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Education
                </CardTitle>
                <CardDescription>
                  My academic background and formal education
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-lg">{edu.degree}</h4>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    <Badge variant="outline" className="glass-dark">
                      {edu.year}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Card className="glass-dark border-white/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Certifications
                </CardTitle>
                <CardDescription>
                  Professional certifications and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-lg">{cert.name}</h4>
                    <p className="text-muted-foreground">{cert.issuer}</p>
                    <Badge variant="outline" className="glass-dark">
                      {cert.year}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <Card className="glass-dark border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                Languages
              </CardTitle>
              <CardDescription>
                Languages I speak and work in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.languages.map((lang, index) => (
                  <div key={index} className="text-center space-y-2">
                    <h4 className="font-semibold">{lang.name}</h4>
                    <Badge variant="outline" className="glass-dark">
                      {lang.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values & Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mb-16"
        >
          <Card className="glass-dark border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Values & Philosophy
              </CardTitle>
              <CardDescription>
                What drives me and shapes my approach to work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Code Quality
                  </h4>
                  <p className="text-muted-foreground">
                    I believe in writing clean, maintainable, and well-documented code. 
                    Good code is not just about functionality, but about readability and 
                    maintainability for future developers.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    User-Centric Design
                  </h4>
                  <p className="text-muted-foreground">
                    Every project I work on is designed with the end user in mind. 
                    I focus on creating intuitive, accessible, and delightful experiences 
                    that solve real problems.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Continuous Learning
                  </h4>
                  <p className="text-muted-foreground">
                    Technology evolves rapidly, and I&apos;m committed to staying current 
                    with the latest trends, tools, and best practices in web development.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Collaboration
                  </h4>
                  <p className="text-muted-foreground">
                    I believe the best solutions come from collaborative efforts. 
                    I enjoy working with diverse teams and contributing to open-source projects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Card className="glass-dark border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Fun Facts
              </CardTitle>
              <CardDescription>
                A few things about me outside of coding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Coffee Enthusiast ☕</h4>
                  <p className="text-muted-foreground">
                    I start every day with a perfect cup of coffee and often work from local cafes.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Photography 📸</h4>
                  <p className="text-muted-foreground">
                    I love capturing moments and finding beauty in everyday scenes through photography.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Travel Lover 🌍</h4>
                  <p className="text-muted-foreground">
                    Exploring new places and cultures is one of my greatest passions and sources of inspiration.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Music Producer 🎵</h4>
                  <p className="text-muted-foreground">
                    In my free time, I create electronic music and experiment with sound design.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
