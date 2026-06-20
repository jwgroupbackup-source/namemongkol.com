'use client';

import React from 'react';
import { Award, Calendar } from 'lucide-react';
import { PremiumNameData } from '@/utils/premiumDataParser';
import { useLanguage } from '@/components/LanguageProvider';

interface NameCardProps {
    item: PremiumNameData;
    isUnlocked: boolean;
}

const THAI_LEADING_VOWELS = new Set(['\u0E40', '\u0E41', '\u0E42', '\u0E43', '\u0E44']);

const getFirstConsonant = (name: string): string => {
    if (!name) return '';
    return THAI_LEADING_VOWELS.has(name.charAt(0)) ? name.charAt(1) : name.charAt(0);
};

export default function PremiumNameCard({ item, isUnlocked }: NameCardProps) {
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
        <div className="group relative overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0f172a] p-3.5 sm:p-6 shadow-md transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl">
            {/* Inner Highlight for Premium Feel */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Giant Background Letter */}
            <div className="pointer-events-none absolute -right-4 -top-6 text-8xl sm:text-9xl font-black leading-none text-white/[0.03] transition-all duration-500 group-hover:text-amber-400/[0.05] group-hover:scale-110">
                {firstConsonant}
            </div>

            {/* Lock Overlay Blur */}
            {!isUnlocked && (
                <div className="absolute inset-0 z-10 bg-[#0f172a]/50 backdrop-blur-[6px] transition-all" />
            )}

            <div className="relative z-20 flex flex-col gap-3 sm:gap-4">
                <div className="flex items-start justify-between">
                    <h3 
                        className="text-lg sm:text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-amber-300 drop-shadow-md"
                        style={!isUnlocked ? { filter: 'blur(10px)', userSelect: 'none' } : {}}
                    >
                        {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-amber-400 shadow-inner">
                        <Award size={12} className="sm:w-3.5 sm:h-3.5 w-3 h-3" />
                        <span>{item.totalScore}</span>
                    </div>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                    {/* Suitable Days */}
                    <div className="flex items-start gap-1.5 sm:gap-2 rounded-xl border border-[#1e293b] bg-slate-900/50 p-2 sm:p-2.5">
                        <Calendar size={14} className="mt-0.5 sm:w-4 sm:h-4 w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {item.suitableDays.map((day: string, i: number) => (
                                <span key={i} className="rounded border border-white/5 bg-white/5 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] font-medium text-slate-300">
                                    {getDayLabel(day)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="pt-2 border-t border-white/10">
                        <p className="mb-1.5 sm:mb-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">พลังเลขคู่</p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {item.scoreBreakdown.map((score: string, i: number) => (
                                <span key={i} className="rounded-md border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 sm:px-2 sm:py-1 font-mono text-[10px] sm:text-[11px] font-semibold text-amber-200 transition-colors group-hover:border-amber-400/40 group-hover:bg-amber-400/20">
                                    {score}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
