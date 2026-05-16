'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';

export interface WallpaperShowcaseStat {
    id: number;
    downloads: number;
}

const INITIAL_WALLPAPERS = [
    { id: 1, name: 'สิงห์ทองนำโชค (วันอาทิตย์)', image: '/wallpapers/sunday.webp', day: 'sunday', downloads: 2540 },
    { id: 2, name: 'เทพพระจันทร์ประทานพร (วันจันทร์)', image: '/wallpapers/monday.webp', day: 'monday', downloads: 3120 },
    { id: 3, name: 'พระปางไสยาสน์ (วันอังคาร)', image: '/wallpapers/tuesday.webp', day: 'tuesday', downloads: 1890 },
    { id: 4, name: 'พระแม่ลักษมี เรียกทรัพย์ (พุธกลางวัน)', image: '/wallpapers/Wednesday_lunch.webp', day: 'wednesday', downloads: 2100 },
];

type WallpaperShowcaseProps = {
    stats?: WallpaperShowcaseStat[];
};

export const WallpaperShowcase = ({ stats = [] }: WallpaperShowcaseProps) => {
    const wallpapers = INITIAL_WALLPAPERS.map((initial) => {
        const stat = stats.find((item) => item.id === initial.id);
        return stat ? { ...initial, downloads: stat.downloads } : initial;
    });

    return (
        <div className="w-full max-w-5xl mx-auto mt-4 md:mt-16 mb-8 px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-3 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        <Sparkles className="text-amber-400" />
                        วอลเปเปอร์มงคล
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm md:text-base">
                        เสริมดวงชะตาให้ครบทุกด้าน ด้วยวอลเปเปอร์มงคลเฉพาะบุคคล ออกแบบตามหลักทักษาและเลขศาสตร์
                    </p>
                </div>
                <Link
                    href="/wallpapers"
                    className="flex items-center gap-2 text-amber-400 font-medium hover:text-amber-300 transition-colors group shrink-0"
                >
                    ดูวอลเปเปอร์ทั้งหมด <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {wallpapers.map((wp) => (
                    <Link href="/wallpapers" key={wp.id} className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:-translate-y-1">
                        <Image
                            src={wp.image}
                            alt={`วอลเปเปอร์มงคล ${wp.name} ภาพเสริมดวงตามวันเกิด`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            quality={75}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <span className="text-xs text-amber-400 font-bold tracking-wider uppercase mb-1 block">
                                เสริมดวง
                            </span>
                            <h3 className="text-white font-medium text-sm md:text-base truncate">
                                {wp.name}
                            </h3>
                            <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                                    <Download size={10} /> {wp.downloads.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-amber-200 mb-2">ยังไม่รู้วอลเปเปอร์ไหนเหมาะกับคุณ?</h3>
                        <p className="text-slate-400 text-sm">วิเคราะห์ชื่อกับเราวันนี้ พร้อมรับคำแนะนำวอลเปเปอร์เสริมดวงที่ตรงกับชะตาของคุณที่สุด</p>
                    </div>
                    <Link
                        href="/wallpapers"
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:scale-105"
                    >
                        ค้นหาวอลเปเปอร์ของคุณ
                    </Link>
                </div>
            </div>
        </div>
    );
};
