'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window === 'undefined') return false;
        return !localStorage.getItem('cookieConsent');
    });

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-x-0 bottom-[var(--mobile-bottom-nav-height)] z-[58] px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:bottom-0 md:px-4 md:pb-4 animate-in slide-in-from-bottom duration-500">
            <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-xl border border-white/10 bg-slate-950/94 p-3 shadow-2xl backdrop-blur-xl md:rounded-2xl md:p-4">

                <div className="hidden shrink-0 rounded-full bg-amber-500/10 p-2 md:block">
                    <Cookie className="h-5 w-5 text-amber-500" />
                </div>

                <div className="min-w-0 flex-1 text-left">
                    <p className="text-[11px] leading-relaxed text-slate-300 md:text-sm">
                        เว็บไซต์นี้ใช้คุกกี้เพื่อประสบการณ์ที่ดีที่สุด การใช้งานเว็บไซต์ถือว่าท่านยอมรับ <Link href="/privacy" className="text-amber-400 hover:underline font-medium">นโยบายความเป็นส่วนตัว</Link>
                    </p>
                </div>

                <div className="shrink-0">
                    <button
                        onClick={handleAccept}
                        className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-400 md:rounded-xl md:px-5 md:py-2.5 md:text-sm"
                    >
                        ยอมรับทั้งหมด
                    </button>
                </div>
            </div>
        </div>
    );
}
