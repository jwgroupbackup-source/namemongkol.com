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
        window.dispatchEvent(new Event('cookieConsentAccepted'));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-x-0 bottom-[var(--mobile-bottom-nav-height)] z-[58] px-2 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] md:bottom-0 md:px-4 md:pb-4 animate-in slide-in-from-bottom duration-500">
            <div className="mx-auto flex max-w-[23rem] items-center gap-2 rounded-lg border border-white/10 bg-slate-950/94 px-2 py-1.5 shadow-2xl backdrop-blur-xl md:max-w-3xl md:gap-3 md:rounded-2xl md:p-4">

                <div className="hidden shrink-0 rounded-full bg-amber-500/10 p-2 md:block">
                    <Cookie className="h-5 w-5 text-amber-500" />
                </div>

                <div className="min-w-0 flex-1 text-left">
                    <p className="line-clamp-2 text-[9px] leading-snug text-slate-300 md:line-clamp-none md:text-sm md:leading-relaxed">
                        เว็บไซต์นี้ใช้คุกกี้เพื่อประสบการณ์ที่ดีที่สุด การใช้งานเว็บไซต์ถือว่าท่านยอมรับ <Link href="/privacy" className="text-amber-400 hover:underline font-medium">นโยบายความเป็นส่วนตัว</Link>
                    </p>
                </div>

                <div className="shrink-0">
                    <button
                        onClick={handleAccept}
                        className="rounded-lg bg-amber-500 px-2.5 py-1.5 text-[10px] font-bold text-[#1d1203] shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-400 md:rounded-xl md:px-5 md:py-2.5 md:text-sm"
                    >
                        ยอมรับทั้งหมด
                    </button>
                </div>
            </div>
        </div>
    );
}
