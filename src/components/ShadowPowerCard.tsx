import React from 'react';
import { Sparkles } from 'lucide-react';
import { SUM_PREDICTIONS, getSumPrediction } from '@/data/sumPredictions';
import { calculateShadowPower, calculateAyatana6 } from '@/utils/shadowPower';

interface ShadowPowerCardProps {
    name: string;
    surname: string;
}

export const ShadowPowerCard: React.FC<ShadowPowerCardProps> = ({ name, surname }) => {
    // 1. Calculate Shadow Power (Phalang Ngao)
    const firstNameScore = calculateShadowPower(name);
    const lastNameScore = calculateShadowPower(surname);
    const totalScore = firstNameScore + lastNameScore;

    // 2. Calculate Ayatana 6 (from Shadow Power)
    const firstNameAyatana = calculateAyatana6(firstNameScore);
    const lastNameAyatana = calculateAyatana6(lastNameScore);

    // 3. Get Predictions
    const firstNamePred = getSumPrediction(firstNameScore);
    const lastNamePred = getSumPrediction(lastNameScore);
    const totalPred = getSumPrediction(totalScore);

    // 4. Ayatana Predictions
    const firstNameAyatanaPred = SUM_PREDICTIONS[firstNameAyatana];
    const lastNameAyatanaPred = SUM_PREDICTIONS[lastNameAyatana];

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'VERY_GOOD': return 'text-emerald-600';
            case 'GOOD': return 'text-emerald-600';
            case 'NEUTRAL': return 'text-amber-600';
            case 'BAD': return 'text-orange-600';
            case 'VERY_BAD': return 'text-rose-600';
            default: return 'text-[#5a5a82]';
        }
    };

    const compactDesc = (text?: string) => {
        if (!text) return '';
        return text.replace(/\s+/g, ' ').split('。')[0].split('. ')[0].trim();
    };

    return (
        <div className="space-y-6 animate-fade-in-up font-sans">

            {/* Mobile: condensed summary */}
            <div className="lg:hidden rounded-2xl overflow-hidden shadow-sm border border-[#ddddf0] bg-white">
                <div className="bg-[#f8f8fc] px-4 py-3 border-b border-[#ddddf0] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-[#1a1a3e] text-sm">พลังเงา & อายตนะ 6</h3>
                </div>
                <div className="p-4 space-y-3 text-sm text-[#5a5a82]">
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#ddddf0] bg-[#f8f8fc] px-3 py-2">
                        <span className="text-[#8e8eaa]">ชื่อ</span>
                        <div className="text-right">
                            <div className="font-semibold text-[#1a1a3e]">{name}</div>
                            <div className={`text-xs ${getLevelColor(firstNamePred.level)}`}>อายตนะ {firstNameAyatana}, พลังเงา {firstNameScore}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#ddddf0] bg-[#f8f8fc] px-3 py-2">
                        <span className="text-[#8e8eaa]">นามสกุล</span>
                        <div className="text-right">
                            <div className="font-semibold text-[#1a1a3e]">{surname}</div>
                            <div className={`text-xs ${getLevelColor(lastNamePred.level)}`}>อายตนะ {lastNameAyatana}, พลังเงา {lastNameScore}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
                        <span className="text-[#8e8eaa]">รวม</span>
                        <div className="text-right">
                            <div className="font-semibold text-amber-600">{totalScore}</div>
                            <div className={`text-xs ${getLevelColor(totalPred.level)}`}>{totalPred.title}</div>
                        </div>
                    </div>
                    <p className="text-xs text-[#5a5a82] leading-relaxed line-clamp-2">{compactDesc(totalPred.desc)}</p>
                </div>
            </div>

            {/* Desktop summary table */}
            <div className="hidden lg:block rounded-xl overflow-hidden shadow-sm border border-[#ddddf0]">
                {/* Header */}
                <div className="grid grid-cols-5 bg-[#f8f8fc] text-[#1a1a3e] text-xs sm:text-sm font-bold border-b border-[#ddddf0]">
                    <div className="col-span-2 py-3 text-center border-r border-[#ddddf0] flex flex-col justify-center">
                        <span className="text-[#8e8eaa] text-[10px] font-normal mb-0.5">ส่วนที่ 1</span>
                        <span>ชื่อ</span>
                    </div>
                    <div className="col-span-2 py-3 text-center border-r border-[#ddddf0] flex flex-col justify-center">
                        <span className="text-[#8e8eaa] text-[10px] font-normal mb-0.5">ส่วนที่ 2</span>
                        <span>นามสกุล</span>
                    </div>
                    <div className="col-span-1 py-3 text-center flex flex-col justify-center bg-amber-50">
                        <span className="text-[#8e8eaa] text-[10px] font-normal mb-0.5">รวม</span>
                        <span>ผลลัพธ์</span>
                    </div>
                </div>
                {/* Sub Header */}
                <div className="grid grid-cols-5 text-center text-[10px] sm:text-xs text-[#5a5a82] bg-white border-b border-[#ddddf0]">
                    <div className="py-2 border-r border-[#ddddf0] bg-white">อายตนะ ๖</div>
                    <div className="py-2 border-r border-[#ddddf0] bg-[#f8f8fc]">พลังเงา</div>
                    <div className="py-2 border-r border-[#ddddf0] bg-white">อายตนะ ๖</div>
                    <div className="py-2 border-r border-[#ddddf0] bg-[#f8f8fc]">พลังเงา</div>
                    <div className="py-2 bg-amber-50/50 font-bold text-amber-600">พลังเงา</div>
                </div>
                {/* Values */}
                <div className="grid grid-cols-5 text-center text-lg sm:text-xl font-bold bg-white text-[#1a1a3e]">
                    <div className="py-4 border-r border-[#ddddf0] flex items-center justify-center bg-white">{firstNameAyatana}</div>
                    <div className="py-4 border-r border-[#ddddf0] flex items-center justify-center bg-[#f8f8fc] text-amber-600">{firstNameScore}</div>
                    <div className="py-4 border-r border-[#ddddf0] flex items-center justify-center bg-white">{lastNameAyatana}</div>
                    <div className="py-4 border-r border-[#ddddf0] flex items-center justify-center bg-[#f8f8fc] text-amber-600">{lastNameScore}</div>
                    <div className="py-4 flex items-center justify-center bg-amber-50 text-amber-600 shadow-sm text-2xl">{totalScore}</div>
                </div>
            </div>

            {/* Desktop detail cards */}
            <div className="hidden lg:block space-y-4">

                {/* Name Card */}
                <div className="rounded-xl overflow-hidden shadow-sm border border-[#ddddf0] bg-white">
                    <div className="bg-[#f8f8fc] px-4 py-2 border-b border-[#ddddf0] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h3 className="font-bold text-[#1a1a3e] text-sm sm:text-base">พลังอายตนะและพลังเงา</h3>
                    </div>
                    <div className="bg-white px-4 py-2 border-b border-[#ddddf0]">
                        <span className="text-[#5a5a82] font-bold">ชื่อ <span className="text-[#1a1a3e]">{name}</span> ได้อายตนะ {firstNameAyatana}</span>
                    </div>
                    <div className="p-4 bg-white text-[#5a5a82] text-sm leading-relaxed space-y-3">
                        <div>
                            <span className="text-indigo-600 font-bold">อายตนะ {firstNameAyatana}:</span> {compactDesc(firstNameAyatanaPred?.desc)}
                        </div>
                        <div className="h-px bg-[#ddddf0]"></div>
                        <div>
                            <span className={`font-bold ${getLevelColor(firstNamePred.level)}`}>พลังเงา {name} หมายเลข {firstNameScore} {firstNamePred.title} /</span> {compactDesc(firstNamePred.desc)}
                        </div>
                    </div>
                </div>

                {/* Surname Card */}
                <div className="rounded-xl overflow-hidden shadow-sm border border-[#ddddf0] bg-white">
                    <div className="bg-[#f8f8fc] px-4 py-2 border-b border-[#ddddf0] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h3 className="font-bold text-[#1a1a3e] text-sm sm:text-base">พลังอายตนะและพลังเงา</h3>
                    </div>
                    <div className="bg-white px-4 py-2 border-b border-[#ddddf0]">
                        <span className="text-[#5a5a82] font-bold">นามสกุล <span className="text-[#1a1a3e]">{surname}</span> ได้อายตนะ {lastNameAyatana}</span>
                    </div>
                    <div className="p-4 bg-white text-[#5a5a82] text-sm leading-relaxed space-y-3">
                        <div>
                            <span className="text-indigo-600 font-bold">อายตนะ {lastNameAyatana}:</span> {compactDesc(lastNameAyatanaPred?.desc)}
                        </div>
                        <div className="h-px bg-[#ddddf0]"></div>
                        <div>
                            <span className={`font-bold ${getLevelColor(lastNamePred.level)}`}>พลังเงา {surname} หมายเลข {lastNameScore} {lastNamePred.title} /</span> {compactDesc(lastNamePred.desc)}
                        </div>
                    </div>
                </div>

                {/* Total Card */}
                <div className="rounded-xl overflow-hidden shadow-sm border border-[#ddddf0] bg-white">
                    <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                        <h3 className="font-bold text-amber-600 text-sm sm:text-base">ผลรวม {name} {surname}</h3>
                    </div>
                    <div className="p-4 bg-white text-[#5a5a82] text-sm leading-relaxed">
                        <div className="mb-2">
                            <span className={`font-bold text-lg ${getLevelColor(totalPred.level)}`}>หมายเลข {totalScore} {totalPred.title}</span>
                        </div>
                        <div>
                            {compactDesc(totalPred.desc)}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
