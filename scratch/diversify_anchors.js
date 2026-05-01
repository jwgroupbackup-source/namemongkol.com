const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace variations of "เช็คชื่อมงคลหลายชื่อพร้อมกัน" for /name-analysis
// We'll replace the first 3 occurrences with different text to diversify
const targetStr = 'เช็คชื่อมงคลหลายชื่อพร้อมกัน';
const replacements = [
    'วิเคราะห์ชื่อหลายชื่อ Bulk Analysis',
    'เปรียบเทียบชื่อมงคลพร้อมกัน',
    'ตรวจสอบชื่อครบ 4 ศาสตร์'
];

let occurrences = 0;
let newContent = content;

while(newContent.includes(targetStr) && occurrences < replacements.length) {
    newContent = newContent.replace(targetStr, replacements[occurrences]);
    occurrences++;
}

// Replace variations of "วิเคราะห์ชื่อมงคลฟรี" for href="/"
const targetStr2 = 'วิเคราะห์ชื่อมงคลฟรี';
const replacements2 = [
    'เช็คชื่อของคุณฟรี',
    'วิเคราะห์ชื่อ-นามสกุลทันที',
    'ทดสอบชื่อมงคลที่นี่'
];

let occurrences2 = 0;
while(newContent.includes(targetStr2) && occurrences2 < replacements2.length) {
    newContent = newContent.replace(targetStr2, replacements2[occurrences2]);
    occurrences2++;
}

if (occurrences > 0 || occurrences2 > 0) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${occurrences} occurrences of ${targetStr}`);
    console.log(`Updated ${occurrences2} occurrences of ${targetStr2}`);
} else {
    console.log('No matching anchor text found to replace.');
}
