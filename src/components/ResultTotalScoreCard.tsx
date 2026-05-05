import Link from 'next/link';
import { Star, Sparkles } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface ResultTotalScoreCardProps {
    result: AnalysisResult;
}

export const ResultTotalScoreCard: React.FC<ResultTotalScoreCardProps> = ({ result }) => {
    const displayGrade = result.prediction.color.includes('emerald') ? 'A+' : result.grade;

    return (
        <div className="glass-card rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.prediction.bgGradient}`}></div>

            {/* Badges Row */}
            <div className="flex justify-between items-start w-full relative z-10 mb-1 min-h-[2.5rem]">
                {/* Left: Nirun Badge */}
                <div className="flex-1 flex justify-start">
                    {result.isNirun && (
                        <div className="animate-bounce-slow">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-200 to-yellow-400 shadow-lg shadow-amber-500/20 border border-white/40">
                                <Sparkles className="w-3 h-3 text-amber-900" />
                                <span className="text-[10px] font-extrabold text-amber-900 tracking-wide">นิรันดร์ศาสตร์</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Grade Badge */}
                <div className="flex-1 flex justify-end">
                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border shadow-lg backdrop-blur-md
                        ${displayGrade === 'A+' ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30' :
                            displayGrade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                displayGrade === 'B' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    'bg-rose-500/20 text-rose-400 border-rose-500/30'}
                    `}>
                        {displayGrade}
                    </div>
                </div>
            </div>

            <h3 className="text-sm text-slate-400 mb-1">ผลรวมชื่อ-สกุล</h3>
            <div className={`text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.prediction.bgGradient} mb-2`}>
                {result.totalScore}
            </div>
            <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < result.prediction.stars ? result.prediction.color.replace('text-', 'text-') + ' fill-current' : 'text-slate-700'}`} />
                ))}
            </div>

            <div className="text-slate-300 text-xs leading-relaxed px-2 mb-2 flex-grow">
                &quot;{result.prediction.desc}&quot;
            </div>
            <div className="flex flex-col items-center gap-2 mt-auto">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-800 ${result.prediction.color}`}>
                    {result.prediction.level}
                </span>

                {/* Upsell for Orange/Red/Amber/Rose scores */}
                {(result.prediction.color.includes('orange') ||
                    result.prediction.color.includes('red') ||
                    result.prediction.color.includes('rose') ||
                    result.prediction.color.includes('amber')) && (
                        <Link
                            href="/premium-analysis"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5 hover:shadow-amber-500/30"
                        >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="font-bold text-xs">ออกแบบชื่อมงคลใหม่</span>
                        </Link>
                    )}
            </div>
        </div>
    );
};
