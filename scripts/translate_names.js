const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

// 1. Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Setup Google Gemini AI (Make sure to add GEMINI_API_KEY in .env.local)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// The prompt template
const PROMPT = `
คุณคือผู้เชี่ยวชาญด้านนิรุกติศาสตร์และพจนานุกรมฉบับราชบัณฑิตยสถาน 
จงแปลความหมายของชื่อมงคลต่อไปนี้ให้กระชับและสละสลวย (ไม่ต้องแสดงการแยกรากศัพท์)
ให้ผลลัพธ์เป็น JSON Array เท่านั้น โดยแต่ละ object ประกอบด้วย "name" และ "meaning"

ตัวอย่าง:
[
  { "name": "ณัฐวัฒน์", "meaning": "นักปราชญ์ผู้มีความเจริญรุ่งเรือง" },
  { "name": "กงศร", "meaning": "ผู้มีความมุ่งมั่นและมีคุณค่า" }
]

รายชื่อที่ต้องการแปล:
{NAMES_LIST}
`;

async function translateBatch(names) {
    const nameListStr = names.join(', ');
    const promptStr = PROMPT.replace('{NAMES_LIST}', nameListStr);

    try {
        const result = await model.generateContent(promptStr);
        const text = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (error) {
        // Log the full error but re-throw it so main() can handle rate limits properly
        throw error;
    }
}

async function main() {
    console.log('Fetching names without meaning...');
    
    let totalProcessed = 0;
    let hasMore = true;

    while (hasMore) {
        // Fetch names where meaning is null, process in batches of 100
        const { data: namesData, error } = await supabase
            .from('auspicious_names')
            .select('id, name')
            .is('meaning', null)
            .limit(100);

        if (error) {
            console.error('Supabase fetch error:', error);
            return;
        }

        if (!namesData || namesData.length === 0) {
            console.log('No more names to translate. All done!');
            hasMore = false;
            break;
        }

        const namesToTranslate = namesData.map(n => n.name);
        console.log(`Translating batch of ${namesToTranslate.length} names...`);
        
        try {
            const translatedResults = await translateBatch(namesToTranslate);

            if (translatedResults) {
                for (const res of translatedResults) {
                    console.log(`✅ ${res.name}: ${res.meaning}`);
                    await supabase.from('auspicious_names').update({ meaning: res.meaning }).eq('name', res.name);
                }
                totalProcessed += translatedResults.length;
                console.log(`[!] Successfully translated and saved batch. Total processed: ${totalProcessed}\n`);
                
                // Add a small delay to avoid hitting rate limits too fast (5 seconds)
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.log('Failed to parse translation results. Retrying in 10 seconds...');
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        } catch (err) {
            console.error('API Error:', err.message);
            if (err.message && err.message.includes('429')) {
                console.log('Hit rate limit! Pausing for 60 seconds before retrying...');
                await new Promise(resolve => setTimeout(resolve, 60000));
            } else {
                console.log('Unknown error, pausing for 10 seconds...');
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    }
}

main();
