'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Globe, Code, Heart } from 'lucide-react';
import Image from 'next/image';
import { getProfile } from '@/lib/data';
import { useTheme } from '@/components/theme-provider';

export default function AboutPage() {
  const profile = getProfile();
  const { actualTheme } = useTheme();

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
            Get to know more about my journey, values, and what drives me as a DevOps engineer
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
              <CardContent>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="group relative"
                    >
                      <div className="glass-dark border-white/20 dark:border-white/20 border-gray-200/20 rounded-xl p-6 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 relative flex-shrink-0">
                            {(edu.logo || edu.logoLight || edu.logoDark) ? (
                              <Image
                                src={
                                  actualTheme === 'dark' && edu.logoDark
                                    ? edu.logoDark
                                    : actualTheme === 'light' && edu.logoLight
                                    ? edu.logoLight
                                    : edu.logo || edu.logoLight || edu.logoDark || '/images/placeholder.png'
                                }
                                alt={`${edu.institution} logo`}
                                fill
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                              {edu.degree}
                            </h4>
                            <p className="text-muted-foreground text-sm mb-3">
                              {edu.institution}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="glass-dark text-xs px-2 py-1 border-gray-300/50 dark:border-white/20">
                                {edu.year}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>
                  ))}
                </div>
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
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Award className="h-6 w-6 text-primary" />
                  Certifications
                </CardTitle>
                <CardDescription className="text-base">
                  Professional certifications and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {profile.certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="group relative h-full"
                    >
                      <div className="glass-dark border-white/20 dark:border-white/20 border-gray-200/20 rounded-xl p-6 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 h-full flex flex-col">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 relative flex-shrink-0">
                            {(cert.logo || cert.logoLight || cert.logoDark) ? (
                              <Image
                                src={
                                  actualTheme === 'dark' && cert.logoDark
                                    ? cert.logoDark
                                    : actualTheme === 'light' && cert.logoLight
                                    ? cert.logoLight
                                    : cert.logo || cert.logoLight || cert.logoDark || '/images/placeholder.png'
                                }
                                alt={`${cert.issuer} logo`}
                                fill
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
                                <Award className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col h-full">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                {cert.name}
                              </h4>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
                                {cert.issuer}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                              <Badge 
                                variant="outline" 
                                className="glass-dark text-xs px-2 py-1 border-gray-300/50 dark:border-white/20"
                              >
                                {cert.year}
                              </Badge>
                              {cert.expired && (
                                <Badge 
                                  variant="outline" 
                                  className="glass-dark text-xs px-2 py-1 bg-red-500/20 text-red-400 border-red-500/30"
                                >
                                  Expired
                                </Badge>
                              )}
                              {!cert.expired && (
                                <Badge 
                                  variant="outline" 
                                  className="glass-dark text-xs px-2 py-1 bg-green-500/20 text-green-400 border-green-500/30"
                                >
                                  Active
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>
                  ))}
                </div>
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
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="h-6 w-6 text-primary" />
                Languages
              </CardTitle>
              <CardDescription className="text-base">
                Languages I speak and work in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profile.languages.map((lang, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group relative"
                  >
                    <div className="glass-dark border-white/20 dark:border-white/20 border-gray-200/20 rounded-xl p-6 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 h-full flex flex-col items-center text-center">
                      <div className="w-16 h-16 relative mb-4 group-hover:scale-110 transition-transform duration-300">
                        {lang.flag ? (
                          <Image
                            src={lang.flag}
                            alt={`${lang.country} flag`}
                            fill
                            className="object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
                            <Globe className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-lg mb-4 group-hover:text-primary transition-colors duration-300">
                        {lang.name}
                      </h4>
                      
                      <div className="mt-auto">
                        <Badge 
                          variant="outline" 
                          className="glass-dark border-gray-300/50 dark:border-white/20 text-xs px-3 py-1"
                        >
                          {lang.level}
                        </Badge>
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </motion.div>
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
                    maintainability for future DevOps engineers.
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
