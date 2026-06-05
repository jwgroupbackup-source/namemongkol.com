import { thaksaConfig } from '@/data/thaksa';
import type { DayKey } from '@/types';
import type { PremiumNameData } from '@/utils/premiumDataParser';

export type LeadingCharType = 'Any' | 'Dech' | 'Si';
export type GenderFilter = 'all' | 'male' | 'female' | 'neutral' | string;

export const THAI_DAY_TO_KEY: Record<string, DayKey> = {
    'อาทิตย์': 'sunday',
    'จันทร์': 'monday',
    'อังคาร': 'tuesday',
    'พุธ(กลางวัน)': 'wednesday',
    'พุธ(กลางคืน)': 'wednesday_night',
    'พฤหัสบดี': 'thursday',
    'ศุกร์': 'friday',
    'เสาร์': 'saturday'
};

export const THAI_LETTERS = [
    'ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ',
    'ด', 'ต', 'ถ', 'ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม', 'ย', 'ร', 'ล', 'ว',
    'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'ฮ',
];

const THAI_LEADING_VOWELS = new Set(['\u0E40', '\u0E41', '\u0E42', '\u0E43', '\u0E44']);

export interface PremiumSearchFilters {
    selectedDay: string;
    selectedGender: GenderFilter;
    targetScore: string;
    leadingCharType: LeadingCharType;
}

export const getFirstConsonant = (name: string): string => {
    if (!name) return '';
    return THAI_LEADING_VOWELS.has(name.charAt(0)) ? name.charAt(1) : name.charAt(0);
};

export const matchesPremiumSearchFilters = (
    item: PremiumNameData,
    filters: PremiumSearchFilters,
    options: { ignoreTargetScore?: boolean } = {}
): boolean => {
    const { selectedDay, selectedGender, targetScore, leadingCharType } = filters;
    const matchesScore = options.ignoreTargetScore || !targetScore || item.totalScore.toString() === targetScore;

    let matchesGender = true;
    if (selectedGender !== 'all') {
        if (selectedGender === 'male' && item.gender !== 'male' && item.gender !== 'neutral') matchesGender = false;
        if (selectedGender === 'female' && item.gender !== 'female' && item.gender !== 'neutral') matchesGender = false;
        if (selectedGender === 'neutral' && item.gender !== 'neutral') matchesGender = false;
    }

    const matchesDay = selectedDay === 'All' || item.suitableDays.includes(selectedDay);
    let matchesLeadingChar = true;
    if (selectedDay !== 'All' && leadingCharType !== 'Any') {
        const dayKey = THAI_DAY_TO_KEY[selectedDay];
        if (dayKey && thaksaConfig[dayKey]) {
            const firstChar = getFirstConsonant(item.name);
            const config = thaksaConfig[dayKey];
            if (leadingCharType === 'Dech') matchesLeadingChar = config.dech.includes(firstChar);
            else if (leadingCharType === 'Si') matchesLeadingChar = config.si.includes(firstChar);
        }
    }

    return Boolean(matchesScore && matchesGender && matchesDay && matchesLeadingChar);
};

export const filterPremiumNames = (
    allNames: PremiumNameData[],
    filters: PremiumSearchFilters
): PremiumNameData[] => {
    return allNames.filter(item => matchesPremiumSearchFilters(item, filters));
};

export const groupPremiumNamesByLetter = (
    names: PremiumNameData[]
): Map<string, PremiumNameData[]> => {
    const group = new Map<string, PremiumNameData[]>();
    names.forEach(item => {
        const letter = getFirstConsonant(item.name);
        if (!letter) return;
        if (!group.has(letter)) group.set(letter, []);
        group.get(letter)!.push(item);
    });
    group.forEach(groupedNames => groupedNames.sort((a, b) => a.name.localeCompare(b.name, 'th')));
    return group;
};

export const getAvailablePremiumLetters = (
    groupedByLetter: Map<string, PremiumNameData[]>
): string[] => THAI_LETTERS.filter(letter => groupedByLetter.has(letter));

export const getUniquePremiumScores = (
    allNames: PremiumNameData[],
    filters: PremiumSearchFilters
): number[] => {
    const scores = new Set<number>();
    allNames.forEach(item => {
        if (matchesPremiumSearchFilters(item, filters, { ignoreTargetScore: true })) {
            scores.add(item.totalScore);
        }
    });
    return Array.from(scores).sort((a, b) => a - b);
};
