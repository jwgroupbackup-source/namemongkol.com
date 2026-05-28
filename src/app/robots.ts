import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = siteUrl;

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
