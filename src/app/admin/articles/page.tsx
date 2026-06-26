'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

import { Loader2, Plus, Edit, Trash2, Save, X, Search, Image as ImageIcon, Eye, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { articles as localArticles } from '@/data/articles';
import { revalidateArticles } from '@/app/actions/revalidateArticles';

// Define Article Type locally or import from types if verified
interface Article {
    id: string; // UUID from DB
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string;
    date: string;
    author: string;
    category: string;
    keywords: string[];
    meta_title?: string;
    meta_description?: string;
    is_published?: boolean;
}

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    // Upload & Form State
    // Form State
    // const [uploading, setUploading] = useState(false); // Removed upload state

    // Validation State
    const [formError, setFormError] = useState<string | null>(null);
    const [availableCoverImages, setAvailableCoverImages] = useState<string[]>([]);
    const [isLoadingCoverImages, setIsLoadingCoverImages] = useState(false);
    const [coverImageSearchTerm, setCoverImageSearchTerm] = useState('');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        const Swal = (await import('sweetalert2')).default;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            Swal.fire('Error', 'Failed to fetch articles', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCoverImages = availableCoverImages.filter((imagePath) =>
        imagePath.toLowerCase().includes(coverImageSearchTerm.toLowerCase())
    );

    const isValidArticleCoverPath = (coverPath: string) => {
        if (!coverPath.startsWith('/images/articles/')) return false;
        if (coverPath.includes('..')) return false;
        return true;
    };

    const fetchAvailableCoverImages = async () => {
        setIsLoadingCoverImages(true);
        try {
            const response = await fetch('/api/admin/article-images', { cache: 'no-store' });
            const data = await response.json();

            if (!response.ok || !data?.success || !Array.isArray(data?.images)) {
                throw new Error(data?.error || 'Failed to load image list');
            }

            setAvailableCoverImages(data.images);
        } catch (error) {
            console.error('Error fetching article images:', error);
            setAvailableCoverImages([]);
        } finally {
            setIsLoadingCoverImages(false);
        }
    };

    const handleAdd = () => {
        setCurrentArticle({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            cover_image: '',
            date: new Date().toISOString().split('T')[0],
            author: 'Admin',
            category: 'ทั่วไป',
            keywords: [],
            is_published: true
        });
        // setSelectedFile(null);
        // setPreviewUrl(null);
        setCoverImageSearchTerm('');
        fetchAvailableCoverImages();
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (article: Article) => {
        setCurrentArticle({ ...article });
        // setSelectedFile(null);
        // setPreviewUrl(article.cover_image);
        setCoverImageSearchTerm('');
        fetchAvailableCoverImages();
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const Swal = (await import('sweetalert2')).default;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the article.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const deletedArticle = articles.find(article => article.id === id);
                const { error } = await supabase
                    .from('articles')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                await revalidateArticles(deletedArticle?.slug);

                setArticles(prev => prev.filter(a => a.id !== id));
                Swal.fire('Deleted!', 'Article has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting article:', error);
                Swal.fire('Error', 'Failed to delete article', 'error');
            }
        }
    };

    // File upload logic removed


    // Auto-generate slug from title if empty
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w\u0E00-\u0E7F-]+/g, '') // Keep Thai and English chars
            .replace(/--+/g, '-');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const Swal = (await import('sweetalert2')).default;
        // setUploading(true);
        setFormError(null);

        try {
            // Validation: Title required
            if (!currentArticle.title || currentArticle.title.trim() === '') {
                setFormError('กรุณากรอกชื่อบทความ');
                // setUploading(false);
                return;
            }

            // Validation: Slug unique
            const slugToCheck = (currentArticle.slug || generateSlug(currentArticle.title)).trim();
            const duplicate = articles.find(a => a.slug === slugToCheck && a.id !== currentArticle.id);
            if (duplicate) {
                setFormError('Slug ซ้ำกับบทความอื่น กรุณาเปลี่ยน');
                // setUploading(false);
                return;
            }

            const coverImagePath = (currentArticle.cover_image || '').trim();
            if (!coverImagePath) {
                setFormError('กรุณาเลือกภาพปกจากคลังรูป /images/articles');
                return;
            }

            if (!isValidArticleCoverPath(coverImagePath)) {
                setFormError('ภาพปกต้องเป็น path ภายใต้ /images/articles เท่านั้น');
                return;
            }

            if (availableCoverImages.length > 0 && !availableCoverImages.includes(coverImagePath)) {
                setFormError('ไม่พบภาพที่เลือกในคลังรูป /images/articles กรุณาเลือกใหม่');
                return;
            }

            const payload = {
                title: currentArticle.title,
                slug: slugToCheck,
                excerpt: currentArticle.excerpt || '',
                content: currentArticle.content || '',
                cover_image: coverImagePath,
                date: currentArticle.date || new Date().toISOString().split('T')[0],
                author: currentArticle.author || '',
                category: currentArticle.category || '',
                keywords: Array.isArray(currentArticle.keywords) ? currentArticle.keywords : [],
                meta_title: currentArticle.meta_title || currentArticle.title || '',
                meta_description: currentArticle.meta_description || currentArticle.excerpt || '',
                is_published: currentArticle.is_published ?? true
            };

            if (isEditing && currentArticle.id) {
                const previousSlug = articles.find(article => article.id === currentArticle.id)?.slug;
                const { error } = await supabase
                    .from('articles')
                    .update(payload)
                    .eq('id', currentArticle.id);

                if (error) throw error;
                await revalidateArticles(slugToCheck);

                if (previousSlug && previousSlug !== slugToCheck) {
                    await revalidateArticles(previousSlug);
                }

                // Refresh list or update local state
                setArticles(prev => prev.map(a => a.id === currentArticle.id ? { ...a, ...payload, id: currentArticle.id as string } : a));
                Swal.fire('Success', 'Article updated successfully', 'success');
            } else {
                const { data, error } = await supabase
                    .from('articles')
                    .insert([payload])
                    .select()
                    .single();

                if (error) throw error;
                await revalidateArticles(slugToCheck);
                if (data) setArticles(prev => [data as Article, ...prev]);
                Swal.fire('Success', 'Article created successfully', 'success');
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving article:', error);
            Swal.fire('Error', 'Failed to save article', 'error');
        } finally {
            // setUploading(false);
        }
    };

    // Helper for batched async operations
    const processInChunks = async <T, R>(
        items: T[],
        chunkSize: number,
        fn: (item: T) => Promise<R>
    ): Promise<R[]> => {
        const results: R[] = [];
        for (let i = 0; i < items.length; i += chunkSize) {
            const chunk = items.slice(i, i + chunkSize);
            const chunkResults = await Promise.all(chunk.map(fn));
            results.push(...chunkResults);
        }
        return results;
    };

    const handleSync = async () => {
        const Swal = (await import('sweetalert2')).default;
        const result = await Swal.fire({
            title: 'Sync Local Articles?',
            text: "This will import hardcoded articles from 'src/data/articles.ts' into the database. Existing articles with the same slug will be UPDATED with local data.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Sync & Overwrite!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setLoading(true);
            let addedCount = 0;
            let updatedCount = 0;

            try {
                // Fetch existing slugs to avoid duplicates (safeguard)
                const { data: existingArticles, error: fetchError } = await supabase
                    .from('articles')
                    .select('slug, cover_image');

                if (fetchError) throw fetchError;

                const existingSlugs = new Set(existingArticles?.map(a => a.slug) || []);
                const existingBySlug = new Map(
                    (existingArticles || []).map(a => [a.slug, a])
                );

                // Process in chunks of 5 to avoid rate limits
                await processInChunks(localArticles, 5, async (article) => {
                    // Map local article to DB schema
                    const localCover = article.coverImage || '';
                    const isLocalCoverAbsolute = /^https?:\/\//i.test(localCover);
                    const existingCover = existingBySlug.get(article.slug)?.cover_image || '';
                    const coverImageToUse = isLocalCoverAbsolute ? localCover : (existingCover || localCover);

                    const payload = {
                        title: article.title,
                        slug: article.slug,
                        excerpt: article.excerpt || '',
                        content: article.content || '',
                        cover_image: coverImageToUse,
                        date: article.date,
                        author: article.author,
                        category: article.category,
                        keywords: article.keywords,
                        meta_title: article.metaTitle || article.title,
                        meta_description: article.metaDescription || article.excerpt,
                        is_published: true
                    };

                    if (existingSlugs.has(article.slug)) {
                        const { error: updateError } = await supabase
                            .from('articles')
                            .update(payload)
                            .eq('slug', article.slug);

                        if (updateError) {
                            console.error(`Failed to update ${article.slug}:`, updateError);
                        } else {
                            updatedCount++; // Note: strictly speaking not atomic in parallel, but JS single thread handles increment
                        }
                    } else {
                        const { error: insertError } = await supabase
                            .from('articles')
                            .insert([payload]);

                        if (insertError) {
                            console.error(`Failed to import ${article.slug}:`, insertError);
                        } else {
                            addedCount++;
                        }
                    }
                });

                await revalidateArticles();
                await fetchArticles(); // Refresh list
                Swal.fire('Sync Complete', `Imported: ${addedCount}, Updated: ${updatedCount}`, 'success');

            } catch (error: any) {
                console.error('Sync Error:', error);
                Swal.fire('Sync Failed', error.message || 'Unknown error occurred', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const isLocalCover = (url?: string | null) => {
        if (!url) return true;
        return !/^https?:\/\//i.test(url);
    };

    const getLatestUploadedCoverUrl = async (slug: string) => {
        const { data, error } = await supabase.storage
            .from('articles')
            .list('', { limit: 200, search: `${slug}-` });

        if (error || !data) return null;

        const candidates = data
            .filter(item => item.name?.startsWith(`${slug}-`))
            .map(item => {
                const match = item.name.match(/-(\d+)\.[^.]+$/);
                const ts = match ? Number(match[1]) : 0;
                return { name: item.name, ts };
            })
            .sort((a, b) => (b.ts || 0) - (a.ts || 0));

        const latest = candidates[0];
        if (!latest?.name) return null;

        const { data: publicData } = supabase.storage
            .from('articles')
            .getPublicUrl(latest.name);

        return publicData?.publicUrl || null;
    };

    const handleRestoreCoverImages = async () => {
        const Swal = (await import('sweetalert2')).default;

        const result = await Swal.fire({
            title: 'Restore Cover Images?',
            text: 'จะพยายามกู้รูปปกล่าสุดจาก Storage สำหรับบทความที่รูปถูกทับด้วยไฟล์ local หลัง Sync',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Restore',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        setIsRestoring(true);
        setLoading(true);
        let restoredCount = 0;
        let skippedCount = 0;

        try {
            const { data: dbArticles, error } = await supabase
                .from('articles')
                .select('id, slug, cover_image');

            if (error) throw error;

            const articlesToProcess = (dbArticles || []).filter(a => isLocalCover(a.cover_image));
            skippedCount = (dbArticles?.length || 0) - articlesToProcess.length;

            // Process in chunks of 5
            await processInChunks(articlesToProcess, 5, async (article) => {
                const latestUrl = await getLatestUploadedCoverUrl(article.slug);
                if (!latestUrl) {
                    skippedCount++;
                    return;
                }

                const { error: updateError } = await supabase
                    .from('articles')
                    .update({ cover_image: latestUrl })
                    .eq('id', article.id);

                if (!updateError) {
                    restoredCount++;
                } else {
                    console.error(`Failed to update ${article.slug}:`, updateError);
                }
            });

            await revalidateArticles();
            await fetchArticles();
            Swal.fire('Restore Complete', `Restored: ${restoredCount}, Skipped: ${skippedCount}`, 'success');
        } catch (err: any) {
            console.error('Restore cover images error:', err);
            Swal.fire('Restore Failed', err.message || 'Unknown error occurred', 'error');
        } finally {
            setIsRestoring(false);
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">จัดการบทความ</h1>
                    <p className="text-slate-400">Manage articles, SEO, and content</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSync}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <RefreshCw size={20} />
                        Sync Articles
                    </button>
                    <button
                        onClick={handleRestoreCoverImages}
                        disabled={isRestoring}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ImageIcon size={20} />
                        Restore Covers
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={20} />
                        เพิ่มบทความใหม่
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/50">
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Image</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Title / Slug</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Category</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap">Date</th>
                                <th className="p-4 text-slate-400 font-medium whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredArticles.map((article) => (
                                <tr key={article.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="relative w-16 h-10 rounded overflow-hidden bg-slate-800">
                                            {article.cover_image ? (
                                                <Image
                                                    src={article.cover_image}
                                                    alt={`ภาพหน้าปกบทความ ${article.title} - บทความชื่อมงคล NameMongkol`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                        const icon = document.createElement('div');
                                                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                                                        target.parentElement?.appendChild(icon);
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white font-medium line-clamp-1">{article.title}</div>
                                        <div className="text-xs text-emerald-400 font-mono mt-1">{article.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">
                                            {article.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {article.date}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                target="_blank"
                                                className="p-2 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(article)}
                                                className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-700 shrink-0">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing ? 'Edit Article' : 'Create Article'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {formError && (
                                    <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-2 mb-4">
                                        {formError}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentArticle.title || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Slug (Auto-generated if empty)</label>
                                        <input
                                            type="text"
                                            value={currentArticle.slug || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Category</label>
                                        <input
                                            type="text"
                                            value={currentArticle.category || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Author</label>
                                        <input
                                            type="text"
                                            value={currentArticle.author || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, author: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Date</label>
                                        <input
                                            type="date"
                                            value={currentArticle.date || ''}
                                            onChange={e => setCurrentArticle({ ...currentArticle, date: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Excerpt (Meta Description)</label>
                                    <textarea
                                        rows={2}
                                        value={currentArticle.excerpt || ''}
                                        onChange={e => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* SEO Overrides */}
                                <div className="border border-slate-700/50 rounded-xl p-4 space-y-4 bg-slate-800/20">
                                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                        <span>🔍</span> SEO Overrides <span className="text-slate-500 font-normal normal-case">(ถ้าว่างจะใช้ Title/Excerpt อัตโนมัติ)</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-400">Meta Title</label>
                                            <input
                                                type="text"
                                                value={currentArticle.meta_title || ''}
                                                onChange={e => setCurrentArticle({ ...currentArticle, meta_title: e.target.value })}
                                                placeholder="จะใช้ Title ถ้าว่าง"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                                            />
                                            <div className="text-xs text-slate-600">{(currentArticle.meta_title || '').length}/60 ตัวอักษร</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-400">Meta Description</label>
                                            <input
                                                type="text"
                                                value={currentArticle.meta_description || ''}
                                                onChange={e => setCurrentArticle({ ...currentArticle, meta_description: e.target.value })}
                                                placeholder="จะใช้ Excerpt ถ้าว่าง"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                                            />
                                            <div className="text-xs text-slate-600">{(currentArticle.meta_description || '').length}/160 ตัวอักษร</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Editor - Simple Textarea for HTML */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Content (HTML Supported)</label>
                                    <div className="text-xs text-slate-500 mb-1">Use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; tags for formatting.</div>
                                    <textarea
                                        rows={10}
                                        value={currentArticle.content || ''}
                                        onChange={e => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Image Path Input */}
                                <div className="space-y-2">

                                    <label className="text-sm font-medium text-slate-300">Cover Image (เลือกจาก /images/articles)</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="relative w-40 h-24 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                                            {currentArticle.cover_image ? (
                                                <Image
                                                    src={currentArticle.cover_image}
                                                    alt="ตัวอย่างภาพหน้าปกบทความ"
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <input
                                                type="text"
                                                value={currentArticle.cover_image || ''}
                                                readOnly
                                                placeholder="เลือกรูปจากคลังด้านล่าง"
                                                className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none text-sm font-mono"
                                            />
                                            <p className="text-xs text-slate-500">
                                                เลือกภาพจากคลังใน <span className="text-emerald-400">/public/images/articles</span> เท่านั้น (รองรับโฟลเดอร์ย่อย)
                                            </p>

                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                <input
                                                    type="text"
                                                    value={coverImageSearchTerm}
                                                    onChange={(e) => setCoverImageSearchTerm(e.target.value)}
                                                    placeholder="ค้นหาชื่อไฟล์ภาพ..."
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                                />
                                            </div>

                                            <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/50 p-2">
                                                {isLoadingCoverImages ? (
                                                    <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
                                                        <Loader2 className="animate-spin mr-2" size={16} />
                                                        กำลังโหลดคลังรูป...
                                                    </div>
                                                ) : filteredCoverImages.length === 0 ? (
                                                    <div className="py-8 text-center text-slate-500 text-sm">
                                                        ไม่พบภาพใน /images/articles
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                        {filteredCoverImages.map((imagePath) => {
                                                            const isSelected = currentArticle.cover_image === imagePath;
                                                            return (
                                                                <button
                                                                    key={imagePath}
                                                                    type="button"
                                                                    onClick={() => setCurrentArticle({ ...currentArticle, cover_image: imagePath })}
                                                                    className={`rounded-lg border p-1 transition-colors text-left ${isSelected
                                                                        ? 'border-emerald-500 bg-emerald-500/10'
                                                                        : 'border-slate-700 hover:border-slate-500 bg-slate-800/40'
                                                                        }`}
                                                                >
                                                                    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-900">
                                                                        <Image
                                                                            src={imagePath}
                                                                            alt={`ตัวอย่างภาพประกอบบทความ ${imagePath
                                                                                .split('/')
                                                                                .pop()
                                                                                ?.replace(/\.[^/.]+$/, '')
                                                                                .replace(/[-_]+/g, ' ') || 'จากคลังรูปภาพ'}`}
                                                                            fill
                                                                            className="object-cover"
                                                                            sizes="120px"
                                                                        />
                                                                    </div>
                                                                    <div className="mt-1 px-1">
                                                                        <p className="text-[10px] leading-4 text-slate-300 truncate">
                                                                            {imagePath.split('/').pop()}
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-700 pt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"

                                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >

                                        <Save size={20} />
                                        Save Article

                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
