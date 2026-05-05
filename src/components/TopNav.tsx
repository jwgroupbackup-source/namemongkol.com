'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, Info, User as UserIcon, LogOut, Sparkles, Zap, BookOpen, Crown } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from './LanguageProvider';

type MemberTier = 'free' | 'pro' | 'vvip';

const normalizeTier = (tier?: string | null): MemberTier => {
    const normalized = (tier || '').toLowerCase();
    if (normalized === 'pro' || normalized === 'vvip') return normalized;
    return 'free';
};

const getTierBadgeStyles = (tier: MemberTier) => {
    if (tier === 'vvip') {
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    }
    if (tier === 'pro') {
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
    }
    return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
};

export const TopNav = () => {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [role, setRole] = useState<string | null>(null);
    const [memberTier, setMemberTier] = useState<MemberTier>('free');
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const menuRef = React.useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const fetchUserInfo = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('credits, role, tier, welcome_credits, welcome_credits_granted_at')
            .eq('id', userId)
            .maybeSingle();

        if (data) {
            let totalCredits = data.credits ?? 0;

            // เพิ่ม welcome_credits ถ้ายังไม่หมดอายุ (30 วัน)
            if (data.welcome_credits && data.welcome_credits > 0 && data.welcome_credits_granted_at) {
                const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
                const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                if (Date.now() < grantedAt + thirtyDays) {
                    totalCredits += data.welcome_credits;
                }
            }

            setCredits(totalCredits);
            setRole(data.role);
            setMemberTier(normalizeTier(data.tier));
        } else {
            if (error) console.error('Error fetching user info:', error);
            setCredits(0);
            setRole(null);
            setMemberTier('free');
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                fetchUserInfo(user.id);
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserInfo(session.user.id);
            } else {
                setCredits(null);
                setRole(null);
                setMemberTier('free');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleCreditUpdate = () => {
            if (user) fetchUserInfo(user.id);
        };

        window.addEventListener('force_credits_update', handleCreditUpdate);
        return () => {
            window.removeEventListener('force_credits_update', handleCreditUpdate);
        };
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setIsOpen(false);
    };

    // Only show on desktop (hidden on mobile/tablet)
    // Adjust breakpoint to match Sidebar (lg)
    // Hide on Auth pages to prevent overlap
    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <div className="hidden lg:flex fixed top-4 right-6 z-50 items-center gap-6">
            <Link
                href="/articles"
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm backdrop-blur-md border ${pathname === '/articles'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-100/50 text-slate-600 border-slate-200 hover:bg-slate-200/50 hover:text-slate-900 hover:border-slate-300 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/20'
                    }`}
            >
                <BookOpen size={16} />
                <span>{t('nav.articles')}</span>
            </Link>

            <Link
                href="/about"
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm backdrop-blur-md border ${pathname === '/about'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-100/50 text-slate-600 border-slate-200 hover:bg-slate-200/50 hover:text-slate-900 hover:border-slate-300 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/20'
                    }`}
            >
                <Info size={16} />
                <span>{t('nav.about')}</span>
            </Link>

            {user ? (
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-slate-100/50 border border-slate-200 hover:bg-slate-200/50 hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20 transition-all duration-300 backdrop-blur-md group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 ring-2 ring-white/5 group-hover:scale-105 transition-transform">
                            <UserIcon size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-1 max-w-[120px]">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors max-w-[84px] truncate">
                                    {user.user_metadata?.name || user.email?.split('@')[0]}
                                </span>
                                <span className={`px-1.5 py-[1px] rounded-md text-[9px] font-black uppercase leading-none flex items-center gap-0.5 ${getTierBadgeStyles(memberTier)}`}>
                                    {memberTier === 'vvip' && <Crown size={9} className="shrink-0" />}
                                    {memberTier}
                                </span>
                            </div>
                            {credits !== null && (
                                <span className="text-[10px] text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
                                    <Sparkles size={10} /> {credits} {t('nav.credits', 'Credits')}
                                </span>
                            )}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 dark:bg-[#0f172a]/95 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-3 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                                <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t('general.creditBalance', 'Credit Balance')}</span>
                                </div>
                                <div className="flex items-center justify-between bg-white dark:bg-black/40 rounded-xl p-2 border border-slate-200 dark:border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-amber-400 font-bold px-1">
                                        <Sparkles size={14} />
                                        <span>{credits ?? 0}</span>
                                    </div>
                                    <Link
                                        href="/topup"
                                        onClick={() => setIsOpen(false)}
                                        className="text-[10px] text-emerald-950 hover:text-emerald-900 font-bold bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
                                    >
                                                <Zap size={12} fill="currentColor" /> {t('nav.topup')}
                                    </Link>
                                </div>
                            </div>

                            <div className="p-1.5">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm font-medium"
                                >
                                    <LogOut size={16} />
                                            {t('nav.logout')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Link
                    href="/login"
                    className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm backdrop-blur-md border ${pathname === '/login'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-transparent hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:-translate-y-0.5'
                        }`}
                >
                    <LogIn size={16} />
                            <span>{t('nav.login')}</span>
                </Link>
            )}

			<LanguageToggle />
        </div>
    );
};
