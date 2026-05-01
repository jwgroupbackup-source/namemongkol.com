const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The articles to modify
const targets = [
    {
        slug: 'what-is-shadow-power',
        html: `\n            <div class="mt-8 p-6 bg-slate-800/80 rounded-xl border border-indigo-500/30">
                <h3 class="text-xl font-bold text-amber-400 mb-3">🛠️ เครื่องมือวิเคราะห์เพิ่มเติม</h3>
                <p class="text-slate-300 mb-2">นอกจากวิเคราะห์ชื่อแล้ว คุณยังสามารถ <a href="/aura-analysis" class="text-indigo-400 font-bold hover:underline">วิเคราะห์ออร่าชื่อ</a> เพื่อดูพลังงานแฝงเบื้องลึกที่ส่งผลต่อตัวคุณ</p>
                <p class="text-slate-300">และหากต้องการเจาะลึกชะตาชีวิตที่ติดตัวมาแต่เกิด ลองใช้ระบบ <a href="/palm-analysis" class="text-amber-400 font-bold hover:underline">วิเคราะห์ลายมือด้วย AI ฟรี</a> ของเราได้เลยครับ</p>
            </div>\n`
    },
    {
        slug: '4-pillars-of-naming',
        html: `\n            <div class="mt-8 p-6 bg-slate-800/80 rounded-xl border border-slate-600/50">
                <p class="text-slate-300">💡 <strong>รู้หรือไม่?</strong> นอกจากศาสตร์เรื่องชื่อแล้ว NameMongkol ยังมีเครื่องมือ <a href="/palm-analysis" class="text-amber-400 font-bold hover:underline">วิเคราะห์ลายมือด้วย AI ฟรี</a> เพื่อดูแนวโน้มชะตาชีวิตที่ติดตัวมาตั้งแต่เกิดอีกด้วย ลองใช้คู่กันเพื่อผลลัพธ์ที่แม่นยำที่สุดครับ</p>
            </div>\n`
    },
    {
        slug: 'auspicious-colors-2569-guide',
        html: `\n            <div class="mt-8 p-6 bg-slate-800/80 rounded-xl border border-slate-600/50">
                <p class="text-slate-300">💡 <strong>เคล็ดลับเสริมดวง:</strong> คุณสามารถใช้สีมงคลร่วมกับการ <a href="/palm-analysis" class="text-amber-400 font-bold hover:underline">ดูลายมือเสริมดวงด้วย AI</a> เพื่อเลือกเส้นทางและสิ่งที่เหมาะสมกับดวงชะตาของคุณมากที่สุด</p>
            </div>\n`
    },
    {
        slug: 'shadow-power-ayatana-6-meaning',
        html: `\n            <div class="mt-8 p-6 bg-slate-800/80 rounded-xl border border-indigo-500/30">
                <p class="text-slate-300">🔮 อย่าลืม <a href="/aura-analysis" class="text-indigo-400 font-bold hover:underline">เช็คออร่าชื่อของคุณ</a> ด้วยระบบ AI ของเรา ว่าชื่อของคุณสื่อถึงพลังงานเชิงบวกที่ดึงดูดความสำเร็จหรือไม่</p>
            </div>\n`
    }
];

let lines = content.split('\n');
let modified = false;

targets.forEach(target => {
    // Find the slug line
    const slugRegex = new RegExp(`slug:\\s*'${target.slug}'`);
    let slugIndex = -1;
    for(let i = 0; i < lines.length; i++) {
        if(lines[i].match(slugRegex)) {
            slugIndex = i;
            break;
        }
    }
    
    if(slugIndex !== -1) {
        // Find the start of content
        let contentStartIndex = -1;
        for(let i = slugIndex; i < slugIndex + 30; i++) {
            if(lines[i] && lines[i].includes('content: `')) {
                contentStartIndex = i;
                break;
            }
        }
        
        if(contentStartIndex !== -1) {
            // Find the end of content `
            let contentEndIndex = -1;
            for(let i = contentStartIndex + 1; i < contentStartIndex + 300; i++) {
                if(lines[i] && lines[i].includes('`,')) {
                    contentEndIndex = i;
                    break;
                }
            }
            
            if(contentEndIndex !== -1) {
                // Insert the HTML before the closing `,
                lines.splice(contentEndIndex, 0, target.html);
                modified = true;
                console.log(`Added tool links for ${target.slug}`);
            } else {
                console.log(`Could not find content end for ${target.slug}`);
            }
        } else {
            console.log(`Could not find content start for ${target.slug}`);
        }
    } else {
        console.log(`Could not find slug for ${target.slug}`);
    }
});

if(modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Successfully updated articles.ts');
} else {
    console.log('No modifications were made.');
}
