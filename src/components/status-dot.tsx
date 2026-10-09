import { cn } from '@/lib/utils';

// Keyed by the untranslated status (Project.originalStatus); anything else reads as in progress.
const dotColors: Record<string, string> = {
  Completed: 'bg-success',
  Discontinued: 'bg-muted-foreground',
};

interface StatusDotProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusDot({ status, label, className }: StatusDotProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-caption text-muted-foreground', className)}>
      <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', dotColors[status] ?? 'bg-primary')} />
      {label ?? status}
    </span>
  );
}
