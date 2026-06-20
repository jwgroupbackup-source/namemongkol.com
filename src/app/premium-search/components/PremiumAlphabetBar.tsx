'use client';

import React from 'react';
import { PremiumNameData } from '@/utils/premiumDataParser';

interface PremiumAlphabetBarProps {
    availableLetters: string[];
    selectedLetter: string | null;
    setSelectedLetter: (letter: string) => void;
    groupedByLetter: Map<string, PremiumNameData[]>;
}

export default function PremiumAlphabetBar({ availableLetters, selectedLetter, setSelectedLetter, groupedByLetter }: PremiumAlphabetBarProps) {
    if (availableLetters.length === 0) return null;

    return (
        <div className="relative xl:sticky xl:top-28 z-20 animate-fade-in-up">
            {/* Mobile Scroll Indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#f8f8fc] to-transparent pointer-events-none z-10 xl:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f8f8fc] to-transparent pointer-events-none z-10 xl:hidden" />

            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-2 sm:p-3 xl:p-5 shadow-md overflow-x-auto xl:overflow-visible scrollbar-none">
                <div className="hidden xl:mb-4 xl:block">
                    <p className="text-sm font-bold text-slate-200">เลือกหมวดอักษร</p>
                    <p className="mt-1 text-xs text-slate-400">{availableLetters.length} หมวดที่ตรงเงื่อนไข</p>
                </div>
                
                <div className="grid grid-rows-3 grid-flow-col gap-1.5 sm:gap-2 xl:grid-rows-none xl:grid-flow-row xl:grid-cols-3 w-max xl:w-full">
                    {availableLetters.map(letter => {
                        const count = groupedByLetter.get(letter)?.length || 0;
                        const isSelected = selectedLetter === letter;
                        return (
                            <button
                                key={letter}
                                onClick={(e) => {
                                    setSelectedLetter(letter);
                                    e.currentTarget.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'nearest',
                                        inline: 'center'
                                    });
                                }}
                                className={`group relative flex flex-col items-center justify-center min-w-[3.25rem] sm:min-w-[3.75rem] xl:min-w-0 py-1.5 sm:py-2 xl:py-3 px-1.5 sm:px-2 rounded-xl transition-all duration-300 ${
                                    isSelected
                                        ? 'bg-amber-400/10 border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                        : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                            >
                                {/* Selection Indicator */}
                                {isSelected && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-400 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                )}

                                <span className={`text-lg sm:text-xl xl:text-3xl font-black mb-0.5 xl:mb-1 transition-colors leading-none ${
                                    isSelected ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'
                                }`}>
                                    {letter}
                                </span>
                                <span className={`text-[9px] sm:text-[10px] xl:text-xs font-semibold px-1.5 xl:px-2 py-0.5 rounded-full transition-colors leading-tight ${
                                    isSelected ? 'bg-amber-400/20 text-amber-200' : 'bg-white/5 text-slate-500 group-hover:text-slate-400 group-hover:bg-white/10'
                                }`}>
                                    {count} ชื่อ
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
