'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Users, 
  Building, 
  Briefcase,
  CheckCircle,
  Code,
  Award,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getExperienceBySlug, getAllExperiences } from '@/lib/data';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface ExperienceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const resolvedParams = use(params);
  const experience = getExperienceBySlug(resolvedParams.slug);
  const allExperiences = getAllExperiences();

  if (!experience) {
    notFound();
  }

  const currentIndex = allExperiences.findIndex(exp => exp.slug === resolvedParams.slug);
  const prevExperience = currentIndex > 0 ? allExperiences[currentIndex - 1] : null;
  const nextExperience = currentIndex < allExperiences.length - 1 ? allExperiences[currentIndex + 1] : null;

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            {experience.logo && (
              <div className="w-16 h-16 rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center">
                <Image
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="text-gradient">{experience.position}</span>
              </h1>
              <h2 className="text-xl text-muted-foreground">{experience.company}</h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              {experience.employmentType}
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              {experience.duration}
            </Badge>
            {experience.isCurrent && (
              <Badge variant="default" className="text-sm px-4 py-2 bg-green-500/20 text-green-400 border-green-500/30">
                <Clock className="h-3 w-3 mr-1" />
                Current
              </Badge>
            )}
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {experience.description}
          </p>

          {experience.website && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group"
            >
              <a 
                href={experience.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Visit Company Website
              </a>
            </Button>
          )}
        </motion.div>

        {/* Experience Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Card className="glass-dark border-white/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Key Responsibilities
                  </CardTitle>
                  <CardDescription>
                    Main duties and responsibilities in this role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {experience.responsibilities.map((responsibility, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{responsibility}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Card className="glass-dark border-white/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Award className="h-5 w-5 text-primary" />
                    Key Achievements
                  </CardTitle>
                  <CardDescription>
                    Notable accomplishments and impact made
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {experience.achievements.map((achievement, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                        className="flex items-start gap-3"
                      >
                        <Award className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Card className="glass-dark border-white/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experience.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{experience.location}</span>
                    </div>
                  )}
                  {experience.teamSize && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Team Size: {experience.teamSize}</span>
                    </div>
                  )}
                  {experience.industry && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{experience.industry}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{experience.duration}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills & Technologies */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Card className="glass-dark border-white/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Code className="h-5 w-5 text-primary" />
                    Skills & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((item, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-primary/10 border-primary/20 text-primary"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-4"
        >
          {prevExperience ? (
            <Button
              asChild
              variant="outline"
              className="group"
            >
              <Link href={`/about/${prevExperience.slug}`} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                {prevExperience.company}
              </Link>
            </Button>
          ) : null}

          {/* Back to About Button */}
          <Button
            asChild
            variant="outline"
            className="group"
          >
            <Link href="/about">
              Back to About
            </Link>
          </Button>

          {nextExperience ? (
            <Button
              asChild
              variant="outline"
              className="group"
            >
              <Link href={`/about/${nextExperience.slug}`} className="flex items-center gap-2">
                {nextExperience.company}
                <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
