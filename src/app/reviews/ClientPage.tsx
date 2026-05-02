'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircle, Filter, Quote, Plus, Trash2, Edit, Search, Sparkles, ThumbsUp, BadgeCheck, Share2 } from 'lucide-react';
import Image from 'next/image';
import { Review, ReviewServiceType } from '@/types';
import { ReviewFormModal } from '@/components/ReviewFormModal';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';

// Service type mapping for SEO - ชื่อบริการและ URL
const SERVICE_INFO: Record<ReviewServiceType, { name: string; url: string; shortName: string }> = {
    'name-analysis': { name: 'วิเคราะห์ชื่อมงคล', url: '/name-analysis', shortName: 'วิเคราะห์ชื่อ' },
    'phone-analysis': { name: 'วิเคราะห์เบอร์มงคล', url: '/phone-analysis', shortName: 'วิเคราะห์เบอร์' },
    'premium-search': { name: 'ค้นหาชื่อมงคลพรีเมียม', url: '/premium-search', shortName: 'ค้นหาชื่อพรีเมียม' },
    'premium-analysis': { name: 'วิเคราะห์ชื่อแบบพรีเมียม', url: '/premium-analysis', shortName: 'วิเคราะห์พรีเมียม' },
    'wallpapers': { name: 'วอลเปเปอร์มงคล', url: '/wallpapers', shortName: 'วอลเปเปอร์' },
    'general': { name: 'บริการ NameMongkol', url: '/', shortName: 'ทั่วไป' }
};

// Category URL mapping for clickable tags - SEO Internal Linking
const TAG_URLS: Record<string, string> = {
    'การเงิน': '/reviews?category=การเงิน',
    'การงาน': '/reviews?category=การงาน',
    'ความรัก': '/reviews?category=ความรัก',
    'สุขภาพ': '/reviews?category=สุขภาพ',
    'โชคลาภ': '/reviews?category=โชคลาภ'
};

const inferServiceType = (tags: string[]): ReviewServiceType => {
    if (tags.some(t => t.includes('เบอร์') || t.includes('โทร'))) return 'phone-analysis';
    if (tags.some(t => t.includes('ชื่อ'))) return 'name-analysis';
    if (tags.some(t => t.includes('วอลเปเปอร์'))) return 'wallpapers';
    return 'general';
};

