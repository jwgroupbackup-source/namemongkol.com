import { describe, expect, it } from 'vitest';
import {
    filterPremiumNames,
    getAvailablePremiumLetters,
    getFirstConsonant,
    getUniquePremiumScores,
    groupPremiumNamesByLetter,
    type PremiumSearchFilters,
} from './premiumSearchUtils';
import type { PremiumNameData } from '@/utils/premiumDataParser';

const names: PremiumNameData[] = [
    { name: 'เก่ง', totalScore: 14, suitableDays: ['จันทร์'], scoreBreakdown: ['14'], gender: 'male' },
    { name: 'มาลี', totalScore: 24, suitableDays: ['จันทร์', 'ศุกร์'], scoreBreakdown: ['24'], gender: 'female' },
    { name: 'กลาง', totalScore: 36, suitableDays: ['อาทิตย์'], scoreBreakdown: ['36'], gender: 'neutral' },
    { name: 'กานต์', totalScore: 14, suitableDays: ['จันทร์'], scoreBreakdown: ['14'], gender: 'neutral' },
];

const baseFilters: PremiumSearchFilters = {
    selectedDay: 'All',
    selectedGender: 'all',
    targetScore: '',
    leadingCharType: 'Any',
};

describe('premium search helpers', () => {
    it('handles Thai leading vowels when finding the first consonant', () => {
        expect(getFirstConsonant('เก่ง')).toBe('ก');
    });

    it('filters by day, gender, and score', () => {
        const result = filterPremiumNames(names, {
            ...baseFilters,
            selectedDay: 'จันทร์',
            selectedGender: 'male',
            targetScore: '14',
        });

        expect(result.map(item => item.name)).toEqual(['เก่ง', 'กานต์']);
    });

    it('groups by first consonant and sorts names in Thai locale', () => {
        const grouped = groupPremiumNamesByLetter(names);
        expect(grouped.get('ก')?.map(item => item.name)).toEqual(['กลาง', 'กานต์', 'เก่ง']);
        expect(getAvailablePremiumLetters(grouped)).toContain('ก');
    });

    it('returns unique scores while ignoring the active score filter', () => {
        const result = getUniquePremiumScores(names, {
            ...baseFilters,
            selectedDay: 'จันทร์',
            targetScore: '24',
        });

        expect(result).toEqual([14, 24]);
    });
});
