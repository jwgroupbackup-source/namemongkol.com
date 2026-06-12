'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, BarChart3, Languages, Star, Target, Zap } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

type HeroBannerProps = {
    headingLevel?: 'h1' | 'h2';
};

type ProofAvatar = {
    bg: string;
    skin: string;
    hair: string;
    shirt: string;
    style: 'short' | 'long' | 'bob' | 'wave';
};

const proofAvatars: ProofAvatar[] = [
    { bg: '#f7d9a6', skin: '#d9a06f', hair: '#3b2418', shirt: '#d8a136', style: 'short' },
    { bg: '#d5ecff', skin: '#f1c49d', hair: '#5b3b2a', shirt: '#4d9fc5', style: 'long' },
    { bg: '#f8d8dd', skin: '#e9b084', hair: '#2f2326', shirt: '#d55d74', style: 'bob' },
    { bg: '#e4dacb', skin: '#c98b64', hair: '#201817', shirt: '#8fa06a', style: 'wave' },
];

const AvatarPortrait = ({ avatar, index }: { avatar: ProofAvatar; index: number }) => {
    const clipId = `hero-avatar-clip-${index}`;

    return (
        <span className="relative h-7 w-7 overflow-hidden rounded-full border border-amber-100/75 bg-slate-950 shadow-[0_0_0_1px_rgba(8,12,24,0.95),0_5px_14px_rgba(0,0,0,0.38)]">
            <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
                <defs>
                    <clipPath id={clipId}>
                        <circle cx="20" cy="20" r="20" />
                    </clipPath>
                    <radialGradient id={`hero-avatar-light-${index}`} cx="32%" cy="22%" r="72%">
                        <stop offset="0%" stopColor="#fff7df" stopOpacity="0.92" />
                        <stop offset="42%" stopColor={avatar.bg} />
                        <stop offset="100%" stopColor="#172033" />
                    </radialGradient>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                    <rect width="40" height="40" fill={`url(#hero-avatar-light-${index})`} />
                    <ellipse cx="20" cy="39" rx="15.5" ry="10.5" fill={avatar.shirt} />
                    <path d="M12.2 39c2.1-7.1 5.1-10.4 7.8-10.4S25.8 31.9 28 39H12.2Z" fill="#f6d7bf" opacity="0.52" />
                    <path d="M16.4 28.2h7.2v5.6c-1.9 1.1-4.9 1.1-7.2 0v-5.6Z" fill={avatar.skin} />
                    <path d="M16.4 28.2h7.2v2.5c-1.7.8-4.8.8-7.2-.1v-2.4Z" fill="#8c5a46" opacity="0.18" />
                    {avatar.style === 'long' && (
                        <path d="M9.5 17.5C9.5 8.5 15 4 21 4s10.5 5 10.5 14.5c0 7-2.5 13-5.5 15.5H14.5c-3.2-3-5-8.8-5-16.5Z" fill={avatar.hair} />
                    )}
                    {avatar.style === 'bob' && (
                        <path d="M9.5 18C9.5 9.3 14.8 4.8 20.2 4.8S30.5 9.4 30.5 18c0 5.5-2 9.5-4 11.8h-13C11.6 27.4 9.5 23.5 9.5 18Z" fill={avatar.hair} />
                    )}
                    {avatar.style === 'wave' && (
                        <path d="M9 19.5c0-9.2 5.7-15 12-15 6.8 0 11 5.6 10 14.5-.3 3.2-1.8 6.8-4.6 9.2-1.7-4.2-3.8-7.5-8-9.3-3.5-1.4-6.2-.8-9.4.6Z" fill={avatar.hair} />
                    )}
                    <ellipse cx="11.4" cy="19.6" rx="2.1" ry="3.1" fill={avatar.skin} />
                    <ellipse cx="28.6" cy="19.6" rx="2.1" ry="3.1" fill={avatar.skin} />
                    <path d="M11.4 20.4c.8.2 1.4-.1 1.8-.8M28.6 20.4c-.8.2-1.4-.1-1.8-.8" stroke="#8c5a46" strokeWidth="0.55" strokeLinecap="round" opacity="0.42" />
                    <ellipse cx="20" cy="18.4" rx="9" ry="10.6" fill={avatar.skin} />
                    <path d="M13.6 16.9c1.4-1 3.4-1.1 4.8-.2M21.7 16.7c1.4-.9 3.5-.8 4.8.2" stroke="#2a1c18" strokeWidth="0.7" strokeLinecap="round" opacity="0.58" />
                    {avatar.style === 'short' && (
                        <path d="M10.7 16.8C11.4 9 15.8 4.8 21.8 5.2c4.6.3 8 3.6 8.5 9.2-4.8.1-8.8-1.5-12.2-4.4-1.8 2.8-4.2 4.8-7.4 6.8Z" fill={avatar.hair} />
                    )}
                    {avatar.style === 'long' && (
                        <path d="M11.8 15.7c1.8-6.1 5.6-8.4 10.4-7.7 3.4.5 5.8 3 6.8 7.4-4.4.5-7.9-.9-10.7-3.2-1.8 2.2-3.8 3.2-6.5 3.5Z" fill={avatar.hair} />
                    )}
                    {avatar.style === 'bob' && (
                        <path d="M11 16.8c.9-7 5-9.7 10-9.3 4.8.3 7.5 3.4 8.1 9.6-5.2-1.3-8.2-3-10.6-5.5-1.5 2.3-3.7 4-7.5 5.2Z" fill={avatar.hair} />
                    )}
                    {avatar.style === 'wave' && (
                        <path d="M10.8 16.1c.4-5.8 4.7-9.3 10-9.3 4.9 0 7.9 3.2 8.5 8.4-5.4.5-8.7-1.6-11.9-4-1.1 2.2-3.1 3.8-6.6 4.9Z" fill={avatar.hair} />
                    )}
                    <ellipse cx="16.6" cy="19.1" rx="1.05" ry="1.28" fill="#201817" opacity="0.82" />
                    <ellipse cx="23.4" cy="19.1" rx="1.05" ry="1.28" fill="#201817" opacity="0.82" />
                    <circle cx="16.25" cy="18.65" r="0.28" fill="#fff8e9" opacity="0.82" />
                    <circle cx="23.05" cy="18.65" r="0.28" fill="#fff8e9" opacity="0.82" />
                    <path d="M19.6 19.8c-.5 2-.6 3.4-.2 4.1.3.4 1 .5 1.7.2" stroke="#8f5b45" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity="0.58" />
                    <path d="M17 25.4c1.9 1.3 4.2 1.3 6 0" stroke="#7f3d36" strokeWidth="0.95" strokeLinecap="round" fill="none" opacity="0.76" />
                    <circle cx="14.2" cy="22.4" r="1.6" fill="#f5a0a0" opacity="0.18" />
                    <circle cx="25.8" cy="22.4" r="1.6" fill="#f5a0a0" opacity="0.18" />
                    <path d="M14.1 34.7c3.4 1.4 8.6 1.4 12 0" stroke="#fff8e9" strokeWidth="0.9" strokeLinecap="round" opacity="0.28" />
                    <circle cx="13" cy="11" r="9" fill="#fff8e9" opacity="0.16" />
                </g>
            </svg>
            <span className="sr-only">สมาชิกตัวอย่าง {index + 1}</span>
        </span>
    );
};

