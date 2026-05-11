'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    BarChart3,
    MousePointerClick,
    Users,
    Globe,
    RefreshCw,
    TrendingUp,
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Summary {
    totalEvents: number;
    uniqueUsers: number;
    uniqueSessions: number;
    topPage: string;
}

interface TopButton {
    button_key: string;
    page_path: string;
    clicks: number;
    unique_users: number;
}

interface DailyTrend {
    date: string;
    clicks: number;
    unique_users: number;
}

interface FunnelStage {
    key: string;
    label: string;
    events: number;
    uniqueSessions: number;
    rateFromView: number;
    rateFromPrev: number;
}

interface WallpaperFunnel {
    source: string;
    offsetDays?: number;
    sampleSize: number;
    clickSessions?: number;
    authGateRateFromClick?: number;
    guestAllowedRateFromClick?: number;
    breakdown?: {
        premium: {
            downloadClick: number;
            authGate: number;
            guestAllowed: number;
            downloadStart: number;
            downloadSuccess: number;
            successRateFromClick: number;
        };
        nonPremium: {
            downloadClick: number;
            authGate: number;
            guestAllowed: number;
            downloadStart: number;
            downloadSuccess: number;
            successRateFromClick: number;
        };
    };
    stages: FunnelStage[];
}

interface WallpaperDailyTrendPoint {
    date: string;
    pageViewSessions: number;
    clickSessions: number;
    downloadSuccessSessions: number;
    successRateFromView: number;
    rolling7SuccessRateFromView: number;
    authGateRateFromClick: number;
    guestAllowedRateFromClick: number;
    premiumClick: number;
    premiumSuccess: number;
    premiumSuccessRateFromClick: number;
    nonPremiumClick: number;
    nonPremiumSuccess: number;
    nonPremiumSuccessRateFromClick: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminAnalyticsPage() {
    const [days, setDays] = useState(7);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [topButtons, setTopButtons] = useState<TopButton[]>([]);
    const [dailyTrend, setDailyTrend] = useState<DailyTrend[]>([]);
    const [funnelSource, setFunnelSource] = useState<'all' | 'google_organic'>('google_organic');
    const [wallpaperFunnel, setWallpaperFunnel] = useState<WallpaperFunnel | null>(null);
    const [wallpaperFunnelPrev, setWallpaperFunnelPrev] = useState<WallpaperFunnel | null>(null);
    const [wallpaperDailyTrend, setWallpaperDailyTrend] = useState<WallpaperDailyTrendPoint[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = { Authorization: `Bearer ${session?.access_token || ''}` };
            const base = `/api/admin/analytics`;

            const [sumRes, btnRes, trendRes, funnelRes, funnelPrevRes, wallpaperDailyRes] = await Promise.all([
                fetch(`${base}?type=summary&days=${days}`, { headers }),
                fetch(`${base}?type=top-buttons&days=${days}&limit=20`, { headers }),
                fetch(`${base}?type=daily-trend&days=${days}`, { headers }),
                fetch(`${base}?type=wallpaper-funnel&days=${days}&source=${funnelSource}&offsetDays=0`, { headers }),
                fetch(`${base}?type=wallpaper-funnel&days=${days}&source=${funnelSource}&offsetDays=${days}`, { headers }),
                fetch(`${base}?type=wallpaper-daily-trend&days=${days}&source=${funnelSource}`, { headers }),
            ]);

            const [sumJson, btnJson, trendJson, funnelJson, funnelPrevJson, wallpaperDailyJson] = await Promise.all([
                sumRes.json(),
                btnRes.json(),
                trendRes.json(),
                funnelRes.json(),
                funnelPrevRes.json(),
                wallpaperDailyRes.json(),
            ]);

            if (sumJson.success) setSummary(sumJson.data);
            if (btnJson.success) setTopButtons(btnJson.data);
            if (trendJson.success) setDailyTrend(trendJson.data);
            if (funnelJson.success) setWallpaperFunnel(funnelJson.data);
            if (funnelPrevJson.success) setWallpaperFunnelPrev(funnelPrevJson.data);
            if (wallpaperDailyJson.success) setWallpaperDailyTrend(wallpaperDailyJson.data.trend ?? []);
        } catch (err) {
            console.error('Failed to load analytics', err);
        } finally {
            setLoading(false);
        }
    }, [days, funnelSource]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Max clicks for bar chart scaling
    const maxClicks = Math.max(...dailyTrend.map((d) => d.clicks), 1);

