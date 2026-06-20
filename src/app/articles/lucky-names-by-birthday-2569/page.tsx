
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, Calendar, User, Tag, RefreshCw, Award } from 'lucide-react';
import { Metadata } from 'next';
import { ArticleImage } from '@/components/ArticleImage';
import dynamic from 'next/dynamic';
import { articleNameByBirthday } from '@/data/article-name-by-birthday';
import { articles as localArticles } from '@/data/articles';
import { siteUrl } from '@/lib/seo';

const ArticleShareButtons = dynamic(() => import('@/components/ArticleShareButtons').then(mod => mod.ArticleShareButtons), {
    loading: () => <div className="h-10 w-24 bg-slate-200/50 rounded-full animate-pulse" />,
});

const ArticleCTA = dynamic(() => import('@/components/ArticleCTA').then(mod => mod.ArticleCTA), {
    loading: () => <div className="h-64 bg-slate-200/50 rounded-2xl animate-pulse" />,
});

const AuraVibeWidget = dynamic(() => import('@/components/AuraVibeWidget'), {
    loading: () => <div className="h-48 bg-slate-200/50 rounded-2xl animate-pulse my-10 max-w-xl mx-auto" />,
});

const baseUrl = siteUrl;
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
    const schemaKeywords = (article.keywords || []).slice(0, 8);
    const articleEntityTopics = [
        article.category,
        ...schemaKeywords,
    ].filter(Boolean);
    const directAnswerItems = article.toc
        ?.filter((item) => item.level === 2)
        .slice(0, 3)
        .map((item) => item.title)
        .filter(Boolean) || [];

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
        <div className="min-h-screen bg-[#f8f8fc] text-[#5a5a82] font-sans selection:bg-amber-500 selection:text-[#050711] relative overflow-hidden pb-28">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#c9933a]/5 rounded-full blur-[120px]"></div>
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px]"></div>
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
                        "datePublished": (() => { try { return new Date(article.date).toISOString(); } catch { return article.date; } })(),
                        "dateModified": (() => { try { return new Date(article.dateModified || article.date).toISOString(); } catch { return article.dateModified || article.date; } })(),
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
                            "logo": { "@type": "ImageObject", "url": `${baseUrl}/icon.png` },
                        },
                        "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
                        "keywords": article.keywords?.join(', ') || '',
                        "articleSection": article.category || '',
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
                                "name": "NameMongkol ค้นหาชื่อมงคล Premium",
                                "url": `${baseUrl}/premium-search`,
                                "applicationCategory": "LifestyleApplication",
                                "operatingSystem": "Web",
                            },
                        ],
                        "speakable": {
                            "@type": "SpeakableSpecification",
                            "cssSelector": ["h1", ".article-direct-answer", "#faq-section"],
                        },
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
                    <nav className="mb-6 text-sm text-[#5a5a82]" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 flex-wrap">
                            <li><Link href="/" className="hover:text-[#1a1a3e] transition-colors">หน้าหลัก</Link></li>
                            <li className="text-slate-400">/</li>
                            <li><Link href="/articles" className="hover:text-[#1a1a3e] transition-colors">บทความ</Link></li>
                            <li className="text-slate-400">/</li>
                            <li className="text-amber-600 font-medium truncate max-w-[200px] md:max-w-none">{article.title}</li>
                        </ol>
                    </nav>

                    {/* Back Link */}
                    <Link href="/articles" className="inline-flex items-center gap-1.5 text-xs text-[#5a5a82] hover:text-amber-700 mb-6 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-amber-500/40 transition-all group shadow-sm w-fit">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-amber-600" />
                        <span>บทความทั้งหมด</span>
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#5a5a82] mb-6 font-medium">
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
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
                        {article.dateModified && article.dateModified !== article.date && (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <RefreshCw size={14} />
                                <span>อัปเดต: {article.dateModified}</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-[#1a1a3e] tracking-tight">
                        {article.title}
                    </h1>

                    {/* Cover Image */}
                    <div className="w-full aspect-video bg-white rounded-2xl mb-10 overflow-hidden relative border border-slate-200 shadow-xl flex items-center justify-center">
                        <ArticleImage
                            src={article.coverImage}
                            alt={article.coverImageAlt || `ภาพหน้าปกบทความ ${article.title}`}
                            priority
                            objectFit="contain"
                            className="group-hover:scale-100"
                        />
                    </div>

                    <section
                        aria-labelledby="article-summary-heading"
                        className="article-direct-answer mb-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-[#f0f0f8] to-[#e8e8f4] p-5 shadow-lg sm:p-6"
                    >
                        <div className="mb-3 inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
                            สรุปก่อนอ่าน
                        </div>
                        <h2 id="article-summary-heading" className="text-xl font-bold leading-snug text-[#1a1a3e] sm:text-2xl">
                            บทความนี้ช่วยคัดชื่อมงคลตามวันเกิดให้ใช้งานได้เร็วขึ้น
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-[#5a5a82] sm:text-base">
                            ใช้หน้านี้เพื่อดูแนวทางเลือกชื่อมงคลตามวันเกิด แยกหัวข้อสำคัญให้สแกนง่าย แล้วต่อยอดไปตรวจชื่อจริงร่วมกับนามสกุลในเครื่องมือของ NameMongkol ได้ทันที
                        </p>
                        {directAnswerItems.length > 0 && (
                            <ul className="mt-5 grid gap-3">
                                {directAnswerItems.map((item) => (
                                    <li key={item} className="rounded-xl border border-slate-200 bg-white/70 p-3 text-sm leading-relaxed text-[#4a4a6e]">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <Link href="/name-check" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-[#1a1a3e] transition hover:border-amber-400 hover:bg-amber-100/70">
                                วิเคราะห์ชื่อฟรี
                                <span className="mt-1 block text-xs font-normal leading-relaxed text-[#5a5a82]">ตรวจชื่อจริงร่วมกับนามสกุลตาม 4 ศาสตร์</span>
                            </Link>
                            <Link href="/premium-search" className="rounded-xl border border-slate-200 bg-white/70 p-4 text-sm font-bold text-[#1a1a3e] transition hover:border-amber-500/40 hover:bg-white">
                                ค้นหาชื่อมงคล Premium
                                <span className="mt-1 block text-xs font-normal leading-relaxed text-[#5a5a82]">คัดชื่อพร้อมคะแนน ความหมาย และแนวทางเลือกใช้งาน</span>
                            </Link>
                        </div>
                    </section>

                    {/* Table of Contents */}
                    {article.toc && article.toc.length > 0 && (
                        <nav className="bg-gradient-to-br from-[#f0f0f8] to-[#e8e8f4] rounded-xl p-6 mb-8 border border-slate-200 shadow-md" aria-label="สารบัญบทความ">
                            <h2 className="text-lg font-bold text-[#1a1a3e] mb-4 flex items-center gap-2">
                                <span className="text-xl">📚</span> สารบัญ
                                <span className="text-xs font-normal text-[#6a6a92] ml-auto">{article.toc.filter(t => t.level === 2).length} หัวข้อหลัก</span>
                            </h2>
                            <ul className="space-y-1.5">
                                {(() => {
                                    let h2Counter = 0;
                                    return article.toc!.map((item) => {
                                        if (item.level === 2) h2Counter++;
                                        return (
                                            <li key={item.id} style={{ paddingLeft: (item.level - 2) * 16 }}>
                                                <a href={`#${item.id}`} className="text-[#4a4a6e] hover:text-amber-600 transition-colors text-sm flex items-center gap-2 py-0.5">
                                                    {item.level === 2 ? (
                                                        <span className="w-5 h-5 bg-amber-50 text-amber-600 rounded text-xs flex items-center justify-center flex-shrink-0 font-bold border border-amber-200">{h2Counter}</span>
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

                    {/* Content */}
                    <article className="prose prose-lg max-w-none text-[#5a5a82] prose-headings:text-[#1a1a3e] prose-a:text-amber-600 prose-strong:text-[#1a1a3e] prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:not-italic prose-blockquote:py-1 prose-blockquote:text-[#1a1a3e]">
                        <p className="lead rounded-2xl border border-amber-500/30 bg-amber-50 p-5 text-xl font-medium text-[#1a1a3e] shadow-sm leading-relaxed">
                            {article.excerpt}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </article>

                    {/* Aura Vibe Widget — Mid-Article */}
                    <AuraVibeWidget />

                    {/* FAQ Section */}
                    {article.faqItems && article.faqItems.length > 0 && (
                        <section id="faq-section" className="mt-12 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-[#1a1a3e] mb-6 flex items-center gap-3">
                                <span className="text-3xl">❓</span> คำถามที่พบบ่อย (FAQ)
                            </h2>
                            <div className="space-y-4">
                                {article.faqItems.map((item, index) => (
                                    <details
                                        key={index}
                                        className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all shadow-sm"
                                        {...(index < 3 ? { open: true } : {})}
                                    >
                                        <summary className="flex items-start gap-3 p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                            <span className="w-6 h-6 bg-amber-50 text-amber-600 rounded-lg text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5 border border-amber-200">{index + 1}</span>
                                            <span className="text-[#1a1a3e] font-medium leading-snug flex-1">{item.question}</span>
                                            <span className="text-[#6a6a92] group-open:rotate-180 transition-transform duration-200 flex-shrink-0 mt-0.5">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </span>
                                        </summary>
                                        <div className="px-5 pb-5 pt-4 text-[#5a5a82] text-sm leading-relaxed border-t border-slate-200">
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
                                    <span key={keyword} className="bg-white text-[#5a5a82] border border-slate-200 text-xs px-2 py-1 rounded-full hover:border-amber-500/30 transition-colors cursor-default shadow-sm">
                                        #{keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Aura Vibe Widget removed — single instance at mid-article is sufficient */}

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

                    {/* Mandatory CTA — "วิเคราะห์ชื่อฟรี" */}
                    <section className="mt-12 bg-gradient-to-r from-amber-50 to-[#f0f0f8] border border-amber-200 rounded-2xl p-8 text-center shadow-md">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a3e] mb-4">
                            อยากรู้ว่าชื่อของคุณดีแค่ไหน?
                        </h2>
                        <p className="text-[#5a5a82] mb-6 max-w-2xl mx-auto">
                            ใช้ระบบ AI วิเคราะห์ชื่อมงคลฟรี! ตรวจสอบเลขศาสตร์ ทักษา อายตนะ 6 และอักษรกาลกิณีได้ภายในไม่กี่วินาที
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/name-check" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-amber-500/20">
                                <span>🔮 วิเคราะห์ชื่อมงคลฟรี</span>
                            </Link>
                            <Link href="/premium-search" className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-[#1a1a3e] font-bold py-4 px-8 rounded-full transition-all shadow-sm">
                                <span>👑 ค้นหาชื่อมงคล Premium</span>
                            </Link>
                        </div>
                    </section>

                    {/* Author Bio Card — EEAT signal */}
                    <section className="mt-12 bg-gradient-to-br from-[#f0f0f8] to-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6 shadow-md">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200 flex-shrink-0">
                            <Award size={36} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#1a1a3e] mb-1">{article.author}</h3>
                            <p className="text-amber-600 text-sm mb-3">นักวิเคราะห์ชื่อมงคลและเลขศาสตร์</p>
                            <p className="text-[#5a5a82] text-sm leading-relaxed">
                                ผู้เชี่ยวชาญด้านเลขศาสตร์ ทักษาปกรณ์ และอายตนะ 6 ผู้พัฒนาระบบ AI วิเคราะห์ชื่อมงคลที่ครบถ้วนที่สุดในประเทศไทย
                                บทความนี้เขียนขึ้นจากประสบการณ์ตรงและข้อมูลวิจัยเชิงลึก เพื่อให้ผู้อ่านได้รับข้อมูลที่ถูกต้องและครบถ้วนที่สุด
                            </p>
                            <Link href="/about" className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-sm mt-2 transition-colors">
                                เรียนรู้เพิ่มเติมเกี่ยวกับผู้เขียน →
                            </Link>
                        </div>
                    </section>

                    {/* Related Articles — with readable titles */}
                    {article.relatedSlugs && article.relatedSlugs.length > 0 && (
                        <section className="mt-12 pt-8 border-t border-slate-200">
                            <h3 className="text-xl font-bold text-[#1a1a3e] mb-6 flex items-center gap-2">
                                <span className="text-2xl">📚</span>
                                บทความที่เกี่ยวข้อง
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {article.relatedSlugs.map((slug) => {
                                    const relatedArticle = localArticles.find(a => a.slug === slug);
                                    const displayTitle = relatedArticle?.title || slug.replace(/-/g, ' ');
                                    return (
                                        <Link
                                            key={slug}
                                            href={`/articles/${slug}`}
                                            className="text-sm bg-white border border-slate-200 hover:border-amber-500/40 text-[#5a5a82] hover:text-amber-700 px-4 py-2 rounded-full transition-all hover:-translate-y-0.5 shadow-sm"
                                        >
                                            → {displayTitle}
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* SEO Bottom Content */}
                    <section className="mt-12 pt-8 border-t border-slate-200 bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-4">เกี่ยวกับ NameMongkol</h3>
                        <p className="text-[#5a5a82] text-sm leading-relaxed mb-4">
                            <strong className="text-[#1a1a3e]">เว็บไซต์NameMongkol</strong> คือเว็บไซต์วิเคราะห์ชื่อมงคลอันดับ 1 ของไทย
                            ใช้ระบบ AI ผสานศาสตร์โบราณ ครอบคลุม <strong className="text-[#1a1a3e]">เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6</strong>
                            และ <strong className="text-[#1a1a3e]">อักษรกาลกิณี</strong>
                            ให้บริการทั้งวิเคราะห์ชื่อฟรีและค้นหาชื่อมงคล Premium พร้อมวอลเปเปอร์มงคลเสริมดวง
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-3 py-1.5 rounded-full text-[#5a5a82] hover:text-amber-700 transition-colors shadow-sm">
                                วิเคราะห์ชื่อมงคล
                            </Link>
                            <Link href="/name-check" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-3 py-1.5 rounded-full text-[#5a5a82] hover:text-amber-700 transition-colors shadow-sm">
                                เช็คชื่อมงคลฟรี
                            </Link>
                            <Link href="/premium-search" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-3 py-1.5 rounded-full text-[#5a5a82] hover:text-amber-700 transition-colors shadow-sm">
                                ค้นหาชื่อมงคล Premium
                            </Link>
                            <Link href="/phone-analysis" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-3 py-1.5 rounded-full text-[#5a5a82] hover:text-amber-700 transition-colors shadow-sm">
                                วิเคราะห์เบอร์มงคล
                            </Link>
                            <Link href="/wallpapers" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-3 py-1.5 rounded-full text-[#5a5a82] hover:text-amber-700 transition-colors shadow-sm">
                                วอลเปเปอร์มงคล
                            </Link>
                            <Link href="/articles" className="text-xs bg-[#f0f0f8] border border-slate-200 hover:border-amber-500/40 px-3 py-1.5 rounded-full text-[#5a5a82] hover:text-amber-700 transition-colors shadow-sm">
                                บทความทั้งหมด
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
