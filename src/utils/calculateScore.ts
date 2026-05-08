import { charValues } from '@/data/numerology';

export const calculateScore = (text: string): number => {
    if (!text) return 0;
    let score = 0;
    for (const char of text) {
        const value = charValues[char] ?? charValues[char.toUpperCase()];
        if (value !== undefined) {
            score += value;
        }
    }
    return score;
};