export default function ClientPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
    const [userVotedReviews, setUserVotedReviews] = useState<Set<string>>(new Set());
    const router = useRouter();
    const { t } = useLanguage();

    const categories = useMemo(() => ([
        { id: 'all', label: t('pages.reviews.categories.all') },
        { id: 'การเงิน', label: t('pages.reviews.categories.finance') },
        { id: 'การงาน', label: t('pages.reviews.categories.career') },
        { id: 'ความรัก', label: t('pages.reviews.categories.love') },
        { id: 'สุขภาพ', label: t('pages.reviews.categories.health') },
        { id: 'โชคลาภ', label: t('pages.reviews.categories.fortune') }
    ]), [t]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setCurrentUser(session?.user || null);

            if (session?.user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (data && data.role === 'admin') {
                    setIsAdmin(true);
                }
            }
        };
        checkUser();
    }, []);

    const handleWriteStory = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            const Swal = (await import('sweetalert2')).default;

            Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านต้องเข้าสู่ระบบก่อนจึงจะสามารถเขียนรีวิวได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#d33',
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff'
            }).then((result: any) => {
                if (result.isConfirmed) {
                    router.push('/login');
                }
            });
            return;
        }

        setEditingReview(null); // Reset editing state for new story
        setIsModalOpen(true);
    };

    const handleEdit = (review: Review) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const handleDelete = async (reviewId: string) => {
        const Swal = (await import('sweetalert2')).default;

        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "คุณต้องการลบรีวิวนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบรีวิว',
            cancelButtonText: 'ยกเลิก',
            background: '#1e293b',
            color: '#fff'
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                try {
                    const { error } = await supabase
                        .from('reviews')
                        .delete()
                        .eq('id', reviewId);

                    if (error) throw error;

                    // Update UI by fetching from DB to ensure sync
                    await fetchReviews();

                    Swal.fire({
                        title: 'ลบสำเร็จ!',
                        text: 'รีวิวของคุณถูกลบเรียบร้อยแล้ว',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error: any) {
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: error.message || 'ไม่สามารถลบรีวิวได้',
                        icon: 'error',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            }
        });
    };

    const [dbReviews, setDbReviews] = useState<Review[]>([]);

    // Helper function to format date with <time> tag for SEO
    const formatDateForSEO = (dateString: string) => {
        const date = new Date(dateString);
        const isoDate = date.toISOString().split('T')[0]; // ISO 8601 format
        const thaiDate = date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: '2-digit'
        });
        return { isoDate, thaiDate };
    };

    // Handle helpful vote
    const handleHelpfulVote = async (reviewId: string) => {
        if (userVotedReviews.has(reviewId)) {
            // Already voted, could implement unvote logic
            return;
        }

        try {
            // Optimistic update
            setHelpfulVotes(prev => ({
                ...prev,
                [reviewId]: (prev[reviewId] || 0) + 1
            }));
            setUserVotedReviews(prev => new Set(prev).add(reviewId));

            // Store vote in localStorage to persist
            const storedVotes = JSON.parse(localStorage.getItem('helpfulVotes') || '[]');
            storedVotes.push(reviewId);
            localStorage.setItem('helpfulVotes', JSON.stringify(storedVotes));

            // Update in database (optional - for real implementation)
            await supabase
                .from('reviews')
                .update({ helpful_count: (helpfulVotes[reviewId] || 0) + 1 })
                .eq('id', reviewId);
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    // Share review
    const handleShareReview = async (review: Review) => {
        const shareUrl = `${window.location.origin}/reviews#review-${review.id}`;
        const shareText = `รีวิวจาก ${review.nickname}: "${review.content.substring(0, 100)}..."`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'รีวิวจาก NameMongkol',
                    text: shareText,
                    url: shareUrl
                });
            } catch {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl);
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                title: 'คัดลอกลิงก์แล้ว!',
                icon: 'success',
                background: '#1e293b',
                color: '#fff',
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    // Load user's previous votes from localStorage
    useEffect(() => {
        const storedVotes = JSON.parse(localStorage.getItem('helpfulVotes') || '[]');
        setUserVotedReviews(new Set(storedVotes));
    }, []);

    const fetchReviews = useCallback(async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            return;
        }

        if (data) {
            // Map Supabase data to Review interface if needed, or use directly
            const formatted = data.map(r => ({
                ...r,
                date: r.created_at, // Map created_at to date
                tags: r.tags || [r.category], // Ensure tags exist
                // Infer service_type from tags if not set
                service_type: r.service_type || inferServiceType(r.tags || [r.category]),
                // Default is_verified to true if user_id exists
                is_verified: r.is_verified ?? !!r.user_id,
                helpful_count: r.helpful_count || 0,
                images: r.images || []
            }));
            setDbReviews(formatted);

            // Initialize helpful votes from database
            const votesMap: Record<string, number> = {};
            formatted.forEach(r => {
                votesMap[r.id] = r.helpful_count || 0;
            });
            setHelpfulVotes(votesMap);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const filteredReviews = useMemo(() => {
        const target = dbReviews;
        if (selectedCategory === 'all') return target;
        return target.filter(review => review.tags && review.tags.includes(selectedCategory));
    }, [selectedCategory, dbReviews]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-28">
            {/* Header Section */}
            <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute top-[20%] right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-[#0f172a] to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center pt-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold uppercase tracking-wider mb-8 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    >
                        <MessageCircle size={16} />
                        <span>{t('pages.reviews.badge')}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-100 to-amber-500 mb-6 drop-shadow-sm leading-tight"
                    >
                        {t('pages.reviews.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        {t('pages.reviews.description')}
                    </motion.p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ delay: 0.3 }}
                            onClick={handleWriteStory}
                            className="relative group w-full sm:w-auto"
                        >
                            {/* Animated Glow Effect */}
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                            
                            <div className="relative flex flex-col items-center gap-1 sm:gap-1.5 px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-b from-slate-900 to-slate-800 border border-amber-500/50 rounded-2xl leading-none w-full sm:w-auto">
                                <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] sm:text-[12px] font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg border border-white/30 transform rotate-12 group-hover:rotate-6 transition-transform whitespace-nowrap overflow-hidden z-10">
                                    <span className="animate-[shimmer_2s_infinite] absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full" />
                                    🎁 รับ 30 เครดิตฟรี!
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-amber-400 font-extrabold text-lg sm:text-xl lg:text-2xl tracking-wide">
                                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                                    <span>เขียนเรื่องราวของคุณ</span>
                                </div>
                                <div className="text-amber-500/70 text-[11px] sm:text-sm font-medium mt-1">แบ่งปันประสบการณ์เพื่อเป็นวิทยาทาน</div>
                            </div>
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ delay: 0.4 }}
                            onClick={() => router.push('/')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-base sm:text-lg hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm mt-3 sm:mt-0"
                        >
                            <Search className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-slate-300" />
                            {t('pages.reviews.ctaAnalyze')}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="max-w-4xl mx-auto text-center mb-12 mt-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-500 mb-6">
                        {t('pages.reviews.subheading')}
                    </h2>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        ที่ NameMongkol เราเชื่อว่าชื่อและตัวเลขมีพลังในการเปลี่ยนแปลงชีวิต หน้านี้ได้รวบรวม <Link href="/name-analysis" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>รีวิวเปลี่ยนชื่อมงคล</strong></Link> และ <Link href="/phone-analysis" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>ประสบการณ์เปลี่ยนเบอร์มงคล</strong></Link> จากผู้ใช้งานจริงของเรา ไม่ว่าคุณจะกำลังมองหา <Link href="/search" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400 transition-colors"><strong>ชื่อมงคล</strong></Link> เพื่อเสริมดวงการเงิน แก้เคล็ดเรื่องสุขภาพ หรือเสริมเสน่ห์ความรัก เรื่องราวเหล่านี้คือบทพิสูจน์ว่าศาสตร์แห่งการตั้งชื่อและเลขศาสตร์ประยุกต์สามารถช่วยพลิกฟื้นชะตาชีวิตและสร้างความมั่นใจให้คุณได้อย่างไร
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${selectedCategory === category.id
                                ? 'cosmic-chip-active'
                                : 'cosmic-chip'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid Simulation (Responsive Columns) */}
                <motion.div
                    layout
                    className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
                >
                    <AnimatePresence>
                        {filteredReviews.map((review) => (
                            <motion.div
                                layout
                                key={review.id}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="break-inside-avoid glass-card ancient-frame rounded-2xl sm:rounded-3xl p-4 sm:p-7 group relative overflow-hidden mb-4 sm:mb-6"
                                itemScope
                                itemType="https://schema.org/Review"
                            >
                                {/* Hidden Microdata for SEO Item Reviewed */}
                                <meta itemProp="itemReviewed" content={review.service_type && SERVICE_INFO[review.service_type] ? SERVICE_INFO[review.service_type].name : SERVICE_INFO['general'].name} />
                                {/* Owner Actions - Adjusted z-index and position */}
                                {currentUser && (currentUser.id === review.user_id || isAdmin) && (
                                    <div className="absolute top-4 right-4 z-30 flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(review); }}
                                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                            title="แก้ไข"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(review.id); }}
                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                            title="ลบ"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Decorative Quote - Hide if owner or admin to prevent overlap or move left */}
                                {(!currentUser || (currentUser.id !== review.user_id && !isAdmin)) && (
                                    <Quote className="absolute top-4 right-4 text-white/5 w-12 h-12 rotate-12 group-hover:text-amber-500/10 transition-colors pointer-events-none" />
                                )}

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-500/40 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] overflow-hidden shrink-0">
                                        {review.avatar ? (
                                            <Image
                                                src={review.avatar}
                                                alt={`รูปโปรไฟล์ของ ${review.nickname} ผู้เขียนรีวิว`}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            review.nickname.charAt(0)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <span className="text-white font-bold text-sm sm:text-base" itemProp="author" itemScope itemType="https://schema.org/Person">
                                                <span itemProp="name">{review.nickname}</span>
                                            </span>
                                            {/* Verified Badge - E-E-A-T Signal */}
                                            {review.is_verified && (
                                                <span 
                                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 cursor-default"
                                                    title="ยืนยันแล้วว่าเป็นผู้ใช้บริการจริงผ่านระบบสมาชิก"
                                                >
                                                    <BadgeCheck size={12} className="fill-emerald-400 text-emerald-900" />
                                                    ผู้ใช้บริการจริง
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-amber-500/80 text-xs font-medium uppercase tracking-wide flex items-center gap-2 flex-wrap">
                                            {review.role}
                                            {/* Service Type with Internal Link - SEO */}
                                            {review.service_type && SERVICE_INFO[review.service_type] && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                    <Link
                                                        href={SERVICE_INFO[review.service_type].url}
                                                        className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors normal-case"
                                                        title={`ดูรายละเอียดบริการ ${SERVICE_INFO[review.service_type].name}`}
                                                    >
                                                        ใช้บริการ: {SERVICE_INFO[review.service_type].shortName}
                                                    </Link>
                                                </>
                                            )}
                                            {/* Date with <time> tag for SEO - ISO 8601 datetime */}
                                            {review.date && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                    <time
                                                        dateTime={formatDateForSEO(review.date).isoDate}
                                                        className="text-slate-500"
                                                        itemProp="datePublished"
                                                    >
                                                        {formatDateForSEO(review.date).thaiDate}
                                                    </time>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-1.5 mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                                    <meta itemProp="ratingValue" content={review.rating.toString()} />
                                    <meta itemProp="bestRating" content="5" />
                                    <meta itemProp="worstRating" content="1" />
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < review.rating ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : 'fill-slate-700/50 text-slate-700'}`}
                                        />
                                    ))}
                                </div>

                                <p className="cosmic-text-soft leading-relaxed mb-6 relative z-10 italic" itemProp="reviewBody">
                                    &quot;{review.content}&quot;
                                </p>

                                {review.images && review.images.length > 0 && (
                                    <div className={`grid gap-2 mb-6 ${review.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        {review.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative rounded-xl overflow-hidden border border-white/10 group ${review.images!.length === 1 ? 'aspect-video' : 'aspect-square'
                                                    }`}
                                            >
                                                <div className="absolute inset-0 bg-slate-800/50" />
                                                <Image
                                                    src={img}
                                                    alt={`ภาพรีวิวผลลัพธ์หลังใช้บริการ${review.service_type && SERVICE_INFO[review.service_type] ? SERVICE_INFO[review.service_type].name : 'ของ NameMongkol'} จากคุณ ${review.nickname} - ภาพที่ ${idx + 1}`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tags - Clickable for Internal Linking */}
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                    {review.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={TAG_URLS[tag] || `/reviews?category=${encodeURIComponent(tag)}`}
                                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>

                                {/* Helpful Vote & Share - User Engagement */}
                                <div className="flex items-center justify-between mt-5 pt-4 border-t border-amber-500/10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleHelpfulVote(review.id); }}
                                        disabled={userVotedReviews.has(review.id)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${userVotedReviews.has(review.id)
                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-default'
                                                : 'bg-white/5 text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 hover:border hover:border-amber-500/20'
                                            }`}
                                    >
                                        <ThumbsUp size={14} className={userVotedReviews.has(review.id) ? 'fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]' : ''} />
                                        <span>{t('pages.reviews.helpful')}</span>
                                        {(helpfulVotes[review.id] || 0) > 0 && (
                                            <span className="ml-1 text-amber-300 font-bold">
                                                {helpfulVotes[review.id]}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleShareReview(review); }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/10"
                                    >
                                        <Share2 size={14} />
                                        <span>{t('pages.reviews.share')}</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredReviews.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t('pages.reviews.empty')}</p>
                    </div>
                )}

                {/* FAQ Section - SEO Optimized */}
                <div className="mt-20 border-t border-white/10 pt-16 pb-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">
                        {t('pages.reviews.faqTitle')}
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/5">
                            <h3 className="text-xl font-bold text-amber-400 mb-3">
                                Q: {t('pages.reviews.faq1Q')}
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                A: {t('pages.reviews.faq1A')}
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/5">
                            <h3 className="text-xl font-bold text-amber-400 mb-3">
                                Q: {t('pages.reviews.faq2Q')}
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                A: {t('pages.reviews.faq2A')}
                            </p>
                        </div>

                        <div className="text-center mt-8 text-slate-500 text-sm">
                            <p>กำลังมองหาที่ <Link href="/search" className="text-amber-400 hover:text-amber-300 hover:underline"><strong>ตั้งชื่อมงคลที่ไหนดี</strong></Link> หรือต้องการ <Link href="/name-analysis" className="text-amber-400 hover:text-amber-300 hover:underline"><strong>แก้กรรมด้วยชื่อ</strong></Link>? ปรึกษา NameMongkol ได้ทันที</p>
                        </div>

                        {/* Bottom CTA */}
                        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-8 text-center mt-12">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                {t('pages.reviews.bottomTitle')}
                            </h3>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                {t('pages.reviews.bottomDesc')}
                            </p>
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 text-slate-900 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                            >
                                <Sparkles size={20} />
                                {t('pages.reviews.bottomCta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <ReviewFormModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingReview(null); }}
                initialData={editingReview}
                onSuccess={fetchReviews}
            />
        </div>
    );
}
