'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect } from 'react';
import ReviewBadge from '@/components/ReviewBadge';
import UserStatsBadge from '@/components/UserStatsBadge';
import PopularNames from '@/components/PopularNames';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, XCircle, Filter, X, Lock, Unlock, Type } from 'lucide-react';
import Swal from 'sweetalert2';

import { calculateScore } from '@/utils/numerologyUtils';
import { getDayFromName, analyzeNameSuitability } from '@/utils/thaksaUtils';
import { thaksaConfig, DayKey } from '@/data/thaksa';
import { getPrediction } from '@/utils/getPrediction';
import { useLanguage } from '@/components/LanguageProvider';

const getDayBadgeProps = (d: string) => {
    if (d.includes('อาทิตย์')) return { label: 'อา.', className: 'bg-rose-500/15 text-rose-300 border border-rose-500/20' };
    if (d.includes('จันทร์')) return { label: 'จัน.', className: 'bg-amber-400/15 text-amber-300 border border-amber-400/20' };
    if (d.includes('อังคาร')) return { label: 'อัง.', className: 'bg-pink-500/15 text-pink-300 border border-pink-500/20' };
    if (d.includes('พุธ (กลางวัน)')) return { label: 'พุธวัน.', className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' };
    if (d.includes('พุธ (กลางคืน')) return { label: 'พุธคืน.', className: 'bg-teal-500/15 text-teal-300 border border-teal-500/20' };
    if (d.includes('พฤหัส')) return { label: 'พฤ.', className: 'bg-orange-500/15 text-orange-300 border border-orange-500/20' };
    if (d.includes('ศุกร์')) return { label: 'ศุก.', className: 'bg-sky-500/15 text-sky-300 border border-sky-500/20' };
    if (d.includes('เสาร์')) return { label: 'เสา.', className: 'bg-purple-500/15 text-purple-300 border border-purple-500/20' };
    return { label: d, className: 'bg-slate-500/15 text-slate-300 border border-slate-500/20' };
};

function NameRow({ name }: { name: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const day = getDayFromName(name);
    const score = calculateScore(name);
    // Always calculate to know if it's usable on multiple days
    const suitability = useMemo(() => analyzeNameSuitability(name), [name]);

    return (
        <>
            <tr
                className={`group cursor-pointer border-b border-white/5 last:border-0 transition-all duration-300 ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <td className="px-3 md:px-8 py-3 md:py-5">
                    <div className="flex items-center gap-2 md:gap-3 transition-transform duration-300 group-hover:translate-x-1">
                        <div className={`p-1 rounded-full bg-white/5 transition-colors ${isExpanded ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 group-hover:text-amber-400 group-hover:bg-amber-400/10'}`}>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                        </div>
                        <span className="text-base md:text-lg font-medium text-slate-200 group-hover:text-amber-200 transition-colors">
                            {name}
                        </span>
                    </div>
                </td>
                <td className="px-3 md:px-8 py-3 md:py-5 text-xs md:text-base text-slate-400 group-hover:text-slate-300 transition-colors">
                    {suitability.suitable.length === 8 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                            ใช้ได้ทุกวัน
                        </span>
                    ) : suitability.suitable.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {suitability.suitable.map((d, i) => {
                                const { label, className } = getDayBadgeProps(d);
                                return (
                                    <span key={i} className={`inline-block px-2 py-0.5 rounded-md text-[11px] md:text-xs font-bold shadow-sm ${className}`}>
                                        {label}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="text-slate-500">-</span>
                    )}
                </td>
                <td className="px-3 md:px-8 py-3 md:py-5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-lg md:rounded-xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 text-amber-300 font-bold border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] group-hover:border-amber-500/40 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:text-amber-200 group-hover:scale-110 transition-all duration-300">
                        {score}
                    </span>
                </td>
            </tr>
            {isExpanded && suitability && (
                <tr className="bg-white/[0.02] animate-fade-in">
                    <td colSpan={3} className="p-0">
                        <div className="px-4 md:px-8 py-4 md:py-6 space-y-3 md:space-y-4 border-b border-white/5 bg-gradient-to-b from-black/20 to-transparent shadow-inner">
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="mt-1 min-w-[20px] md:min-w-[24px] text-emerald-400 p-1 rounded-full bg-emerald-500/10">
                                    <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-emerald-300 block mb-1 md:mb-2 text-xs md:text-sm uppercase tracking-wider">วันที่ใช้ได้ (มงคล)</span>
                                    <div className="flex flex-wrap gap-2">
                                        {suitability.suitable.length > 0 ? (
                                            suitability.suitable.map((d, i) => {
                                                const { label, className } = getDayBadgeProps(d);
                                                return (
                                                    <span key={i} className={`inline-block px-3 py-1 rounded-lg text-sm font-bold shadow-md ${className}`}>
                                                        {label}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span className="text-slate-500 italic">- ไม่มี -</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                <div className="mt-1 min-w-[20px] md:min-w-[24px] text-rose-400 p-1 rounded-full bg-rose-500/10">
                                    <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-rose-300 block mb-1 md:mb-2 text-xs md:text-sm uppercase tracking-wider">วันที่ห้ามใช้ (กาลกิณี)</span>
                                    <div className="flex flex-wrap gap-2">
                                        {suitability.unsuitable.length > 0 ? (
                                            suitability.unsuitable.map((d, i) => {
                                                const { label, className } = getDayBadgeProps(d);
                                                // Make unsuitable badges grayscale or faded to indicate they shouldn't be used, or keep their colors but with an X icon?
                                                // Wait, the user might still want to see the original color so they recognize the day.
                                                // Let's keep the original color but maybe with some opacity or a border, actually full color is fine.
                                                return (
                                                    <span key={i} className={`inline-block px-3 py-1 rounded-lg text-sm font-bold shadow-md opacity-70 ${className}`}>
                                                        {label}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span className="text-slate-500 italic">- ไม่มี -</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

const ITEMS_PER_PAGE = 60;

// Thai consonants for letter filter
const THAI_LETTERS = [
    'ก','ข','ฃ','ค','ฅ','ฆ','ง','จ','ฉ','ช','ซ','ฌ','ญ','ฎ','ฏ','ฐ','ฑ','ฒ','ณ',
    'ด','ต','ถ','ท','ธ','น','บ','ป','ผ','ฝ','พ','ฟ','ภ','ม','ย','ร','ล','ว',
    'ศ','ษ','ส','ห','ฬ','อ','ฮ',
];

const UNLOCK_COST = 10;
const UNLOCK_AMOUNT = 20;

const stripInvisible = (s: string) => s.replace(/[\s\u200B\u200C\u200D\uFEFF]+/g, '');

// Thai leading vowels that appear before the consonant in written form
const THAI_LEADING_VOWELS = new Set(['\u0E40', '\u0E41', '\u0E42', '\u0E43', '\u0E44']); // เ แ โ ใ ไ

/** Returns the first consonant of a Thai name, skipping any leading vowels */
const getFirstConsonant = (name: string): string => {
    if (!name) return '';
    return THAI_LEADING_VOWELS.has(name.charAt(0)) ? name.charAt(1) : name.charAt(0);
};

export default function SearchPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [selectedDay, setSelectedDay] = useState<DayKey | 'all'>('all');
    const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female' | 'neutral'>('all');
    const [selectedLetter, setSelectedLetter] = useState<string>('all');
    const [targetSum, setTargetSum] = useState('');
    const [isSumFocused, setIsSumFocused] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);

    // Freemium State
    const [visibleCount, setVisibleCount] = useState(10);
    const [userCredits, setUserCredits] = useState<number | null>(null);
    const [isUnlocking, setIsUnlocking] = useState(false);

    const [names, setNames] = useState<{ name: string; gender: string }[]>([]); // Update type
    const [loading, setLoading] = useState(true);

    // Fetch credits
    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('user_profiles')
                .select('credits, welcome_credits, welcome_credits_granted_at')
                .eq('id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching credits:', error);
                return;
            }

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
        };

        fetchCredits();
    }, []);

    // Fetch names from cached API
    useEffect(() => {
        const fetchNames = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/public/names');
                const json = await res.json();
                
                if (json.success && json.data) {
                    const allData = json.data as { name: string; gender: string | null }[];
                    setNames(allData.map(d => ({ 
                        name: stripInvisible(d.name), 
                        gender: d.gender || 'neutral' 
                    })).filter(d => d.name));
                }
            } catch (err) {
                console.error('Error fetching names API:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNames();
    }, []);

    // Calculate unique scores for datalist
    const uniqueScores = useMemo(() => {
        if (loading) return [];
        const scores = new Set(names.map(item => calculateScore(item.name)));
        return Array.from(scores).sort((a, b) => a - b);
    }, [names, loading]);

    // Filter Logic
    const filteredNames = useMemo(() => {
        if (loading) return [];
        return names.filter((item) => {
            const { name, gender } = item;

            // 1. Gender Filter
            if (selectedGender !== 'all') {
                if (selectedGender === 'male' && gender !== 'male' && gender !== 'neutral') return false;
                if (selectedGender === 'female' && gender !== 'female' && gender !== 'neutral') return false;
                if (selectedGender === 'neutral' && gender !== 'neutral') return false;
            }

            // 2. Day Filter (Suitability)
            if (selectedDay !== 'all') {
                const targetDayName = thaksaConfig[selectedDay].name;
                const suitability = analyzeNameSuitability(name);
                if (!suitability.suitable.includes(targetDayName)) return false;
            }

            // 3. Letter Filter — uses getFirstConsonant to correctly handle leading vowels (เ แ โ ไ ใ)
            if (selectedLetter !== 'all') {
                if (getFirstConsonant(name) !== selectedLetter) return false;
            }

            // 4. Numerology Sum Filter
            if (targetSum) {
                const score = calculateScore(name);
                if (score !== parseInt(targetSum)) return false;
            }

            return true;
        }).map(item => item.name); // Return just names for display
    }, [selectedDay, selectedGender, selectedLetter, targetSum, names, loading]);

    // Reset to page 1 when filters change is now handled in event handlers



    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(e.target.value as DayKey | 'all');
        setVisibleCount(10);
    };

    const handleLetterChange = (letter: string) => {
        setSelectedLetter(letter);
        setVisibleCount(10);
    };

    const handleSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetSum(e.target.value);
        setHasTyped(true);
        setVisibleCount(10);
    };

    const handleUnlock = async () => {
        if (isUnlocking) return;
        setIsUnlocking(true);

        try {
            // 1. Check Login Status
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                const result = await Swal.fire({
                    title: 'กรุณาเข้าสู่ระบบ',
                    text: 'เพื่อทำการปลดล็อกรายชื่อและบันทึกประวัติ',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'เข้าสู่ระบบ',
                    cancelButtonText: 'ยกเลิก',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#3b82f6', // Blue-500
                    cancelButtonColor: '#64748b',
                    customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
                });

                if (result.isConfirmed) {
                    router.push('/login');
                }
                return;
            }

            const fetchLatestCredits = async () => {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('credits, welcome_credits, welcome_credits_granted_at')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error) {
                    console.error('Error refreshing credits:', error);
                    return null;
                }

                if (data) {
                    let total = data.credits ?? 0;
                    if (data.welcome_credits && data.welcome_credits > 0 && data.welcome_credits_granted_at) {
                        const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
                        if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
                            total += data.welcome_credits;
                        }
                    }
                    setUserCredits(total);
                    return total;
                }

                return null;
            };

            // Always refresh credits to avoid stale values
            const latestCredits = await fetchLatestCredits();

            if (latestCredits === null) {
                await Swal.fire({
                    title: 'ไม่สามารถดึงเครดิตได้',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff',
                    customClass: { popup: 'rounded-2xl' }
                });
                return;
            }

            if (latestCredits < UNLOCK_COST) {
                const result = await Swal.fire({
                    title: 'เครดิตไม่เพียงพอ',
                    text: `การปลดล็อกต้องใช้ ${UNLOCK_COST} เครดิต กดเพื่อเติมเงิน`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'เติมเครดิต',
                    cancelButtonText: 'ยกเลิก',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#64748b',
                    customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
                });
                if (result.isConfirmed) router.push('/topup');
                return;
            }

            const result = await Swal.fire({
                title: `ปลดล็อก ${UNLOCK_COST} เครดิต`,
                text: `โหลดเพิ่มอีก ${UNLOCK_AMOUNT} รายชื่อ`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#059669',
                cancelButtonColor: '#ef4444',
                customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
            });

            if (!result.isConfirmed) return;

            const { error } = await supabase.rpc('deduct_credits', { amount: UNLOCK_COST });
            if (error) {
                console.error('deduct_credits error:', error);
                await Swal.fire({
                    title: 'Error',
                    text: error.message || 'เกิดข้อผิดพลาดในการตัดเครดิต',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff',
                    customClass: { popup: 'rounded-2xl' }
                });
                return;
            }

            const updatedCredits = latestCredits - UNLOCK_COST;
            setUserCredits(updatedCredits);
            setVisibleCount(prev => prev + UNLOCK_AMOUNT);
            window.dispatchEvent(new Event('force_credits_update'));

            await Swal.fire({
                title: 'โหลดรายชื่อสำเร็จ!',
                text: `เพิ่มรายชื่ออีก ${UNLOCK_AMOUNT} ชื่อเรียบร้อยแล้ว`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff',
                customClass: { popup: 'rounded-2xl' }
            });

            // Refresh credits from server to stay in sync
            await fetchLatestCredits();
        } catch (err) {
            console.error('unlock error:', err);
            // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;
            await Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดำเนินการได้ กรุณาลองใหม่',
                icon: 'error',
                background: '#1e293b',
                color: '#fff',
                customClass: { popup: 'rounded-2xl' }
            });
        } finally {
            setIsUnlocking(false);
        }
    };



    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
            </div>


                        <div className="relative z-10 w-full max-w-[1400px] px-4 pt-24 md:pt-32 pb-20 md:pb-28">
                                {/* Social Proof & Engagement Section */}
                                <div className="flex flex-col items-center gap-3 mb-6 md:mb-8">
                                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                                        <ReviewBadge rating={4.8} count={512} />
                                        <UserStatsBadge users={12000} />
                                    </div>
                                    <PopularNames />
                                </div>
                                <div className="text-center mb-8 md:mb-12">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs md:text-sm mb-3 md:mb-4">
                                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span>{t('pages.search.badge')}</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                                        {t('pages.search.title')}
                                    </h1>
                                    <p className="text-sm sm:text-base text-slate-300 max-w-[65ch] mx-auto mb-5 md:mb-6 px-2 leading-relaxed">
                                        {t('pages.search.description')}
                                    </p>
                                    {/* Pro Tip / Guidance Block */}
                                    <div className="max-w-2xl mx-auto bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 text-left flex gap-4 items-start relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0 relative z-10">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-amber-200 font-semibold mb-1 text-sm">💡 {t('pages.search.tipTitle')}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                {t('pages.search.tipBody')} <Link href="/" className="text-amber-400 hover:underline decoration-amber-400/30 underline-offset-4">{t('pages.search.links.l1Title')}</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                {/* Search & Filter Section */}
                <div className="max-w-4xl mx-auto mb-8 md:mb-12 space-y-4">


                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {/* Day Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-slate-400" />
                            </div>
                            <select
                                value={selectedDay}
                                onChange={handleDayChange}
                                className="block w-full pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-xl transition-all appearance-none cursor-pointer"
                            >
                                <option value="all" className="bg-slate-900 text-slate-200">{t('pages.search.filters.dayAny')}</option>
                                {Object.keys(thaksaConfig).map((key) => (
                                    <option key={key} value={key} className="bg-slate-900 text-slate-200">
                                        {thaksaConfig[key as DayKey].name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Gender Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-sm">{t('pages.search.filters.genderLabel')}</span>
                            </div>
                            <select
                                value={selectedGender}
                                onChange={(e) => {
                                    setSelectedGender(e.target.value as any);
                                    setVisibleCount(10);
                                }}
                                className="block w-full pl-12 pr-4 py-2.5 md:py-3 text-sm md:text-base bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-xl transition-all appearance-none cursor-pointer"
                            >
                                <option value="all" className="bg-slate-900 text-slate-200">{t('pages.search.filters.genderAll')}</option>
                                <option value="male" className="bg-slate-900 text-slate-200">{t('pages.search.filters.genderMale')}</option>
                                <option value="female" className="bg-slate-900 text-slate-200">{t('pages.search.filters.genderFemale')}</option>
                                <option value="neutral" className="bg-slate-900 text-slate-200">{t('pages.search.filters.genderNeutral')}</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Sum Filter */}
                        <div className="relative group">
                            <input
                                type="number"
                                value={targetSum}
                                onChange={handleSumChange}
                                onFocus={(e) => {
                                    setIsSumFocused(true);
                                    setHasTyped(false);
                                    e.target.select();
                                }}
                                onBlur={() => setTimeout(() => setIsSumFocused(false), 200)} // Delay to allow click
                                className="block w-full px-4 py-2.5 md:py-3 text-sm md:text-base bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-xl transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder={t('pages.search.filters.sumPlaceholder')}
                            />

                            <div className={`absolute top-full left-0 w-full mt-2 max-h-80 overflow-y-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 transition-all duration-200 custom-scrollbar ${isSumFocused ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
                                {uniqueScores
                                    .filter(score => (isSumFocused && !hasTyped) || !targetSum || score.toString().includes(targetSum))
                                    .map(score => {
                                        const { desc, color, level } = getPrediction(score);
                                        return (
                                            <div
                                                key={score}
                                                onClick={() => {
                                                    setTargetSum(score.toString());
                                                }}
                                                className="px-4 py-3 hover:bg-white/5 cursor-pointer text-slate-300 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group/item"
                                            >
                                                <div className="flex flex-col flex-1 min-w-0 mr-4">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-medium text-slate-200 group-hover/item:text-amber-400 transition-colors">ผลรวม {score}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 ${color}`}>
                                                            {level}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-500 truncate group-hover/item:text-slate-400 transition-colors">
                                                        {desc}
                                                    </span>
                                                </div>
                                                {targetSum === score.toString() && <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />}
                                            </div>
                                        );
                                    })}
                                {uniqueScores.filter(score => !targetSum || score.toString().includes(targetSum)).length === 0 && (
                                    <div className="px-4 py-3 text-slate-500 text-center italic text-sm">
                                        {t('pages.search.filters.sumNoResult')}
                                    </div>
                                )}
                            </div>

                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                {targetSum ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTargetSum('');
                                            setHasTyped(false);
                                            setIsSumFocused(false);
                                        }}
                                        className="text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                ) : (
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isSumFocused ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Letter Filter (ก-ฮ) */}
                    <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
                            <Type className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>กรองตามตัวอักษรแรก</span>
                            {selectedLetter !== 'all' && (
                                <button
                                    onClick={() => handleLetterChange('all')}
                                    className="ml-auto text-xs text-amber-400 hover:text-amber-300 transition-colors"
                                >
                                    ล้างตัวกรอง
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1 md:gap-1.5">
                            <button
                                onClick={() => handleLetterChange('all')}
                                className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                                    selectedLetter === 'all'
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                                        : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                                }`}
                            >
                                ทั้งหมด
                            </button>
                            {THAI_LETTERS.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => handleLetterChange(letter)}
                                    className={`w-7 h-7 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center justify-center ${
                                        selectedLetter === letter
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 scale-110'
                                            : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/10'
                                    }`}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Helper / Recommendation */}
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                    <p className="text-emerald-300 text-sm md:text-base font-medium">
                        💡 {t('pages.search.helper')} <Link href="/" className="underline decoration-emerald-500/50 hover:text-emerald-200 transition-colors">{t('pages.search.links.l1Title')}</Link>
                    </p>
                </div>

                {/* Results Table */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-8 shadow-2xl shadow-black/20">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-amber-300 backdrop-blur-md">
                                <th className="px-3 md:px-8 py-3 md:py-5 font-semibold text-sm md:text-base tracking-wide uppercase">{t('pages.search.table.name')}</th>
                                <th className="px-3 md:px-8 py-3 md:py-5 font-semibold text-sm md:text-base tracking-wide uppercase">{t('pages.search.table.day')}</th>
                                <th className="px-3 md:px-8 py-3 md:py-5 font-semibold text-sm md:text-base tracking-wide uppercase text-center">{t('pages.search.table.score')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredNames.length > 0 ? (
                                <>
                                    {filteredNames.slice(0, visibleCount).map((name, index) => (
                                        <NameRow key={index} name={name} />
                                    ))}

                                    {/* Locked State / Load More Button */}
                                    {visibleCount < filteredNames.length && (
                                        <tr>
                                            <td colSpan={3} className="p-0 relative h-32 overflow-hidden">
                                                {/* Blurred content (fake rows) */}
                                                <div className="absolute inset-0 w-full h-full blur-md opacity-30 select-none pointer-events-none flex flex-col gap-4 p-4">
                                                    <div className="h-10 bg-white/10 rounded-xl w-full"></div>
                                                    <div className="h-10 bg-white/10 rounded-xl w-3/4"></div>
                                                </div>

                                                {/* Unlock Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent">
                                                    <button
                                                        onClick={handleUnlock}
                                                        disabled={isUnlocking}
                                                        className={`group relative flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg shadow-amber-500/20 transition-all ${isUnlocking
                                                            ? 'bg-amber-500/60 text-black cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black hover:scale-105 active:scale-95'
                                                            }`}
                                                    >
                                                        <div className="p-1 md:p-1.5 bg-black/20 rounded-md md:rounded-lg">
                                                            <Lock className="w-4 h-4 md:w-5 md:h-5" />
                                                        </div>
                                                        <span className="text-base md:text-lg">{t('pages.search.unlock.button')}</span>
                                                        <div className="bg-black/80 text-amber-500 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-md font-bold flex items-center gap-1">
                                                            {t('pages.search.unlock.cost')}
                                                        </div>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <Sparkles className="w-8 h-8 opacity-20" />
                                            <span>{t('pages.search.empty')}</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredNames.length > 0 && (
                    <div className="mt-4 text-center text-slate-500 text-sm">
                        {t('pages.search.showingPrefix')} {Math.min(visibleCount, filteredNames.length)} {t('pages.search.showingConnector')} {filteredNames.length}
                    </div>
                )}

                {/* FAQ Section */}
                <div className="mt-16 mb-12 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-amber-400 mb-8">
                        {t('pages.search.faqTitle')}
                    </h2>
                    <div className="space-y-4">
                        <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer open:bg-white/[0.05] transition-colors">
                            <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                {t('pages.search.faq.q1')}
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="mt-3 text-slate-400 text-sm pl-4 border-l-2 border-amber-500">
                                {t('pages.search.faq.a1')}
                            </p>
                        </details>

                        <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer open:bg-white/[0.05] transition-colors">
                            <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                {t('pages.search.faq.q2')}
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="mt-3 text-slate-400 text-sm pl-4 border-l-2 border-amber-500">
                                {t('pages.search.faq.a2')}
                            </p>
                        </details>

                        <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer open:bg-white/[0.05] transition-colors">
                            <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                {t('pages.search.faq.q3')}
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="mt-3 text-slate-400 text-sm pl-4 border-l-2 border-amber-500">
                                {t('pages.search.faq.a3')}
                            </p>
                        </details>
                    </div>
                </div>

                {/* ==================== SEO Content Sections ==================== */}

                {/* Why NameMongkol */}
                <section className="mt-16 mb-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">
                        {t('pages.search.benefitsTitle')}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <article className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="font-semibold text-slate-200 mb-2">{t('pages.search.benefits.b1Title')}</h3>
                            <p className="text-slate-400 text-sm">
                                {t('pages.search.benefits.b1Desc')}
                            </p>
                        </article>
                        <article className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="font-semibold text-slate-200 mb-2">{t('pages.search.benefits.b2Title')}</h3>
                            <p className="text-slate-400 text-sm">
                                {t('pages.search.benefits.b2Desc')}
                            </p>
                        </article>
                        <article className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                                <Filter className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-slate-200 mb-2">{t('pages.search.benefits.b3Title')}</h3>
                            <p className="text-slate-400 text-sm">
                                {t('pages.search.benefits.b3Desc')}
                            </p>
                        </article>
                    </div>
                </section>

                {/* Free vs Pro Comparison Table */}
                <section className="mt-16 mb-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">
                        {t('pages.search.compareTitle')}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" aria-label="feature comparison">
                            <thead>
                                <tr className="bg-white/[0.05] border-b border-white/10">
                                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('pages.search.compare.feature')}</th>
                                    <th className="px-4 py-3 text-center text-slate-300 font-semibold">{t('pages.search.compare.free')}</th>
                                    <th className="px-4 py-3 text-center text-amber-400 font-semibold">{t('pages.search.compare.pro')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-slate-400">{t('pages.search.compare.row1')}</td>
                                    <td className="px-4 py-3 text-center text-slate-300">5,000+</td>
                                    <td className="px-4 py-3 text-center text-emerald-400 font-medium">5,000+</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-slate-400">{t('pages.search.compare.row2')}</td>
                                    <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                                    <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-slate-400">{t('pages.search.compare.row3')}</td>
                                    <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                                    <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-slate-400">{t('pages.search.compare.row4')}</td>
                                    <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                                    <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-slate-400">{t('pages.search.compare.row5')}</td>
                                    <td className="px-4 py-3 text-center text-rose-400">✗</td>
                                    <td className="px-4 py-3 text-center text-emerald-400 font-medium">✓ จับคู่อัตโนมัติ</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-slate-400">{t('pages.search.compare.row6')}</td>
                                    <td className="px-4 py-3 text-center text-rose-400">✗</td>
                                    <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-slate-400">{t('pages.search.compare.row7')}</td>
                                    <td className="px-4 py-3 text-center text-rose-400">✗</td>
                                    <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-slate-400">{t('pages.search.compare.row8')}</td>
                                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">{t('pages.search.compare.freePrice')}</td>
                                    <td className="px-4 py-3 text-center text-amber-400 font-medium">{t('pages.search.compare.proPrice')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 text-center">
                        <Link
                            href="/premium-search"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
                        >
                            <Sparkles className="w-5 h-5" />
                            {t('pages.search.compare.tryPro')}
                        </Link>
                    </div>
                </section>

                {/* How to Use Steps */}
                <section className="mt-16 mb-12 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-amber-400 mb-8">
                        {t('pages.search.stepsTitle')}
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-200 mb-1">{t('pages.search.steps.s1Title')}</h3>
                                <p className="text-slate-400 text-sm">
                                    {t('pages.search.steps.s1Desc')}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-200 mb-1">{t('pages.search.steps.s2Title')}</h3>
                                <p className="text-slate-400 text-sm">
                                    {t('pages.search.steps.s2Desc')}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-200 mb-1">{t('pages.search.steps.s3Title')}</h3>
                                <p className="text-slate-400 text-sm">
                                    {t('pages.search.steps.s3Desc')} <Link href="/" className="text-amber-400 hover:underline">{t('pages.search.links.l1Title')}</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Internal Links */}
                <section className="mt-16 mb-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">
                        {t('pages.search.linksTitle')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href="/"
                            className="group block bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all"
                        >
                            <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-amber-400 transition-colors">
                                🔮 {t('pages.search.links.l1Title')}
                            </h3>
                            <p className="text-slate-400 text-sm">
                                {t('pages.search.links.l1Desc')}
                            </p>
                        </Link>
                        <Link
                            href="/premium-search"
                            className="group block bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all"
                        >
                            <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-amber-400 transition-colors">
                                ⭐ {t('pages.search.links.l2Title')}
                            </h3>
                            <p className="text-slate-400 text-sm">
                                {t('pages.search.links.l2Desc')}
                            </p>
                        </Link>
                        <Link
                            href="/premium-analysis"
                            className="group block bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all"
                        >
                            <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-amber-400 transition-colors">
                                💎 {t('pages.search.links.l3Title')}
                            </h3>
                            <p className="text-slate-400 text-sm">
                                {t('pages.search.links.l3Desc')}
                            </p>
                        </Link>
                        <Link
                            href="/phone-analysis"
                            className="group block bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all"
                        >
                            <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-amber-400 transition-colors">
                                📱 {t('pages.search.links.l4Title')}
                            </h3>
                            <p className="text-slate-400 text-sm">
                                {t('pages.search.links.l4Desc')}
                            </p>
                        </Link>
                    </div>
                </section>

                {/* ==================== End SEO Content Sections ==================== */}


            </div>
        </div>
    );
}
