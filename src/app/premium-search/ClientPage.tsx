'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Lock, Search, RotateCcw, SlidersHorizontal, Coins, CheckCircle2 } from 'lucide-react';
import { premiumNamesRaw } from '@/data/premiumNamesRaw';
import { parsePremiumNames, PremiumNameData } from '@/utils/premiumDataParser';
import { supabase } from '@/utils/supabase';
import { getPrediction } from '@/utils/getPrediction';
import { useRouter } from 'next/navigation';
import { thaksaConfig } from '@/data/thaksa';
import { DayKey } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

// Import New Sub-components
import PremiumHeader from './components/PremiumHeader';
import PremiumNameCard from './components/PremiumNameCard';
import PremiumAlphabetBar from './components/PremiumAlphabetBar';
import PremiumSEOSection from './components/PremiumSEOSection';

type LeadingCharType = 'Any' | 'Dech' | 'Si';

const thaiDayToKey: Record<string, DayKey> = {
    'อาทิตย์': 'sunday',
    'จันทร์': 'monday',
    'อังคาร': 'tuesday',
    'พุธ(กลางวัน)': 'wednesday',
    'พุธ(กลางคืน)': 'wednesday_night',
    'พฤหัสบดี': 'thursday',
    'ศุกร์': 'friday',
    'เสาร์': 'saturday'
};

const THAI_LETTERS = [
    'ก','ข','ฃ','ค','ฅ','ฆ','ง','จ','ฉ','ช','ซ','ฌ','ญ','ฎ','ฏ','ฐ','ฑ','ฒ','ณ',
    'ด','ต','ถ','ท','ธ','น','บ','ป','ผ','ฝ','พ','ฟ','ภ','ม','ย','ร','ล','ว',
    'ศ','ษ','ส','ห','ฬ','อ','ฮ',
];

const THAI_LEADING_VOWELS = new Set(['\u0E40', '\u0E41', '\u0E42', '\u0E43', '\u0E44']);

const getFirstConsonant = (name: string): string => {
    if (!name) return '';
    return THAI_LEADING_VOWELS.has(name.charAt(0)) ? name.charAt(1) : name.charAt(0);
};

