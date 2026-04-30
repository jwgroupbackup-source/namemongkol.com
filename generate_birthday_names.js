const fs = require('fs');

// Extract charValues
const charValuesText = fs.readFileSync('./src/data/charValues.ts', 'utf8');
const charValuesMatch = charValuesText.match(/export const charValues: Record<string, number> = ({[\s\S]*?});/);
const charValues = eval('(' + charValuesMatch[1] + ')');

function calculateNumerology(name) {
    let sum = 0;
    for (const char of name) {
        if (charValues[char]) sum += charValues[char];
    }
    return sum;
}

// Extract boy names
const boyNamesText = fs.readFileSync('./src/data/article-boy-names-2569.ts', 'utf8');
const boyNamesMatch = boyNamesText.match(/const nameList: NameEntry\[\] = (\[[\s\S]*?\]);/);
const boyNames = eval('(' + boyNamesMatch[1] + ')');

// Extract girl names
const girlNamesText = fs.readFileSync('./src/data/article-girl-names-2569.ts', 'utf8');
const girlNamesMatch = girlNamesText.match(/const nameList: NameEntry\[\] = (\[[\s\S]*?\]);/);
const girlNames = eval('(' + girlNamesMatch[1] + ')');

// Extract thaksa
const thaksaText = fs.readFileSync('./src/data/thaksaConfig.ts', 'utf8');
const thaksaConfigRaw = thaksaText.replace(/export const VOWELS = (\[.*?\]);/s, "const VOWELS = $1;");
eval(thaksaConfigRaw.replace(/export /g, '').replace('import { ThaksaDayConfig } from \'@/types\';', ''));

const GOOD_NUMS = [14, 15, 19, 24, 28, 35, 36, 39, 41, 42, 45, 46, 51, 53, 54, 55, 56, 59, 61, 63, 65, 78, 82, 89, 91, 96, 99];

function isGoodSum(sum) {
    return GOOD_NUMS.includes(sum);
}

function hasKalakini(name, kalakiniArray) {
    for (const char of kalakiniArray) {
        if (name.includes(char)) return true;
    }
    return false;
}

function getTopNames(names, kali, limit = 7) {
    const valid = names.filter(n => !hasKalakini(n.name, kali) && isGoodSum(calculateNumerology(n.name)));
    return valid.slice(0, limit);
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayColors = {
    monday: 'yellow',
    tuesday: 'pink',
    wednesday: 'emerald',
    thursday: 'orange',
    friday: 'blue',
    saturday: 'purple',
    sunday: 'red'
};

for (const day of days) {
    const kali = thaksaConfig[day].kali;
    const bNames = getTopNames(boyNames, kali, 7);
    const gNames = getTopNames(girlNames, kali, 7);
    console.log(`Day: ${day}`);
    console.log(`Boys: ${bNames.map(n => n.name + '(' + calculateNumerology(n.name) + ')').join(', ')}`);
    console.log(`Girls: ${gNames.map(n => n.name + '(' + calculateNumerology(n.name) + ')').join(', ')}`);
}
