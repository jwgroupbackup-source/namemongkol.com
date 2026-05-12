'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Wallet, Star, Wand2 } from 'lucide-react';
import { AnalysisResult } from '@/types';
import dynamic from 'next/dynamic';

const CustomWallpaperGenerator = dynamic(
    () => import('./CustomWallpaperGenerator').then(mod => mod.CustomWallpaperGenerator),
    { ssr: false }
);

interface WallpaperUpsellProps {
    result: AnalysisResult | null;
    day?: string;
}

const WALLPAPER_MAPPING: Record<string, string> = {
    sunday: '/wallpapers/sunday.webp',
    monday: '/wallpapers/monday.webp',
    tuesday: '/wallpapers/tuesday.webp',
    wednesday: '/wallpapers/wednesday.webp',
    thursday: '/wallpapers/thursday.webp',
    friday: '/wallpapers/friday.webp',
    saturday: '/wallpapers/saturday.webp',
};

const DAY_LABELS: Record<string, string> = {
    sunday: 'อาทิตย์',
    monday: 'จันทร์',
    tuesday: 'อังคาร',
    wednesday: 'พุธ',
    thursday: 'พฤหัสบดี',
    friday: 'ศุกร์',
    saturday: 'เสาร์',
};

// Default mapping if day isn't found or strictly English day names are used
const DEFAULT_WALLPAPER = '/wallpapers/thao-wessuwan-v2.webp';

export const WallpaperUpsell = ({ result, day = 'sunday' }: WallpaperUpsellProps) => {
    const [showCustomGenerator, setShowCustomGenerator] = useState(false);

    if (!result) return null;

    const dayKey = day.toLowerCase();
    const wallpaperImage = WALLPAPER_MAPPING[dayKey] || DEFAULT_WALLPAPER;
    const dayLabel = DAY_LABELS[dayKey] || 'อาทิตย์';
    const isGoodScore = result.totalScore > 50; // Example logic

    return (
        <>
            <div className="w-full mt-8 animate-fade-in-up">
                <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[#1e293b]/70 backdrop-blur-xl p-1">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-3xl" />

                    <div className="relative flex flex-col md:flex-row gap-6 p-6">
                        {/* Image Section */}
                        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
                            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group cursor-pointer">
                                <Image
                                    src={wallpaperImage}
                                    alt={`วอลเปเปอร์มงคลเสริมดวงสำหรับคนเกิดวัน${dayLabel}`}
                                    fill
                                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 33vw, 25vw"
                                    quality={75}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                    <Star size={10} fill="currentColor" /> Premium
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit mb-4">
                                <Sparkles size={14} className="text-amber-400" />
                                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">แนะนำพิเศษสำหรับคุณ</span>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                เสริมพลัง {isGoodScore ? 'ให้ปังยิ่งขึ้น' : 'แก้เคล็ดเสริมดวง'} ด้วยวอลเปเปอร์มงคล
                            </h3>

                            <p className="text-slate-300 leading-relaxed mb-6">
                                จากผลการวิเคราะห์ ชื่อของคุณมีพลังเลขศาสตร์ <strong>{result.totalScore}</strong>
                                {isGoodScore
                                    ? ' ซึ่งเป็นเลขที่ดีเยี่ยม! เพื่อส่งเสริมให้ชีวิตพุ่งทะยานสูงสุด '
                                    : ' เราขอแนะนำให้เสริมพลังด้านดีและลดทอนพลังเสีย '}
                                ด้วยวอลเปเปอร์ที่ออกแบบมาเพื่อคนเกิด<strong>วัน{day === 'sunday' ? 'อาทิตย์' : day === 'monday' ? 'จันทร์' : day === 'tuesday' ? 'อังคาร' : day === 'wednesday' ? 'พุธ' : day === 'thursday' ? 'พฤหัสบดี' : day === 'friday' ? 'ศุกร์' : 'เสาร์'}</strong>โดยเฉพาะ
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => setShowCustomGenerator(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-0.5"
                                >
                                    <Wand2 size={18} />
                                    สร้างวอลเปเปอร์ส่วนตัว
                                </button>
                                <Link
                                    href="/wallpapers"
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5"
                                >
                                    <Wallet size={18} />
                                    ดูวอลเปเปอร์ทั้งหมด
                                </Link>
                                <Link
                                    href={`/wallpapers/day/${day}`}
                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-6 rounded-xl border border-white/10 transition-all hover:border-white/30"
                                >
                                    ดูเฉพาะวันเกิดเรา <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Wallpaper Generator Modal */}
            <CustomWallpaperGenerator
                isOpen={showCustomGenerator}
                onClose={() => setShowCustomGenerator(false)}
                name={result.name}
                surname={result.surname}
                totalScore={result.totalScore}
                grade={result.grade}
                day={day}
            />
        </>
    );
};
