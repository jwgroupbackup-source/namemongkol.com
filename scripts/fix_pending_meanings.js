const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPending() {
    const { data, error } = await supabase
        .from('auspicious_names')
        .select('name')
        .eq('meaning', 'รอการตรวจสอบ');

    if (error) {
        console.error(error);
        return;
    }
    console.log(`Found ${data.length} names pending verification.`);
    
    // Print the list of names
    const names = data.map(d => d.name);
    console.log(names.join(', '));
}

checkPending();
