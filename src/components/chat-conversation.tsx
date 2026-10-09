'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LinkParser } from '@/lib/link-parser';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatConversationProps {
  messages: ChatMessage[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  /** Desktop focuses the field on open; mobile doesn't, so the keyboard doesn't cover the sheet. */
  autoFocus?: boolean;
  /** Mobile sheet: show a grabber and let the header start the drag. */
  showGrabber?: boolean;
  onHeaderPointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void;
}

export function ChatConversation({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  onClose,
  autoFocus = false,
  showGrabber = false,
  onHeaderPointerDown,
}: ChatConversationProps) {
  const t = useTranslations('chatbot');
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view once the DOM has painted it.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const list = listRef.current;
      if (list) list.scrollTop = list.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, isLoading]);

  const startedAt = messages[0]?.timestamp;
  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="flex h-full flex-col">
      <div
        onPointerDown={onHeaderPointerDown}
        className={cn('shrink-0 border-b border-border px-5 pb-3', showGrabber ? 'touch-none pt-2' : 'pt-4')}
      >
        {showGrabber && <div aria-hidden className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-muted-foreground/40" />}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="chat-title" className="text-headline">
              {t('title')}
            </h2>
            <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-success" />
              {t('status')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('aria.closeChat')}
            className="flex size-8 items-center justify-center rounded-full bg-black/[0.05] text-muted-foreground transition-transform duration-100 active:scale-90 dark:bg-white/[0.1]"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div ref={listRef} aria-live="polite" className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {startedAt && (
          <p className="mb-3 text-center text-caption text-muted-foreground">
            {t('today', { time: startedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
          </p>
        )}
        <div className="space-y-2">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring.snappy}
              className={cn('flex', message.isUser ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] whitespace-pre-wrap break-words rounded-[18px] px-3.5 py-2 text-[0.9375rem] leading-snug',
                  message.isUser
                    ? 'bg-primary-fill text-white [&_a]:text-white [&_a:hover]:text-white'
                    : 'bg-bubble-incoming text-foreground [&_a]:text-primary [&_a:hover]:text-primary'
                )}
              >
                <LinkParser text={message.content} />
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div aria-hidden className="flex justify-start">
              <div className="flex gap-1 rounded-[18px] bg-bubble-incoming px-4 py-3">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="size-2 rounded-full bg-muted-foreground/70 motion-safe:animate-typing"
                    style={{ animationDelay: `${dot * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
        className="shrink-0 border-t border-border p-3"
      >
        <div className="relative">
          <input
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={t('placeholder')}
            aria-label={t('placeholder')}
            autoFocus={autoFocus}
            enterKeyHint="send"
            className="h-10 w-full rounded-full bg-black/[0.05] pl-4 pr-12 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/[0.08]"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={t('aria.sendMessage')}
            className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary-fill text-white transition-[scale,background-color] duration-100 active:scale-90 disabled:bg-muted-foreground/30"
          >
            <ArrowUp className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </div>
  );
}
