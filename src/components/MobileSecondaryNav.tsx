'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BookOpen, Crown, Hand, Home, ImageIcon, Search, Smartphone, Sparkles } from 'lucide-react';

export const MobileSecondaryNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'วิเคราะห์ชื่อ', shortName: 'วิเคราะห์', icon: Home, iconImage: '/icon/วิเคราะห์ชื่อ.png', path: '/' },
        { name: 'บทความ', shortName: 'บทความ', icon: BookOpen, path: '/articles' },
        { name: 'ค้นหาชื่อมงคล', shortName: 'ค้นชื่อ', icon: Search, iconImage: '/icon/ค้นหาชื่อมงคล.png', path: '/search' },
        { name: 'คัดสรรชื่อมงคล', shortName: 'Pro', icon: Sparkles, iconImage: '/icon/คัดสรรชื่อมงคล.png', path: '/premium-search' },
        { name: 'ออกแบบชื่อมงคล', shortName: 'Premium', icon: Crown, iconImage: '/icon/ออกแบบชื่อมงคล.png', path: '/premium-analysis' },
        { name: 'วิเคราะห์เบอร์', shortName: 'เบอร์', icon: Smartphone, iconImage: '/icon/วิเคราะห์เบอร์โทร.png', path: '/phone-analysis' },
        { name: 'วิเคราะห์ออร่า', shortName: 'ออร่า', icon: Sparkles, iconImage: '/icon/วิเคราะห์ออร่า.png', path: '/aura-analysis' },
        { name: 'วิเคราะห์ลายมือ', shortName: 'ลายมือ', icon: Hand, iconImage: '/icon/วิเคราะห์ลายมือ.png', path: '/palm-analysis' },
        { name: 'วอลเปเปอร์มงคล', shortName: 'วอลฯ', icon: ImageIcon, iconImage: '/icon/วอลเปเปอร์มงคล.png', path: '/wallpapers' },
    ];

    if (pathname === '/') {
        return <div className="h-[68px] w-full max-[400px]:h-[64px] lg:hidden" />;
    }

    return (
        <>
            <div className="fixed top-[68px] z-40 w-full border-b border-white/10 bg-[#0f172a]/95 shadow-[0_4px_16px_rgba(0,0,0,0.22)] backdrop-blur-xl max-[400px]:top-[64px] lg:hidden">
                <div className="flex items-center gap-1 overflow-x-auto overscroll-x-contain px-2 py-1 no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = item.path === '/articles'
                            ? pathname === '/articles' || pathname.startsWith('/articles/')
                            : pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                aria-label={item.name}
                                title={item.name}
                                onClick={() => {
                                    if (item.path === '/') {
                                        window.dispatchEvent(new Event('resetHomeForm'));
                                    }
                                }}
                                className={`flex min-h-7 shrink-0 items-center gap-1 rounded-lg border px-2 py-1 transition-all duration-200 max-[400px]:px-1.5 ${
                                    isActive
                                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(201,147,58,0.24)]'
                                        : 'border-white/10 bg-slate-800/60 text-slate-300 hover:border-white/25 hover:bg-slate-700/80 hover:text-white active:scale-95'
                                }`}
                            >
                                {item.iconImage ? (
                                    <Image
                                        src={item.iconImage}
                                        alt=""
                                        width={18}
                                        height={18}
                                        className={`h-4 w-4 shrink-0 object-contain transition-all duration-200 ${isActive ? 'drop-shadow-[0_0_4px_rgba(201,147,58,0.5)]' : 'opacity-85'}`}
                                    />
                                ) : (
                                    <Icon size={13} className={`shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                                )}
                                <span className={`whitespace-nowrap text-[10px] font-bold leading-none max-[400px]:text-[9px] ${isActive ? 'text-white' : 'text-slate-200'}`}>
                                    {item.shortName}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div className="h-[108px] w-full max-[400px]:h-[104px] lg:hidden" />
        </>
    );
};
