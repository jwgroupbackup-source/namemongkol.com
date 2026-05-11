/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Auth helper (same pattern as other admin routes)
// ---------------------------------------------------------------------------
async function createAuthedClient() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { /* Server Component context */ }
                },
            },
        },
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Unauthorized');

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') throw new Error('Forbidden');

    return supabase;
}

// ---------------------------------------------------------------------------
// GET /api/admin/analytics?type=summary|top-buttons|daily-trend|wallpaper-funnel|wallpaper-daily-trend
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
    try {
        const supabase = await createAuthedClient();
        const { searchParams } = new URL(request.url);

        const type = searchParams.get('type') ?? 'summary';
        const days = Math.min(Number(searchParams.get('days') ?? 7), 365);
        const dateFrom = new Date(Date.now() - days * 86_400_000).toISOString();

        switch (type) {
            case 'summary': {
                // Total events
                const { count: totalEvents } = await supabase
                    .from('user_action_events')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', dateFrom);

                // Unique users (non-null user_id)
                const { data: usersData } = await supabase
                    .from('user_action_events')
                    .select('user_id')
                    .gte('created_at', dateFrom)
                    .not('user_id', 'is', null);

                const uniqueUsers = new Set(usersData?.map((r: any) => r.user_id)).size;

                // Unique sessions
                const { data: sessionsData } = await supabase
                    .from('user_action_events')
                    .select('session_id')
                    .gte('created_at', dateFrom);

                const uniqueSessions = new Set(sessionsData?.map((r: any) => r.session_id)).size;

                // Top page
                const { data: topPageData } = await supabase
                    .from('user_action_events')
                    .select('page_path')
                    .gte('created_at', dateFrom);

                const pageCounts: Record<string, number> = {};
                topPageData?.forEach((r: any) => {
                    pageCounts[r.page_path] = (pageCounts[r.page_path] || 0) + 1;
                });
                const topPage = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';

                return NextResponse.json({
                    success: true,
                    data: { totalEvents: totalEvents ?? 0, uniqueUsers, uniqueSessions, topPage },
                });
            }

            case 'top-buttons': {
                const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);

                const { data: rows } = await supabase
                    .from('user_action_events')
                    .select('button_key, page_path, user_id')
                    .gte('created_at', dateFrom);

                // Aggregate in JS (Supabase JS client doesn't support GROUP BY)
                const map = new Map<string, { clicks: number; users: Set<string>; page: string }>();
                rows?.forEach((r: any) => {
                    const key = r.button_key;
                    if (!map.has(key)) map.set(key, { clicks: 0, users: new Set(), page: r.page_path });
                    const entry = map.get(key)!;
                    entry.clicks++;
                    if (r.user_id) entry.users.add(r.user_id);
                });

                const topButtons = [...map.entries()]
                    .map(([button_key, v]) => ({
                        button_key,
                        page_path: v.page,
                        clicks: v.clicks,
                        unique_users: v.users.size,
                    }))
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, limit);

                return NextResponse.json({ success: true, data: topButtons });
            }

            case 'daily-trend': {
                const { data: rows } = await supabase
                    .from('user_action_events')
                    .select('created_at, user_id')
                    .gte('created_at', dateFrom)
                    .order('created_at', { ascending: true });

                const dayMap = new Map<string, { clicks: number; users: Set<string> }>();
                rows?.forEach((r: any) => {
                    const day = r.created_at.slice(0, 10); // YYYY-MM-DD
                    if (!dayMap.has(day)) dayMap.set(day, { clicks: 0, users: new Set() });
                    const entry = dayMap.get(day)!;
                    entry.clicks++;
                    if (r.user_id) entry.users.add(r.user_id);
                });

                const trend = [...dayMap.entries()].map(([date, v]) => ({
                    date,
                    clicks: v.clicks,
                    unique_users: v.users.size,
                }));

                return NextResponse.json({ success: true, data: trend });
            }

            case 'wallpaper-funnel': {
                const source = searchParams.get('source') ?? 'all';
                const offsetDays = Math.max(Number(searchParams.get('offsetDays') ?? 0), 0);
                const windowEnd = new Date(Date.now() - offsetDays * 86_400_000).toISOString();
                const windowStart = new Date(Date.now() - (offsetDays + days) * 86_400_000).toISOString();
                const stageDefs = [
                    { key: 'wallpapers.page.view', label: 'Page View' },
                    { key: 'wallpapers.card.open_detail', label: 'Open Detail' },
                    { key: 'wallpapers.detail.download_click', label: 'Click Download' },
                    { key: 'wallpapers.download.auth_gate', label: 'Auth Gate Hit' },
                    { key: 'wallpapers.download.guest_allowed', label: 'Guest Allowed' },
                    { key: 'wallpapers.download.start', label: 'Download Start' },
                    { key: 'wallpapers.download.success', label: 'Download Success' },
                ] as const;

                const { data: rows } = await supabase
                    .from('user_action_events')
                    .select('button_key, session_id, metadata, page_path, created_at')
                    .gte('created_at', windowStart)
                    .lt('created_at', windowEnd)
                    .in('button_key', stageDefs.map((s) => s.key));

                const filteredRows = (rows ?? []).filter((row: any) => {
                    if (source === 'all') return true;
                    return row?.metadata?.traffic_source === source;
                });

                const counts = new Map<string, number>();
                const sessionSets = new Map<string, Set<string>>();

                for (const stage of stageDefs) {
                    counts.set(stage.key, 0);
                    sessionSets.set(stage.key, new Set<string>());
                }

                filteredRows.forEach((row: any) => {
                    const key = row.button_key;
                    if (!counts.has(key)) return;
                    counts.set(key, (counts.get(key) ?? 0) + 1);

                    const sessionId = typeof row.session_id === 'string' && row.session_id.length > 0
                        ? row.session_id
                        : `missing:${row.created_at}:${key}`;
                    sessionSets.get(key)?.add(sessionId);
                });

                const pageViewSessions = sessionSets.get('wallpapers.page.view')?.size ?? 0;
                let prevSessions = pageViewSessions;

                const stages = stageDefs.map((stage) => {
                    const uniqueSessions = sessionSets.get(stage.key)?.size ?? 0;
                    const rateFromView = pageViewSessions > 0
                        ? Number(((uniqueSessions / pageViewSessions) * 100).toFixed(2))
                        : 0;
                    const rateFromPrev = prevSessions > 0
                        ? Number(((uniqueSessions / prevSessions) * 100).toFixed(2))
                        : 0;

                    prevSessions = uniqueSessions;

                    return {
                        key: stage.key,
                        label: stage.label,
                        events: counts.get(stage.key) ?? 0,
                        uniqueSessions,
                        rateFromView,
                        rateFromPrev,
                    };
                });

                const breakdown = {
                    premium: {
                        downloadClick: 0,
                        authGate: 0,
                        guestAllowed: 0,
                        downloadStart: 0,
                        downloadSuccess: 0,
                    },
                    nonPremium: {
                        downloadClick: 0,
                        authGate: 0,
                        guestAllowed: 0,
                        downloadStart: 0,
                        downloadSuccess: 0,
                    },
                };

                filteredRows.forEach((row: any) => {
                    const isPremium = row?.metadata?.premium === true;
                    const bucket = isPremium ? breakdown.premium : breakdown.nonPremium;

                    if (row.button_key === 'wallpapers.detail.download_click') bucket.downloadClick++;
                    if (row.button_key === 'wallpapers.download.auth_gate') bucket.authGate++;
                    if (row.button_key === 'wallpapers.download.guest_allowed') bucket.guestAllowed++;
                    if (row.button_key === 'wallpapers.download.start') bucket.downloadStart++;
                    if (row.button_key === 'wallpapers.download.success') bucket.downloadSuccess++;
                });

                const authGateSessions = sessionSets.get('wallpapers.download.auth_gate')?.size ?? 0;
                const guestAllowedSessions = sessionSets.get('wallpapers.download.guest_allowed')?.size ?? 0;
                const clickSessions = sessionSets.get('wallpapers.detail.download_click')?.size ?? 0;

                const authGateRateFromClick = clickSessions > 0
                    ? Number(((authGateSessions / clickSessions) * 100).toFixed(2))
                    : 0;
                const guestAllowedRateFromClick = clickSessions > 0
                    ? Number(((guestAllowedSessions / clickSessions) * 100).toFixed(2))
                    : 0;

                const breakdownWithRates = {
                    premium: {
                        ...breakdown.premium,
                        successRateFromClick: breakdown.premium.downloadClick > 0
                            ? Number(((breakdown.premium.downloadSuccess / breakdown.premium.downloadClick) * 100).toFixed(2))
                            : 0,
                    },
                    nonPremium: {
                        ...breakdown.nonPremium,
                        successRateFromClick: breakdown.nonPremium.downloadClick > 0
                            ? Number(((breakdown.nonPremium.downloadSuccess / breakdown.nonPremium.downloadClick) * 100).toFixed(2))
                            : 0,
                    },
                };

                return NextResponse.json({
                    success: true,
                    data: {
                        source,
                        offsetDays,
                        stages,
                        sampleSize: pageViewSessions,
                        authGateRateFromClick,
                        guestAllowedRateFromClick,
                        clickSessions,
                        breakdown: breakdownWithRates,
                    },
                });
            }

            case 'wallpaper-daily-trend': {
                const source = searchParams.get('source') ?? 'all';
                const stageKeys = [
                    'wallpapers.page.view',
                    'wallpapers.detail.download_click',
                    'wallpapers.download.success',
                    'wallpapers.download.auth_gate',
                    'wallpapers.download.guest_allowed',
                ];

                const { data: rows } = await supabase
                    .from('user_action_events')
                    .select('button_key, session_id, metadata, created_at')
                    .gte('created_at', dateFrom)
                    .in('button_key', stageKeys)
                    .order('created_at', { ascending: true });

                const filteredRows = (rows ?? []).filter((row: any) => {
                    if (source === 'all') return true;
                    return row?.metadata?.traffic_source === source;
                });

                const dayMap = new Map<string, {
                    pageViewSessions: Set<string>;
                    downloadSuccessSessions: Set<string>;
                    clickSessions: Set<string>;
                    authGateSessions: Set<string>;
                    guestAllowedSessions: Set<string>;
                    premiumClick: number;
                    premiumSuccess: number;
                    nonPremiumClick: number;
                    nonPremiumSuccess: number;
                }>();

                filteredRows.forEach((row: any) => {
                    const day = row.created_at.slice(0, 10);
                    if (!dayMap.has(day)) {
                        dayMap.set(day, {
                            pageViewSessions: new Set<string>(),
                            downloadSuccessSessions: new Set<string>(),
                            clickSessions: new Set<string>(),
                            authGateSessions: new Set<string>(),
                            guestAllowedSessions: new Set<string>(),
                            premiumClick: 0,
                            premiumSuccess: 0,
                            nonPremiumClick: 0,
                            nonPremiumSuccess: 0,
                        });
                    }

                    const entry = dayMap.get(day)!;
                    const sessionId = typeof row.session_id === 'string' && row.session_id.length > 0
                        ? row.session_id
                        : `missing:${row.created_at}:${row.button_key}`;
                    const isPremium = row?.metadata?.premium === true;

                    if (row.button_key === 'wallpapers.page.view') entry.pageViewSessions.add(sessionId);
                    if (row.button_key === 'wallpapers.download.success') entry.downloadSuccessSessions.add(sessionId);
                    if (row.button_key === 'wallpapers.detail.download_click') entry.clickSessions.add(sessionId);
                    if (row.button_key === 'wallpapers.download.auth_gate') entry.authGateSessions.add(sessionId);
                    if (row.button_key === 'wallpapers.download.guest_allowed') entry.guestAllowedSessions.add(sessionId);

                    if (row.button_key === 'wallpapers.detail.download_click') {
                        if (isPremium) entry.premiumClick++;
                        else entry.nonPremiumClick++;
                    }
                    if (row.button_key === 'wallpapers.download.success') {
                        if (isPremium) entry.premiumSuccess++;
                        else entry.nonPremiumSuccess++;
                    }
                });

                const sortedDays = [...dayMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
                let rollingPv = 0;
                let rollingSuccess = 0;
                const rollingQueue: Array<{ pv: number; success: number }> = [];

                const trend = sortedDays.map(([date, v]) => {
                    const pageViewSessions = v.pageViewSessions.size;
                    const downloadSuccessSessions = v.downloadSuccessSessions.size;
                    const clickSessions = v.clickSessions.size;
                    const authGateSessions = v.authGateSessions.size;
                    const guestAllowedSessions = v.guestAllowedSessions.size;

                    const successRateFromView = pageViewSessions > 0
                        ? Number(((downloadSuccessSessions / pageViewSessions) * 100).toFixed(2))
                        : 0;
                    const authGateRateFromClick = clickSessions > 0
                        ? Number(((authGateSessions / clickSessions) * 100).toFixed(2))
                        : 0;
                    const guestAllowedRateFromClick = clickSessions > 0
                        ? Number(((guestAllowedSessions / clickSessions) * 100).toFixed(2))
                        : 0;

                    const premiumSuccessRateFromClick = v.premiumClick > 0
                        ? Number(((v.premiumSuccess / v.premiumClick) * 100).toFixed(2))
                        : 0;
                    const nonPremiumSuccessRateFromClick = v.nonPremiumClick > 0
                        ? Number(((v.nonPremiumSuccess / v.nonPremiumClick) * 100).toFixed(2))
                        : 0;

                    rollingQueue.push({ pv: pageViewSessions, success: downloadSuccessSessions });
                    rollingPv += pageViewSessions;
                    rollingSuccess += downloadSuccessSessions;

                    if (rollingQueue.length > 7) {
                        const removed = rollingQueue.shift()!;
                        rollingPv -= removed.pv;
                        rollingSuccess -= removed.success;
                    }

                    const rolling7SuccessRateFromView = rollingPv > 0
                        ? Number(((rollingSuccess / rollingPv) * 100).toFixed(2))
                        : 0;

                    return {
                        date,
                        pageViewSessions,
                        clickSessions,
                        downloadSuccessSessions,
                        successRateFromView,
                        rolling7SuccessRateFromView,
                        authGateRateFromClick,
                        guestAllowedRateFromClick,
                        premiumClick: v.premiumClick,
                        premiumSuccess: v.premiumSuccess,
                        premiumSuccessRateFromClick,
                        nonPremiumClick: v.nonPremiumClick,
                        nonPremiumSuccess: v.nonPremiumSuccess,
                        nonPremiumSuccessRateFromClick,
                    };
                });

                return NextResponse.json({
                    success: true,
                    data: {
                        source,
                        trend,
                    },
                });
            }

            default:
                return NextResponse.json(
                    { success: false, error: `Unknown type: ${type}` },
                    { status: 400 },
                );
        }
    } catch (err: any) {
        const msg = err?.message ?? 'Server error';
        const status = msg === 'Unauthorized' ? 401 : msg === 'Forbidden' ? 403 : 500;
        return NextResponse.json({ success: false, error: msg }, { status });
    }
}
