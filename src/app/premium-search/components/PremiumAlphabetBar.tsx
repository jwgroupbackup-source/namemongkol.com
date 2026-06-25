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
        <div className="relative z-20 animate-fade-in-up xl:sticky xl:top-28">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-[#f7fbf6] to-transparent xl:hidden" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-[#f7fbf6] to-transparent xl:hidden" />

            <div className="overflow-x-auto rounded-2xl border border-emerald-200/80 bg-white/85 p-2 shadow-[0_18px_44px_rgba(16,185,129,0.08)] scrollbar-none sm:p-3 xl:overflow-visible xl:p-5">
                <div className="hidden xl:mb-4 xl:block">
                    <p className="text-sm font-bold text-[#1a1a3e]">เลือกหมวดอักษร</p>
                    <p className="mt-1 text-xs text-[#5a5a82]">{availableLetters.length} หมวดที่ตรงเงื่อนไข</p>
                </div>

                <div className="grid w-max grid-flow-col grid-rows-3 gap-1.5 sm:gap-2 xl:w-full xl:grid-flow-row xl:grid-cols-3 xl:grid-rows-none">
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
                                        inline: 'center',
                                    });
                                }}
                                className={`group relative flex min-w-[3.25rem] flex-col items-center justify-center rounded-xl border px-1.5 py-1.5 transition-all duration-300 sm:min-w-[3.75rem] sm:px-2 sm:py-2 xl:min-w-0 xl:py-3 ${
                                    isSelected
                                        ? 'border-emerald-300 bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-50 shadow-[0_12px_28px_rgba(16,185,129,0.16)]'
                                        : 'border-emerald-100 bg-white/70 hover:border-emerald-200 hover:bg-emerald-50/60'
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute left-1/2 top-0 h-1 w-4 -translate-x-1/2 rounded-b-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.35)]" />
                                )}

                                <span className={`mb-0.5 text-lg font-black leading-none transition-colors sm:text-xl xl:mb-1 xl:text-3xl ${
                                    isSelected ? 'text-emerald-800' : 'text-[#5a5a82] group-hover:text-[#1a1a3e]'
                                }`}>
                                    {letter}
                                </span>
                                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-tight transition-colors sm:text-[10px] xl:px-2 xl:text-xs ${
                                    isSelected ? 'bg-white/80 text-emerald-700' : 'bg-emerald-50 text-[#5a5a82] group-hover:bg-white group-hover:text-emerald-700'
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
