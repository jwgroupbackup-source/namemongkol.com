'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Users, TrendingUp, Star, Heart, Phone, Hand, X, Download, Crown } from 'lucide-react';
import { auspiciousNames } from '@/data/auspiciousNames';

type MessageType = 'analysis' | 'grade' | 'online' | 'review' | 'phone' | 'palm' | 'wallpaper' | 'premium';

interface LiveStats {
    onlineNow: number;
    counts: {
        analysis: number;
        wallpaper: number;
        phone: number;
        palm: number;
        premium: number;
        total: number;
    };
}

interface TickerMessage {
    id: number;
    type: MessageType;
    message: string;
    icon: React.ElementType;
    color: string;
}

// --- Diverse data pools ---

const grades = ['A+', 'A', 'A', 'A-', 'B+', 'B+', 'B', 'A+', 'A', 'B+'];

const provinces = [
    'กรุงเทพฯ', 'เชียงใหม่', 'ขอนแก่น', 'นครราชสีมา', 'ภูเก็ต',
    'ชลบุรี', 'สงขลา', 'เชียงราย', 'อุดรธานี', 'นนทบุรี',
    'ปทุมธานี', 'สมุทรปราการ', 'ระยอง', 'นครปฐม', 'สุราษฎร์ธานี',
];

const timeAgo = (): string => {
    const options = [
        'เมื่อสักครู่', 'ไม่กี่วินาทีที่แล้ว',
        `${Math.floor(Math.random() * 3) + 1} นาทีที่แล้ว`,
        `${Math.floor(Math.random() * 10) + 2} นาทีที่แล้ว`,
    ];
    return options[Math.floor(Math.random() * options.length)];
};

