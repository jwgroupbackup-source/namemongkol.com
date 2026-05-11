import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Use service role to bypass RLS for public aggregate counts.
// This route returns NO PII — only aggregate counts.
function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } },
    );
}

export async function GET() {
    try {
        const supabase = getServiceClient();

        const now = new Date();
        const ago5m = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
        const ago30m = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

        // 1. Online users — distinct session_ids in last 5 minutes
        const { data: onlineSessions } = await supabase
            .from('user_action_events')
            .select('session_id')
            .gte('created_at', ago5m);

        const onlineNow = onlineSessions
            ? new Set(onlineSessions.map((r: { session_id: string }) => r.session_id)).size
            : 0;

        // 2. Activity counts in last 30 minutes, bucketed by feature area
        const { data: events30m } = await supabase
            .from('user_action_events')
            .select('button_key')
            .gte('created_at', ago30m);

        const counts = {
            analysis: 0,
            wallpaper: 0,
            phone: 0,
            palm: 0,
            premium: 0,
            total: 0,
        };

        if (events30m) {
            for (const row of events30m as { button_key: string }[]) {
                const k = row.button_key ?? '';
                counts.total++;
                if (
                    k.startsWith('name_analysis') ||
                    k.startsWith('home.') ||
                    k.startsWith('search.') ||
                    k.startsWith('meaning.')
                ) {
                    counts.analysis++;
                } else if (k.startsWith('wallpapers')) {
                    counts.wallpaper++;
                } else if (k.startsWith('phone_analysis') || k.startsWith('phone.')) {
                    counts.phone++;
                } else if (k.startsWith('palm_analysis') || k.startsWith('aura')) {
                    counts.palm++;
                } else if (
                    k.startsWith('premium') ||
                    k.includes('unlock') ||
                    k.includes('topup') ||
                    k.includes('deduct')
                ) {
                    counts.premium++;
                }
            }
        }

        return NextResponse.json(
            {
                onlineNow: Math.max(onlineNow, 1), // at minimum 1 (the current user)
                counts,
                ts: now.toISOString(),
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
                },
            },
        );
    } catch (err) {
        console.error('[live-stats]', err);
        // Return safe fallback so the ticker still works even if DB is unavailable
        return NextResponse.json(
            {
                onlineNow: 1,
                counts: { analysis: 0, wallpaper: 0, phone: 0, palm: 0, premium: 0, total: 0 },
                ts: new Date().toISOString(),
            },
            { status: 200 },
        );
    }
}
