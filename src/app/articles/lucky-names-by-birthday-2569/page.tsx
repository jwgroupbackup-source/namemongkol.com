
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Metadata } from 'next';
import { ArticleImage } from '@/components/ArticleImage';
import dynamic from 'next/dynamic';
import { articleNameByBirthday } from '@/data/article-name-by-birthday';

const ArticleShareButtons = dynamic(() => import('@/components/ArticleShareButtons').then(mod => mod.ArticleShareButtons), {
    loading: () => <div className="h-10 w-24 bg-slate-800/50 rounded-full animate-pulse" />,
});

const ArticleCTA = dynamic(() => import('@/components/ArticleCTA').then(mod => mod.ArticleCTA), {
    loading: () => <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />,
});

const AuraVibeWidget = dynamic(() => import('@/components/AuraVibeWidget'), {
    loading: () => <div className="h-48 bg-slate-800/50 rounded-2xl animate-pulse my-10 max-w-xl mx-auto" />,
});

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com').replace(/\/$/, '');
const article = articleNameByBirthday;

export const metadata: Metadata = {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords,
    alternates: { canonical: `${baseUrl}/articles/${article.slug}` },
    openGraph: {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt,
        url: `${baseUrl}/articles/${article.slug}`,
        images: [
            {
                url: article.coverImage?.startsWith('http') ? article.coverImage : `${baseUrl}${article.coverImage}`,
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
        images: [article.coverImage?.startsWith('http') ? article.coverImage : `${baseUrl}${article.coverImage}`],
    },
};

export default function ArticleLuckyNamesByBirthday2569() {
    const canonicalUrl = `${baseUrl}/articles/${article.slug}`;

    // Reading time estimate
    const plainText = article.content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    // Breadcrumb JSON-LD
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'หน้าหลัก', 'item': baseUrl },
            { '@type': 'ListItem', 'position': 2, 'name': 'บทความชื่อมงคล', 'item': `${baseUrl}/articles` },
            { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': canonicalUrl },
        ],
    };

    // FAQPage JSON-LD
    const faqJsonLd = article.faqItems && article.faqItems.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': article.faqItems.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': { '@type': 'Answer', 'text': item.answer },
        })),
    } : null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden pb-28">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Article Schema */}
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
                        "author": [{ "@type": "Person", "name": article.author, "url": baseUrl }],
                        "publisher": {
                            "@type": "Organization",
                            "name": "NameMongkol",
                            "logo": { "@type": "ImageObject", "url": `${baseUrl}/icon.png` },
                        },
                        "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
                        "keywords": article.keywords?.join(', ') || '',
                        "articleSection": article.category || '',
                        "wordCount": wordCount,
                        "inLanguage": "th",
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
                            <span>{article.date}</span>
                        </div>
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
                        <ArticleImage
                            src={article.coverImage}
                            alt={article.coverImageAlt || `ภาพหน้าปกบทความ ${article.title}`}
                            priority
                            objectFit="contain"
                            className="group-hover:scale-100"
                        />
                    </div>

                    {/* Table of Contents */}
                    {article.toc && article.toc.length > 0 && (
                        <nav className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700/50" aria-label="สารบัญบทความ">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-xl">📚</span> สารบัญ
                                <span className="text-xs font-normal text-slate-500 ml-auto">{article.toc.filter(t => t.level === 2).length} หัวข้อหลัก</span>
                            </h2>
                            <ul className="space-y-1.5">
                                {(() => {
                                    let h2Counter = 0;
                                    return article.toc!.map((item) => {
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

                    {/* Aura Vibe Widget — Mid-Article */}
                    <AuraVibeWidget />

                    {/* FAQ Section */}
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
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </span>
                                        </summary>
                                        <div className="px-5 pb-5 pt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50">
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

                    {/* Aura Vibe Widget — End-of-Article */}
                    <AuraVibeWidget />

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

                    {/* Related Articles */}
                    {article.relatedSlugs && article.relatedSlugs.length > 0 && (
                        <section className="mt-12 pt-8 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                บทความที่เกี่ยวข้อง
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {article.relatedSlugs.map((slug) => (
                                    <Link
                                        key={slug}
                                        href={`/articles/${slug}`}
                                        className="text-sm bg-slate-800/60 border border-slate-700/50 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 px-4 py-2 rounded-full transition-all hover:-translate-y-0.5"
                                    >
                                        → {slug.replace(/-/g, ' ')}
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
