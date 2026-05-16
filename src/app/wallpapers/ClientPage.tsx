'use client';

import React, { useState, Suspense, useEffect, useCallback, startTransition } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, Sparkles, Lock, Palette, ImageIcon, Crown, Sun, Star, Share2, Check } from 'lucide-react';
// Replaced framer-motion with CSS transitions for better PageSpeed (saves ~35KB gzipped)
import { supabase } from '@/utils/supabase';
import { trackEvent } from '@/lib/analytics';
import dynamic from 'next/dynamic';

import { Wallpaper } from '@/types';

const WallpaperDetailPanel = dynamic(() => import('./WallpaperDetailPanel'), { ssr: false });

// Preload SweetAlert2 on idle so it's ready when user clicks download
let swalPromise: Promise<typeof import('sweetalert2')> | null = null;
function preloadSwal() {
    if (!swalPromise) {
        swalPromise = import('sweetalert2');
    }
    return swalPromise;
}
if (typeof window !== 'undefined') {
    // Start preloading after hydration is complete
    const schedulePreload = typeof requestIdleCallback === 'function'
        ? requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 2000);
    schedulePreload(() => preloadSwal());
}

// Idle-safe analytics helper to avoid blocking interaction handlers
function trackIdle(event: string, data?: Record<string, unknown>) {
    const doTrack = () => trackEvent(event, data);
    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(doTrack);
    } else {
        setTimeout(doTrack, 0);
    }
}

// Dynamic import for CustomWallpaperGenerator (standalone version)
const StandaloneWallpaperGenerator = dynamic(
    () => import('@/components/StandaloneWallpaperGenerator'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        )
    }
);

import {
    INITIAL_WALLPAPERS,
    ZODIAC_WALLPAPERS,
    DAYS,
    DAY_COLORS,
    DAY_LABELS,
    ZODIAC_SIGNS,
    getWallpaperCost,
    buildWallpaperAlt,
    classifyTrafficSource,
} from '@/data/wallpapers';

// Types
type CategoryType = 'day' | 'zodiac';
type TabType = 'collection' | 'custom';

export interface WallpaperPageProps {
    initialCategory?: CategoryType;
    initialDay?: string;
    initialZodiac?: string;
    initialTab?: TabType;
}

