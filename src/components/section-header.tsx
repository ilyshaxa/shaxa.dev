import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 max-w-3xl md:mb-16', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="mb-3 text-eyebrow text-primary">{eyebrow}</p>}
      <Heading className="text-title-1 text-balance">{title}</Heading>
      {subtitle && <p className="mt-4 text-body-lg text-muted-foreground text-pretty">{subtitle}</p>}
    </div>
  );
}
