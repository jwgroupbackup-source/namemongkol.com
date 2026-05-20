'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Search, Sparkles, Calendar, Award, Lock, ChevronDown, CheckCircle2, XCircle, Zap, Shield, Star, HelpCircle, Type } from 'lucide-react';
import { premiumNamesRaw } from '@/data/premiumNamesRaw';
import { parsePremiumNames, PremiumNameData } from '@/utils/premiumDataParser';

import { supabase } from '@/utils/supabase';
import { getPrediction } from '@/utils/getPrediction';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { thaksaConfig } from '@/data/thaksa';
import { DayKey } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

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

function ScoreDropdown({
    value,
    onChange,
    scores,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    scores: number[];
    disabled: boolean;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const root = rootRef.current;
            if (!root) return;
            const target = event.target;
            if (target instanceof Node && !root.contains(target)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    useEffect(() => {
        if (disabled) {
            setTimeout(() => setOpen(false), 0);
        }
    }, [disabled]);

    const selectedLabel = value
        ? `${t('pages.premiumSearch.filters.scorePrefix') || ''} ${value}`.trim()
        : t('pages.premiumSearch.filters.scoreAny');

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(v => !v)}
                className={`block w-full px-3 md:px-4 py-2.5 md:py-4 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all cursor-pointer font-medium text-sm md:text-lg disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between ${open ? 'rounded-b-none border-b-white/5' : ''
                    }`}
            >
                <span>{selectedLabel}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-full mt-0 z-[200] max-h-80 overflow-y-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 border-t-0 rounded-xl rounded-t-none shadow-2xl custom-scrollbar">
                    <button
                        type="button"
                        onClick={() => {
                            onChange('');
                            setOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors border-b border-white/5 ${value === ''
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'text-slate-200 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {t('pages.premiumSearch.filters.scoreAny')}
                    </button>
                    {scores.map(score => {
                        const { desc, color, level } = getPrediction(score);
                        return (
                            <button
                                key={score}
                                type="button"
                                onClick={() => {
                                    onChange(score.toString());
                                    setOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group/item ${value === score.toString()
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'text-slate-200 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex flex-col flex-1 min-w-0 mr-4">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`font-medium transition-colors ${value === score.toString() ? 'text-white' : 'text-slate-200 group-hover/item:text-amber-400'}`}>
                                            {(t('pages.premiumSearch.filters.scorePrefix') || '').trim()} {score}
                                        </span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 ${color}`}>
                                            {level}
                                        </span>
                                    </div>
                                    <span className={`text-xs truncate transition-colors ${value === score.toString() ? 'text-slate-300' : 'text-slate-500 group-hover/item:text-slate-400'}`}>
                                        {desc}
                                    </span>
                                </div>
                                {value === score.toString() && <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const NameCard = ({ item, isUnlocked }: { item: PremiumNameData; isUnlocked: boolean }) => {
    const { t } = useLanguage();
    
    const dayOptions = [
        { value: 'All', label: t('pages.premiumSearch.filters.dayAll') },
        { value: 'อาทิตย์', label: t('pages.premiumSearch.days.sunday') },
        { value: 'จันทร์', label: t('pages.premiumSearch.days.monday') },
        { value: 'อังคาร', label: t('pages.premiumSearch.days.tuesday') },
        { value: 'พุธ(กลางวัน)', label: t('pages.premiumSearch.days.wednesday') },
        { value: 'พุธ(กลางคืน)', label: t('pages.premiumSearch.days.wednesday_night') },
        { value: 'พฤหัสบดี', label: t('pages.premiumSearch.days.thursday') },
        { value: 'ศุกร์', label: t('pages.premiumSearch.days.friday') },
        { value: 'เสาร์', label: t('pages.premiumSearch.days.saturday') },
    ];
    
    const getDayLabel = (value: string) => dayOptions.find(opt => opt.value === value)?.label || value;
    
    return (
        <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="flex justify-between items-start mb-4">
                <h3 
                    className="text-2xl md:text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors"
                    style={!isUnlocked ? { filter: 'blur(8px)', userSelect: 'none' } : {}}
                >
                    {item.name}
                </h3>
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold shrink-0">
                    <Award size={16} />
                    <span>{item.totalScore}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-start gap-2 text-sm text-slate-400">
                    <Calendar size={16} className="mt-1 shrink-0 text-slate-500" />
                    <div className="flex flex-wrap gap-2">
                        {item.suitableDays.map((day: string, i: number) => (
                            <span key={i} className="inline-block px-2 py-0.5 rounded bg-slate-800/50 border border-white/5 text-slate-300 text-xs text-center">
                                {getDayLabel(day)}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">พลังเลขคู่</p>
                    <div className="flex flex-wrap gap-2">
                        {item.scoreBreakdown.map((score: string, i: number) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                                {score}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PremiumSearchPage() {
    const router = useRouter();
    const { t } = useLanguage();
    
    // Filters
    const [selectedDay, setSelectedDay] = useState('All');
    const [selectedGender, setSelectedGender] = useState('all');
    const [targetScore, setTargetScore] = useState('');
    const [leadingCharType, setLeadingCharType] = useState<LeadingCharType>('Any');

    // Display State
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

    // Filter Logic
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
                    const firstChar = item.name.charAt(0);
                    const config = thaksaConfig[dayKey];

                    if (leadingCharType === 'Dech') {
                        matchesLeadingChar = config.dech.includes(firstChar);
                    } else if (leadingCharType === 'Si') {
                        matchesLeadingChar = config.si.includes(firstChar);
                    }
                }
            }

            return matchesScore && matchesGender && matchesDay && matchesLeadingChar;
        });
    }, [allNames, selectedDay, selectedGender, targetScore, leadingCharType]);

    // Grouping by letter
    const groupedByLetter = useMemo(() => {
        const group = new Map<string, PremiumNameData[]>();
        filteredNames.forEach(item => {
            const letter = getFirstConsonant(item.name);
            if (!letter) return;
            if (!group.has(letter)) {
                group.set(letter, []);
            }
            group.get(letter)!.push(item);
        });
        
        // Sort names inside groups
        group.forEach(names => {
            names.sort((a, b) => a.name.localeCompare(b.name, 'th'));
        });
        
        return group;
    }, [filteredNames]);

    const availableLetters = useMemo(() => {
        return THAI_LETTERS.filter(letter => groupedByLetter.has(letter));
    }, [groupedByLetter]);

    // Select first letter by default if current selection is invalid
    useEffect(() => {
        if (!selectedLetter || !availableLetters.includes(selectedLetter)) {
            setSelectedLetter(availableLetters.length > 0 ? availableLetters[0] : null);
        }
    }, [availableLetters, selectedLetter]);

    // Unique scores for dropdown
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
                    const firstChar = item.name.charAt(0);
                    const config = thaksaConfig[dayKey];
                    if (leadingCharType === 'Dech') matchesLeadingChar = config.dech.includes(firstChar);
                    else if (leadingCharType === 'Si') matchesLeadingChar = config.si.includes(firstChar);
                }
            }
            if (matchesGender && matchesDay && matchesLeadingChar) {
                scores.add(item.totalScore);
            }
        });
        return Array.from(scores).sort((a, b) => a - b);
    }, [allNames, selectedDay, selectedGender, leadingCharType]);

    useEffect(() => {
        if (targetScore && !uniqueScores.includes(Number(targetScore))) {
            setTargetScore('');
        }
    }, [uniqueScores, targetScore]);

    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('credits, welcome_credits, welcome_credits_granted_at')
                    .eq('id', user.id)
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
        };
        fetchCredits();
        
        const handleForceCreditsUpdate = () => {
            fetchCredits();
        };
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
                background: '#1e293b',
                color: '#fff'
            });

            if (result.isConfirmed) {
                router.push('/login');
            }
            return;
        }

        if (userCredits !== null && userCredits < 15) {
            const result = await Swal.fire({
                title: t('pages.premiumSearch.alerts.creditsTitle'),
                text: t('pages.premiumSearch.alerts.creditsText'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: t('pages.premiumSearch.alerts.creditsConfirm'),
                cancelButtonText: t('pages.premiumSearch.alerts.creditsCancel'),
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#64748b',
                background: '#1e293b',
                color: '#fff',
                iconColor: '#f59e0b'
            });

            if (result.isConfirmed) {
                router.push('/topup');
            }
            return;
        }

        const confirmResult = await Swal.fire({
            title: `ยืนยันการปลดล็อก?`,
            text: `ใช้ 15 เครดิตเพื่อแสดง 20 รายชื่อ ในหมวดอักษร "${letter}"`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ปลดล็อก',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#059669',
            cancelButtonColor: '#ef4444',
            background: '#1e293b',
            color: '#fff',
            iconColor: '#34d399'
        });

        if (!confirmResult.isConfirmed) return;

        setIsLoading(true);

        try {
            const { error } = await supabase.rpc('deduct_credits', { amount: 15 });
            if (error) throw error;

            setUserCredits(prev => (prev !== null ? prev - 15 : null));
            window.dispatchEvent(new Event('force_credits_update'));

            await new Promise(resolve => setTimeout(resolve, 800)); // UX delay

            setUnlockedCounts(prev => ({
                ...prev,
                [letter]: (prev[letter] || 0) + 20
            }));
            
            // Log history
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('tier')
                .eq('id', user.id)
                .maybeSingle();

            const tier = (profile?.tier || 'free').toLowerCase();
            if (tier === 'pro' || tier === 'vvip') {
                await supabase.rpc('cleanup_analysis_history_by_tier');
                const unlockedNames = groupedByLetter.get(letter)?.slice(0, (unlockedCounts[letter] || 0) + 20) || [];
                
                await supabase.from('analysis_history').insert({
                    user_id: user.id,
                    type: 'gacha',
                    input_data: {
                        selectedDay,
                        selectedScore: targetScore || 'All',
                        leadingChar: leadingCharType,
                        selectedLetter
                    },
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
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlockFirstBatch = () => {
        if (!selectedLetter) return;
        performUnlock(selectedLetter, 15);
    };

    const handleLoadMore = () => {
        if (!selectedLetter) return;
        performUnlock(selectedLetter, 15);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">

            <main className="w-full max-w-[1400px] mx-auto transition-all duration-300 min-h-screen px-3 sm:px-4 pt-16 md:pt-32 pb-32 md:pb-28 relative">
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto space-y-4 md:space-y-8">
                    {/* Header */}
                    <header className="text-center space-y-2.5 md:space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium">
                            <Sparkles size={14} />
                            <span>{t('pages.premiumSearch.headerBadge')}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-emerald-300 drop-shadow-2xl tracking-tight leading-tight">
                            {t('pages.premiumSearch.headerTitle')}
                        </h1>
                        <div className="max-w-[65ch] mx-auto space-y-2">
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base hidden md:block">
                                {t('pages.premiumSearch.headerDesc').replace('{count}', allNames.length.toLocaleString())}
                            </p>
                            <p className="text-emerald-300 font-medium text-sm md:text-lg hidden md:block">
                                {t('pages.premiumSearch.headerSub')}
                            </p>

                            <div className="mt-2 md:mt-4 mx-auto w-fit bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 md:px-6 md:py-3 shadow-lg shadow-emerald-900/20 backdrop-blur-md">
                                <p className="text-emerald-400 font-medium text-xs md:text-base">
                                    {t('pages.premiumSearch.headerHint')}{' '}
                                    <Link href="/" className="underline decoration-emerald-500/50 hover:text-emerald-300 transition-colors">{t('sidebar.analyzeName')}</Link>
                                </p>
                            </div>
                            <p className="text-slate-500 text-xs md:text-sm pt-1 md:pt-4">
                                พบทั้งหมด <span className="text-emerald-400 font-semibold">{filteredNames.length}</span> รายชื่อจากเงื่อนไขนี้
                            </p>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-slate-300 flex items-center justify-center gap-2">
                                    <span className="text-xs text-slate-500">เครดิตคงเหลือ:</span>
                                    <span className="text-lg md:text-xl font-bold text-emerald-400">{userCredits !== null ? userCredits : '—'}</span>
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Filters Section */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-3.5 sm:p-6 md:p-8 shadow-2xl md:mx-auto max-w-4xl relative overflow-visible">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 md:gap-6 relative z-10">
                            
                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">{t('pages.premiumSearch.filters.dayLabel')}</label>
                                <div className="relative">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => {
                                            const newVal = e.target.value;
                                            setSelectedDay(newVal);
                                            if (newVal === 'All') setLeadingCharType('Any');
                                        }}
                                        className="block w-full px-3 md:px-4 py-2.5 md:py-4 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all appearance-none cursor-pointer font-medium text-sm md:text-lg"
                                        disabled={isLoading}
                                    >
                                        {dayOptions.map(day => (
                                            <option key={day.value} value={day.value} className="bg-[#0f172a]">
                                                {day.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">{t('pages.premiumSearch.filters.scoreLabel')}</label>
                                <ScoreDropdown value={targetScore} onChange={setTargetScore} scores={uniqueScores} disabled={isLoading} />
                            </div>

                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">{t('pages.premiumSearch.filters.genderLabel')}</label>
                                <div className="relative">
                                    <select
                                        value={selectedGender}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                        className="block w-full px-3 md:px-4 py-2.5 md:py-4 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all appearance-none cursor-pointer font-medium text-sm md:text-lg"
                                        disabled={isLoading}
                                    >
                                        <option value="all" className="bg-[#0f172a]">{t('pages.premiumSearch.filters.genderAll')}</option>
                                        <option value="male" className="bg-[#0f172a]">{t('pages.premiumSearch.filters.genderMale')}</option>
                                        <option value="female" className="bg-[#0f172a]">{t('pages.premiumSearch.filters.genderFemale')}</option>
                                        <option value="neutral" className="bg-[#0f172a]">{t('pages.premiumSearch.filters.genderNeutral')}</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2 md:col-span-12">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 md:mb-4 text-slate-400 transition-colors">
                                    {t('pages.premiumSearch.leading.label')}{' '}
                                    {selectedDay === 'All' && (
                                        <span className="text-amber-500/80 ml-2 normal-case font-normal">{t('pages.premiumSearch.leading.hint')}</span>
                                    )}
                                </label>
                                <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:items-center gap-2.5 md:gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="leadingChar"
                                                value="Dech"
                                                checked={leadingCharType === 'Dech'}
                                                onChange={() => setLeadingCharType('Dech')}
                                                className="peer appearance-none w-5 h-5 md:w-6 md:h-6 border-2 border-slate-500 rounded-full bg-transparent checked:border-emerald-500 checked:bg-emerald-500/20 transition-all"
                                            />
                                            <div className="absolute inset-0 m-auto w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className={`text-sm md:text-lg font-medium transition-colors ${leadingCharType === 'Dech' ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                            {t('pages.premiumSearch.leading.dech')}
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="leadingChar"
                                                value="Si"
                                                checked={leadingCharType === 'Si'}
                                                onChange={() => setLeadingCharType('Si')}
                                                className="peer appearance-none w-5 h-5 md:w-6 md:h-6 border-2 border-slate-500 rounded-full bg-transparent checked:border-emerald-500 checked:bg-emerald-500/20 transition-all"
                                            />
                                            <div className="absolute inset-0 m-auto w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className={`text-sm md:text-lg font-medium transition-colors ${leadingCharType === 'Si' ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                            {t('pages.premiumSearch.leading.si')}
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="leadingChar"
                                                value="Any"
                                                checked={leadingCharType === 'Any'}
                                                onChange={() => setLeadingCharType('Any')}
                                                className="peer appearance-none w-5 h-5 md:w-6 md:h-6 border-2 border-blue-500 rounded-full bg-transparent checked:border-blue-500 checked:bg-blue-500/20 transition-all"
                                            />
                                            <div className="absolute inset-0 m-auto w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className={`text-sm md:text-lg font-medium transition-colors ${leadingCharType === 'Any' ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                            {t('pages.premiumSearch.leading.any')}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Alphabet Tabs */}
                    {availableLetters.length > 0 ? (
                        <div id="results-section" className="space-y-6 animate-fade-in-up">
                            
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-x-auto custom-scrollbar">
                                <div className="flex gap-2 w-max pb-2">
                                    {availableLetters.map(letter => {
                                        const count = groupedByLetter.get(letter)?.length || 0;
                                        const isSelected = selectedLetter === letter;
                                        return (
                                            <button
                                                key={letter}
                                                onClick={() => setSelectedLetter(letter)}
                                                className={`flex flex-col items-center justify-center min-w-[3.5rem] py-2 px-3 rounded-xl transition-all ${
                                                    isSelected 
                                                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <span className="text-lg font-bold">{letter}</span>
                                                <span className={`text-[10px] font-semibold mt-1 px-2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'}`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedLetter && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2 md:px-4">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Type className="text-emerald-400" />
                                            หมวดอักษร {selectedLetter} <span className="text-slate-400 text-sm font-normal">({groupedByLetter.get(selectedLetter)?.length || 0} ชื่อ)</span>
                                        </h2>
                                    </div>
                                    
                                    {(() => {
                                        const namesForLetter = groupedByLetter.get(selectedLetter) || [];
                                        const currentUnlocked = unlockedCounts[selectedLetter] || 0;
                                        const displayCount = currentUnlocked === 0 ? 20 : currentUnlocked;
                                        const visibleNames = namesForLetter.slice(0, displayCount);
                                        const isFullyUnlocked = currentUnlocked > 0;
                                        const hasMore = namesForLetter.length > displayCount;
                                        
                                        return (
                                            <>
                                                {/* Unlock Banner if not unlocked */}
                                                {!isFullyUnlocked && (
                                                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 text-center shadow-lg shadow-amber-900/20 backdrop-blur-md relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                                                        <Lock className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                                                        <h3 className="text-xl font-bold text-amber-300 mb-2">ปลดล็อกหมวดอักษร &quot;{selectedLetter}&quot;</h3>
                                                        <p className="text-slate-300 text-sm md:text-base mb-6 max-w-lg mx-auto">
                                                            ดูรายชื่อมงคลในหมวดนี้ชัดๆ สูงสุด 20 ชื่อต่อครั้ง (ชื่ออื่นๆ ถูกเบลอไว้)
                                                        </p>
                                                        <button
                                                            onClick={handleUnlockFirstBatch}
                                                            disabled={isLoading}
                                                            className="relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70"
                                                        >
                                                            {isLoading ? <span className="animate-spin">⏳</span> : <Lock size={18} />}
                                                            ปลดล็อกเพื่อดูชื่อ (15 เครดิต)
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                                                    {visibleNames.map((item, index) => (
                                                        <NameCard key={item.name + index} item={item} isUnlocked={isFullyUnlocked} />
                                                    ))}
                                                </div>

                                                {/* Load More Button */}
                                                {isFullyUnlocked && hasMore && (
                                                    <div className="flex flex-col items-center gap-3 pt-4 pb-4">
                                                        <p className="text-slate-400 text-sm">
                                                            แสดงแล้ว <span className="text-white font-semibold">{visibleNames.length}</span> ชื่อ
                                                            {' · '}
                                                            ยังมีชื่อที่เหลืออีก <span className="text-emerald-400 font-semibold">{namesForLetter.length - visibleNames.length}</span> ชื่อ
                                                        </p>
                                                        <button
                                                            onClick={handleLoadMore}
                                                            disabled={isLoading}
                                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isLoading ? (
                                                                <span className="animate-spin text-base">⏳</span>
                                                            ) : (
                                                                <Lock size={16} className="text-emerald-400" />
                                                            )}
                                                            <span>ดูเพิ่มอีก 20 ชื่อ (15 เครดิต)</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {/* End of list */}
                                                {isFullyUnlocked && !hasMore && (
                                                    <div className="text-center py-6 border-t border-white/5 mt-8">
                                                        <p className="text-slate-500 text-sm">✓ แสดงครบทุกชื่อในหมวด &quot;{selectedLetter}&quot; แล้ว ({namesForLetter.length} ชื่อ)</p>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center animate-fade-in-up mt-8">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={32} className="text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{t('pages.premiumSearch.results.emptyTitle')}</h3>
                            <p className="text-slate-400">{t('pages.premiumSearch.results.emptyDesc')}</p>
                        </div>
                    )}

                    {/* ==================== SEO CONTENT SECTION (Below the Fold) ==================== */}
                    <section className="mt-20 pt-16 border-t border-white/10 space-y-16">

                        {/* Section A: ทำไมต้อง "เปลี่ยนชื่อมงคล Pro"? */}
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
                                ทำไมต้อง <span className="text-emerald-400">&quot;เปลี่ยนชื่อมงคล Pro&quot;</span>?
                            </h2>
                            <p className="text-lg text-slate-300 leading-relaxed mb-8 text-center">
                                ระบบเปลี่ยนชื่อมงคล Pro ของ NameMongkol แตกต่างจากการตั้งชื่อทั่วไป เพราะเราใช้ <strong className="text-emerald-400">Premium Database</strong> ที่ผ่านการคัดกรองมาแล้วถึง 3 ชั้น
                            </p>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                                        <Shield className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">ชั้นที่ 1: คัดตามหลักทักษา</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        อักษรนำดี กาลกิณีไม่มี 100% ทุกชื่อผ่านการตรวจสอบว่าไม่มีอักษรต้องห้ามตามวันเกิด
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                                        <Star className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">ชั้นที่ 2: คัดตามเลขศาสตร์</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ เช่น 14, 15, 24, 36, 45 ที่ส่งเสริมดวงชะตาอย่างแท้จริง
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                                        <Zap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">ชั้นที่ 3: ความหมายดี</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        ความหมายดี ไพเราะ ไม่เชย เหมาะกับยุคสมัย เรียกชื่อแล้วดูดี มีความหมายเป็นสิริมงคล
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section B: ตารางเปรียบเทียบ Free vs Pro */}
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-white mb-8">
                                เปรียบเทียบ <span className="text-slate-400">ค้นหาทั่วไป</span> vs <span className="text-emerald-400">เปลี่ยนชื่อมงคล Pro</span>
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-4 px-4 text-slate-400 font-medium">คุณสมบัติ</th>
                                            <th className="text-center py-4 px-4 text-slate-400 font-medium">ค้นหาทั่วไป</th>
                                            <th className="text-center py-4 px-4 text-emerald-400 font-medium">เปลี่ยนชื่อมงคล Pro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 text-slate-300">คัดกรองอักษรกาลกิณี</td>
                                            <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                            <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 text-slate-300">เลือกอักษรนำ (วรรคเดช/ศรี)</td>
                                            <td className="text-center py-4 px-4"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                                            <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 text-slate-300">เกรดของผลรวมเลขศาสตร์</td>
                                            <td className="text-center py-4 px-4 text-slate-400">คละเกรด</td>
                                            <td className="text-center py-4 px-4 text-emerald-400 font-semibold">เกรด A+ เท่านั้น</td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 text-slate-300">จำนวนชื่อในฐานข้อมูล</td>
                                            <td className="text-center py-4 px-4 text-slate-400">5,000+</td>
                                            <td className="text-center py-4 px-4 text-emerald-400 font-semibold">{allNames.length.toLocaleString()} (คัดพิเศษ)</td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 text-slate-300">กรองตามเพศ</td>
                                            <td className="text-center py-4 px-4"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                                            <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 text-slate-300">คุณภาพความหมาย</td>
                                            <td className="text-center py-4 px-4 text-slate-400">ปานกลาง</td>
                                            <td className="text-center py-4 px-4 text-emerald-400 font-semibold">คัดสรรพิเศษ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section C: วิธีใช้งาน */}
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-white mb-4">
                                วิธีใช้งาน<span className="text-emerald-400">เปลี่ยนชื่อมงคล Pro</span>
                            </h2>
                            <p className="text-center text-slate-400 mb-8">
                                เหมาะสำหรับผู้ที่กำลังมองหา <Link href="/search" className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-500/30">วิธีตั้งชื่อลูก</Link> หรือ <Link href="/name-check" className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-500/30">วิเคราะห์ชื่อเดิมก่อนเปลี่ยน</Link>
                            </p>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                                    <div className="pt-4">
                                        <h3 className="text-lg font-bold text-white mb-2">เลือกวันเกิด</h3>
                                        <p className="text-slate-400 text-sm">ใส่วันเกิดเพื่อให้ระบบคัดชื่อที่เหมาะกับทักษาของคุณโดยเฉพาะ</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                                    <div className="pt-4">
                                        <h3 className="text-lg font-bold text-white mb-2">เลือกอักษรนำ</h3>
                                        <p className="text-slate-400 text-sm">ระบุว่าต้องการเสริม <strong className="text-amber-400">อำนาจบารมี (วรรคเดช)</strong> หรือ <strong className="text-pink-400">โชคลาภเสน่ห์ (วรรคศรี)</strong></p>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                                    <div className="pt-4">
                                        <h3 className="text-lg font-bold text-white mb-2">เลือกหมวดอักษร</h3>
                                        <p className="text-slate-400 text-sm">เลือกหมวดพยัญชนะต้นที่คุณชอบ แล้วใช้เครดิตปลดล็อกเพื่อดูชื่อมงคล</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-12 text-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8">
                                <p className="text-slate-300 mb-4">
                                    💡 <strong className="text-emerald-400">คำแนะนำสำคัญ:</strong> หลังได้ชื่อที่ต้องการแล้ว อย่าลืมนำไป
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
                                >
                                    <Sparkles size={18} />
                                    วิเคราะห์ชื่อ-สกุล ก่อนนำไปใช้
                                </Link>
                                <p className="text-slate-500 text-sm mt-4">
                                    เพื่อตรวจสอบความเข้ากันของชื่อกับนามสกุล และดูผลวิเคราะห์แบบละเอียด
                                </p>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-3">
                                <HelpCircle className="w-8 h-8 text-emerald-400" />
                                คำถามที่พบบ่อย
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-emerald-400 mb-2">
                                        Q: เปลี่ยนชื่อมงคล Pro ต่างจากค้นหาทั่วไปอย่างไร?
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        A: ระบบเปลี่ยนชื่อมงคล Pro ใช้ Premium Database ที่ผ่านการคัดกรอง 3 ชั้น: 1) คัดตามหลักทักษา ไม่มีอักษรกาลกิณี 2) คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ 3) ความหมายดี ไพเราะ ทันสมัย และสามารถเลือกอักษรนำวรรคเดช/ศรี ได้
                                    </p>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-emerald-400 mb-2">
                                        Q: วรรคเดชและวรรคศรีคืออะไร?
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        A: <strong className="text-amber-400">วรรคเดช</strong> คืออักษรนำที่ส่งเสริมเรื่องอำนาจบารมี การเลื่อนขั้นเลื่อนตำแหน่ง เหมาะกับผู้ต้องการความก้าวหน้าในหน้าที่การงาน ส่วน <strong className="text-pink-400">วรรคศรี</strong> คืออักษรนำที่ส่งเสริมเรื่องโชคลาภ เสน่ห์ความรัก เหมาะกับผู้ต้องการดึงดูดความโชคดีและเสน่ห์
                                    </p>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-emerald-400 mb-2">
                                        Q: เปลี่ยนชื่อมงคล Pro ใช้กี่เครดิต?
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        A: การปลดล็อกชื่อใช้ <strong className="text-white">15 เครดิต</strong>ต่อการปลดล็อก 1 ครั้ง (สูงสุด 20 รายชื่อ) ในแต่ละหมวดอักษร
                                    </p>
                                </div>
                            </div>
                        </div>

                    </section>
                    {/* ==================== END SEO CONTENT SECTION ==================== */}
                </div>
            </main>
        </div>
    );
}
