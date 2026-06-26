import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const LIVE_STATS_REVALIDATE_SECONDS = 120;

export const revalidate = 120;

const emptyCounts = {
    analysis: 0,
    wallpaper: 0,
    phone: 0,
    palm: 0,
    premium: 0,
    total: 0,
};

function cacheHeaders() {
    return {
        'Cache-Control': `public, s-maxage=${LIVE_STATS_REVALIDATE_SECONDS}, stale-while-revalidate=300`,
    };
}

// Use service role to bypass RLS for public aggregate counts.
// This route returns no PII, only aggregate counts.
function getServiceClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return null;
    }

    return createClient(
        supabaseUrl,
        supabaseKey,
        { auth: { persistSession: false } },
    );
}

async function fetchLiveStats() {
    const now = new Date();
    const supabase = getServiceClient();

    if (!supabase) {
        return {
            success: false,
            onlineNow: 1,
            totals: { members: 0, analyses: 0 },
            stats: { totalUsers: 0, totalAnalyses: 0, avgRating: 5, reviewCount: 0 },
            counts: emptyCounts,
            ts: now.toISOString(),
        };
    }

    const ago5m = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    const ago30m = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

    const [onlineRes, eventsRes, analysisTotalRes, userTotalRes, reviewsRes] = await Promise.all([
        supabase
            .from('user_action_events')
            .select('session_id')
            .gte('created_at', ago5m),
        supabase
            .from('user_action_events')
            .select('button_key')
            .gte('created_at', ago30m),
        supabase
            .from('analysis_results')
            .select('*', { count: 'exact', head: true }),
        supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true }),
        supabase
            .from('reviews')
            .select('rating')
            .eq('status', 'approved'),
    ]);

    const onlineNow = onlineRes.data
        ? new Set(onlineRes.data.map((row: { session_id: string | null }) => row.session_id).filter(Boolean)).size
        : 0;

    const counts = { ...emptyCounts };

    if (eventsRes.data) {
        for (const row of eventsRes.data as { button_key: string | null }[]) {
            const key = row.button_key ?? '';
            counts.total++;

            if (
                key.startsWith('name_analysis') ||
                key.startsWith('home.') ||
                key.startsWith('search.') ||
                key.startsWith('meaning.')
            ) {
                counts.analysis++;
            } else if (key.startsWith('wallpapers')) {
                counts.wallpaper++;
            } else if (key.startsWith('phone_analysis') || key.startsWith('phone.')) {
                counts.phone++;
            } else if (key.startsWith('palm_analysis') || key.startsWith('aura')) {
                counts.palm++;
            } else if (
                key.startsWith('premium') ||
                key.includes('unlock') ||
                key.includes('topup') ||
                key.includes('deduct')
            ) {
                counts.premium++;
            }
        }
    }

    const totalUsers = userTotalRes.count ?? 0;
    const totalAnalyses = analysisTotalRes.count ?? 0;
    const reviews = reviewsRes.data ?? [];
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, row: { rating: number | null }) => sum + (row.rating ?? 0), 0) / reviews.length
        : 5;

    return {
        success: true,
        onlineNow: Math.max(onlineNow, 1),
        totals: {
            members: totalUsers,
            analyses: totalAnalyses,
        },
        stats: {
            totalUsers,
            totalAnalyses,
            avgRating: Number(avgRating.toFixed(1)),
            reviewCount: reviews.length,
        },
        counts,
        ts: now.toISOString(),
    };
}

const getCachedLiveStats = unstable_cache(
    fetchLiveStats,
    ['live-stats:v1'],
    { revalidate: LIVE_STATS_REVALIDATE_SECONDS, tags: ['live-stats'] },
);

export async function GET() {
    try {
        return NextResponse.json(
            await getCachedLiveStats(),
            { headers: cacheHeaders() },
        );
    } catch (err) {
        console.error('[live-stats]', err);

        return NextResponse.json(
            {
                success: false,
                onlineNow: 1,
                totals: { members: 0, analyses: 0 },
                stats: { totalUsers: 0, totalAnalyses: 0, avgRating: 5, reviewCount: 0 },
                counts: emptyCounts,
                ts: new Date().toISOString(),
            },
            {
                status: 200,
                headers: cacheHeaders(),
            },
        );
    }
}
