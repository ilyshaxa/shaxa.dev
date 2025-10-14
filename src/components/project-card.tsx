'use client';

import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const projectSlug = project.slug || project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group h-full"
    >
      <Card className="glass-dark border-gray-200/20 dark:border-white/20 hover:border-gray-300/40 dark:hover:border-white/40 hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
        {/* Project Cover Image */}
        <div className="relative h-48 overflow-hidden">
          <Link href={`/projects/${projectSlug}`} className="block w-full h-full">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4">
            <Badge 
              variant={project.status === 'Completed' ? 'default' : 'secondary'}
              className="bg-white/90 dark:bg-black/90 backdrop-blur-sm text-gray-900 dark:text-white"
            >
              {project.status}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {project.year}
            </div>
            {project.companyName && (
              <div className="text-sm">
                <Link 
                  href="/about#experience" 
                  className="text-primary hover:underline"
                >
                  {project.companyName}
                </Link>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <CardDescription className="text-base leading-relaxed">
            {project.shortDescription}
          </CardDescription>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech, techIndex) => (
              <Badge
                key={techIndex}
                variant="outline"
                className="glass-dark text-xs"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Link href={`/projects/${projectSlug}`}>
              Learn More
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          
          {project.liveUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 border-gray-200/50 dark:border-white/20"
            >
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          
          {project.githubUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 border-gray-200/50 dark:border-white/20"
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}