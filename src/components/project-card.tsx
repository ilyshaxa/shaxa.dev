'use client';

import { Calendar, ArrowRight, Star, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project, generateProjectSlug, getExperienceSlugByCompany } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

interface ProjectCardProps {
  project: Project;
  index?: number;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  // Use the predefined slug or generate a consistent one
  const projectSlug = project.slug || generateProjectSlug(project.title);
  const { theme } = useTheme();
  
  // Choose image based on theme
  const coverImage = theme === 'light' && project.coverImageLight 
    ? project.coverImageLight 
    : project.coverImage;

  
  return (
    <div className="group h-full">
      <Card className={`
        glass-dark border border-gray-300/40 dark:border-white/20 
        hover:border-gray-400/60 dark:hover:border-white/40 
        hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-black/20 
        transition-all duration-300 h-full overflow-hidden 
        relative
        ${featured ? 'lg:col-span-1' : ''}
      `}>
        {/* Project Cover Image */}
        <div className="relative h-56 overflow-hidden">
          <Link href={`/projects/${projectSlug}`} className="block w-full h-full group/image">
            <Image
              src={coverImage}
              alt={project.title}
              fill
              className="object-contain transition-transform duration-500 group-hover/image:scale-110 cursor-pointer"
              style={{ transform: 'scale(1.1)' }}
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          {/* Badges - Symmetric Positioning */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
            {/* Featured Badge */}
            {featured && (
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-lg backdrop-blur-sm">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            
            {/* Status Badge - Always positioned on the right */}
            <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border-0 shadow-lg backdrop-blur-sm ml-auto">
              {project.status}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-3">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              {project.title}
            </CardTitle>
            
            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{project.year}</span>
              </div>
              {project.companyName && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {(() => {
                    const experienceSlug = getExperienceSlugByCompany(project.companyName);
                    return experienceSlug ? (
                      <Link 
                        href={`/about/${experienceSlug}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {project.companyName}
                      </Link>
                    ) : (
                      <Link 
                        href="/about#experience" 
                        className="text-primary hover:underline font-medium"
                      >
                        {project.companyName}
                      </Link>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
          
          {/* Description */}
          <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {project.shortDescription}
          </CardDescription>
          
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((tech, techIndex) => (
              <Badge
                key={techIndex}
                variant="outline"
                className="text-xs px-2 py-1 border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 6 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{project.technologies.length - 6} more
              </Badge>
            )}
          </div>
        </div>
        
        {/* Footer - Learn More Button Only */}
        <CardFooter className="p-6 pt-0">
          <Button
            asChild
            variant="default"
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 font-medium"
          >
            <Link href={`/projects/${projectSlug}`} className="flex items-center justify-center">
              Read More
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}