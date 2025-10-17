'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin, ExternalLink, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/project-card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { ParallaxSection } from '@/components/parallax-section';
import { TypewriterEffect } from '@/components/typewriter-effect';
import { ScrollToTop } from '@/components/scroll-to-top';
import { getProfile, getFeaturedProjects } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const profile = getProfile();
  const featuredProjects = getFeaturedProjects();
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  
  const visibleExperiences = showAllExperiences ? profile.experience : profile.experience.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative w-80 h-80 mx-auto"
            >
              <div className="absolute inset-0 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border-4 border-gray-300/30 dark:border-white/20 animate-pulse-slow" />
              <div className="absolute inset-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border-2 border-primary/30 animate-pulse-slow" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-4 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-primary/50 animate-pulse-slow" style={{ animationDelay: '2s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/profile.jpg"
                  alt="Shaxriyor Jabborov"
                  width={270}
                  height={270}
                  className="rounded-full object-cover"
                  quality={100}
                  priority
                />
              </div>
            </motion.div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
                <span className="text-gradient">{profile.name}</span>
              </h1>
              <div className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto h-8">
                <TypewriterEffect
                  texts={[
                    "DevOps Engineer",
                    "Observability & Monitoring Expert",
                    "AWS Certified",
                    "AI & Machine Learning Enthusiast",
                    "Cloud Engineer"
                  ]}
                  speed={100}
                  deleteSpeed={50}
                  pauseTime={2000}
                  className="text-center"
                />
              </div>
              <motion.div 
                className="flex items-center justify-center gap-2 text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              {profile.bio}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                variant="glass"
              >
                <a href={profile.cvUrl} download>
                  <Download className="h-5 w-5 mr-2" />
                  Download CV
                </a>
              </Button>
              
            </motion.div>
            
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Skills & Technologies</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive DevOps toolkit for modern infrastructure
            </p>
          </ScrollReveal>
          
          {/* Compact Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <ScrollReveal
                  key={category}
                  direction="up"
                  delay={categoryIndex * 0.1}
                  className="group"
                >
                  <Card className="glass-dark border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-300 h-full overflow-hidden relative">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${categoryColor}`} />
                        <CardTitle className="text-lg font-semibold capitalize text-foreground">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </CardTitle>
                      </div>
                    </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skillIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: categoryIndex * 0.1 + skillIndex * 0.05, 
                            duration: 0.3 
                          }}
                          whileHover={{ scale: 1.05 }}
                          className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 hover:border-primary/40 transition-all duration-200"
                        >
                          {skill}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 mt-16 mb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              My professional journey and key achievements
            </p>
          </motion.div>
          
          {/* Compact Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {visibleExperiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="glass-dark border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-300 h-full overflow-hidden relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      {exp.logo && (
                        <div className="w-12 h-12 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                          <Image
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{exp.position}</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <CardDescription className="text-sm font-medium">{exp.company}</CardDescription>
                          {exp.website && (
                            <a
                              href={exp.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Visit
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {exp.employmentType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exp.duration}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 font-medium"
                    >
                      <Link href={`/about/${exp.slug}`} className="flex items-center justify-center">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {profile.experience.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Button
                onClick={() => setShowAllExperiences(!showAllExperiences)}
                variant="glass"
                className="group"
              >
                {showAllExperiences ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Show All ({profile.experience.length - 3} more)
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      <ParallaxSection speed={0.3} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Featured Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A showcase of my recent work and side projects
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ScrollReveal
                key={project.title}
                direction="up"
                delay={index * 0.2}
                className="group"
              >
                <div className="h-full">
                  <ProjectCard
                    project={project}
                    index={index}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal direction="up" delay={0.6} className="text-center mt-12 mb-12 sm:mb-0">
            <Button
              asChild
              size="lg"
              variant="glass"
              className="group"
            >
              <Link href="/projects" className="flex items-center gap-2">
                View All Projects
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </ParallaxSection>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up" className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              <span className="text-gradient">Let&apos;s Work Together</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I&apos;m always interested in new opportunities and exciting projects. 
              Let&apos;s discuss how we can collaborate!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="glass"
              >
                <a href="/contact">
                  Get In Touch
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-foreground"
              >
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
