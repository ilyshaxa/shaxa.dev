/** Plain bullets for a project's or job's key points. `role="list"` keeps list semantics where preflight removes bullets. */
export function BulletList({ items }: { items: string[] }) {
  return (
    <ul role="list" className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-body text-muted-foreground">
          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
          {item}
        </li>
      ))}
    </ul>
  );
}
