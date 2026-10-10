import { cn } from '@/lib/utils';

export function DotList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul role="list" className={cn('flex flex-wrap gap-x-2', className)}>
      {items.map((item) => (
        <li key={item} className="after:ml-2 after:text-muted-foreground after:content-['·'] last:after:content-none">
          {item}
        </li>
      ))}
    </ul>
  );
}
