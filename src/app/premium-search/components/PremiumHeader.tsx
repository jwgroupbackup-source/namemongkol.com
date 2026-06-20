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

export default function PremiumHeader({ totalNames, filteredCount, availableLettersCount, credits }: PremiumHeaderProps) {
    const { t } = useLanguage();

    const stats = [
        { label: 'ชื่อคัดพิเศษ', value: totalNames.toLocaleString(), icon: BadgeCheck },
        { label: 'ตรงเงื่อนไข', value: filteredCount.toLocaleString(), icon: Search },
        { label: 'หมวดอักษร', value: availableLettersCount.toLocaleString(), icon: Type },
        { label: 'เครดิตคงเหลือ', value: credits !== null ? credits.toLocaleString() : '—', icon: Coins },
    ];

    return (
        <header className="relative z-10 space-y-4 text-center xl:grid xl:grid-cols-[1.2fr_1fr] xl:items-end xl:gap-8 xl:space-y-0 xl:text-left">
            <div className="xl:col-start-1 xl:row-start-2">
                <h1 className="text-[2rem] font-black leading-tight tracking-tight text-[#1a1a3e] drop-shadow-sm sm:text-4xl md:text-5xl lg:text-6xl">
                    {t('pages.premiumSearch.headerTitle')}
                </h1>
            </div>
            
            <div className="mx-auto max-w-[70ch] space-y-3 xl:col-start-1 xl:row-start-3 xl:mx-0">
                <p className="text-sm leading-relaxed text-[#5a5a82] sm:text-base lg:text-lg">
                    {t('pages.premiumSearch.headerDesc').replace('{count}', totalNames.toLocaleString())}
                </p>
                <p className="text-sm font-medium tracking-wide text-amber-600 sm:text-base lg:text-lg">
                    {t('pages.premiumSearch.headerSub')}
                </p>

                <div className="mx-auto mt-3 w-fit rounded-xl border border-[#1e293b] bg-[#0f172a] px-3 py-2 shadow-md md:rounded-2xl md:px-6 md:py-4">
                    <p className="text-slate-300 font-medium text-xs sm:text-sm">
                        {t('pages.premiumSearch.headerHint')}{' '}
                        <Link href="/" className="font-bold text-amber-400 hover:text-amber-300 underline decoration-amber-400/30 hover:decoration-amber-400 transition-all">
                            {t('sidebar.analyzeName')}
                        </Link>
                    </p>
                </div>
            </div>

            {/* Premium Floating Stats Cards */}
            <div className="mx-auto grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2 sm:gap-3 xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:w-full">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div 
                        key={label} 
                        className={`group relative overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0f172a] p-2.5 sm:p-5 text-center xl:text-left shadow-md transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-500/30`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col xl:flex-row items-center xl:items-start gap-1 sm:gap-2 xl:gap-4">
                            <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-amber-400/10 flex items-center justify-center shrink-0 border border-amber-400/20">
                                <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400" />
                            </div>
                            <div>
                                <div className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">{label}</div>
                                <div className="text-base sm:text-xl lg:text-2xl font-bold text-white drop-shadow-md">{value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </header>
    );
}
