'use client';

import { useState } from 'react';
import { PhoneAnalysisResult as IPhoneAnalysisResult } from '@/utils/analyzePhone';
import { Activity, Brain, Heart, Share2, Skull, Crown, TrendingUp, Clover, Eye, Facebook, Link as LinkIcon, Check, Copy, Search } from 'lucide-react';
import type { PhoneAiAnalysis } from '@/types';
import { PhoneAiAnalysisSection } from '@/components/PhoneAiAnalysisSection';

// Custom Line Icon since Lucide doesn't include it
const LineIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.992 2.572-3.879 2.572-6.002z" />
    </svg>
);

// Moved StatBar Component here
const StatBar = ({ label, score, icon: Icon }: { label: string, score: { pos: number; neg: number }, icon: React.ElementType }) => {
    // Dual-Sided Logic:
    // Left Side (Red) -> Based on score.neg (0-100)
    // Right Side (Green) -> Based on score.pos (0-100)

    // Calculate segments (0 to 5)
    // Each segment represents 20 points
    const negFilled = Math.min(5, Math.ceil(score.neg / 20));
    const posFilled = Math.min(5, Math.ceil(score.pos / 20));

    // Extremity Flags
    const isCritical = score.neg >= 80; // Very high negative score -> Show Skull
    const isExcellent = score.pos >= 80; // Very high positive score -> Show Crown

    return (
        <div className="flex flex-col items-center w-full group">
            <span className="text-amber-500 font-bold text-[10px] mb-1 uppercase tracking-wide">{label}</span>

            <div className="flex items-center gap-2 w-full max-w-sm">

                {/* Left Side (Red) - Fills Right to Left from Center */}
                <div className="flex-1 flex items-center justify-end gap-1">
                    {/* Skull Icon */}
                    <div className={`w-5 flex justify-center transition-all duration-300 ${isCritical ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-rose-500 blur-sm opacity-50 animate-pulse"></div>
                            <Skull className="text-rose-500 w-4 h-4 relative z-10" />
                        </div>
                    </div>

                    {/* Segments (Right to Left logic) */}
                    <div className="flex flex-row-reverse gap-0.5 flex-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={`l-${i}`}
                                className={`
                                    h-2.5 flex-1 rounded-[1px] skew-x-[-12deg] border border-white/5 transition-all duration-500
                                    ${i < negFilled
                                        ? 'bg-gradient-to-r from-rose-600 to-rose-500 shadow-[0_0_4px_rgba(225,29,72,0.6)]'
                                        : 'bg-slate-700/30'}
                                `}
                            />
                        ))}
                    </div>
                </div>

                {/* Center Icon */}
                <div className="relative z-10 shrink-0">
                    <div className="absolute inset-0 bg-amber-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg border-[3px] border-[#1e293b] relative">
                        <Icon className="text-white w-5 h-5 drop-shadow-sm" />
                    </div>
                </div>

                {/* Right Side (Green) - Fills Left to Right from Center */}
                <div className="flex-1 flex items-center gap-1">
                    {/* Segments */}
                    <div className="flex gap-0.5 flex-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={`r-${i}`}
                                className={`
                                    h-2.5 flex-1 rounded-[1px] skew-x-[-12deg] border border-white/5 transition-all duration-500
                                    ${i < posFilled
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_0_4px_rgba(16,185,129,0.6)]'
                                        : 'bg-slate-700/30'}
                                `}
                            />
                        ))}
                    </div>

                    {/* Crown Icon */}
                    <div className={`w-5 flex justify-center transition-all duration-300 ${isExcellent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-400 blur-sm opacity-50 animate-pulse"></div>
                            <Crown className="text-amber-400 w-4 h-4 relative z-10 drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Moved PairBox Component here
const PairBox = ({ type, pairs }: { type: 'good' | 'bad', pairs: IPhoneAnalysisResult['pairs'] }) => {
    const isGood = type === 'good';
    const title = isGood ? 'เลขดี' : 'เลขเสีย';

    // Tailwind classes handling for dynamic colors
    const containerBorder = isGood ? 'border-emerald-500/30' : 'border-rose-500/30';
    const titleBg = isGood ? 'bg-emerald-600' : 'bg-rose-600';
    // const pairBg unused

    return (
        <div className={`relative border rounded-2xl rounded-tl-none pt-6 p-4 ${containerBorder} bg-white/5 backdrop-blur-sm`}>
            {/* Folder Tab */}
            <div className={`absolute -top-[1px] -left-[1px] px-4 py-1.5 rounded-t-lg rounded-br-lg text-white text-[10px] font-bold uppercase tracking-wider shadow-md ${titleBg}`}>
                {title}
            </div>

            {pairs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {pairs.map((p, idx) => {
                        // Determine color based on individual pair level
                        const chipColor = p.level === 1
                            ? 'bg-emerald-500 shadow-emerald-500/20'
                            : p.level === 2
                                ? 'bg-rose-500 shadow-rose-500/20'
                                : 'bg-amber-500 shadow-amber-500/20';

                        return (
                            <div key={idx} className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold text-white shadow-md ${chipColor}`}>
                                {p.pair}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-slate-500 text-xs italic py-1">ไม่มี{title}ในเบอร์นี้</div>
            )}
        </div>
    );
};

// Moved SimpleGradeCard Component here
const SimpleGradeCard = ({ grade, phoneNumber }: { grade: string; phoneNumber: string }) => {
    const getGradeColor = (g: string) => {
        if (g === 'A') return 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]';
        if (g === 'B') return 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]';
        if (g === 'C') return 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]';
        if (g === 'D') return 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.3)]';
        return 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]';
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight font-mono mb-6 drop-shadow-md">
                {phoneNumber}
            </h1>

            <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <div className="relative">
                    {/* Sim Card Icon Style */}
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center p-3 shadow-lg relative z-10 border border-amber-500/30">
                        <div className="w-full h-full bg-white/10 rounded-md border-2 border-dashed border-white/30 backdrop-blur-sm" />
                    </div>
                    {/* Starburst behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-500/20 blur-[20px] rounded-full animate-pulse z-0" />
                </div>

                <h2 className={`text-3xl font-bold ${getGradeColor(grade)} mt-4`}>
                    เบอร์เกรด {grade}
                </h2>
            </div>

            <div className="space-y-1.5 text-sm font-medium text-slate-400 max-w-xs mx-auto">
                <div className={`${grade === 'A' ? 'text-emerald-400 font-bold scale-105' : ''}`}>เบอร์เกรด A = เบอร์ดีมากๆ</div>
                <div className={`${grade === 'B' ? 'text-emerald-400 font-bold scale-105' : ''}`}>เบอร์เกรด B = เบอร์ดี</div>
                <div className={`${grade === 'C' ? 'text-amber-400 font-bold scale-105' : ''}`}>เบอร์เกรด C = เบอร์ทั่วไป</div>
                <div className={`${grade === 'D' ? 'text-orange-400 font-bold scale-105' : ''}`}>เบอร์เกรด D = เบอร์ค่อนข้างเหนื่อย</div>
                <div className={`${grade === 'F' ? 'text-rose-400 font-bold scale-105' : ''}`}>เบอร์เกรด F = เบอร์เหนื่อยเปล่า</div>
            </div>
        </div>
    );
};

interface PhoneAnalysisResultProps {
    result: IPhoneAnalysisResult;
    onReset?: () => void;
    aiAnalysis?: PhoneAiAnalysis | null;
    aiLoading?: boolean;
    aiProfession?: string;
    onAiProfessionChange?: (value: string) => void;
    onRequestAiAnalysis?: () => void;
}

export const PhoneAnalysisResult: React.FC<PhoneAnalysisResultProps> = ({
    result,
    onReset,
    aiAnalysis = null,
    aiLoading = false,
    aiProfession = '',
    onAiProfessionChange,
    onRequestAiAnalysis,
}) => {
    const [isCopied, setIsCopied] = useState(false);

    // Split pairs into Good/Neutral vs Bad
    const goodPairs = result.pairs.filter(p => p.level !== 2);
    const badPairs = result.pairs.filter(p => p.level === 2);

    const handleShare = (platform: 'facebook' | 'line' | 'copy') => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const title = `ผลวิเคราะห์เบอร์มงคล: ${result.phoneNumber} - เกรด ${result.grade}`;

        if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank', 'noopener,noreferrer');
        } else if (platform === 'line') {
            window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(url).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    return (
        <div className="w-full max-w-4xl animate-fade-in space-y-4 pb-8">

            {/* Main Result Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 lg:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Number & Analysis Boxes */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="text-center lg:text-left">
                            <h2 className="text-amber-500 font-medium tracking-wide uppercase text-[10px] mb-1">ผลวิเคราะห์ทำนายเบอร์</h2>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-mono mb-2 text-shadow-md">
                                {result.phoneNumber}
                            </h1>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-3" />
                        </div>

                        {/* Split Good/Bad Boxes */}
                        <div className="space-y-3">
                            <PairBox type="good" pairs={goodPairs} />

                            {badPairs.length > 0 && (
                                <div className="space-y-2 animate-pulse-gentle">
                                    <PairBox type="bad" pairs={badPairs} />
                                    <div className="flex items-center justify-center gap-2 text-rose-400 bg-rose-500/10 p-1.5 rounded-md border border-rose-500/20 shadow-inner shadow-rose-900/20 text-xs">
                                        <Skull size={14} />
                                        <span className="font-semibold">เบอร์ส่งผลเสีย แนะนำให้เปลี่ยน</span>
                                    </div>

                                    {/* Conversion CTA for Bad Numbers */}
                                    <a
                                        href="/search"
                                        className="block w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-center py-3 rounded-xl font-bold text-sm shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-95 animate-bounce-gentle"
                                    >
                                        เปลี่ยนเบอร์ร้ายให้กลายเป็นดี คลิก!
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Stats Center-Out */}
                    <div className="lg:col-span-7 flex flex-col justify-center gap-4 pl-0 lg:pl-6 relative">
                        {/* Divider for Desktop */}
                        <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden lg:block" />

                        {/* Enhanced Desktop Grade Badge */}
                        <div className="hidden lg:flex items-center gap-5 bg-white/5 p-5 rounded-3xl border border-white/5 mb-2 self-center w-full max-w-md relative group overflow-hidden backdrop-blur-sm">
                            <div className={`absolute inset-0 opacity-10 blur-xl transition-opacity group-hover:opacity-20
                                ${result.grade.startsWith('A') ? 'bg-emerald-500' :
                                    result.grade.startsWith('B') ? 'bg-blue-500' : 'bg-amber-500'}
                             `} />

                            <div className={`
                                w-20 h-20 shrink-0 rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl border-[3px] border-white/10 relative z-10
                                ${result.grade.startsWith('A') ? 'bg-gradient-to-br from-emerald-500 to-emerald-800' :
                                    result.grade.startsWith('B') ? 'bg-gradient-to-br from-blue-500 to-blue-800' :
                                        'bg-gradient-to-br from-amber-500 to-amber-800'}
                            `}>
                                <span className="text-4xl font-black leading-none mt-1 drop-shadow-md">{result.grade}</span>
                                <span className="text-[9px] font-bold uppercase opacity-80 mt-0.5">Grade</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">ผลทำนายเกรดเบอร์มงคล</p>
                                <p className="text-white font-semibold text-sm leading-relaxed">{result.prediction}</p>
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <div className="flex items-center justify-between mb-3 px-2">
                                <h3 className="text-base font-bold text-slate-300">กราฟสรุปคะแนน</h3>
                                <div className="flex items-center gap-3 text-[9px] text-slate-500 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                        <span>จุดอ่อน</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span>จุดแข็ง</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 px-1">
                                <StatBar label="การเงิน/การงาน" score={result.stats.finance} icon={TrendingUp} />
                                <StatBar label="โชคลาภ" score={result.stats.luck} icon={Clover} />
                                <StatBar label="เสน่ห์/ความรัก" score={result.stats.love} icon={Heart} />
                                <StatBar label="สุขภาพ" score={result.stats.health} icon={Activity} />
                                <StatBar label="สติปัญญา" score={result.stats.intellect} icon={Brain} />
                                <StatBar label="เซนส์" score={result.stats.sense} icon={Eye} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Pairs Breakdown List */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 px-2">
                    <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
                    <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">ความหมายคู่เลขของคุณ</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.pairs.map((pair, idx) => (
                        <div key={idx} className={`
                            relative overflow-hidden group rounded-2xl border bg-white/5 backdrop-blur-sm transition-all hover:-translate-y-0.5 duration-200
                            ${pair.level === 1
                                ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-emerald-900/5'
                                : pair.level === 2
                                    ? 'border-rose-500/20 hover:border-rose-500/40 shadow-rose-900/5'
                                    : 'border-amber-500/20 hover:border-amber-500/40 shadow-amber-900/5'}
                        `}>
                            {/* Background Glow */}
                            <div className={`
                                absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity
                                ${pair.level === 1 ? 'bg-emerald-500' : pair.level === 2 ? 'bg-rose-500' : 'bg-amber-500'}
                            `} />

                            <div className="flex h-full">
                                {/* Header Section (Number) */}
                                <div className={`
                                    w-24 shrink-0 flex flex-col items-center justify-center gap-1 border-r border-white/5 p-3
                                    ${pair.level === 1 ? 'bg-emerald-500/5' : pair.level === 2 ? 'bg-rose-500/5' : 'bg-amber-500/5'}
                                `}>
                                    <div className={`
                                        text-3xl font-black drop-shadow-sm
                                        ${pair.level === 1 ? 'text-emerald-400' : pair.level === 2 ? 'text-rose-400' : 'text-amber-400'}
                                    `}>
                                        {pair.pair}
                                    </div>
                                    <div className={`
                                        px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide border mt-1
                                        ${pair.level === 1 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                                            pair.level === 2 ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' :
                                                'bg-amber-500/10 border-amber-500/20 text-amber-300'}
                                    `}>
                                        {pair.level === 1 ? 'มงคล' : pair.level === 2 ? 'ระวัง' : 'ทั่วไป'}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 flex-1 relative z-10 flex flex-col justify-center">
                                    <h4 className={`text-sm font-bold mb-1.5 ${pair.level === 1 ? 'text-emerald-300' : pair.level === 2 ? 'text-rose-300' : 'text-amber-300'
                                        }`}>
                                        {pair.title}
                                    </h4>
                                    <div className="text-slate-300 text-xs leading-5 font-normal mb-3 whitespace-pre-line">
                                        {pair.description.split(/(⚠️ ระวัง:|✅ จุดเด่น:)/g).map((part, partIdx, arr) => {
                                            if (part === '⚠️ ระวัง:' || part === '✅ จุดเด่น:') return null;

                                            const prevPart = arr[partIdx - 1];
                                            if (prevPart === '⚠️ ระวัง:') {
                                                return (
                                                    <div key={partIdx} className="mt-2 p-2 rounded-lg bg-rose-950/30 border border-rose-500/20 text-rose-200 text-[11px] shadow-sm">
                                                        <span className="font-bold text-rose-400 block mb-1">⚠️ ระวัง:</span>
                                                        {part.trim()}
                                                    </div>
                                                );
                                            }
                                            if (prevPart === '✅ จุดเด่น:') {
                                                return (
                                                    <div key={partIdx} className="mt-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 text-[11px] shadow-sm">
                                                        <span className="font-bold text-emerald-400 block mb-1">✅ จุดเด่น:</span>
                                                        {part.trim()}
                                                    </div>
                                                );
                                            }
                                            if (part.trim().length > 0) {
                                                return <span key={partIdx}>{part}</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {pair.tags?.slice(0, 3).map((tag, t) => (
                                            <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-black/20 border border-white/5 text-slate-500 transition-colors group-hover:border-white/10 group-hover:text-slate-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Profession-based Analysis */}
            {onRequestAiAnalysis && onAiProfessionChange && (
                <PhoneAiAnalysisSection
                    analysis={aiAnalysis}
                    profession={aiProfession}
                    isLoading={aiLoading}
                    onProfessionChange={onAiProfessionChange}
                    onRequestAnalysis={onRequestAiAnalysis}
                    hasResult={true}
                />
            )}

            {/* Share Section with Hero Banner */}
            <div className="pt-8 space-y-4">
                <div className="flex items-center gap-2 px-2 mb-2">
                    <Share2 className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">แชร์ผลวิเคราะห์ของคุณ</h3>
                </div>

                <SimpleGradeCard grade={result.grade} phoneNumber={result.phoneNumber} />

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row gap-4 items-center shadow-lg">
                    {/* URL Input */}
                    <div className="flex-1 w-full bg-slate-900/50 rounded-xl border border-white/10 flex items-center pl-4 pr-1 py-1.5 relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <LinkIcon size={14} className="text-slate-500" />
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={typeof window !== 'undefined' ? window.location.href : ''}
                            className="bg-transparent text-slate-400 text-sm w-full pl-6 pr-2 py-2.5 outline-none font-mono"
                        />
                        <button
                            onClick={() => handleShare('copy')}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs transition-all
                                ${isCopied
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-slate-700 text-white hover:bg-slate-600'}
                            `}
                        >
                            {isCopied ? <Check size={14} /> : <Copy size={14} />}
                            {isCopied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                        </button>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-2 shrink-0 w-full md:w-auto">
                        <button
                            onClick={() => handleShare('facebook')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#1877F2]/20"
                        >
                            <Facebook size={18} />
                            <span className="md:hidden">Facebook</span>
                        </button>
                        <button
                            onClick={() => handleShare('line')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#06C755]/20"
                        >
                            <LineIcon size={18} />
                            <span className="md:hidden">Line</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={() => {
                        if (onReset) onReset();
                        else window.location.href = '/phone-analysis';
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm transition-all border border-slate-700 hover:border-slate-500"
                >
                    <Search size={16} />
                    ค้นหาเบอร์อื่น
                </button>
            </div>

        </div>
    );
};
