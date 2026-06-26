import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateScore } from '@/utils/numerologyUtils';
import { analyzeNameSuitability } from '@/utils/thaksaUtils';

const POPULAR_NAMES_REVALIDATE_SECONDS = 86400;

export const revalidate = 86400; // Cache 24 hours

const getSupabase = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://dummy.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key',
);

interface NameItem {
    name: string;
    gender: string;
}

export async function GET() {
    const supabase = getSupabase();
    
    try {
        const { data, error } = await supabase
            .from('auspicious_names')
            .select('name, gender')
            .limit(2000); 

        if (error) {
            console.error('Error fetching popular names:', error);
            throw error;
        }

        if (data && data.length > 0) {
            // สุ่มชื่อจากผลลัพธ์
            const shuffled = (data as NameItem[]).sort(() => 0.5 - Math.random());
            
            const processed = shuffled.map((item) => ({
                name: item.name,
                score: calculateScore(item.name),
                suitable: analyzeNameSuitability(item.name).suitable,
            }));

            // พยายามหาชื่อที่ใช้ได้ 8 วันก่อน
            let filtered = processed.filter(item => item.suitable.length === 8);
            
            // ถ้าได้ไม่ถึง 10 ชื่อ ให้ผ่อนปรนเอาชื่อที่ใช้ได้ 7 วัน หรือ 6 วันมาเติมให้ครบ
            if (filtered.length < 10) {
                filtered = [...filtered, ...processed.filter(item => item.suitable.length === 7)];
            }
            if (filtered.length < 10) {
                filtered = [...filtered, ...processed.filter(item => item.suitable.length === 6)];
            }

            // คัดให้เหลือ 10 ชื่อตามลำดับ
            const top10 = filtered.slice(0, 10).map(({ name, score }) => ({ name, score }));
            
            return NextResponse.json({
                success: true,
                data: top10
            }, {
                headers: {
                    'Cache-Control': `public, s-maxage=${POPULAR_NAMES_REVALIDATE_SECONDS}, stale-while-revalidate=604800`,
                },
            });
        }

        return NextResponse.json({ success: true, data: [] });

    } catch (err) {
        console.error('Failed to fetch /popular-names:', err);
        return NextResponse.json(
            { success: false, data: [] },
            { status: 500 }
        );
    }
}
