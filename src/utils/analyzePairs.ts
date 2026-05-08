import { charValues } from '@/data/numerology';
import { pairDefinitions } from '@/data/pairDefinitions';
import { PairAnalysis, PairDefinition } from '@/types';

const getPairMeaning = (pair: string): PairDefinition => {
    return pairDefinitions[pair] || {
        grade: 'neutral',
        title: 'ความหมายทั่วไป',
        description: 'ยังไม่มีข้อมูลสำหรับคู่ตัวเลขนี้',
        tags: []
    };
};

export const analyzePairs = (text: string): PairAnalysis[] => {
    if (!text) return [];

    // 1. Convert text to array of values, filtering only valid chars
    const numbers: number[] = [];
    for (const char of text) {
        const value = charValues[char] ?? charValues[char.toUpperCase()];
        if (value !== undefined) {
            numbers.push(value);
        }
    }

    // 2. Create pairs
    const pairs: PairAnalysis[] = [];
    for (let i = 0; i < numbers.length - 1; i++) {
        const pairStr = `${numbers[i]}${numbers[i + 1]}`;
        const info = getPairMeaning(pairStr);

        let level: 0 | 1 | 2 = 0;
        if (info.grade === 'good') level = 1;
        if (info.grade === 'bad') level = 2;

        pairs.push({
            pair: pairStr,
            level,
            ...info
        });
    }
    return pairs;
};
