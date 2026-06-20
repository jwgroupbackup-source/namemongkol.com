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
        <div className="bg-white border border-[#ddddf0] shadow-sm rounded-2xl p-4 sm:p-6">
            <h4 className="flex items-center gap-2 text-emerald-600 font-semibold mb-4 sm:mb-6 text-sm sm:text-base">
                <LayoutGrid className="w-5 h-5" /> ผังทักษา ({thaksaConfig[day].name})
            </h4>

            <div className="overflow-hidden rounded-xl border border-[#ddddf0]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f8f8fc] text-[#5a5a82] text-xs sm:text-sm uppercase">
                            <th className="p-3 sm:p-4 font-semibold border-b border-[#ddddf0] w-[15%]">ภูมิ</th>
                            <th className="p-3 sm:p-4 font-semibold border-b border-[#ddddf0] w-[45%]">ความหมาย</th>
                            <th className="p-3 sm:p-4 font-semibold border-b border-[#ddddf0] w-[20%] text-center">ในชื่อ</th>
                            <th className="p-3 sm:p-4 font-semibold border-b border-[#ddddf0] w-[20%] text-center">ในนามสกุล</th>
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
                            let rowBg = 'bg-white hover:bg-[#f8f8fc]';
                            if (isKali) rowBg = 'bg-rose-50/30 hover:bg-rose-50';
                            if (isSi) rowBg = 'bg-emerald-50/30 hover:bg-emerald-50';

                            return (
                                <tr key={key} className={`thaksa-row transition-colors border-b border-[#ddddf0] ${rowBg}`}>
                                    <td className="p-3 sm:p-4">
                                        <span className={`font-semibold ${info.color.replace('400', '600').replace('300', '600').replace('slate', 'gray')}`}>
                                            {info.label}
                                        </span>
                                    </td>
                                    <td className="p-3 sm:p-4 text-[#5a5a82] leading-relaxed">
                                        {info.desc}
                                    </td>
                                    {/* Name Column */}
                                    <td className="p-3 sm:p-4 text-center border-l border-[#ddddf0]">
                                        {hasName ? (
                                            <div className="flex justify-center gap-1 flex-wrap">
                                                {matchedName.map((c, i) => (
                                                    <span key={i} className={`
                                                    inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold shadow-sm
                                                    ${isKali ? 'bg-rose-500 text-white' :
                                                            isSi ? 'bg-emerald-500 text-white' :
                                                                'bg-[#e2e2ec] text-[#1a1a3e]'}
                                                `}>
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[#8e8eaa]">-</span>
                                        )}
                                    </td>
                                    {/* Surname Column */}
                                    <td className="p-4 text-center border-l border-[#ddddf0]">
                                        {hasSurname ? (
                                            <div className="flex justify-center gap-1 flex-wrap">
                                                {matchedSurname.map((c, i) => (
                                                    <span key={i} className={`
                                                    inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold shadow-sm opacity-90
                                                    ${isKali ? 'bg-rose-400 text-white' :
                                                            isSi ? 'bg-emerald-400 text-white' :
                                                                'bg-[#e2e2ec]/80 text-[#5a5a82]'}
                                                `}>
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[#8e8eaa]">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 sm:mt-6 flex items-start gap-4 bg-[#f8f8fc] p-4 rounded-xl border border-[#ddddf0]">
                {thaksa.hasKali ? (
                    <>
                        <div className="p-2 rounded-full bg-rose-50 text-rose-500 shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-rose-700 mb-1 text-sm sm:text-base">ข้อควรระวัง</h5>
                            <p className="text-sm text-[#5a5a82] leading-relaxed">
                                พบอักษร <span className="font-bold text-rose-600 underline">กาลกิณี</span> ในชื่อ {thaksa.kaliChars.length} ตัว ({thaksa.kaliChars.join(', ')})
                                {thaksa.surnameHasKali && (
                                    <> และในนามสกุล {thaksa.surnameKaliChars?.length} ตัว ({thaksa.surnameKaliChars?.join(', ')})</>
                                )}
                                <br />
                                <span className="text-[#8e8eaa] text-xs mt-1 block">ถ้าเลี่ยงได้จะดีขึ้นตามความเชื่อส่วนบุคคล</span>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-2 rounded-full bg-emerald-50 text-emerald-500 shrink-0">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-emerald-700 mb-1 text-sm sm:text-base">มงคลดีเยี่ยม</h5>
                            <p className="text-sm text-[#5a5a82] leading-relaxed">
                                ชื่อนี้ <span className="font-bold text-emerald-600">ไม่พบอักษรกาลกิณี</span> เลย ถือเป็นนิมิตหมายที่ดี
                                <br />
                                <span className="text-[#8e8eaa] text-xs mt-1 block">เป็นสัญญาณดีสำหรับการใช้งานชื่อปัจจุบัน</span>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
