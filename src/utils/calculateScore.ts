import { getCharValue } from '@/data/numerologyLookup';

export const calculateScore = (text: string): number => {
    if (!text) return 0;
    let score = 0;
    for (const char of text) {
        const value = getCharValue(char);
        if (value !== undefined) {
            score += value;
        }
    }
    return score;
};
