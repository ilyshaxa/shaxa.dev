'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Building2, ZoomIn, ZoomOut, RotateCcw, Maximize, X, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllProjects, generateProjectSlug, localizeProjects } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations, useMessages } from 'next-intl';

export default function ProjectPage() {
  const t = useTranslations('projects');
  const params = useParams();
  const slug = params.slug as string;
  const baseProjects = getAllProjects();
  const messages = useMessages();
  const projects = useMemo(() => localizeProjects(baseProjects, messages), [baseProjects, messages]);
  
  // Find project by slug
  const project = projects.find(p => 
    p.slug === slug || generateProjectSlug(p.title) === slug
  );

  if (!project) {
    notFound();
  }

  const { theme } = useTheme();
  
  // Choose media based on theme and type
  const isVideo = project.isVideo;
  const expandedMedia = isVideo 
    ? (theme === 'light' && project.expandedVideoLight 
        ? project.expandedVideoLight 
        : (project.expandedVideo || project.expandedImage || project.coverImage))
    : (theme === 'light' && project.expandedImageLight 
        ? project.expandedImageLight 
        : (project.expandedImage || project.coverImage));

  // Interactive image state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showCustomControls, setShowCustomControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Video autoplays, so start with playing state
  const imageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };


  // Sync video muted state and track playing state
  useEffect(() => {
    const video = videoRef.current;
    if (video && isVideo) {
      video.muted = isMuted;
      
      // Sync initial playing state
      setIsPlaying(!video.paused);
      
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [isMuted, isVideo]);

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

    // Prevent scrolling on wheel events when fullscreen
    const handleWheelFullscreen = (e: WheelEvent) => {
      if (isFullscreen) {
        e.preventDefault();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('wheel', handleWheelFullscreen, { passive: false });
      
      // Prevent body scroll when in fullscreen - use both overflow and position
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      // Push a state to intercept back navigation
      window.history.pushState({ fullscreen: true }, '', window.location.href);
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('wheel', handleWheelFullscreen);
      
      // Cleanup on unmount
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
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

          {/* Project Layout - Different for Video vs Image projects */}
          {isVideo ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Section - Expanded */}
              <div 
                className="relative w-full"
                style={{ height: 'calc(100vh - 200px)' }}
                onMouseEnter={() => setShowCustomControls(true)}
                onMouseLeave={() => setShowCustomControls(false)}
              >
                <video
                  key={expandedMedia}
                  ref={videoRef}
                  src={expandedMedia}
                  className="w-full h-full object-contain"
                  controls={!showCustomControls}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                />
                
                 {/* Custom Controls Overlay - Center */}
                 <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                   showCustomControls 
                     ? 'opacity-100 scale-100' 
                     : 'opacity-0 scale-95'
                 }`}>
                   <div className="flex gap-3">
                     <Button
                       onClick={togglePlayPause}
                       size="sm"
                       variant="outline"
                       className="bg-transparent hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-none hover:backdrop-blur-md border border-white/30 dark:border-white/30 hover:border-white/50 dark:hover:border-white/50 hover:scale-110 hover:shadow-lg hover:shadow-white/20 dark:hover:shadow-black/20 transition-all duration-300 group"
                     >
                       {isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
                     </Button>
                     
                     <Button
                       onClick={toggleMute}
                       size="sm"
                       variant="outline"
                       className="bg-transparent hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-none hover:backdrop-blur-md border border-white/30 dark:border-white/30 hover:border-white/50 dark:hover:border-white/50 hover:scale-110 hover:shadow-lg hover:shadow-white/20 dark:hover:shadow-black/20 transition-all duration-300 group"
                     >
                       {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
                     </Button>
                   </div>
                 </div>
              </div>

              {/* Project Details Section - Compact */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('aboutProject')}</h3>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {project.fullDescription}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('technologies')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="glass-dark text-sm px-3 py-1 border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Links - Only show if at least one link exists */}
                {(project.liveUrl || project.githubUrl) && (
                  <div className="glass-dark p-4 rounded-lg space-y-3 border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 transition-all duration-200">
                    <h3 className="font-semibold">{t('projectLinks')}</h3>
                    <div className="space-y-2">
                      {project.liveUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full justify-start bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-105 hover:shadow-md hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                        >
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {t('liveDemo')}
                          </a>
                        </Button>
                      )}

                      {project.githubUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full justify-start bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-105 hover:shadow-md hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                        >
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            {t('viewCode')}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Interactive Project Image */}
              <div 
                data-image-container
                className="relative h-96 lg:h-[500px] overflow-hidden rounded-lg border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 backdrop-blur-sm bg-white/5 dark:bg-black/5 shadow-lg shadow-gray-200/20 dark:shadow-black/20 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onWheel={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
              >
            {!isVideo && (
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
                  src={expandedMedia}
                  alt={project.title}
                  fill
                  className="object-contain"
                  draggable={false}
                />
              </div>
            )}
            
            {/* Image Controls - Only for non-video images */}
            {!isVideo && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                    onClick={zoomOut}
                    size="sm"
                    variant="outline"
                    className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={zoomIn}
                    size="sm"
                    variant="outline"
                    className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={resetImage}
                    size="sm"
                    variant="outline"
                    className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="outline"
                    className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
              </div>
            )}

            {/* Zoom Level Indicator - Only for non-video images */}
            {!isVideo && (
              <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-gray-300/50 dark:border-white/20 shadow-sm">
                {Math.round(scale * 100)}%
              </div>
            )}
              </div>

              {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">{t('aboutProject')}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.fullDescription}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('technologies')}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="glass-dark text-sm px-3 py-1 border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200"
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
              <div className="glass-dark p-4 rounded-lg border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 transition-all duration-200">
                <h3 className="font-semibold mb-2">{t('status.title')}</h3>
                <Badge 
                  variant={
                    project.status === 'Completed' 
                      ? 'default' 
                      : project.status === 'Discontinued'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className="text-sm border border-gray-300/50 dark:border-white/20 shadow-sm"
                >
                  {project.status}
                </Badge>
              </div>

                  {/* Project Links - Only show if at least one link exists */}
                  {(project.liveUrl || project.githubUrl) && (
                    <div className="glass-dark p-4 rounded-lg space-y-3 border border-gray-300/40 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/40 transition-all duration-200">
                      <h3 className="font-semibold">{t('projectLinks')}</h3>
                      <div className="space-y-2">
                        {project.liveUrl && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full justify-start bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-105 hover:shadow-md hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                          >
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {t('liveDemo')}
                            </a>
                          </Button>
                        )}

                        {project.githubUrl && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full justify-start bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-105 hover:shadow-md hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                          >
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-2" />
                              {t('viewCode')}
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
            </div>
          </div>
            </>
          )}

          {/* Back Button - Bottom Center */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={isFullscreen ? () => setIsFullscreen(false) : undefined}
              asChild={!isFullscreen}
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-105 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
            >
              {isFullscreen ? (
                <>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('exitFullscreen')}
                </>
              ) : (
                <Link href="/projects">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('backToProjects')}
                </Link>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className={`fixed inset-0 z-[100] backdrop-blur-sm flex items-center justify-center ${
            theme === 'light' 
              ? 'bg-white/95' 
              : 'bg-black/95'
          }`}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              onClick={() => setIsFullscreen(false)}
              size="sm"
              variant="outline"
              className="absolute top-4 right-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-[110] border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
              aria-label={t('exitFullscreen')}
            >
              <X className="h-4 w-4" />
            </Button>
            
                {/* Fullscreen Media Container */}
                {isVideo ? (
                  <div className="relative w-full h-full max-w-7xl max-h-[90vh] select-none">
                    <div className="text-center py-20">
                      <p className="text-muted-foreground">{t('fullscreenNotAvailable')}</p>
                    </div>
                  </div>
                ) : (
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
                      src={expandedMedia}
                      alt={project.title}
                      fill
                      className="object-contain"
                      draggable={false}
                    />
                  </div>
                )}
            
                {/* Fullscreen Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-[110]">
                  {!isVideo && (
                <>
                  <Button
                    onClick={zoomOut}
                    size="sm"
                    variant="outline"
                    className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={zoomIn}
                    size="sm"
                    variant="outline"
                    className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={resetImage}
                    size="sm"
                    variant="outline"
                    className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setIsFullscreen(false)}
                    size="sm"
                    variant="outline"
                    className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-300/50 dark:border-white/20 hover:border-gray-400/70 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 transition-all duration-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t('exitFullscreen')}
                  </Button>
                </>
              )}
            </div>

            {/* Fullscreen Zoom Indicator - Only for non-video images */}
            {!isVideo && (
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-gray-300/50 dark:border-white/20 shadow-sm z-[110]">
                {Math.round(scale * 100)}%
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