function WallpapersContent({ initialCategory: propCategory, initialDay: propDay, initialZodiac: propZodiac, initialTab: propTab }: WallpaperPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Props from sub-routes take precedence, then fallback to query params for backward compat
    const initialDay = propDay || searchParams.get('day') || 'all';
    const initialTab = propTab || (searchParams.get('tab') as TabType) || 'collection';
    const initialCat = propCategory || (searchParams.get('zodiac') ? 'zodiac' : undefined);

    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [selectedDay, setSelectedDay] = useState(initialDay);
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
    const [userCredits, setUserCredits] = useState<number | null>(null);
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>(INITIAL_WALLPAPERS);
    const [zodiacWallpapers, setZodiacWallpapers] = useState<Wallpaper[]>(ZODIAC_WALLPAPERS);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(initialCat || 'day');
    const [selectedZodiac, setSelectedZodiac] = useState(propZodiac || searchParams.get('zodiac') || 'all');
    const [showCopied, setShowCopied] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [downloadStep, setDownloadStep] = useState<string>('');
    const [trafficSource, setTrafficSource] = useState<string>('unknown');

    // Fetch Wallpapers from Supabase
    useEffect(() => {
        const fetchWallpapers = async () => {
            try {
                const { data, error } = await supabase
                    .from('wallpapers')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) {
                    console.error('Error fetching wallpapers:', error);
                    // use fallback
                } else if (data && data.length > 0) {
                    setWallpapers(data);
                    setZodiacWallpapers(prev => prev.map(zodiacWallpaper => {
                        const matchedWallpaper = data.find(item => item.id === zodiacWallpaper.id);
                        return matchedWallpaper ? { ...zodiacWallpaper, downloads: matchedWallpaper.downloads } : zodiacWallpaper;
                    }));
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallpapers();
    }, []);

    // Deep link to wallpaper via ID
    const wallpaperId = searchParams.get('id');
    useEffect(() => {
        if (wallpaperId && wallpapers.length > 0) {
            const wp = wallpapers.find(w => w.id === Number(wallpaperId));
            if (wp) setSelectedWallpaper(wp);
        }
    }, [wallpaperId, wallpapers]);

    useEffect(() => {
        setTrafficSource(classifyTrafficSource(searchParams));
    }, [searchParams]);

    useEffect(() => {
        trackIdle('wallpapers.page.view', {
            metadata: {
                traffic_source: trafficSource,
            },
        });
    }, [trafficSource]);


    // Reusable function to fetch user credits from DB
    const fetchUserCredits = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const { data } = await supabase
                .from('user_profiles')
                .select('credits, welcome_credits, welcome_credits_granted_at')
                .eq('id', session.user.id)
                .maybeSingle();
            if (data) {
                let total = data.credits ?? 0;
                if (data.welcome_credits && data.welcome_credits > 0 && data.welcome_credits_granted_at) {
                    const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
                    if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
                        total += data.welcome_credits;
                    }
                }
                setUserCredits(total);
            }
        }
    }, []);

    // Fetch credits on mount
    useEffect(() => {
        fetchUserCredits();
    }, [fetchUserCredits]);

    // Listen for force_credits_update events (from other components / tabs)
    useEffect(() => {
        const handleCreditUpdate = () => {
            fetchUserCredits();
        };
        window.addEventListener('force_credits_update', handleCreditUpdate);
        return () => {
            window.removeEventListener('force_credits_update', handleCreditUpdate);
        };
    }, [fetchUserCredits]);

    // ESC key closes the detail panel
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedWallpaper(null);
        };
        if (selectedWallpaper) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedWallpaper]);

    const filteredWallpapers = wallpapers.filter(wp =>
        selectedDay === 'all' || wp.day === selectedDay || wp.day === 'all'
    );

    const filteredZodiacWallpapers = zodiacWallpapers.filter(wp =>
        selectedZodiac === 'all' || wp.day === selectedZodiac
    );

    // Build the shareable URL for the current filter state
    const getShareUrl = () => {
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        if (activeTab === 'custom') return `${base}/wallpapers/custom`;
        if (selectedCategory === 'zodiac' && selectedZodiac !== 'all') return `${base}/wallpapers/zodiac/${selectedZodiac}`;
        if (selectedCategory === 'day' && selectedDay !== 'all') return `${base}/wallpapers/day/${selectedDay}`;
        if (selectedCategory === 'zodiac') return `${base}/wallpapers/zodiac`;
        return `${base}/wallpapers`;
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getShareUrl());
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch {
            // fallback
            const textArea = document.createElement('textarea');
            textArea.value = getShareUrl();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    };

    // Navigate to sub-route when category buttons are pressed
    const navigateDay = useCallback((day: string) => {
        startTransition(() => {
            setSelectedDay(day);
            if (day === 'all') {
                router.push('/wallpapers', { scroll: false });
            } else {
                router.push(`/wallpapers/day/${day}`, { scroll: false });
            }
        });
    }, [router]);
    const navigateZodiac = useCallback((sign: string) => {
        startTransition(() => {
            setSelectedZodiac(sign);
            if (sign === 'all') {
                router.push('/wallpapers', { scroll: false });
            } else {
                router.push(`/wallpapers/zodiac/${sign}`, { scroll: false });
            }
        });
    }, [router]);
    const navigateCategory = useCallback((cat: CategoryType) => {
        startTransition(() => {
            setSelectedCategory(cat);
            if (cat === 'zodiac') {
                router.push('/wallpapers/zodiac', { scroll: false });
            } else {
                router.push('/wallpapers', { scroll: false });
            }
        });
    }, [router]);
    const navigateTab = useCallback((tab: TabType) => {
        startTransition(() => {
            setActiveTab(tab);
            if (tab === 'custom') {
                router.push('/wallpapers/custom', { scroll: false });
            } else {
                router.push('/wallpapers', { scroll: false });
            }
        });
    }, [router]);

    const updateLocalDownloads = (wallpaper: Wallpaper, newCount?: number) => {
        const updater = (item: Wallpaper) =>
            item.id === wallpaper.id
                ? { ...item, downloads: newCount ?? item.downloads + 1 }
                : item;

        if (ZODIAC_IDS.has(wallpaper.id)) {
            setZodiacWallpapers(prev => prev.map(updater));
        } else {
            setWallpapers(prev => prev.map(updater));
        }

        // Also sync modal state
        setSelectedWallpaper(prev =>
            prev && prev.id === wallpaper.id
                ? { ...prev, downloads: newCount ?? prev.downloads + 1 }
                : prev
        );
    };

    const handleDownload = async (wallpaper: Wallpaper) => {
        trackIdle('wallpapers.detail.download_click', {
            metadata: {
                wallpaper_id: wallpaper.id,
                premium: wallpaper.premium,
                traffic_source: trafficSource,
            },
        });

        // Use preloaded SweetAlert2 (already cached from idle preload)
        const Swal = (await preloadSwal()).default;

        // 1. Check Auth
        setDownloadingId(wallpaper.id);
        setDownloadStep('กำลังตรวจสอบสิทธิ์...');
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            trackIdle('wallpapers.download.auth_gate', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                },
            });

            setDownloadingId(null);
            setDownloadStep('');
            Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านต้องเข้าสู่ระบบก่อนจึงจะสามารถดาวน์โหลดวอลเปเปอร์มงคลได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#d33',
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    trackIdle('wallpapers.download.login_click', {
                        metadata: {
                            wallpaper_id: wallpaper.id,
                            premium: wallpaper.premium,
                            traffic_source: trafficSource,
                        },
                    });
                    const returnPath = `${window.location.pathname}${window.location.search}`;
                    router.push(`/login?redirect=${encodeURIComponent(returnPath)}`);
                }
            });
            return;
        }

        // 2. Handle Premium Logic
        if (wallpaper.premium) {
            const COST = getWallpaperCost(wallpaper);

            // Check balance
            if (userCredits === null || userCredits < COST) {
                Swal.fire({
                    title: 'เครดิตไม่เพียงพอ',
                    text: `วอลเปเปอร์นี้ต้องใช้ ${COST} เครดิต (ท่านมี ${userCredits || 0})`,
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'เติมเครดิต',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#10b981',
                    background: '#1e293b',
                    color: '#fff'
                }).then((res) => {
                    if (res.isConfirmed) router.push('/topup');
                });
                return;
            }

            // Confirm
            const confirm = await Swal.fire({
                title: 'ยืนยันการดาวน์โหลด',
                text: `ต้องการใช้ ${COST} เครดิตเพื่อดาวน์โหลดภาพนี้หรือไม่?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `ยืนยัน (หัก ${COST} เครดิต)`,
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff'
            });

            if (!confirm.isConfirmed) {
                setDownloadingId(null);
                setDownloadStep('');
                return;
            }

            // Deduct credits
            setDownloadStep('กำลังหักเครดิต...');
            try {
                const { error } = await supabase.rpc('deduct_credits', { amount: COST });
                if (error) throw error;

                // Optimistic local update + sync from DB for accuracy
                setUserCredits(prev => (prev !== null ? prev - COST : null));
                window.dispatchEvent(new Event('force_credits_update'));
            } catch (error) {
                console.error('Deduct error:', error);
                setDownloadingId(null);
                setDownloadStep('');
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถตัดเครดิตได้ กรุณาลองใหม่', 'error');
                return;
            }
        }

        // 3. Increment Download Count
        trackIdle('wallpapers.download.start', {
            metadata: {
                wallpaper_id: wallpaper.id,
                premium: wallpaper.premium,
                traffic_source: trafficSource,
            },
        });

        setDownloadStep('กำลังบันทึกยอดดาวน์โหลด...');
        try {
            const { data: rpcData, error: rpcError } = await supabase.rpc('increment_wallpaper_downloads', { wallpaper_id: wallpaper.id });

            if (rpcError) {
                throw rpcError;
            }

            // Use actual count from DB if returned, otherwise fallback to +1
            const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
            if (row && row.success && typeof row.new_downloads === 'number') {
                updateLocalDownloads(wallpaper, row.new_downloads);
            } else {
                updateLocalDownloads(wallpaper);
            }
        } catch (e) {
            console.error('Failed to increment downloads:', e);
            trackIdle('wallpapers.download.count_increment_failed', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                },
            });
            // ตาม policy: ให้ดาวน์โหลดต่อได้ แต่แจ้งเตือนว่าเคาน์เตอร์อาจไม่อัปเดตทันที
            Swal.fire({
                icon: 'warning',
                title: 'ระบบบันทึกยอดดาวน์โหลดล่าช้า',
                text: 'ดาวน์โหลดไฟล์ได้ปกติ แต่ยอดดาวน์โหลดอาจอัปเดตภายหลัง',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1e293b',
                color: '#fff'
            });
        }

        // 4. Convert WebP → PNG via Canvas and trigger download
        setDownloadStep('กำลังแปลงไฟล์ภาพ...');
        const filename = `namemongkol-${wallpaper.id}-${Date.now()}`;
        try {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            const pngBlob = await new Promise<Blob>((resolve, reject) => {
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) { reject(new Error('Canvas not supported')); return; }
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob((blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error('toBlob failed'));
                        }, 'image/png');
                    } catch (err) { reject(err); }
                };
                img.onerror = () => reject(new Error('Image load failed'));
                img.src = wallpaper.image;
            });
            const url = URL.createObjectURL(pngBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            trackIdle('wallpapers.download.success', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                    format: 'png',
                },
            });
        } catch {
            // Fallback: download original WebP if PNG conversion fails
            const link = document.createElement('a');
            link.href = wallpaper.image;
            link.download = `${filename}.webp`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            trackIdle('wallpapers.download.success', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                    format: 'webp_fallback',
                },
            });
        }

        setDownloadStep('เสร็จสิ้น! 🎉');
        setTimeout(() => {
            setDownloadingId(null);
            setDownloadStep('');
        }, 1500);

        // 5. Re-fetch credits from DB to ensure accuracy after transaction
        if (wallpaper.premium) {
            await fetchUserCredits();

            Swal.fire({
                icon: 'success',
                title: 'ดาวน์โหลดสำเร็จ',
                text: `หัก ${getWallpaperCost(wallpaper)} เครดิตเรียบร้อยแล้ว`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1e293b',
                color: '#fff'
            });
        }
    };

    return (
        <div className="w-full max-w-[1400px] px-4 pt-24 md:pt-32 pb-28 min-h-screen bg-[#050b14] text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-amber-200 mb-2">
                            วอลเปเปอร์มงคล เสริมดวงชะตา บารมี และโชคลาภ
                        </h1>
                        <p className="text-slate-400">
                            ยกระดับพลังบวกให้กับชีวิตทุกครั้งที่เปิดหน้าจอมือถือ ด้วยพลังแห่งภาพมงคลและสีมงคลตามวันเกิด
                        </p>
                    </div>

                    {/* Main Tabs + Share */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex w-full sm:w-fit bg-slate-800 p-1.5 rounded-2xl border border-white/10">
                            <button
                                onClick={() => navigateTab('collection')}
                                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${activeTab === 'collection'
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                <ImageIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                <span className="truncate">คอลเลกชันมงคล</span>
                            </button>
                            <button
                                onClick={() => navigateTab('custom')}
                                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${activeTab === 'custom'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                <Palette className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                <span className="truncate">สร้างวอลเปเปอร์ส่วนตัว</span>
                                <Crown className="w-3 h-3 sm:w-[14px] sm:h-[14px] text-amber-400 flex-shrink-0" />
                            </button>
                        </div>
                        {/* Share / Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white transition-all w-full sm:w-auto"
                        >
                            {showCopied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                            {showCopied ? 'คัดลอกแล้ว!' : 'แชร์ลิงก์หมวดนี้'}
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {activeTab === 'collection' ? (
                        <div
                            key="collection"
                            className="space-y-6 animate-fade-in-up"
                        >
                            {/* Category Selector */}
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigateCategory('day')}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === 'day'
                                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                                                : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-white hover:bg-slate-700'
                                        }`}
                                    >
                                        <Sun size={16} />
                                        วันเกิด
                                    </button>
                                    <button
                                        onClick={() => navigateCategory('zodiac')}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === 'zodiac'
                                                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40'
                                                : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-white hover:bg-slate-700'
                                        }`}
                                    >
                                        <Star size={16} />
                                        ราศี
                                    </button>
                                </div>

                                {/* Day Filter - show when 'day' category is selected */}
                                {selectedCategory === 'day' && (
                                    <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto max-w-full no-scrollbar w-fit">
                                        {DAYS.map((d) => (
                                            <button
                                                key={d.value}
                                                onClick={() => navigateDay(d.value)}
                                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedDay === d.value
                                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                                    }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DAY_COLORS[d.value] ?? 'bg-slate-500'}`} />
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Zodiac Filter - show when 'zodiac' category is selected */}
                                {selectedCategory === 'zodiac' && (
                                    <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto max-w-full no-scrollbar">
                                        {ZODIAC_SIGNS.map((z) => (
                                            <button
                                                key={z.value}
                                                onClick={() => navigateZodiac(z.value)}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedZodiac === z.value
                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                                    }`}
                                            >
                                                <span className="text-base">{z.emoji}</span>
                                                {z.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {(selectedCategory === 'day' ? filteredWallpapers : filteredZodiacWallpapers).map((wp, idx) => {
                                    // Featured card: first card shown when "ทั้งหมด" is selected and is the top-download special card
                                    const isFeatured =
                                        idx === 0 &&
                                        ((selectedCategory === 'day' && selectedDay === 'all' && wp.day === 'all') ||
                                         (selectedCategory === 'zodiac' && selectedZodiac === 'all'));
                                    return (
                                    <div
                                        key={wp.id}
                                        className={`group relative rounded-2xl overflow-hidden bg-slate-800 border border-white/10 hover:border-amber-500/50 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-xl cursor-pointer will-change-transform ${isFeatured ? 'col-span-2 row-span-2 aspect-auto' : 'aspect-[9/16]'}`}
                                        onClick={() => {
                                            setSelectedWallpaper(wp);
                                            trackIdle('wallpapers.card.open_detail', {
                                                metadata: {
                                                    wallpaper_id: wp.id,
                                                    premium: wp.premium,
                                                    category: selectedCategory,
                                                    day_filter: selectedDay,
                                                    zodiac_filter: selectedZodiac,
                                                    traffic_source: trafficSource,
                                                },
                                            });
                                        }}
                                    >
                                        <Image
                                            src={wp.image}
                                            alt={buildWallpaperAlt(wp)}
                                            fill
                                            sizes={isFeatured ? "(max-width: 640px) 100vw, (max-width: 1024px) 65vw, 42vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 15vw"}
                                            className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                                            priority={idx < 4}
                                            loading={idx < 4 ? 'eager' : 'lazy'}
                                            fetchPriority={idx === 0 ? 'high' : 'auto'}
                                            quality={50}
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />

                                        {/* Badges */}
                                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                            {wp.premium && (
                                                <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                                                    <Lock size={8} /> {getWallpaperCost(wp)} เครดิต
                                                </span>
                                            )}
                                            <span className="bg-black/60 text-white/80 text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                                <Download size={8} /> {wp.downloads.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 w-full p-3">
                                            <h3 className={`text-white font-bold line-clamp-1 mb-1 ${isFeatured ? 'text-base' : 'text-sm'}`}>{wp.name}</h3>
                                            {isFeatured && wp.description && (
                                                <p className="text-slate-300 text-xs line-clamp-2 mb-2 leading-relaxed">{wp.description.slice(0, 80)}…</p>
                                            )}
                                            <div className="flex flex-wrap gap-1">
                                                {wp.tags.slice(0, isFeatured ? 4 : 3).map(t => (
                                                    <span key={t} className="text-[9px] text-slate-300 bg-white/10 px-1.5 py-0.5 rounded-md">
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            {/* Empty state */}
                            {!loading && (selectedCategory === 'day' ? filteredWallpapers : filteredZodiacWallpapers).length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                                    <ImageIcon size={36} className="text-slate-700" />
                                    <p className="text-slate-500 text-sm">ยังไม่มีวอลเปเปอร์ในหมวดนี้</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            key="custom"
                            className="animate-fade-in-up"
                        >
                            <StandaloneWallpaperGenerator />
                        </div>
                    )}
                </div>

                {/* Slide-in Detail Panel - right side */}
                {activeTab === 'collection' && selectedWallpaper && (
                    <WallpaperDetailPanel
                        selectedWallpaper={selectedWallpaper}
                        userCredits={userCredits}
                        downloadingId={downloadingId}
                        downloadStep={downloadStep}
                        onClose={() => setSelectedWallpaper(null)}
                        onDownload={handleDownload}
                    />
                )}
            </div>
        </div>
    );
}

export default function WallpapersPage(props: WallpaperPageProps = {}) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-amber-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div></div>}>
            <WallpapersContent {...props} />
        </Suspense>
    );
}
