import { charValues } from './numerology';

export const getCharValue = (char: string): number | undefined => {
    return charValues[char] ?? charValues[char.toUpperCase()];
};