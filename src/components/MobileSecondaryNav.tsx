'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Smartphone, Hand, Sparkles, Search, Crown, ImageIcon, BookOpen } from 'lucide-react';

export const MobileSecondaryNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'วิเคราะห์ชื่อ', icon: Home, iconImage: '/icon/วิเคราะห์ชื่อ.png', path: '/' },
        { name: 'บทความ', icon: BookOpen, path: '/articles' },
        { name: 'ค้นหาชื่อมงคล', icon: Search, iconImage: '/icon/ค้นหาชื่อมงคล.png', path: '/search' },
        { name: 'คัดสรรชื่อมงคล', icon: Sparkles, iconImage: '/icon/คัดสรรชื่อมงคล.png', path: '/premium-search' },
        { name: 'ออกแบบชื่อมงคล', icon: Crown, iconImage: '/icon/ออกแบบชื่อมงคล.png', path: '/premium-analysis' },
        { name: 'วิเคราะห์เบอร์', icon: Smartphone, iconImage: '/icon/วิเคราะห์เบอร์โทร.png', path: '/phone-analysis' },
        { name: 'วิเคราะห์ออร่า', icon: Sparkles, iconImage: '/icon/วิเคราะห์ออร่า.png', path: '/aura-analysis' },
        { name: 'วิเคราะห์ลายมือ', icon: Hand, iconImage: '/icon/วิเคราะห์ลายมือ.png', path: '/palm-analysis' },
        { name: 'วอลเปเปอร์มงคล', icon: ImageIcon, iconImage: '/icon/วอลเปเปอร์มงคล.png', path: '/wallpapers' },
    ];

    if (pathname === '/') {
        return <div className="h-[68px] w-full max-[400px]:h-[64px] lg:hidden" />;
    }

    return (
        <>
            <div className="fixed top-[68px] z-40 w-full border-b border-white/8 bg-[#0f172a]/92 shadow-[0_4px_16px_rgba(0,0,0,0.22)] backdrop-blur-xl max-[400px]:top-[64px] lg:hidden">
                <div className="flex items-center gap-1.5 overflow-x-auto px-2 py-1 custom-scrollbar no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = item.path === '/articles'
                            ? pathname === '/articles' || pathname.startsWith('/articles/')
                            : pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => {
                                    if (item.path === '/') {
                                        window.dispatchEvent(new Event('resetHomeForm'));
                                    }
                                }}
                                className={`flex min-h-7 items-center gap-1 rounded-lg border px-2 py-1 whitespace-nowrap transition-all duration-300 ${isActive
                                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_12px_rgba(201,147,58,0.3)]'
                                    : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-700/80 hover:text-white hover:border-white/25 active:scale-95'
                                    }`}
                            >
                                {item.iconImage ? (
                                    <Image
                                        src={item.iconImage}
                                        alt={item.name}
                                        width={18}
                                        height={18}
                                        className={`h-4 w-4 shrink-0 object-contain transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_4px_rgba(201,147,58,0.5)]' : 'opacity-85'}`}
                                    />
                                ) : (
                                    <Icon size={13} className={`shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                                )}
                                <span className={`text-[9px] font-bold leading-none ${isActive ? 'text-white' : 'text-slate-200'}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Spacer to prevent layout shift */}
            <div className="h-[32px] w-full lg:hidden" />
        </>
    );
};
