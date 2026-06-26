
import Link from 'next/link';
import Script from 'next/script';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag, RefreshCw, BookOpen, Award, ExternalLink, Star, CheckCircle2, Compass, Link2 } from 'lucide-react';
import { Metadata } from 'next';
import { ArticleImage } from '@/components/ArticleImage';
import dynamic from 'next/dynamic';
import { unstable_cache } from 'next/cache';

const ArticleShareButtons = dynamic(() => import('@/components/ArticleShareButtons').then(mod => mod.ArticleShareButtons), {
    loading: () => <div className="h-10 w-24 bg-slate-200/50 rounded-full animate-pulse" />
});

const ArticleCTA = dynamic(() => import('@/components/ArticleCTA').then(mod => mod.ArticleCTA), {
    loading: () => <div className="h-64 bg-slate-200/50 rounded-2xl animate-pulse" />
});

const AuraVibeWidget = dynamic(() => import('@/components/AuraVibeWidget'), {
    loading: () => <div className="h-48 bg-slate-200/50 rounded-2xl animate-pulse my-10 max-w-xl mx-auto" />
});
import { articles as localArticles, Article } from '@/data/articles';
import {
    PALMISTRY_SLUG,
    palmistryToc,
    palmistryFaqItems,
    palmistryRelatedSlugs,
    palmistryMetaOverrides,
} from '@/data/palmistry-seo-config';

// Old Thai slug → New English slug redirect map
const SLUG_REDIRECTS: Record<string, string> = {
    'ตั้งชื่อลูก-2569-คู่มือสมบูรณ์': 'baby-naming-guide-2569',
    'ทักษา-ปกรณ์-ตั้งชื่อลูกให้ตรงจุด': 'thaksa-pakorn-naming-guide',
    'เบอร์มงคล-วิธีเลือก-คู่เลขเสริมดวง': 'lucky-phone-numbers-guide-2569',
    'ชื่อลูกสาว-2569-50-ชื่อมงคล': 'girl-names-2569-50-auspicious',
    'ชื่อลูกชาย-2569-50-ชื่อมงคล': 'boy-names-2569-50-auspicious',
};

const LOCAL_PRIORITY_ARTICLE_SLUGS = new Set(['boy-names-wednesday-night-2569']);

// ISR: cache 24 hours, invalidate on demand via revalidateTag('articles') when admin updates
export const revalidate = 86400;

type Props = {
    params: Promise<{ slug: string }>;
};

type DbArticleRow = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string;
    cover_image_alt: string | null;
    date: string;
    author: string;
    category: string;
    keywords: string[];
    meta_title: string | null;
    meta_description: string | null;
    related_slugs: string[] | null;
    toc: Article['toc'] | null;
    faq_items: Article['faqItems'] | null;
    date_modified: string | null;
};

type DbArticleSummaryRow = Omit<DbArticleRow, 'content' | 'related_slugs' | 'toc' | 'faq_items'>;

import { supabase } from '@/utils/supabase';
import { siteUrl } from '@/lib/seo';
import { absoluteSiteUrl, getArticleImages, toArticleImageObject } from '@/lib/articleImageMeta';

function resolveArticleCoverImage(dbImage?: string | null, localImage?: string) {
    const image = dbImage?.trim() || '';

    if (!image) return localImage || '';

    const isLegacyLocalArticlePath = image.startsWith('/images/article/') || image.startsWith('/images/article-');
    if (isLegacyLocalArticlePath && localImage) return localImage;

    return image;
}

async function fetchPublishedArticlesDb(): Promise<Article[]> {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true);

    if (error || !data) return [];

    const rows = data as DbArticleRow[];

    return rows.map((item) => {
        const localMatch = localArticles.find((article) => article.slug === item.slug)
            || localArticles.find((article) => article.title === item.title);

        if (localMatch && LOCAL_PRIORITY_ARTICLE_SLUGS.has(localMatch.slug)) {
            return localMatch;
        }

        return ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content || localMatch?.content || '',
        coverImage: resolveArticleCoverImage(item.cover_image, localMatch?.coverImage),
        coverImageAlt: item.cover_image_alt ?? localMatch?.coverImageAlt,
        date: item.date,
        author: item.author,
        category: item.category,
        keywords: item.keywords,
        images: localMatch?.images ?? [],
        metaTitle: item.meta_title || localMatch?.metaTitle,
        metaDescription: item.meta_description || localMatch?.metaDescription,
        relatedSlugs: item.related_slugs?.length ? item.related_slugs : (localMatch?.relatedSlugs ?? []),
        toc: item.toc?.length ? item.toc : (localMatch?.toc ?? []),
        faqItems: item.faq_items?.length ? item.faq_items : (localMatch?.faqItems ?? []),
        dateModified: item.date_modified || localMatch?.dateModified || item.date,
        });
    });
}

async function fetchPublishedArticleSummariesDb(): Promise<Article[]> {
    const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, excerpt, cover_image, cover_image_alt, date, author, category, keywords, meta_title, meta_description, date_modified')
        .eq('is_published', true);

    if (error || !data) return [];

    const rows = data as DbArticleSummaryRow[];

    return rows.map((item) => {
        const localMatch = localArticles.find((article) => article.slug === item.slug)
            || localArticles.find((article) => article.title === item.title);

        if (localMatch && LOCAL_PRIORITY_ARTICLE_SLUGS.has(localMatch.slug)) {
            return localMatch;
        }

        return {
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt,
            content: '',
            coverImage: resolveArticleCoverImage(item.cover_image, localMatch?.coverImage),
            coverImageAlt: item.cover_image_alt ?? localMatch?.coverImageAlt,
            date: item.date,
            author: item.author,
            category: item.category,
            keywords: item.keywords ?? [],
            images: localMatch?.images ?? [],
            metaTitle: item.meta_title || localMatch?.metaTitle,
            metaDescription: item.meta_description || localMatch?.metaDescription,
            relatedSlugs: [],
            toc: [],
            faqItems: [],
            dateModified: item.date_modified || localMatch?.dateModified || item.date,
        };
    });
}

// Cache only lightweight article summaries for related cards.
const getPublishedArticleSummariesDb = unstable_cache(
    fetchPublishedArticleSummariesDb,
    ['articles-detail-summary-list'],
    { revalidate: 86400, tags: ['articles'] }
);

