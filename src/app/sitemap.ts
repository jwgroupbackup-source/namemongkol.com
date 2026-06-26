import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { articles as localArticles } from '@/data/articles';
import { siteUrl } from '@/lib/seo';

export const revalidate = 86400;

const STATIC_LASTMOD = '2026-06-02';
const CONTENT_LASTMOD = '2026-05-30';
const LEGAL_LASTMOD = '2026-06-02';

const popularNames = [
    'ภูมิพัฒน์',
    'ธนกร',
    'ปภาวรินทร์',
    'ณัฐชา',
    'พิชญา',
    'กานต์พงศ์',
    'สิรภพ',
    'อภิชญา',
    'พิมพ์ชนก',
    'ชนิดาภา',
    'กิตติภัทร',
    'วรินทร',
    'ภัคพล',
    'ธนัช',
    'นภัสสร',
    'ปุณยวีร์',
    'ณิชา',
    'ชนมน',
    'กฤษณ์',
    'ศุภกร',
    'ธีรภัทร',
    'ปัณณวิชญ์',
    'พิชญธิดา',
    'กรวิชญ์',
    'ณัฐกฤตา',
    'ปวริศา',
    'จิรัชญา',
    'วีรภัทร',
    'ธัญชนก',
    'พิมพ์มาดา',
    'ณฐพร',
    'กัญญาณัฐ',
    'ภูริพัฒน์',
    'ชญาดา',
    'ปัณฑิตา',
    'กมลลักษณ์',
    'อัครวินท์',
    'พัชรพร',
    'ธนภูมิ',
    'สุพิชฌาย์',
    'นันท์นภัส',
];

const toDate = (value: string | Date | null | undefined, fallback = CONTENT_LASTMOD) => {
    if (!value) return new Date(fallback);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteUrl;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

    const routes = [
        { path: '', priority: 0.9, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/name-check', priority: 1.0, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/about', priority: 0.7, changeFreq: 'monthly' as const, lastModified: STATIC_LASTMOD },
        { path: '/articles', priority: 0.9, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/name-analysis', priority: 0.9, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/name-generator', priority: 0.85, changeFreq: 'weekly' as const, lastModified: CONTENT_LASTMOD },
        { path: '/phone-analysis', priority: 1.0, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/premium-analysis', priority: 0.9, changeFreq: 'weekly' as const, lastModified: CONTENT_LASTMOD },
        { path: '/aura-analysis', priority: 0.9, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/premium-search', priority: 0.8, changeFreq: 'weekly' as const, lastModified: CONTENT_LASTMOD },
        { path: '/privacy', priority: 0.2, changeFreq: 'yearly' as const, lastModified: LEGAL_LASTMOD },
        { path: '/reviews', priority: 0.8, changeFreq: 'weekly' as const, lastModified: CONTENT_LASTMOD },
        { path: '/search', priority: 0.9, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/terms', priority: 0.2, changeFreq: 'yearly' as const, lastModified: LEGAL_LASTMOD },
        { path: '/palm-analysis', priority: 0.9, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/wallpapers', priority: 0.8, changeFreq: 'daily' as const, lastModified: CONTENT_LASTMOD },
        { path: '/wallpapers/custom', priority: 0.65, changeFreq: 'monthly' as const, lastModified: CONTENT_LASTMOD },
    ];

    const staticUrls: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(route.lastModified),
        changeFrequency: route.changeFreq,
        priority: route.priority,
    }));

    const meaningUrls: MetadataRoute.Sitemap = popularNames.map((name) => ({
        url: `${baseUrl}/meaning/${encodeURIComponent(name)}`,
        lastModified: new Date(CONTENT_LASTMOD),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const wallpaperDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'wednesday_night', 'thursday', 'friday', 'saturday'];
    const wallpaperZodiac = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    const wallpaperCategoryUrls: MetadataRoute.Sitemap = [
        ...wallpaperDays.map((day) => ({
            url: `${baseUrl}/wallpapers/day/${day}`,
            lastModified: new Date(CONTENT_LASTMOD),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
        { url: `${baseUrl}/wallpapers/zodiac`, lastModified: new Date(CONTENT_LASTMOD), changeFrequency: 'weekly' as const, priority: 0.7 },
        ...wallpaperZodiac.map((sign) => ({
            url: `${baseUrl}/wallpapers/zodiac/${sign}`,
            lastModified: new Date(CONTENT_LASTMOD),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
        { url: `${baseUrl}/wallpapers/intent/finance`, lastModified: new Date(CONTENT_LASTMOD), changeFrequency: 'weekly' as const, priority: 0.75 },
        { url: `${baseUrl}/wallpapers/intent/love`, lastModified: new Date(CONTENT_LASTMOD), changeFrequency: 'weekly' as const, priority: 0.75 },
        { url: `${baseUrl}/wallpapers/intent/work`, lastModified: new Date(CONTENT_LASTMOD), changeFrequency: 'weekly' as const, priority: 0.75 },
    ];

    let articleUrls: MetadataRoute.Sitemap = [];
    try {
        if (supabase) {
            const { data: articles } = await supabase
                .from('articles')
                .select('slug, date, date_modified')
                .eq('is_published', true);

            if (articles) {
                articleUrls = articles.map((article) => ({
                    url: `${baseUrl}/articles/${article.slug}`,
                    lastModified: toDate(article.date_modified || article.date),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }));
            }
        }
    } catch (error) {
        console.error('Sitemap generation error (articles):', error);
    }

    const localArticlePriority: Record<string, number> = {
        'boy-names-2569-50-auspicious': 0.95,
        'auspicious-boy-names-2569': 0.85,
        '100-auspicious-boy-names-2569': 0.8,
    };

    const localArticleUrls: MetadataRoute.Sitemap = localArticles.map((article) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: toDate(article.dateModified || article.date),
        changeFrequency: 'weekly' as const,
        priority: localArticlePriority[article.slug] ?? 0.9,
    }));

    const localArticleUrlsSet = new Set(localArticleUrls.map((article) => article.url));
    const dbOnlyArticles = articleUrls.filter((article) => !localArticleUrlsSet.has(article.url));

    return [...staticUrls, ...meaningUrls, ...wallpaperCategoryUrls, ...localArticleUrls, ...dbOnlyArticles];
}
