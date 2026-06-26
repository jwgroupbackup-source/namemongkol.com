import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { unstable_cache } from 'next/cache';
import { supabase } from '@/utils/supabase';
import { Calendar, ArrowLeft, Search, BookOpen } from 'lucide-react';
import { articles as localArticles } from '@/data/articles';
import { ArticleImage } from '@/components/ArticleImage';
import { SoftYellowGlowBackground } from '@/components/ui/background-components';
import { siteUrl } from '@/lib/seo';

type ArticleRow = {
    id?: string;
    slug: string;
    title: string;
    excerpt: string;
    content?: string;
    cover_image?: string;
    coverImage?: string;
    date: string;
    author: string;
    category: string;
} & Record<string, unknown>;

function getArticleKeywords(article: ArticleRow | (typeof localArticles)[number]) {
    const keywords = (article as { keywords?: unknown }).keywords;
    return Array.isArray(keywords)
        ? keywords.filter((keyword): keyword is string => typeof keyword === 'string')
        : [];
}

function getArticleCoverAlt(article: ArticleRow | (typeof localArticles)[number]) {
    const coverImageAlt = (article as { coverImageAlt?: unknown }).coverImageAlt;
    return typeof coverImageAlt === 'string' && coverImageAlt.trim()
        ? coverImageAlt
        : `บทความ: ${article.title} - เคล็ดลับตั้งชื่อมงคล`;
}

// ISR: cache 24 hours, invalidate on demand via revalidateTag('articles') when admin updates
export const revalidate = 86400;

// Helper to parse Thai date string "DD Month YYYY" to timestamp
const parseThaiDate = (dateStr: string) => {
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    // Check if already ISO or standard format, or doesn't contain Thai characters
    if (!dateStr || !dateStr.match(/[ก-๙]/)) return new Date(dateStr).getTime();

    const parts = dateStr.split(' ');
    // Handle "20 มกราคม 2569"
    if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const monthIndex = months.indexOf(parts[1]);
        const year = parseInt(parts[2]) - 543; // Convert Thai year to AD
        if (monthIndex !== -1) {
            return new Date(year, monthIndex, day).getTime();
        }
    }
    return 0; // Fallback
};

const getArticleModifiedDate = (article: { date: string; dateModified?: unknown; date_modified?: unknown }) => {
    const camelDate = typeof article.dateModified === 'string' ? article.dateModified : '';
    const snakeDate = typeof article.date_modified === 'string' ? article.date_modified : '';
    return camelDate || snakeDate || article.date;
};

function resolveArticleCoverImage(dbImage?: string | null, localImage?: string) {
    const image = dbImage?.trim() || '';

    if (!image) return localImage || '';

    const isLegacyLocalArticlePath = image.startsWith('/images/article/') || image.startsWith('/images/article-');
    if (isLegacyLocalArticlePath && localImage) return localImage;

    return image;
}

async function fetchArticlesFromDb() {
    try {
        const { data: articles } = await supabase
            .from('articles')
            .select('id, slug, title, excerpt, cover_image, cover_image_alt, date, author, category, meta_title, meta_description, date_modified')
            .eq('is_published', true);
        return (articles as ArticleRow[]) || [];
    } catch (e) {
        console.warn('⚠️ Could not fetch articles from database during build:', e);
        return [];
    }
}

const getCachedDbArticles = unstable_cache(
    fetchArticlesFromDb,
    ['articles-list'],
    { revalidate: 86400, tags: ['articles'] }
);

// Old Thai slug → New English slug redirect map
const SLUG_REDIRECTS: Record<string, string> = {
    'ตั้งชื่อลูก-2569-คู่มือสมบูรณ์': 'baby-naming-guide-2569',
    'ทักษา-ปกรณ์-ตั้งชื่อลูกให้ตรงจุด': 'thaksa-pakorn-naming-guide',
    'เบอร์มงคล-วิธีเลือก-คู่เลขเสริมดวง': 'lucky-phone-numbers-guide-2569',
    'ชื่อลูกสาว-2569-50-ชื่อมงคล': 'girl-names-2569-50-auspicious',
    'ชื่อลูกชาย-2569-50-ชื่อมงคล': 'boy-names-2569-50-auspicious',
};

const LOCAL_PRIORITY_ARTICLE_SLUGS = new Set(['boy-names-wednesday-night-2569']);

