
import Link from 'next/link';
import Script from 'next/script';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag, RefreshCw, BookOpen, Award, ExternalLink, Star } from 'lucide-react';
import { Metadata } from 'next';
import { ArticleImage } from '@/components/ArticleImage';
import dynamic from 'next/dynamic';

const ArticleShareButtons = dynamic(() => import('@/components/ArticleShareButtons').then(mod => mod.ArticleShareButtons), {
    loading: () => <div className="h-10 w-24 bg-slate-800/50 rounded-full animate-pulse" />
});

const ArticleCTA = dynamic(() => import('@/components/ArticleCTA').then(mod => mod.ArticleCTA), {
    loading: () => <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />
});

const AuraVibeWidget = dynamic(() => import('@/components/AuraVibeWidget'), {
    loading: () => <div className="h-48 bg-slate-800/50 rounded-2xl animate-pulse my-10 max-w-xl mx-auto" />
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

// ISR: cache 1 hour, invalidate via revalidateTag('articles') when admin updates
export const revalidate = 3600;

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

import { supabase } from '@/utils/supabase';

async function getPublishedArticlesDb(): Promise<Article[]> {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true);

    if (error || !data) return [];

    const rows = data as DbArticleRow[];

    return rows.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.cover_image,
        coverImageAlt: item.cover_image_alt ?? undefined,
        date: item.date,
        author: item.author,
        category: item.category,
        keywords: item.keywords,
        metaTitle: item.meta_title ?? undefined,
        metaDescription: item.meta_description ?? undefined,
        relatedSlugs: item.related_slugs ?? [],
        toc: item.toc ?? [],
        faqItems: item.faq_items ?? [],
        dateModified: item.date_modified ?? item.date,
    }));
}

async function getRelatedArticlePool(): Promise<Article[]> {
    const dbArticles = await getPublishedArticlesDb();
    const existingSlugs = new Set(dbArticles.map((article) => article.slug));
    const existingTitles = new Set(dbArticles.map((article) => article.title));
    const localFallback = localArticles.filter((article) => !existingSlugs.has(article.slug) && !existingTitles.has(article.title));
    return [...dbArticles, ...localFallback];
}

