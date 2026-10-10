'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { Maximize, Pause, Play, RotateCcw, Volume2, VolumeX, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { clamp, createVelocityTracker, project, rubberbandClamp, spring } from '@/lib/motion';
import { getPanBounds, MAX_ZOOM, MIN_ZOOM, zoomAt, type Point } from '@/lib/pan-zoom';
import { cn } from '@/lib/utils';

type VelocityTracker = ReturnType<typeof createVelocityTracker>;

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  trackX: VelocityTracker;
  trackY: VelocityTracker;
}

function stageSize(element: HTMLElement | null) {
  return { width: element?.clientWidth ?? 0, height: element?.clientHeight ?? 0 };
}

interface ViewerChipProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  children: React.ReactNode;
}

function ViewerChip({ label, onClick, disabled, autoFocus, children }: ViewerChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      aria-label={label}
      title={label}
      className="material-chip flex size-11 items-center justify-center rounded-full text-foreground shadow-sm transition-[scale,opacity] duration-100 active:scale-[0.92] disabled:opacity-40 [&_svg]:size-[18px]"
    >
      {children}
    </button>
  );
}

interface ZoomPanStageProps {
  src: string;
  alt: string;
  layoutId: string;
  /** False while the same image is shown fullscreen, so the shared layout animation has one owner. */
  showImage: boolean;
  sizes: string;
  className?: string;
  priority?: boolean;
  extraControls?: React.ReactNode;
}

function ZoomPanStage({ src, alt, layoutId, showImage, sizes, className, priority = false, extraControls }: ZoomPanStageProps) {
  const t = useTranslations('projects');
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  // Spring to a resting state inside the pan bounds, inheriting any release velocity.
  const settle = useCallback(
    (toScale: number, offset: Point, velocity: Point = { x: 0, y: 0 }) => {
      const bounds = getPanBounds(stageSize(stageRef.current), toScale);
      const hasMomentum = velocity.x !== 0 || velocity.y !== 0;
      animate(scale, toScale, spring.default);
      animate(x, clamp(offset.x, -bounds.x, bounds.x), hasMomentum ? { ...spring.momentum, velocity: velocity.x } : spring.default);
      animate(y, clamp(offset.y, -bounds.y, bounds.y), hasMomentum ? { ...spring.momentum, velocity: velocity.y } : spring.default);
      setZoom(toScale);
    },
    [scale, x, y]
  );

  // Zoom around a point (relative to the stage center), starting from the live on-screen values.
  const zoomTo = (toScale: number, focus: Point = { x: 0, y: 0 }) => {
    const next = clamp(toScale, MIN_ZOOM, MAX_ZOOM);
    settle(next, zoomAt({ x: x.get(), y: y.get() }, focus, scale.get(), next));
  };

  // Ctrl/⌘ + wheel (a trackpad pinch on macOS) zooms 1:1 around the pointer.
  // A plain wheel is left alone, so the page keeps scrolling.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      const focus = { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
      const current = scale.get();
      const next = clamp(current * Math.exp(-event.deltaY * 0.01), MIN_ZOOM, MAX_ZOOM);
      const offset = zoomAt({ x: x.get(), y: y.get() }, focus, current, next);
      const bounds = getPanBounds(stageSize(stage), next);
      scale.jump(next);
      x.jump(clamp(offset.x, -bounds.x, bounds.x));
      y.jump(clamp(offset.y, -bounds.y, bounds.y));
      setZoom(next);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [scale, x, y]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= MIN_ZOOM || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    x.stop();
    y.stop();
    const trackX = createVelocityTracker();
    const trackY = createVelocityTracker();
    trackX.add(event.timeStamp, event.clientX);
    trackY.add(event.timeStamp, event.clientY);
    // Origin = the live position, so the image stays under the finger exactly where it was grabbed.
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: x.get(),
      originY: y.get(),
      trackX,
      trackY,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const size = stageSize(stageRef.current);
    const bounds = getPanBounds(size, scale.get());
    x.set(rubberbandClamp(drag.originX + event.clientX - drag.startX, -bounds.x, bounds.x, size.width));
    y.set(rubberbandClamp(drag.originY + event.clientY - drag.startY, -bounds.y, bounds.y, size.height));
    drag.trackX.add(event.timeStamp, event.clientX);
    drag.trackY.add(event.timeStamp, event.clientY);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    // A release sample makes a pause-then-lift read as zero velocity (no accidental fling).
    drag.trackX.add(event.timeStamp, event.clientX);
    drag.trackY.add(event.timeStamp, event.clientY);
    const velocity = { x: drag.trackX.velocity(), y: drag.trackY.velocity() };
    settle(scale.get(), { x: x.get() + project(velocity.x), y: y.get() + project(velocity.y) }, velocity);
  };

  const onPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    // A cancelled gesture carries no trustworthy release position: settle in place, no fling.
    settle(scale.get(), { x: x.get(), y: y.get() });
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        'relative select-none overflow-hidden rounded-tile bg-secondary contrast-more:border contrast-more:border-foreground/40',
        zoom > MIN_ZOOM && 'cursor-grab active:cursor-grabbing',
        className
      )}
      style={{ touchAction: zoom > MIN_ZOOM ? 'none' : 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {showImage && (
        <motion.div layoutId={layoutId} className="absolute inset-0" transition={spring.default}>
          <motion.div className="absolute inset-0" style={{ x, y, scale }}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              draggable={false}
              className="pointer-events-none object-contain p-4"
            />
          </motion.div>
        </motion.div>
      )}
      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <ViewerChip label={t('zoomOut')} onClick={() => zoomTo(scale.get() / 1.5)} disabled={zoom <= MIN_ZOOM}>
          <ZoomOut />
        </ViewerChip>
        <span className="material-chip flex h-11 min-w-16 items-center justify-center rounded-full px-3 text-caption tabular-nums shadow-sm">
          {Math.round(zoom * 100)}%
        </span>
        <ViewerChip label={t('zoomIn')} onClick={() => zoomTo(scale.get() * 1.5)} disabled={zoom >= MAX_ZOOM}>
          <ZoomIn />
        </ViewerChip>
        <ViewerChip label={t('resetZoom')} onClick={() => settle(MIN_ZOOM, { x: 0, y: 0 })} disabled={zoom === MIN_ZOOM}>
          <RotateCcw />
        </ViewerChip>
        {extraControls}
      </div>
    </div>
  );
}

