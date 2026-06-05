import { calculateScore } from './calculateScore';
import { analyzePairs } from './numerologyUtils';
import { thaksaConfig, DayKey } from '../data/thaksa';
import { predictGender, Gender } from './genderPrediction';

export interface PremiumNameData {
    name: string;
    totalScore: number;
    suitableDays: string[];
    scoreBreakdown: string[];
    gender: Gender;
}

const SHORT_DAY_NAMES: Record<DayKey, string> = {
    sunday: 'อาทิตย์',
    monday: 'จันทร์',
    tuesday: 'อังคาร',
    wednesday: 'พุธ(กลางวัน)',
    wednesday_night: 'พุธ(กลางคืน)',
    thursday: 'พฤหัสบดี',
    friday: 'ศุกร์',
    saturday: 'เสาร์'
};

export const parsePremiumNames = (rawData: string): PremiumNameData[] => {
    // Split by newlines and handle potential empty lines
    const lines = rawData.split('\n').map(line => line.trim()).filter(line => line !== '');
    const results: PremiumNameData[] = [];
    const seenNames = new Set<string>();

    for (const name of lines) {
        // Skip comments or empty lines if any slipped through
        if (name.startsWith('//') || !name) continue;

        // Skip duplicates
        if (seenNames.has(name)) continue;
        seenNames.add(name);

        // 1. Calculate Score
        const totalScore = calculateScore(name);

        // 2. Identify Suitable Days (No Kali/Galkinee)
        const suitableDays: string[] = [];
        (Object.keys(thaksaConfig) as DayKey[]).forEach((key) => {
            const dayConfig = thaksaConfig[key];
            const kaliChars = dayConfig.kali;

            // Check if name contains any kali char for this day
            let hasKali = false;
            for (const char of name) {
                if (kaliChars.includes(char)) {
                    hasKali = true;
                    break;
                }
            }

            if (!hasKali) {
                suitableDays.push(SHORT_DAY_NAMES[key]);
            }
        });

        // 3. Generate Score Breakdown (Pairs)
        const pairData = analyzePairs(name);
        // Format: "16🟢"
        const scoreBreakdown = pairData.map(p => `${p.pair}🟢`);

        // 4. Predict Gender
        const gender = predictGender(name);

        results.push({
            name,
            totalScore,
            suitableDays,
            scoreBreakdown,
            gender
        });
    }

    return results;
};
