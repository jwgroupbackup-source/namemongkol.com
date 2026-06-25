'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Lock, Search, RotateCcw, SlidersHorizontal, Coins, CheckCircle2 } from 'lucide-react';
import { premiumNamesRaw } from '@/data/premiumNamesRaw';
import { parsePremiumNames } from '@/utils/premiumDataParser';
import { supabase } from '@/utils/supabase';
import { getPrediction } from '@/utils/getPrediction';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import {
    filterPremiumNames,
    getAvailablePremiumLetters,
    getUniquePremiumScores,
    groupPremiumNamesByLetter,
    type LeadingCharType,
} from './premiumSearchUtils';
import {
    deductCredits,
    getEffectiveUserCredits,
    savePremiumUnlockHistoryIfEligible,
} from '@/services/premiumSearchService';

// Import New Sub-components
import PremiumHeader from './components/PremiumHeader';
import PremiumNameCard from './components/PremiumNameCard';
import PremiumAlphabetBar from './components/PremiumAlphabetBar';
import PremiumSEOSection from './components/PremiumSEOSection';
import { SoftYellowGlowBackground } from '@/components/ui/background-components';

interface ScoreDropdownProps {
    value: string;
    onChange: (value: string) => void;
    scores: number[];
    disabled: boolean;
}

