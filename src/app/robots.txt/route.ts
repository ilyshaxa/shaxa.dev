// A route handler rather than a `robots.ts` metadata file: Next's MetadataRoute.Robots has no Content-Signal field.
// Relative imports with extensions keep this loadable from `node --test` (src/lib/robots.test.ts).
import { buildRobotsTxt } from '../../lib/robots.ts';
import { getPrimaryDomain } from '../../lib/seo.ts';

// Built once, like the metadata file it replaces.
export const dynamic = 'force-static';

export function GET(): Response {
  // Use primary domain for sitemap reference (canonical)
  return new Response(buildRobotsTxt(getPrimaryDomain()), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
