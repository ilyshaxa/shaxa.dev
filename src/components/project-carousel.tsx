'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/lib/data';
import { getScrollEdges, type ScrollEdges } from '@/lib/scroll-edges';

// Native scroll-snap: on touch screens and trackpads the OS supplies momentum and rubber-banding.
// Mouse users get arrows that page by the row's visible width.
const arrowClass =
  'flex size-11 items-center justify-center rounded-full bg-black/[0.07] text-foreground transition-[scale,opacity] duration-100 active:scale-[0.94] disabled:pointer-events-none disabled:opacity-35 dark:bg-white/[0.12]';

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const t = useTranslations('home.projects');
  const tCommon = useTranslations('common');
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<ScrollEdges>({ atStart: true, atEnd: true });

  const updateEdges = useCallback(() => {
    const scroller = scrollerRef.current;
    if (scroller) setEdges(getScrollEdges(scroller.scrollLeft, scroller.scrollWidth, scroller.clientWidth));
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateEdges();
    scroller.addEventListener('scroll', updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener('scroll', updateEdges);
      observer.disconnect();
    };
  }, [updateEdges]);

  const page = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  // Fade only the edge that has more content beyond it.
  const mask = `linear-gradient(to right, ${edges.atStart ? '#000' : 'transparent'} 0, #000 48px, #000 calc(100% - 48px), ${edges.atEnd ? '#000' : 'transparent'} 100%)`;

  return (
    <div>
      <div
        ref={scrollerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t('title')}
        tabIndex={0}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-8"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {projects.map((project) => (
          <div key={project.slug ?? project.title} className="w-[85%] shrink-0 snap-start md:w-[45%] lg:w-[calc((100%-2.5rem)/3)]">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      <div className="mt-4 hidden justify-end gap-3 px-4 sm:px-6 md:flex lg:px-8">
        <button type="button" onClick={() => page(-1)} disabled={edges.atStart} aria-label={tCommon('previous')} className={arrowClass}>
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => page(1)} disabled={edges.atEnd} aria-label={tCommon('next')} className={arrowClass}>
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
