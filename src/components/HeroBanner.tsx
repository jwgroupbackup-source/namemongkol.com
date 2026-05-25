'use client';

import React from 'react';
import { Target, Zap } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

type HeroBannerProps = {
    headingLevel?: 'h1' | 'h2';
};

export const HeroBanner = ({ headingLevel = 'h1' }: HeroBannerProps) => {
    const { t } = useLanguage();
    const HeadingTag = headingLevel;

    return (
        <div className="relative mb-2.5 sm:mb-6">
            <div className="relative rounded-[1.25rem] sm:rounded-[1.75rem] p-3.5 sm:p-7 overflow-hidden border border-amber-500/20 bg-gradient-to-b from-[#161326]/95 to-[#090812]/95 shadow-[0_12px_40px_rgba(150,100,220,0.15)] backdrop-blur-xl group">

                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(150,100,250,0.15),transparent_60%)] pointer-events-none" />
                <div className="absolute inset-y-0 right-[-5%] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(255,211,128,0.14)_0%,rgba(93,63,168,0.10)_42%,transparent_72%)] blur-3xl" />
                <div className="absolute inset-y-0 left-[-5%] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(104,67,177,0.14)_0%,transparent_70%)] blur-3xl" />

                <div className="text-center z-10 relative">
                    <div className="mb-2.5 sm:mb-4 inline-flex max-w-full items-center gap-1.5 sm:gap-2 overflow-hidden rounded-full border border-amber-200/20 bg-black/25 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.08em] sm:tracking-[0.15em] text-amber-50/90 backdrop-blur-md shadow-[0_0_18px_rgba(245,158,11,0.08)]">
                        <span>{t('home.hero.badgeThai')}</span>
                        <span className="text-amber-500/50">·</span>
                        <span>{t('home.hero.badgeEnglish')}</span>
                        <span className="text-amber-500/50">✦</span>
                        <span>{t('home.hero.badgeSupport')}</span>
                    </div>

                    <HeadingTag className="cosmic-text-crisp text-[1.7rem] sm:text-4xl md:text-5xl font-bold leading-tight mb-2.5 sm:mb-4 tracking-tight">
                        {t('home.hero.titlePrefix')}<span className="text-amber-400 drop-shadow-[0_0_18px_rgba(245,158,11,0.30)]">{t('home.hero.titleHighlight')}</span>{t('home.hero.titleFree') ? <span className="text-amber-400"> {t('home.hero.titleFree')}</span> : <span className="text-amber-400">:</span>}{' '}
                        <span className="text-amber-300 drop-shadow-[0_0_16px_rgba(253,224,71,0.28)]">{t('home.hero.titleSuffix')}</span>
                    </HeadingTag>

                    <p className="cosmic-text-soft max-w-[65ch] mx-auto text-xs sm:text-base leading-relaxed mb-3 sm:mb-6 px-1 sm:px-4">
                        {t('home.hero.description')}
                    </p>

                    {/* Stats inline */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-br from-[#1a2333]/90 to-[#0f1725]/90 border border-emerald-500/20 shadow-inner">
                            <Target className="w-4 h-4 text-emerald-400 filter drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
                            <span className="text-sm sm:text-base font-bold text-white">99%</span>
                            <span className="text-[10px] sm:text-xs uppercase tracking-wide text-emerald-200/70">{t('home.hero.statAccuracy')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-br from-[#1a2333]/90 to-[#0f1725]/90 border border-amber-500/20 shadow-inner">
                            <Zap className="w-4 h-4 text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
                            <span className="text-sm sm:text-base font-bold text-white">AI</span>
                            <span className="text-[10px] sm:text-xs uppercase tracking-wide text-amber-200/70">{t('home.hero.statSpeed')}</span>
                        </div>
                    </div>

                    <p className="mt-3 sm:mt-5 text-xs sm:text-sm text-emerald-300/80 font-medium tracking-wide">
                        {t('home.hero.instantAccess')}
                    </p>
                </div>

            </div>
        </div>
    );
};
