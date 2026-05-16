'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X, Facebook } from 'lucide-react';

const contacts = [
    {
        label: 'LINE',
        href: 'https://lin.ee/ypQcbiz',
        bg: 'bg-[#06C755]/90 hover:bg-[#06C755]',
        icon: <MessageCircle className="w-[18px] h-[18px] text-white" fill="currentColor" />,
    },
    {
        label: 'Facebook',
        href: 'https://m.me/namemongkol.th',
        bg: 'bg-[#1877F2]/90 hover:bg-[#1877F2]',
        icon: <Facebook className="w-[18px] h-[18px] text-white" fill="currentColor" />,
    },
];

export const FloatingContactFAB = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[54]"
                    onClick={() => setIsOpen(false)}
                    aria-hidden
                />
            )}

            <div className="fixed left-4 bottom-[4.5rem] lg:left-6 lg:bottom-8 z-[55] flex flex-col items-start gap-2">
                {/* Sub-buttons — icon-only pills */}
                {contacts.map((item, i) => (
                    <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        style={{
                            transitionDelay: isOpen ? `${i * 60}ms` : `${(contacts.length - 1 - i) * 40}ms`,
                        }}
                        className={`
                            group flex items-center gap-0 h-10 rounded-full
                            ${item.bg} backdrop-blur-md
                            shadow-md shadow-black/15
                            transition-all duration-200 ease-out overflow-hidden
                            ${isOpen
                                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto pl-2.5 pr-3.5 gap-2'
                                : 'opacity-0 translate-y-3 scale-90 pointer-events-none pl-2.5 pr-2.5 gap-0'
                            }
                            active:scale-95
                        `}
                        onClick={() => setIsOpen(false)}
                    >
                        {item.icon}
                        <span
                            className={`text-white text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100 max-w-24' : 'opacity-0 max-w-0'
                                }`}
                        >
                            {item.label}
                        </span>
                    </a>
                ))}

                {/* Main FAB — minimal glass */}
                <button
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-label="ติดต่อเรา"
                    aria-expanded={isOpen}
                    className={`
                        relative w-11 h-11 rounded-full
                        bg-white/10 backdrop-blur-xl border border-white/15
                        shadow-md shadow-black/10
                        flex items-center justify-center
                        transition-all duration-300 ease-out
                        hover:bg-white/20 hover:border-white/25 hover:scale-105
                        active:scale-95
                    `}
                >
                    <MessageCircle
                        className={`w-[18px] h-[18px] text-amber-400 absolute transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
                        strokeWidth={2}
                    />
                    <X
                        className={`w-[18px] h-[18px] text-white/70 absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
                        strokeWidth={2}
                    />

                    {/* Pulse dot */}
                    {!isOpen && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                </button>
            </div>
        </>
    );
};
