/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const PRICING_REVALIDATE_SECONDS = 86400;

export const revalidate = 86400;

const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    return createClient(supabaseUrl, supabaseKey);
};

async function fetchPricingTiers() {
    const supabase = getSupabase();

    if (!supabase) {
        return { success: false, tiers: [] };
    }

    const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('price', { ascending: true });

    if (error) throw error;

    return { success: true, tiers: data };
}

const getCachedPricingTiers = unstable_cache(
    fetchPricingTiers,
    ['pricing-tiers:v1'],
    { revalidate: PRICING_REVALIDATE_SECONDS, tags: ['pricing'] },
);

export async function GET() {
    try {
        return NextResponse.json(
            await getCachedPricingTiers(),
            {
                headers: {
                    'Cache-Control': `public, s-maxage=${PRICING_REVALIDATE_SECONDS}, stale-while-revalidate=604800`,
                },
            },
        );

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