async function getRelatedArticlePool(): Promise<Article[]> {
    const dbArticles = await getPublishedArticleSummariesDb();
    
    // Deduplicate dbArticles by slug (keep first occurrence) just in case DB returns multiple
    const uniqueDbArticlesMap = new Map<string, Article>();
    for (const article of dbArticles) {
        if (!uniqueDbArticlesMap.has(article.slug)) {
            uniqueDbArticlesMap.set(article.slug, article);
        }
    }
    const uniqueDbArticles = Array.from(uniqueDbArticlesMap.values());

    const existingSlugs = new Set(uniqueDbArticles.map((article) => article.slug));
    const existingTitles = new Set(uniqueDbArticles.map((article) => article.title));
    const localFallback = localArticles.filter((article) => !existingSlugs.has(article.slug) && !existingTitles.has(article.title));
    return [...uniqueDbArticles, ...localFallback];
}

// Pre-render all known article pages at build time
export async function generateStaticParams() {
    try {
        const dbArticles = await fetchPublishedArticlesDb();
        const allSlugs = new Set([
            ...dbArticles.map(a => a.slug),
            ...localArticles.map(a => a.slug),
        ]);
        return Array.from(allSlugs).map(slug => ({ slug }));
    } catch {
        // Fallback to local articles only if DB is unavailable during build
        return localArticles.map(a => ({ slug: a.slug }));
    }
}

// DB-first article fetch for detail page
const getArticle = async (slug: string): Promise<Article | null> => {
    const localMatch = localArticles.find(a => a.slug === slug);

    if (localMatch && LOCAL_PRIORITY_ARTICLE_SLUGS.has(slug)) {
        return localMatch;
    }

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        // Fallback to local articles
        return localMatch || null;
    }

    // Map Supabase snake_case to Article camelCase
    const mapped: Article = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content || localMatch?.content || '',
        coverImage: resolveArticleCoverImage(data.cover_image, localMatch?.coverImage), // Map here
        coverImageAlt: data.cover_image_alt || localMatch?.coverImageAlt,
        date: data.date,
        author: data.author,
        category: data.category,
        keywords: data.keywords,
        images: localMatch?.images ?? [],
        metaTitle: data.meta_title || localMatch?.metaTitle, // Map here
        metaDescription: data.meta_description || localMatch?.metaDescription, // Map here
        // DB columns for these are nullable; fallback to empty
        relatedSlugs: data.related_slugs?.length ? data.related_slugs : (localMatch?.relatedSlugs ?? []),
        toc: data.toc?.length ? data.toc : (localMatch?.toc ?? []),
        faqItems: data.faq_items?.length ? data.faq_items : (localMatch?.faqItems ?? []),
        dateModified: data.date_modified || localMatch?.dateModified || data.date,
    };

    // ── Palmistry-specific SEO enrichment (single-slug gating) ──
    if (slug === PALMISTRY_SLUG) {
        // Use curated TOC if DB doesn't have one
        if (!mapped.toc || mapped.toc.length === 0) {
            mapped.toc = palmistryToc;
        }
        // Use curated FAQ if DB doesn't have one
        if (!mapped.faqItems || mapped.faqItems.length === 0) {
            mapped.faqItems = palmistryFaqItems;
        }
        // Use curated related slugs if DB doesn't have them
        if (!mapped.relatedSlugs || mapped.relatedSlugs.length === 0) {
            mapped.relatedSlugs = palmistryRelatedSlugs;
        }
        // Apply metadata overrides
        if (!mapped.metaTitle) mapped.metaTitle = palmistryMetaOverrides.metaTitle;
        if (!mapped.metaDescription) mapped.metaDescription = palmistryMetaOverrides.metaDescription;
        mapped.dateModified = palmistryMetaOverrides.dateModified;
    }

    return mapped;
};

function stripHtml(value: string) {
    return value
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function enhanceArticleContent(content: string, toc?: Article['toc']) {
    if (toc && toc.length > 0) {
        return { content, toc };
    }

    let index = 0;
    const generatedToc: NonNullable<Article['toc']> = [];
    const enhancedContent = content.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
        const title = stripHtml(inner);
        if (!title) return match;

        const existingId = String(attrs).match(/\sid=["']([^"']+)["']/i)?.[1];
        const id = existingId || `article-section-${++index}`;

        generatedToc.push({
            title,
            id,
            level: Number(level),
        });

        if (existingId) return match;
        return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    });

    return {
        content: enhancedContent,
        toc: generatedToc.slice(0, 12),
    };
}

function getHtmlAttribute(attrs: string, name: string) {
    const match = attrs.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'));
    return match?.[1] ?? '';
}

