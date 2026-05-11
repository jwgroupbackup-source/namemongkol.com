import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache 5 minutes

const getSupabase = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

export async function GET() {
    const supabase = getSupabase();
    try {
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

        return NextResponse.json({
            success: true,
            stats: {
                totalAnalyses,
                weeklyAnalyses,
                totalUsers,
                avgRating: parseFloat(avgRating),
                reviewCount,
            },
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch {
        return NextResponse.json(
            { success: false, stats: { totalAnalyses: 0, weeklyAnalyses: 0, totalUsers: 0, avgRating: 5.0, reviewCount: 0 } },
            { status: 500 },
        );
    }
}
