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

// Extract thaksa
const thaksaText = fs.readFileSync('./src/data/thaksaConfig.ts', 'utf8');
const thaksaConfigRaw = thaksaText.replace(/export const VOWELS = (\[.*?\]);/s, "const VOWELS = $1;");
const evalStr = thaksaConfigRaw.replace(/export const thaksaConfig/, 'global.thaksaConfig').replace('import { ThaksaDayConfig } from \'@/types\';', '').replace(': Record<string, ThaksaDayConfig>', '');
eval(evalStr);
const thaksaConfig = global.thaksaConfig;

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

const namesData = JSON.parse(fs.readFileSync('extracted_names.json', 'utf8'));

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

const dayEmojis = {
    monday: '💛',
    tuesday: '🩷',
    wednesday: '💚',
    thursday: '🧡',
    friday: '💙',
    saturday: '💜',
    sunday: '❤️'
};

const dayNamesTh = {
    monday: 'วันจันทร์',
    tuesday: 'วันอังคาร',
    wednesday: 'วันพุธ',
    thursday: 'วันพฤหัสบดี',
    friday: 'วันศุกร์',
    saturday: 'วันเสาร์',
    sunday: 'วันอาทิตย์'
};

const dayIds = {
    monday: 'monday-names',
    tuesday: 'tuesday-names',
    wednesday: 'wednesday-names',
    thursday: 'thursday-names',
    friday: 'friday-names',
    saturday: 'saturday-names',
    sunday: 'sunday-names'
};

function splitSyllables(name) {
    return name.split('').join('-'); // simplistic, just for display since we don't have a real syllable parser
}

let html = '';

for (const day of days) {
    const kali = thaksaConfig[day].kali;
    const bNames = getTopNames(namesData.boys, kali, 7);
    const gNames = getTopNames(namesData.girls, kali, 7);
    
    const color = dayColors[day];
    const emoji = dayEmojis[day];
    const nameTh = dayNamesTh[day];
    const id = dayIds[day];
    
    html += `
    <!-- ${nameTh} -->
    <section id="${id}" class="scroll-mt-24">
        <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-${color}-400 to-${color}-500 flex items-center justify-center shadow-lg shadow-${color}-500/20 text-2xl flex-shrink-0">${emoji}</div>
            <div>
                <h2 class="text-2xl md:text-3xl font-bold text-${color}-400">ชื่อมงคล: ${nameTh}</h2>
                <p class="text-slate-400 text-sm mt-1">ชื่อที่ถูกคัดสรรมาเพื่อให้ผลรวมเลขศาสตร์ดี และไม่มีอักษรกาลกิณีของ${nameTh}</p>
            </div>
        </div>
        
        <div class="flex flex-wrap gap-3 mb-8 bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
            <div class="flex items-center gap-2 text-sm bg-red-500/10 text-red-300 px-3 py-2 rounded-xl border border-red-500/20">
                <span class="font-bold">🚫 ห้าม (กาลกิณี):</span> ${kali.join(' ')}
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Boy Names -->
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-xl">👨</span>
                    <h3 class="text-${color}-400 font-bold text-lg">ชื่อลูกชาย${nameTh}</h3>
                </div>
                <div class="space-y-3">`;

    for (const b of bNames) {
        const sum = calculateNumerology(b.name);
        html += `
                    <div class="bg-slate-800/30 border border-slate-700/50 hover:border-${color}-400/50 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg group flex items-center justify-between">
                        <div>
                            <div class="text-white font-bold text-lg mb-1 group-hover:text-${color}-400 transition-colors">${b.name}</div>
                            <div class="text-slate-400 text-xs">${b.meaning}</div>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-${color}-500/30 text-${color}-400 font-bold shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                            ${sum}
                        </div>
                    </div>`;
    }

    html += `
                </div>
            </div>

            <!-- Girl Names -->
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-xl">👧</span>
                    <h3 class="text-${color}-400 font-bold text-lg">ชื่อลูกสาว${nameTh}</h3>
                </div>
                <div class="space-y-3">`;

    for (const g of gNames) {
        const sum = calculateNumerology(g.name);
        html += `
                    <div class="bg-slate-800/30 border border-slate-700/50 hover:border-${color}-400/50 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg group flex items-center justify-between">
                        <div>
                            <div class="text-white font-bold text-lg mb-1 group-hover:text-${color}-400 transition-colors">${g.name}</div>
                            <div class="text-slate-400 text-xs">${g.meaning}</div>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-${color}-500/30 text-${color}-400 font-bold shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                            ${sum}
                        </div>
                    </div>`;
    }

    html += `
                </div>
            </div>
        </div>
    </section>
`;
}

fs.writeFileSync('generated_sections.html', html);
console.log('Successfully generated HTML blocks');
