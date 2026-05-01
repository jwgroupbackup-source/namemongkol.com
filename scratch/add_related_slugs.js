const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/articles.ts');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const updates = {
  'lucky-names-for-2026-grade-a-plus': "['auspicious-names-by-birthday-2026', 'micro-analysis-lucky-number-pairs', '100-auspicious-boy-names-2569']",
  'case-study-khemanit-name-analysis': "['lucky-names-for-2026-grade-a-plus', 'top-20-popular-thai-names-numerology-analysis']",
  'shadow-power-ayatana-6-meaning': "['what-is-shadow-power', 'what-is-ayatana-6', '4-pillars-of-naming']",
  'micro-analysis-lucky-number-pairs': "['numerology-0-9-power-guide', 'lucky-numbers-2569-guide', 'unfavorable-love-numbers-guide']",
  'naming-style-evolution-5-generations': "['thai-naming-stats-2025-popular-initials', 'history-of-thai-naming-tradition', 'top-20-popular-thai-names-numerology-analysis']",
  'thai-chinese-naming-bazi-five-elements': "['naming-baby-year-of-horse-2569', '4-pillars-of-naming', 'auspicious-names-by-birthday-2026']",
  'top-20-popular-thai-names-numerology-analysis': "['lucky-names-for-2026-grade-a-plus', 'case-study-khemanit-name-analysis', 'auspicious-names-by-birthday-2026']",
  'free-999-auspicious-names-2568': "['auspicious-names-by-birthday-2026', 'lucky-names-for-2026-grade-a-plus', '100-auspicious-women-names-2026']",
  'auspicious-phone-number-guide-2026': "['most-accurate-phone-number-analysis-2026', 'lucky-numbers-2569-guide', 'unfavorable-love-numbers-guide']",
  'thai-naming-stats-2025-popular-initials': "['naming-style-evolution-5-generations', 'history-of-thai-naming-tradition', 'top-20-popular-thai-names-numerology-analysis']",
  'unfavorable-love-numbers-guide': "['lucky-numbers-2569-guide', 'auspicious-phone-number-guide-2026', 'micro-analysis-lucky-number-pairs']",
  'power-of-naming-analysis': "['4-pillars-of-naming', 'history-of-thai-naming-tradition', 'naming-style-evolution-5-generations']",
  'naming-tips-2026-year-of-horse': "['naming-baby-year-of-horse-2569', 'auspicious-names-by-birthday-2026', '4-pillars-of-naming', 'thai-chinese-naming-bazi-five-elements']",
  'forbidden-letters-kalakini': "['check-kalakini-letters-7-days', '4-pillars-of-naming', 'auspicious-names-by-birthday-2026', 'naming-baby-year-of-horse-2569']",
  'what-is-ayatana-6': "['shadow-power-ayatana-6-meaning', 'what-is-shadow-power', '4-pillars-of-naming']",
  'lucky-numbers-2569-guide': "['auspicious-phone-number-guide-2026', 'most-accurate-phone-number-analysis-2026', 'micro-analysis-lucky-number-pairs', 'auspicious-colors-2569-guide']",
  'auspicious-colors-2569-guide': "['lucky-numbers-2569-guide', 'caishen-wallpaper-free-download', '4-pillars-of-naming']",
  '4-pillars-of-naming': "['forbidden-letters-kalakini', 'numerology-0-9-power-guide', 'what-is-shadow-power', 'what-is-ayatana-6', 'check-kalakini-letters-7-days']",
  'numerology-0-9-power-guide': "['micro-analysis-lucky-number-pairs', '4-pillars-of-naming', 'lucky-numbers-2569-guide', 'lucky-names-for-2026-grade-a-plus']",
  'check-kalakini-letters-7-days': "['forbidden-letters-kalakini', '4-pillars-of-naming', 'auspicious-names-by-birthday-2026']",
  'most-accurate-phone-number-analysis-2026': "['auspicious-phone-number-guide-2026', 'lucky-numbers-2569-guide', 'micro-analysis-lucky-number-pairs']",
  'what-is-shadow-power': "['shadow-power-ayatana-6-meaning', 'what-is-ayatana-6', '4-pillars-of-naming']"
};

let modified = false;

// We iterate backwards to keep line numbers intact when we modify
const targetSlugs = Object.keys(updates);

targetSlugs.forEach(slug => {
    const related = updates[slug];
    
    // Find where the slug is defined
    const slugRegex = new RegExp(`slug:\\s*'${slug}'`);
    let slugIndex = -1;
    for(let i = 0; i < lines.length; i++) {
        if(lines[i].match(slugRegex)) {
            slugIndex = i;
            break;
        }
    }
    
    if(slugIndex !== -1) {
        // Look ahead for the next 'content: `' line
        let contentIndex = -1;
        for(let i = slugIndex; i < slugIndex + 30; i++) {
            if(lines[i] && lines[i].includes('content: `')) {
                contentIndex = i;
                break;
            }
        }
        
        if(contentIndex !== -1) {
            // Check if relatedSlugs already exists between slug and content
            let hasRelated = false;
            for(let i = slugIndex; i < contentIndex; i++) {
                if(lines[i] && lines[i].includes('relatedSlugs:')) {
                    hasRelated = true;
                    break;
                }
            }
            
            if(!hasRelated) {
                // Get indent of the content line
                const indentMatch = lines[contentIndex].match(/^(\s+)/);
                const indent = indentMatch ? indentMatch[1] : '        ';
                
                // Insert relatedSlugs right before content
                lines.splice(contentIndex, 0, `${indent}relatedSlugs: ${related},`);
                modified = true;
                console.log(`Added relatedSlugs for ${slug}`);
            } else {
                console.log(`Already has relatedSlugs for ${slug}`);
            }
        } else {
            console.log(`Could not find content: \` for ${slug}`);
        }
    } else {
        console.log(`Could not find slug definition for ${slug}`);
    }
});

if(modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('File successfully updated.');
} else {
    console.log('No modifications were made.');
}
