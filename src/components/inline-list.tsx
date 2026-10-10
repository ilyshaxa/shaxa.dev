import { cn } from '@/lib/utils';

/** Items run together as text ("Loki, Vault, Nginx"). */
export function InlineList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul role="list" className={cn('flex flex-wrap gap-x-[0.3em]', className)}>
      {items.map((item) => (
        <li key={item} className="after:content-[','] last:after:content-none">
          {item}
        </li>
      ))}
    </ul>
  );
}
