import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GroupedList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <ul className={cn('overflow-hidden rounded-lg bg-secondary contrast-more:border contrast-more:border-foreground/40', className)}>
      {children}
    </ul>
  );
}

interface GroupedListItemProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Internal paths use next/link; http(s) opens a new tab; mailto:/tel: open natively. */
  href?: string;
}

const rowClass = 'flex min-h-14 items-center gap-4 px-5 py-3';
const pressableClass =
  'transition-colors focus-visible:-outline-offset-2 hover:bg-black/[0.02] active:bg-black/[0.05] dark:hover:bg-white/[0.03] dark:active:bg-white/[0.07]';

export function GroupedListItem({ leading, title, subtitle, trailing, href }: GroupedListItemProps) {
  const isExternal = href?.startsWith('http') ?? false;
  const TrailingIcon = isExternal ? ExternalLink : ChevronRight;

  const content = (
    <>
      {leading && <span className="flex shrink-0 items-center">{leading}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-body">{title}</span>
        {subtitle && <span className="mt-0.5 block text-caption text-muted-foreground">{subtitle}</span>}
      </span>
      {trailing && <span className="shrink-0 text-right text-body text-muted-foreground">{trailing}</span>}
      {href && <TrailingIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
    </>
  );

  let row: React.ReactNode = <div className={rowClass}>{content}</div>;
  if (href && isExternal) {
    row = (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(rowClass, pressableClass)}>
        {content}
      </a>
    );
  } else if (href && /^(mailto|tel):/.test(href)) {
    row = (
      <a href={href} className={cn(rowClass, pressableClass)}>
        {content}
      </a>
    );
  } else if (href) {
    row = (
      <Link href={href} className={cn(rowClass, pressableClass)}>
        {content}
      </Link>
    );
  }

  return <li className="border-b border-border last:border-b-0">{row}</li>;
}