function escapeHtmlAttribute(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function normalizeArticleContentHtml(content: string, article: Article, shouldWrapImages: boolean) {
    const normalizedContent = content
        .replace(/bg-clip-text\s+text-transparent\s+bg-gradient-to-r\s+from-[^\s"']+\s+to-[^\s"']+/g, 'text-amber-700')
        .replace(/\bborder-l-4\b/g, 'border')
        .replace(/\bborder-l-[^\s"']+/g, 'border-amber-300/40')
        .replace(/\brounded-r-xl\b/g, 'rounded-xl')
        .replace(/\brounded-r-lg\b/g, 'rounded-lg')
        
        /* --- Text Colors --- */
        .replace(/\btext-white\b/g, 'text-[#1a1a3e]')
        .replace(/\btext-slate-100\b/g, 'text-[#3a3a5e]')
        .replace(/\btext-slate-200\b/g, 'text-[#4a4a6e]')
        .replace(/\btext-slate-300\b/g, 'text-[#5a5a82]')
        .replace(/\btext-slate-400\b/g, 'text-[#6a6a92]')
        .replace(/\btext-amber-100\b/g, 'text-amber-700')
        .replace(/\btext-amber-200\b/g, 'text-amber-700')
        .replace(/\btext-amber-300\b/g, 'text-amber-600')
        .replace(/\btext-amber-400\b/g, 'text-amber-600')
        .replace(/\btext-emerald-200\b/g, 'text-emerald-700')
        .replace(/\btext-emerald-300\b/g, 'text-emerald-600')
        .replace(/\btext-rose-100\b/g, 'text-rose-700')
        .replace(/\btext-rose-200\b/g, 'text-rose-600')
        .replace(/\btext-rose-300\b/g, 'text-rose-600')
        .replace(/\btext-indigo-100\b/g, 'text-indigo-700')
        
        /* --- Gradients --- */
        .replace(/\bbg-gradient-to-br\s+from-slate-950\s+via-slate-900\s+to-indigo-950\b/g, 'bg-gradient-to-br from-[#f0f0f8] to-[#e8e8f4]')
        .replace(/\bbg-gradient-to-r\s+from-emerald-900\/50\s+to-slate-800\b/g, 'bg-slate-100')
        
        /* --- Backgrounds --- */
        .replace(/\bbg-slate-950(\/\d+)?\b/g, 'bg-slate-50')
        .replace(/\bbg-slate-900(\/\d+)?\b/g, 'bg-white')
        .replace(/\bbg-slate-800(\/\d+)?\b/g, 'bg-slate-50')
        .replace(/\bbg-rose-950(\/\d+)?\b/g, 'bg-rose-50')
        .replace(/\bbg-rose-900(\/\d+)?\b/g, 'bg-rose-50')
        .replace(/\bbg-amber-900(\/\d+)?\b/g, 'bg-amber-50')
        .replace(/\bbg-amber-800(\/\d+)?\b/g, 'bg-amber-100')
        .replace(/\bbg-emerald-900(\/\d+)?\b/g, 'bg-emerald-50')
        .replace(/\bbg-indigo-900(\/\d+)?\b/g, 'bg-indigo-50')
        .replace(/\bbg-emerald-500\/5\b/g, 'bg-emerald-50')
        .replace(/\bbg-indigo-400\/10\b/g, 'bg-indigo-50')
        .replace(/\bbg-amber-400\/10\b/g, 'bg-amber-50')
        .replace(/\bbg-\[#0f172a\]/g, 'bg-[#f0f0f8]')
        .replace(/\bbg-\[#0a0f1d\]/g, 'bg-[#f5f5fb]')
        .replace(/\bbg-\[#080d19\]/g, 'bg-[#f5f5fb]')
        .replace(/\bbg-white\/5\b/g, 'bg-white')
        .replace(/\bbg-white\/10\b/g, 'bg-white/80')
        .replace(/\bhover:bg-slate-800(\/\d+)?\b/g, 'hover:bg-slate-100')
        .replace(/\bhover:bg-slate-900(\/\d+)?\b/g, 'hover:bg-slate-100')
        .replace(/\bhover:bg-white\/10\b/g, 'hover:bg-slate-50')
        
        /* --- Borders & Dividers --- */
        .replace(/\bborder-white\/10/g, 'border-slate-200')
        .replace(/\bborder-white\/5/g, 'border-slate-200')
        .replace(/\bborder-slate-700(\/\d+)?\b/g, 'border-slate-200')
        .replace(/\bborder-\[#1e293b\]/g, 'border-slate-200')
        .replace(/\bdivide-slate-700(\/\d+)?\b/g, 'divide-slate-200')
        .replace(/\bborder-rose-500\/30\b/g, 'border-rose-200')
        .replace(/\bborder-rose-300\/20\b/g, 'border-rose-200')
        .replace(/\bborder-emerald-500\/20\b/g, 'border-emerald-200')
        .replace(/\bborder-indigo-400\/25\b/g, 'border-indigo-200');

    if (!shouldWrapImages) {
        return normalizedContent;
    }

    return normalizedContent.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
        const src = getHtmlAttribute(attrs, 'src');
        if (!src) return match;

        const alt = getHtmlAttribute(attrs, 'alt') || article.coverImageAlt || `ภาพประกอบบทความ ${article.title}`;
        const safeSrc = escapeHtmlAttribute(src);
        const safeAlt = escapeHtmlAttribute(alt);

        return `<figure class="article-media not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 bg-[#f5f5fb] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"><a href="${safeSrc}" target="_blank" rel="noopener noreferrer" class="block"><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" class="h-auto w-full rounded-xl object-contain" /></a><figcaption class="px-2 pb-1 pt-3 text-center text-xs text-[#6a6a92]">คลิกเพื่อดูภาพขนาดเต็ม</figcaption></figure>`;
    });
}

function getArticleTakeaways(article: Article) {
    const tocTakeaways = article.toc
        ?.filter((item) => item.level === 2)
        .slice(0, 3)
        .map((item) => item.title.replace(/^\d+[\).\s-]*/, '').trim())
        .filter(Boolean);

    if (tocTakeaways && tocTakeaways.length >= 3) {
        return tocTakeaways;
    }

    return [
        `เข้าใจหลักคิดของ${article.category || 'ศาสตร์ชื่อมงคล'}ในมุมที่นำไปใช้ได้จริง`,
        'รู้จุดที่ควรตรวจสอบก่อนเลือกชื่อ เบอร์ หรือพลังเสริมดวง',
        'ต่อยอดด้วยเครื่องมือวิเคราะห์ของ NameMongkol ได้ทันที',
    ];
}

function getArticleIntentLinks(article: Article) {
    const searchText = `${article.title} ${article.excerpt} ${article.category} ${(article.keywords || []).join(' ')}`.toLowerCase();
    const links = [
        {
            href: '/name-check',
            title: 'วิเคราะห์ชื่อฟรี',
            description: 'ตรวจผลรวมชื่อ ทักษา อายตนะ และอักษรกาลกิณีจากชื่อจริงของคุณ',
        },
    ];

    if (searchText.includes('เบอร์') || searchText.includes('phone')) {
        links.push({
            href: '/phone-analysis',
            title: 'วิเคราะห์เบอร์มงคล',
            description: 'ตรวจคู่เลขและพลังเบอร์มือถือแบบ 6 ด้าน',
        });
    }

    if (searchText.includes('ลูก') || searchText.includes('ชื่อผู้ชาย') || searchText.includes('ชื่อผู้หญิง') || searchText.includes('baby')) {
        links.push({
            href: '/premium-search',
            title: 'ค้นหาชื่อมงคล Premium',
            description: 'เลือกชื่อจากฐานข้อมูลพร้อมเกรด คะแนน และความหมาย',
        });
        links.push({
            href: '/name-generator',
            title: 'สร้างชื่อมงคลด้วย AI',
            description: 'ให้ระบบช่วยเสนอชื่อที่เข้ากับวันเกิดและเป้าหมายของครอบครัว',
        });
    }

    if (searchText.includes('วอลเปเปอร์') || searchText.includes('สีมงคล') || searchText.includes('ไฉ่ซิงเอี้ย')) {
        links.push({
            href: '/wallpapers',
            title: 'วอลเปเปอร์มงคล',
            description: 'เลือกภาพเสริมดวงตามเป้าหมาย การเงิน ความรัก และการงาน',
        });
    }

    links.push({
        href: '/articles',
        title: 'อ่านคลังบทความชื่อมงคล',
        description: 'ต่อยอดความรู้เรื่องเลขศาสตร์ ทักษา และการตั้งชื่ออย่างเป็นระบบ',
    });

    return links.slice(0, 4);
}

function getFallbackFaqItems(article: Article) {
    const searchText = `${article.title} ${article.excerpt} ${article.category} ${(article.keywords || []).join(' ')}`.toLowerCase();

    if (searchText.includes('เบอร์') || searchText.includes('phone')) {
        return [
            {
                question: `บทความ "${article.title}" เหมาะกับใคร?`,
                answer: 'เหมาะกับผู้ที่ต้องการเข้าใจหลักการเลือกและวิเคราะห์เบอร์มงคลก่อนตัดสินใจใช้เบอร์จริง โดยควรดูทั้งคู่เลข ผลรวม และความเหมาะกับวันเกิดหรือเป้าหมายชีวิต',
            },
            {
                question: 'ควรเช็กเบอร์มงคลด้วยเครื่องมือก่อนเปลี่ยนเบอร์ไหม?',
                answer: 'ควรเช็กก่อนเสมอ เพราะการดูเฉพาะเลขสวยหรือผลรวมอย่างเดียวอาจไม่เห็นคู่เลขที่เป็นจุดเสี่ยง เครื่องมือวิเคราะห์เบอร์จะช่วยสรุปภาพรวมและจุดที่ควรระวังได้เร็วขึ้น',
            },
            {
                question: 'อ่านบทความแล้วควรทำอะไรต่อ?',
                answer: 'นำหลักในบทความไปตรวจเบอร์ที่ใช้อยู่หรือเบอร์ที่กำลังจะเลือก จากนั้นเปรียบเทียบผลวิเคราะห์กับเป้าหมายด้านงาน เงิน ความรัก และสุขภาพก่อนตัดสินใจ',
            },
        ];
    }

    return [
        {
            question: `บทความ "${article.title}" สรุปประเด็นสำคัญเรื่องอะไร?`,
            answer: `บทความนี้ช่วยอธิบายแนวคิดหลักของ${article.category || 'การตั้งชื่อมงคล'} พร้อมจุดที่ควรตรวจสอบก่อนเลือกชื่อหรือใช้ชื่อนั้นจริง เพื่อให้ผู้อ่านตัดสินใจได้เป็นระบบมากขึ้น`,
        },
        {
            question: 'ควรวิเคราะห์ชื่อกับนามสกุลพร้อมกันหรือไม่?',
            answer: 'ควรวิเคราะห์ชื่อและนามสกุลร่วมกัน เพราะพลังเลขศาสตร์ ทักษา อายตนะ และความสมพงศ์ของชื่อจะอ่านได้แม่นขึ้นเมื่อดูชื่อเต็ม ไม่ใช่ดูชื่อจริงแยกออกจากนามสกุลเพียงอย่างเดียว',
        },
        {
            question: 'อ่านบทความแล้วควรเริ่มเช็กชื่อจากจุดไหน?',
            answer: 'เริ่มจากตรวจผลรวมเลขศาสตร์ อักษรกาลกิณีตามวันเกิด ความหมายของชื่อ และความเข้ากันกับนามสกุล จากนั้นใช้เครื่องมือวิเคราะห์ชื่อเพื่อดูภาพรวมทั้ง 4 ศาสตร์อีกครั้ง',
        },
    ];
}

function ArticleEnhancementBlock({ article }: { article: Article }) {
    const takeaways = getArticleTakeaways(article);
    const intentLinks = getArticleIntentLinks(article);
    const visualSummaryImage = article.coverImage;

    return (
        <section
            aria-labelledby="article-summary-heading"
            className="article-direct-answer not-prose mb-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-[#f0f0f8] to-[#e8e8f4] p-4 shadow-lg sm:p-6"
        >
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
                            <Compass className="h-3.5 w-3.5" />
                            สรุปก่อนอ่าน
                        </div>
                        <h2 id="article-summary-heading" className="text-xl font-bold leading-snug text-[#1a1a3e] sm:text-2xl">
                            บทความนี้ช่วยให้คุณตัดสินใจเรื่องชื่อมงคลได้แม่นขึ้น
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5a5a82] sm:text-base">
                            เราสรุปประเด็นสำคัญของบทความนี้ไว้ให้ก่อน เพื่อให้ผู้อ่านจาก Google เห็นคำตอบเร็วขึ้น และเลือกอ่านหัวข้อที่ตรงกับความต้องการได้ทันที
                        </p>
                    </div>

                    <ul className="mt-5 grid gap-3">
                        {takeaways.map((item) => (
                            <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white/70 p-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                <span className="text-sm leading-relaxed text-[#4a4a6e]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="relative aspect-[16/10] w-full">
                        <ArticleImage
                            src={visualSummaryImage}
                            alt={`ภาพสรุปประเด็นบทความ ${article.title}`}
                            objectFit="contain"
                            variant="detail"
                            className="scale-100"
                        />
                    </div>
                    <figcaption className="border-t border-slate-200 px-4 py-3 text-xs leading-relaxed text-[#6a6a92]">
                        ภาพประกอบบทความ: {article.title}
                    </figcaption>
                </figure>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1a1a3e]">
                    <Link2 className="h-4 w-4 text-amber-600" />
                    อ่านแล้วต่อยอดได้ทันที
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {intentLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group rounded-xl border border-slate-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-white shadow-sm"
                        >
                            <span className="text-sm font-bold text-[#1a1a3e] group-hover:text-amber-600">{link.title}</span>
                            <span className="mt-1 block text-xs leading-relaxed text-[#5a5a82]">{link.description}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);

    // Redirect old Thai slugs to new English slugs
    if (SLUG_REDIRECTS[slug]) {
        redirect(`/articles/${SLUG_REDIRECTS[slug]}`);
    }

    const article = (await getArticle(slug)) as Article | null;

    if (!article) {
        return {
            title: 'บทความไม่พบ - NAMEMONGKOL',
        };
    }

    const baseUrl = siteUrl;
    const rawImageUrl = article.coverImage;

    // Dynamic OG fallback — always available when image is missing or broken
    const ogApiFallback = `${baseUrl}/api/og?variant=article&title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category || '')}&meta=${encodeURIComponent(article.metaDescription || article.excerpt || '')}`;

    let imageUrl = ogApiFallback;

    if (rawImageUrl) {
        try {
            if (rawImageUrl.startsWith('http')) {
                // External URL — use directly
                imageUrl = rawImageUrl;
            } else {
                // Local path — build absolute URL, percent-encoding non-ASCII chars
                // (e.g. Thai filenames like ศุภจี.png → %E0%B8%A8%E0%B8%B8%E0%B8%A0%E0%B8%88%E0%B8%B5.png)
                // encodeURI preserves slashes; Facebook/Line/Twitter crawlers handle encoded URLs correctly.
                imageUrl = absoluteSiteUrl(rawImageUrl, baseUrl);
            }
        } catch (e) {
            console.error('Error constructing OG image URL:', e);
            // keep ogApiFallback
        }
    }

    return {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt,
        keywords: article.keywords,
        alternates: { canonical: `${baseUrl}/articles/${slug}` },
        openGraph: {
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.excerpt,
            url: `${baseUrl}/articles/${slug}`,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.coverImageAlt || article.title,
                }
            ],
            type: 'article',
            siteName: 'NameMongkol',
            locale: 'th_TH',
        },
        twitter: {
            card: 'summary_large_image',
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.excerpt,
            images: [imageUrl],
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    
    // Check redirect again here just in case generateMetadata isn't invoked (e.g. client navigation)
    if (SLUG_REDIRECTS[slug]) {
        redirect(`/articles/${SLUG_REDIRECTS[slug]}`);
    }

    const article = (await getArticle(slug)) as Article;

    if (!article) {
        return notFound();
    }

    // ── Canonical base URL (consistent across metadata & JSON-LD) ──
    const baseUrl = siteUrl;
    const canonicalUrl = `${baseUrl}/articles/${slug}`;
    const articleSchemaId = `${canonicalUrl}#article`;
    const webPageSchemaId = `${canonicalUrl}#webpage`;
    const websiteSchemaId = `${baseUrl}/#website`;
    const organizationSchemaId = `${baseUrl}/#organization`;
    const articleImages = getArticleImages(article, baseUrl);
    const articleImageObjects = articleImages.map((image, index) => toArticleImageObject(image, index === 0));
    const primaryArticleImage = articleImages[0];
    const datePublishedIso = (() => { try { return new Date(article.date).toISOString(); } catch { return article.date; } })();
    const dateModifiedIso = (() => { try { return new Date(article.dateModified || article.date).toISOString(); } catch { return article.dateModified || article.date; } })();

    // ── Date formatting helpers ──
    const formatThaiDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch { return dateStr; }
    };
    const hasBeenModified = article.dateModified && article.dateModified !== article.date;
    const isPalmistryArticle = slug === PALMISTRY_SLUG;
    const isWideMediaArticle = slug === 'boy-names-wednesday-night-2569';
    const enhancedArticleContent = enhanceArticleContent(article.content, article.toc);
    const effectiveToc = enhancedArticleContent.toc;
    const effectiveFaqItems = article.faqItems && article.faqItems.length > 0 ? article.faqItems : getFallbackFaqItems(article);
    const articleWithEffectiveEnhancements = { ...article, toc: effectiveToc, faqItems: effectiveFaqItems };
    const articleContentHtml = normalizeArticleContentHtml(
        enhancedArticleContent.content,
        article,
        !LOCAL_PRIORITY_ARTICLE_SLUGS.has(article.slug)
    );

    // ── Reading time estimate ──
    const plainText = enhancedArticleContent.content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200)); // ~200 words/min for Thai

    // ── Get related articles (prioritize manual relatedSlugs, then fall back to category) ──
    let relatedArticles: Article[] = [];
    const relatedPool = await getRelatedArticlePool();

    if (article.relatedSlugs && article.relatedSlugs.length > 0) {
        relatedArticles = relatedPool.filter(a => article.relatedSlugs?.includes(a.slug));
    }

    // Fill up with category matches if needed
    if (relatedArticles.length < 3) {
        const categoryMatches = relatedPool.filter(a =>
            a.category === article.category &&
            a.slug !== slug &&
            !relatedArticles.some(r => r.slug === a.slug)
        );
        relatedArticles = [...relatedArticles, ...categoryMatches].slice(0, 3);
    }

    if (relatedArticles.length < 3) {
        const articleKeywords = new Set((article.keywords || []).map((keyword) => keyword.toLowerCase()));
        const keywordMatches = relatedPool
            .filter((candidate) =>
                candidate.slug !== slug &&
                !relatedArticles.some((related) => related.slug === candidate.slug) &&
                (candidate.keywords || []).some((keyword) => articleKeywords.has(keyword.toLowerCase()))
            )
            .sort((a, b) => {
                const aScore = (a.keywords || []).filter((keyword) => articleKeywords.has(keyword.toLowerCase())).length;
                const bScore = (b.keywords || []).filter((keyword) => articleKeywords.has(keyword.toLowerCase())).length;
                return bScore - aScore;
            });

        relatedArticles = [...relatedArticles, ...keywordMatches].slice(0, 3);
    }
    
    // Final safety measure to ensure no duplicate keys are rendered
    relatedArticles = Array.from(new Map(relatedArticles.map(a => [a.slug, a])).values());
    
    const schemaKeywords = (article.keywords || []).slice(0, 8);
    const articleEntityTopics = [
        article.category,
        ...schemaKeywords,
    ].filter(Boolean);

    // ── Breadcrumb Schema (uses consistent baseUrl) ──
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'หน้าหลัก',
                'item': baseUrl
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'บทความชื่อมงคล',
                'item': `${baseUrl}/articles`
            },
            {
                '@type': 'ListItem',
                'position': 3,
                'name': article.title,
                'item': canonicalUrl
            }
        ]
    };

    // ── FAQPage JSON-LD (only when faqItems exist) ──
    const faqJsonLd = effectiveFaqItems.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': effectiveFaqItems.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer,
            },
        })),
    } : null;

    return (
        <div className="min-h-screen bg-[#f8f8fc] text-[#5a5a82] font-sans selection:bg-amber-500 selection:text-[#050711] relative overflow-hidden pb-28">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#c9933a]/5 rounded-full blur-[120px]"></div>
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px]"></div>
            </div>

            {/* WebPage Schema for AI and image search entity linking */}
            <Script
                id="article-webpage-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "@id": webPageSchemaId,
                        "url": canonicalUrl,
                        "name": article.metaTitle || article.title,
                        "description": article.metaDescription || article.excerpt,
                        "inLanguage": "th-TH",
                        "isPartOf": {
                            "@type": "WebSite",
                            "@id": websiteSchemaId,
                            "url": baseUrl,
                            "name": "NameMongkol",
                        },
                        "publisher": {
                            "@type": "Organization",
                            "@id": organizationSchemaId,
                            "name": "NameMongkol",
                            "url": baseUrl,
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${baseUrl}/icon.png`,
                            },
                        },
                        "primaryImageOfPage": primaryArticleImage ? toArticleImageObject(primaryArticleImage, true) : undefined,
                        "mainEntity": {
                            "@id": articleSchemaId,
                        },
                        "datePublished": datePublishedIso,
                        "dateModified": dateModifiedIso,
                    })
                }}
            />

            {/* Article Schema — consistent baseUrl */}
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "@id": articleSchemaId,
                        "headline": article.metaTitle || article.title,
                        "description": article.metaDescription || article.excerpt,
                        "image": articleImageObjects.length > 0 ? articleImageObjects : undefined,
                        "thumbnailUrl": primaryArticleImage?.src,
                        "articleSection": article.category,
                        "keywords": article.keywords?.join(', '),
                        "wordCount": wordCount,
                        "isAccessibleForFree": true,
                        "about": articleEntityTopics.map((name) => ({
                            "@type": "Thing",
                            "name": name,
                        })),
                        "mentions": [
                            {
                                "@type": "SoftwareApplication",
                                "name": "NameMongkol วิเคราะห์ชื่อฟรี",
                                "url": `${baseUrl}/name-check`,
                                "applicationCategory": "LifestyleApplication",
                                "operatingSystem": "Web",
                            },
                            {
                                "@type": "SoftwareApplication",
                                "name": "NameMongkol วิเคราะห์ชื่อหลายชื่อ",
                                "url": `${baseUrl}/name-analysis`,
                                "applicationCategory": "LifestyleApplication",
                                "operatingSystem": "Web",
                            },
                        ],
                        "speakable": {
                            "@type": "SpeakableSpecification",
                            "cssSelector": ["h1", ".article-direct-answer", "#faq-section"],
                        },
                        "datePublished": datePublishedIso,
                        "dateModified": dateModifiedIso,
                        "author": [{
                            "@type": "Person",
                            "name": article.author,
                            "url": `${baseUrl}/about`,
                            "jobTitle": "นักวิเคราะห์ชื่อมงคลและเลขศาสตร์",
                            "affiliation": {
                                "@type": "Organization",
                                "name": "NameMongkol",
                                "url": baseUrl
                            }
                        }],
                        "publisher": {
                            "@type": "Organization",
                            "@id": organizationSchemaId,
                            "name": "NameMongkol",
                            "url": baseUrl,
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${baseUrl}/icon.png`
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": webPageSchemaId
                        },
                        "inLanguage": "th",
                        ...(isPalmistryArticle && {
                            "about": {
                                "@type": "Thing",
                                "name": "หัตถศาสตร์ (Palmistry)",
                                "sameAs": "https://en.wikipedia.org/wiki/Palmistry"
                            }
                        })
                    })
                }}
            />
            {/* Breadcrumb Schema */}
            <Script
                id="article-breadcrumb-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {/* FAQPage Schema */}
            {faqJsonLd && (
                <Script
                    id="article-faq-json-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

            <main className="w-full max-w-[1400px] px-4 pb-8 relative z-10 pt-28 md:pt-32">
                <div className={isWideMediaArticle ? "mx-auto max-w-[1040px]" : "max-w-3xl mx-auto"}>
                    {/* Breadcrumb Navigation */}
                    <nav className="mb-6 text-sm text-[#5a5a82]" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 flex-wrap">
                            <li><Link href="/" className="hover:text-[#1a1a3e] transition-colors">หน้าหลัก</Link></li>
                            <li className="text-slate-500">/</li>
                            <li><Link href="/articles" className="hover:text-[#1a1a3e] transition-colors">บทความ</Link></li>
                            <li className="text-slate-500">/</li>
                            <li className="text-amber-600 font-medium truncate max-w-[200px] md:max-w-none">{article.title}</li>
                        </ol>
                    </nav>

                    {/* Back Link */}
                    <Link href="/articles" className="inline-flex items-center gap-1.5 text-xs text-[#5a5a82] hover:text-amber-700 mb-8 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-amber-500/40 transition-all group shadow-sm w-fit">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-amber-600" />
                        <span>บทความทั้งหมด</span>
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#5a5a82] mb-6 font-medium">
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 inline-flex items-center gap-1.5 shadow-sm">
                            <Tag size={12} />
                            {article.category}
                        </span>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>เผยแพร่: {formatThaiDate(article.date)}</span>
                        </div>
                        {hasBeenModified && (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <RefreshCw size={12} />
                                <span>อัปเดต: {formatThaiDate(article.dateModified!)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <span>•</span>
                            <span>อ่าน ~{readingTimeMinutes} นาที</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-[#1a1a3e] tracking-tight">
                        {article.title}
                    </h1>

                    {/* Cover Image */}
                    <div className={`${isWideMediaArticle ? "mx-auto max-w-[1040px] rounded-3xl border-slate-200 bg-white p-2 shadow-xl md:p-3" : "rounded-2xl border-slate-200 bg-white p-2 shadow-xl"} w-full aspect-video mb-10 overflow-hidden relative border flex items-center justify-center`}>
                        {/* 
                           Note: Since we might not have real images yet, 
                           we'll use a placeholder logic if exact file doesn't exist, 
                           but for now assume standard next/image usage.
                           In a real scenario, make sure these images exist in public/ folder.
                        */}
                        <ArticleImage
                            src={article.coverImage}
                            alt={article.coverImageAlt || `ภาพหน้าปกบทความ ${article.title}`}
                            priority
                            objectFit="contain"
                            variant={isWideMediaArticle ? 'wide' : 'detail'}
                            className="group-hover:scale-100" // Disable zoom effect if not needed, or keep standard
                        />
                    </div>

                    {/* Table of Contents — enhanced with numbered sections for long articles */}
                    {effectiveToc && effectiveToc.length > 0 && (
                        <nav className="bg-gradient-to-br from-[#f0f0f8] to-[#e8e8f4] rounded-2xl p-6 mb-10 border border-slate-200 shadow-md" aria-label="สารบัญบทความ">
                            <h2 className="text-lg font-bold text-[#1a1a3e] mb-5 flex items-center gap-2">
                                <span className="text-xl opacity-80">📖</span> สารบัญ
                                <span className="text-xs font-normal text-[#6a6a92] ml-auto">{effectiveToc.filter(t => t.level === 2).length} หัวข้อหลัก</span>
                            </h2>
                            <ul className="space-y-2">
                                {(() => {
                                    let h2Counter = 0;
                                    return effectiveToc.map((item) => {
                                        if (item.level === 2) h2Counter++;
                                        return (
                                            <li key={item.id} style={{ paddingLeft: (item.level - 2) * 16 }}>
                                                <a href={`#${item.id}`} className="text-[#4a4a6e] hover:text-amber-600 transition-colors text-sm flex items-center gap-3 py-1">
                                                    {item.level === 2 ? (
                                                        <span className="w-5 h-5 text-amber-600 rounded text-xs flex items-center justify-center flex-shrink-0 font-bold border border-amber-500/30">{h2Counter}</span>
                                                    ) : (
                                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0 ml-1.5" />
                                                    )}
                                                    {item.title}
                                                </a>
                                            </li>
                                        );
                                    });
                                })()}
                            </ul>
                        </nav>
                    )}

                    <ArticleEnhancementBlock article={articleWithEffectiveEnhancements} />

                    {/* Content */}
                    {/* Content */}
                    <article className={`${isWideMediaArticle ? "prose-headings:max-w-3xl prose-headings:mx-auto prose-p:max-w-3xl prose-p:mx-auto prose-ul:max-w-3xl prose-ul:mx-auto prose-ol:max-w-3xl prose-ol:mx-auto prose-blockquote:max-w-3xl prose-blockquote:mx-auto" : ""} prose prose-lg max-w-none text-[#5a5a82] prose-headings:text-[#1a1a3e] prose-a:text-amber-600 prose-strong:text-[#1a1a3e] prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:not-italic prose-blockquote:py-1 prose-blockquote:text-[#1a1a3e]`}>
                        <p className="lead rounded-2xl border border-amber-500/30 bg-amber-50 p-5 text-xl font-medium text-[#1a1a3e] shadow-sm leading-relaxed">
                            {article.excerpt}
                        </p>
                        <div dangerouslySetInnerHTML={{
                            __html: false
                                ? enhancedArticleContent.content.replace(
                                    /<img\b[^>]*?>/gi,
                                    `<div class="w-full aspect-video bg-slate-900 rounded-2xl my-8 overflow-hidden relative border border-white/5 shadow-2xl shadow-purple-900/10 not-prose flex items-center justify-center"><img src="${article.coverImage}" alt="${(article.coverImageAlt ?? `ภาพหน้าปกบทความ ${article.title}`).replace(/"/g, '&quot;')}" class="object-contain w-full h-full" /></div>`
                                )
                                : articleContentHtml
                        }} />
                    </article>

                    {/* Aura Vibe Widget — Mid-Article (คั่นระหว่างเนื้อหากับ FAQ) */}
                    <AuraVibeWidget />

                    {/* FAQ Section — renders when article has faqItems */}
                    {effectiveFaqItems.length > 0 && (
                        <section id="faq-section" className="mt-14 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-[#1a1a3e] mb-8 flex items-center gap-3">
                                <span className="text-3xl opacity-80">❓</span> คำถามที่พบบ่อย (FAQ)
                            </h2>
                            <div className="space-y-4">
                                {effectiveFaqItems.map((item, index) => (
                                    <details
                                        key={index}
                                        className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all shadow-sm"
                                        {...(index < 3 ? { open: true } : {})}
                                    >
                                        <summary className="flex items-start gap-3 p-6 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                            <span className="w-6 h-6 text-amber-600 rounded text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5 border border-amber-500/30">{index + 1}</span>
                                            <span className="text-[#1a1a3e] font-medium leading-snug flex-1">{item.question}</span>
                                            <span className="text-[#6a6a92] group-open:rotate-180 transition-transform duration-200 flex-shrink-0 mt-0.5">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </span>
                                        </summary>
                                        <div className="px-6 pb-6 pt-0 text-[#5a5a82] text-sm leading-relaxed border-t border-slate-200 mt-0 pt-4">
                                            {item.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Tags */}
                    {article.keywords && article.keywords.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-slate-200">
                            <div className="flex flex-wrap gap-2">
                                {article.keywords.map((keyword: string) => (
                                    <span key={keyword} className="bg-white text-[#5a5a82] border border-slate-200 text-xs px-3 py-1 rounded-full hover:border-amber-500/30 transition-all cursor-default shadow-sm">
                                        #{keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Palm Analysis CTA — palmistry article specific */}
                    {isPalmistryArticle && (
                        <div className="mt-10 p-8 bg-gradient-to-br from-amber-50 to-[#f0f0f8] border border-amber-200 rounded-2xl text-center shadow-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
                            <h3 className="text-xl font-bold text-[#1a1a3e] mb-3 relative z-10">อยากลองวิเคราะห์ลายมือของคุณด้วย AI?</h3>
                            <p className="text-[#5a5a82] text-sm mb-6 max-w-lg mx-auto relative z-10">ระบบ AI ของ NameMongkol อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา พร้อมให้คำแนะนำเชิงสร้างสรรค์</p>
                            <Link href="/palm-analysis" className="inline-block px-8 py-3.5 bg-[#c9933a] hover:bg-[#d4a54e] text-white font-bold rounded-xl transition-all shadow-[0_0_24px_rgba(245,158,11,0.22)] hover:shadow-[0_0_32px_rgba(245,158,11,0.30)] hover:-translate-y-0.5 relative z-10">วิเคราะห์ลายมือฟรีที่นี่</Link>
                        </div>
                    )}

                    {/* Aura Vibe Widget removed — single instance at mid-article is sufficient */}

                    {/* Author Bio Card — EEAT signal */}
                    <section className="mt-12 bg-gradient-to-br from-[#f0f0f8] to-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6 shadow-md">
                        <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                            👨‍🏫
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#1a1a3e] mb-2 flex items-center gap-2">
                                {article.author}
                                <Award size={16} className="text-amber-600" />
                            </h3>
                            <p className="text-[#5a5a82] text-sm leading-relaxed mb-5 max-w-2xl">
                                นักวิเคราะห์ชื่อมงคลและเลขศาสตร์ ผู้เชี่ยวชาญด้านทักษาปกรณ์ เลขศาสตร์ไทย และโหราศาสตร์
                                ประสบการณ์วิเคราะห์ชื่อมากกว่า 150,000 ชื่อผ่านระบบ NameMongkol
                                อ้างอิงตำราทักษาปกรณ์ฉบับราชบัณฑิต และหลักเลขศาสตร์สากล
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/about" className="inline-flex items-center gap-1.5 text-xs text-[#5a5a82] hover:text-[#1a1a3e] bg-white border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all">
                                    <BookOpen size={12} className="text-amber-600" /> เกี่ยวกับผู้เขียน
                                </Link>
                                <Link href="/name-check" className="inline-flex items-center gap-1.5 text-xs text-[#5a5a82] hover:text-[#1a1a3e] bg-white border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all">
                                    <ExternalLink size={12} className="text-amber-600" /> วิเคราะห์ชื่อฟรี
                                </Link>
                                <Link href="/reviews" className="inline-flex items-center gap-1.5 text-xs text-[#5a5a82] hover:text-[#1a1a3e] bg-white border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all">
                                    <Star size={12} className="text-amber-600" /> ดูรีวิวผู้ใช้งาน
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Mandatory CTA — ตาม Checklist */}
                    <div className="hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c9933a]/10 via-transparent to-transparent pointer-events-none"></div>
                        <p className="text-2xl md:text-3xl font-bold text-[#1a1a3e] mb-4 relative z-10 tracking-tight">
                            อยากรู้ว่าชื่อของคุณดีแค่ไหน?
                        </p>
                        <p className="text-[#5a5a82] mb-8 max-w-lg mx-auto relative z-10">
                            วิเคราะห์ครบ 4 ศาสตร์: เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และกาลกิณี
                        </p>
                        <Link
                            href="/name-check"
                            className="inline-block bg-[#c9933a] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#d4a54e] transition-all shadow-[0_0_24px_rgba(245,158,11,0.22)] hover:shadow-[0_0_32px_rgba(245,158,11,0.30)] hover:-translate-y-0.5 text-lg relative z-10"
                        >
                            วิเคราะห์ชื่อฟรีที่นี่
                        </Link>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h3 className="text-xl font-bold text-[#1a1a3e] mb-4">บริการอื่นๆ ของเรา</h3>
                        <ArticleCTA />
                    </div>

                    {/* Share */}
                    <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[#5a5a82] font-medium">แชร์บทความนี้</span>
                        <ArticleShareButtons title={article.title} slug={article.slug} />
                    </div>

                    {/* Related Articles Section */}
                    {relatedArticles.length > 0 && (
                        <section className="mt-14 pt-10 border-t border-slate-200">
                            <h3 className="text-xl font-bold text-[#1a1a3e] mb-8 flex items-center gap-3">
                                <span className="text-2xl opacity-80">📚</span>
                                บทความที่เกี่ยวข้อง
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/articles/${related.slug}`}
                                        className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-xl shadow-md transition-all flex flex-col"
                                    >
                                        <div className="h-40 w-full bg-[#f5f5fb] relative overflow-hidden p-2">
                                            <ArticleImage
                                                src={related.coverImage}
                                                alt={related.coverImageAlt || `ภาพหน้าปกบทความ ${related.title}`}
                                                priority={false}
                                                objectFit="contain"
                                                variant="related"
                                                className="scale-100"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <div className="text-xs font-medium text-amber-600 mb-2 uppercase tracking-wide">{related.category}</div>
                                            <h4 className="text-sm font-medium text-[#1a1a3e] group-hover:text-amber-700 transition-colors line-clamp-2 leading-relaxed">
                                                {related.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SEO Bottom Content */}
                    <section className="mt-14 pt-8 border-t border-slate-200 bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-4">เกี่ยวกับ NameMongkol</h3>
                        <p className="text-[#5a5a82] text-sm leading-relaxed mb-6">
                            <strong className="text-[#1a1a3e] font-medium">NameMongkol</strong> คือเว็บไซต์วิเคราะห์ชื่อมงคลอันดับ 1 ของไทย
                            ใช้ระบบ AI ผสานศาสตร์โบราณ ครอบคลุม <strong className="text-[#1a1a3e] font-medium">เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6</strong>
                            และ <strong className="text-[#1a1a3e] font-medium">อักษรกาลกิณี</strong>
                            ให้บริการทั้งวิเคราะห์ชื่อฟรีและค้นหาชื่อมงคล Premium พร้อมวอลเปเปอร์มงคลเสริมดวง
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/name-check" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-4 py-2 rounded-full text-[#5a5a82] hover:text-amber-700 transition-all shadow-sm">
                                เช็คชื่อมงคลฟรี
                            </Link>
                            <Link href="/premium-search" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-4 py-2 rounded-full text-[#5a5a82] hover:text-amber-700 transition-all shadow-sm">
                                ค้นหาชื่อมงคล Premium
                            </Link>
                            <Link href="/phone-analysis" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-4 py-2 rounded-full text-[#5a5a82] hover:text-amber-700 transition-all shadow-sm">
                                วิเคราะห์เบอร์มงคล
                            </Link>
                            <Link href="/wallpapers" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-4 py-2 rounded-full text-[#5a5a82] hover:text-amber-700 transition-all shadow-sm">
                                วอลเปเปอร์มงคล
                            </Link>
                            <Link href="/articles" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-4 py-2 rounded-full text-[#5a5a82] hover:text-amber-700 transition-all shadow-sm">
                                บทความทั้งหมด
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
