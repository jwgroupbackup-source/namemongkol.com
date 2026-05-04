const { createClient } = require('@supabase/supabase-js');
// โหลด environment variables จาก .env.local
require('dotenv').config({ path: '.env.local' });

// แนะนำให้ใช้ Service Role Key เพื่อให้มีสิทธิ์ลบข้อมูลได้โดยไม่ติด RLS (Row Level Security)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ไม่พบตัวแปร NEXT_PUBLIC_SUPABASE_URL หรือ SUPABASE_SERVICE_ROLE_KEY ในไฟล์ .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAnalysisResults() {
  console.log("⏳ กำลังลบข้อมูลทั้งหมดในตาราง analysis_results...");
  
  try {
    // ใช้คำสั่งลบโดยกำหนดเงื่อนไขที่ไม่เท่ากับ 0 (หรือ null) เพื่อให้ตรงกับทุกแถว
    const { data, error } = await supabase
      .from('analysis_results')
      .delete()
      .neq('id', 0); // ลบทุก row ที่ id ไม่เท่ากับ 0

    if (error) {
      console.error("❌ เกิดข้อผิดพลาดในการลบข้อมูล:", error.message);
      return;
    }
    
    console.log("✅ ลบข้อมูลในตาราง analysis_results สำเร็จแล้ว!");
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาด:", err);
  }
}

clearAnalysisResults();
