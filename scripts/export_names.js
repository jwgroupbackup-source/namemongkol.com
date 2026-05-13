const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function exportNames() {
    console.log('Fetching names without meaning...');
    
    let allNames = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('auspicious_names')
            .select('name')
            .eq('meaning', 'รอการตรวจสอบ')
            .order('name')
            .range(from, from + pageSize - 1);

        if (error) {
            console.error('Error fetching names:', error);
            return;
        }

        if (data && data.length > 0) {
            allNames = allNames.concat(data.map(d => d.name));
            from += pageSize;
            hasMore = data.length === pageSize;
        } else {
            hasMore = false;
        }
    }

    console.log(`Found ${allNames.length} names without meaning.`);
    
    if (allNames.length === 0) {
        console.log('All names already have meanings!');
        return;
    }

    // Export raw list
    fs.writeFileSync('names_to_translate.txt', allNames.join('\n'), 'utf-8');
    
    // Create chunks of 100 names for easier prompting and better AI accuracy
    const chunkDir = 'export_chunks';
    if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir);
    }
    
    for (let i = 0; i < allNames.length; i += 100) {
        const chunk = allNames.slice(i, i + 100);
        
        const promptTemplate = `คุณคือผู้เชี่ยวชาญด้านนิรุกติศาสตร์และพจนานุกรมฉบับราชบัณฑิตยสถาน
จงแปลความหมายของชื่อมงคลต่อไปนี้ให้กระชับและสละสลวย (ไม่ต้องแสดงการแยกรากศัพท์)
ให้ผลลัพธ์เป็น JSON Array เท่านั้น โดยแต่ละ object ประกอบด้วย "name" และ "meaning"

**คำสั่งสำคัญ (ต้องปฏิบัติตามอย่างเคร่งครัด):**
1. ชื่อชุดนี้เป็นชื่อแปลกหรือสะกดแบบเฉพาะตัว ให้คุณ **"ตีความหมายเชิงชื่อมงคล"** โดยแยกรากศัพท์ (เช่น ฮภัทร = สิ่งประเสริฐยิ่ง, ฬรินทรา = ผู้เป็นใหญ่ที่น่ารัก) หรือเชื่อมโยงความหมายแฝงที่เป็นสิริมงคล
2. ห้ามใช้ความหมายครอบจักรวาลซ้ำๆ กัน (เช่น "ผู้มีความงดงาม เป็นมงคล และนำความเจริญ" ห้ามก๊อปปี้วางเด็ดขาด)
3. ให้แปลให้สละสลวย กระชับ และฟังดูเป็นสิริมงคลที่สุด
4. **ห้ามตอบว่า "รอการตรวจสอบ" เด็ดขาด** ทุกชื่อต้องมีความหมาย!

ตัวอย่าง:
[
  { "name": "ณัฐวัฒน์", "meaning": "นักปราชญ์ผู้มีความเจริญรุ่งเรือง" },
  { "name": "กงศร", "meaning": "ผู้มีความมุ่งมั่นและมีคุณค่า" }
]

รายชื่อที่ต้องการแปล:
${chunk.join(', ')}`;

        fs.writeFileSync(`${chunkDir}/prompt_chunk_${(i/100)+1}.txt`, promptTemplate, 'utf-8');
    }

    console.log('✅ Exported to names_to_translate.txt');
    console.log(`✅ Created ${Math.ceil(allNames.length/100)} prompt files in the /export_chunks/ directory.`);
    console.log('You can copy the contents of the files in export_chunks and paste them into ChatGPT/Claude!');
}

exportNames();
