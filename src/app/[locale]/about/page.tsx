'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale, useMessages } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Globe, Code, Heart, User, MapPin, Users, Building } from 'lucide-react';
import Image from 'next/image';
import { getProfile, getAllExperiences, localizeExperiences, localizeEducation } from '@/lib/data';
import { useTheme } from '@/components/theme-provider';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const profile = getProfile();
  const baseExperiences = getAllExperiences();
  const messages = useMessages();
  const experiences = useMemo(() => localizeExperiences(baseExperiences, messages), [baseExperiences, messages]);
  const localizedEducation = useMemo(() => localizeEducation(profile.education, messages), [profile.education, messages]);
  const { actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('about');
  const tProfile = useTranslations('profile');
  const locale = useLocale();

  // Helper function to get localized industry
  const getLocalizedIndustry = (industry: string): string => {
    const profileMessages = messages as Record<string, unknown>;
    const profile = profileMessages?.profile as Record<string, unknown> | undefined;
    const industries = profile?.industries as Record<string, string> | undefined;
    return industries?.[industry] || industry;
  };

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
            <span className="text-gradient">{t('title')}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
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
                {t('sections.bio.title')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('sections.bio.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  {tProfile('bio')}
                </p>
                <p className="text-lg leading-relaxed">
                  {t('sections.bio.additionalText')}
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
              <span className="text-gradient">{t('sections.experience.title')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('sections.experience.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group h-full"
              >
                <Link href={`/${locale}/about/${exp.slug}`} className="block h-full">
                  <Card className="glass-dark border-gray-200/20 dark:border-white/20 hover:border-primary/30 dark:hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/10 h-full cursor-pointer group relative overflow-hidden flex flex-col">
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Header - Fixed structure */}
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-3.5 mb-3">
                        {exp.logo && (
                          <div className="w-12 h-12 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 p-1.5">
                            <Image
                              src={exp.logo}
                              alt={`${exp.company} logo`}
                              width={32}
                              height={32}
                              className="object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-semibold mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[2.5rem] leading-tight">
                            {exp.position}
                          </CardTitle>
                          <CardDescription className="text-sm font-medium text-muted-foreground line-clamp-1">
                            {exp.company}
                          </CardDescription>
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs px-2.5 py-1 font-medium">
                          {(() => {
                            const typeMap: Record<string, string> = {
                              'Full-time': 'fullTime',
                              'Part-time': 'partTime',
                              'Contract': 'contract',
                              'Freelance': 'freelance',
                              'Internship': 'internship'
                            };
                            const key = typeMap[exp.employmentType] || 'fullTime';
                            try {
                              return t(`employmentTypes.${key}` as 'employmentTypes.fullTime');
                            } catch {
                              return exp.employmentType;
                            }
                          })()}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2.5 py-1 font-medium">
                          {exp.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    {/* Content - Flexible with consistent spacing */}
                    <CardContent className="pt-0 pb-4 flex-1 flex flex-col">
                      {/* Description - Fixed height for consistency */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 min-h-[3.75rem]">
                        {exp.description}
                      </p>
                      
                      {/* Key Skills Section */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
                          {t('sections.experience.keySkills')}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.slice(0, 5).map((skill, skillIndex) => (
                            <Badge 
                              key={skillIndex}
                              variant="outline" 
                              className="text-xs px-2.5 py-0.5 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {exp.technologies.length > 5 && (
                            <Badge variant="outline" className="text-xs px-2.5 py-0.5 text-muted-foreground border-muted-foreground/30">
                              +{exp.technologies.length - 5}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Spacer to push footer to bottom */}
                      <div className="flex-1" />

                      {/* Footer Info - Always at bottom */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3.5 mt-auto border-t border-white/10">
                        {exp.location && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{exp.location}</span>
                          </div>
                        )}
                        {exp.teamSize && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                            <Users className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{exp.teamSize}</span>
                          </div>
                        )}
                        {exp.industry && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">{getLocalizedIndustry(exp.industry)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
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
              <span className="text-gradient">{t('sections.education.title')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('sections.education.subtitle')}
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
                  {t('sections.education.educationTab')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('sections.education.educationSubtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 items-stretch ${
                  localizedEducation.length === 1 
                    ? 'grid-cols-1' 
                    : localizedEducation.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {localizedEducation.map((edu, index) => (
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
                  {t('sections.education.certificationsTab')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('sections.education.certificationsSubtitle')}
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
                          {t('sections.education.comingSoon')}
                        </p>
                        <p className="text-muted-foreground/70 text-center text-sm mt-2">
                          {t('sections.education.comingSoonDesc')}
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
              <span className="text-gradient">{t('sections.skills.title')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('sections.skills.subtitle')}
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
                  {t('sections.skills.technicalSkills')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('sections.skills.technicalSkillsSubtitle')}
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
                  {t('sections.skills.languages')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('sections.skills.languagesSubtitle')}
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
                            {(() => {
                              try {
                                return tProfile(`languages.${lang.name}` as 'languages.English');
                              } catch {
                                return lang.name;
                              }
                            })()}
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
              <span className="text-gradient">{t('sections.values.title')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('sections.values.subtitle')}
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
                    {t('sections.values.codeQuality.title')}
                  </h4>
                  <p className="text-muted-foreground">
                    {t('sections.values.codeQuality.description')}
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
                    {t('sections.values.userCentric.title')}
                  </h4>
                  <p className="text-muted-foreground">
                    {t('sections.values.userCentric.description')}
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
                    {t('sections.values.continuousLearning.title')}
                  </h4>
                  <p className="text-muted-foreground">
                    {t('sections.values.continuousLearning.description')}
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
                    {t('sections.values.collaboration.title')}
                  </h4>
                  <p className="text-muted-foreground">
                    {t('sections.values.collaboration.description')}
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
              <span className="text-gradient">{t('sections.funFacts.title')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('sections.funFacts.subtitle')}
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
                  <h4 className="font-semibold text-lg">{t('sections.funFacts.linux.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('sections.funFacts.linux.description')}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.0, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg">{t('sections.funFacts.fitness.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('sections.funFacts.fitness.description')}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.1, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg">{t('sections.funFacts.gaming.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('sections.funFacts.gaming.description')}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg">{t('sections.funFacts.learner.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('sections.funFacts.learner.description')}
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