const getRandomName = (): string => {
    const name = auspiciousNames[Math.floor(Math.random() * auspiciousNames.length)];
    if (name.length > 2) {
        return name.substring(0, Math.ceil(name.length * 0.6)) + '***';
    }
    return name + '***';
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- Message generators (varied phrasing) ---

const analysisMessages = (stats: LiveStats | null): TickerMessage => {
    const templates = [
        () => `${getRandomName()} เพิ่งวิเคราะห์ชื่อ ${timeAgo()}`,
        () => `มีคนจาก${pick(provinces)}วิเคราะห์ชื่อ ${timeAgo()}`,
        () => `${getRandomName()} กำลังดูผลวิเคราะห์ชื่อ`,
        () => `มีคนวิเคราะห์ชื่อใหม่ ${timeAgo()}`,
        ...(stats && stats.counts.analysis > 0
            ? [() => `${stats.counts.analysis} คนวิเคราะห์ชื่อใน 30 นาทีที่ผ่านมา`]
            : []),
    ];
    return {
        id: Date.now() + Math.random(),
        type: 'analysis',
        message: pick(templates)(),
        icon: Sparkles,
        color: 'text-amber-400',
    };
};

const gradeMessages = (stats: LiveStats | null): TickerMessage => {
    const grade = pick(grades);
    const templates = [
        () => `${getRandomName()} ได้ชื่อเกรด ${grade} !`,
        () => `ชื่อเกรด ${grade} — วิเคราะห์${timeAgo()}`,
        () => `ผลวิเคราะห์ล่าสุด: เกรด ${grade}`,
        ...(stats && stats.counts.analysis > 0
            ? [() => `ผลวิเคราะห์ใหม่ ${stats.counts.analysis} รายการล่าสุด`]
            : []),
    ];
    return {
        id: Date.now() + Math.random(),
        type: 'grade',
        message: pick(templates)(),
        icon: grade === 'A+' ? Star : TrendingUp,
        color: grade === 'A+' ? 'text-yellow-400' : 'text-blue-400',
    };
};

const onlineMessages = (stats: LiveStats | null): TickerMessage => {
    const count = stats ? stats.onlineNow : Math.floor(Math.random() * 30) + 8;
    const isReal = stats !== null;
    const templates = [
        () => `${count} คนกำลังใช้งานตอนนี้`,
        () => `ขณะนี้มี ${count} คนออนไลน์`,
        () => isReal ? `${count} คนออนไลน์อยู่ในขณะนี้ 🟢` : `มีผู้ใช้งาน ${count} คน ในขณะนี้`,
    ];
    return {
        id: Date.now() + Math.random(),
        type: 'online',
        message: pick(templates)(),
        icon: Users,
        color: 'text-emerald-400',
    };
};

const reviewMessages = (stats: LiveStats | null): TickerMessage => {
    const ratings = [5, 5, 5, 4, 5, 4];
    const stars = pick(ratings);
    const snippets = [
        'แม่นมาก!', 'ดีเกินคาด', 'คุ้มค่ามากค่ะ', 'ชอบมาก',
        'ละเอียดดี', 'จะกลับมาอีก', 'แนะนำเลย', 'เจ๋งมาก!',
    ];
    const reviewSuffix = stats && stats.counts.total > 0 ? ` • อัปเดตล่าสุด` : '';
    return {
        id: Date.now() + Math.random(),
        type: 'review',
        message: `"${pick(snippets)}" — ${'⭐'.repeat(stars)}${reviewSuffix}`,
        icon: Heart,
        color: 'text-pink-400',
    };
};

const phoneMessages = (stats: LiveStats | null): TickerMessage => {
    const templates = [
        () => `มีคนวิเคราะห์เบอร์มงคล ${timeAgo()}`,
        () => `${getRandomName()} เช็คเบอร์โทรศัพท์`,
        () => `เบอร์มงคลถูกวิเคราะห์ ${timeAgo()}`,
        ...(stats && stats.counts.phone > 0
            ? [() => `${stats.counts.phone} คนเช็คเบอร์มงคลใน 30 นาทีที่ผ่านมา`]
            : []),
    ];
    return {
        id: Date.now() + Math.random(),
        type: 'phone',
        message: pick(templates)(),
        icon: Phone,
        color: 'text-violet-400',
    };
};

const palmMessages = (stats: LiveStats | null): TickerMessage => {
    const templates = [
        () => `${getRandomName()} เพิ่งดูลายมือ ${timeAgo()}`,
        () => `มีคนวิเคราะห์ลายมือ ${timeAgo()}`,
        ...(stats && stats.counts.palm > 0
            ? [() => `${stats.counts.palm} คนวิเคราะห์ดวงใน 30 นาทีที่ผ่านมา`]
            : []),
    ];
    return {
        id: Date.now() + Math.random(),
        type: 'palm',
        message: pick(templates)(),
        icon: Hand,
        color: 'text-orange-400',
    };
};

const wallpaperMessages = (stats: LiveStats | null): TickerMessage => {
    const templates = [
        () => `วอลเปเปอร์มงคลถูกดาวน์โหลด ${timeAgo()}`,
        () => `มีคนจาก${pick(provinces)}โหลดวอลเปเปอร์`,
        ...(stats && stats.counts.wallpaper > 0
            ? [() => `${stats.counts.wallpaper} คนโหลดวอลเปเปอร์มงคลใน 30 นาที`]
            : []),
    ];
    return {
        id: Date.now() + Math.random(),
        type: 'wallpaper',
        message: pick(templates)(),
        icon: Download,
        color: 'text-cyan-400',
    };
};

const premiumMessages = (stats: LiveStats | null): TickerMessage => {
    const templates = [
        () => `${getRandomName()} ปลดล็อกผลวิเคราะห์แบบเต็ม`,
        () => `มีคนใช้บริการ Premium ${timeAgo()}`,
        ...(stats && stats.counts.premium > 0
            ? [() => `${stats.counts.premium} คนใช้บริการ Premium ใน 30 นาทีที่ผ่านมา`]
            : []),
    ];
    return {
        id: Date.now() + Math.random(),
        type: 'premium',
        message: pick(templates)(),
        icon: Crown,
        color: 'text-amber-300',
    };
};

// Weighted random selection (stats injected at call-time for real data blending)
interface Generator {
    fn: (stats: LiveStats | null) => TickerMessage;
    weight: number;
    countKey?: keyof LiveStats['counts'];
}

const messageGenerators: Generator[] = [
    { fn: analysisMessages, weight: 25, countKey: 'analysis' },
    { fn: gradeMessages, weight: 18 },
    { fn: onlineMessages, weight: 8 },
    { fn: reviewMessages, weight: 15 },
    { fn: phoneMessages, weight: 12, countKey: 'phone' },
    { fn: palmMessages, weight: 8, countKey: 'palm' },
    { fn: wallpaperMessages, weight: 7, countKey: 'wallpaper' },
    { fn: premiumMessages, weight: 7, countKey: 'premium' },
];

const generateMessage = (stats: LiveStats | null): TickerMessage => {
    // Boost weight of generators that have real activity data
    const generators = messageGenerators.map((g) => ({
        ...g,
        weight: g.countKey && stats && (stats.counts[g.countKey] ?? 0) > 0
            ? g.weight + 10
            : g.weight,
    }));
    const total = generators.reduce((sum, g) => sum + g.weight, 0);
    let r = Math.random() * total;
    for (const g of generators) {
        r -= g.weight;
        if (r <= 0) return g.fn(stats);
    }
    return generators[0].fn(stats);
};

// --- Component ---

const DISMISS_KEY = 'liveTicker_dismissed';

export const LiveTicker: React.FC = () => {
    const [currentMessage, setCurrentMessage] = useState<TickerMessage | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return sessionStorage.getItem(DISMISS_KEY) === '1';
    });
    const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastTypeRef = useRef<MessageType | null>(null);
    const liveStatsRef = useRef<LiveStats | null>(null);

    // Keep ref in sync so showNextMessage closure always reads latest stats
    useEffect(() => {
        liveStatsRef.current = liveStats;
    }, [liveStats]);

    // Fetch live stats on mount and every 60 seconds
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/live-stats');
                if (res.ok) {
                    const data: LiveStats = await res.json();
                    setLiveStats(data);
                }
            } catch {
                // Silently fail — LiveTicker continues with random messages
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 60_000);
        return () => clearInterval(interval);
    }, []);

    const dismiss = useCallback(() => {
        setIsDismissed(true);
        setIsVisible(false);
        sessionStorage.setItem(DISMISS_KEY, '1');
    }, []);

    const showNextMessage = useCallback(() => {
        if (isDismissed) return;

        // Avoid showing same type twice in a row
        let msg = generateMessage(liveStatsRef.current);
        let attempts = 0;
        while (msg.type === lastTypeRef.current && attempts < 3) {
            msg = generateMessage(liveStatsRef.current);
            attempts++;
        }
        lastTypeRef.current = msg.type;

        setCurrentMessage(msg);
        setIsVisible(true);

        // Vary display duration: 3–5 seconds
        const displayTime = 3000 + Math.random() * 2000;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, displayTime);
    }, [isDismissed]);

    useEffect(() => {
        if (isDismissed) return;

        // Initial delay: 3–6 seconds (don't show immediately)
        const initialDelay = 3000 + Math.random() * 3000;
        let nextTimeout: ReturnType<typeof setTimeout>;

        const scheduleNext = () => {
            // Varied interval: 6–15 seconds between messages
            const gap = 6000 + Math.random() * 9000;
            nextTimeout = setTimeout(() => {
                showNextMessage();
                scheduleNext();
            }, gap);
        };

        const initialTimeout = setTimeout(() => {
            showNextMessage();
            scheduleNext();
        }, initialDelay);

        return () => {
            clearTimeout(initialTimeout);
            clearTimeout(nextTimeout);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [showNextMessage, isDismissed]);

    if (!currentMessage || isDismissed) return null;

    const IconComponent = currentMessage.icon;

    return (
        <div
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md shadow-lg border border-white/10">
                {/* Icon */}
                <div className={`shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/10 ${currentMessage.color}`}>
                    <IconComponent className="w-2.5 h-2.5" />
                </div>

                {/* Message */}
                <span className="text-xs text-slate-200 font-medium whitespace-nowrap">
                    {currentMessage.message}
                </span>

                {/* Live Indicator */}
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>

                {/* Close button */}
                <button
                    onClick={dismiss}
                    aria-label="ปิดการแจ้งเตือน"
                    className="shrink-0 ml-0.5 p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

export default LiveTicker;

