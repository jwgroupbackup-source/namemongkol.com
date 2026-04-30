const fs = require('fs');

function extractNamesFromHtml(html) {
    const regex = /<tr[^>]*>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>(.*?)<\/td>.*?<td[^>]*>(.*?)<\/td>.*?<td[^>]*>(.*?)<\/td>.*?<\/tr>/gs;
    const names = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        let nameHTML = match[1];
        let name = nameHTML.replace(/<[^>]*>/g, '').trim();
        name = name.split(' ')[0]; // Take only the name part
        let meaning = match[3].replace(/<[^>]*>/g, '').trim();
        if (name && meaning && !name.includes('ชื่อ')) {
            names.push({ name, meaning });
        }
    }
    
    // Also check lists like <p>1. <strong>ธนเดช</strong> — ผลรวม <span class="text-emerald-400 font-bold">14</span> (คู่มิตรใหญ่) — อำนาจเพราะมีทรัพย์</p>
    const regex2 = /<p>.*?<strong>(.*?)<\/strong>.*?— ผลรวม.*?<span[^>]*>(.*?)<\/span>.*?— (.*?)<\/p>/gs;
    while ((match = regex2.exec(html)) !== null) {
        let name = match[1].trim();
        let meaning = match[3].trim();
        if (name && meaning) {
            names.push({ name, meaning });
        }
    }
    
    // Also check format like: <div><div class="text-white font-bold text-lg mb-1 group-hover:text-amber-400 transition-colors">ปราชญ์ <span class="text-xs text-slate-500 font-normal ml-2">(ปฺราด)</span></div><div class="text-slate-400 text-xs">"ผู้มีปัญญาเฉียบแหลม" ฉลาดล้ำลึก</div></div>
    const regex3 = /<div class="text-white font-bold[^>]*>(.*?)<span.*?<\/div>\s*<div class="text-slate-400 text-xs">(.*?)<\/div>/g;
    while ((match = regex3.exec(html)) !== null) {
        let name = match[1].trim();
        let meaning = match[2].trim();
        if (name && meaning) {
            names.push({ name, meaning });
        }
    }

    return names;
}

const b1 = extractNamesFromHtml(fs.readFileSync('./src/data/article-boy-names-2569.ts', 'utf8'));
const b2 = extractNamesFromHtml(fs.readFileSync('./src/data/article-boy-names-50.ts', 'utf8'));
const g1 = extractNamesFromHtml(fs.readFileSync('./src/data/article-girl-names-2569.ts', 'utf8'));
const g2 = extractNamesFromHtml(fs.readFileSync('./src/data/article-girl-names-50.ts', 'utf8'));

const allBoys = [...b1, ...b2];
const allGirls = [...g1, ...g2];

const uniqueBoys = [];
const seenBoys = new Set();
for (const b of allBoys) {
    if (!seenBoys.has(b.name)) {
        seenBoys.add(b.name);
        uniqueBoys.push(b);
    }
}

const uniqueGirls = [];
const seenGirls = new Set();
for (const g of allGirls) {
    if (!seenGirls.has(g.name)) {
        seenGirls.add(g.name);
        uniqueGirls.push(g);
    }
}

fs.writeFileSync('extracted_names.json', JSON.stringify({ boys: uniqueBoys, girls: uniqueGirls }, null, 2));
console.log('Extracted ' + uniqueBoys.length + ' boys and ' + uniqueGirls.length + ' girls');
