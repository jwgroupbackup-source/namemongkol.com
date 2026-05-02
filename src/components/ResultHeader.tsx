import Link from 'next/link';
import { Star, User, Sparkles } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface ResultHeaderProps {
    result: AnalysisResult;
}

const GradeBadge = ({ grade }: { grade: 'A+' | 'A' | 'B' | 'C' }) => (
    <div className={`
        w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border shadow-lg backdrop-blur-md
        ${grade === 'A+' ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30' :
            grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                grade === 'B' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    'bg-rose-500/20 text-rose-400 border-rose-500/30'}
    `}>
        {grade}
    </div>
);

export const ResultHeader: React.FC<ResultHeaderProps> = ({ result }) => {
    return (
        <>
            <div className="flex flex-col items-center mb-8 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
                        <User className="w-6 h-6 text-amber-400" />
                    </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 text-center break-words px-2 leading-tight">
                    {result.name} {result.surname}
                </h2>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-6"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="glass-card p-4 rounded-2xl text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.namePrediction.bgGradient}`}></div>
                    {/* Grade Badge */}
                    <div className="flex justify-end mb-1">
                        <GradeBadge grade={result.nameGrade} />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">ผลรวมชื่อ</span>
                    <div className={`text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.namePrediction.bgGradient} mt-2 mb-1`}>
                        {result.nameScore}
                    </div>
                    <div className={`text-xs font-medium ${result.namePrediction.color} mb-1`}>
                        {result.namePrediction.level}
                    </div>
                    <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < result.namePrediction.stars ? result.namePrediction.color + ' fill-current' : 'text-slate-700'}`} />
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                        <p className="text-xs text-slate-400 leading-relaxed">&quot;{result.namePrediction.desc}&quot;</p>

                        {(result.namePrediction.color.includes('rose') ||
                            result.namePrediction.color.includes('red') ||
                            result.namePrediction.color.includes('orange') ||
                            result.namePrediction.color.includes('amber')) && (
                                <Link href="/premium-search" className="block mt-1">
                                    <button className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95">
                                        <div className="relative">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover/btn:text-emerald-300 animate-pulse" />
                                            <div className="absolute inset-0 bg-emerald-400/20 blur-sm rounded-full animate-ping opacity-0 group-hover/btn:opacity-100"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-300 group-hover/btn:text-emerald-200 tracking-wide">เปลี่ยนชื่อมงคล</span>
                                    </button>
                                </Link>
                            )}
                    </div>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.surnamePrediction.bgGradient}`}></div>
                    {/* Grade Badge */}
                    <div className="flex justify-end mb-1">
                        <GradeBadge grade={result.surnameGrade} />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">ผลรวมนามสกุล</span>
                    <div className={`text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.surnamePrediction.bgGradient} mt-2 mb-1`}>
                        {result.surnameScore}
                    </div>
                    <div className={`text-xs font-medium ${result.surnamePrediction.color} mb-1`}>
                        {result.surnamePrediction.level}
                    </div>
                    <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < result.surnamePrediction.stars ? result.surnamePrediction.color + ' fill-current' : 'text-slate-700'}`} />
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-slate-400 leading-relaxed">&quot;{result.surnamePrediction.desc}&quot;</p>
                    </div>
                </div>
            </div>
        </>
    );
};
