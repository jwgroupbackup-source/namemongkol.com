
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
        <div className="min-h-screen bg-[#050711] text-slate-100 font-sans selection:bg-amber-500 selection:text-[#050711] relative overflow-hidden pb-28">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#c9933a]/5 rounded-full blur-[120px]"></div>
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px]"></div>
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
                    <Link href="/articles" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group backdrop-blur-sm w-fit">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-amber-500/70" />
                        <span>บทความทั้งหมด</span>
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6 font-medium">
                        <span className="px-3 py-1 bg-white/5 text-amber-400 rounded-full border border-white/5 inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(201,147,58,0.1)]">
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
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white tracking-tight">
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
                        <nav className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-10 border border-white/5" aria-label="สารบัญบทความ">
                            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                <span className="text-xl opacity-80">📖</span> สารบัญ
                                <span className="text-xs font-normal text-slate-500 ml-auto">{article.toc.filter(t => t.level === 2).length} หัวข้อหลัก</span>
                            </h2>
                            <ul className="space-y-2">
                                {(() => {
                                    let h2Counter = 0;
                                    return article.toc.map((item) => {
                                        if (item.level === 2) h2Counter++;
                                        return (
                                            <li key={item.id} style={{ paddingLeft: (item.level - 2) * 16 }}>
                                                <a href={`#${item.id}`} className="text-slate-300 hover:text-amber-400 transition-colors text-sm flex items-center gap-3 py-1">
                                                    {item.level === 2 ? (
                                                        <span className="w-5 h-5 text-amber-500 rounded text-xs flex items-center justify-center flex-shrink-0 font-bold border border-amber-500/20">{h2Counter}</span>
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
                        <div dangerouslySetInnerHTML={{
                            __html: article.coverImage
                                ? article.content.replace(
                                    /<img\b[^>]*?>/gi,
                                    `<div class="w-full aspect-video bg-slate-900 rounded-2xl my-8 overflow-hidden relative border border-white/5 shadow-2xl shadow-purple-900/10 not-prose flex items-center justify-center"><img src="${article.coverImage}" alt="${(article.coverImageAlt ?? `ภาพหน้าปกบทความ ${article.title}`).replace(/"/g, '&quot;')}" class="object-contain w-full h-full" /></div>`
                                )
                                : article.content
                        }} />
                    </article>

                    {/* Aura Vibe Widget — Mid-Article (คั่นระหว่างเนื้อหากับ FAQ) */}
                    <AuraVibeWidget />

                    {/* FAQ Section — renders when article has faqItems */}
                    {article.faqItems && article.faqItems.length > 0 && (
                        <section id="faq-section" className="mt-14 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="text-3xl opacity-80">❓</span> คำถามที่พบบ่อย (FAQ)
                            </h2>
                            <div className="space-y-4">
                                {article.faqItems.map((item, index) => (
                                    <details
                                        key={index}
                                        className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
                                        {...(index < 3 ? { open: true } : {})}
                                    >
                                        <summary className="flex items-start gap-3 p-6 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                            <span className="w-6 h-6 text-amber-500 rounded text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5 border border-amber-500/20">{index + 1}</span>
                                            <span className="text-white font-medium leading-snug flex-1">{item.question}</span>
                                            <span className="text-slate-500 group-open:rotate-180 transition-transform duration-200 flex-shrink-0 mt-0.5">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </span>
                                        </summary>
                                        <div className="px-6 pb-6 pt-0 text-slate-300 text-sm leading-relaxed border-t border-white/5 mt-0 pt-4">
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
                        <div className="mt-10 p-8 bg-white/5 border border-[#c9933a]/20 rounded-2xl text-center backdrop-blur-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c9933a]/10 via-transparent to-transparent pointer-events-none"></div>
                            <h3 className="text-xl font-bold text-white mb-3 relative z-10">อยากลองวิเคราะห์ลายมือของคุณด้วย AI?</h3>
                            <p className="text-slate-300 text-sm mb-6 max-w-lg mx-auto relative z-10">ระบบ AI ของ NameMongkol อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา ให้คำแนะนำเชิงสร้างสรรค์ ฟรี 100%</p>
                            <Link href="/palm-analysis" className="inline-block px-8 py-3.5 bg-[#c9933a] hover:bg-[#d4a54e] text-white font-bold rounded-xl transition-all shadow-[0_0_24px_rgba(245,158,11,0.22)] hover:shadow-[0_0_32px_rgba(245,158,11,0.30)] hover:-translate-y-0.5 relative z-10">วิเคราะห์ลายมือฟรีที่นี่</Link>
                        </div>
                    )}

                    {/* Aura Vibe Widget — End-of-Article (ก่อน CTA section) */}
                    <AuraVibeWidget />

                    {/* Author Bio Card — EEAT signal */}
                    <section className="mt-12 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                            👨‍🏫
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                {article.author}
                                <Award size={16} className="text-[#c9933a]" />
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-2xl">
                                นักวิเคราะห์ชื่อมงคลและเลขศาสตร์ ผู้เชี่ยวชาญด้านทักษาปกรณ์ เลขศาสตร์ไทย และโหราศาสตร์
                                ประสบการณ์วิเคราะห์ชื่อมากกว่า 150,000 ชื่อผ่านระบบ NameMongkol
                                อ้างอิงตำราทักษาปกรณ์ฉบับราชบัณฑิต และหลักเลขศาสตร์สากล
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/about" className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:border-white/20 transition-all">
                                    <BookOpen size={12} className="text-[#c9933a]" /> เกี่ยวกับผู้เขียน
                                </Link>
                                <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:border-white/20 transition-all">
                                    <ExternalLink size={12} className="text-[#c9933a]" /> วิเคราะห์ชื่อฟรี
                                </Link>
                                <Link href="/reviews" className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:border-white/20 transition-all">
                                    <Star size={12} className="text-[#c9933a]" /> ดูรีวิวผู้ใช้งาน
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Mandatory CTA — ตาม Checklist */}
                    <div className="mt-12 bg-white/5 backdrop-blur-md border border-[#c9933a]/20 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c9933a]/10 via-transparent to-transparent pointer-events-none"></div>
                        <p className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10 tracking-tight">
                            อยากรู้ว่าชื่อของคุณดีแค่ไหน?
                        </p>
                        <p className="text-slate-300 mb-8 max-w-lg mx-auto relative z-10">
                            วิเคราะห์ครบ 4 ศาสตร์: เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และกาลกิณี ฟรี 100%
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-[#c9933a] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#d4a54e] transition-all shadow-[0_0_24px_rgba(245,158,11,0.22)] hover:shadow-[0_0_32px_rgba(245,158,11,0.30)] hover:-translate-y-0.5 text-lg relative z-10"
                        >
                            วิเคราะห์ชื่อฟรีที่นี่
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
                        <section className="mt-14 pt-10 border-t border-white/5">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="text-2xl opacity-80">📚</span>
                                บทความที่เกี่ยวข้อง
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/articles/${related.slug}`}
                                        className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1"
                                    >
                                        <div className="h-36 w-full bg-[#0a0f1d] relative overflow-hidden">
                                            <ArticleImage
                                                src={related.coverImage}
                                                alt={related.coverImageAlt || `ภาพหน้าปกบทความ ${related.title}`}
                                                priority={false}
                                                className="group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050711]/90 via-transparent to-transparent" />
                                        </div>
                                        <div className="p-5">
                                            <div className="text-xs font-medium text-[#c9933a] mb-2 uppercase tracking-wide">{related.category}</div>
                                            <h4 className="text-sm font-medium text-white group-hover:text-slate-200 transition-colors line-clamp-2 leading-relaxed">
                                                {related.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SEO Bottom Content */}
                    <section className="mt-14 pt-10 border-t border-white/5 bg-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-[#c9933a] mb-4">เกี่ยวกับ NameMongkol</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            <strong className="text-slate-300 font-medium">NameMongkol</strong> คือเว็บไซต์วิเคราะห์ชื่อมงคลอันดับ 1 ของไทย
                            ใช้ระบบ AI ผสานศาสตร์โบราณ ครอบคลุม <strong className="text-slate-300 font-medium">เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6</strong>
                            และ <strong className="text-slate-300 font-medium">อักษรกาลกิณี</strong>
                            ให้บริการทั้งวิเคราะห์ชื่อฟรีและค้นหาชื่อมงคล Premium พร้อมวอลเปเปอร์มงคลเสริมดวง
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/" className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:border-white/20 transition-all">
                                วิเคราะห์ชื่อมงคล
                            </Link>
                            <Link href="/premium-search" className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:border-white/20 transition-all">
                                ค้นหาชื่อมงคล Premium
                            </Link>
                            <Link href="/phone-analysis" className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:border-white/20 transition-all">
                                วิเคราะห์เบอร์มงคล
                            </Link>
                            <Link href="/wallpapers" className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:border-white/20 transition-all">
                                วอลเปเปอร์มงคล
                            </Link>
                            <Link href="/articles" className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:border-white/20 transition-all">
                                บทความทั้งหมด
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