interface FullscreenViewerProps {
  src: string;
  alt: string;
  layoutId: string;
  onClose: () => void;
}

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

function FullscreenViewer({ src, alt, layoutId, onClose }: FullscreenViewerProps) {
  const t = useTranslations('projects');
  const dialogRef = useRef<HTMLDivElement>(null);
  // Read during the first render, before the exit button's autoFocus moves focus into the dialog.
  const openerRef = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null);

  // Hand focus back to whatever opened the dialog once it is gone.
  useEffect(() => {
    const opener = openerRef.current;
    return () => {
      if (opener?.isConnected) opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      // aria-modal says the page behind is inert; keep Tab inside the dialog to match.
      const dialog = dialogRef.current;
      const controls = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
      if (!dialog || controls.length === 0) return;
      const edge = controls[event.shiftKey ? 0 : controls.length - 1];
      if (document.activeElement === edge || !dialog.contains(document.activeElement)) {
        event.preventDefault();
        controls[event.shiftKey ? controls.length - 1 : 0].focus();
      }
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      <ZoomPanStage
        src={src}
        alt={alt}
        layoutId={layoutId}
        showImage
        sizes="95vw"
        className="h-[90dvh] w-full max-w-[1400px] rounded-none bg-transparent contrast-more:border-0"
        extraControls={
          <ViewerChip label={t('exitFullscreen')} onClick={onClose} autoFocus>
            <X />
          </ViewerChip>
        }
      />
    </div>,
    document.body
  );
}

function VideoViewer({ src, label }: { src: string; label: string }) {
  const t = useTranslations('projects');
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => setIsPlaying(!video.paused);
    sync();
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('ended', sync);
    return () => {
      video.removeEventListener('play', sync);
      video.removeEventListener('pause', sync);
      video.removeEventListener('ended', sync);
    };
  }, [src]);

  // Autoplay is skipped under reduced motion; the play button still starts it.
  useEffect(() => {
    const video = videoRef.current;
    if (video && !reduceMotion) video.play().catch(() => {});
  }, [src, reduceMotion]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(console.error);
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="relative h-96 overflow-hidden rounded-tile bg-secondary contrast-more:border contrast-more:border-foreground/40 lg:h-[500px]">
      <video
        key={src}
        ref={videoRef}
        src={src}
        className="size-full object-contain"
        aria-label={label}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <ViewerChip label={isPlaying ? t('pause') : t('play')} onClick={togglePlay}>
          {isPlaying ? <Pause /> : <Play />}
        </ViewerChip>
        <ViewerChip label={isMuted ? t('unmute') : t('mute')} onClick={toggleMute}>
          {isMuted ? <VolumeX /> : <Volume2 />}
        </ViewerChip>
      </div>
    </div>
  );
}

interface MediaViewerProps {
  src: string;
  alt: string;
  isVideo?: boolean;
}

export function MediaViewer({ src, alt, isVideo = false }: MediaViewerProps) {
  const t = useTranslations('projects');
  const layoutId = useId();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  if (isVideo) return <VideoViewer src={src} label={alt} />;

  return (
    <>
      <ZoomPanStage
        src={src}
        alt={alt}
        layoutId={layoutId}
        showImage={!isFullscreen}
        sizes="(max-width: 1200px) 100vw, 1200px"
        priority
        className="h-96 lg:h-[500px]"
        extraControls={
          <ViewerChip label={t('enterFullscreen')} onClick={() => setIsFullscreen(true)}>
            <Maximize />
          </ViewerChip>
        }
      />
      <AnimatePresence>
        {isFullscreen && (
          <FullscreenViewer key="fullscreen" src={src} alt={alt} layoutId={layoutId} onClose={closeFullscreen} />
        )}
      </AnimatePresence>
    </>
  );
}
