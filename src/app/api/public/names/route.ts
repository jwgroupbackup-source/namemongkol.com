import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cache the data for 24 hours to improve performance
export const revalidate = 86400;

const getSupabase = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://dummy.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key',
);

export async function GET() {
    const supabase = getSupabase();
    
    try {
        let allData: { name: string; gender: string | null; meaning: string | null }[] = [];
        let from = 0;
        const pageSize = 1000;
        let hasMore = true;

        while (hasMore) {
            const { data, error } = await supabase
                .from('auspicious_names')
                .select('name, gender, meaning')
                .order('name', { ascending: true })
                .range(from, from + pageSize - 1);

            if (error) {
                console.error('API /names fetch error:', error);
                throw error;
            }

            if (data && data.length > 0) {
                allData = allData.concat(data);
                from += pageSize;
                hasMore = data.length === pageSize;
            } else {
                hasMore = false;
            }
        }

        // Return the massive list as JSON
        // Cache heavily at Edge/CDN layer
        return NextResponse.json({
            success: true,
            data: allData
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
            },
        });

    } catch (err) {
        console.error('Failed to fetch /names:', err);
        return NextResponse.json(
            { success: false, data: [] },
            { status: 500 }
        );
    }
}