type LiveStatsResponse = {
    success?: boolean;
    totals?: {
        analyses?: number;
        members?: number;
    };
    stats?: {
        totalAnalyses?: number;
        totalUsers?: number;
    };
};

const STATS_POLL_MS = 30_000;

const formatRealtimeCount = (value?: number) => {
    if (typeof value !== 'number' || value <= 0) {
        return null;
    }

    return value.toLocaleString('th-TH');
};

const HeroSocialProof = () => {
    const [analysisCount, setAnalysisCount] = React.useState('...');
    const [memberCount, setMemberCount] = React.useState('...');

    React.useEffect(() => {
        let isMounted = true;

        const loadStats = async () => {
            try {
                const response = await fetch('/api/live-stats', { cache: 'no-store' });
                if (!response.ok) {
                    return;
                }

                const data = await response.json() as LiveStatsResponse;
                const totalAnalyses = data.totals?.analyses ?? data.stats?.totalAnalyses;
                const totalUsers = data.totals?.members ?? data.stats?.totalUsers;
                const nextAnalysisCount = formatRealtimeCount(totalAnalyses);
                const nextMemberCount = formatRealtimeCount(totalUsers);

                if (!isMounted) {
                    return;
                }

                if (nextAnalysisCount) {
                    setAnalysisCount(nextAnalysisCount);
                }

                if (nextMemberCount) {
                    setMemberCount(nextMemberCount);
                }
            } catch {
                // Keep the public proof readable even if stats are unavailable.
            }
        };

        loadStats();
        const interval = window.setInterval(loadStats, STATS_POLL_MS);

        return () => {
            isMounted = false;
            window.clearInterval(interval);
        };
    }, []);

    return (
        <div className="mt-4 hidden flex-col gap-3 rounded-2xl border border-amber-200/15 bg-black/30 px-4 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md sm:flex sm:flex-row sm:items-center sm:justify-between lg:max-w-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5">
                        {proofAvatars.map((avatar, index) => (
                            <AvatarPortrait key={`${avatar.style}-${avatar.shirt}`} avatar={avatar} index={index} />
                        ))}
                    </div>
                    <p className="text-xs font-semibold leading-snug text-amber-50/90 sm:text-sm">
                        สมาชิก <span className="text-amber-300">{memberCount}</span> คน เชื่อมั่นในผลลัพธ์
                    </p>
                </div>

                <span className="hidden h-4 w-px bg-amber-100/15 sm:block" />
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-50/85 sm:text-sm">
                    <BarChart3 className="h-3.5 w-3.5 text-amber-300" />
                    <span className="text-amber-300">{analysisCount}</span>
                    ครั้งที่วิเคราะห์แล้ว
                </span>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap text-xs text-amber-100/90">
                <span className="font-bold text-amber-200">(5/5)</span>
                <span className="flex items-center gap-0.5 text-amber-300" aria-label="5 จาก 5 ดาว">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                </span>
                <span className="text-amber-50/60">จาก 13 รีวิว</span>
            </div>
        </div>
    );
};

