
'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Calendar, User } from 'lucide-react';
import { ArticleImage } from './ArticleImage';
import { useLanguage } from './LanguageProvider';

export interface ArticleSectionItem {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    cover_image: string;
    coverImage?: string;
    date: string;
    author: string;
    category: string;
}

type ArticleSectionProps = {
    articles?: ArticleSectionItem[];
    loading?: boolean;
};

export const ArticleSection: React.FC<ArticleSectionProps> = ({
    articles = [],
    loading = false,
}) => {
    const { t } = useLanguage();

    if (loading) {
        return (
            <section className="py-16 px-4 md:px-8 relative overflow-hidden" aria-busy="true" aria-live="polite">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="h-6 w-56 rounded bg-[#ddddf0] animate-pulse mb-3" />
                    <div className="h-4 w-80 max-w-full rounded bg-[#ddddf0] animate-pulse mb-10" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="rounded-2xl overflow-hidden border border-[#ddddf0] bg-white">
                                <div className="h-48 w-full bg-[#f8f8fc] animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-3 w-28 rounded bg-[#ddddf0] animate-pulse" />
                                    <div className="h-5 w-5/6 rounded bg-[#ddddf0] animate-pulse" />
                                    <div className="h-4 w-full rounded bg-[#f8f8fc] animate-pulse" />
                                    <div className="h-4 w-2/3 rounded bg-[#f8f8fc] animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (articles.length === 0) {
        return null; // Don't show section if no articles
    }

    return (
        <section className="py-16 px-4 md:px-8 relative overflow-hidden">
            {/* Background elements similar to KnowledgeSection */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl mx-auto pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#ddddf0] text-purple-600 shadow-sm text-sm font-medium mb-3">
                            <BookOpen size={16} />
                            <span>{t('sections.articles.badge')}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a3e] mb-2">
                            {t('sections.articles.title')}
                        </h2>
                        <p className="text-[#5a5a82] max-w-xl">
                            {t('sections.articles.description')}
                        </p>
                    </div>

                    <Link
                        href="/articles"
                        className="group flex items-center gap-2 text-[#5a5a82] hover:text-[#1a1a3e] transition-colors px-4 py-2 rounded-lg hover:bg-white border border-transparent hover:border-[#ddddf0] hover:shadow-sm shrink-0"
                    >
                        <span>{t('sections.articles.viewAll')}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/articles/${article.slug}`}
                            className="group relative flex flex-col h-full bg-white backdrop-blur-sm border border-[#ddddf0] rounded-2xl overflow-hidden hover:border-purple-400 transition-all hover:-translate-y-1 shadow-sm hover:shadow-[0_8px_30px_rgba(168,85,247,0.1)]"
                        >
                            <div className="h-48 w-full bg-[#f8f8fc] relative overflow-hidden">
                                <ArticleImage
                                    src={article.cover_image || article.coverImage}
                                    alt={`ภาพหน้าปกบทความ ${article.title}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded text-[10px] text-purple-600 font-medium uppercase tracking-wider border border-[#ddddf0]">
                                    {article.category}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 text-xs text-[#8e8eaa] mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>{new Date(article.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={12} />
                                        <span>{article.author}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-[#1a1a3e] mb-2 leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>

                                <p className="text-sm text-[#5a5a82] line-clamp-2 mb-4 flex-grow">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center text-sm font-medium text-purple-600 gap-1 group/link">
                                    {t('sections.articles.readMore')}
                                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
