'use client';

import React from 'react';
import { BadgeCheck, Search, Type, Coins } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

interface PremiumHeaderProps {
    totalNames: number;
    filteredCount: number;
    availableLettersCount: number;
    credits: number | null;
}

type StatTone = 'mint' | 'gold' | 'lavender' | 'sky';

const toneClasses: Record<StatTone, string> = {
    mint: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-white text-emerald-700',
    gold: 'border-amber-200/80 bg-gradient-to-br from-amber-50 via-yellow-50/70 to-white text-amber-700',
    lavender: 'border-violet-200/80 bg-gradient-to-br from-violet-50 via-purple-50/70 to-white text-violet-700',
    sky: 'border-sky-200/80 bg-gradient-to-br from-sky-50 via-cyan-50/70 to-white text-sky-700',
};

export default function PremiumHeader({ totalNames, filteredCount, availableLettersCount, credits }: PremiumHeaderProps) {
    const { t } = useLanguage();

    const stats: Array<{ label: string; value: string; icon: React.ElementType; tone: StatTone }> = [
        { label: 'ชื่อคัดพิเศษ', value: totalNames.toLocaleString(), icon: BadgeCheck, tone: 'mint' },
        { label: 'ตรงเงื่อนไข', value: filteredCount.toLocaleString(), icon: Search, tone: 'gold' },
        { label: 'หมวดอักษร', value: availableLettersCount.toLocaleString(), icon: Type, tone: 'lavender' },
        { label: 'เครดิตคงเหลือ', value: credits !== null ? credits.toLocaleString() : '—', icon: Coins, tone: 'sky' },
    ];

    return (
        <header className="relative z-10 space-y-4 text-center xl:grid xl:grid-cols-[1.2fr_1fr] xl:items-end xl:gap-8 xl:space-y-0 xl:text-left">
            <div className="xl:col-start-1 xl:row-start-2">
                <h1 className="text-[2rem] font-black leading-tight tracking-tight text-[#1a1a3e] sm:text-4xl md:text-5xl lg:text-6xl">
                    {t('pages.premiumSearch.headerTitle')}
                </h1>
            </div>

            <div className="mx-auto max-w-[70ch] space-y-3 xl:col-start-1 xl:row-start-3 xl:mx-0">
                <p className="text-sm leading-relaxed text-[#5a5a82] sm:text-base lg:text-lg">
                    {t('pages.premiumSearch.headerDesc').replace('{count}', totalNames.toLocaleString())}
                </p>
                <p className="text-sm font-semibold tracking-wide text-emerald-700 sm:text-base lg:text-lg">
                    {t('pages.premiumSearch.headerSub')}
                </p>

                <div className="mx-auto mt-3 w-fit rounded-xl border border-emerald-200/80 bg-white/85 px-3 py-2 shadow-[0_14px_34px_rgba(16,185,129,0.08)] md:rounded-2xl md:px-6 md:py-4 xl:mx-0">
                    <p className="text-xs font-medium text-[#5a5a82] sm:text-sm">
                        {t('pages.premiumSearch.headerHint')}{' '}
                        <Link href="/" className="font-bold text-emerald-700 underline decoration-emerald-300/70 transition-all hover:text-emerald-600 hover:decoration-emerald-500">
                            {t('sidebar.analyzeName')}
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mx-auto grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:w-full xl:grid-cols-2">
                {stats.map(({ label, value, icon: Icon, tone }) => (
                    <div
                        key={label}
                        className={`group relative overflow-hidden rounded-2xl border p-2.5 text-center shadow-[0_18px_42px_rgba(15,23,42,0.06)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(16,185,129,0.12)] sm:p-5 xl:text-left ${toneClasses[tone]}`}
                    >
                        <div className="absolute inset-0 bg-white/35 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative z-10 flex flex-col items-center gap-1 sm:gap-2 xl:flex-row xl:items-start xl:gap-4">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/20 bg-white/70 sm:h-10 sm:w-10">
                                <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                            </div>
                            <div>
                                <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#5a5a82] sm:mb-1 sm:text-xs">{label}</div>
                                <div className="text-base font-black text-[#1a1a3e] sm:text-xl lg:text-2xl">{value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </header>
    );
}
