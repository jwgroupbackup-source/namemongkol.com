'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Search, Sparkles, Calendar, Award, Lock, ChevronDown, CheckCircle2, XCircle, Zap, Shield, Star, HelpCircle, Type, RotateCcw, SlidersHorizontal, Coins, BadgeCheck } from 'lucide-react';
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
                className={`block w-full px-3 md:px-4 py-2 md:py-4 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400/40 focus:border-amber-300/40 backdrop-blur-xl transition-all cursor-pointer font-medium text-xs sm:text-sm md:text-lg disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between ${open ? 'rounded-b-none border-b-white/5' : ''
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
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-colors border-b border-white/5 text-sm ${value === ''
                            ? 'bg-amber-400/15 text-amber-100'
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
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group/item ${value === score.toString()
                                    ? 'bg-amber-400/15 text-amber-100'
                                    : 'text-slate-200 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex flex-col flex-1 min-w-0 mr-4">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`font-medium transition-colors ${value === score.toString() ? 'text-white' : 'text-slate-200 group-hover/item:text-amber-300'}`}>
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
                                {value === score.toString() && <div className="w-2 h-2 rounded-full bg-amber-300 shrink-0" />}
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
    const firstConsonant = getFirstConsonant(item.name) || item.name.charAt(0);
    
    return (
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-amber-200/12 bg-[linear-gradient(145deg,rgba(22,25,39,0.92),rgba(8,12,24,0.86)_46%,rgba(27,20,12,0.76))] p-2.5 shadow-[inset_0_1px_0_rgba(255,245,220,0.08),0_14px_34px_rgba(1,4,15,0.24)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300/32 hover:shadow-[inset_0_1px_0_rgba(255,245,220,0.12),0_22px_52px_rgba(1,4,15,0.34),0_0_28px_rgba(201,147,58,0.10)] sm:p-4 md:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(245,205,125,0.12),transparent_34%),radial-gradient(circle_at_86%_88%,rgba(74,113,166,0.10),transparent_36%)]" />
            <div className="pointer-events-none absolute right-2 top-0 text-6xl font-black leading-none text-amber-100/[0.045] transition-colors group-hover:text-amber-100/[0.075] sm:right-3 sm:text-7xl md:text-8xl">
                {firstConsonant}
            </div>
            {!isUnlocked && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-amber-400/12 to-transparent" />
            )}
            <div className="relative flex flex-col gap-1.5 sm:gap-2 sm:flex-row sm:items-start sm:justify-between mb-2.5 md:mb-4">
                <h3 
                    className="max-w-full break-words text-lg font-bold leading-tight text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)] transition-colors group-hover:text-amber-100 sm:text-2xl md:text-2xl 2xl:text-3xl"
                    style={!isUnlocked ? { filter: 'blur(8px)', userSelect: 'none' } : {}}
                >
                    {item.name}
                </h3>
                <div className="flex w-fit shrink-0 items-center gap-1 rounded-md border border-amber-200/30 bg-[linear-gradient(135deg,rgba(245,190,90,0.18),rgba(100,75,28,0.12))] px-1.5 py-0.5 text-[10px] font-bold text-amber-100 shadow-[inset_0_1px_0_rgba(255,244,210,0.12),0_8px_18px_rgba(1,4,15,0.18)] sm:rounded-lg sm:px-3 sm:py-1 sm:text-sm">
                    <Award size={12} className="sm:h-4 sm:w-4" />
                    <span>{item.totalScore}</span>
                </div>
            </div>

            <div className="relative space-y-2.5 md:space-y-4">
                <div className="flex items-start gap-1.5 rounded-lg border border-white/[0.06] bg-slate-950/22 p-1.5 text-xs text-slate-400 sm:gap-2 sm:p-2 sm:text-sm">
                    <Calendar size={14} className="mt-0.5 shrink-0 text-amber-200/60 sm:h-4 sm:w-4" />
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {item.suitableDays.map((day: string, i: number) => (
                            <span key={i} className="inline-block rounded border border-white/[0.07] bg-white/[0.045] px-1.5 py-0.5 text-center text-[10px] leading-tight text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-2 sm:text-xs">
                                {getDayLabel(day)}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="border-t border-amber-100/[0.08] pt-2.5 md:pt-4">
                    <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-amber-100/45 sm:mb-2 sm:text-xs">พลังเลขคู่</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {item.scoreBreakdown.map((score: string, i: number) => (
                            <span key={i} className="rounded-md border border-amber-200/18 bg-amber-300/[0.075] px-1.5 py-1 font-mono text-[10px] text-amber-100 shadow-[inset_0_1px_0_rgba(255,245,220,0.06)] sm:px-2 sm:text-xs">
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
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
                    const firstChar = getFirstConsonant(item.name);
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
                    const firstChar = getFirstConsonant(item.name);
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

    const selectedDayLabel = dayOptions.find(day => day.value === selectedDay)?.label || selectedDay;
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
            text: `ใช้ ${amount} เครดิตเพื่อแสดง 20 รายชื่อ ในหมวดอักษร "${letter}"`,
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
            const { error } = await supabase.rpc('deduct_credits', { amount });
            if (error) throw error;

            setUserCredits(prev => (prev !== null ? prev - amount : null));
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
        <div className="min-h-screen bg-[#050711] text-[#f8fafc] font-sans selection:bg-amber-500/30 relative">
            <style dangerouslySetInnerHTML={{ __html: `
              .scrollbar-none::-webkit-scrollbar {
                display: none !important;
              }
              .scrollbar-none {
                -ms-overflow-style: none !important;
                scrollbar-width: none !important;
              }
            `}} />

            {/* Floating Credits Pill for Mobile */}
            <div className="fixed bottom-4 right-3 sm:hidden z-[100] bg-slate-950/85 backdrop-blur-xl border border-amber-300/20 shadow-[0_0_20px_rgba(201,147,58,0.18)] rounded-full px-3 py-2 flex items-center gap-1.5 transition-all">
                <Coins className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[10px] text-slate-400 font-semibold tracking-wide">เครดิต:</span>
                <span className="text-xs font-bold text-amber-200">{userCredits !== null ? userCredits : '—'}</span>
            </div>

            <main className="w-full max-w-[1400px] mx-auto transition-all duration-300 min-h-screen px-2.5 sm:px-4 pt-14 md:pt-32 pb-24 md:pb-28 relative">
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto space-y-3.5 sm:space-y-5 md:space-y-8">
                    {/* Header */}
                    <header className="text-center space-y-2.5 sm:space-y-4 xl:grid xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] xl:items-end xl:gap-8 xl:space-y-0 xl:text-left">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-400/10 border border-amber-300/20 text-amber-200 text-[10px] sm:text-sm font-medium shadow-[0_0_15px_rgba(201,147,58,0.12)]">
                            <Sparkles size={12} className="sm:h-3.5 sm:w-3.5" />
                            <span>{t('pages.premiumSearch.headerBadge')}</span>
                        </div>
                        <div className="xl:col-start-1 xl:row-start-2">
                            <h1 className="text-xl sm:text-4xl md:text-5xl font-bold text-[#f8fafc] drop-shadow-2xl tracking-tight leading-tight">
                                {t('pages.premiumSearch.headerTitle')}
                            </h1>
                        </div>
                        <div className="max-w-[65ch] mx-auto space-y-2 sm:space-y-3 xl:col-start-1 xl:row-start-3 xl:mx-0">
                            <p className="text-slate-400 leading-relaxed text-[11px] sm:text-sm md:text-base line-clamp-2 sm:line-clamp-none">
                                {t('pages.premiumSearch.headerDesc').replace('{count}', allNames.length.toLocaleString())}
                            </p>
                            <p className="text-amber-100 font-medium text-[11px] sm:text-sm md:text-lg">
                                {t('pages.premiumSearch.headerSub')}
                            </p>

                            <div className="mt-1.5 md:mt-4 mx-auto w-fit bg-slate-950/45 border border-amber-300/20 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 md:px-6 md:py-3 shadow-lg shadow-amber-950/10 backdrop-blur-md">
                                <p className="text-amber-100 font-medium text-[10px] sm:text-xs md:text-base">
                                    {t('pages.premiumSearch.headerHint')}{' '}
                                    <Link href="/" className="underline decoration-amber-300/50 hover:text-amber-200 transition-colors">{t('sidebar.analyzeName')}</Link>
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1.5 sm:gap-2 pt-1 sm:pt-2 xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:mx-0 xl:w-full xl:max-w-none xl:grid-cols-2 xl:gap-3 xl:pt-0">
                                {[
                                    { label: 'ชื่อคัดพิเศษ', value: allNames.length.toLocaleString(), icon: BadgeCheck },
                                    { label: 'ตรงเงื่อนไข', value: filteredNames.length.toLocaleString(), icon: Search },
                                    { label: 'หมวดอักษร', value: availableLetters.length.toLocaleString(), icon: Type },
                                    { label: 'เครดิตคงเหลือ', value: userCredits !== null ? userCredits.toLocaleString() : '—', icon: Coins },
                                ].map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="rounded-lg sm:rounded-xl xl:rounded-2xl border border-white/10 bg-white/[0.04] px-1.5 sm:px-3 xl:px-5 py-1.5 sm:py-3 xl:py-4 text-center xl:text-left">
                                        <div className="mb-0.5 sm:mb-1 xl:mb-2 flex items-center justify-center xl:justify-start gap-1 xl:gap-2 text-[8px] sm:text-[10px] xl:text-xs font-semibold text-slate-500">
                                            <Icon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 xl:h-4 xl:w-4 text-amber-300/80" />
                                            <span className="hidden xs:inline">{label}</span>
                                        </div>
                                        <div className="text-xs sm:text-base xl:text-2xl font-bold text-slate-50 md:text-lg">{value}</div>
                                    </div>
                                ))}
                        </div>
                    </header>

                    {/* Filters Section */}
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-6 md:p-7 shadow-2xl md:mx-auto max-w-6xl relative overflow-visible">
                        <div className="mb-3 sm:mb-5 flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 sm:pb-4">
                            <div>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-100">
                                    <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
                                    ปรับเงื่อนไขค้นหา
                                </div>
                                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-500">
                                    {activeFilterCount > 0 ? `กำลังใช้ ${activeFilterCount} ตัวกรอง` : 'เริ่มจากวันเกิดก่อนเพื่อเปิดตัวเลือกอักษรนำ'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={resetFilters}
                                disabled={isLoading || activeFilterCount === 0}
                                className="inline-flex shrink-0 items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border border-white/10 bg-white/[0.04] px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-slate-300 transition-colors hover:border-amber-300/30 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                ล้างตัวกรอง
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-4 md:gap-6 relative z-10">
                            
                            <div className="md:col-span-3">
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">{t('pages.premiumSearch.filters.dayLabel')}</label>
                                <div className="relative">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => {
                                            const newVal = e.target.value;
                                            setSelectedDay(newVal);
                                            if (newVal === 'All') setLeadingCharType('Any');
                                        }}
                                        className="block w-full px-2.5 sm:px-4 py-2 sm:py-3 md:py-4 bg-slate-950/40 border border-white/10 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/40 focus:border-amber-300/40 backdrop-blur-xl transition-all appearance-none cursor-pointer font-medium text-xs sm:text-sm md:text-lg"
                                        disabled={isLoading}
                                    >
                                        {dayOptions.map(day => (
                                            <option key={day.value} value={day.value} className="bg-[#0f172a]">
                                                {day.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-2.5 sm:pr-4 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">{t('pages.premiumSearch.filters.scoreLabel')}</label>
                                <ScoreDropdown value={targetScore} onChange={setTargetScore} scores={uniqueScores} disabled={isLoading} />
                            </div>

                            <div className="col-span-2 sm:col-span-2 md:col-span-3">
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">{t('pages.premiumSearch.filters.genderLabel')}</label>
                                <div className="relative">
                                    <select
                                        value={selectedGender}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                        className="block w-full px-2.5 sm:px-4 py-2 sm:py-3 md:py-4 bg-slate-950/40 border border-white/10 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/40 focus:border-amber-300/40 backdrop-blur-xl transition-all appearance-none cursor-pointer font-medium text-xs sm:text-sm md:text-lg"
                                        disabled={isLoading}
                                    >
                                        <option value="all" className="bg-[#0f172a]">{t('pages.premiumSearch.filters.genderAll')}</option>
                                        <option value="male" className="bg-[#0f172a]">{t('pages.premiumSearch.filters.genderMale')}</option>
                                        <option value="female" className="bg-[#0f172a]">{t('pages.premiumSearch.filters.genderFemale')}</option>
                                        <option value="neutral" className="bg-[#0f172a]">{t('pages.premiumSearch.filters.genderNeutral')}</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-2.5 sm:pr-4 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 md:col-span-3">
                                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 md:mb-3 text-slate-400 transition-colors">
                                    {t('pages.premiumSearch.leading.label')}{' '}
                                    <span className="text-slate-500 ml-2 normal-case font-normal">
                                        {selectedDay === 'All' ? t('pages.premiumSearch.leading.hint') : `สำหรับวัน${selectedDayLabel}`}
                                    </span>
                                </label>
                                <div className="bg-slate-950/40 p-1 rounded-xl sm:p-1.5 sm:rounded-2xl border border-white/10 flex w-full gap-1">
                                    <button
                                        type="button"
                                        disabled={selectedDay === 'All' || isLoading}
                                        onClick={() => setLeadingCharType('Dech')}
                                        className={`flex-1 text-center py-1.5 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none ${
                                            leadingCharType === 'Dech'
                                            ? 'bg-amber-400/15 border border-amber-300/30 text-amber-100 shadow-md shadow-amber-950/40'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                                        }`}
                                    >
                                        {t('pages.premiumSearch.leading.dech')}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={selectedDay === 'All' || isLoading}
                                        onClick={() => setLeadingCharType('Si')}
                                        className={`flex-1 text-center py-1.5 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none ${
                                            leadingCharType === 'Si'
                                            ? 'bg-amber-400/15 border border-amber-300/30 text-amber-100 shadow-md shadow-amber-950/40'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                                        }`}
                                    >
                                        {t('pages.premiumSearch.leading.si')}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setLeadingCharType('Any')}
                                        className={`flex-1 text-center py-1.5 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold transition-all duration-300 ${
                                            leadingCharType === 'Any'
                                            ? 'bg-slate-800/80 border border-white/10 text-[#f8fafc] shadow-md shadow-slate-950/50'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                                        }`}
                                    >
                                        {t('pages.premiumSearch.leading.any')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Alphabet Tabs */}
                    {availableLetters.length > 0 ? (
                        <div id="results-section" className="space-y-3 sm:space-y-6 xl:grid xl:grid-cols-[230px_minmax(0,1fr)] xl:items-start xl:gap-6 xl:space-y-0 animate-fade-in-up">
                            
                            <div className="relative xl:sticky xl:top-28">
                                {/* Left/Right fading gradients indicating scrollability on mobile */}
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050711] to-transparent pointer-events-none z-10 xl:hidden" />
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050711] to-transparent pointer-events-none z-10 xl:hidden" />

                                <div className="bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-3 xl:p-4 overflow-x-auto xl:overflow-visible scrollbar-none">
                                    <div className="hidden xl:mb-3 xl:block">
                                        <p className="text-sm font-bold text-slate-100">เลือกหมวดอักษร</p>
                                        <p className="mt-1 text-xs text-slate-500">{availableLetters.length} หมวดที่ตรงเงื่อนไข</p>
                                    </div>
                                    <div className="flex gap-1.5 sm:gap-2.5 xl:grid xl:grid-cols-3 xl:gap-2 w-max xl:w-full pb-0.5 sm:pb-1 xl:pb-0">
                                        {availableLetters.map(letter => {
                                            const count = groupedByLetter.get(letter)?.length || 0;
                                            const isSelected = selectedLetter === letter;
                                            return (
                                                <button
                                                    key={letter}
                                                    onClick={(e) => {
                                                        setSelectedLetter(letter);
                                                        e.currentTarget.scrollIntoView({
                                                            behavior: 'smooth',
                                                            block: 'nearest',
                                                            inline: 'center'
                                                        });
                                                    }}
                                                    className={`flex flex-col items-center justify-center min-w-[2.5rem] sm:min-w-[3.5rem] xl:min-w-0 py-1.5 sm:py-2.5 xl:py-2 px-2 sm:px-3.5 xl:px-2 rounded-lg sm:rounded-xl transition-all duration-200 transform active:scale-95 ${
                                                        isSelected 
                                                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/30 border border-amber-200/40' 
                                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-transparent'
                                                    }`}
                                                >
                                                    <span className="text-sm sm:text-lg xl:text-base font-bold">{letter}</span>
                                                    <span className={`text-[8px] sm:text-[10px] font-bold mt-0.5 sm:mt-1 px-1.5 sm:px-2 py-0.5 rounded-full transition-colors ${isSelected ? 'bg-slate-950/15 text-slate-950' : 'bg-white/10 text-slate-400'}`}>
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {selectedLetter && (
                                <div className="space-y-3 sm:space-y-6 xl:min-w-0">
                                    <div className="flex items-center justify-between gap-2 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/30 px-3 sm:px-4 xl:px-5 py-2.5 sm:py-4 xl:py-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="text-base sm:text-xl xl:text-2xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
                                                <Type className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
                                                หมวดอักษร {selectedLetter}
                                            </h2>
                                            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm xl:text-base text-slate-400">
                                                พบ {groupedByLetter.get(selectedLetter)?.length || 0} ชื่อในหมวดนี้, ปลดล็อกครั้งละ 20 ชื่อ
                                            </p>
                                        </div>
                                        <div className="inline-flex w-fit shrink-0 items-center gap-1 sm:gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs font-semibold text-amber-100">
                                            <Coins className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            15 เครดิต
                                        </div>
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
                                                {/* Unlock Banner if not unlocked - Styled as a glowing golden portal */}
                                                {!isFullyUnlocked && (
                                                    <div className="bg-gradient-to-b from-[#181912]/90 to-[#0b0c10]/95 border border-amber-500/30 rounded-xl sm:rounded-3xl p-3 sm:p-10 xl:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.12)] backdrop-blur-xl relative overflow-hidden flex flex-col items-center justify-center max-w-2xl xl:max-w-4xl mx-auto my-2 sm:my-4">
                                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_24%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.10),transparent_28%)] opacity-70"></div>
                                                        <div className="relative mb-2.5 sm:mb-5">
                                                            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl scale-150 animate-pulse" />
                                                            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-slate-950/60 border border-amber-500/30 flex items-center justify-center relative">
                                                                <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                                                            </div>
                                                        </div>
                                                        <h3 className="text-sm sm:text-2xl font-bold text-amber-300 mb-1 sm:mb-2.5">
                                                            ปลดล็อกหมวดอักษร &quot;{selectedLetter}&quot;
                                                        </h3>
                                                        <p className="text-slate-400 text-[10px] sm:text-sm md:text-base mb-3 sm:mb-6 max-w-md mx-auto leading-relaxed">
                                                            คัดเฉพาะรายชื่อเกรด A+ เสริมมงคลทวีคูณสูงสุด 20 รายชื่อต่อครั้ง (รายชื่ออื่นในกลุ่มนี้จะถูกสุ่มเปิดทีละส่วนเพื่อความสิริมงคล)
                                                        </p>
                                                        <div className="mb-3 sm:mb-6 grid w-full max-w-md grid-cols-3 gap-1.5 sm:gap-2 text-center">
                                                            {[
                                                                ['คะแนน', 'A+'],
                                                                ['แสดงผล', '20 ชื่อ'],
                                                                ['ค่าใช้จ่าย', '15 เครดิต'],
                                                            ].map(([label, value]) => (
                                                                <div key={label} className="rounded-lg sm:rounded-xl border border-white/10 bg-white/[0.04] px-1.5 sm:px-2 py-1.5 sm:py-2">
                                                                    <div className="text-[8px] sm:text-[10px] text-slate-500">{label}</div>
                                                                    <div className="mt-0.5 text-[11px] sm:text-sm font-bold text-amber-100">{value}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={handleUnlockFirstBatch}
                                                            disabled={isLoading}
                                                            className="relative w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-lg sm:rounded-xl shadow-lg shadow-amber-950/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 text-xs sm:text-base"
                                                        >
                                                            {isLoading ? <span className="animate-spin">⏳</span> : <Lock size={16} />}
                                                            ปลดล็อกรายชื่อมงคล (15 เครดิต)
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-5 xl:gap-4 relative">
                                                    {visibleNames.map((item, index) => (
                                                        <NameCard key={item.name + index} item={item} isUnlocked={isFullyUnlocked} />
                                                    ))}
                                                </div>

                                                {!isFullyUnlocked && (
                                                    <div className="sticky bottom-3 z-20 mx-auto flex w-full max-w-md flex-col items-center gap-2 rounded-2xl border border-amber-300/25 bg-slate-950/90 p-2.5 shadow-[0_18px_48px_rgba(2,6,18,0.55),0_0_24px_rgba(245,158,11,0.12)] backdrop-blur-xl sm:static sm:mt-2 sm:max-w-lg xl:max-w-none sm:flex-row sm:justify-between sm:p-3 xl:p-4">
                                                        <div className="hidden text-left sm:block">
                                                            <p className="text-sm font-bold text-amber-100">พร้อมดูชื่อจริงในหมวด {selectedLetter}</p>
                                                            <p className="text-xs text-slate-400">ปลดล็อก 20 รายชื่อ ใช้ 15 เครดิต</p>
                                                        </div>
                                                        <button
                                                            onClick={handleUnlockFirstBatch}
                                                            disabled={isLoading}
                                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-amber-950/30 transition-all duration-200 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] disabled:opacity-70 sm:w-auto sm:px-5 sm:text-sm"
                                                        >
                                                            {isLoading ? <span className="animate-spin">⏳</span> : <Lock size={15} />}
                                                            ปลดล็อกรายชื่อ 15 เครดิต
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Load More Button */}
                                                {isFullyUnlocked && hasMore && (
                                                    <div className="flex flex-col items-center gap-2 sm:gap-3 pt-3 sm:pt-4 pb-3 sm:pb-4">
                                                        <p className="text-slate-400 text-xs sm:text-sm">
                                                            แสดงแล้ว <span className="text-white font-semibold">{visibleNames.length}</span> ชื่อ
                                                            {' · '}
                                                            ยังมีชื่อที่เหลืออีก <span className="text-amber-200 font-semibold">{namesForLetter.length - visibleNames.length}</span> ชื่อ
                                                        </p>
                                                        <button
                                                            onClick={handleLoadMore}
                                                            disabled={isLoading}
                                                            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-300/40 text-slate-200 hover:text-white font-semibold rounded-lg sm:rounded-xl text-xs sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isLoading ? (
                                                                <span className="animate-spin text-base">⏳</span>
                                                            ) : (
                                                                <Lock size={16} className="text-amber-300" />
                                                            )}
                                                            <span>ดูเพิ่มอีก 20 ชื่อ (15 เครดิต)</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {/* End of list */}
                                                {isFullyUnlocked && !hasMore && (
                                                    <div className="text-center py-6 border-t border-white/5 mt-8">
                                                        <p className="text-slate-400 text-sm"><CheckCircle2 className="mr-1 inline h-4 w-4 text-emerald-300" /> แสดงครบทุกชื่อในหมวด &quot;{selectedLetter}&quot; แล้ว ({namesForLetter.length} ชื่อ)</p>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center animate-fade-in-up mt-8">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={32} className="text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{t('pages.premiumSearch.results.emptyTitle')}</h3>
                            <p className="text-slate-400">{t('pages.premiumSearch.results.emptyDesc')}</p>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/25 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-400/15"
                            >
                                <RotateCcw className="h-4 w-4" />
                                ล้างตัวกรองแล้วเริ่มใหม่
                            </button>
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
                        <div className="max-w-4xl mx-auto space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
                                เปรียบเทียบ <span className="text-slate-400">ค้นหาทั่วไป</span> vs <span className="text-emerald-400">เปลี่ยนชื่อมงคล Pro</span>
                            </h2>

                            {/* Mobile View: Beautiful comparison card stack */}
                            <div className="block md:hidden space-y-4">
                                {[
                                    { feature: 'คัดกรองอักษรกาลกิณี', free: true, pro: true },
                                    { feature: 'เลือกอักษรนำ (วรรคเดช/ศรี)', free: false, pro: true },
                                    { feature: 'เกรดของผลรวมเลขศาสตร์', free: 'คละเกรด', pro: 'เกรด A+ เท่านั้น', highlightPro: true },
                                    { feature: 'จำนวนชื่อในฐานข้อมูล', free: '5,000+', pro: `${allNames.length.toLocaleString()} (คัดพิเศษ)`, highlightPro: true },
                                    { feature: 'กรองตามเพศ', free: false, pro: true },
                                    { feature: 'คุณภาพความหมาย', free: 'ปานกลาง', pro: 'คัดสรรพิเศษ', highlightPro: true },
                                ].map((row, i) => (
                                    <div key={i} className="bg-[#0f172a]/60 border border-white/5 rounded-2xl p-4.5 space-y-3.5 shadow-lg">
                                        <h4 className="text-sm font-bold text-[#f8fafc]">{row.feature}</h4>
                                        <div className="grid grid-cols-2 gap-3 text-center">
                                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col justify-center min-h-[64px]">
                                                <span className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 font-medium">ทั่วไป</span>
                                                {typeof row.free === 'boolean' ? (
                                                    row.free ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-semibold leading-tight">{row.free}</span>
                                                )}
                                            </div>
                                            <div className={`rounded-xl p-3 border flex flex-col justify-center min-h-[64px] ${row.highlightPro ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                                                <span className="block text-[9px] text-emerald-400 uppercase tracking-widest mb-1.5 font-extrabold">Pro</span>
                                                {typeof row.pro === 'boolean' ? (
                                                    row.pro ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                                                ) : (
                                                    <span className="text-xs text-emerald-300 font-extrabold leading-tight">{row.pro}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View: Interactive Table */}
                            <div className="hidden md:block overflow-x-auto bg-slate-950/20 rounded-3xl border border-white/10 shadow-2xl">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-slate-900/40">
                                            <th className="text-left py-5 px-6 text-slate-400 font-bold uppercase tracking-wider text-sm">คุณสมบัติ</th>
                                            <th className="text-center py-5 px-6 text-slate-400 font-bold uppercase tracking-wider text-sm">ค้นหาทั่วไป</th>
                                            <th className="text-center py-5 px-6 text-emerald-400 font-extrabold uppercase tracking-wider text-sm">เปลี่ยนชื่อมงคล Pro</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-4.5 px-6 text-slate-300 font-medium">คัดกรองอักษรกาลกิณี</td>
                                            <td className="text-center py-4.5 px-6"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                            <td className="text-center py-4.5 px-6"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-4.5 px-6 text-slate-300 font-medium">เลือกอักษรนำ (วรรคเดช/ศรี)</td>
                                            <td className="text-center py-4.5 px-6"><XCircle className="w-5 h-5 text-slate-600 mx-auto" /></td>
                                            <td className="text-center py-4.5 px-6"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-4.5 px-6 text-slate-300 font-medium">เกรดของผลรวมเลขศาสตร์</td>
                                            <td className="text-center py-4.5 px-6 text-slate-400">คละเกรด</td>
                                            <td className="text-center py-4.5 px-6 text-emerald-400 font-extrabold">เกรด A+ เท่านั้น</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-4.5 px-6 text-slate-300 font-medium">จำนวนชื่อในฐานข้อมูล</td>
                                            <td className="text-center py-4.5 px-6 text-slate-400">5,000+</td>
                                            <td className="text-center py-4.5 px-6 text-emerald-400 font-extrabold">{allNames.length.toLocaleString()} (คัดพิเศษ)</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-4.5 px-6 text-slate-300 font-medium">กรองตามเพศ</td>
                                            <td className="text-center py-4.5 px-6"><XCircle className="w-5 h-5 text-slate-600 mx-auto" /></td>
                                            <td className="text-center py-4.5 px-6"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-4.5 px-6 text-slate-300 font-medium">คุณภาพความหมาย</td>
                                            <td className="text-center py-4.5 px-6 text-slate-400">ปานกลาง</td>
                                            <td className="text-center py-4.5 px-6 text-emerald-400 font-extrabold">คัดสรรพิเศษ</td>
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

                        {/* FAQ Section - Rendered as a Dynamic Smooth Sliding Accordion */}
                        <div className="max-w-3xl mx-auto space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#f8fafc] flex items-center justify-center gap-3">
                                <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 animate-pulse" />
                                คำถามที่พบบ่อย
                            </h2>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: 'เปลี่ยนชื่อมงคล Pro ต่างจากค้นหาทั่วไปอย่างไร?',
                                        a: 'ระบบเปลี่ยนชื่อมงคล Pro ใช้ Premium Database ที่ผ่านการคัดกรอง 3 ชั้น: 1) คัดตามหลักทักษา ไม่มีอักษรกาลกิณี 2) คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ 3) ความหมายดี ไพเราะ ทันสมัย และสามารถเลือกอักษรนำวรรคเดช/ศรี ได้'
                                    },
                                    {
                                        q: 'วรรคเดชและวรรคศรีคืออะไร?',
                                        a: 'วรรคเดช คืออักษรนำที่ส่งเสริมเรื่องอำนาจบารมี การเลื่อนขั้นเลื่อนตำแหน่ง เหมาะกับผู้ต้องการความก้าวหน้าในหน้าที่การงาน ส่วน วรรคศรี คืออักษรนำที่ส่งเสริมเรื่องโชคลาภ เสน่ห์ความรัก เหมาะกับผู้ต้องการดึงดูดความโชคดีและเสน่ห์'
                                    },
                                    {
                                        q: 'เปลี่ยนชื่อมงคล Pro ใช้กี่เครดิต?',
                                        a: 'การปลดล็อกชื่อใช้ 15 เครดิตต่อการปลดล็อก 1 ครั้ง (สูงสุด 20 รายชื่อ) ในแต่ละหมวดอักษรที่คุณประสงค์จะเปิดใช้งาน'
                                    }
                                ].map((faq, index) => {
                                    const isOpen = openFaqIndex === index;
                                    return (
                                        <div key={index} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                                            <button
                                                type="button"
                                                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                                className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-200 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none"
                                            >
                                                <span className="text-sm sm:text-base md:text-lg flex items-start gap-2.5">
                                                    <span className="text-emerald-400 shrink-0">Q:</span>
                                                    <span className="leading-snug">{faq.q}</span>
                                                </span>
                                                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                                            </button>
                                            <div
                                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                    isOpen ? 'max-h-[500px] border-t border-white/5 bg-[#0a0f1d]/40' : 'max-h-0'
                                                }`}
                                            >
                                                <div className="p-5 sm:p-6 text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed flex items-start gap-2.5">
                                                    <span className="text-amber-400 font-extrabold shrink-0">A:</span>
                                                    <span>{faq.a}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </section>
                    {/* ==================== END SEO CONTENT SECTION ==================== */}
                </div>
            </main>
        </div>
    );
}
