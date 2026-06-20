'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Sparkles, UserPlus, LogIn, User as UserIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from './LanguageProvider';

interface MobileHeaderProps {
    onMenuClick: () => void;
    user: User | null;
}

export const MobileHeader = ({ onMenuClick, user }: MobileHeaderProps) => {
    const { t } = useLanguage();

    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-[68px] max-[400px]:h-[64px] backdrop-blur-xl flex items-center px-4 max-[400px]:px-3 justify-between transition-all duration-300" style={{ background: 'rgba(255,255,255,0.96)', borderBottom: '1px solid #ddddf0', boxShadow: '0 2px 16px rgba(26,26,62,0.06)' }}>
            {/* Left: Menu Button */}
            <div className="flex items-center gap-3 relative z-20">
                <button
                    onClick={onMenuClick}
                    className="p-2.5 max-[400px]:p-2 text-amber-500 hover:bg-amber-500/10 rounded-2xl max-[400px]:rounded-xl border border-amber-500/30 dark:border-amber-500/50 transition-all active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                    aria-label={t('nav.menu', 'Open Menu')}
                >
                    <Menu size={20} className="stroke-[2.5]" />
                </button>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-fit">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 max-[400px]:w-7 max-[400px]:h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/10 mr-1">
                        <Sparkles size={16} className="text-white drop-shadow-md" />
                    </div>
                    <div className="hidden min-[500px]:flex items-baseline tracking-tight">
                        <span className="text-base font-bold text-slate-800 font-sans mr-[1px]">Name</span>
                        <span className="text-base font-bold text-amber-500 font-sans">Mongkol</span>
                    </div>
                </Link>
            </div>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-1.5 max-[400px]:gap-1 relative z-20">
                <div className="mr-1 max-[400px]:mr-0 scale-90 max-[400px]:scale-90 min-[500px]:scale-100">
                    <LanguageToggle />
                </div>
                {!user ? (
                    <>
                        <Link
                            href="/register"
                            className="w-9 h-9 max-[400px]:w-8 max-[400px]:h-8 rounded-xl bg-amber-600 hover:bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-600/20 transition-all active:scale-95"
                            aria-label={t('auth.register')}
                        >
                            <UserPlus size={17} strokeWidth={2.5} />
                        </Link>
                        <Link
                            href="/login"
                            className="w-9 h-9 max-[400px]:w-8 max-[400px]:h-8 rounded-xl bg-amber-600 hover:bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-600/20 transition-all active:scale-95"
                            aria-label={t('nav.login')}
                        >
                            <LogIn size={17} strokeWidth={2.5} />
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={onMenuClick}
                        className="w-9 h-9 max-[400px]:w-8 max-[400px]:h-8 rounded-xl bg-slate-50 border border-[#ddddf0] flex items-center justify-center text-amber-500 hover:bg-[#eeebf8] hover:border-[#9b8ec4]/40 transition-all"
                        aria-label={t('nav.menu', 'Open user menu')}
                    >
                        <UserIcon size={17} />
                    </button>
                )}
            </div>
        </div>
    );
};
