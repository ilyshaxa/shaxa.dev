'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Globe, Code, Heart, User, MapPin, Users, Building } from 'lucide-react';
import Image from 'next/image';
import { getProfile, getAllExperiences } from '@/lib/data';
import { useTheme } from '@/components/theme-provider';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const profile = getProfile();
  const experiences = getAllExperiences();
  const { actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Filter out Planned and Expired certifications
  const activeCertifications = profile.certifications.filter(
    cert => cert.status !== 'Planned' && cert.status !== 'Expired'
  );

  useEffect(() => {
    setMounted(true);
  }, []);

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
          className="mb-20"
        >
          <Card className="glass-dark border-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <User className="h-6 w-6 text-primary" />
                About Me
              </CardTitle>
              <CardDescription className="text-base">
                My story, passion, and approach to technology
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  {profile.bio}
                </p>
                <p className="text-lg leading-relaxed">
                DevOps engineer with a love for building things that scale and work seamlessly. I focus on creating clean, automated systems that make development and deployment smoother for everyone. Whether it&apos;s designing cloud infrastructure, fine-tuning CI/CD pipelines, or improving reliability across environments, I enjoy solving the tricky problems that keep systems running at their best. Always exploring new tools and better ways to connect code, infrastructure, and people.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Professional Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              My journey through different companies and the skills I&apos;ve gained along the way
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <Link href={`/about/${exp.slug}`}>
                  <Card className="glass-dark border-gray-200/20 dark:border-white/20 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 h-full cursor-pointer group relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        {exp.logo && (
                          <div className="w-14 h-14 rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={exp.logo}
                              alt={`${exp.company} logo`}
                              width={36}
                              height={36}
                              className="object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <CardTitle className="text-lg font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                              {exp.position}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-muted-foreground">
                              {exp.company}
                            </CardDescription>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <Badge variant="secondary" className="text-xs px-2 py-1">
                              {exp.employmentType}
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              {exp.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{exp.description}</p>
                      
                      {/* Key Skills */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.slice(0, 4).map((skill, skillIndex) => (
                            <Badge 
                              key={skillIndex}
                              variant="outline" 
                              className="text-xs px-2.5 py-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {exp.technologies.length > 4 && (
                            <Badge variant="outline" className="text-xs px-2.5 py-1 text-muted-foreground">
                              +{exp.technologies.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10">
                        {exp.location && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                        {exp.teamSize && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>{exp.teamSize}</span>
                          </div>
                        )}
                        {exp.industry && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building className="h-3.5 w-3.5" />
                            <span>{exp.industry}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education & Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Education & Certifications</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              My academic background and professional certifications
            </p>
          </div>
          
          <div className={`grid grid-cols-1 gap-8 ${
            activeCertifications.length > 2 
              ? 'lg:grid-cols-3' 
              : 'lg:grid-cols-2'
          }`}>
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={activeCertifications.length > 2 ? 'lg:col-span-1' : ''}
          >
            <Card className="glass-dark border-gray-200/40 dark:border-white/20 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Education
                </CardTitle>
                <CardDescription className="text-base">
                  My academic background and formal education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 items-stretch ${
                  profile.education.length === 1 
                    ? 'grid-cols-1' 
                    : profile.education.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {profile.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="group relative h-full"
                    >
                      {edu.website ? (
                        <a
                          href={edu.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                          aria-label={`Visit ${edu.institution} website`}
                        >
                          <div className="glass-dark border-gray-200/40 dark:border-white/20 rounded-xl p-6 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 h-full flex flex-col cursor-pointer">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 relative flex-shrink-0">
                                {(edu.logo || edu.logoLight || edu.logoDark) ? (
                                  <Image
                                    src={
                                      mounted && actualTheme === 'dark' && edu.logoDark
                                        ? edu.logoDark
                                        : mounted && actualTheme === 'light' && edu.logoLight
                                        ? edu.logoLight
                                        : edu.logo || edu.logoLight || edu.logoDark || '/images/placeholder.png'
                                    }
                                    alt={`${edu.institution} logo`}
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col h-full">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                                    {edu.degree}
                                  </h4>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    {edu.institution}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mt-auto">
                                  <Badge variant="outline" className="glass-dark text-xs px-2 py-1 border-gray-300/50 dark:border-white/20">
                                    {edu.year}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                        </a>
                      ) : (
                        <div className="glass-dark border-gray-200/40 dark:border-white/20 rounded-xl p-6 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 h-full flex flex-col">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 relative flex-shrink-0">
                              {(edu.logo || edu.logoLight || edu.logoDark) ? (
                                <Image
                                  src={
                                    mounted && actualTheme === 'dark' && edu.logoDark
                                      ? edu.logoDark
                                      : mounted && actualTheme === 'light' && edu.logoLight
                                      ? edu.logoLight
                                      : edu.logo || edu.logoLight || edu.logoDark || '/images/placeholder.png'
                                  }
                                  alt={`${edu.institution} logo`}
                                  fill
                                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
                                  <GraduationCap className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col h-full">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                                  {edu.degree}
                                </h4>
                                <p className="text-muted-foreground text-sm mb-3">
                                  {edu.institution}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-auto">
                                <Badge variant="outline" className="glass-dark text-xs px-2 py-1 border-gray-300/50 dark:border-white/20">
                                  {edu.year}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                      )}
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
            className={activeCertifications.length > 2 ? 'lg:col-span-2' : ''}
          >
            <Card className="glass-dark border-gray-200/40 dark:border-white/20 h-full">
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
                {(() => {
                  // If no active certifications, show a message
                  if (activeCertifications.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <Award className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground text-center text-lg">
                          Certifications coming soon
                        </p>
                        <p className="text-muted-foreground/70 text-center text-sm mt-2">
                          Professional certifications will be displayed here once obtained
                        </p>
                      </div>
                    );
                  }

                  // Display active certifications
                  return (
                    <div className={`grid gap-6 items-stretch ${
                      activeCertifications.length === 1 
                        ? 'grid-cols-1' 
                        : activeCertifications.length === 2 
                        ? 'grid-cols-1 md:grid-cols-2' 
                        : activeCertifications.length === 4
                        ? 'grid-cols-1 md:grid-cols-2'
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {activeCertifications.map((cert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                          className="group relative h-full"
                        >
                          <div className="glass-dark border-gray-200/40 dark:border-white/20 rounded-xl p-6 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 h-full flex flex-col">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 relative flex-shrink-0">
                                {(cert.logo || cert.logoLight || cert.logoDark) ? (
                                  <Image
                                    src={
                                      mounted && actualTheme === 'dark' && cert.logoDark
                                        ? cert.logoDark
                                        : mounted && actualTheme === 'light' && cert.logoLight
                                        ? cert.logoLight
                                        : cert.logo || cert.logoLight || cert.logoDark || '/images/placeholder.png'
                                    }
                                    alt={`${cert.issuer} logo`}
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                                    unoptimized={cert.logo?.includes('british-council')}
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
                                    <Award className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col h-full">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                                    {cert.name}
                                  </h4>
                                  <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
                                    {cert.issuer}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mt-auto">
                                  <Badge 
                                    variant="outline" 
                                    className="glass-dark text-xs px-2 py-1 border-gray-300/50 dark:border-white/20"
                                  >
                                    {cert.year}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={`glass-dark text-xs px-2 py-1 ${
                                      cert.status === 'Planned' 
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        : cert.status === 'Expired'
                                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                                    }`}
                                  >
                                    {cert.status}
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
                  );
                })()}
              </CardContent>
            </Card>
          </motion.div>
          </div>
        </motion.div>

        {/* Skills & Languages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Skills & Languages</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              My technical expertise and language proficiency
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="group"
          >
            <Card className="glass-dark border-gray-200/40 dark:border-white/20 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Code className="h-6 w-6 text-primary" />
                  Technical Skills
                </CardTitle>
                <CardDescription className="text-base">
                  Technologies and tools I work with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {Object.entries(profile.skills).map(([category, skills], categoryIndex) => {
                    // Define unique colors for each category
                    const categoryColors = {
                      cloud: 'bg-blue-500',
                      containers: 'bg-green-500', 
                      infrastructure: 'bg-purple-500',
                      cicd: 'bg-orange-500',
                      monitoring: 'bg-red-500',
                      database: 'bg-pink-500',
                      tools: 'bg-cyan-500'
                    };
                    
                    const categoryColor = categoryColors[category as keyof typeof categoryColors] || 'bg-primary';
                    
                    return (
                      <motion.div 
                        key={category} 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
                      >
                        {/* Simple Category Header */}
                        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                          <div className={`w-3 h-3 rounded-full ${categoryColor}`} />
                          <h4 className="font-semibold text-lg capitalize text-primary">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            ({skills.length})
                          </span>
                        </div>
                        
                        {/* Simple Skills Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {skills.map((skill, skillIndex) => (
                            <motion.div
                              key={skillIndex}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ 
                                delay: categoryIndex * 0.1 + skillIndex * 0.05, 
                                duration: 0.4 
                              }}
                              whileHover={{}}
                              className="group"
                            >
                              <div className="p-3 rounded-lg bg-white/5 dark:bg-black/5 border border-gray-200/40 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200 text-center">
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                                  {skill}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="group"
          >
            <Card className="glass-dark border-gray-200/40 dark:border-white/20 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  Languages
                </CardTitle>
                <CardDescription className="text-base">
                  Languages I speak and work in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {profile.languages.map((lang, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="group/language relative"
                    >
                      <div className="glass-dark border-gray-200/40 dark:border-white/20 rounded-xl p-4 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 flex items-center gap-4 group-hover/language:bg-primary/5">
                        <div className="w-14 h-14 relative flex-shrink-0 group-hover/language:scale-110 transition-transform duration-300 rounded-lg overflow-hidden border border-white/10">
                          {lang.flag ? (
                            <Image
                              src={lang.flag}
                              alt={`${lang.country} flag`}
                              fill
                              className="object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                              <Globe className="h-6 w-6 text-primary" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg group-hover/language:text-primary transition-colors duration-300">
                            {lang.name}
                          </h4>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className="glass-dark border-primary/30 dark:border-primary/30 text-xs px-3 py-1.5 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                        >
                          {lang.level}
                        </Badge>
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/language:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </div>
        </motion.div>

        {/* Values & Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Values & Philosophy</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What drives me and shapes my approach to work
            </p>
          </div>
          <Card className="glass-dark border-white/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Code Quality
                  </h4>
                  <p className="text-muted-foreground">
                    I believe in writing clean, maintainable, and well-documented code. 
                    Good code is not just about functionality, but about readability and 
                    maintainability for future DevOps engineers.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    User-Centric Design
                  </h4>
                  <p className="text-muted-foreground">
                    Every project I work on is designed with the end user in mind. 
                    I focus on creating intuitive, accessible, and delightful experiences 
                    that solve real problems.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Continuous Learning
                  </h4>
                  <p className="text-muted-foreground">
                    Technology evolves rapidly, and I&apos;m committed to staying current 
                    with the latest trends, tools, and best practices in DevOps and cloud infrastructure.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Collaboration
                  </h4>
                  <p className="text-muted-foreground">
                    I believe the best solutions come from collaborative efforts. 
                    I enjoy working with diverse teams and contributing to open-source projects.
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fun Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Fun Facts</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A few things about me outside of coding
            </p>
          </div>
          
          <Card className="glass-dark border-white/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg">🐧 Linux Aficionado</h4>
                  <p className="text-muted-foreground">
                    A passionate Linux main and open-source enthusiast who loves exploring new tools, tweaks, and optimizations.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.0, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg">🏋️ Fitness Focused</h4>
                  <p className="text-muted-foreground">
                    Regular gym sessions keep me grounded, energized, and ready to take on new challenges both in and out of code.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.1, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg">⚔️ Clash Royale Pro</h4>
                  <p className="text-muted-foreground">
                    A competitive Clash Royale player who enjoys strategic gameplay, quick thinking, and perfecting every move.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg">🧠 Lifelong Learner</h4>
                  <p className="text-muted-foreground">
                    Always curious about emerging technologies and new ideas. I love growing my skills one experiment at a time.
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
