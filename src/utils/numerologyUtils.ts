import { charValues, pairDefinitions } from '../data/numerology';
import { getCharValue } from '../data/numerologyLookup';

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

export interface PairAnalysis {
    pair: string;
    level: number;
    desc: string;
}

// Function to generate pair analysis
export const analyzePairs = (text: string): PairAnalysis[] => {
    if (!text) return [];

    // 1. Convert text to array of values, filtering only valid chars
    const numbers: number[] = [];
    for (const char of text) {
        const value = getCharValue(char);
        if (value !== undefined) {
            numbers.push(value);
        }
    }

    // 2. Create pairs
    const pairs: PairAnalysis[] = [];
    for (let i = 0; i < numbers.length - 1; i++) {
        const pairStr = `${numbers[i]}${numbers[i + 1]}`;
        const info = pairDefinitions[pairStr] || { level: 0, desc: 'ความหมายทั่วไป' };
        pairs.push({
            pair: pairStr,
            ...info
        });
    }
    return pairs;
};
