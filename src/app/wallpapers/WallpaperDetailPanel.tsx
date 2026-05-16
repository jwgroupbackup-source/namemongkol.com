'use client';

import React from 'react';
import Image from 'next/image';
import { Download, Sparkles, Lock } from 'lucide-react';
import { Wallpaper } from '@/types';
import { getWallpaperCost, buildWallpaperAlt } from '@/data/wallpapers';

interface WallpaperDetailPanelProps {
    selectedWallpaper: Wallpaper;
    userCredits: number | null;
    downloadingId: number | null;
    downloadStep: string;
    onClose: () => void;
    onDownload: (wallpaper: Wallpaper) => void;
}

export default function WallpaperDetailPanel({
    selectedWallpaper,
    userCredits,
    downloadingId,
    downloadStep,
    onClose,
    onDownload
}: WallpaperDetailPanelProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className="fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm z-50 bg-slate-900 border-l border-white/10 flex flex-col overflow-y-auto shadow-2xl animate-slide-in-right"
            >
                {/* Close */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">รายละเอียด</span>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="ปิด"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Image */}
                <div className="relative w-full aspect-[9/16] bg-black flex-shrink-0 overflow-hidden">
                    <Image
                        src={selectedWallpaper.image}
                        alt={buildWallpaperAlt(selectedWallpaper)}
                        fill
                        sizes="(max-width: 640px) 100vw, 384px"
                        className="object-contain"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col px-5 py-5 space-y-4">
                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {selectedWallpaper.premium ? (
                            <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Lock size={10} /> {getWallpaperCost(selectedWallpaper)} เครดิต
                            </span>
                        ) : (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
                                <Sparkles size={10} /> ฟรี
                            </span>
                        )}
                        <span className="text-xs text-slate-500 flex items-center gap-1 px-2 py-0.5 bg-slate-800 rounded-full border border-white/5">
                            <Download size={10} /> {selectedWallpaper.downloads.toLocaleString()} ดาวน์โหลด
                        </span>
                    </div>

                    {/* Name */}
                    <h2 className="text-lg font-bold text-white leading-tight">
                        {selectedWallpaper.name}
                    </h2>

                    {/* Description */}
                    {selectedWallpaper.description && (
                        <div className="space-y-1.5">
                            <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                                <Sparkles size={12} /> คุณสมบัติมงคล
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {selectedWallpaper.description}
                            </p>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        {selectedWallpaper.tags.map(t => (
                            <span key={t} className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg border border-white/10">
                                #{t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA Footer */}
                <div className="flex-shrink-0 px-5 pb-6 pt-4 border-t border-white/10 space-y-3">
                    {userCredits !== null && (
                        <p className="text-xs text-slate-500 text-right">
                            เครดิตของคุณ: <span className="text-amber-400 font-bold">{userCredits.toLocaleString()}</span>
                        </p>
                    )}
                    <button
                        onClick={() => onDownload(selectedWallpaper)}
                        disabled={downloadingId === selectedWallpaper.id}
                        data-track="wallpapers.detail.download"
                        className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                            downloadingId === selectedWallpaper.id
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:scale-[1.02] active:scale-[0.98]'
                        } ${selectedWallpaper.premium
                            ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                            : 'bg-white text-black hover:bg-slate-100 shadow-lg shadow-white/10'
                        }`}
                    >
                        {downloadingId === selectedWallpaper.id ? (
                            <>
                                <svg className="animate-spin h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>{downloadStep || 'กำลังดาวน์โหลด...'}</span>
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                {selectedWallpaper.premium ? `แลก ${getWallpaperCost(selectedWallpaper)} เครดิต` : 'ดาวน์โหลดฟรี'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
