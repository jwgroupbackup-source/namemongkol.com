'use client';

import { useState } from 'react';
import { Sparkles, Target, Lightbulb, Compass, Loader2, Crown, ChevronRight } from 'lucide-react';
import type { PhoneAiAnalysis } from '@/types';

// ────── Score Gauge Component ──────
const ScoreGauge = ({ score }: { score: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const filled = (score / 100) * circumference;
    const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-700/50" />
                <circle
                    cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={circumference} strokeDashoffset={circumference - filled}
                    strokeLinecap="round" className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{score}</span>
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">คะแนน</span>
            </div>
        </div>
    );
};

// ────── Loading Skeleton ──────
const AiLoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-700/50 rounded w-1/2" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-700/50 rounded w-full" />
                <div className="h-3 bg-slate-700/50 rounded w-5/6" />
                <div className="h-3 bg-slate-700/50 rounded w-4/6" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
                <div key={i} className="bg-[#1e293b] rounded-2xl p-5 border border-slate-700/30">
                    <div className="h-4 bg-slate-700 rounded w-1/2 mb-3" />
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-700/50 rounded w-full" />
                        <div className="h-3 bg-slate-700/50 rounded w-3/4" />
                    </div>
                </div>
            ))}
        </div>
        <div className="text-center text-amber-400/80 text-sm font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            อาจารย์มงคล AI กำลังวิเคราะห์...
        </div>
    </div>
);

// ────── Profession Input Suggestions ──────
const PROFESSION_SUGGESTIONS = [
    'ค้าขาย/ธุรกิจ', 'พนักงานบริษัท', 'ข้าราชการ', 'หมอ/พยาบาล',
    'ทนายความ', 'ครู/อาจารย์', 'ฟรีแลนซ์', 'นักลงทุน',
    'วิศวกร', 'โปรแกรมเมอร์', 'ช่างเทคนิค', 'เกษตรกร',
];

// ────── Main Component ──────
interface PhoneAiAnalysisSectionProps {
    analysis: PhoneAiAnalysis | null;
    profession: string;
    isLoading: boolean;
    onProfessionChange: (value: string) => void;
    onRequestAnalysis: () => void;
    hasResult: boolean;
}

export const PhoneAiAnalysisSection: React.FC<PhoneAiAnalysisSectionProps> = ({
    analysis,
    profession,
    isLoading,
    onProfessionChange,
    onRequestAnalysis,
    hasResult,
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    if (!hasResult) return null;

    // ── Already have AI result ──
    if (analysis) {
        return (
            <div className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center gap-2 px-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        วิเคราะห์เชิงลึกจากอาจารย์มงคล AI
                    </h3>
                </div>

                {/* Alignment Card */}
                <div className="bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl p-5 lg:p-6 border border-amber-500/20 shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <ScoreGauge score={analysis.alignment.score} />
                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-amber-400 shrink-0" />
                                <h4 className="font-bold text-amber-300 text-sm">{analysis.alignment.title}</h4>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{analysis.alignment.content}</p>
                        </div>
                    </div>
                </div>

                {/* Hidden Potential + Strategy Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hidden Potential */}
                    <div className="bg-[#1e293b] rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden group hover:border-amber-500/20 transition-colors">
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Lightbulb className="w-4 h-4 text-amber-400" />
                            </div>
                            <h4 className="font-bold text-amber-300 text-sm">{analysis.hidden_potential.title}</h4>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed relative z-10">{analysis.hidden_potential.content}</p>
                    </div>

                    {/* Strategy */}
                    <div className="bg-[#1e293b] rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden group hover:border-emerald-500/20 transition-colors">
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Compass className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h4 className="font-bold text-emerald-300 text-sm">{analysis.strategy.title}</h4>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed relative z-10">{analysis.strategy.content}</p>
                    </div>
                </div>

                {/* Verdict */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-5 border border-amber-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
                    <div className="flex items-start gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                            <Crown className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-200 text-sm mb-1">บทสรุปจากอาจารย์มงคล</h4>
                            <p className="text-white text-sm leading-relaxed font-medium">{analysis.verdict}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Loading state ──
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        วิเคราะห์เชิงลึกจากอาจารย์มงคล AI
                    </h3>
                </div>
                <AiLoadingSkeleton />
            </div>
        );
    }

    // ── CTA: Request AI Analysis ──
    return (
        <div className="relative">
            {/* Premium CTA Card */}
            <div className="bg-gradient-to-br from-[#1e293b] to-[#1a2235] rounded-2xl p-5 lg:p-6 border border-amber-500/30 shadow-xl relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">วิเคราะห์เชิงลึกตามอาชีพ</h3>
                        <p className="text-amber-400/80 text-xs font-medium">โดย อาจารย์มงคล AI</p>
                    </div>
                    <div className="ml-auto px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Premium
                    </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-5 relative z-10 leading-relaxed">
                    ให้ AI วิเคราะห์ว่าเบอร์ของคุณส่งเสริมหรือขัดแย้งกับอาชีพ/สายงานที่ทำ พร้อมกลยุทธ์เสริมดวงเฉพาะทาง
                </p>

                {/* Profession Input */}
                <div className="relative z-10 mb-4">
                    <label className="block text-slate-300 text-xs font-semibold mb-2 tracking-wide">
                        อาชีพ/สายงานของคุณ
                    </label>
                    <input
                        type="text"
                        value={profession}
                        onChange={(e) => onProfessionChange(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="เช่น ค้าขาย, พนักงานบริษัท, หมอ..."
                        className="w-full bg-slate-900/50 text-white placeholder:text-slate-500 px-4 py-3 rounded-xl outline-none border border-slate-700 focus:border-amber-500/50 transition-all text-sm font-medium"
                    />

                    {/* Suggestions */}
                    {showSuggestions && !profession && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl z-20 p-2 max-h-48 overflow-y-auto">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold px-2 py-1">ตัวอย่างอาชีพ</div>
                            <div className="flex flex-wrap gap-1.5 p-1">
                                {PROFESSION_SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            onProfessionChange(s);
                                            setShowSuggestions(false);
                                        }}
                                        className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/30 border border-slate-700 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <button
                    onClick={onRequestAnalysis}
                    disabled={!profession.trim() || isLoading}
                    className={`
                        w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform flex items-center justify-center gap-2 text-sm relative z-10
                        ${profession.trim()
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    <Sparkles className="w-4 h-4" />
                    วิเคราะห์ด้วย AI (10 เครดิต)
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-slate-500 relative z-10">
                    <span>⚡ ใช้เวลา ~10 วินาที</span>
                    <span>•</span>
                    <span>🤖 Gemini AI</span>
                    <span>•</span>
                    <span>🎯 เฉพาะทางตามอาชีพ</span>
                </div>
            </div>
        </div>
    );
};
