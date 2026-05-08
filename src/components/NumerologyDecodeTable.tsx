'use client';

import React, { useState } from 'react';
import { Hash, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { charValues } from '@/data/charValues';

/* ─────────────────────────────────────────────────────────── */
/*  Types & Helpers                                             */
/* ─────────────────────────────────────────────────────────── */

interface NumerologyDecodeTableProps {
    name: string;
    surname: string;
    nameScore: number;
    surnameScore: number;
    totalScore: number;
}

interface CharEntry {
    char: string;
    value: number;
}

function parseChars(text: string): CharEntry[] {
    const result: CharEntry[] = [];
    for (const char of text) {
        const val = charValues[char];
        if (val !== undefined) result.push({ char, value: val });
    }
    return result;
}

/* ─────────────────────────────────────────────────────────── */
/*  Color palette (เลข 1-9)                                    */
/* ─────────────────────────────────────────────────────────── */

const VALUE_COLORS: Record<number, {
    bg: string; text: string; border: string;
    headerBg: string; headerText: string; headerBorder: string;
    dot: string;
}> = {
    1: { bg: 'bg-rose-500/10',    text: 'text-rose-300',    border: 'border-rose-500/30',    headerBg: 'bg-rose-500/20',    headerText: 'text-rose-200',    headerBorder: 'border-rose-500/50',    dot: 'bg-rose-400' },
    2: { bg: 'bg-orange-500/10',  text: 'text-orange-300',  border: 'border-orange-500/30',  headerBg: 'bg-orange-500/20',  headerText: 'text-orange-200',  headerBorder: 'border-orange-500/50',  dot: 'bg-orange-400' },
    3: { bg: 'bg-amber-500/10',   text: 'text-amber-300',   border: 'border-amber-500/30',   headerBg: 'bg-amber-500/20',   headerText: 'text-amber-200',   headerBorder: 'border-amber-500/50',   dot: 'bg-amber-400' },
    4: { bg: 'bg-yellow-500/10',  text: 'text-yellow-300',  border: 'border-yellow-500/30',  headerBg: 'bg-yellow-500/20',  headerText: 'text-yellow-200',  headerBorder: 'border-yellow-500/50',  dot: 'bg-yellow-400' },
    5: { bg: 'bg-lime-500/10',    text: 'text-lime-300',    border: 'border-lime-500/30',    headerBg: 'bg-lime-500/20',    headerText: 'text-lime-200',    headerBorder: 'border-lime-500/50',    dot: 'bg-lime-400' },
    6: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30', headerBg: 'bg-emerald-500/20', headerText: 'text-emerald-200', headerBorder: 'border-emerald-500/50', dot: 'bg-emerald-400' },
    7: { bg: 'bg-teal-500/10',    text: 'text-teal-300',    border: 'border-teal-500/30',    headerBg: 'bg-teal-500/20',    headerText: 'text-teal-200',    headerBorder: 'border-teal-500/50',    dot: 'bg-teal-400' },
    8: { bg: 'bg-cyan-500/10',    text: 'text-cyan-300',    border: 'border-cyan-500/30',    headerBg: 'bg-cyan-500/20',    headerText: 'text-cyan-200',    headerBorder: 'border-cyan-500/50',    dot: 'bg-cyan-400' },
    9: { bg: 'bg-violet-500/10',  text: 'text-violet-300',  border: 'border-violet-500/30',  headerBg: 'bg-violet-500/20',  headerText: 'text-violet-200',  headerBorder: 'border-violet-500/50',  dot: 'bg-violet-400' },
};

function getColor(val: number) {
    return VALUE_COLORS[val] ?? {
        bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30',
        headerBg: 'bg-slate-500/20', headerText: 'text-slate-300', headerBorder: 'border-slate-500/50',
        dot: 'bg-slate-400'
    };
}

/* ─────────────────────────────────────────────────────────── */
/*  Sub-component: CharRow                                      */
/* ─────────────────────────────────────────────────────────── */

function CharRow({ label, chars, score }: { label: string; chars: CharEntry[]; score: number }) {
    if (chars.length === 0) return null;
    return (
        <div className="space-y-2">
            <p className="text-slate-400 text-xs font-medium">{label}</p>
            <div className="flex flex-wrap items-center gap-1.5">
                {chars.map((entry, i) => {
                    const col = getColor(entry.value);
                    return (
                        <React.Fragment key={i}>
                            <div className={`flex flex-col items-center px-2 py-1.5 rounded-xl border ${col.bg} ${col.border} min-w-[2.5rem]`}>
                                <span className="text-base sm:text-lg font-bold text-slate-100 leading-none mb-0.5">{entry.char}</span>
                                <span className={`text-xs font-bold ${col.text}`}>{entry.value}</span>
                            </div>
                            {i < chars.length - 1 && (
                                <span className="text-slate-600 text-sm select-none">+</span>
                            )}
                        </React.Fragment>
                    );
                })}
                <span className="text-slate-500 text-sm select-none ml-0.5">=</span>
                <div className="flex flex-col items-center px-3 py-1.5 rounded-xl border bg-white/5 border-white/15 min-w-[2.5rem]">
                    <span className="text-[10px] text-slate-400 leading-none mb-0.5">รวม</span>
                    <span className="text-base font-bold text-slate-100">{score}</span>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── */
/*  Sub-component: NumerologyReferenceGrid                      */
/*  ตารางแสดงค่าตัวอักษรทั้งหมด 1-9 แบบ Card Grid             */
/* ─────────────────────────────────────────────────────────── */

function NumerologyReferenceGrid() {
    // สร้าง Map: เลข → อักขระทั้งหมด
    const groupedChars: Record<number, string[]> = {};
    for (const [char, val] of Object.entries(charValues)) {
        if (!groupedChars[val]) groupedChars[val] = [];
        groupedChars[val].push(char);
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <p className="text-xs text-slate-500 font-medium">ตารางค่าตัวอักษรเลขศาสตร์ (อ้างอิง)</p>
            </div>

            {/* Grid 3 columns on small, adapt larger */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                    const col = getColor(num);
                    const chars = groupedChars[num] ?? [];
                    return (
                        <div
                            key={num}
                            className={`rounded-xl border ${col.border} overflow-hidden`}
                        >
                            {/* Header — เลข */}
                            <div className={`${col.headerBg} ${col.headerBorder} border-b px-2 py-1.5 flex items-center justify-center gap-1.5`}>
                                <span className={`text-lg font-black ${col.headerText} leading-none`}>{num}</span>
                            </div>

                            {/* Body — ตัวอักษร */}
                            <div className={`${col.bg} px-1.5 py-2 flex flex-wrap gap-1 justify-center min-h-[3rem]`}>
                                {chars.map((c, i) => (
                                    <span
                                        key={i}
                                        className={`text-sm sm:text-base font-semibold ${col.text} leading-none`}
                                        title={`${c} = ${num}`}
                                    >
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend dot แสดงสี */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                    const col = getColor(num);
                    return (
                        <div key={num} className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                            <span className={`text-[10px] ${col.text}`}>{num}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main Export                                                 */
/* ─────────────────────────────────────────────────────────── */

export const NumerologyDecodeTable: React.FC<NumerologyDecodeTableProps> = ({
    name,
    surname,
    nameScore,
    surnameScore,
    totalScore,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showRef, setShowRef] = useState(true);

    const nameChars    = parseChars(name.replace(/\s/g, ''));
    const surnameChars = parseChars(surname.replace(/\s/g, ''));

    if (nameChars.length === 0 && surnameChars.length === 0) return null;

    return (
        <div className="glass-card rounded-2xl overflow-hidden">

            {/* ── Header ── */}
            <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/[0.03] transition-colors"
            >
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Hash className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-200">
                        ถอดรหัสเลขศาสตร์
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                        รวม {totalScore}
                    </span>
                </div>
                <div className="text-slate-500 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {/* ── Body ── */}
            {isExpanded && (
                <div className="px-4 sm:px-6 pb-5 space-y-5 border-t border-white/5">

                    {/* ── สูตรคำนวณ ── */}
                    <div className="pt-4 space-y-4">
                        <CharRow
                            label={`ชื่อจริง — "${name}"`}
                            chars={nameChars}
                            score={nameScore}
                        />
                        {surnameChars.length > 0 && (
                            <CharRow
                                label={`นามสกุล — "${surname}"`}
                                chars={surnameChars}
                                score={surnameScore}
                            />
                        )}

                        {/* ผลรวมรวม */}
                        {surnameChars.length > 0 && (
                            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                                <span className="text-xs text-slate-400 shrink-0">ผลรวมชื่อ-สกุล</span>
                                <span className="text-slate-400 text-sm">{nameScore} + {surnameScore}</span>
                                <span className="text-slate-600">=</span>
                                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-base">
                                    {totalScore}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* ── ตารางอ้างอิง: สามารถ toggle ── */}
                    <div>
                        <button
                            onClick={() => setShowRef(prev => !prev)}
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3"
                        >
                            {showRef
                                ? <ChevronUp className="w-3.5 h-3.5" />
                                : <ChevronDown className="w-3.5 h-3.5" />}
                            {showRef ? 'ซ่อนตารางค่าตัวอักษร' : 'แสดงตารางค่าตัวอักษรทั้งหมด'}
                        </button>

                        {showRef && <NumerologyReferenceGrid />}
                    </div>
                </div>
            )}
        </div>
    );
};
