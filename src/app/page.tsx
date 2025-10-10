'use client';

import { motion } from 'framer-motion';
import { Download, Key, Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkillBadge } from '@/components/skill-badge';
import { ProjectCard } from '@/components/project-card';
import { Chatbot } from '@/components/chatbot';
import { ScrollReveal } from '@/components/scroll-reveal';
import { ParallaxSection } from '@/components/parallax-section';
import { TypewriterEffect } from '@/components/typewriter-effect';
import { ScrollToTop } from '@/components/scroll-to-top';
import { getProfile, getFeaturedProjects } from '@/lib/data';
import Image from 'next/image';

export default function Home() {
  const profile = getProfile();
  const featuredProjects = getFeaturedProjects();

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
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative w-40 h-40 mx-auto"
            >
              <div className="absolute inset-0 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border-4 border-gray-300/30 dark:border-white/20 animate-pulse-slow" />
              <div className="absolute inset-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border-2 border-primary/30 animate-pulse-slow" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-4 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-primary/50 animate-pulse-slow" style={{ animationDelay: '2s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/profile.svg"
                  alt="Shaxriyor Jabborov"
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
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
                    "Full-Stack Developer & Software Engineer",
                    "React & Next.js Specialist",
                    "AI & Machine Learning Enthusiast",
                    "UI/UX Design Expert",
                    "Open Source Contributor"
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
                className="glass-dark hover:bg-white/20"
              >
                <a href={profile.cvUrl} download>
                  <Download className="h-5 w-5 mr-2" />
                  Download CV
                </a>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-dark hover:bg-white/10"
              >
                <a href={profile.sshKeyUrl} download>
                  <Key className="h-5 w-5 mr-2" />
                  SSH Key
                </a>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex justify-center gap-4 pt-4"
            >
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="glass-dark hover:bg-white/10"
              >
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="glass-dark hover:bg-white/10"
              >
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="glass-dark hover:bg-white/10"
              >
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="glass-dark hover:bg-white/10"
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-5 w-5" />
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
              A comprehensive toolkit for building modern web applications
            </p>
          </ScrollReveal>
          
          <div className="space-y-16">
            {Object.entries(profile.skills).map(([category, skills], categoryIndex) => (
              <ScrollReveal
                key={category}
                direction="up"
                delay={categoryIndex * 0.2}
                className="space-y-8"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold capitalize mb-2 text-gradient">
                    {category}
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: skillIndex * 0.1, 
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 200
                      }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <SkillBadge
                        skill={skill}
                        category={category as 'frontend' | 'backend' | 'tools'}
                        index={skillIndex}
                      />
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <ParallaxSection speed={0.3} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 pb-32">
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
                <motion.div
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="h-full"
                >
                  <ProjectCard
                    project={project}
                    index={index}
                  />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal direction="up" delay={0.6} className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="glass-dark hover:bg-white/20 group"
            >
              <a href="/projects" className="flex items-center gap-2">
                View All Projects
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </a>
            </Button>
          </ScrollReveal>
        </div>
      </ParallaxSection>

      {/* Experience Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 mt-32 mb-16">
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
          
          <div className="space-y-8">
            {profile.experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="glass-dark border-gray-200/20 dark:border-white/20 hover:border-gray-300/40 dark:hover:border-white/40 transition-all duration-300">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-xl">{exp.position}</CardTitle>
                        <CardDescription className="text-lg">{exp.company}</CardDescription>
                      </div>
                      <Badge variant="outline" className="glass-dark mt-2 sm:mt-0">
                        {exp.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                className="glass-dark hover:bg-white/20 dark:hover:bg-white/20"
              >
                <a href="/contact">
                  Get In Touch
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-dark hover:bg-white/10 dark:hover:bg-white/10"
              >
                <a href="/about">
                  Learn More
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer Section - This will fix the overflow issue */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex justify-center space-x-6">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="glass-dark hover:bg-white/10"
              >
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="glass-dark hover:bg-white/10"
              >
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="glass-dark hover:bg-white/10"
              >
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="glass-dark hover:bg-white/10"
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <p className="text-muted-foreground">
              © 2024 {profile.name}. Built with Next.js, TypeScript, and lots of ☕
            </p>
          </motion.div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <Chatbot />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
