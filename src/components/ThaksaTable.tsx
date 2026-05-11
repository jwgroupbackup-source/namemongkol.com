import React from 'react';
import { LayoutGrid, AlertCircle, CheckCircle } from 'lucide-react';
import { thaksaMeanings } from '@/data/thaksaMeanings';
import { thaksaConfig } from '@/data/thaksaConfig';
import { ThaksaAnalysisResult } from '@/types';

interface ThaksaTableProps {
    thaksa: ThaksaAnalysisResult;
    day: string;
}

export const ThaksaTable: React.FC<ThaksaTableProps> = ({ thaksa, day }) => {
    // Safety check if day is invalid
    if (!thaksaConfig[day]) return null;

    return (
        <div className="glass-card rounded-2xl p-4 sm:p-6">
            <h4 className="flex items-center gap-2 text-emerald-400 font-semibold mb-4 sm:mb-6 text-sm sm:text-base">
                <LayoutGrid className="w-5 h-5" /> ผังทักษา ({thaksaConfig[day].name})
            </h4>

            <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/80 text-slate-300 text-xs sm:text-sm uppercase">
                            <th className="p-3 sm:p-4 font-semibold border-b border-white/10 w-[15%]">ภูมิ</th>
                            <th className="p-3 sm:p-4 font-semibold border-b border-white/10 w-[45%]">ความหมาย</th>
                            <th className="p-3 sm:p-4 font-semibold border-b border-white/10 w-[20%] text-center">ในชื่อ</th>
                            <th className="p-3 sm:p-4 font-semibold border-b border-white/10 w-[20%] text-center">ในนามสกุล</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs sm:text-sm">
                        {Object.entries(thaksaMeanings).map(([key, info]) => {
                            const matchedName = thaksa.analysis[key];
                            const matchedSurname = thaksa.surnameAnalysis ? thaksa.surnameAnalysis[key] : [];

                            const hasName = matchedName && matchedName.length > 0;
                            const hasSurname = matchedSurname && matchedSurname.length > 0;

                            const isKali = key === 'kali';
                            const isSi = key === 'si';

                            // Row styling
                            let rowBg = 'bg-slate-900/20 hover:bg-slate-800/30';
                            if (isKali) rowBg = 'bg-rose-900/10 hover:bg-rose-900/20';
                            if (isSi) rowBg = 'bg-emerald-900/10 hover:bg-emerald-900/20';

                            return (
                                <tr key={key} className={`thaksa-row transition-colors border-b border-white/5 ${rowBg}`}>
                                    <td className="p-3 sm:p-4">
                                        <span className={`font-semibold ${info.color}`}>
                                            {info.label}
                                        </span>
                                    </td>
                                    <td className="p-3 sm:p-4 text-slate-400 leading-relaxed">
                                        {info.desc}
                                    </td>
                                    {/* Name Column */}
                                    <td className="p-3 sm:p-4 text-center border-l border-white/5">
                                        {hasName ? (
                                            <div className="flex justify-center gap-1 flex-wrap">
                                                {matchedName.map((c, i) => (
                                                    <span key={i} className={`
                                                    inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold
                                                    ${isKali ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/20' :
                                                            isSi ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' :
                                                                'bg-slate-700 text-slate-200'}
                                                `}>
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-600">-</span>
                                        )}
                                    </td>
                                    {/* Surname Column */}
                                    <td className="p-4 text-center border-l border-white/5">
                                        {hasSurname ? (
                                            <div className="flex justify-center gap-1 flex-wrap">
                                                {matchedSurname.map((c, i) => (
                                                    <span key={i} className={`
                                                    inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold
                                                    ${isKali ? 'bg-rose-500/70 text-white shadow-lg shadow-rose-900/20 opacity-90' :
                                                            isSi ? 'bg-emerald-500/70 text-white shadow-lg shadow-emerald-900/20 opacity-90' :
                                                                'bg-slate-700/70 text-slate-200 opacity-90'}
                                                `}>
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-600">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 sm:mt-6 flex items-start gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                {thaksa.hasKali ? (
                    <>
                        <div className="p-2 rounded-full bg-rose-500/10 text-rose-400 shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-rose-200 mb-1 text-sm sm:text-base">ข้อควรระวัง</h5>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                พบอักษร <span className="font-bold text-rose-400 underline">กาลกิณี</span> ในชื่อ {thaksa.kaliChars.length} ตัว ({thaksa.kaliChars.join(', ')})
                                {thaksa.surnameHasKali && (
                                    <> และในนามสกุล {thaksa.surnameKaliChars?.length} ตัว ({thaksa.surnameKaliChars?.join(', ')})</>
                                )}
                                <br />
                                <span className="text-slate-400 text-xs mt-1 block">ถ้าเลี่ยงได้จะดีขึ้นตามความเชื่อส่วนบุคคล</span>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-emerald-200 mb-1 text-sm sm:text-base">มงคลดีเยี่ยม</h5>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                ชื่อนี้ <span className="font-bold text-emerald-400">ไม่พบอักษรกาลกิณี</span> เลย ถือเป็นนิมิตหมายที่ดี
                                <br />
                                <span className="text-slate-400 text-xs mt-1 block">เป็นสัญญาณดีสำหรับการใช้งานชื่อปัจจุบัน</span>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
