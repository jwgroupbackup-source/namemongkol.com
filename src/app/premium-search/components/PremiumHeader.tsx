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
        <header className="text-center space-y-4 xl:grid xl:grid-cols-[1.2fr_1fr] xl:items-end xl:gap-8 xl:space-y-0 xl:text-left relative z-10">
            <div className="xl:col-start-1 xl:row-start-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] tracking-tight leading-tight">
                    {t('pages.premiumSearch.headerTitle')}
                </h1>
            </div>
            
            <div className="max-w-[70ch] mx-auto space-y-4 xl:col-start-1 xl:row-start-3 xl:mx-0">
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base lg:text-lg">
                    {t('pages.premiumSearch.headerDesc').replace('{count}', totalNames.toLocaleString())}
                </p>
                <p className="text-amber-200/90 font-medium text-sm sm:text-base lg:text-lg tracking-wide">
                    {t('pages.premiumSearch.headerSub')}
                </p>

                <div className="mt-4 mx-auto w-fit bg-[#0f172a]/40 border border-amber-300/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-xl shadow-amber-950/20 backdrop-blur-md">
                    <p className="text-amber-100/80 font-medium text-xs sm:text-sm">
                        {t('pages.premiumSearch.headerHint')}{' '}
                        <Link href="/" className="font-bold text-amber-400 hover:text-amber-300 underline decoration-amber-400/30 hover:decoration-amber-400 transition-all">
                            {t('sidebar.analyzeName')}
                        </Link>
                    </p>
                </div>
            </div>

            {/* Premium Floating Stats Cards */}
            <div className="mx-auto grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2 sm:gap-3 xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:w-full">
                {stats.map(({ label, value, icon: Icon }, i) => (
                    <div 
                        key={label} 
                        className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-2.5 sm:p-5 text-center xl:text-left shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-900/20 hover:border-amber-400/20`}
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
