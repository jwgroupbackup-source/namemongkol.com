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
        <div className="fixed bottom-0 left-0 w-full z-[100] px-4 pb-8 pt-4 md:p-4 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-6">

                <div className="p-3 bg-amber-500/10 rounded-full shrink-0 hidden md:block">
                    <Cookie className="w-6 h-6 text-amber-500" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                        เว็บไซต์นี้ใช้คุกกี้เพื่อประสบการณ์ที่ดีที่สุด การใช้งานเว็บไซต์ถือว่าท่านยอมรับ <Link href="/privacy" className="text-amber-400 hover:underline font-medium">นโยบายความเป็นส่วนตัว</Link>
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-3 md:py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/20 text-sm md:text-base whitespace-nowrap"
                    >
                        ยอมรับทั้งหมด
                    </button>
                </div>
            </div>
        </div>
    );
}
