import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const STATS_REVALIDATE_SECONDS = 900;

export const revalidate = 900; // Cache 15 minutes

const fallbackStats = {
    totalAnalyses: 0,
    weeklyAnalyses: 0,
    totalUsers: 0,
    avgRating: 5.0,
    reviewCount: 0,
};

const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    return createClient(supabaseUrl, supabaseKey);
};

async function fetchPublicStats() {
    const supabase = getSupabase();

    if (!supabase) {
        return { success: false, stats: fallbackStats };
    }

    const weekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [analysisRes, weeklyAnalysisRes, usersRes, reviewsRes] = await Promise.all([
        supabase.from('analysis_results').select('*', { count: 'exact', head: true }),
        supabase.from('analysis_results').select('*', { count: 'exact', head: true }).gte('created_at', weekAgoIso),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('rating').eq('status', 'approved'),
    ]);

    const totalAnalyses = analysisRes.count ?? 0;
    const weeklyAnalyses = weeklyAnalysisRes.count ?? 0;
    const totalUsers = usersRes.count ?? 0;

    const reviews = reviewsRes.data ?? [];
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : '5.0';
    const reviewCount = reviews.length;

    return {
        success: true,
        stats: {
            totalAnalyses,
            weeklyAnalyses,
            totalUsers,
            avgRating: parseFloat(avgRating),
            reviewCount,
        },
    };
}

const getCachedPublicStats = unstable_cache(
    fetchPublicStats,
    ['public-stats:v1'],
    { revalidate: STATS_REVALIDATE_SECONDS, tags: ['public-stats'] },
);

export async function GET() {
    try {
        return NextResponse.json(await getCachedPublicStats(), {
            headers: {
                'Cache-Control': `public, s-maxage=${STATS_REVALIDATE_SECONDS}, stale-while-revalidate=3600`,
            },
        });
    } catch {
        return NextResponse.json(
            { success: false, stats: fallbackStats },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                },
            },
        );
    }
}
