'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Building2, ZoomIn, ZoomOut, RotateCcw, Maximize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllProjects } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const projects = getAllProjects();
  
  // Find project by slug
  const project = projects.find(p => 
    p.slug === slug || p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
  );

  if (!project) {
    notFound();
  }

  // Interactive image state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    // Disable page scrolling when mouse enters image area
    document.body.style.overflow = 'hidden';
  };

  const handleMouseLeave = () => {
    // Re-enable page scrolling when mouse leaves image area
    document.body.style.overflow = 'unset';
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.5), 3);
    setScale(newScale);
  };

  const resetImage = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale(Math.min(scale * 1.2, 3));
  };

  const zoomOut = () => {
    setScale(Math.max(scale * 0.8, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle Escape key and browser back navigation to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (isFullscreen) {
        e.preventDefault();
        setIsFullscreen(false);
        // Push a new state to prevent actual navigation
        window.history.pushState(null, '', window.location.href);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('popstate', handlePopState);
      // Prevent body scroll when in fullscreen
      document.body.style.overflow = 'hidden';
      // Push a state to intercept back navigation
      window.history.pushState({ fullscreen: true }, '', window.location.href);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >

          {/* Project Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="text-gradient">{project.title}</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {project.year}
              </div>
              {project.companyName && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <Link 
                    href="/about#experience" 
                    className="text-primary hover:underline"
                  >
                    {project.companyName}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Project Image */}
          <div 
            data-image-container
            className="relative h-96 lg:h-[500px] overflow-hidden rounded-lg border border-gray-200/20 dark:border-white/20"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onWheel={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            <div
              ref={imageRef}
              className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <Image
                src={project.expandedImage || project.coverImage}
                alt={project.title}
                fill
                className="object-contain"
                draggable={false}
              />
            </div>
            
            {/* Image Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={zoomOut}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                onClick={zoomIn}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                onClick={resetImage}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                onClick={toggleFullscreen}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Zoom Level Indicator */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {Math.round(scale * 100)}%
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.fullDescription}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="glass-dark text-sm px-3 py-1"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Status */}
              <div className="glass-dark p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Status</h3>
                <Badge 
                  variant={project.status === 'Completed' ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {project.status}
                </Badge>
              </div>

              {/* Project Links */}
              <div className="glass-dark p-4 rounded-lg space-y-3">
                <h3 className="font-semibold">Project Links</h3>
                <div className="space-y-2">
                  {project.liveUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 border-gray-200/50 dark:border-white/20"
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  
                  {project.githubUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 border-gray-200/50 dark:border-white/20"
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Back Button - Bottom Center */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={isFullscreen ? () => setIsFullscreen(false) : undefined}
              asChild={!isFullscreen}
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black border-gray-200/50 dark:border-white/20 shadow-sm"
            >
              {isFullscreen ? (
                <>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <Link href="/projects">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Link>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              onClick={() => setIsFullscreen(false)}
              size="sm"
              variant="outline"
              className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Fullscreen Image Container */}
            <div
              className="relative w-full h-full max-w-7xl max-h-[90vh] cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <Image
                src={project.expandedImage || project.coverImage}
                alt={project.title}
                fill
                className="object-contain"
                draggable={false}
              />
            </div>
            
            {/* Fullscreen Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                onClick={zoomOut}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                onClick={zoomIn}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                onClick={resetImage}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsFullscreen(false)}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Exit
              </Button>
            </div>
            
            {/* Fullscreen Zoom Indicator */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {Math.round(scale * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
