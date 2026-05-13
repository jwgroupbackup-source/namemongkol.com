const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importMeanings() {
    const dataFile = 'translated_meanings.json';
    
    if (!fs.existsSync(dataFile)) {
        console.error(`Error: Could not find ${dataFile}`);
        console.log(`Please create a file named '${dataFile}' containing the translated JSON array from ChatGPT.`);
        return;
    }

    try {
        const fileContent = fs.readFileSync(dataFile, 'utf-8');
        
        // Sometimes ChatGPT outputs markdown code blocks like ```json ... ```
        // We will clean it up before parsing
        let cleanContent = fileContent.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Auto-fix if user pasted multiple arrays like ] [ or missed the closing ] like } [
        cleanContent = cleanContent.replace(/\]\s*\[/g, ',');
        cleanContent = cleanContent.replace(/\}\s*\[/g, '},');
        
        // Auto-fix any number of closing brackets at the end of the file like ] ] ]
        cleanContent = cleanContent.replace(/\][\s\]]*$/g, ']');
        
        const translatedData = JSON.parse(cleanContent);

        if (!Array.isArray(translatedData)) {
            console.error('Error: Data in JSON file is not an array.');
            return;
        }

        console.log(`Found ${translatedData.length} translated names. Updating Database...`);

        let successCount = 0;
        let failCount = 0;

        // Process in batches of 50 to speed it up
        for (let i = 0; i < translatedData.length; i += 50) {
            const batch = translatedData.slice(i, i + 50);
            const promises = batch.map(async (item) => {
                if (!item.name || !item.meaning) return false;
                const { error } = await supabase
                    .from('auspicious_names')
                    .update({ meaning: item.meaning })
                    .eq('name', item.name);
                return !error;
            });
            
            const results = await Promise.all(promises);
            successCount += results.filter(r => r).length;
            failCount += results.filter(r => !r).length;
            console.log(`Processed ${Math.min(i + 50, translatedData.length)} / ${translatedData.length}`);
        }

        console.log(`\nImport Complete! ✅ Updated ${successCount} names. ❌ Failed: ${failCount}`);

    } catch (err) {
        console.error('Error parsing JSON:', err.message);
        console.log('Please make sure translated_meanings.json is valid JSON format.');
    }
}

importMeanings();
