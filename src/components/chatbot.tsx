'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, type PanInfo } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ChatConversation, type ChatMessage } from '@/components/chat-conversation';
import { CrossfadeIcon } from '@/components/crossfade-icon';
import { shouldDismiss, spring } from '@/lib/motion';
import { useMediaQuery } from '@/lib/use-media-query';
import { cn } from '@/lib/utils';

const SHEET_HEIGHT_RATIO = 0.85; // matches h-[85dvh]

export function Chatbot() {
  const t = useTranslations('chatbot');
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [isOpen, setIsOpen] = useState(false);
  const [launcherReady, setLauncherReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: '1', content: t('welcome'), isUser: false, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exitVelocity, setExitVelocity] = useState(0);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const dragControls = useDragControls();
  const sheetY = useMotionValue(0);

  // Launcher appears after 2s; welcome popup after 3s, auto-hiding after 8s unless hovered.
  useEffect(() => {
    const timer = setTimeout(() => setLauncherReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showWelcome || isHovering) return;
    const timer = setTimeout(() => setShowWelcome(false), 8000);
    return () => clearTimeout(timer);
  }, [showWelcome, isHovering]);

  const open = () => {
    setExitVelocity(0);
    setIsOpen(true);
    setShowWelcome(false);
  };
  const close = useCallback(() => setIsOpen(false), []);

  // Esc closes; the mobile sheet locks page scroll; focus returns to the launcher after closing.
  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) launcherRef.current?.focus();
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    if (isMobile) root.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, isMobile, close]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), content: text, isUser: true, timestamp: new Date() };
    // History for context excludes the initial welcome message.
    const history = [...messages.slice(1), userMessage].map((message) => ({
      role: message.isUser ? 'user' : 'assistant',
      content: message.content,
    }));
    const reply = (content: string) =>
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), content, isUser: false, timestamp: new Date() }]);

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowWelcome(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      if (response.status === 429) {
        reply(t('errors.tooManyOffTopic'));
        return;
      }
      if (!response.ok) {
        reply(t('errors.generic'));
        return;
      }
      const data = await response.json();
      reply(data.response || t('errors.generic'));
    } catch (error) {
      console.error('Chatbot error:', error);
      reply(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  // Decide from where the flick is heading; hand the release velocity to the exit or snap-back spring.
  const handleSheetDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const sheetHeight = window.innerHeight * SHEET_HEIGHT_RATIO;
    if (shouldDismiss(sheetY.get(), info.velocity.y, sheetHeight * 0.4)) {
      setExitVelocity(info.velocity.y);
      close();
    } else {
      animate(sheetY, 0, { ...spring.momentum, velocity: info.velocity.y });
    }
  };

  const sheetVariants = {
    hidden: (velocity: number) => ({
      y: window.innerHeight,
      transition: velocity > 0 ? { ...spring.momentum, velocity } : spring.default,
    }),
    visible: { y: 0, transition: spring.default },
  };

  const conversationProps = {
    messages,
    isLoading,
    input,
    onInputChange: setInput,
    onSend: sendMessage,
    onClose: close,
  };

  const launcherVisible = launcherReady && !(isOpen && isMobile);

  return (
    <>
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        initial={false}
        animate={{ opacity: launcherVisible ? 1 : 0, scale: launcherVisible ? 1 : 0.9 }}
        whileTap={{ scale: 0.94 }}
        transition={spring.default}
        tabIndex={launcherVisible ? 0 : -1}
        aria-hidden={!launcherVisible}
        aria-label={isOpen ? t('aria.closeChat') : t('aria.openChat')}
        aria-expanded={isOpen}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex size-[52px] items-center justify-center rounded-full bg-primary-fill text-white shadow-[0_8px_24px_rgb(0_0_0/0.18)]',
          !launcherVisible && 'pointer-events-none'
        )}
      >
        <CrossfadeIcon showAlt={isOpen} icon={MessageCircle} altIcon={X} className="size-6" />
      </motion.button>

      {/* Desktop: a parallel panel that grows from the launcher; no scrim, the page stays usable. */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            key="chat-panel"
            role="dialog"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring.default}
            style={{ transformOrigin: 'bottom right' }}
            className="material-sheet fixed bottom-[88px] right-6 z-50 h-[min(560px,calc(100dvh-120px))] w-[360px] overflow-hidden rounded-[24px]"
          >
            <ChatConversation {...conversationProps} autoFocus />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: a modal bottom sheet with a dimming scrim; drag the header down to dismiss. */}
      <AnimatePresence custom={exitVelocity}>
        {isOpen && isMobile && (
          <motion.div
            key="chat-scrim"
            aria-hidden
            className="fixed inset-0 z-[55] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring.default}
            onClick={close}
          />
        )}
        {isOpen && isMobile && (
          <motion.div
            key="chat-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            custom={exitVelocity}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.1 }}
            dragMomentum={false}
            onDragEnd={handleSheetDragEnd}
            style={{ y: sheetY }}
            className="material-sheet fixed inset-x-0 bottom-0 z-[60] h-[85dvh] overflow-hidden rounded-t-[24px] pb-[env(safe-area-inset-bottom)]"
          >
            <ChatConversation
              {...conversationProps}
              showGrabber
              onHeaderPointerDown={(event) => dragControls.start(event)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome notification rises from the launcher. */}
      <AnimatePresence>
        {showWelcome && !isOpen && (
          <motion.div
            key="chat-welcome"
            role="status"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={spring.default}
            style={{ transformOrigin: 'bottom right' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="material-sheet fixed bottom-[88px] right-6 z-[45] w-[300px] max-w-[calc(100vw-3rem)] rounded-[20px] p-4"
          >
            <p className="text-[0.9375rem] font-semibold">{t('popup.title')}</p>
            <p className="mt-1 text-caption text-muted-foreground">{t('popup.subtitle')}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={open}>
                {t('popup.startChat')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowWelcome(false)}>
                {t('popup.maybeLater')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
