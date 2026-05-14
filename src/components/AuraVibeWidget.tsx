'use client';

import React, { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Crown, Heart, Lightbulb, Star, TrendingUp } from 'lucide-react';
import { getCharValue } from '@/data/numerologyLookup';
import { calculateScore } from '@/utils/numerologyUtils';
import { getSumPrediction } from '@/data/sumPredictions';

// ---------------------------------------------------------------------------
// Energy Dimensions — deterministic from char values
// ---------------------------------------------------------------------------

interface EnergyDimension {
    label: string;
    icon: React.ElementType;
    color: string;       // Tailwind gradient from
    bgColor: string;     // Container bg
}

const ENERGY_DIMENSIONS: EnergyDimension[] = [
    { label: 'เสน่ห์', icon: Heart, color: 'from-rose-500 to-pink-500', bgColor: 'bg-rose-500/10' },
    { label: 'ภาวะผู้นำ', icon: Crown, color: 'from-amber-500 to-yellow-500', bgColor: 'bg-amber-500/10' },
    { label: 'ความสำเร็จ', icon: TrendingUp, color: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-500/10' },
    { label: 'ความคิดสร้างสรรค์', icon: Lightbulb, color: 'from-violet-500 to-purple-500', bgColor: 'bg-violet-500/10' },
    { label: 'พลังงาน', icon: Zap, color: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-500/10' },
    { label: 'โชคลาภ', icon: Star, color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-500/10' },
];

// ---------------------------------------------------------------------------
// Compute deterministic energy bars from name characters
// ---------------------------------------------------------------------------

function computeEnergyBars(name: string): number[] {
    const chars = [...name];
    const values: number[] = [];
    for (const c of chars) {
        const value = getCharValue(c);
        if (value !== undefined) values.push(value);
    }

    if (values.length === 0) return ENERGY_DIMENSIONS.map(() => 50);

    // Generate 6 deterministic values seeded from the character values
    return ENERGY_DIMENSIONS.map((_, idx) => {
        let seed = 0;
        for (let i = 0; i < values.length; i++) {
            // Mix index into the hash to get different values per dimension
            seed += values[i] * (i + 1 + idx * 7);
        }
        // Map to 35-95 range for visual balance
        const raw = ((seed * 31 + idx * 17) % 61) + 35;
        return Math.min(95, Math.max(35, raw));
    });
}

// ---------------------------------------------------------------------------
// Level badge coloring
// ---------------------------------------------------------------------------

function getLevelInfo(level: string): { label: string; color: string; bg: string } {
    switch (level) {
        case 'VERY_GOOD':
            return { label: 'ดีมาก ✨', color: 'text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-500/30' };
        case 'GOOD':
            return { label: 'ดี 👍', color: 'text-green-300', bg: 'bg-green-500/20 border-green-500/30' };
        case 'NEUTRAL':
            return { label: 'ปานกลาง', color: 'text-slate-300', bg: 'bg-slate-500/20 border-slate-500/30' };
        case 'BAD':
            return { label: 'ระวัง ⚠️', color: 'text-orange-300', bg: 'bg-orange-500/20 border-orange-500/30' };
        case 'VERY_BAD':
            return { label: 'ควรปรับปรุง', color: 'text-red-300', bg: 'bg-red-500/20 border-red-500/30' };
        default:
            return { label: 'ปานกลาง', color: 'text-slate-300', bg: 'bg-slate-500/20 border-slate-500/30' };
    }
}

// ---------------------------------------------------------------------------
// Widget Component
// ---------------------------------------------------------------------------

export default function AuraVibeWidget() {
    const [name, setName] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [resultName, setResultName] = useState('');
    const [energyBars, setEnergyBars] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [prediction, setPrediction] = useState<{ title: string; desc: string; level: string }>({ title: '', desc: '', level: 'NEUTRAL' });
    const resultRef = useRef<HTMLDivElement>(null);

    const handleCheck = useCallback(() => {
        const trimmed = name.trim();
        if (!trimmed) return;

        const total = calculateScore(trimmed);
        const pred = getSumPrediction(total);
        const bars = computeEnergyBars(trimmed);

        setResultName(trimmed);
        setScore(total);
        setPrediction(pred);
        setEnergyBars(bars);
        setShowResult(true);

        // Scroll to result after a brief delay for animation
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }, [name]);

    const handleReset = useCallback(() => {
        setShowResult(false);
        setName('');
    }, []);

    const levelInfo = getLevelInfo(prediction.level);

    return (
        <div className="my-10 max-w-xl mx-auto">
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-amber-950/30 backdrop-blur-xl overflow-hidden shadow-xl shadow-amber-900/10">
                {/* Header */}
                <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-amber-500/10 bg-amber-500/[0.03]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">เช็คพลังงานชื่อของคุณ</h3>
                            <p className="text-[11px] text-slate-400">ระบบเลขศาสตร์ วิเคราะห์ฟรี!</p>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                    {!showResult ? (
                        /* ── Input State ── */
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                                    placeholder="พิมพ์ชื่อที่นี่..."
                                    maxLength={50}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all text-sm"
                                />
                                <button
                                    onClick={handleCheck}
                                    disabled={!name.trim()}
                                    className="px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
                                >
                                    เช็คเลย
                                </button>
                            </div>
                            <p className="text-[11px] text-center text-slate-500">
                                พิมพ์ชื่อภาษาไทยแล้วกด "เช็คเลย" เพื่อดูกราฟพลังงาน
                            </p>
                        </div>
                    ) : (
                        /* ── Result State ── */
                        <div ref={resultRef} className="space-y-5 animate-fade-in-up">
                            {/* Name + Score Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">ผลวิเคราะห์ชื่อ</p>
                                    <p className="text-xl font-bold text-white">{resultName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">{score}</p>
                                    <p className="text-[10px] text-slate-500">ผลรวมชื่อ</p>
                                </div>
                            </div>

                            {/* Level Badge + Prediction */}
                            <div className={`flex items-start gap-3 p-3 rounded-xl border ${levelInfo.bg}`}>
                                <span className={`text-sm font-bold ${levelInfo.color} whitespace-nowrap`}>{levelInfo.label}</span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-white">{prediction.title}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{prediction.desc}</p>
                                </div>
                            </div>

                            {/* Energy Bars */}
                            <div className="space-y-2.5">
                                <p className="text-xs font-medium text-slate-400">⚡ กราฟพลังงาน 6 ด้าน</p>
                                {ENERGY_DIMENSIONS.map((dim, idx) => {
                                    const Icon = dim.icon;
                                    const val = energyBars[idx] ?? 50;
                                    return (
                                        <div key={dim.label} className="flex items-center gap-2.5">
                                            <div className={`w-6 h-6 rounded-md ${dim.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                <Icon size={13} className="text-slate-300" />
                                            </div>
                                            <span className="text-[11px] text-slate-400 w-20 truncate">{dim.label}</span>
                                            <div className="flex-1 h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${dim.color} transition-all duration-700 ease-out`}
                                                    style={{ width: `${val}%` }}
                                                />
                                            </div>
                                            <span className="text-[11px] text-slate-500 w-8 text-right font-mono">{val}%</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* CTA → Full Analysis */}
                            <Link
                                href="/aura-analysis"
                                className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Sparkles size={16} />
                                ดูภาพลักษณ์และออร่าฉบับเต็ม
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* Try Another */}
                            <button
                                onClick={handleReset}
                                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
                            >
                                ลองชื่ออื่น →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