    const summaryCards = summary
        ? [
              {
                  title: 'คลิกทั้งหมด',
                  value: summary.totalEvents.toLocaleString(),
                  icon: MousePointerClick,
                  color: 'text-blue-400',
                  bg: 'bg-blue-400/10',
                  desc: 'Total Events',
              },
              {
                  title: 'ผู้ใช้ (Unique)',
                  value: summary.uniqueUsers.toLocaleString(),
                  icon: Users,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-400/10',
                  desc: 'Logged-in Users',
              },
              {
                  title: 'Sessions',
                  value: summary.uniqueSessions.toLocaleString(),
                  icon: Globe,
                  color: 'text-amber-400',
                  bg: 'bg-amber-400/10',
                  desc: 'Unique Sessions',
              },
              {
                  title: 'หน้ายอดนิยม',
                  value: summary.topPage,
                  icon: TrendingUp,
                  color: 'text-purple-400',
                  bg: 'bg-purple-400/10',
                  desc: 'Top Page',
              },
          ]
        : [];

    const currentSuccessRate = wallpaperFunnel?.stages.find((s) => s.key === 'wallpapers.download.success')?.rateFromView ?? 0;
    const previousSuccessRate = wallpaperFunnelPrev?.stages.find((s) => s.key === 'wallpapers.download.success')?.rateFromView ?? 0;
    const successRateDelta = currentSuccessRate - previousSuccessRate;
    const authGateRate = wallpaperFunnel?.authGateRateFromClick ?? 0;
    const guestAllowedRate = wallpaperFunnel?.guestAllowedRateFromClick ?? 0;
    const latestRolling7Rate = wallpaperDailyTrend.at(-1)?.rolling7SuccessRateFromView ?? 0;

    const getAlertStatus = () => {
        if (authGateRate >= 45) return { level: 'critical', message: 'Auth Gate สูงผิดปกติ ควรลดแรงเสียดทานเพิ่ม' };
        if (authGateRate >= 30) return { level: 'warning', message: 'Auth Gate ยังสูง ควรจับตา conversion leak' };
        if (successRateDelta < -1.0) return { level: 'warning', message: 'Success Rate ลดลงเทียบช่วงก่อนหน้า' };
        if (funnelSource === 'google_organic' && guestAllowedRate < 20) {
            return { level: 'warning', message: 'Guest Allowed ต่ำกว่าที่คาดสำหรับ organic experiment' };
        }
        return { level: 'healthy', message: 'Metrics อยู่ในช่วงที่ควบคุมได้' };
    };

    const alertStatus = getAlertStatus();

