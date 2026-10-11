// Content Signals (https://contentsignals.org): what crawlers may do with the pages they are allowed to fetch.
// Search indexing and use as input to an AI answer are welcome; training models on the content is not.
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=no';

/** The body of /robots.txt. `primaryDomain` is the canonical origin, which the sitemap line names. */
export function buildRobotsTxt(primaryDomain: string): string {
  return [
    'User-Agent: *',
    `Content-Signal: ${CONTENT_SIGNAL}`,
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${primaryDomain}/sitemap.xml`,
    '',
  ].join('\n');
}
