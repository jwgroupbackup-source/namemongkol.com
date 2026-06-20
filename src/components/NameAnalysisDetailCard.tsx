import { SUM_PREDICTIONS, getSumPrediction } from '@/data/sumPredictions';
import { calculateShadowPower, calculateAyatana6 } from '@/utils/shadowPower';

interface NameAnalysisDetailCardProps {
    firstName: string;
    lastName: string;
}

export const NameAnalysisDetailCard: React.FC<NameAnalysisDetailCardProps> = ({ firstName, lastName }) => {
    // 1. Calculate Shadow Power (Phalang Ngao)
    const firstNameScore = calculateShadowPower(firstName);
    const lastNameScore = calculateShadowPower(lastName);
    const totalScore = firstNameScore + lastNameScore;

    // 2. Calculate Ayatana 6 (from Shadow Power)
    const firstNameAyatana = calculateAyatana6(firstNameScore);
    const lastNameAyatana = calculateAyatana6(lastNameScore);

    // 3. Get Predictions
    const firstNamePred = getSumPrediction(firstNameScore);
    const lastNamePred = getSumPrediction(lastNameScore);
    const totalPred = getSumPrediction(totalScore);

    // 4. Ayatana Predictions (using SUM_PREDICTIONS 0-9 keys)
    const firstNameAyatanaPred = SUM_PREDICTIONS[firstNameAyatana] || { desc: 'ไม่ทราบ' };
    const lastNameAyatanaPred = SUM_PREDICTIONS[lastNameAyatana] || { desc: 'ไม่ทราบ' };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'VERY_GOOD': return 'text-emerald-500';
            case 'GOOD': return 'text-emerald-400';
            case 'NEUTRAL': return 'text-amber-400';
            case 'BAD': return 'text-orange-500';
            case 'VERY_BAD': return 'text-rose-500';
            default: return 'text-slate-400';
        }
    };

    const getScoreColor = (level: string) => {
        switch (level) {
            case 'VERY_GOOD': return 'text-emerald-600 bg-emerald-50';
            case 'GOOD': return 'text-emerald-500 bg-emerald-50';
            case 'NEUTRAL': return 'text-amber-500 bg-amber-50';
            case 'BAD': return 'text-orange-500 bg-orange-50';
            case 'VERY_BAD': return 'text-rose-500 bg-rose-50';
            default: return 'text-slate-500 bg-slate-50';
        }
    };

    const getHeaderColor = (level: string) => {
        switch (level) {
            case 'VERY_GOOD': return 'bg-emerald-700 text-white';
            case 'GOOD': return 'bg-emerald-600 text-white';
            case 'NEUTRAL': return 'bg-amber-600 text-white';
            case 'BAD': return 'bg-orange-600 text-white';
            case 'VERY_BAD': return 'bg-rose-700 text-white';
            default: return 'bg-slate-600 text-white';
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4 font-sans text-[#1a1a3e]">
            {/* Summary Table */}
            <div className="overflow-hidden rounded-xl border border-teal-800">
                <div className="grid grid-cols-5 bg-teal-800 text-white text-center font-bold text-sm sm:text-base">
                    <div className="col-span-2 py-2 border-r border-teal-700">ชื่อ</div>
                    <div className="col-span-2 py-2 border-r border-teal-700">นามสกุล</div>
                    <div className="col-span-1 py-2 flex items-center justify-center">ผลรวมพลังเงา</div>
                </div>
                <div className="grid grid-cols-5 text-center font-bold bg-teal-700 text-amber-300 text-sm">
                    <div className="py-1 border-r border-teal-600">อายตนะ ๖</div>
                    <div className="py-1 border-r border-teal-600">พลังเงา</div>
                    <div className="py-1 border-r border-teal-600">อายตนะ ๖</div>
                    <div className="py-1 border-r border-teal-600">พลังเงา</div>
                    <div className="py-1"></div>
                </div>
                <div className="grid grid-cols-5 text-center bg-white text-lg font-bold">
                    <div className="py-2 border-r border-slate-200">{firstNameAyatana}</div>
                    <div className="py-2 border-r border-slate-200">{firstNameScore}</div>
                    <div className="py-2 border-r border-slate-200">{lastNameAyatana}</div>
                    <div className="py-2 border-r border-slate-200">{lastNameScore}</div>
                    <div className="py-2 flex items-center justify-center text-xl">{totalScore}</div>
                </div>
            </div>

            {/* Name Details */}
            <div className="border-2 border-teal-700 rounded-lg overflow-hidden bg-white">
                <div className="bg-teal-700 text-amber-300 font-bold px-4 py-2 text-lg">
                    พลังอายตนะ และพลังเงา ได้ผลดังนี้
                </div>
                <div className="px-4 py-2 border-b border-slate-200 font-bold text-lg">
                    ชื่อ <span className="text-amber-600">{firstName}</span> อายตนะ 6 คือ เลข {firstNameAyatana}
                </div>
                <div className="p-4 bg-white text-sm sm:text-base text-[#5a5a82] space-y-3">
                    <div>
                        <span className="font-bold">เลขดายตนะ 6 ได้แก่ หมายเลข {firstNameAyatana} : </span>
                        {firstNameAyatanaPred.desc}
                    </div>
                    <hr className="border-slate-100" />
                    <div>
                        <span className="font-bold text-amber-600">พลังเงา {firstName} หมายเลข {firstNameScore} {firstNamePred.title} / </span>
                        {firstNamePred.desc}
                    </div>
                </div>
            </div>

            {/* Surname Details */}
            <div className="border-2 border-teal-700 rounded-lg overflow-hidden bg-white">
                <div className="bg-teal-700 text-amber-300 font-bold px-4 py-2 text-lg">
                    พลังอายตนะ และพลังเงา ได้ผลดังนี้
                </div>
                <div className="px-4 py-2 border-b border-slate-200 font-bold text-lg">
                    นามสกุล <span className="text-amber-600">{lastName}</span> อายตนะ 6 คือ เลข {lastNameAyatana}
                </div>
                <div className="p-4 bg-white text-sm sm:text-base text-[#5a5a82] space-y-3">
                    <div>
                        <span className="font-bold">เลขดายตนะ 6 ได้แก่ หมายเลข {lastNameAyatana} : </span>
                        {lastNameAyatanaPred.desc}
                    </div>
                    <hr className="border-slate-100" />
                    <div className={lastNamePred.level === 'VERY_BAD' ? 'text-slate-800' : ''}>
                        <span className={`font-bold ${getLevelColor(lastNamePred.level)}`}>พลังเงา {lastName} หมายเลข {lastNameScore} {lastNamePred.title} / </span>
                        {lastNamePred.desc}
                    </div>
                </div>
            </div>

            {/* Total Details */}
            <div className="border-2 border-teal-700 rounded-lg overflow-hidden bg-white">
                <div className="bg-teal-700 text-amber-300 font-bold px-4 py-2 text-lg">
                    ผลรวม {firstName} {lastName}
                </div>
                <div className="p-4 bg-white text-sm sm:text-base text-[#5a5a82]">
                    <div className="mb-2">
                        <span className={`font-bold text-xl ${getLevelColor(totalPred.level)}`}>หมายเลข {totalScore} {totalPred.title}</span>
                    </div>
                    <div>
                        {totalPred.desc}
                    </div>
                </div>
            </div>
        </div>
    );
};
