/**
 * Shared SEO utilities — single source of truth for site URL and common SEO helpers.
 * 
 * Use `siteUrl` everywhere instead of inlining `process.env.NEXT_PUBLIC_SITE_URL`.
 * This guarantees:
 *   1. No trailing slash
 *   2. Always uses www. prefix for namemongkol.com
 *   3. Consistent canonical URLs across sitemap, robots, and page metadata
 */

const DEFAULT_SITE_URL = 'https://www.namemongkol.com';

/**
 * Normalize a URL by stripping a trailing slash and enforcing www. on namemongkol.com.
 */
export function normalizeSiteUrl(rawUrl?: string): string {
    const input = rawUrl || DEFAULT_SITE_URL;
    const normalized = input.replace(/\/$/, '');
    return normalized.includes('namemongkol.com') && !normalized.includes('www.')
        ? normalized.replace('://namemongkol.com', '://www.namemongkol.com')
        : normalized;
}

const rawUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_SITE_URL;
export const siteUrl = normalizeSiteUrl(rawUrl);

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