function ScoreDropdown({ value, onChange, scores, disabled }: any) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const { t } = useLanguage();

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
                className={`flex w-full items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0a0f1d] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${open ? 'rounded-b-none border-b-transparent shadow-lg' : ''}`}
            >
                <span>{selectedLabel}</span>
                <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-full mt-0 z-50 max-h-80 overflow-y-auto bg-[#0f172a] border border-white/10 border-t-0 rounded-b-xl shadow-2xl custom-scrollbar animate-fade-in-up">
                    <button
                        type="button"
                        onClick={() => { onChange(''); setOpen(false); }}
                        className={`w-full px-4 py-3 text-left transition-colors border-b border-white/5 text-sm font-medium ${value === '' ? 'bg-amber-400/10 text-amber-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
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
                                className={`w-full px-4 py-3 text-left transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group/item ${value === score.toString() ? 'bg-amber-400/10' : 'hover:bg-white/5'}`}
                            >
                                <div className="flex flex-col flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-bold transition-colors ${value === score.toString() ? 'text-amber-300' : 'text-slate-200 group-hover/item:text-white'}`}>
                                            {(t('pages.premiumSearch.filters.scorePrefix') || '').trim()} {score}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${color}`}>
                                            {level}
                                        </span>
                                    </div>
                                    <span className={`text-xs truncate transition-colors ${value === score.toString() ? 'text-amber-200/70' : 'text-slate-500 group-hover/item:text-slate-400'}`}>
                                        {desc}
                                    </span>
                                </div>
                                {value === score.toString() && <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />}
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
        return allNames.filter(item => {
            const matchesScore = !targetScore || item.totalScore.toString() === targetScore;
            let matchesGender = true;
            if (selectedGender !== 'all') {
                if (selectedGender === 'male' && item.gender !== 'male' && item.gender !== 'neutral') matchesGender = false;
                if (selectedGender === 'female' && item.gender !== 'female' && item.gender !== 'neutral') matchesGender = false;
                if (selectedGender === 'neutral' && item.gender !== 'neutral') matchesGender = false;
            }
            const matchesDay = selectedDay === 'All' || item.suitableDays.includes(selectedDay);
            let matchesLeadingChar = true;
            if (selectedDay !== 'All' && leadingCharType !== 'Any') {
                const dayKey = thaiDayToKey[selectedDay];
                if (dayKey && thaksaConfig[dayKey]) {
                    const firstChar = getFirstConsonant(item.name);
                    const config = thaksaConfig[dayKey];
                    if (leadingCharType === 'Dech') matchesLeadingChar = config.dech.includes(firstChar);
                    else if (leadingCharType === 'Si') matchesLeadingChar = config.si.includes(firstChar);
                }
            }
            return matchesScore && matchesGender && matchesDay && matchesLeadingChar;
        });
    }, [allNames, selectedDay, selectedGender, targetScore, leadingCharType]);

    const groupedByLetter = useMemo(() => {
        const group = new Map<string, PremiumNameData[]>();
        filteredNames.forEach(item => {
            const letter = getFirstConsonant(item.name);
            if (!letter) return;
            if (!group.has(letter)) group.set(letter, []);
            group.get(letter)!.push(item);
        });
        group.forEach(names => names.sort((a, b) => a.name.localeCompare(b.name, 'th')));
        return group;
    }, [filteredNames]);

    const availableLetters = useMemo(() => THAI_LETTERS.filter(letter => groupedByLetter.has(letter)), [groupedByLetter]);

    useEffect(() => {
        if (!selectedLetter || !availableLetters.includes(selectedLetter)) {
            setSelectedLetter(availableLetters.length > 0 ? availableLetters[0] : null);
        }
    }, [availableLetters, selectedLetter]);

    const uniqueScores = useMemo(() => {
        const scores = new Set<number>();
        allNames.forEach(item => {
            let matchesGender = true;
            if (selectedGender !== 'all') {
                if (selectedGender === 'male' && item.gender !== 'male' && item.gender !== 'neutral') matchesGender = false;
                if (selectedGender === 'female' && item.gender !== 'female' && item.gender !== 'neutral') matchesGender = false;
                if (selectedGender === 'neutral' && item.gender !== 'neutral') matchesGender = false;
            }
            const matchesDay = selectedDay === 'All' || item.suitableDays.includes(selectedDay);
            let matchesLeadingChar = true;
            if (selectedDay !== 'All' && leadingCharType !== 'Any') {
                const dayKey = thaiDayToKey[selectedDay];
                if (dayKey && thaksaConfig[dayKey]) {
                    const firstChar = getFirstConsonant(item.name);
                    const config = thaksaConfig[dayKey];
                    if (leadingCharType === 'Dech') matchesLeadingChar = config.dech.includes(firstChar);
                    else if (leadingCharType === 'Si') matchesLeadingChar = config.si.includes(firstChar);
                }
            }
            if (matchesGender && matchesDay && matchesLeadingChar) scores.add(item.totalScore);
        });
        return Array.from(scores).sort((a, b) => a - b);
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
                const { data } = await supabase.from('user_profiles').select('credits, welcome_credits, welcome_credits_granted_at').eq('id', user.id).maybeSingle();
                if (data) {
                    let total = data.credits ?? 0;
                    if (data.welcome_credits && data.welcome_credits > 0 && data.welcome_credits_granted_at) {
                        const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
                        if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) total += data.welcome_credits;
                    }
                    setUserCredits(total);
                }
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
            const { error } = await supabase.rpc('deduct_credits', { amount });
            if (error) throw error;

            setUserCredits(prev => (prev !== null ? prev - amount : null));
            window.dispatchEvent(new Event('force_credits_update'));
            await new Promise(resolve => setTimeout(resolve, 800));

            setUnlockedCounts(prev => ({ ...prev, [letter]: (prev[letter] || 0) + 20 }));
            
            const { data: profile } = await supabase.from('user_profiles').select('tier').eq('id', user.id).maybeSingle();
            const tier = (profile?.tier || 'free').toLowerCase();
            if (tier === 'pro' || tier === 'vvip') {
                await supabase.rpc('cleanup_analysis_history_by_tier');
                const unlockedNames = groupedByLetter.get(letter)?.slice(0, (unlockedCounts[letter] || 0) + 20) || [];
                await supabase.from('analysis_history').insert({
                    user_id: user.id,
                    type: 'gacha',
                    input_data: { selectedDay, selectedScore: targetScore || 'All', leadingChar: leadingCharType, selectedLetter },
                    result_data: unlockedNames.map(item => ({
                        name: item.name,
                        totalScore: item.totalScore,
                        meaning: `เหมาะกับวัน: ${item.suitableDays.join(', ')}`,
                        notes: item.scoreBreakdown
                    }))
                });
            }
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
        <div className="min-h-screen bg-[#050711] text-slate-100 font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.8),transparent_80%)]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
            </div>

            {/* Floating Mobile Credits */}
            <div className="fixed bottom-6 right-4 sm:hidden z-50 bg-slate-900/90 backdrop-blur-xl border border-amber-400/30 shadow-[0_8px_30px_rgba(245,158,11,0.25)] rounded-full px-4 py-2.5 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">เครดิต:</span>
                <span className="text-sm font-black text-amber-300">{userCredits !== null ? userCredits : '—'}</span>
            </div>

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24 relative z-10">
                <div className="space-y-8 sm:space-y-12">
                    <PremiumHeader 
                        totalNames={allNames.length} 
                        filteredCount={filteredNames.length} 
                        availableLettersCount={availableLetters.length} 
                        credits={userCredits} 
                    />

                    {/* Ultra Premium Filter Panel */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 rounded-[2rem] blur opacity-70 group-hover:opacity-100 transition duration-1000" />
                        <div className="relative bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-[80px] pointer-events-none" />
                            
                            <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                                <div>
                                    <h2 className="flex items-center gap-2.5 text-lg font-bold text-white">
                                        <SlidersHorizontal className="h-5 w-5 text-amber-400" />
                                        ปรับเงื่อนไขค้นหา
                                    </h2>
                                    <p className="mt-1.5 text-xs text-slate-500 font-medium">
                                        {activeFilterCount > 0 ? `กำลังใช้ ${activeFilterCount} ตัวกรอง` : 'เริ่มจากวันเกิดก่อนเพื่อเปิดตัวเลือกอักษรนำ'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    disabled={isLoading || activeFilterCount === 0}
                                    className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 px-4 py-2 text-xs font-bold text-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    ล้างตัวกรอง
                                </button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 relative z-10">
                                {/* Day Filter */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{t('pages.premiumSearch.filters.dayLabel')}</label>
                                    <div className="relative">
                                        <select
                                            value={selectedDay}
                                            onChange={(e) => {
                                                setSelectedDay(e.target.value);
                                                if (e.target.value === 'All') setLeadingCharType('Any');
                                            }}
                                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0a0f1d] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all appearance-none font-medium text-xs sm:text-sm"
                                        >
                                            {dayOptions.map(day => <option key={day.value} value={day.value} className="bg-slate-900">{day.label}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Score Filter */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{t('pages.premiumSearch.filters.scoreLabel')}</label>
                                    <ScoreDropdown value={targetScore} onChange={setTargetScore} scores={uniqueScores} disabled={isLoading} />
                                </div>

                                {/* Gender Filter */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{t('pages.premiumSearch.filters.genderLabel')}</label>
                                    <div className="relative">
                                        <select
                                            value={selectedGender}
                                            onChange={(e) => setSelectedGender(e.target.value)}
                                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-[#0a0f1d] border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all appearance-none font-medium text-xs sm:text-sm"
                                        >
                                            <option value="all" className="bg-slate-900">{t('pages.premiumSearch.filters.genderAll')}</option>
                                            <option value="male" className="bg-slate-900">{t('pages.premiumSearch.filters.genderMale')}</option>
                                            <option value="female" className="bg-slate-900">{t('pages.premiumSearch.filters.genderFemale')}</option>
                                            <option value="neutral" className="bg-slate-900">{t('pages.premiumSearch.filters.genderNeutral')}</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Leading Char Filter */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                        <span className="truncate">{t('pages.premiumSearch.leading.label')}</span>
                                        <span className="text-[9px] sm:text-[10px] text-amber-500/70 normal-case ml-1 shrink-0">{selectedDay !== 'All' ? `(${selectedDay})` : ''}</span>
                                    </label>
                                    <div className="bg-[#0a0f1d] p-1 sm:p-1.5 rounded-xl border border-white/10 flex gap-1 h-[38px] sm:h-[46px]">
                                        {['Dech', 'Si', 'Any'].map((type) => {
                                            const isSelected = leadingCharType === type;
                                            const labelMap: any = { Dech: 'เดช', Si: 'ศรี', Any: 'ทั้งหมด' };
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    disabled={selectedDay === 'All' || isLoading}
                                                    onClick={() => setLeadingCharType(type as LeadingCharType)}
                                                    className={`flex-1 flex items-center justify-center rounded-lg text-[10px] sm:text-xs font-bold transition-all disabled:opacity-30 ${
                                                        isSelected 
                                                            ? 'bg-amber-400/15 border border-amber-400/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                                                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
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
                                                <div className="relative mb-6 overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#11141E] to-[#0A0D14] p-6 sm:p-12 text-center shadow-[0_0_50px_rgba(245,158,11,0.1)] backdrop-blur-2xl">
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15),transparent_50%)]" />
                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <div className="relative mb-4 sm:mb-6">
                                                            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl scale-150 animate-pulse" />
                                                            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl bg-[#0a0f1d] border border-amber-500/40 flex items-center justify-center rotate-3 hover:rotate-6 transition-transform">
                                                                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 drop-shadow-md" />
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl sm:text-3xl font-black text-white mb-2 sm:mb-3 tracking-tight">
                                                            ปลดล็อกหมวดอักษร <span className="text-amber-400 text-3xl sm:text-4xl">&quot;{selectedLetter}&quot;</span>
                                                        </h3>
                                                        <p className="text-slate-400 text-[11px] sm:text-base mb-5 sm:mb-8 max-w-lg mx-auto leading-relaxed">
                                                            คัดเฉพาะรายชื่อเกรด A+ เสริมมงคลทวีคูณสูงสุด 20 รายชื่อต่อครั้ง (รายชื่ออื่นจะถูกสุ่มเปิดเพื่อความสิริมงคล)
                                                        </p>
                                                        <button
                                                            onClick={() => performUnlock(selectedLetter, 15)}
                                                            disabled={isLoading}
                                                            className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] disabled:opacity-70 text-sm sm:text-base"
                                                        >
                                                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 mix-blend-overlay" />
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
                                                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:border-amber-400/40 text-white font-bold rounded-2xl transition-all hover:bg-white/10 disabled:opacity-50 shadow-lg"
                                                    >
                                                        {isLoading ? <span className="animate-spin">⏳</span> : <Lock size={18} className="text-amber-400" />}
                                                        ดูเพิ่มอีก 20 ชื่อ (15 เครดิต)
                                                    </button>
                                                    <p className="mt-4 text-xs text-slate-500 font-medium">
                                                        แสดงแล้ว <span className="text-white">{visibleNames.length}</span> จากทั้งหมด <span className="text-amber-400">{namesForLetter.length}</span> ชื่อ
                                                    </p>
                                                </div>
                                            )}

                                            {isFullyUnlocked && !hasMore && (
                                                <div className="mt-12 text-center py-6 border-t border-white/5">
                                                    <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
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
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center mt-12 backdrop-blur-sm">
                            <div className="w-24 h-24 bg-black/40 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                                <Search size={40} className="text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{t('pages.premiumSearch.results.emptyTitle')}</h3>
                            <p className="text-slate-400 mb-8">{t('pages.premiumSearch.results.emptyDesc')}</p>
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-6 py-3 font-bold text-amber-400 transition-colors hover:bg-amber-500/20"
                            >
                                <RotateCcw className="h-4 w-4" />
                                ล้างตัวกรองแล้วเริ่มใหม่
                            </button>
                        </div>
                    )}

                    <PremiumSEOSection allNamesLength={allNames.length} />

                </div>
            </main>
        </div>
    );
}