async function getArticles() {
    const dbArticles = await getCachedDbArticles();

    // Enhance DB articles with local data (fallback for images + slug migration)
    const enrichedDbArticles = dbArticles.map(dbArticle => {
        // Try to find local match by slug first, then by title (for migrated slugs)
        const localMatch = localArticles.find(a => a.slug === dbArticle.slug)
            || localArticles.find(a => a.title === dbArticle.title);

        if (localMatch && LOCAL_PRIORITY_ARTICLE_SLUGS.has(localMatch.slug)) {
            return localMatch;
        }

        const dbImage = dbArticle.cover_image || dbArticle.coverImage;
        const localImage = localMatch?.coverImage;

        // DB-first: always use image edited via admin when present,
        // fallback to local static image only if DB image is empty.
        const finalImage = resolveArticleCoverImage(
            typeof dbImage === 'string' ? dbImage : null,
            localImage
        );

        // If the DB slug is old (Thai) and we have a redirect, use the new English slug
        const migratedSlug = SLUG_REDIRECTS[dbArticle.slug as string] || (localMatch ? localMatch.slug : dbArticle.slug);

        return {
            ...dbArticle,
            slug: migratedSlug,
            coverImage: finalImage,
            coverImageAlt: dbArticle.cover_image_alt || localMatch?.coverImageAlt || '',
            metaTitle: dbArticle.meta_title || dbArticle.metaTitle || localMatch?.metaTitle,
            metaDescription: dbArticle.meta_description || dbArticle.metaDescription || localMatch?.metaDescription,
            dateModified: dbArticle.date_modified || dbArticle.dateModified || localMatch?.dateModified || dbArticle.date,
            // Keep cover_image for backward compatibility if needed, but we'll use coverImage primarily
            cover_image: finalImage
        };
    });

    // Filter out local articles that are already present in DB (by slug OR title)
    // This prevents duplicates when slugs differ (e.g. old Thai slug in DB vs new English slug in local)
    const existingSlugs = new Set(enrichedDbArticles.map(a => a.slug));
    const existingTitles = new Set(enrichedDbArticles.map(a => a.title));
    const uniqueLocalArticles = localArticles.filter(a => !existingSlugs.has(a.slug) && !existingTitles.has(a.title));

    // Combine
    const allArticles = [...enrichedDbArticles, ...uniqueLocalArticles];

    // Keep the first article for each slug so duplicated DB rows or migrated slugs
    // do not crash React with duplicate keys.
    const uniqueBySlug = Array.from(
        new Map(allArticles.map(article => [article.slug, article])).values()
    );

    // Sort by date descending
    const sorted = uniqueBySlug.sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date));

    return sorted;
}

import { Metadata } from 'next';

