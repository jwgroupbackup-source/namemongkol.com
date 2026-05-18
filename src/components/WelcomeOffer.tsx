'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { X, Gift, Sparkles } from 'lucide-react';

export const WelcomeOffer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        let timeoutId: number | null = null;
        let cancelled = false;

        const checkUser = async () => {
            if (sessionStorage.getItem('welcome_offer_dismissed') === 'true') return;

            const { data: { user } } = await supabase.auth.getUser();
            if (cancelled) return;

            if (user) {
                setIsLoggedIn(true);
            } else {
                // Show offer after a short delay for better UX
                timeoutId = window.setTimeout(() => {
                    setIsVisible(true);
                }, 3200);
            }
        };
        checkUser();

        return () => {
            cancelled = true;
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Optional: Save to local storage to not show again for this session
        sessionStorage.setItem('welcome_offer_dismissed', 'true');
    };

    if (isLoggedIn || !isVisible) return null;

    return (
        <div className="fixed bottom-24 left-3 right-3 md:left-auto md:right-8 md:bottom-8 z-[70] md:w-96 animate-fade-in-up">
            <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-[1px] shadow-2xl shadow-amber-500/30 overflow-hidden">
                {/* Glowing Border Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-50 animate-pulse"></div>

                <div className="relative bg-[#0f172a] rounded-2xl p-4 flex items-center gap-3 md:gap-4">
                    {/* Icon Box */}
                    <div className="shrink-0 relative hidden sm:block">
                        <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-lg animate-pulse"></div>
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-[-5deg] group-hover:rotate-0 transition-transform">
                            <Gift className="text-white w-6 h-6 animate-bounce" />
                        </div>
                    </div>
                    {/* Mobile simplified icon */}
                    <div className="shrink-0 sm:hidden">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Gift className="text-white w-5 h-5" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-base sm:text-lg text-white leading-tight">
                                รับฟรี <span className="text-amber-400">30 เครดิต!</span>
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-slate-500 hover:text-white transition-colors -mt-2 -mr-2 p-2"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <p className="text-slate-400 text-[10px] sm:text-xs mt-1 mb-2 leading-relaxed">
                            สมาชิกใหม่รับทันที! ใช้แลกชื่อมงคลได้เลย
                        </p>

                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm rounded-lg transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                        >
                            <Sparkles size={14} />
                            สมัครรับสิทธิ์เลย
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
