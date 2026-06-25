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
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white/90 p-3.5 shadow-[0_18px_42px_rgba(16,185,129,0.07)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_22px_52px_rgba(16,185,129,0.13)] sm:p-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-transparent to-amber-50/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="pointer-events-none absolute -right-4 -top-6 text-8xl font-black leading-none text-emerald-900/[0.04] transition-all duration-500 group-hover:scale-110 group-hover:text-amber-500/[0.08] sm:text-9xl">
                {firstConsonant}
            </div>

            {!isUnlocked && (
                <div className="absolute inset-0 z-10 bg-white/45 backdrop-blur-[6px] transition-all" />
            )}

            <div className="relative z-20 flex flex-col gap-3 sm:gap-4">
                <div className="flex items-start justify-between gap-3">
                    <h3
                        className="text-lg font-black tracking-tight text-[#1a1a3e] transition-colors group-hover:text-emerald-800 sm:text-2xl"
                        style={!isUnlocked ? { filter: 'blur(10px)', userSelect: 'none' } : {}}
                    >
                        {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 shadow-inner sm:px-2.5 sm:py-1 sm:text-xs">
                        <Award size={12} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>{item.totalScore}</span>
                    </div>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-start gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-2 sm:gap-2 sm:p-2.5">
                        <Calendar size={14} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 sm:h-4 sm:w-4" />
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {item.suitableDays.map((day: string, i: number) => (
                                <span key={i} className="rounded border border-emerald-100 bg-white/80 px-1.5 py-0.5 text-[9px] font-medium text-[#5a5a82] sm:px-2 sm:text-[11px]">
                                    {getDayLabel(day)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-emerald-100 pt-2">
                        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-[#5a5a82] sm:mb-2 sm:text-[10px]">พลังเลขคู่</p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {item.scoreBreakdown.map((score: string, i: number) => (
                                <span key={i} className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800 transition-colors group-hover:border-amber-300 group-hover:bg-amber-100/80 sm:px-2 sm:py-1 sm:text-[11px]">
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
