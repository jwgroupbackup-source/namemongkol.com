'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Languages, Target, Zap } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

type HeroBannerProps = {
    headingLevel?: 'h1' | 'h2';
};

export const HeroBanner = ({ headingLevel = 'h1' }: HeroBannerProps) => {
    const { t } = useLanguage();
    const HeadingTag = headingLevel;

    return (
        <section className="relative w-full">
            <div className="pointer-events-none absolute -left-10 top-6 hidden h-72 w-72 rounded-full border border-amber-200/10 lg:block" />
            <div className="pointer-events-none absolute -left-2 top-16 hidden h-52 w-52 rounded-full border border-amber-200/10 lg:block" />
            <div className="pointer-events-none absolute left-24 top-40 hidden h-px w-56 rotate-[-16deg] bg-gradient-to-r from-transparent via-amber-200/20 to-transparent lg:block" />

            <div className="relative overflow-hidden rounded-[1.25rem] border border-amber-200/10 bg-[#070a15]/35 px-4 py-5 shadow-[0_24px_80px_rgba(1,4,15,0.28)] backdrop-blur-sm sm:rounded-[1.75rem] sm:px-7 sm:py-8 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(215,177,106,0.12),transparent_54%)] lg:hidden" />

                <div className="relative z-10 text-left">
                    <div className="mb-4 inline-flex max-w-full items-center gap-1.5 overflow-hidden rounded-full border border-amber-200/20 bg-black/25 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-amber-50/90 backdrop-blur-md shadow-[0_0_18px_rgba(245,158,11,0.08)] sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.14em]">
                        <span>{t('home.hero.badgeThai')}</span>
                        <span className="text-amber-500/50">•</span>
                        <span>{t('home.hero.badgeEnglish')}</span>
                        <span className="text-amber-500/50">✦</span>
                        <span>{t('home.hero.badgeSupport')}</span>
                    </div>

                    <HeadingTag className="cosmic-text-crisp mb-4 text-[2.15rem] font-bold leading-[1.08] tracking-normal sm:text-5xl lg:text-[4.45rem]">
                        {t('home.hero.titlePrefix')}
                        <span className="text-amber-300 drop-shadow-[0_0_18px_rgba(245,158,11,0.28)]">{t('home.hero.titleHighlight')}</span>
                        {t('home.hero.titleFree') ? <span className="text-amber-300"> {t('home.hero.titleFree')}</span> : <span className="text-amber-300">:</span>}{' '}
                        <span className="text-amber-100">{t('home.hero.titleSuffix')}</span>
                    </HeadingTag>

                    <p className="cosmic-text-soft mb-5 max-w-[58ch] text-sm leading-7 sm:text-base sm:leading-8 lg:text-lg">
                        {t('home.hero.description')}
                    </p>

                    <div className="mb-5 grid gap-2 text-sm text-slate-200 sm:grid-cols-3 lg:max-w-xl">
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/5 px-3 py-2">
                            <Target className="h-4 w-4 shrink-0 text-emerald-300" />
                            <span><strong className="text-white">99%</strong> {t('home.hero.statAccuracy')}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-amber-300/15 bg-amber-300/5 px-3 py-2">
                            <Zap className="h-4 w-4 shrink-0 text-amber-300" />
                            <span><strong className="text-white">AI</strong> {t('home.hero.statSpeed')}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-sky-300/15 bg-sky-300/5 px-3 py-2">
                            <Languages className="h-4 w-4 shrink-0 text-sky-200" />
                            <span>{t('home.hero.badgeSupport')}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                        <Link
                            href="/phone-analysis"
                            data-track="home.hero.secondary.phone"
                            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-cyan-100 transition-colors hover:bg-cyan-300/15"
                        >
                            เช็กเบอร์มงคลฟรี <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                            href="/aura-analysis"
                            data-track="home.hero.secondary.aura"
                            className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1.5 text-purple-100 transition-colors hover:bg-purple-300/15"
                        >
                            วิเคราะห์ออร่า AI <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <p className="mt-5 flex items-center gap-2 text-xs font-medium tracking-wide text-emerald-200/90 sm:text-sm">
                        <BadgeCheck className="h-4 w-4 text-emerald-300" />
                        <span>{t('home.hero.instantAccess')}</span>
                    </p>
                </div>
            </div>
        </section>
    );
};
