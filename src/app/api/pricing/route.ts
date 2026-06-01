/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600;

const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    return createClient(supabaseUrl, supabaseKey);
};

export async function GET() {
    try {
        const supabase = getSupabase();

        if (!supabase) {
            return NextResponse.json(
                { success: false, tiers: [] },
                {
                    headers: {
                        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                    },
                },
            );
        }

        const { data, error } = await supabase
            .from('pricing_tiers')
            .select('*')
            .order('price', { ascending: true });

        if (error) throw error;

        return NextResponse.json(
            { success: true, tiers: data },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                },
            },
        );

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