// Base URL for metadata
const baseUrl = siteUrl;

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: 'บทความชื่อมงคล - คู่มือตั้งชื่อลูก เลขศาสตร์ ทักษา อายตนะ 6 | NameMongkol',
    description: 'รวมบทความศาสตร์ตั้งชื่อมงคล ครบทุกเรื่อง: วิธีตั้งชื่อลูกชายหญิง เลขศาสตร์ผลรวมมงคล ทักษาปกรณ์ อายตนะ 6 และอักษรกาลกิณี',
    keywords: 'บทความชื่อมงคล, ตั้งชื่อลูก, หลักการตั้งชื่อ, เลขศาสตร์ชื่อ, ทักษาปกรณ์, อายตนะ 6, ผลรวมมงคล, อักษรกาลกิณี, เปลี่ยนชื่อเสริมดวง, ชื่อลูกชายมงคล, ชื่อลูกสาวมงคล, ความหมายชื่อ',

    alternates: { canonical: `${baseUrl.replace(/\/$/, '')}/articles` },

    // Robots directives for AI crawlers & snippet optimization
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    },

    openGraph: {
        title: 'บทความชื่อมงคล - คู่มือตั้งชื่อลูก เลขศาสตร์ ทักษา | NameMongkol',
        description: 'รวมบทความศาสตร์ตั้งชื่อมงคลครบทุกเรื่อง วิธีตั้งชื่อลูก เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 พร้อมตัวอย่างชื่อมงคล',
        url: `${baseUrl}/articles`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [
            {
                url: `${baseUrl}/api/og?variant=default&title=บทความชื่อมงคล&subtitle=รวมความรู้ศาสตร์การตั้งชื่อ%20เลขศาสตร์%20ทักษา%20อายตนะ&tag=Articles`,
                width: 1200,
                height: 630,
                alt: 'บทความชื่อมงคล – NameMongkol คลังความรู้การตั้งชื่อ เลขศาสตร์ ทักษาปกรณ์',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'บทความชื่อมงคล - คู่มือตั้งชื่อลูก เลขศาสตร์ ทักษา | NameMongkol',
        description: 'รวมบทความศาสตร์ตั้งชื่อมงคล วิธีตั้งชื่อลูก เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6',
        images: [
            {
                url: `${baseUrl}/api/og?variant=default&title=บทความชื่อมงคล`,
                alt: 'บทความชื่อมงคล – NameMongkol',
            },
        ],
    },
};

type ArticlesPageProps = {
    searchParams?: Promise<{
        q?: string;
        category?: string;
    }>;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
    const articles = await getArticles();
    const resolvedSearchParams = await searchParams;
    const query = (resolvedSearchParams?.q || '').trim();
    const activeCategory = (resolvedSearchParams?.category || '').trim();
    const normalizedQuery = query.toLowerCase();
    const categories = Array.from(new Set(articles.map((article) => article.category).filter(Boolean))).slice(0, 12);
    const filteredArticles = articles.filter((article) => {
        const matchesCategory = !activeCategory || article.category === activeCategory;
        const searchableText = `${article.title} ${article.excerpt} ${article.category} ${getArticleKeywords(article).join(' ')}`.toLowerCase();
        const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
        return matchesCategory && matchesQuery;
    });
    const visibleArticles = query || activeCategory ? filteredArticles : articles;
    const getArticlesHref = (params: { q?: string; category?: string }) => {
        const nextParams = new URLSearchParams();
        if (params.q) nextParams.set('q', params.q);
        if (params.category) nextParams.set('category', params.category);
        const queryString = nextParams.toString();
        return queryString ? `/articles?${queryString}` : '/articles';
    };
    const topicClusters = [
        {
            title: 'เริ่มต้นตั้งชื่อลูก',
            description: 'เหมาะสำหรับพ่อแม่ที่ต้องการชื่อจริง ความหมายดี และไม่ชนอักษรกาลกิณี',
            links: [
                { href: '/articles/naming-baby-year-of-horse-2569', label: 'ตั้งชื่อลูกปีมะเมีย 2569' },
                { href: '/articles/100-auspicious-boy-names-2569', label: '100 ชื่อมงคลลูกชาย' },
                { href: '/articles/100-auspicious-women-names-2026', label: '100 ชื่อมงคลลูกสาว' },
            ],
        },
        {
            title: 'เข้าใจศาสตร์ชื่อมงคล',
            description: 'อ่านพื้นฐานเลขศาสตร์ ทักษา อายตนะ และพลังเงาก่อนเลือกชื่อจริง',
            links: [
                { href: '/articles/4-pillars-of-naming', label: '4 ศาสตร์การตั้งชื่อมงคล' },
                { href: '/articles/numerology-0-9-power-guide', label: 'เลขศาสตร์ 0-9' },
                { href: '/articles/shadow-power-ayatana-6-meaning', label: 'พลังเงาและอายตนะ 6' },
            ],
        },
        {
            title: 'เช็กข้อห้ามก่อนใช้ชื่อ',
            description: 'ลดความเสี่ยงจากอักษรกาลกิณี คู่เลขเสีย และจังหวะที่ไม่เหมาะกับวันเกิด',
            links: [
                { href: '/articles/forbidden-letters-kalakini', label: 'อักษรกาลกิณีที่ควรเลี่ยง' },
                { href: '/articles/check-kalakini-letters-7-days', label: 'เช็กกาลกิณี 7 วันเกิด' },
                { href: '/articles/micro-analysis-lucky-number-pairs', label: 'คู่เลขมงคลและคู่เลขเสีย' },
            ],
        },
        {
            title: 'ต่อยอดเสริมดวงรายวัน',
            description: 'รวมบทความสำหรับเบอร์มือถือ สีมงคล และวอลเปเปอร์เสริมเป้าหมายชีวิต',
            links: [
                { href: '/articles/auspicious-phone-number-guide-2026', label: 'คู่มือเบอร์มงคล 2026' },
                { href: '/articles/auspicious-colors-2569-guide', label: 'สีมงคลตามวันเกิด 2569' },
                { href: '/articles/caishen-wallpaper-free-download', label: 'วอลเปเปอร์ไฉ่ซิงเอี้ย' },
            ],
        },
    ];

    // Organization Schema (EEAT signal – author/publisher identity)
    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        'name': 'NameMongkol',
        'url': baseUrl,
        'logo': {
            '@type': 'ImageObject',
            'url': `${baseUrl}/logo.png`,
            'width': 200,
            'height': 60,
        },
        'sameAs': [
            'https://www.facebook.com/namemongkol',
        ],
        'description': 'ผู้ให้บริการวิเคราะห์ชื่อมงคล ตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง ด้วยระบบ AI ผสาน 4 ศาสตร์ที่ครบถ้วนที่สุดในประเทศไทย',
    };

    // WebSite Schema (enables Google Sitelinks Searchbox)
    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        'url': baseUrl,
        'name': 'NameMongkol',
        'publisher': { '@id': `${baseUrl}/#organization` },
        'inLanguage': 'th-TH',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    // WebPage Schema with speakable – helps AI assistants (ChatGPT, Perplexity, Gemini) read this page
    const webpageJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/articles#webpage`,
        'url': `${baseUrl}/articles`,
        'name': 'บทความชื่อมงคล - คู่มือตั้งชื่อลูก เลขศาสตร์ ทักษา อายตนะ 6',
        'description': 'รวมบทความศาสตร์ตั้งชื่อมงคลครบทุกเรื่อง: วิธีตั้งชื่อลูกชายหญิง เลขศาสตร์ผลรวมมงคล ทักษาปกรณ์ อายตนะ 6 และอักษรกาลกิณี',
        'isPartOf': { '@id': `${baseUrl}/#website` },
        'publisher': { '@id': `${baseUrl}/#organization` },
        'inLanguage': 'th-TH',
        'dateModified': (() => { const dates = articles.map(a => { try { return new Date(getArticleModifiedDate(a)).getTime(); } catch { return 0; } }).filter(d => d > 0); return dates.length ? new Date(Math.max(...dates)).toISOString() : new Date().toISOString(); })(),
        // speakable: tells AI assistants which CSS selectors contain the most important content
        'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': ['h1', '.articles-intro', '.faq-section'],
        },
        'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'หน้าหลัก', 'item': baseUrl },
                { '@type': 'ListItem', 'position': 2, 'name': 'บทความชื่อมงคล', 'item': `${baseUrl}/articles` },
            ],
        },
        'mainEntity': {
            '@type': 'ItemList',
            'name': 'รายการบทความชื่อมงคล',
            'numberOfItems': articles.length,
            'itemListElement': articles.slice(0, 15).map((article, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                    '@type': 'Article',
                    '@id': `${baseUrl}/articles/${article.slug}`,
                    'headline': article.title,
                    'description': article.excerpt,
                    'url': `${baseUrl}/articles/${article.slug}`,
                    'datePublished': article.date,
                    'dateModified': getArticleModifiedDate(article),
                    'inLanguage': 'th-TH',
                    ...(article.coverImage && {
                        'image': {
                            '@type': 'ImageObject',
                            'url': `${baseUrl}${article.coverImage}`,
                            'width': 1200,
                            'height': 630,
                        },
                    }),
                    'author': {
                        '@type': 'Organization',
                        '@id': `${baseUrl}/#organization`,
                        'name': article.author || 'NameMongkol',
                    },
                    'publisher': {
                        '@type': 'Organization',
                        '@id': `${baseUrl}/#organization`,
                        'name': 'NameMongkol',
                        'logo': {
                            '@type': 'ImageObject',
                            'url': `${baseUrl}/logo.png`,
                        },
                    },
                    'isPartOf': { '@id': `${baseUrl}/articles#webpage` },
                },
            })),
        },
    };

    // FAQ Schema for common questions (AEO – answer engine ready)
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${baseUrl}/articles#faq`,
        'isPartOf': { '@id': `${baseUrl}/articles#webpage` },
        'mainEntity': [
            {
                '@type': 'Question',
                'name': 'ตั้งชื่อลูกควรใช้หลักอะไรบ้าง?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'การตั้งชื่อลูกควรใช้หลักเลขศาสตร์ (ผลรวมตัวเลขมงคล) ทักษาปกรณ์ (อักษรตามวันเกิด) และอายตนะ 6 (ความสมดุลพลังชีวิต) รวมถึงหลีกเลี่ยงอักษรกาลกิณีประจำวันเกิด',
                },
            },
            {
                '@type': 'Question',
                'name': 'เลขศาสตร์ชื่อคืออะไร?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'เลขศาสตร์ชื่อ คือการคำนวณค่าตัวเลขจากพยัญชนะและสระในชื่อ แล้วหาผลรวมเพื่อดูว่าตกเลขมงคลหรือไม่ เลขที่ดี เช่น 14, 15, 24, 32, 36, 41, 45, 59 เป็นต้น',
                },
            },
            {
                '@type': 'Question',
                'name': 'อักษรกาลกิณีคืออะไร?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'อักษรกาลกิณี คือตัวอักษรที่ไม่ควรมีในชื่อตามวันเกิด เช่น คนเกิดวันอาทิตย์ห้ามมี ศ ษ ส ห ฬ ฮ, วันจันทร์ห้ามมี บ ป ผ ฝ พ ฟ ภ เป็นต้น',
                },
            },
            {
                '@type': 'Question',
                'name': 'ทักษาปกรณ์ มีหลักอะไรบ้าง?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ทักษาปกรณ์แบ่งอักษรออกเป็น 8 หมวด ได้แก่ บริวาร ศรี เดช อายุ มนตรี กาลกิณี อุตสาหะ และมูละ โดยแต่ละวันเกิดจะมีอักษรที่เหมาะสมต่างกัน',
                },
            },
            {
                '@type': 'Question',
                'name': 'เปลี่ยนชื่อแก้ดวงได้จริงไหม?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'การเปลี่ยนชื่อสามารถช่วยปรับพลังชีวิตได้ เพราะชื่อถูกเรียกทุกวัน สร้างคลื่นพลังงานส่งผลต่อจิตใต้สำนึก แต่ต้องเลือกชื่อใหม่ที่ถูกหลักเลขศาสตร์และทักษาด้วย',
                },
            },
            {
                '@type': 'Question',
                'name': 'NameMongkol วิเคราะห์ชื่อด้วยหลักอะไรบ้าง?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ระบบ AI ของ NameMongkol วิเคราะห์ชื่อครบ 4 ศาสตร์หลัก ได้แก่ เลขศาสตร์ (คำนวณผลรวมตัวเลข) ทักษาปกรณ์ (วิเคราะห์อักษรตามวันเกิด) อายตนะ 6 (ความสมดุล 6 ด้านของชีวิต) และนิรันดร์ศาสตร์ (ความสมดุลระหว่างชื่อกับนามสกุล)',
                },
            },
        ],
    };

    return (
        <>
            <Script
                id="articles-org-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <Script
                id="articles-website-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <Script
                id="articles-webpage-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageJsonLd) }}
            />
            <Script
                id="articles-faq-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <SoftYellowGlowBackground className="font-sans overflow-x-hidden pb-28">
                <main className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 pb-8 relative z-10 pt-24 md:pt-32">
                    {/* Breadcrumb */}
                    <nav className="hidden sm:block max-w-4xl mx-auto mb-6 text-sm" style={{ color: '#8e8eaa' }} aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/" className="hover:text-[#1a1a3e] transition-colors">หน้าหลัก</Link></li>
                            <li style={{ color: '#ddddf0' }}>/</li>
                            <li className="font-medium" style={{ color: '#c9933a' }}>บทความชื่อมงคล</li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6 transition-colors text-sm sm:text-base" style={{ color: '#8e8eaa' }}>
                            <ArrowLeft size={16} />
                            กลับหน้าหลัก
                        </Link>

                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ color: '#1a1a3e' }}>
                            บทความชื่อมงคล
                        </h1>
                        <p className="text-sm sm:text-lg mb-4 leading-relaxed" style={{ color: '#5a5a82' }}>
                            รวมบทความศาสตร์มงคล เคล็ดลับการตั้งชื่อ และเกร็ดความรู้เพื่อชีวิตที่ดีกว่า
                        </p>

                        {/* SEO Rich Content Introduction – speakable target for AI assistants */}
                        <div className="articles-intro rounded-xl p-4 sm:p-6 mb-5 sm:mb-8 shadow-xl" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
                            <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 flex items-center gap-2" style={{ color: '#fcd34d' }}>
                                <BookOpen size={20} />
                                คลังความรู้การตั้งชื่อครบวงจร
                            </h2>
                            <p className="text-xs sm:text-base leading-relaxed mb-4 sm:mb-6" style={{ color: '#cbd5e1' }}>
                                ยินดีต้อนรับสู่คลังบทความ <strong className="font-bold text-white">NameMongkol</strong> แหล่งรวมความรู้ด้านศาสตร์การตั้งชื่อที่ครบถ้วนและอัปเดตต่อเนื่อง ไม่ว่าคุณกำลังมองหา <strong style={{ color: '#fcd34d' }}>ชื่อมงคลสำหรับลูกน้อย</strong> ต้องการเรียนรู้หลัก <strong style={{ color: '#fcd34d' }}>เลขศาสตร์</strong> และ <strong style={{ color: '#fcd34d' }}>ทักษาปกรณ์</strong> หรือกำลังพิจารณา <strong style={{ color: '#fcd34d' }}>เปลี่ยนชื่อเสริมดวง</strong> เรามีบทความครอบคลุมทุกหัวข้อ
                            </p>
                            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-[10px] sm:text-sm">
                                <div className="rounded-xl p-3 sm:p-4 text-center bg-[#1e293b] relative overflow-hidden group">
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-400 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-base sm:text-2xl font-bold mb-1 text-purple-300">{articles.length}+</div>
                                    <div className="truncate text-xs font-medium text-slate-300">บทความ</div>
                                </div>
                                <div className="rounded-xl p-3 sm:p-4 text-center bg-[#1e293b] relative overflow-hidden group">
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 to-amber-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-base sm:text-2xl font-bold mb-1 text-amber-300">500+</div>
                                    <div className="truncate text-xs font-medium text-slate-300">ตัวอย่างชื่อ</div>
                                </div>
                                <div className="rounded-xl p-3 sm:p-4 text-center bg-[#1e293b] relative overflow-hidden group">
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-300 to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-base sm:text-2xl font-bold mb-1 text-emerald-300">7</div>
                                    <div className="truncate text-xs font-medium text-slate-300">หมวดหมู่</div>
                                </div>
                                <div className="rounded-xl p-3 sm:p-4 text-center bg-[#1e293b] relative overflow-hidden group">
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-300 to-blue-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-base sm:text-2xl font-bold mb-1 truncate text-blue-300">ต่อเนื่อง</div>
                                    <div className="truncate text-xs font-medium text-slate-300">อัปเดตล่าสุด</div>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <form role="search" aria-label="ค้นหาบทความชื่อมงคล" action="/articles" method="GET" className="mt-5 sm:mt-8 relative max-w-lg group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-amber-400 transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="search"
                                name="q"
                                defaultValue={query}
                                placeholder="ค้นหาบทความ... เช่น ชื่อลูกชาย, เลขศาสตร์, ทักษา"
                                aria-label="ค้นหาบทความ"
                                className="w-full rounded-xl py-2.5 sm:py-3 pl-12 pr-4 text-sm sm:text-base bg-[#0f172a] border border-[#1e293b] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all shadow-md"
                            />
                            {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-amber-400 transition-colors">
                                <Search size={16} />
                            </button>
                        </form>

                        <div className="mt-4 flex max-w-4xl flex-wrap items-center gap-2">
                            <Link
                                href={getArticlesHref({ q: query })}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition shadow-sm ${
                                    !activeCategory
                                        ? 'border-amber-400 bg-[#0f172a] text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.25)]'
                                        : 'border-[#1e293b] bg-[#0f172a] text-slate-300 hover:border-amber-500/30 hover:bg-[#1e293b] hover:text-amber-400'
                                }`}
                            >
                                ทั้งหมด
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category}
                                    href={getArticlesHref({ q: query, category })}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition shadow-sm ${
                                        activeCategory === category
                                            ? 'border-amber-400 bg-[#0f172a] text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.25)]'
                                            : 'border-[#1e293b] bg-[#0f172a] text-slate-300 hover:border-amber-500/30 hover:bg-[#1e293b] hover:text-amber-400'
                                    }`}
                                >
                                    {category}
                                </Link>
                            ))}
                            {(query || activeCategory) && (
                                <Link href="/articles" className="rounded-full border border-[#1e293b] bg-[#0f172a] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-red-500/30 hover:bg-[#1e293b] hover:text-red-400 shadow-sm">
                                    ล้างตัวกรอง
                                </Link>
                            )}
                        </div>
                        {(query || activeCategory) && (
                            <p className="mt-3 text-sm text-slate-600">
                                พบ {visibleArticles.length} บทความจากทั้งหมด {articles.length} บทความ
                            </p>
                        )}
                    </div>

                    {/* Grid — 1 col mobile / 2 col tablet / 4 col desktop */}
                    <section className="mx-auto mb-8 sm:mb-12 max-w-[1400px]" aria-labelledby="topic-clusters-heading">
                        <div className="mb-4 sm:mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: '#c9933a' }}>Topic clusters</p>
                                <h2 id="topic-clusters-heading" className="mt-1.5 sm:mt-2 text-lg sm:text-2xl font-bold" style={{ color: '#1a1a3e' }}>
                                    เลือกอ่านตามเป้าหมาย เพื่อไปถึงคำตอบเร็วขึ้น
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {topicClusters.map((cluster) => (
                                <div key={cluster.title} className="rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col h-full bg-[#0f172a] border border-[#1e293b] group hover:border-amber-500/30 transition-colors duration-300">
                                    <h3 className="text-sm sm:text-base font-bold leading-snug text-slate-100 group-hover:text-amber-400 transition-colors duration-300">{cluster.title}</h3>
                                    <p className="mt-1.5 hidden sm:block min-h-[60px] text-xs leading-relaxed text-slate-300">{cluster.description}</p>
                                    <div className="mt-auto pt-3 sm:pt-4 space-y-2 flex-col">
                                        {cluster.links.map((link, linkIndex) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`${linkIndex > 1 ? 'hidden sm:block' : 'block'} rounded-lg px-2.5 sm:px-3 py-2 text-[11px] sm:text-sm leading-snug transition border bg-[#1e293b] border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-amber-500/40 hover:text-amber-400 shadow-sm`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-[1400px] mx-auto">
                        {visibleArticles.map((article, index) => (
                            <Link
                                key={article.slug}
                                href={`/articles/${article.slug}`}
                                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 bg-[#0f172a] border border-[#1e293b] shadow-lg hover:border-amber-500/30 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]"
                            >
                                <article
                                    className="flex flex-col h-full"
                                    itemScope
                                    itemType="https://schema.org/Article"
                                >
                                    {/* Cover image */}
                                    <div className="aspect-[16/10] w-full relative overflow-hidden bg-[#0c0e13]">
                                        {/* Hover amber shimmer at top edge */}
                                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                                        <div className="absolute inset-0 p-2">
                                            <ArticleImage
                                                src={article.coverImage as string}
                                                alt={getArticleCoverAlt(article)}
                                                priority={index < 4}
                                                objectFit="contain"
                                                variant="card"
                                                className="scale-100"
                                            />
                                        </div>
                                        {/* Category badge */}
                                        <div className="absolute top-2.5 right-2.5 max-w-[calc(100%-1rem)] truncate px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold z-10 tracking-wide bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg">
                                            {article.category}
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="p-4 flex flex-col flex-grow relative bg-[#0f172a]">
                                        {/* Date row */}
                                        <div className="flex items-center gap-1.5 mb-3 text-slate-400">
                                            <Calendar size={11} className="shrink-0" />
                                            <time
                                                dateTime={new Date(parseThaiDate(article.date)).toISOString()}
                                                itemProp="datePublished"
                                                className="text-[11px] truncate"
                                            >
                                                {new Date(parseThaiDate(article.date)).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </time>
                                        </div>

                                        {/* Title */}
                                        <h2
                                            className="text-sm font-bold mb-2 leading-snug line-clamp-3 sm:line-clamp-2 transition-colors duration-200 text-slate-100"
                                            itemProp="headline"
                                        >
                                            <span className="group-hover:text-amber-400 transition-colors duration-200">{article.title}</span>
                                        </h2>

                                        {/* Excerpt */}
                                        <p
                                            className="text-xs leading-relaxed mb-4 line-clamp-2 text-slate-300"
                                            itemProp="description"
                                        >
                                            {article.excerpt}
                                        </p>
                                        <meta itemProp="url" content={`${baseUrl}/articles/${article.slug}`} />
                                        <meta itemProp="author" content={article.author || 'NameMongkol'} />

                                        {/* Footer row */}
                                        <div className="flex mt-auto pt-3 items-center justify-between border-t border-slate-700/50">
                                            <span className="text-xs font-semibold tracking-wide transition-colors duration-200 text-amber-400 group-hover:text-amber-300">
                                                อ่านเพิ่มเติม →
                                            </span>
                                            <span className="text-[10px] text-slate-500" itemProp="author">{article.author}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {visibleArticles.length === 0 && (
                        <div className="mx-auto max-w-xl rounded-2xl px-6 py-12 text-center border" style={{ background: '#ffffff', borderColor: '#ddddf0', color: '#8e8eaa' }}>
                            <p className="text-base" style={{ color: '#1a1a3e' }}>ยังไม่พบบทความที่ตรงกับตัวกรองนี้</p>
                            <Link href="/articles" className="mt-4 inline-flex rounded-full border px-4 py-2 text-sm font-medium transition" style={{ borderColor: 'rgba(201,147,58,0.35)', background: 'rgba(201,147,58,0.08)', color: '#c9933a' }}>
                                ดูบทความทั้งหมด
                            </Link>
                        </div>
                    )}

                    {/* SEO Content Section - FAQ (speakable target for AI assistants) */}
                    <section className="faq-section max-w-4xl mx-auto mt-16 pt-12" style={{ borderTop: '1px solid #ddddf0' }} aria-labelledby="faq-heading">
                        <h2 id="faq-heading" className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#1a1a3e' }}>
                            <span className="text-3xl">❓</span>
                            คำถามที่พบบ่อยเกี่ยวกับการตั้งชื่อมงคล
                        </h2>

                        <div className="space-y-4">
                            <details className="rounded-xl overflow-hidden group border" style={{ background: '#ffffff', borderColor: '#ddddf0' }}>
                                <summary className="p-5 cursor-pointer font-medium hover:bg-[#f8f8fc] transition-colors flex items-center justify-between" style={{ color: '#1a1a3e' }}>
                                    <span>ตั้งชื่อลูกควรใช้หลักอะไรบ้าง?</span>
                                    <span style={{ color: '#9b8ec4' }} className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 leading-relaxed" style={{ color: '#5a5a82' }}>
                                    <p>การตั้งชื่อลูกควรใช้หลักสำคัญ 4 ประการ:</p>
                                    <ul className="mt-3 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><span style={{ color: '#c9933a' }}>1.</span> <strong style={{ color: '#1a1a3e' }}>เลขศาสตร์:</strong> คำนวณผลรวมชื่อให้ตกเลขมงคล เช่น 14, 15, 24, 32, 36, 41, 45, 59</li>
                                        <li className="flex items-start gap-2"><span style={{ color: '#c9933a' }}>2.</span> <strong style={{ color: '#1a1a3e' }}>ทักษาปกรณ์:</strong> เลือกอักษรนำหน้าชื่อที่ตรงกับหลักทักษาดี เช่น บริวาร ศรี เดช อายุ</li>
                                        <li className="flex items-start gap-2"><span style={{ color: '#c9933a' }}>3.</span> <strong style={{ color: '#1a1a3e' }}>อายตนะ 6:</strong> ดูความสมดุลของพลังชีวิต 6 ด้าน ได้แก่ สุขภาพ การเงิน ความรัก หน้าที่การงาน สติปัญญา และบารมี</li>
                                        <li className="flex items-start gap-2"><span style={{ color: '#c9933a' }}>4.</span> <strong style={{ color: '#1a1a3e' }}>หลีกเลี่ยงกาลกิณี:</strong> ไม่ใช้อักษรกาลกิณีประจำวันเกิดของลูก</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="rounded-xl overflow-hidden group border" style={{ background: '#ffffff', borderColor: '#ddddf0' }}>
                                <summary className="p-5 cursor-pointer font-medium hover:bg-[#f8f8fc] transition-colors flex items-center justify-between" style={{ color: '#1a1a3e' }}>
                                    <span>เลขศาสตร์ชื่อคืออะไร? คำนวณอย่างไร?</span>
                                    <span style={{ color: '#9b8ec4' }} className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 leading-relaxed" style={{ color: '#5a5a82' }}>
                                    <p><strong style={{ color: '#1a1a3e' }}>เลขศาสตร์ชื่อ</strong> คือการคำนวณค่าตัวเลขจากพยัญชนะและสระในชื่อ โดยแต่ละตัวอักษรมีค่าตัวเลขกำหนดไว้ เช่น ก=1, ข=2, ค=3 ฯลฯ</p>
                                    <p className="mt-3">นำค่าทุกตัวมารวมกัน หากได้เลข 2 หลัก ให้รวมหลักกันจนเหลือหลักเดียว หรือดูทั้งผลรวมสุดท้ายและผลรวมก่อนหน้า</p>
                                    <div className="mt-4 p-4 rounded-lg border" style={{ background: '#f8f8fc', borderColor: '#ddddf0' }}>
                                        <p className="text-sm font-medium mb-2" style={{ color: '#c9933a' }}>ตัวอย่าง: ชื่อ &quot;มงคล&quot;</p>
                                        <p className="text-sm" style={{ color: '#5a5a82' }}>ม(5) + ง(4) + ค(3) + ล(8) = <span style={{ color: '#4caf80' }} className="font-bold">20</span> → 2+0 = <span style={{ color: '#4caf80' }} className="font-bold">2</span></p>
                                    </div>
                                </div>
                            </details>

                            <details className="rounded-xl overflow-hidden group border" style={{ background: '#ffffff', borderColor: '#ddddf0' }}>
                                <summary className="p-5 cursor-pointer font-medium hover:bg-[#f8f8fc] transition-colors flex items-center justify-between" style={{ color: '#1a1a3e' }}>
                                    <span>อักษรกาลกิณีคืออะไร? ของแต่ละวันมีอะไรบ้าง?</span>
                                    <span style={{ color: '#9b8ec4' }} className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 leading-relaxed" style={{ color: '#5a5a82' }}>
                                    <p><strong style={{ color: '#1a1a3e' }}>อักษรกาลกิณี</strong> คือตัวอักษรที่ไม่ควรมีในชื่อตามวันเกิด เพราะจะนำพาความโชคร้าย อุปสรรค หรือโรคภัยมาให้</p>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="border p-3 rounded-lg" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                                            <span className="font-bold" style={{ color: '#dc2626' }}>วันอาทิตย์:</span> ศ ษ ส ห ฬ ฮ
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
                                            <span className="font-bold" style={{ color: '#ea580c' }}>วันจันทร์:</span> อ + สระทั้งหมด
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#fdf2f8', borderColor: '#fbcfe8' }}>
                                            <span className="font-bold" style={{ color: '#db2777' }}>วันอังคาร:</span> ก ข ค ฆ ง
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                            <span className="font-bold" style={{ color: '#16a34a' }}>วันพุธ (กลางวัน):</span> จ ฉ ช ซ ฌ ญ
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#f0fdfa', borderColor: '#99f6e4' }}>
                                            <span className="font-bold" style={{ color: '#0d9488' }}>วันพุธ (กลางคืน/ราหู):</span> บ ป ผ ฝ พ ฟ ภ ม
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#fefce8', borderColor: '#fef08a' }}>
                                            <span className="font-bold" style={{ color: '#ca8a04' }}>วันพฤหัสบดี:</span> ด ต ถ ท ธ น
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                                            <span className="font-bold" style={{ color: '#2563eb' }}>วันศุกร์:</span> ย ร ล ว
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
                                            <span className="font-bold" style={{ color: '#9333ea' }}>วันเสาร์:</span> ฎ ฏ ฐ ฑ ฒ ณ
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <details className="rounded-xl overflow-hidden group border" style={{ background: '#ffffff', borderColor: '#ddddf0' }}>
                                <summary className="p-5 cursor-pointer font-medium hover:bg-[#f8f8fc] transition-colors flex items-center justify-between" style={{ color: '#1a1a3e' }}>
                                    <span>ทักษาปกรณ์ มีหลักอะไรบ้าง?</span>
                                    <span style={{ color: '#9b8ec4' }} className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 leading-relaxed" style={{ color: '#5a5a82' }}>
                                    <p><strong style={{ color: '#1a1a3e' }}>ทักษาปกรณ์</strong> เป็นตำราโบราณที่แบ่งอักษรไทยออกเป็น 8 หมวด ตามวันเกิด:</p>
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div className="border p-3 rounded-lg text-center" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#16a34a' }}>🤝 บริวาร</span>
                                            ลูกหลาน คู่ครอง
                                        </div>
                                        <div className="border p-3 rounded-lg text-center" style={{ background: '#fdf2f8', borderColor: '#fbcfe8' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#db2777' }}>🌸 ศรี</span>
                                            โชคลาภ สำเร็จ
                                        </div>
                                        <div className="border p-3 rounded-lg text-center" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#9333ea' }}>👑 เดช</span>
                                            อำนาจ เกียรติยศ
                                        </div>
                                        <div className="border p-3 rounded-lg text-center" style={{ background: '#f0fdfa', borderColor: '#99f6e4' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#0d9488' }}>💚 อายุ</span>
                                            สุขภาพ อายุยืน
                                        </div>
                                        <div className="border p-3 rounded-lg text-center" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#2563eb' }}>🏛️ มนตรี</span>
                                            ผู้ใหญ่อุปถัมภ์
                                        </div>
                                        <div className="border p-3 rounded-lg text-center" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#dc2626' }}>⛔ กาลกิณี</span>
                                            อักษรต้องห้าม
                                        </div>
                                        <div className="border p-3 rounded-lg text-center" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#d97706' }}>💪 อุตสาหะ</span>
                                            ความขยัน มานะ
                                        </div>
                                        <div className="border p-3 rounded-lg text-center" style={{ background: '#fefce8', borderColor: '#fef08a' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#ca8a04' }}>💰 มูละ</span>
                                            ทรัพย์สิน มรดก
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm">แต่ละวันเกิดจะมีอักษรที่เหมาะสมต่างกัน ต้องตรวจสอบว่าอักษรนำในชื่อตรงกับหมวดที่ต้องการเสริม</p>
                                </div>
                            </details>

                            <details className="rounded-xl overflow-hidden group border" style={{ background: '#ffffff', borderColor: '#ddddf0' }}>
                                <summary className="p-5 cursor-pointer font-medium hover:bg-[#f8f8fc] transition-colors flex items-center justify-between" style={{ color: '#1a1a3e' }}>
                                    <span>เปลี่ยนชื่อแก้ดวงได้จริงไหม?</span>
                                    <span style={{ color: '#9b8ec4' }} className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 leading-relaxed" style={{ color: '#5a5a82' }}>
                                    <p>ตามความเชื่อทางโหราศาสตร์และเลขศาสตร์ <strong style={{ color: '#1a1a3e' }}>ชื่อมีพลังที่ส่งผลต่อชีวิต</strong> เพราะถูกเรียกใช้ทุกวัน สร้างคลื่นพลังงานส่งผลต่อจิตใต้สำนึก</p>
                                    <p className="mt-3">การเปลี่ยนชื่อจึงเปรียบเหมือนการ &quot;ปรับคลื่นพลังชีวิตใหม่&quot; แต่ต้องเลือกชื่อใหม่ที่ถูกหลักทุกด้าน:</p>
                                    <ul className="mt-3 space-y-1 text-sm">
                                        <li>✓ ผลรวมเลขศาสตร์เป็นมงคล</li>
                                        <li>✓ ไม่มีอักษรกาลกิณี</li>
                                        <li>✓ อักษรนำตรงหลักทักษาที่ดี</li>
                                        <li>✓ ความหมายเป็นมงคล ไม่มีคำพ้องเสียงที่ไม่ดี</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="rounded-xl overflow-hidden group border" style={{ background: '#ffffff', borderColor: '#ddddf0' }}>
                                <summary className="p-5 cursor-pointer font-medium hover:bg-[#f8f8fc] transition-colors flex items-center justify-between" style={{ color: '#1a1a3e' }}>
                                    <span>NameMongkol วิเคราะห์ชื่อด้วยหลักอะไรบ้าง?</span>
                                    <span style={{ color: '#9b8ec4' }} className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 leading-relaxed" style={{ color: '#5a5a82' }}>
                                    <p>ระบบ AI ของ <strong style={{ color: '#1a1a3e' }}>NameMongkol</strong> วิเคราะห์ชื่อครบ 4 ศาสตร์หลัก:</p>
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="border p-3 rounded-lg" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#9333ea' }}>📊 เลขศาสตร์</span>
                                            คำนวณผลรวมและตีความเลข
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#d97706' }}>📜 ทักษาปกรณ์</span>
                                            วิเคราะห์หลักอักษรตามวันเกิด
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#16a34a' }}>⚡ อายตนะ 6</span>
                                            ดูความสมดุล 6 ด้านของชีวิต
                                        </div>
                                        <div className="border p-3 rounded-lg" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                                            <span className="font-bold block mb-1" style={{ color: '#2563eb' }}>🤖 AI Analysis</span>
                                            คำแนะนำเฉพาะบุคคล
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="max-w-4xl mx-auto mt-16 rounded-2xl p-8 text-center border" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #eeebf8 100%)', borderColor: '#ddddf0', boxShadow: '0 4px 24px rgba(201,147,58,0.10)' }}>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1a1a3e' }}>
                            อยากรู้ว่าชื่อของคุณเป็นมงคลไหม?
                        </h2>
                        <p className="mb-6 max-w-2xl mx-auto" style={{ color: '#5a5a82' }}>
                            ใช้ระบบ AI วิเคราะห์ชื่อมงคลฟรี! ตรวจสอบเลขศาสตร์ ทักษา อายตนะ 6 และอักษรกาลกิณีได้ภายในไม่กี่วินาที
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/name-check" className="wtp-button-primary inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full transition-all hover:scale-105">
                                <span>วิเคราะห์ชื่อมงคลฟรี</span>
                                <ArrowLeft size={18} className="rotate-180" />
                            </Link>
                            <Link href="/premium-search" className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-full transition-all border" style={{ background: '#ffffff', borderColor: '#ddddf0', color: '#1a1a3e' }}>
                                <span>👑 ค้นหาชื่อมงคล Premium</span>
                            </Link>
                        </div>
                    </section>
                </main>
            </SoftYellowGlowBackground>
        </>
    );
}
