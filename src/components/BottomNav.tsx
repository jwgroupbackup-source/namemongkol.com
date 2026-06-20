'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Crown, Sparkles, Image as ImageIcon, Home } from 'lucide-react';

export const BottomNav = () => {
    const pathname = usePathname();
    const [visible, setVisible] = useState(true);
    const visibleRef = useRef(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;

            requestAnimationFrame(() => {
                const currentY = window.scrollY;
                let nextVisible = visibleRef.current;

                // Show when scrolling up or near top; hide when scrolling down
                if (currentY <= 10) {
                    nextVisible = true;
                } else if (currentY < lastScrollY.current) {
                    nextVisible = true;
                } else if (currentY > lastScrollY.current + 5) {
                    nextVisible = false;
                }

                if (nextVisible !== visibleRef.current) {
                    visibleRef.current = nextVisible;
                    setVisible(nextVisible);
                }
                lastScrollY.current = currentY;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navItems = [
        { name: 'หน้าหลัก', icon: Home, iconImage: '/icon/วิเคราะห์ชื่อ.png', path: '/' },
        { name: 'ค้นหา', icon: Search, iconImage: '/icon/ค้นหาชื่อมงคล.png', path: '/search' },
        { name: 'ชื่อมงคล Pro', icon: Crown, iconImage: '/icon/คัดสรรชื่อมงคล.png', path: '/premium-search' },
        { name: 'Premium', icon: Sparkles, iconImage: '/icon/ออกแบบชื่อมงคล.png', path: '/premium-analysis' },
        { name: 'วอลเปเปอร์', icon: ImageIcon, iconImage: '/icon/วอลเปเปอร์มงคล.png', path: '/wallpapers' },
    ];

    return (
        <div
            className={`fixed bottom-0 left-0 w-full z-[60] lg:hidden transition-transform duration-300 ease-in-out ${
                visible ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {/* Subtle gold gradient top edge */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c9933a]/25 to-transparent" />

            <div className="grid h-[58px] grid-cols-5 bg-white/96 px-2 backdrop-blur-xl" style={{ boxShadow: '0 -4px 20px rgba(26,26,62,0.06)' }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="group relative flex flex-col items-center justify-center gap-1"
                        >
                            {/* Active glow behind the icon */}
                            {isActive && (
                                <div className="absolute top-1 w-8 h-8 rounded-lg bg-[#c9933a]/15 blur-md" />
                            )}

                            {/* Compact icon box */}
                            <div
                                className={`relative flex items-center justify-center w-[32px] h-[28px] rounded-lg transition-all duration-300 ease-out
                                    ${isActive
                                        ? 'bg-gradient-to-b from-amber-50 to-white border border-[#c9933a]/50 shadow-[0_2px_8px_rgba(201,147,58,0.20)]'
                                        : 'bg-white border border-[#ddddf0] group-hover:border-[#9b8ec4]/40 group-hover:bg-[#eeebf8]'
                                    }`}
                            >
                                {item.iconImage ? (
                                    <Image
                                        src={item.iconImage}
                                        alt={item.name}
                                        width={20}
                                        height={20}
                                        className={`h-5 w-5 object-contain transition-all duration-300 ${isActive
                                            ? 'drop-shadow-[0_0_3px_rgba(201,147,58,0.40)]'
                                            : 'opacity-80 group-hover:opacity-100 group-active:scale-90'
                                            }`}
                                    />
                                ) : (
                                    <Icon
                                        size={16}
                                        strokeWidth={isActive ? 2.3 : 1.7}
                                        className={`transition-all duration-300 ${isActive
                                                ? 'text-[#c9933a]'
                                                : 'text-[#8e8eaa] group-hover:text-[#5a5a82] group-active:scale-90'
                                            }`}
                                    />
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`max-w-full truncate text-[10px] font-semibold leading-none transition-all duration-300 ${isActive
                                        ? 'text-[#c9933a]'
                                        : 'text-[#8e8eaa] group-hover:text-[#5a5a82]'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
