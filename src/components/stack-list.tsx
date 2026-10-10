import { useTranslations } from 'next-intl';
import { DotList } from '@/components/dot-list';
import { stackRows, type Profile } from '@/lib/data';

/** Seven hairline rows: a muted label and the tools, separated by middle dots. No icons, no color. */
export function StackList({ stack }: { stack: Profile['stack'] }) {
  const t = useTranslations('home.stack.rows');

  return (
    <dl className="border-t border-border">
      {stackRows.map((row) => (
        <div key={row} className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:gap-6">
          <dt className="shrink-0 text-caption text-muted-foreground sm:w-44 sm:pt-[0.2rem]">{t(row)}</dt>
          <dd>
            <DotList items={stack[row]} className="text-body" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
