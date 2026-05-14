
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Calendar, User } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { ArticleImage } from './ArticleImage';
import { useLanguage } from './LanguageProvider';

// Define the interface locally or import from types if available
interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    cover_image: string; // DB uses snake_case
    coverImage?: string; // Fallback for older static data if mixed (though we are fully migrating)
    date: string;
    author: string;
    category: string;
}

export const ArticleSection: React.FC = () => {
    const [recentArticles, setRecentArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('is_published', true)
                    .order('date', { ascending: false }) // Latest first
                    .limit(3);

                if (error) throw error;
                if (data) setRecentArticles(data);
            } catch (error) {
                console.error('Error fetching recent articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return null; // or a skeleton loader
    }

    if (recentArticles.length === 0) {
        return null; // Don't show section if no articles
    }

    return (
        <section className="py-16 px-4 md:px-8 relative overflow-hidden">
            {/* Background elements similar to KnowledgeSection */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl mx-auto pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-purple-400 text-sm font-medium mb-3">
                            <BookOpen size={16} />
                            <span>{t('sections.articles.badge')}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {t('sections.articles.title')}
                        </h2>
                        <p className="text-slate-400 max-w-xl">
                            {t('sections.articles.description')}
                        </p>
                    </div>

                    <Link
                        href="/articles"
                        className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 shrink-0"
                    >
                        <span>{t('sections.articles.viewAll')}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentArticles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/articles/${article.slug}`}
                            className="group relative flex flex-col h-full bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/25 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/15"
                        >
                            <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
                                <ArticleImage
                                    src={article.cover_image || article.coverImage}
                                    alt={`ภาพหน้าปกบทความ ${article.title}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-medium uppercase tracking-wider border border-white/10">
                                    {article.category}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>{new Date(article.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={12} />
                                        <span>{article.author}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-100 mb-2 leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>

                                <p className="text-sm text-slate-300 line-clamp-2 mb-4 flex-grow">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center text-sm font-medium text-purple-400 gap-1 group/link">
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
