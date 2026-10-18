/**
 * Public URL of the site, used for social-share links, robots.txt and the sitemap.
 * An explicit NEXT_PUBLIC_SITE_URL wins; otherwise Vercel's own production domain
 * (set automatically on every Vercel build), so deploys work with zero config.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