function ScoreDropdown({ value, onChange, scores, disabled }: ScoreDropdownProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const { t } = useLanguage();
    const getScoreBadgeClass = (tone: string) => {
        if (tone.includes('emerald')) return 'border border-emerald-200 bg-emerald-100 text-emerald-800';
        if (tone.includes('rose')) return 'border border-rose-200 bg-rose-100 text-rose-700';
        return 'border border-amber-200 bg-amber-100 text-amber-800';
    };

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const root = rootRef.current;
            if (root && event.target instanceof Node && !root.contains(event.target)) setOpen(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    useEffect(() => { if (disabled) setTimeout(() => setOpen(false), 0); }, [disabled]);

    const selectedLabel = value ? `${t('pages.premiumSearch.filters.scorePrefix') || ''} ${value}`.trim() : t('pages.premiumSearch.filters.scoreAny');

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(v => !v)}
                className={`flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#17352f] shadow-[0_10px_24px_rgba(16,185,129,0.07)] transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3 sm:text-sm ${open ? 'rounded-b-none border-b-transparent shadow-lg' : ''}`}
            >
                <span>{selectedLabel}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-emerald-500 transition-transform duration-300 sm:h-4 sm:w-4 ${open ? 'rotate-180 text-emerald-700' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-full z-50 mt-0 max-h-80 overflow-y-auto rounded-b-xl border border-t-0 border-emerald-300 bg-white shadow-[0_20px_40px_rgba(16,185,129,0.16)] custom-scrollbar animate-fade-in-up">
                    <button
                        type="button"
                        onClick={() => { onChange(''); setOpen(false); }}
                        className={`w-full border-b border-emerald-200 px-4 py-3 text-left text-sm font-semibold transition-colors ${value === '' ? 'bg-emerald-200 text-[#0f2d27]' : 'bg-white text-[#17352f] hover:bg-emerald-50 hover:text-[#0f2d27]'}`}
                    >
                        {t('pages.premiumSearch.filters.scoreAny')}
                    </button>
                    {scores.map((score: number) => {
                        const { desc, color, level } = getPrediction(score);
                        return (
                            <button
                                key={score}
                                type="button"
                                onClick={() => { onChange(score.toString()); setOpen(false); }}
                                className={`group/item flex w-full items-center justify-between border-b border-emerald-200 px-4 py-3 text-left transition-colors last:border-0 ${value === score.toString() ? 'bg-emerald-200/90' : 'bg-white hover:bg-emerald-50'}`}
                            >
                                <div className="flex flex-col flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-bold transition-colors ${value === score.toString() ? 'text-[#0f2d27]' : 'text-[#17352f] group-hover/item:text-[#0f2d27]'}`}>
                                            {(t('pages.premiumSearch.filters.scorePrefix') || '').trim()} {score}
                                        </span>
                                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getScoreBadgeClass(color)}`}>
                                            {level}
                                        </span>
                                    </div>
                                    <span className={`truncate text-xs transition-colors ${value === score.toString() ? 'text-[#245045]' : 'text-[#42544f] group-hover/item:text-[#245045]'}`}>
                                        {desc}
                                    </span>
                                </div>
                                {value === score.toString() && <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function ClientPage() {
    const router = useRouter();
    const { t } = useLanguage();
    
    const [selectedDay, setSelectedDay] = useState('All');
    const [selectedGender, setSelectedGender] = useState('all');
    const [targetScore, setTargetScore] = useState('');
    const [leadingCharType, setLeadingCharType] = useState<LeadingCharType>('Any');

    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [unlockedCounts, setUnlockedCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [userCredits, setUserCredits] = useState<number | null>(null);

    const dayOptions = useMemo(() => ([
        { value: 'All', label: t('pages.premiumSearch.filters.dayAll') },
        { value: 'อาทิตย์', label: t('pages.premiumSearch.days.sunday') },
        { value: 'จันทร์', label: t('pages.premiumSearch.days.monday') },
        { value: 'อังคาร', label: t('pages.premiumSearch.days.tuesday') },
        { value: 'พุธ(กลางวัน)', label: t('pages.premiumSearch.days.wednesday') },
        { value: 'พุธ(กลางคืน)', label: t('pages.premiumSearch.days.wednesday_night') },
        { value: 'พฤหัสบดี', label: t('pages.premiumSearch.days.thursday') },
        { value: 'ศุกร์', label: t('pages.premiumSearch.days.friday') },
        { value: 'เสาร์', label: t('pages.premiumSearch.days.saturday') },
    ]), [t]);

    const allNames = useMemo(() => parsePremiumNames(premiumNamesRaw), []);

    const filteredNames = useMemo(() => {
        return filterPremiumNames(allNames, { selectedDay, selectedGender, targetScore, leadingCharType });
    }, [allNames, selectedDay, selectedGender, targetScore, leadingCharType]);

    const groupedByLetter = useMemo(() => {
        return groupPremiumNamesByLetter(filteredNames);
    }, [filteredNames]);

    const availableLetters = useMemo(() => getAvailablePremiumLetters(groupedByLetter), [groupedByLetter]);

    useEffect(() => {
        if (!selectedLetter || !availableLetters.includes(selectedLetter)) {
            setSelectedLetter(availableLetters.length > 0 ? availableLetters[0] : null);
        }
    }, [availableLetters, selectedLetter]);

    const uniqueScores = useMemo(() => {
        return getUniquePremiumScores(allNames, { selectedDay, selectedGender, targetScore: '', leadingCharType });
    }, [allNames, selectedDay, selectedGender, leadingCharType]);

    useEffect(() => {
        if (targetScore && !uniqueScores.includes(Number(targetScore))) setTargetScore('');
    }, [uniqueScores, targetScore]);

    const activeFilterCount = [
        selectedDay !== 'All',
        selectedGender !== 'all',
        Boolean(targetScore),
        leadingCharType !== 'Any',
    ].filter(Boolean).length;

    const resetFilters = () => {
        setSelectedDay('All');
        setSelectedGender('all');
        setTargetScore('');
        setLeadingCharType('Any');
    };

    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const total = await getEffectiveUserCredits(user.id);
                if (total !== null) setUserCredits(total);
            }
        };
        fetchCredits();
        const handleForceCreditsUpdate = () => fetchCredits();
        window.addEventListener('force_credits_update', handleForceCreditsUpdate);
        return () => window.removeEventListener('force_credits_update', handleForceCreditsUpdate);
    }, []);

    const performUnlock = async (letter: string, amount: number) => {
        const Swal = (await import('sweetalert2')).default;
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            const result = await Swal.fire({
                title: t('pages.premiumSearch.alerts.loginTitle'),
                text: t('pages.premiumSearch.alerts.loginText'),
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: t('pages.premiumSearch.alerts.loginConfirm'),
                cancelButtonText: t('pages.premiumSearch.alerts.loginCancel'),
                confirmButtonColor: '#f59e0b',
                background: '#0f172a',
                color: '#fff',
                customClass: { popup: 'border border-white/10 rounded-2xl' }
            });
            if (result.isConfirmed) router.push('/login');
            return;
        }

        if (userCredits !== null && userCredits < amount) {
            const result = await Swal.fire({
                title: t('pages.premiumSearch.alerts.creditsTitle'),
                text: t('pages.premiumSearch.alerts.creditsText'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: t('pages.premiumSearch.alerts.creditsConfirm'),
                cancelButtonText: t('pages.premiumSearch.alerts.creditsCancel'),
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#64748b',
                background: '#0f172a',
                color: '#fff',
                iconColor: '#f59e0b',
                customClass: { popup: 'border border-white/10 rounded-2xl' }
            });
            if (result.isConfirmed) router.push('/topup');
            return;
        }

        const confirmResult = await Swal.fire({
            title: `ยืนยันการปลดล็อก?`,
            text: `ใช้ ${amount} เครดิตเพื่อแสดง 20 รายชื่อ ในหมวดอักษร "${letter}"`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ปลดล็อก',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#059669',
            cancelButtonColor: '#ef4444',
            background: '#0f172a',
            color: '#fff',
            iconColor: '#34d399',
            customClass: { popup: 'border border-white/10 rounded-2xl' }
        });

        if (!confirmResult.isConfirmed) return;

        setIsLoading(true);
        try {
            await deductCredits(amount);

            setUserCredits(prev => (prev !== null ? prev - amount : null));
            window.dispatchEvent(new Event('force_credits_update'));
            await new Promise(resolve => setTimeout(resolve, 800));

            setUnlockedCounts(prev => ({ ...prev, [letter]: (prev[letter] || 0) + 20 }));

            const unlockedNames = groupedByLetter.get(letter)?.slice(0, (unlockedCounts[letter] || 0) + 20) || [];
            await savePremiumUnlockHistoryIfEligible({
                userId: user.id,
                selectedDay,
                targetScore,
                leadingCharType,
                selectedLetter,
                unlockedNames,
            });
        } catch (err) {
            console.error('Search Error:', err);
            Swal.fire({
                title: t('pages.premiumSearch.alerts.errorTitle'),
                text: t('pages.premiumSearch.alerts.errorText'),
                icon: 'error',
                confirmButtonText: 'OK',
                background: '#0f172a',
                color: '#fff'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SoftYellowGlowBackground className="overflow-x-hidden font-sans text-[#5a5a82] selection:bg-amber-500 selection:text-white">
            {/* Floating Mobile Credits */}
            <div className="fixed bottom-[7.75rem] right-4 z-40 flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2.5 shadow-[0_12px_34px_rgba(16,185,129,0.16)] backdrop-blur-xl sm:hidden">
                <Coins className="h-4 w-4 text-amber-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5a5a82]">เครดิต:</span>
                <span className="text-sm font-black text-emerald-700">{userCredits !== null ? userCredits : '—'}</span>
            </div>

            <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-36 pt-7 sm:px-6 sm:pt-32 md:pb-24">
                <div className="space-y-5 sm:space-y-12">
                    <PremiumHeader 
                        totalNames={allNames.length} 
                        filteredCount={filteredNames.length} 
                        availableLettersCount={availableLetters.length} 
                        credits={userCredits} 
                    />

                    {/* Ultra Premium Filter Panel */}
                    <div className="group relative z-30">
                        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-emerald-200/30 via-amber-100/35 to-emerald-100/30 opacity-80 blur transition duration-1000 group-hover:opacity-100" />
                        <div className="relative rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/50 to-amber-50/40 shadow-[0_24px_70px_rgba(16,185,129,0.12)] sm:rounded-3xl">
                            <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
                                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-200/35 blur-[80px]" />
                            </div>
                            
                            <div className="relative z-10 p-4 sm:p-8">
                                <div className="mb-4 flex items-center justify-between gap-3 border-b border-emerald-100 pb-4 sm:mb-6 sm:pb-5">
                                    <div>
                                        <h2 className="flex items-center gap-2.5 text-lg font-bold text-[#1a1a3e]">
                                            <SlidersHorizontal className="h-5 w-5 text-emerald-600" />
                                            ปรับเงื่อนไขค้นหา
                                        </h2>
                                        <p className="mt-1.5 text-xs font-medium text-[#5a5a82]">
                                            {activeFilterCount > 0 ? `กำลังใช้ ${activeFilterCount} ตัวกรอง` : 'เริ่มจากวันเกิดก่อนเพื่อเปิดตัวเลือกอักษรนำ'}
                                        </p>
                                    </div>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    disabled={isLoading || activeFilterCount === 0}
                                    className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white/70 px-4 py-2 text-xs font-bold text-[#5a5a82] transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    ล้างตัวกรอง
                                </button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 relative z-10">
                                {/* Day Filter */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5a5a82] sm:text-xs">{t('pages.premiumSearch.filters.dayLabel')}</label>
                                    <div className="relative">
                                        <select
                                            value={selectedDay}
                                            onChange={(e) => {
                                                setSelectedDay(e.target.value);
                                                if (e.target.value === 'All') setLeadingCharType('Any');
                                            }}
                                            className="w-full appearance-none rounded-xl border border-emerald-100 bg-white/85 px-3 py-2.5 text-xs font-medium text-[#1a1a3e] shadow-[0_10px_24px_rgba(16,185,129,0.05)] transition-all focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:px-4 sm:py-3 sm:text-sm"
                                        >
                                            {dayOptions.map(day => <option key={day.value} value={day.value}>{day.label}</option>)}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-500 sm:right-4 sm:h-4 sm:w-4" />
                                    </div>
                                </div>

                                {/* Score Filter */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5a5a82] sm:text-xs">{t('pages.premiumSearch.filters.scoreLabel')}</label>
                                    <ScoreDropdown value={targetScore} onChange={setTargetScore} scores={uniqueScores} disabled={isLoading} />
                                </div>

                                {/* Gender Filter */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5a5a82] sm:text-xs">{t('pages.premiumSearch.filters.genderLabel')}</label>
                                    <div className="relative">
                                        <select
                                            value={selectedGender}
                                            onChange={(e) => setSelectedGender(e.target.value)}
                                            className="w-full appearance-none rounded-xl border border-emerald-100 bg-white/85 px-3 py-2.5 text-xs font-medium text-[#1a1a3e] shadow-[0_10px_24px_rgba(16,185,129,0.05)] transition-all focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:px-4 sm:py-3 sm:text-sm"
                                        >
                                            <option value="all">{t('pages.premiumSearch.filters.genderAll')}</option>
                                            <option value="male">{t('pages.premiumSearch.filters.genderMale')}</option>
                                            <option value="female">{t('pages.premiumSearch.filters.genderFemale')}</option>
                                            <option value="neutral">{t('pages.premiumSearch.filters.genderNeutral')}</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-500 sm:right-4 sm:h-4 sm:w-4" />
                                    </div>
                                </div>

                                {/* Leading Char Filter */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#5a5a82] sm:text-xs">
                                        <span className="truncate">{t('pages.premiumSearch.leading.label')}</span>
                                        <span className="ml-1 shrink-0 text-[9px] normal-case text-emerald-600/80 sm:text-[10px]">{selectedDay !== 'All' ? `(${selectedDay})` : ''}</span>
                                    </label>
                                    <div className="flex h-[38px] gap-1 rounded-xl border border-emerald-100 bg-white/80 p-1 shadow-[0_10px_24px_rgba(16,185,129,0.05)] sm:h-[46px] sm:p-1.5">
                                        {(['Dech', 'Si', 'Any'] as LeadingCharType[]).map((type) => {
                                            const isSelected = leadingCharType === type;
                                            const labelMap: Record<LeadingCharType, string> = { Dech: 'เดช', Si: 'ศรี', Any: 'ทั้งหมด' };
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    disabled={selectedDay === 'All' || isLoading}
                                                    onClick={() => setLeadingCharType(type as LeadingCharType)}
                                                    className={`flex-1 flex items-center justify-center rounded-lg text-[10px] sm:text-xs font-bold transition-all disabled:cursor-not-allowed ${
                                                        isSelected 
                                                            ? 'border border-emerald-300 bg-gradient-to-r from-emerald-100 to-amber-50 text-emerald-800 shadow-[0_8px_18px_rgba(16,185,129,0.16)] disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-500 disabled:shadow-none'
                                                            : 'border border-transparent text-[#5a5a82] hover:bg-emerald-50 hover:text-emerald-700 disabled:text-slate-300 disabled:hover:bg-transparent'
                                                    }`}
                                                >
                                                    {labelMap[type]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                    {availableLetters.length > 0 ? (
                        <div className="xl:grid xl:grid-cols-[250px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start xl:gap-8 space-y-6 xl:space-y-0">
                            
                            <PremiumAlphabetBar 
                                availableLetters={availableLetters}
                                selectedLetter={selectedLetter}
                                setSelectedLetter={setSelectedLetter}
                                groupedByLetter={groupedByLetter}
                            />

                            <div className="relative">
                                {selectedLetter && (() => {
                                    const namesForLetter = groupedByLetter.get(selectedLetter) || [];
                                    const unlockedCount = unlockedCounts[selectedLetter] || 0;
                                    const isFullyUnlocked = unlockedCount > 0;
                                    const displayCount = isFullyUnlocked ? unlockedCount : 20;
                                    const visibleNames = namesForLetter.slice(0, displayCount);
                                    const hasMore = namesForLetter.length > displayCount;

                                    return (
                                        <>
                                            {!isFullyUnlocked && (
                                                <div className="relative mb-6 overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-white via-amber-50/70 to-emerald-50/60 p-6 text-center shadow-[0_24px_70px_rgba(245,158,11,0.14)] backdrop-blur-2xl sm:p-12">
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_52%)]" />
                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <div className="relative mb-4 sm:mb-6">
                                                            <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-amber-300/25 blur-xl" />
                                                            <div className="flex h-12 w-12 rotate-3 items-center justify-center rounded-2xl border border-amber-300 bg-white/85 transition-transform hover:rotate-6 sm:h-20 sm:w-20">
                                                                <Lock className="h-6 w-6 text-amber-700 drop-shadow-md sm:h-8 sm:w-8" />
                                                            </div>
                                                        </div>
                                                        <h3 className="mb-2 text-xl font-black tracking-tight text-[#1a1a3e] sm:mb-3 sm:text-3xl">
                                                            ปลดล็อกหมวดอักษร <span className="text-3xl text-emerald-700 sm:text-4xl">&quot;{selectedLetter}&quot;</span>
                                                        </h3>
                                                        <p className="mx-auto mb-5 max-w-lg text-[11px] leading-relaxed text-[#5a5a82] sm:mb-8 sm:text-base">
                                                            คัดเฉพาะรายชื่อเกรด A+ เสริมมงคลทวีคูณสูงสุด 20 รายชื่อต่อครั้ง (รายชื่ออื่นจะถูกสุ่มเปิดเพื่อความสิริมงคล)
                                                        </p>
                                                        <button
                                                            onClick={() => performUnlock(selectedLetter, 15)}
                                                            disabled={isLoading}
                                                            className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-300 px-6 py-3 text-sm font-black text-[#1a1a3e] shadow-[0_12px_32px_rgba(245,158,11,0.22)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(245,158,11,0.30)] disabled:opacity-70 sm:gap-3 sm:px-8 sm:py-4 sm:text-base"
                                                        >
                                                            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 mix-blend-overlay" />
                                                            {isLoading ? <span className="animate-spin text-lg sm:text-xl">⏳</span> : <Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                            ปลดล็อกรายชื่อมงคล (15 เครดิต)
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                                                {visibleNames.map((item, index) => (
                                                    <PremiumNameCard key={item.name + index} item={item} isUnlocked={isFullyUnlocked} />
                                                ))}
                                            </div>

                                            {isFullyUnlocked && hasMore && (
                                                <div className="mt-12 text-center">
                                                    <button
                                                        onClick={() => performUnlock(selectedLetter, 15)}
                                                        disabled={isLoading}
                                                        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white/85 px-8 py-4 font-bold text-[#1a1a3e] shadow-[0_14px_34px_rgba(16,185,129,0.10)] transition-all hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
                                                    >
                                                        {isLoading ? <span className="animate-spin">⏳</span> : <Lock size={18} className="text-emerald-700" />}
                                                        ดูเพิ่มอีก 20 ชื่อ (15 เครดิต)
                                                    </button>
                                                    <p className="mt-4 text-xs text-[#5a5a82] font-medium">
                                                        แสดงแล้ว <span className="text-[#1a1a3e] font-bold">{visibleNames.length}</span> จากทั้งหมด <span className="text-amber-600 font-bold">{namesForLetter.length}</span> ชื่อ
                                                    </p>
                                                </div>
                                            )}

                                            {isFullyUnlocked && !hasMore && (
                                                <div className="mt-12 text-center py-6 border-t border-slate-200">
                                                    <p className="text-[#5a5a82] text-sm flex items-center justify-center gap-2 font-medium">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                        แสดงครบทุกชื่อในหมวด &quot;{selectedLetter}&quot; แล้ว ({namesForLetter.length} ชื่อ)
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-12 rounded-3xl border border-emerald-200/80 bg-white/85 p-12 text-center shadow-[0_18px_44px_rgba(16,185,129,0.08)]">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50 shadow-inner">
                                <Search size={40} className="text-emerald-500" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold tracking-tight text-[#1a1a3e]">{t('pages.premiumSearch.results.emptyTitle')}</h3>
                            <p className="mb-8 text-[#5a5a82]">{t('pages.premiumSearch.results.emptyDesc')}</p>
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                            >
                                <RotateCcw className="h-4 w-4" />
                                ล้างตัวกรองแล้วเริ่มใหม่
                            </button>
                        </div>
                    )}

                    <PremiumSEOSection allNamesLength={allNames.length} />

                </div>
            </main>
        </SoftYellowGlowBackground>
    );
}
