import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com';
    // Ensure www. prefix for consistency with canonical URLs
    const baseUrl = rawBaseUrl.includes('namemongkol.com') && !rawBaseUrl.includes('www.')
        ? rawBaseUrl.replace('://namemongkol.com', '://www.namemongkol.com')
        : rawBaseUrl;

    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/api/og/*'],
                disallow: ['/admin/', '/profile/', '/history/', '/api/', '/slip-verification/'],
            },
            // Allow AI crawlers for GEO (Generative Engine Optimization)
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/admin/', '/profile/', '/api/'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'Anthropic-AI',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