// DB-first article fetch for detail page
const getArticle = async (slug: string): Promise<Article | null> => {
    const localMatch = localArticles.find(a => a.slug === slug);

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
        content: data.content,
        coverImage: data.cover_image, // Map here
        coverImageAlt: data.cover_image_alt,
        date: data.date,
        author: data.author,
        category: data.category,
        keywords: data.keywords,
        metaTitle: data.meta_title, // Map here
        metaDescription: data.meta_description, // Map here
        // DB columns for these are nullable; fallback to empty
        relatedSlugs: data.related_slugs ?? [],
        toc: data.toc ?? [],
        faqItems: data.faq_items ?? [],
        dateModified: data.date_modified ?? data.date,
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);

    // Redirect old Thai slugs to new English slugs
    if (SLUG_REDIRECTS[slug]) {
        redirect(`/articles/${SLUG_REDIRECTS[slug]}`);
    }

    const article = await getArticle(slug);

    if (!article) {
        return {
            title: 'บทความไม่พบ - NAMEMONGKOL',
        };
    }

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com').replace(/\/$/, '');
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
                const cleanPath = rawImageUrl.startsWith('/') ? rawImageUrl : `/${rawImageUrl}`;
                imageUrl = `${baseUrl}${encodeURI(cleanPath)}`;
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

    const article = await getArticle(slug);

    if (!article) {
        return notFound();
    }

    // ── Canonical base URL (consistent across metadata & JSON-LD) ──
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com').replace(/\/$/, '');
    const canonicalUrl = `${baseUrl}/articles/${slug}`;

    // ── Date formatting helpers ──
    const formatThaiDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch { return dateStr; }
    };
    const hasBeenModified = article.dateModified && article.dateModified !== article.date;
    const isPalmistryArticle = slug === PALMISTRY_SLUG;

    // ── Reading time estimate ──
    const plainText = article.content.replace(/<[^>]*>/g, '');
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
    const faqJsonLd = article.faqItems && article.faqItems.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': article.faqItems.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer,
            },
        })),
    } : null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden pb-28">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Article Schema — consistent baseUrl */}
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": article.metaTitle || article.title,
                        "description": article.metaDescription || article.excerpt,
                        "image": article.coverImage?.startsWith('http') ? article.coverImage : `${baseUrl}${article.coverImage}`,
                        "datePublished": article.date,
                        "dateModified": article.dateModified || article.date,
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
                            "name": "NameMongkol",
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${baseUrl}/icon.png`
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": canonicalUrl
                        },
                        "keywords": article.keywords?.join(', ') || '',
                        "articleSection": article.category || '',
                        "wordCount": wordCount,
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
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb Navigation */}
                    <nav className="mb-6 text-sm text-slate-400" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 flex-wrap">
                            <li><Link href="/" className="hover:text-white transition-colors">หน้าหลัก</Link></li>
                            <li className="text-slate-600">/</li>
                            <li><Link href="/articles" className="hover:text-white transition-colors">บทความ</Link></li>
                            <li className="text-slate-600">/</li>
                            <li className="text-purple-400 font-medium truncate max-w-[200px] md:max-w-none">{article.title}</li>
                        </ol>
                    </nav>

                    {/* Back Link */}
                    <Link href="/articles" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group backdrop-blur-sm w-fit">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>บทความทั้งหมด</span>
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6 font-medium">
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 inline-flex items-center gap-1.5">
                            <Tag size={12} />
                            {article.category}
                        </span>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>เผยแพร่: {formatThaiDate(article.date)}</span>
                        </div>
                        {hasBeenModified && (
                            <div className="flex items-center gap-2 text-emerald-400/80">
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
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white">
                        {article.title}
                    </h1>

                    {/* Cover Image */}
                    <div className="w-full aspect-video bg-slate-900 rounded-2xl mb-10 overflow-hidden relative border border-white/5 shadow-2xl shadow-purple-900/10 flex items-center justify-center">
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
                            className="group-hover:scale-100" // Disable zoom effect if not needed, or keep standard
                        />
                    </div>

                    {/* Table of Contents — enhanced with numbered sections for long articles */}
                    {article.toc && article.toc.length > 0 && (
                        <nav className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700/50" aria-label="สารบัญบทความ">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-xl">📚</span> สารบัญ
                                <span className="text-xs font-normal text-slate-500 ml-auto">{article.toc.filter(t => t.level === 2).length} หัวข้อหลัก</span>
                            </h2>
                            <ul className="space-y-1.5">
                                {(() => {
                                    let h2Counter = 0;
                                    return article.toc.map((item) => {
                                        if (item.level === 2) h2Counter++;
                                        return (
                                            <li key={item.id} style={{ paddingLeft: (item.level - 2) * 16 }}>
                                                <a href={`#${item.id}`} className="text-slate-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 py-0.5">
                                                    {item.level === 2 ? (
                                                        <span className="w-5 h-5 bg-purple-500/20 text-purple-400 rounded text-xs flex items-center justify-center flex-shrink-0 font-bold">{h2Counter}</span>
                                                    ) : (
                                                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full flex-shrink-0 ml-1.5" />
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

                    {/* Content */}
                    <article className="prose prose-invert prose-lg max-w-none text-slate-300">
                        <p className="lead text-xl text-slate-200 font-light border-l-4 border-amber-500 pl-4 italic">
                            {article.excerpt}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </article>

                    {/* Aura Vibe Widget — Mid-Article (คั่นระหว่างเนื้อหากับ FAQ) */}
                    <AuraVibeWidget />

                    {/* FAQ Section — renders when article has faqItems */}
                    {article.faqItems && article.faqItems.length > 0 && (
                        <section id="faq-section" className="mt-12 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-3xl">❓</span> คำถามที่พบบ่อย (FAQ)
                            </h2>
                            <div className="space-y-4">
                                {article.faqItems.map((item, index) => (
                                    <details
                                        key={index}
                                        className="group bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all"
                                        {...(index < 3 ? { open: true } : {})}
                                    >
                                        <summary className="flex items-start gap-3 p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                            <span className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded-lg text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{index + 1}</span>
                                            <span className="text-white font-medium leading-snug flex-1">{item.question}</span>
                                            <span className="text-slate-500 group-open:rotate-180 transition-transform duration-200 flex-shrink-0 mt-0.5">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </span>
                                        </summary>
                                        <div className="px-5 pb-5 pt-0 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 mt-0 pt-4">
                                            {item.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Tags */}
                    {article.keywords && article.keywords.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-white/10">
                            <div className="flex flex-wrap gap-2">
                                {article.keywords.map((keyword: string) => (
                                    <span key={keyword} className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded hover:bg-slate-700 transition-colors cursor-default">
                                        #{keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Palm Analysis CTA — palmistry article specific */}
                    {isPalmistryArticle && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl text-center">
                            <h3 className="text-xl font-bold text-white mb-2">อยากลองวิเคราะห์ลายมือของคุณด้วย AI?</h3>
                            <p className="text-slate-300 text-sm mb-4">ระบบ AI ของ NameMongkol อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา ให้คำแนะนำเชิงสร้างสรรค์ ฟรี 100%</p>
                            <Link href="/palm-analysis" className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-600/30">➡ วิเคราะห์ลายมือฟรีที่นี่</Link>
                        </div>
                    )}

                    {/* Aura Vibe Widget — End-of-Article (ก่อน CTA section) */}
                    <AuraVibeWidget />

                    {/* Author Bio Card — EEAT signal */}
                    <section className="mt-10 bg-gradient-to-r from-slate-800/60 to-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                            👨‍🏫
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                {article.author}
                                <Award size={16} className="text-amber-400" />
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-3">
                                นักวิเคราะห์ชื่อมงคลและเลขศาสตร์ ผู้เชี่ยวชาญด้านทักษาปกรณ์ เลขศาสตร์ไทย และโหราศาสตร์
                                ประสบการณ์วิเคราะห์ชื่อมากกว่า 150,000 ชื่อผ่านระบบ NameMongkol
                                อ้างอิงตำราทักษาปกรณ์ฉบับราชบัณฑิต และหลักเลขศาสตร์สากล
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/about" className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full transition-colors">
                                    <BookOpen size={12} /> เกี่ยวกับผู้เขียน
                                </Link>
                                <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full transition-colors">
                                    <ExternalLink size={12} /> วิเคราะห์ชื่อฟรี
                                </Link>
                                <Link href="/reviews" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full transition-colors">
                                    <Star size={12} /> ดูรีวิวผู้ใช้งาน
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Mandatory CTA — ตาม Checklist */}
                    <div className="mt-8 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-purple-500/10 border border-amber-500/20 rounded-2xl p-6 md:p-8 text-center">
                        <p className="text-xl md:text-2xl font-bold text-white mb-3">
                            อยากรู้ว่าชื่อของคุณดีแค่ไหน?
                        </p>
                        <p className="text-slate-300 mb-5">
                            วิเคราะห์ครบ 4 ศาสตร์: เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และกาลกิณี ฟรี 100%
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold px-8 py-3.5 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30 text-lg"
                        >
                            🔮 คลิกวิเคราะห์ฟรีที่นี่
                        </Link>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">บริการอื่นๆ ของเรา</h3>
                        <ArticleCTA />
                    </div>

                    {/* Share */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-slate-400 font-medium">แชร์บทความนี้</span>
                        <ArticleShareButtons title={article.title} slug={article.slug} />
                    </div>

                    {/* Related Articles Section */}
                    {relatedArticles.length > 0 && (
                        <section className="mt-12 pt-8 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                บทความที่เกี่ยวข้อง
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/articles/${related.slug}`}
                                        className="group bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:-translate-y-1"
                                    >
                                        <div className="h-32 w-full bg-slate-700 relative overflow-hidden">
                                            <ArticleImage
                                                src={related.coverImage}
                                                alt={related.coverImageAlt || `ภาพหน้าปกบทความ ${related.title}`}
                                                priority={false}
                                                className="group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs text-purple-400 mb-2">{related.category}</div>
                                            <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                                                {related.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SEO Bottom Content */}
                    <section className="mt-12 pt-8 border-t border-white/10 bg-slate-800/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-amber-400 mb-4">เกี่ยวกับ NameMongkol</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            <strong className="text-slate-300">NameMongkol</strong> คือเว็บไซต์วิเคราะห์ชื่อมงคลอันดับ 1 ของไทย
                            ใช้ระบบ AI ผสานศาสตร์โบราณ ครอบคลุม <strong className="text-slate-300">เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6</strong>
                            และ <strong className="text-slate-300">อักษรกาลกิณี</strong>
                            ให้บริการทั้งวิเคราะห์ชื่อฟรีและค้นหาชื่อมงคล Premium พร้อมวอลเปเปอร์มงคลเสริมดวง
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วิเคราะห์ชื่อมงคล
                            </Link>
                            <Link href="/premium-search" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                ค้นหาชื่อมงคล Premium
                            </Link>
                            <Link href="/phone-analysis" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วิเคราะห์เบอร์มงคล
                            </Link>
                            <Link href="/wallpapers" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วอลเปเปอร์มงคล
                            </Link>
                            <Link href="/articles" className="text-xs bg-slate-700/50 hover:bg-purple-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                บทความทั้งหมด
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

