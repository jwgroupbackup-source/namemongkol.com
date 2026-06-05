import { describe, expect, it } from 'vitest';
import { calculateScore } from './calculateScore';
import { analyzePairs } from './numerologyUtils';
import { calculateGrade } from './gradeResult';
import { analyzePhone, analyzePhoneNumber } from './analyzePhone';
import type { PairAnalysis, PairDefinition } from '@/types';

const pair = (grade: PairDefinition['grade']): PairAnalysis => ({
    pair: '15',
    grade,
    level: grade === 'good' ? 1 : grade === 'bad' ? 2 : 0,
    title: grade,
    description: grade,
    tags: [],
});

describe('score and numerology helpers', () => {
    it('returns 0 for empty input', () => {
        expect(calculateScore('')).toBe(0);
    });

    it('ignores unsupported characters', () => {
        expect(calculateScore('# A!')).toBe(1);
    });

    it('sums known characters consistently', () => {
        expect(calculateScore('ABC')).toBe(6);
    });

    it('returns adjacent numerology pairs', () => {
        const result = analyzePairs('ABC');
        expect(result.map(item => item.pair)).toEqual(['12', '23']);
        expect(result.every(item => typeof item.level === 'number')).toBe(true);
    });
});

describe('grade calculation', () => {
    it('forces C when any bad pair exists', () => {
        expect(calculateGrade(99, [pair('good'), pair('bad')])).toBe('C');
    });

    it('returns A+ for auspicious sum with all-good pairs', () => {
        expect(calculateGrade(24, [pair('good'), pair('good')])).toBe('A+');
    });

    it('returns A for auspicious sum with neutral pairs', () => {
        expect(calculateGrade(24, [pair('good'), pair('neutral')])).toBe('A');
    });

    it('returns B for non-auspicious sum without bad pairs', () => {
        expect(calculateGrade(25, [pair('good')])).toBe('B');
    });
});

describe('phone analysis pure logic', () => {
    const definitions: Record<string, PairDefinition> = {
        '23': { grade: 'good', title: 'good', description: 'good', tags: ['การเงิน'] },
        '34': { grade: 'bad', title: 'bad', description: 'bad', tags: ['สุขภาพ'] },
        '45': { grade: 'good', title: 'good', description: 'good', tags: [] },
        '56': { grade: 'neutral', title: 'neutral', description: 'neutral', tags: [] },
        '67': { grade: 'bad', title: 'bad', description: 'bad', tags: [] },
        '78': { grade: 'good', title: 'good', description: 'good', tags: [] },
    };

    it('returns null for invalid public input before DB lookup', async () => {
        await expect(analyzePhone('08123')).resolves.toBeNull();
    });

    it('formats valid numbers and extracts the last 7 digits into pairs', () => {
        const result = analyzePhoneNumber('0812345678', definitions);
        expect(result?.phoneNumber).toBe('081-234-5678');
        expect(result?.pairs.map(item => item.pair)).toEqual(['23', '34', '45', '56', '67', '78']);
    });

    it('marks bad pairs and reflects risk stats', () => {
        const result = analyzePhoneNumber('0812345678', definitions);
        expect(result?.pairs.filter(item => item.level === 2).map(item => item.pair)).toEqual(['34', '67']);
        expect(result?.stats.health.neg).toBeGreaterThan(0);
    });

    it('sets health positive score to 100 when all pairs are good', () => {
        const goodDefinitions = Object.fromEntries(
            ['23', '34', '45', '56', '67', '78'].map(key => [
                key,
                { grade: 'good', title: 'good', description: 'good', tags: [] } satisfies PairDefinition,
            ])
        );

        const result = analyzePhoneNumber('0812345678', goodDefinitions);
        expect(result?.stats.health.pos).toBe(100);
        expect(result?.stats.health.neg).toBe(0);
    });
});
