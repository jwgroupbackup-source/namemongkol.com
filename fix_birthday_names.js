const fs = require('fs');

// We will read the TS files and evaluate them, or just copy the logic.
const charValuesText = fs.readFileSync('./src/data/charValues.ts', 'utf8');
let charValuesStr = charValuesText.match(/export const charValues: Record<string, number> = ({[\s\S]*?});/)[1];
const charValues = eval('(' + charValuesStr + ')');

function calculateNumerology(name) {
    let sum = 0;
    for (const char of name) {
        if (charValues[char]) {
            sum += charValues[char];
        }
    }
    return sum;
}

const boyNamesText = fs.readFileSync('./src/data/article-boy-names-2569.ts', 'utf8');
const girlNamesText = fs.readFileSync('./src/data/article-girl-names-2569.ts', 'utf8');

const thaksaConfigText = fs.readFileSync('./src/data/thaksaConfig.ts', 'utf8');
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// We need to fetch good names for each day and each gender.
console.log(calculateNumerology('จิรวัฒน์'));
