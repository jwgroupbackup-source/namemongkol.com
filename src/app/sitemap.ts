import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { articles as localArticles } from '@/data/articles'

export const revalidate = 3600

// Popular names for meaning pages (SEO-important pages — topical cluster for "วิเคราะห์ชื่อมงคล")
const popularNames = [
    'ภูมิพัฒน์', 'ธนกร', 'ปภาวรินทร์', 'ณัฐชา', 'พิชญา', 'กันต์พงษ์', 'สิรภพ',
    'อภิชญา', 'พิมพ์ชนก', 'ชนิดาภา', 'กิตติภัทร', 'วรินทร', 'ภัคพล', 'ธนัช',
    'นภัสสร', 'ปุณยวีร์', 'ณิชา', 'ชนมน', 'กฤษณ์', 'ศุภกร', 'ธีรภัทร', 'ปัณณวิชญ์',
    'พิชญธิดา', 'กรวิชญ์', 'ณัฐกฤตา', 'ปวริศา', 'จิรัชญา', 'วีรภัทร', 'ธัญชนก',
    'พิมพ์มาดา', 'ณฐพร', 'กัญญาณัฐ', 'ภูริพัฒน์', 'ชญาดา', 'ปัณฑิตา', 'กมลลักษณ์',
    'อัครวินท์', 'พัชรพร', 'ธนภูมิ', 'สุพิชฌาย์', 'นันท์นภัส',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // IMPORTANT: Must use www. to match canonical URLs in page metadata
    const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com';
    // Ensure www. prefix for consistency with page canonical URLs
    const baseUrl = rawBaseUrl.includes('namemongkol.com') && !rawBaseUrl.includes('www.')
        ? rawBaseUrl.replace('://namemongkol.com', '://www.namemongkol.com')
        : rawBaseUrl;

    // Initialize Supabase client (optional). Sitemap must not fail if env is missing.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

    // Define static routes with proper priorities
    const routes = [
        { path: '', priority: 0.9, changeFreq: 'daily' as const },
        { path: '/name-check', priority: 1.0, changeFreq: 'daily' as const }, // Landing page: วิเคราะห์ชื่อ นามสกุล ฟรี
        { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
        { path: '/articles', priority: 0.9, changeFreq: 'daily' as const },
        { path: '/name-analysis', priority: 0.9, changeFreq: 'daily' as const }, // Bulk tool (differentiated from homepage)
        { path: '/phone-analysis', priority: 1.0, changeFreq: 'daily' as const },
        { path: '/premium-analysis', priority: 0.9, changeFreq: 'weekly' as const },
        { path: '/aura-analysis', priority: 0.9, changeFreq: 'daily' as const },
        { path: '/premium-search', priority: 0.8, changeFreq: 'weekly' as const },
        { path: '/privacy', priority: 0.2, changeFreq: 'yearly' as const },
        { path: '/reviews', priority: 0.8, changeFreq: 'weekly' as const },
        { path: '/search', priority: 0.9, changeFreq: 'daily' as const },
        { path: '/terms', priority: 0.2, changeFreq: 'yearly' as const },
        { path: '/palm-analysis', priority: 0.9, changeFreq: 'daily' as const },
        { path: '/wallpapers', priority: 0.8, changeFreq: 'daily' as const }, // New designs often
    ];

    const staticUrls = routes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFreq,
        priority: route.priority,
    }))

    // Add popular name meaning pages for SEO
    const meaningUrls: MetadataRoute.Sitemap = popularNames.map((name) => ({
        url: `${baseUrl}/meaning/${encodeURIComponent(name)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Wallpaper sub-page category URLs (marketing-friendly)
    const wallpaperDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'wednesday_night', 'thursday', 'friday', 'saturday'];
    const wallpaperZodiac = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    const wallpaperCategoryUrls: MetadataRoute.Sitemap = [
        ...wallpaperDays.map((day) => ({
            url: `${baseUrl}/wallpapers/day/${day}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
        { url: `${baseUrl}/wallpapers/zodiac`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
        ...wallpaperZodiac.map((sign) => ({
            url: `${baseUrl}/wallpapers/zodiac/${sign}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
        { url: `${baseUrl}/wallpapers/intent/finance`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.75 },
        { url: `${baseUrl}/wallpapers/intent/love`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.75 },
        { url: `${baseUrl}/wallpapers/intent/work`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.75 },
        { url: `${baseUrl}/wallpapers/custom`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    ];

    // Fetch dynamic articles from database
    let articleUrls: MetadataRoute.Sitemap = [];
    try {
        if (!supabase) throw new Error('Supabase is not configured');
        const { data: articles } = await supabase
            .from('articles')
            .select('slug, date')
            .eq('is_published', true);

        if (articles) {
            articleUrls = articles.map((article) => ({
                url: `${baseUrl}/articles/${article.slug}`,
                lastModified: article.date ? new Date(article.date) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
        }
    } catch (error) {
        console.error('Sitemap generation error (articles):', error);
    }

    // Add local articles from articles.ts (these are hardcoded articles)
    const localArticleUrls: MetadataRoute.Sitemap = localArticles.map((article) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: article.date ? new Date(article.date) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Merge and deduplicate articles (local articles take priority)
    const allArticleSlugs = new Set(localArticleUrls.map(a => a.url));
    const dbOnlyArticles = articleUrls.filter(a => !allArticleSlugs.has(a.url));

    return [...staticUrls, ...meaningUrls, ...wallpaperCategoryUrls, ...localArticleUrls, ...dbOnlyArticles];
}
