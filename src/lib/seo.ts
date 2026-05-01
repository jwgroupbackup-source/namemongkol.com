/**
 * Shared SEO utilities — single source of truth for site URL and common SEO helpers.
 * 
 * Use `siteUrl` everywhere instead of inlining `process.env.NEXT_PUBLIC_SITE_URL`.
 * This guarantees:
 *   1. No trailing slash
 *   2. Always uses www. prefix for namemongkol.com
 *   3. Consistent canonical URLs across sitemap, robots, and page metadata
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com';

// Normalize: strip trailing slash, enforce www.
const normalized = rawUrl.replace(/\/$/, '');
export const siteUrl = normalized.includes('namemongkol.com') && !normalized.includes('www.')
    ? normalized.replace('://namemongkol.com', '://www.namemongkol.com')
    : normalized;

/**
 * Build a canonical URL for a given path.
 * @param path — path starting with `/`, e.g. `/search`
 */
export function canonicalUrl(path: string = ''): string {
    return `${siteUrl}${path}`;
}

/**
 * Build an OG image URL using the site's OG API endpoint.
 */
export function ogImageUrl(params: {
    variant?: string;
    title?: string;
    subtitle?: string;
    tag?: string;
}): string {
    const searchParams = new URLSearchParams();
    if (params.variant) searchParams.set('variant', params.variant);
    if (params.title) searchParams.set('title', params.title);
    if (params.subtitle) searchParams.set('subtitle', params.subtitle);
    if (params.tag) searchParams.set('tag', params.tag);
    return `${siteUrl}/api/og?${searchParams.toString()}`;
}
