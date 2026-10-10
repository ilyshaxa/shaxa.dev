import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  /** `h1` for a page title (larger), `h2` for a section heading. */
  as?: 'h1' | 'h2';
  /** Trailing link, baseline-aligned with the heading ("All projects ›"). */
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, as: Heading = 'h2', action, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-baseline justify-between gap-4 md:mb-8', className)}>
      <Heading className={cn('text-balance', Heading === 'h1' ? 'text-title-1' : 'text-title-2')}>{title}</Heading>
      {action}
    </div>
  );
}