    const exportFunnelCsv = () => {
        if (!wallpaperFunnel) return;

        const rows: string[][] = [];
        rows.push(['section', 'metric', 'value']);
        rows.push(['meta', 'source', wallpaperFunnel.source]);
        rows.push(['meta', 'window_days', String(days)]);
        rows.push(['meta', 'sample_sessions', String(wallpaperFunnel.sampleSize)]);
        rows.push(['meta', 'click_sessions', String(wallpaperFunnel.clickSessions ?? 0)]);
        rows.push(['meta', 'auth_gate_rate_from_click_pct', authGateRate.toFixed(2)]);
        rows.push(['meta', 'guest_allowed_rate_from_click_pct', guestAllowedRate.toFixed(2)]);
        rows.push(['meta', 'success_rate_current_pct', currentSuccessRate.toFixed(2)]);
        rows.push(['meta', 'success_rate_previous_pct', previousSuccessRate.toFixed(2)]);
        rows.push(['meta', 'success_rate_delta_pp', successRateDelta.toFixed(2)]);

        rows.push(['', '', '']);
        rows.push(['funnel', 'stage_key', 'stage_label', 'events', 'sessions', 'rate_from_view_pct', 'rate_from_prev_pct']);
        wallpaperFunnel.stages.forEach((stage) => {
            rows.push([
                'funnel',
                stage.key,
                stage.label,
                String(stage.events),
                String(stage.uniqueSessions),
                stage.rateFromView.toFixed(2),
                stage.rateFromPrev.toFixed(2),
            ]);
        });

        if (wallpaperFunnel.breakdown) {
            rows.push(['', '', '']);
            rows.push(['breakdown', 'segment', 'download_click', 'auth_gate', 'guest_allowed', 'download_start', 'download_success', 'success_rate_from_click_pct']);
            rows.push([
                'breakdown',
                'premium',
                String(wallpaperFunnel.breakdown.premium.downloadClick),
                String(wallpaperFunnel.breakdown.premium.authGate),
                String(wallpaperFunnel.breakdown.premium.guestAllowed),
                String(wallpaperFunnel.breakdown.premium.downloadStart),
                String(wallpaperFunnel.breakdown.premium.downloadSuccess),
                wallpaperFunnel.breakdown.premium.successRateFromClick.toFixed(2),
            ]);
            rows.push([
                'breakdown',
                'non_premium',
                String(wallpaperFunnel.breakdown.nonPremium.downloadClick),
                String(wallpaperFunnel.breakdown.nonPremium.authGate),
                String(wallpaperFunnel.breakdown.nonPremium.guestAllowed),
                String(wallpaperFunnel.breakdown.nonPremium.downloadStart),
                String(wallpaperFunnel.breakdown.nonPremium.downloadSuccess),
                wallpaperFunnel.breakdown.nonPremium.successRateFromClick.toFixed(2),
            ]);
        }

        const csv = rows
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wallpaper-funnel-${funnelSource}-${days}d.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className={`rounded-xl border p-3 ${
                            alertStatus.level === 'critical'
                                ? 'border-rose-500/40 bg-rose-500/10'
                                : alertStatus.level === 'warning'
                                    ? 'border-amber-500/40 bg-amber-500/10'
                                    : 'border-emerald-500/40 bg-emerald-500/10'
                        }`}>
                            <p className="text-xs text-slate-300">Automated Alert</p>
                            <p className={`text-sm font-semibold ${
                                alertStatus.level === 'critical'
                                    ? 'text-rose-300'
                                    : alertStatus.level === 'warning'
                                        ? 'text-amber-300'
                                        : 'text-emerald-300'
                            }`}>
                                {alertStatus.message}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Rolling 7d Success Rate: <span className="text-white font-semibold">{latestRolling7Rate.toFixed(2)}%</span>
                            </p>
                        </div>
                        <BarChart3 className="text-emerald-400" size={32} />
                        Analytics
                    </h1>
                    <p className="text-slate-400">สถิติการคลิกปุ่มและการใช้งานเว็บไซต์</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Period selector */}
                    <div className="flex bg-slate-800 rounded-lg overflow-hidden">
                        {[7, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    days === d
                                        ? 'bg-emerald-500 text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {d}d
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={fetchData}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <div
                              key={i}
                              className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 h-40 animate-pulse"
                          />
                      ))
                    : summaryCards.map((card, idx) => (
                          <div
                              key={idx}
                              className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group"
                          >
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                  <card.icon size={64} className={card.color} />
                              </div>
                              <div className="relative z-10 flex flex-col justify-between h-full">
                                  <div className={`p-3 rounded-xl w-fit mb-4 ${card.bg}`}>
                                      <card.icon size={24} className={card.color} />
                                  </div>
                                  <div>
                                      <h3 className="text-slate-400 text-sm font-medium mb-1">
                                          {card.title}
                                      </h3>
                                      <p className={`font-bold text-slate-100 ${
                                          card.title === 'หน้ายอดนิยม' ? 'text-lg truncate' : 'text-3xl'
                                      }`}>
                                          {card.value}
                                      </p>
                                      <p className="text-xs text-slate-500 mt-2">{card.desc}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
            </div>

            {/* ---- Two-column: Top Buttons + Daily Trend ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Buttons Table */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🔥 ปุ่มยอดนิยม</h3>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : topButtons.length === 0 ? (
                        <p className="text-slate-500 text-sm">ยังไม่มีข้อมูล</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-700/50">
                                        <th className="text-left py-2 pr-4">#</th>
                                        <th className="text-left py-2 pr-4">Button Key</th>
                                        <th className="text-left py-2 pr-4">Page</th>
                                        <th className="text-right py-2 pr-4">Clicks</th>
                                        <th className="text-right py-2">Users</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topButtons.map((btn, i) => (
                                        <tr
                                            key={btn.button_key}
                                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="py-2 pr-4 text-slate-500">{i + 1}</td>
                                            <td className="py-2 pr-4 text-slate-200 font-mono text-xs">
                                                {btn.button_key}
                                            </td>
                                            <td className="py-2 pr-4 text-slate-400 truncate max-w-[120px]">
                                                {btn.page_path}
                                            </td>
                                            <td className="py-2 pr-4 text-right text-emerald-400 font-bold">
                                                {btn.clicks.toLocaleString()}
                                            </td>
                                            <td className="py-2 text-right text-blue-400">
                                                {btn.unique_users.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Daily Trend (Simple Bar Chart) */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📈 แนวโน้มรายวัน</h3>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-8 bg-slate-800 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : dailyTrend.length === 0 ? (
                        <p className="text-slate-500 text-sm">ยังไม่มีข้อมูล</p>
                    ) : (
                        <div className="space-y-2">
                            {dailyTrend.map((day) => (
                                <div key={day.date} className="flex items-center gap-3">
                                    <span className="text-slate-400 text-xs w-20 shrink-0 font-mono">
                                        {day.date.slice(5)}
                                    </span>
                                    <div className="flex-1 bg-slate-800/50 rounded-full h-6 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                                            style={{
                                                width: `${Math.max((day.clicks / maxClicks) * 100, 4)}%`,
                                            }}
                                        >
                                            <span className="text-xs font-bold text-white whitespace-nowrap">
                                                {day.clicks}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-blue-400 text-xs w-16 text-right shrink-0">
                                        {day.unique_users} users
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Wallpaper Funnel */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">🧭 Wallpapers Conversion Funnel</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex bg-slate-800 rounded-lg overflow-hidden w-fit">
                            <button
                                onClick={() => setFunnelSource('google_organic')}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                    funnelSource === 'google_organic'
                                        ? 'bg-amber-500 text-black'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                Google Organic
                            </button>
                            <button
                                onClick={() => setFunnelSource('all')}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                    funnelSource === 'all'
                                        ? 'bg-amber-500 text-black'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                All Sources
                            </button>
                        </div>
                        <button
                            onClick={exportFunnelCsv}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-9 bg-slate-800 rounded animate-pulse" />
                        ))}
                    </div>
                ) : !wallpaperFunnel || wallpaperFunnel.stages.length === 0 ? (
                    <p className="text-slate-500 text-sm">ยังไม่มีข้อมูล funnel ของ wallpapers</p>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3">
                                <p className="text-xs text-slate-400">Current Success Rate</p>
                                <p className="text-xl font-bold text-emerald-400">{currentSuccessRate.toFixed(2)}%</p>
                                <p className="text-[11px] text-slate-500">Download Success / Page View</p>
                            </div>
                            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3">
                                <p className="text-xs text-slate-400">Previous Success Rate</p>
                                <p className="text-xl font-bold text-slate-100">{previousSuccessRate.toFixed(2)}%</p>
                                <p className="text-[11px] text-slate-500">Previous {days} days</p>
                            </div>
                            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3">
                                <p className="text-xs text-slate-400">Delta</p>
                                <p className={`text-xl font-bold ${successRateDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {successRateDelta >= 0 ? '+' : ''}{successRateDelta.toFixed(2)} pp
                                </p>
                                <p className="text-[11px] text-slate-500">Current - Previous</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3">
                                <p className="text-xs text-slate-400">Auth Gate Rate (from Download Click)</p>
                                <p className="text-xl font-bold text-rose-400">{authGateRate.toFixed(2)}%</p>
                                <p className="text-[11px] text-slate-500">ยิ่งต่ำยิ่งดี</p>
                            </div>
                            <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3">
                                <p className="text-xs text-slate-400">Guest Allowed Rate (from Download Click)</p>
                                <p className="text-xl font-bold text-emerald-400">{guestAllowedRate.toFixed(2)}%</p>
                                <p className="text-[11px] text-slate-500">ยิ่งสูงยิ่งดี (สำหรับ organic test)</p>
                            </div>
                        </div>
                        {wallpaperFunnel.breakdown && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3">
                                    <p className="text-xs text-slate-400">Premium Success Rate (from Click)</p>
                                    <p className="text-xl font-bold text-amber-300">{wallpaperFunnel.breakdown.premium.successRateFromClick.toFixed(2)}%</p>
                                    <p className="text-[11px] text-slate-500">Clicks: {wallpaperFunnel.breakdown.premium.downloadClick.toLocaleString()} | Success: {wallpaperFunnel.breakdown.premium.downloadSuccess.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3">
                                    <p className="text-xs text-slate-400">Non-Premium Success Rate (from Click)</p>
                                    <p className="text-xl font-bold text-cyan-300">{wallpaperFunnel.breakdown.nonPremium.successRateFromClick.toFixed(2)}%</p>
                                    <p className="text-[11px] text-slate-500">Clicks: {wallpaperFunnel.breakdown.nonPremium.downloadClick.toLocaleString()} | Success: {wallpaperFunnel.breakdown.nonPremium.downloadSuccess.toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-slate-400">
                            Sample sessions: <span className="text-white font-semibold">{wallpaperFunnel.sampleSize.toLocaleString()}</span>
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-700/50">
                                        <th className="text-left py-2 pr-3">Stage</th>
                                        <th className="text-right py-2 pr-3">Events</th>
                                        <th className="text-right py-2 pr-3">Sessions</th>
                                        <th className="text-right py-2 pr-3">% From View</th>
                                        <th className="text-right py-2">% From Prev</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wallpaperFunnel.stages.map((stage) => (
                                        <tr key={stage.key} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                            <td className="py-2 pr-3 text-slate-200">
                                                <p className="font-medium">{stage.label}</p>
                                                <p className="text-[11px] text-slate-500 font-mono">{stage.key}</p>
                                            </td>
                                            <td className="py-2 pr-3 text-right text-slate-200">{stage.events.toLocaleString()}</td>
                                            <td className="py-2 pr-3 text-right text-blue-400">{stage.uniqueSessions.toLocaleString()}</td>
                                            <td className="py-2 pr-3 text-right text-emerald-400">{stage.rateFromView.toFixed(2)}%</td>
                                            <td className="py-2 text-right text-amber-300">{stage.rateFromPrev.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-2 space-y-2">
                            <h4 className="text-sm font-semibold text-slate-200">Daily Conversion Trend (Rolling 7d)</h4>
                            {wallpaperDailyTrend.length === 0 ? (
                                <p className="text-xs text-slate-500">ยังไม่มีข้อมูลรายวันของ wallpapers</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="text-slate-400 border-b border-slate-700/50">
                                                <th className="text-left py-2 pr-3">Date</th>
                                                <th className="text-right py-2 pr-3">Page Views</th>
                                                <th className="text-right py-2 pr-3">Success Rate</th>
                                                <th className="text-right py-2 pr-3">Rolling 7d</th>
                                                <th className="text-right py-2 pr-3">Premium %</th>
                                                <th className="text-right py-2">Non-Premium %</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wallpaperDailyTrend.slice(-21).map((row) => (
                                                <tr key={row.date} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                                    <td className="py-2 pr-3 text-slate-300 font-mono">{row.date}</td>
                                                    <td className="py-2 pr-3 text-right text-slate-300">{row.pageViewSessions.toLocaleString()}</td>
                                                    <td className="py-2 pr-3 text-right text-emerald-300">{row.successRateFromView.toFixed(2)}%</td>
                                                    <td className="py-2 pr-3 text-right text-cyan-300 font-semibold">{row.rolling7SuccessRateFromView.toFixed(2)}%</td>
                                                    <td className="py-2 pr-3 text-right text-amber-300">{row.premiumSuccessRateFromClick.toFixed(2)}%</td>
                                                    <td className="py-2 text-right text-blue-300">{row.nonPremiumSuccessRateFromClick.toFixed(2)}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
