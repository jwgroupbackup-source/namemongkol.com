'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let ticking = false;

        const toggleVisibility = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const nextVisible = window.scrollY > 300;
                setIsVisible((current) => (current === nextVisible ? current : nextVisible));
                ticking = false;
            });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                ticking = false;
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-16 right-4 lg:bottom-10 lg:right-10 z-[50] bg-white/10 hover:bg-white/20 text-white p-2 rounded-full shadow-md shadow-black/15 border border-white/15 backdrop-blur-md transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'
                }`}
            aria-label="Back to Top"
        >
            <ChevronUp size={18} strokeWidth={2.5} />
        </button>
    );
};
