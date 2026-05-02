import { PairAnalysis } from '@/types';

export const AUSPICIOUS_SUMS = [
    9, 14, 15, 19, 24, 36, 40, 41, 42, 44, 45, 46, 50, 51, 54, 55, 56, 59, 60, 63, 64, 65,
    90, 91, 92, 95, 99, 100, 104, 105
];

export type Grade = 'A+' | 'A' | 'B' | 'C';

export const calculateGrade = (totalScore: number, pairs: PairAnalysis[]): Grade => {
    const hasRed = pairs.some(p => p.grade === 'bad');

    // RED pairs dominate — grade C regardless of sum
    if (hasRed) {
        return 'C';
    }

    const isGoodSum = AUSPICIOUS_SUMS.includes(totalScore);

    // No red, but sum is not auspicious → B
    if (!isGoodSum) {
        return 'B';
    }

    // Good sum, no red — check for neutral (orange-equivalent) pairs
    const hasNeutral = pairs.some(p => p.grade === 'neutral');
    if (hasNeutral) {
        return 'A';
    }

    // Good sum, all pairs are good → A+
    return 'A+';
};