export const HeroBanner = ({ headingLevel = 'h1' }: HeroBannerProps) => {
    const { t } = useLanguage();
    const HeadingTag = headingLevel;

    return (
        <section className="relative w-full">
            <div className="pointer-events-none absolute -left-10 top-6 hidden h-72 w-72 rounded-full border border-amber-200/10 lg:block" />
            <div className="pointer-events-none absolute -left-2 top-16 hidden h-52 w-52 rounded-full border border-amber-200/10 lg:block" />
            <div className="pointer-events-none absolute left-24 top-40 hidden h-px w-56 rotate-[-16deg] bg-gradient-to-r from-transparent via-amber-200/20 to-transparent lg:block" />

            <div className="relative overflow-hidden rounded-[1.25rem] border border-amber-200/10 bg-[#070a15]/35 px-3 py-3 shadow-[0_24px_80px_rgba(1,4,15,0.28)] backdrop-blur-sm sm:rounded-[1.75rem] sm:px-7 sm:py-8 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(215,177,106,0.12),transparent_54%)] lg:hidden" />

                <div className="relative z-10 text-left">
                    <div className="mb-2 inline-flex max-w-full items-center gap-1.5 overflow-hidden rounded-full border border-amber-200/20 bg-black/25 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.06em] text-amber-50/90 shadow-[0_0_18px_rgba(245,158,11,0.08)] backdrop-blur-md sm:mb-4 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.14em]">
                        <span>{t('home.hero.badgeThai')}</span>
                        <span className="text-amber-500/50">•</span>
                        <span>{t('home.hero.badgeEnglish')}</span>
                        <span className="text-amber-500/50">✦</span>
                        <span>{t('home.hero.badgeSupport')}</span>
                    </div>

                    <HeadingTag className="cosmic-text-crisp mb-2 text-[1.62rem] font-bold leading-[1.08] tracking-normal sm:mb-4 sm:text-5xl lg:text-[4.45rem]">
                        {t('home.hero.titlePrefix')}
                        <span className="text-amber-300 drop-shadow-[0_0_18px_rgba(245,158,11,0.28)]">
                            {t('home.hero.titleHighlight')}
                        </span>
                        {t('home.hero.titleFree') ? (
                            <span className="text-amber-300"> {t('home.hero.titleFree')}</span>
                        ) : (
                            <span className="text-amber-300">:</span>
                        )}{' '}
                        <span className="text-amber-100">{t('home.hero.titleSuffix')}</span>
                    </HeadingTag>

                    <p className="cosmic-text-soft mb-3 max-w-[58ch] text-xs leading-5 sm:mb-5 sm:text-base sm:leading-8 lg:text-lg">
                        {t('home.hero.description')}
                    </p>

                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-slate-200 sm:mb-5 sm:grid-cols-3 sm:text-sm lg:max-w-xl">
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/5 px-3 py-2">
                            <Target className="h-4 w-4 shrink-0 text-emerald-300" />
                            <span>
                                <strong className="text-white">99%</strong> {t('home.hero.statAccuracy')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-amber-300/15 bg-amber-300/5 px-3 py-2">
                            <Zap className="h-4 w-4 shrink-0 text-amber-300" />
                            <span>
                                <strong className="text-white">{t('home.hero.statMethod')}</strong> {t('home.hero.statSpeed')}
                            </span>
                        </div>
                        <div className="hidden items-center gap-2 rounded-xl border border-sky-300/15 bg-sky-300/5 px-3 py-2 sm:flex">
                            <Languages className="h-4 w-4 shrink-0 text-sky-200" />
                            <span>{t('home.hero.badgeSupport')}</span>
                        </div>
                    </div>

                    <div className="hidden flex-wrap items-center gap-2 text-xs sm:flex sm:text-sm">
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
                            อ่านพลังออร่า <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <p className="mt-3 flex items-center gap-2 text-[11px] font-medium tracking-wide text-emerald-200/90 sm:mt-5 sm:text-sm">
                        <BadgeCheck className="h-4 w-4 text-emerald-300" />
                        <span>{t('home.hero.instantAccess')}</span>
                    </p>

                    <HeroSocialProof />
                </div>
            </div>
        </section>
    );
};
