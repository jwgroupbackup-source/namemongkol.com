const fs = require('fs');

const tsContent = fs.readFileSync('./src/data/article-name-by-birthday.ts', 'utf8');
const generatedHtml = fs.readFileSync('generated_sections.html', 'utf8');

// Use a regular expression to match from <!-- วันจันทร์ --> to just before <!-- เลขมงคลตามวัน -->
const regex = /<!-- วันจันทร์ -->[\s\S]*?(?=<!-- เลขมงคลตามวัน -->)/;

const newTsContent = tsContent.replace(regex, generatedHtml + '\n    ');

fs.writeFileSync('./src/data/article-name-by-birthday.ts', newTsContent);
console.log('Replaced content in article-name-by-birthday.ts');
