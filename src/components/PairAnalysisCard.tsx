import React from 'react';
import { Activity } from 'lucide-react';
import { PairAnalysis } from '@/types';

interface PairAnalysisCardProps {
    namePairs: PairAnalysis[];
    surnamePairs: PairAnalysis[];
}

export const PairAnalysisCard: React.FC<PairAnalysisCardProps> = ({ namePairs, surnamePairs }) => {
    const [selectedPair, setSelectedPair] = React.useState<PairAnalysis | null>(null);

    const renderPairs = (pairs: PairAnalysis[]) => (
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
            {pairs.map((p, idx) => (
                <div key={idx} className="relative group z-10 hover:z-20">
                    <button
                        onClick={() => setSelectedPair(p)}
                        className={`
                        relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 
                        transition-transform group-hover:scale-110 active:scale-95 cursor-pointer shadow-lg
                        ${p.level === 1 ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' :
                                p.level === 2 ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm' :
                                    'bg-amber-50 border-amber-500 text-amber-600 shadow-sm'}
                    `}
                    >
                        <span className="font-bold text-base sm:text-lg">{p.pair}</span>
                    </button>

                    {/* Hover Tooltip - Desktop Only */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                        <div className="bg-white/95 backdrop-blur-md border border-[#ddddf0] p-4 rounded-xl shadow-lg text-center relative">
                            {/* Arrow */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-[#ddddf0] rotate-45"></div>

                            <h5 className={`font-bold text-lg mb-1 ${p.level === 1 ? 'text-emerald-600' : p.level === 2 ? 'text-rose-600' : 'text-amber-600'}`}>
                                {p.title}
                            </h5>
                            <p className="text-[#5a5a82] text-sm mb-3 leading-relaxed line-clamp-3">
                                {p.description}
                            </p>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {p.tags?.map((tag, t) => (
                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-[#ddddf0] bg-[#f8f8fc] text-[#5a5a82]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <div className="bg-white border border-[#ddddf0] shadow-sm rounded-2xl p-4 sm:p-6 flex flex-col">
                <h4 className="flex items-center gap-2 text-pink-400 font-semibold mb-3 text-sm sm:text-base">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5" /> คู่เลขมงคล (00-99)
                </h4>

                <div className="space-y-4 flex-grow">
                    <div>
                        <p className="text-[#5a5a82] text-xs sm:text-sm mb-2">คู่เลขในชื่อ</p>
                        {namePairs.length > 0 ? renderPairs(namePairs) : <span className="text-[#8e8eaa] text-xs sm:text-sm">ไม่มีคู่ตัวเลข (ชื่อสั้นเกินไป)</span>}
                    </div>
                    {surnamePairs.length > 0 && (
                        <div>
                            <p className="text-[#5a5a82] text-xs sm:text-sm mb-2">คู่เลขในนามสกุล</p>
                            {renderPairs(surnamePairs)}
                        </div>
                    )}
                    <div className="flex gap-3 text-[10px] sm:text-xs text-[#8e8eaa] mt-2 p-2 sm:p-3 rounded-lg bg-[#f8f8fc] overflow-x-auto whitespace-nowrap border border-[#ddddf0]">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border border-emerald-300"></span> ดี</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 border border-amber-300"></span> ทั่วไป</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 border border-rose-300"></span> ระวัง</div>
                    </div>
                </div>
            </div>

            {/* Modal for Details */}
            {selectedPair && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedPair(null)}>
                    <div
                        className="bg-white border border-[#ddddf0] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedPair(null)}
                            className="absolute top-4 right-4 text-[#8e8eaa] hover:text-[#1a1a3e]"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={`
                                w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 text-3xl font-bold shadow-sm
                                ${selectedPair.level === 1 ? 'bg-emerald-50 border-emerald-500 text-emerald-600' :
                                    selectedPair.level === 2 ? 'bg-rose-50 border-rose-500 text-rose-600' :
                                        'bg-amber-50 border-amber-500 text-amber-600'}
                            `}>
                                {selectedPair.pair}
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${selectedPair.level === 1 ? 'text-emerald-600' :
                                selectedPair.level === 2 ? 'text-rose-600' :
                                    'text-amber-600'
                                }`}>
                                {selectedPair.title}
                            </h3>

                            <p className="text-[#5a5a82] mb-6 leading-relaxed">
                                {selectedPair.description}
                            </p>

                            <div className="flex flex-wrap gap-2 justify-center">
                                {selectedPair.tags?.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full border border-[#ddddf0] bg-[#f8f8fc] text-[#5a5a82] text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
