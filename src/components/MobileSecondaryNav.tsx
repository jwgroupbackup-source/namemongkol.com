'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Smartphone, BookOpen, Info, Hand, Sparkles, Search, Crown, ImageIcon } from 'lucide-react';

export const MobileSecondaryNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'วิเคราะห์ชื่อ', icon: Home, iconImage: '/icon/วิเคราะห์ชื่อ.png', path: '/' },
        { name: 'ค้นหาชื่อมงคล', icon: Search, iconImage: '/icon/ค้นหาชื่อมงคล.png', path: '/search' },
        { name: 'คัดสรรชื่อมงคล', icon: Sparkles, iconImage: '/icon/คัดสรรชื่อมงคล.png', path: '/premium-search' },
        { name: 'ออกแบบชื่อมงคล', icon: Crown, iconImage: '/icon/ออกแบบชื่อมงคล.png', path: '/premium-analysis' },
        { name: 'วิเคราะห์ออร่า', icon: Sparkles, iconImage: '/icon/วิเคราะห์ออร่า.png', path: '/aura-analysis' },
        { name: 'วิเคราะห์เบอร์', icon: Smartphone, iconImage: '/icon/วิเคราะห์เบอร์โทร.png', path: '/phone-analysis' },
        { name: 'วิเคราะห์ลายมือ', icon: Hand, iconImage: '/icon/วิเคราะห์ลายมือ.png', path: '/palm-analysis' },
        { name: 'วอลเปเปอร์มงคล', icon: ImageIcon, iconImage: '/icon/วอลเปเปอร์มงคล.png', path: '/wallpapers' },
        { name: 'บทความ', icon: BookOpen, path: '/articles' },
        { name: 'เกี่ยวกับเรา', icon: Info, iconImage: '/icon/เกี่ยวกับเรา.png', path: '/about' },
    ];

    return (
        <>
            <div className="lg:hidden w-full fixed top-[68px] max-[400px]:top-[64px] z-40 bg-[#0f172a]/92 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                <div className="flex items-center gap-1.5 px-2 py-1 overflow-x-auto custom-scrollbar no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
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
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap transition-all duration-300 border ${isActive
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
                                        className={`h-[18px] w-[18px] shrink-0 object-contain transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_4px_rgba(201,147,58,0.5)]' : 'opacity-85'}`}
                                    />
                                ) : (
                                    <Icon size={14} className={`shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                                )}
                                <span className={`text-[10px] font-bold tracking-wide leading-none ${isActive ? 'text-white' : 'text-slate-200'}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Spacer to prevent layout shift */}
            <div className="lg:hidden h-[34px] w-full" />
        </>
    );
};
