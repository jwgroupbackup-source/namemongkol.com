'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Sparkles, ArrowRight, Wallet, Heart, Shield, Star, Zap, Crown } from 'lucide-react';

interface BeforeAfterComparisonProps {
    currentScore: number;
    currentGrade: string;
    currentLevel: string;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
    currentScore,
    currentGrade,
    currentLevel,
}) => {
    // Calculate percentage (assuming max score around 99)
    const currentPercent = Math.min(Math.round((currentScore / 99) * 100), 100);
    // Lazy initializer: random offset computed once on mount
    const [randomOffset] = useState(() => Math.floor(Math.random() * 15));
    const projectedPercent = Math.min(currentPercent + 35 + randomOffset, 98);

    // Determine current score status
    const isLowScore = currentPercent < 50;
    const isMediumScore = currentPercent >= 50 && currentPercent < 70;

    // Only show for low-medium scores (where upgrade makes sense)
    const showComparison = currentPercent < 75;

    if (!showComparison) return null;

    const currentIssues = isLowScore
        ? ['งานติดขัด', 'เงินรั่ว', 'สุขภาพอ่อน']
        : isMediumScore
            ? ['พลังยังไม่เต็ม', 'โอกาสยังน้อย', 'ต้องลุยต่อ']
            : ['ยังไปได้อีก'];

    const projectedBenefits = [
        { icon: Wallet, text: 'เงินมั่นคง', color: 'text-emerald-400' },
        { icon: Heart, text: 'รักราบรื่น', color: 'text-pink-400' },
        { icon: Shield, text: 'บารมีเด่น', color: 'text-blue-400' },
        { icon: Crown, text: 'คนยอมรับ', color: 'text-amber-400' },
    ];

    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                    <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">เปรียบเทียบก่อน-หลัง</h3>
                    <p className="text-xs text-slate-400">ถ้าปรับชื่อใหม่ พลังจะขยับแค่ไหน</p>
                </div>
            </div>

            {/* Comparison Chart */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Before - Current Name */}
                <div className="relative">
                    <div className="text-center mb-3">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">ชื่อเดิม</span>
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <TrendingDown className="w-4 h-4 text-rose-400" />
                            <span className="text-rose-400 font-bold">{currentGrade}</span>
                        </div>
                    </div>

                    {/* Radial Progress - Before */}
                    <div className="relative w-28 h-28 mx-auto">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-slate-800"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="url(#gradient-before)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${currentPercent * 2.51} 251`}
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id="gradient-before" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f43f5e" />
                                    <stop offset="100%" stopColor="#f97316" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-rose-400">{currentPercent}%</span>
                            <span className="text-[10px] text-slate-500">พลัง</span>
                        </div>
                    </div>

                    {/* Issues List */}
                    <div className="mt-4 space-y-1.5">
                        {currentIssues.map((issue, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-rose-400/80">
                                <div className="w-1 h-1 rounded-full bg-rose-400" />
                                <span>{issue}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Arrow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-amber-400" />
                    </div>
                </div>

                {/* After - Projected with New Name */}
                <div className="relative">
                    <div className="text-center mb-3">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">ชื่อใหม่</span>
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">A+</span>
                        </div>
                    </div>

                    {/* Radial Progress - After */}
                    <div className="relative w-28 h-28 mx-auto">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-slate-800"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="url(#gradient-after)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${projectedPercent * 2.51} 251`}
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id="gradient-after" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#22d3ee" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-emerald-400">{projectedPercent}%</span>
                            <span className="text-[10px] text-slate-500">พลัง</span>
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
                    </div>

                    {/* Benefits List */}
                    <div className="mt-4 space-y-1.5">
                        {projectedBenefits.slice(0, 3).map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-emerald-400/80">
                                <benefit.icon className="w-3 h-3" />
                                <span className="truncate">{benefit.text.split(' ').slice(0, 3).join(' ')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Improvement Stats */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-400">
                                +{projectedPercent - currentPercent}% พลัง
                            </p>
                            <p className="text-xs text-slate-400">ถ้าปรับชื่อใหม่</p>
                        </div>
                    </div>
                    <div className="flex -space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Button */}
            <Link href="/premium-search" className="block">
                <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-[0.98]">
                    <Sparkles className="w-5 h-5" />
                    <span>ค้นหาชื่อมงคลที่เหมาะกับคุณ</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </Link>

            {/* Trust Badge */}
            <p className="text-center text-xs text-slate-500 mt-3">
                ✨ วิเคราะห์โดยศาสตร์โหราศาสตร์ไทย ทักษาปกรณ์ และเลขศาสตร์
            </p>
        </div>
    );
};

export default BeforeAfterComparison;
