import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { unstable_cache } from 'next/cache';
import { supabase } from '@/utils/supabase';
import { Calendar, ArrowLeft, Search, BookOpen } from 'lucide-react';
import { articles as localArticles } from '@/data/articles';
import { shimmer, toBase64 } from '@/utils/imageUtils';
import { ArticleImage } from '@/components/ArticleImage';
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

// ISR: cache 1 hour, invalidate via revalidateTag('articles') when admin updates
export const revalidate = 3600;

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

async function fetchArticlesFromDb() {
    try {
        const { data: articles } = await supabase
            .from('articles')
            .select('*')
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
    { revalidate: 3600, tags: ['articles'] }
);

// Old Thai slug → New English slug redirect map
const SLUG_REDIRECTS: Record<string, string> = {
    'ตั้งชื่อลูก-2569-คู่มือสมบูรณ์': 'baby-naming-guide-2569',
    'ทักษา-ปกรณ์-ตั้งชื่อลูกให้ตรงจุด': 'thaksa-pakorn-naming-guide',
    'เบอร์มงคล-วิธีเลือก-คู่เลขเสริมดวง': 'lucky-phone-numbers-guide-2569',
    'ชื่อลูกสาว-2569-50-ชื่อมงคล': 'girl-names-2569-50-auspicious',
    'ชื่อลูกชาย-2569-50-ชื่อมงคล': 'boy-names-2569-50-auspicious',
};

async function getArticles() {
    const dbArticles = await getCachedDbArticles();

    // Enhance DB articles with local data (fallback for images + slug migration)
    const enrichedDbArticles = dbArticles.map(dbArticle => {
        // Try to find local match by slug first, then by title (for migrated slugs)
        const localMatch = localArticles.find(a => a.slug === dbArticle.slug)
            || localArticles.find(a => a.title === dbArticle.title);
        const dbImage = dbArticle.cover_image || dbArticle.coverImage;
        const localImage = localMatch?.coverImage;

        // DB-first: always use image edited via admin when present,
        // fallback to local static image only if DB image is empty.
        const finalImage = dbImage || localImage || '';

        // If the DB slug is old (Thai) and we have a redirect, use the new English slug
        const migratedSlug = SLUG_REDIRECTS[dbArticle.slug as string] || (localMatch ? localMatch.slug : dbArticle.slug);

        return {
            ...dbArticle,
            slug: migratedSlug,
            coverImage: finalImage,
            coverImageAlt: dbArticle.cover_image_alt || localMatch?.coverImageAlt || '',
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

export default async function ArticlesPage() {
    const articles = await getArticles();

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
        'dateModified': (() => { const dates = articles.map(a => { try { return new Date(a.date).getTime(); } catch { return 0; } }).filter(d => d > 0); return dates.length ? new Date(Math.max(...dates)).toISOString() : new Date().toISOString(); })(),
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
                    'dateModified': article.date,
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
            <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden pb-28">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                </div>

                <main className="w-full max-w-[1400px] px-4 pb-8 relative z-10 pt-28 md:pt-32">
                    {/* Breadcrumb */}
                    <nav className="max-w-4xl mx-auto mb-6 text-sm text-slate-400" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/" className="hover:text-white transition-colors">หน้าหลัก</Link></li>
                            <li className="text-slate-600">/</li>
                            <li className="text-purple-400 font-medium">บทความชื่อมงคล</li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={16} />
                            กลับหน้าหลัก
                        </Link>

                        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                            บทความชื่อมงคล
                        </h1>
                        <p className="text-slate-300 text-lg mb-4">
                            รวมบทความศาสตร์มงคล เคล็ดลับการตั้งชื่อ และเกร็ดความรู้เพื่อชีวิตที่ดีกว่า
                        </p>

                        {/* SEO Rich Content Introduction – speakable target for AI assistants */}
                        <div className="articles-intro bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                                <BookOpen size={20} />
                                คลังความรู้การตั้งชื่อครบวงจร
                            </h2>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                ยินดีต้อนรับสู่คลังบทความ <strong className="text-white">NameMongkol</strong> แหล่งรวมความรู้ด้านศาสตร์การตั้งชื่อที่ครบถ้วนและอัปเดตต่อเนื่อง
                                ไม่ว่าคุณกำลังมองหา <strong className="text-amber-300">ชื่อมงคลสำหรับลูกน้อย</strong> ต้องการเรียนรู้หลัก <strong className="text-amber-300">เลขศาสตร์</strong> และ <strong className="text-amber-300">ทักษาปกรณ์</strong>
                                หรือกำลังพิจารณา <strong className="text-amber-300">เปลี่ยนชื่อเสริมดวง</strong> เรามีบทความครอบคลุมทุกหัวข้อ
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-purple-400">{articles.length}+</div>
                                    <div className="text-slate-400">บทความ</div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-amber-400">500+</div>
                                    <div className="text-slate-400">ตัวอย่างชื่อ</div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-emerald-400">7</div>
                                    <div className="text-slate-400">หมวดหมู่</div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-400">ต่อเนื่อง</div>
                                    <div className="text-slate-400">อัปเดตล่าสุด</div>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <form role="search" aria-label="ค้นหาบทความชื่อมงคล" action="/search" method="GET" className="mt-8 relative max-w-lg">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="search"
                                name="q"
                                placeholder="ค้นหาบทความ... เช่น ชื่อลูกชาย, เลขศาสตร์, ทักษา"
                                aria-label="ค้นหาบทความ"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-transparent outline-none transition-all"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors">
                                <Search size={16} />
                            </button>
                        </form>
                    </div>

                    {/* Grid — 1 col mobile / 2 col tablet / 4 col desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1400px] mx-auto">
                        {articles.map((article, index) => (
                            <Link
                                key={article.slug}
                                href={`/articles/${article.slug}`}
                                className="group bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/25 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/15"
                            >
                                <article
                                    className="flex flex-col h-full"
                                    itemScope
                                    itemType="https://schema.org/Article"
                                >
                                    <div className="aspect-video w-full bg-slate-800 relative overflow-hidden">
                                        <ArticleImage
                                            src={article.coverImage as string}
                                            alt={(article as any).coverImageAlt || `บทความ: ${article.title} - เคล็ดลับตั้งชื่อมงคล`}
                                            priority={index < 4}
                                            className="group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60" />
                                        <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-medium border border-white/10 z-10">
                                            {article.category}
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow relative bg-[#0f172a] group-hover:bg-[#131c33] transition-colors">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2.5">
                                            <Calendar size={11} />
                                            <time
                                                dateTime={new Date(parseThaiDate(article.date)).toISOString()}
                                                itemProp="datePublished"
                                            >
                                                {new Date(parseThaiDate(article.date)).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </time>
                                        </div>

                                        <h2 className="text-sm font-bold text-slate-100 mb-2 leading-snug group-hover:text-purple-400 transition-colors line-clamp-2" itemProp="headline">
                                            {article.title}
                                        </h2>

                                        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2" itemProp="description">
                                            {article.excerpt}
                                        </p>
                                        <meta itemProp="url" content={`${baseUrl}/articles/${article.slug}`} />
                                        <meta itemProp="author" content={article.author || 'NameMongkol'} />

                                        <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-purple-400 text-xs font-medium group-hover:underline decoration-purple-500/30 underline-offset-4">อ่านเพิ่มเติม →</span>
                                            <span className="text-slate-600 text-[10px]" itemProp="author">{article.author}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {articles.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            <p>ยังไม่มีบทความในขณะนี้</p>
                        </div>
                    )}

                    {/* SEO Content Section - FAQ (speakable target for AI assistants) */}
                    <section className="faq-section max-w-4xl mx-auto mt-16 border-t border-slate-700/50 pt-12" aria-labelledby="faq-heading">
                        <h2 id="faq-heading" className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <span className="text-3xl">❓</span>
                            คำถามที่พบบ่อยเกี่ยวกับการตั้งชื่อมงคล
                        </h2>

                        <div className="space-y-4">
                            <details className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group">
                                <summary className="p-5 cursor-pointer font-medium text-white hover:bg-slate-700/30 transition-colors flex items-center justify-between">
                                    <span>ตั้งชื่อลูกควรใช้หลักอะไรบ้าง?</span>
                                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 text-slate-300 leading-relaxed">
                                    <p>การตั้งชื่อลูกควรใช้หลักสำคัญ 4 ประการ:</p>
                                    <ul className="mt-3 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><span className="text-amber-400">1.</span> <strong>เลขศาสตร์:</strong> คำนวณผลรวมชื่อให้ตกเลขมงคล เช่น 14, 15, 24, 32, 36, 41, 45, 59</li>
                                        <li className="flex items-start gap-2"><span className="text-amber-400">2.</span> <strong>ทักษาปกรณ์:</strong> เลือกอักษรนำหน้าชื่อที่ตรงกับหลักทักษาดี เช่น บริวาร ศรี เดช อายุ</li>
                                        <li className="flex items-start gap-2"><span className="text-amber-400">3.</span> <strong>อายตนะ 6:</strong> ดูความสมดุลของพลังชีวิต 6 ด้าน ได้แก่ สุขภาพ การเงิน ความรัก หน้าที่การงาน สติปัญญา และบารมี</li>
                                        <li className="flex items-start gap-2"><span className="text-amber-400">4.</span> <strong>หลีกเลี่ยงกาลกิณี:</strong> ไม่ใช้อักษรกาลกิณีประจำวันเกิดของลูก</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group">
                                <summary className="p-5 cursor-pointer font-medium text-white hover:bg-slate-700/30 transition-colors flex items-center justify-between">
                                    <span>เลขศาสตร์ชื่อคืออะไร? คำนวณอย่างไร?</span>
                                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 text-slate-300 leading-relaxed">
                                    <p><strong>เลขศาสตร์ชื่อ</strong> คือการคำนวณค่าตัวเลขจากพยัญชนะและสระในชื่อ โดยแต่ละตัวอักษรมีค่าตัวเลขกำหนดไว้ เช่น ก=1, ข=2, ค=3 ฯลฯ</p>
                                    <p className="mt-3">นำค่าทุกตัวมารวมกัน หากได้เลข 2 หลัก ให้รวมหลักกันจนเหลือหลักเดียว หรือดูทั้งผลรวมสุดท้ายและผลรวมก่อนหน้า</p>
                                    <div className="mt-4 bg-slate-900/50 p-4 rounded-lg">
                                        <p className="text-sm text-amber-400 font-medium mb-2">ตัวอย่าง: ชื่อ &quot;มงคล&quot;</p>
                                        <p className="text-sm">ม(5) + ง(4) + ค(3) + ล(8) = <span className="text-emerald-400 font-bold">20</span> → 2+0 = <span className="text-emerald-400 font-bold">2</span></p>
                                    </div>
                                </div>
                            </details>

                            <details className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group">
                                <summary className="p-5 cursor-pointer font-medium text-white hover:bg-slate-700/30 transition-colors flex items-center justify-between">
                                    <span>อักษรกาลกิณีคืออะไร? ของแต่ละวันมีอะไรบ้าง?</span>
                                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 text-slate-300 leading-relaxed">
                                    <p><strong>อักษรกาลกิณี</strong> คือตัวอักษรที่ไม่ควรมีในชื่อตามวันเกิด เพราะจะนำพาความโชคร้าย อุปสรรค หรือโรคภัยมาให้</p>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                                            <span className="text-red-400 font-bold">วันอาทิตย์:</span> ศ ษ ส ห ฬ ฮ
                                        </div>
                                        <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg">
                                            <span className="text-orange-400 font-bold">วันจันทร์:</span> อ + สระทั้งหมด
                                        </div>
                                        <div className="bg-pink-500/10 border border-pink-500/20 p-3 rounded-lg">
                                            <span className="text-pink-400 font-bold">วันอังคาร:</span> ก ข ค ฆ ง
                                        </div>
                                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                                            <span className="text-green-400 font-bold">วันพุธ (กลางวัน):</span> จ ฉ ช ซ ฌ ญ
                                        </div>
                                        <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-lg">
                                            <span className="text-teal-400 font-bold">วันพุธ (กลางคืน/ราหู):</span> บ ป ผ ฝ พ ฟ ภ ม
                                        </div>
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                                            <span className="text-yellow-400 font-bold">วันพฤหัสบดี:</span> ด ต ถ ท ธ น
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                                            <span className="text-blue-400 font-bold">วันศุกร์:</span> ย ร ล ว
                                        </div>
                                        <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                                            <span className="text-purple-400 font-bold">วันเสาร์:</span> ฎ ฏ ฐ ฑ ฒ ณ
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <details className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group">
                                <summary className="p-5 cursor-pointer font-medium text-white hover:bg-slate-700/30 transition-colors flex items-center justify-between">
                                    <span>ทักษาปกรณ์ มีหลักอะไรบ้าง?</span>
                                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 text-slate-300 leading-relaxed">
                                    <p><strong>ทักษาปกรณ์</strong> เป็นตำราโบราณที่แบ่งอักษรไทยออกเป็น 8 หมวด ตามวันเกิด:</p>
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-center">
                                            <span className="text-emerald-400 font-bold block mb-1">🤝 บริวาร</span>
                                            ลูกหลาน คู่ครอง
                                        </div>
                                        <div className="bg-pink-500/10 border border-pink-500/20 p-3 rounded-lg text-center">
                                            <span className="text-pink-400 font-bold block mb-1">🌸 ศรี</span>
                                            โชคลาภ สำเร็จ
                                        </div>
                                        <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg text-center">
                                            <span className="text-purple-400 font-bold block mb-1">👑 เดช</span>
                                            อำนาจ เกียรติยศ
                                        </div>
                                        <div className="bg-teal-500/10 border border-teal-500/20 p-3 rounded-lg text-center">
                                            <span className="text-teal-400 font-bold block mb-1">💚 อายุ</span>
                                            สุขภาพ อายุยืน
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-center">
                                            <span className="text-blue-400 font-bold block mb-1">🏛️ มนตรี</span>
                                            ผู้ใหญ่อุปถัมภ์
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center">
                                            <span className="text-red-400 font-bold block mb-1">⛔ กาลกิณี</span>
                                            อักษรต้องห้าม
                                        </div>
                                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-center">
                                            <span className="text-amber-400 font-bold block mb-1">💪 อุตสาหะ</span>
                                            ความขยัน มานะ
                                        </div>
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-center">
                                            <span className="text-yellow-400 font-bold block mb-1">💰 มูละ</span>
                                            ทรัพย์สิน มรดก
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm">แต่ละวันเกิดจะมีอักษรที่เหมาะสมต่างกัน ต้องตรวจสอบว่าอักษรนำในชื่อตรงกับหมวดที่ต้องการเสริม</p>
                                </div>
                            </details>

                            <details className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group">
                                <summary className="p-5 cursor-pointer font-medium text-white hover:bg-slate-700/30 transition-colors flex items-center justify-between">
                                    <span>เปลี่ยนชื่อแก้ดวงได้จริงไหม?</span>
                                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 text-slate-300 leading-relaxed">
                                    <p>ตามความเชื่อทางโหราศาสตร์และเลขศาสตร์ <strong>ชื่อมีพลังที่ส่งผลต่อชีวิต</strong> เพราะถูกเรียกใช้ทุกวัน สร้างคลื่นพลังงานส่งผลต่อจิตใต้สำนึก</p>
                                    <p className="mt-3">การเปลี่ยนชื่อจึงเปรียบเหมือนการ &quot;ปรับคลื่นพลังชีวิตใหม่&quot; แต่ต้องเลือกชื่อใหม่ที่ถูกหลักทุกด้าน:</p>
                                    <ul className="mt-3 space-y-1 text-sm">
                                        <li>✓ ผลรวมเลขศาสตร์เป็นมงคล</li>
                                        <li>✓ ไม่มีอักษรกาลกิณี</li>
                                        <li>✓ อักษรนำตรงหลักทักษาที่ดี</li>
                                        <li>✓ ความหมายเป็นมงคล ไม่มีคำพ้องเสียงที่ไม่ดี</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group">
                                <summary className="p-5 cursor-pointer font-medium text-white hover:bg-slate-700/30 transition-colors flex items-center justify-between">
                                    <span>NameMongkol วิเคราะห์ชื่อด้วยหลักอะไรบ้าง?</span>
                                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-5 pt-0 text-slate-300 leading-relaxed">
                                    <p>ระบบ AI ของ <strong>NameMongkol</strong> วิเคราะห์ชื่อครบ 4 ศาสตร์หลัก:</p>
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                                            <span className="text-purple-400 font-bold block mb-1">📊 เลขศาสตร์</span>
                                            คำนวณผลรวมและตีความเลข
                                        </div>
                                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                                            <span className="text-amber-400 font-bold block mb-1">📜 ทักษาปกรณ์</span>
                                            วิเคราะห์หลักอักษรตามวันเกิด
                                        </div>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                                            <span className="text-emerald-400 font-bold block mb-1">⚡ อายตนะ 6</span>
                                            ดูความสมดุล 6 ด้านของชีวิต
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                                            <span className="text-blue-400 font-bold block mb-1">🤖 AI Analysis</span>
                                            คำแนะนำเฉพาะบุคคล
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-amber-900/30 to-slate-900/60 border border-amber-500/25 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            อยากรู้ว่าชื่อของคุณเป็นมงคลไหม?
                        </h2>
                        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                            ใช้ระบบ AI วิเคราะห์ชื่อมงคลฟรี! ตรวจสอบเลขศาสตร์ ทักษา อายตนะ 6 และอักษรกาลกิณีได้ภายในไม่กี่วินาที
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/name-check" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-amber-900/40">
                                <span>วิเคราะห์ชื่อมงคลฟรี</span>
                                <ArrowLeft size={18} className="rotate-180" />
                            </Link>
                            <Link href="/premium-search" className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-full transition-all">
                                <span>👑 ค้นหาชื่อมงคล Premium</span>
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
