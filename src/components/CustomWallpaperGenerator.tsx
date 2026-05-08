'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Smartphone, Monitor, Loader2, Sparkles, Crown, Lock, Star, Zap } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface CustomWallpaperGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    surname?: string;
    totalScore: number;
    grade: string;
    day: string;
    luckyNumbers?: number[];
}

// Premium Day Themes - Each day has unique sacred design
const dayThemes: Record<string, {
    primary: string;
    secondary: string;
    tertiary: string;
    gradient: string;
    bgGradient: string;
    deity: string;
    deityEmoji: string;
    yantra: string;
    mantra: string;
    element: string;
    blessing: string;
    sacredSymbol: string;
    pattern: 'lotus' | 'star' | 'flame' | 'leaf' | 'moon' | 'diamond' | 'saturn';
}> = {
    sunday: {
        primary: '#dc2626',
        secondary: '#f97316',
        tertiary: '#fbbf24',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #ea580c 30%, #f97316 60%, #fbbf24 100%)',
        bgGradient: `
            radial-gradient(ellipse 120% 80% at 50% -20%, rgba(220, 38, 38, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 50% 120%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 30%),
            radial-gradient(circle at 80% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 30%)
        `,
        deity: 'พระอาทิตย์',
        deityEmoji: '☀️',
        yantra: 'ॐ सूर्याय',
        mantra: 'โอม สุริยายะ นะมะฮา',
        element: 'อัคนี (ไฟ)',
        blessing: 'เดชะบารมี อำนาจวาสนา',
        sacredSymbol: '۞',
        pattern: 'star',
    },
    monday: {
        primary: '#fbbf24',
        secondary: '#fde68a',
        tertiary: '#fffbeb',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #fde68a 80%, #fffbeb 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 100% at 50% 0%, rgba(251, 191, 36, 0.35) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(253, 230, 138, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 70%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)
        `,
        deity: 'พระจันทร์',
        deityEmoji: '🌙',
        yantra: 'ॐ चन्द्राय',
        mantra: 'โอม จันทรายะ นะมะฮา',
        element: 'อาโป (น้ำ)',
        blessing: 'เมตตามหานิยม เสน่ห์แรงกล้า',
        sacredSymbol: '☽',
        pattern: 'moon',
    },
    tuesday: {
        primary: '#ec4899',
        secondary: '#f472b6',
        tertiary: '#fce7f3',
        gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 40%, #f472b6 80%, #fce7f3 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(244, 114, 182, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 15% 40%, rgba(219, 39, 119, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 85% 60%, rgba(219, 39, 119, 0.15) 0%, transparent 35%)
        `,
        deity: 'พระอังคาร',
        deityEmoji: '🔥',
        yantra: 'ॐ अंगारक',
        mantra: 'โอม อังคารกายะ นะมะฮา',
        element: 'เตโช (ไฟ)',
        blessing: 'ชัยชนะ เดชานุภาพ',
        sacredSymbol: '♂',
        pattern: 'flame',
    },
    wednesday: {
        primary: '#22c55e',
        secondary: '#4ade80',
        tertiary: '#dcfce7',
        gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 40%, #4ade80 80%, #dcfce7 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(34, 197, 94, 0.35) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(74, 222, 128, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 35%, rgba(22, 163, 74, 0.12) 0%, transparent 35%),
            radial-gradient(circle at 80% 65%, rgba(22, 163, 74, 0.12) 0%, transparent 35%)
        `,
        deity: 'พระพุธ',
        deityEmoji: '🌿',
        yantra: 'ॐ बुधाय',
        mantra: 'โอม พุทธายะ นะมะฮา',
        element: 'ปฐวี (ดิน)',
        blessing: 'ปัญญาเฉียบแหลม การค้าเจริญ',
        sacredSymbol: '☿',
        pattern: 'leaf',
    },
    wednesday_night: {
        primary: '#065f46',
        secondary: '#047857',
        tertiary: '#34d399',
        gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 80%, #34d399 100%)',
        bgGradient: `
            radial-gradient(ellipse 120% 100% at 50% 0%, rgba(6, 78, 59, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(52, 211, 153, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 10% 50%, rgba(4, 120, 87, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 90% 50%, rgba(4, 120, 87, 0.2) 0%, transparent 40%)
        `,
        deity: 'พระราหู',
        deityEmoji: '🌑',
        yantra: 'ॐ राहवे',
        mantra: 'โอม ราหะเว นะมะฮา',
        element: 'อากาศ (ความว่าง)',
        blessing: 'ปกปักคุ้มครอง พ้นภัยอันตราย',
        sacredSymbol: '☊',
        pattern: 'moon',
    },
    thursday: {
        primary: '#f97316',
        secondary: '#fb923c',
        tertiary: '#fed7aa',
        gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 40%, #fb923c 80%, #fed7aa 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(249, 115, 22, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(251, 146, 60, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 25% 40%, rgba(234, 88, 12, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 75% 60%, rgba(234, 88, 12, 0.15) 0%, transparent 35%)
        `,
        deity: 'พระพฤหัสบดี',
        deityEmoji: '⚡',
        yantra: 'ॐ गुरवे',
        mantra: 'โอม คุรเว นะมะฮา',
        element: 'อากาศ (ลม)',
        blessing: 'ครูบาอาจารย์ ความรู้สูงส่ง',
        sacredSymbol: '♃',
        pattern: 'lotus',
    },
    friday: {
        primary: '#06b6d4',
        secondary: '#22d3ee',
        tertiary: '#a5f3fc',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #22d3ee 80%, #a5f3fc 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(6, 182, 212, 0.35) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(34, 211, 238, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 40%, rgba(8, 145, 178, 0.12) 0%, transparent 35%),
            radial-gradient(circle at 80% 60%, rgba(8, 145, 178, 0.12) 0%, transparent 35%)
        `,
        deity: 'พระศุกร์',
        deityEmoji: '💎',
        yantra: 'ॐ शुक्राय',
        mantra: 'โอม ศุกรายะ นะมะฮา',
        element: 'อาโป (น้ำ)',
        blessing: 'โชคลาภ ความมั่งคั่ง ความรัก',
        sacredSymbol: '♀',
        pattern: 'diamond',
    },
    saturday: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        tertiary: '#c4b5fd',
        gradient: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #8b5cf6 80%, #c4b5fd 100%)',
        bgGradient: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(124, 58, 237, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 15% 45%, rgba(109, 40, 217, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 85% 55%, rgba(109, 40, 217, 0.15) 0%, transparent 35%)
        `,
        deity: 'พระเสาร์',
        deityEmoji: '🪐',
        yantra: 'ॐ शनैश्चर',
        mantra: 'โอม ศไนศจรายะ นะมะฮา',
        element: 'ปฐวี (ดิน)',
        blessing: 'ความมั่นคง อดทน ป้องกันภัย',
        sacredSymbol: '♄',
        pattern: 'saturn',
    },
};

const gradeStyles: Record<string, { color: string; glow: string; label: string }> = {
    'A+': { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)', label: 'มหามงคล' },
    'A': { color: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)', label: 'มงคลยิ่ง' },
    'B+': { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)', label: 'มงคล' },
    'B': { color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.5)', label: 'ปานกลาง' },
    'C': { color: '#64748b', glow: 'rgba(100, 116, 139, 0.5)', label: 'ควรปรับปรุง' },
};

const dayNames: Record<string, string> = {
    sunday: 'อาทิตย์',
    monday: 'จันทร์',
    tuesday: 'อังคาร',
    wednesday: 'พุธ',
    wednesday_night: 'พุธกลางคืน',
    thursday: 'พฤหัสบดี',
    friday: 'ศุกร์',
    saturday: 'เสาร์',
};

// Calculate lucky numbers from name score
const calculateLuckyNumbers = (score: number): number[] => {
    const numbers: number[] = [];
    // Main lucky number from score
    numbers.push(score % 100);
    // Additional lucky numbers
    const sum = score.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    numbers.push(sum);
    if (sum > 9) {
        numbers.push(sum % 10 + Math.floor(sum / 10));
    }
    // Classic lucky numbers based on grade
    if (score >= 80) numbers.push(9, 19);
    else if (score >= 60) numbers.push(6, 24);
    else numbers.push(3, 14);

    return [...new Set(numbers)].slice(0, 5);
};

export const CustomWallpaperGenerator: React.FC<CustomWallpaperGeneratorProps> = ({
    isOpen,
    onClose,
    name,
    surname = '',
    totalScore,
    grade,
    day,
    luckyNumbers: providedLuckyNumbers,
}) => {
    const [format, setFormat] = useState<'mobile' | 'desktop'>('mobile');
    const [isGenerating, setIsGenerating] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
    const wallpaperRef = useRef<HTMLDivElement>(null);

    const theme = dayThemes[day] || dayThemes.sunday;
    const gradeStyle = gradeStyles[grade] || gradeStyles['C'];
    const luckyNumbers = providedLuckyNumbers || calculateLuckyNumbers(totalScore);
    const fullName = surname ? `${name} ${surname}` : name;

    const CREDIT_COST = 15;

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('credits, welcome_credits, welcome_credits_granted_at')
                    .eq('id', user.id)
                    .maybeSingle();
                let total = data?.credits ?? 0;
                if (data?.welcome_credits && data.welcome_credits > 0 && data?.welcome_credits_granted_at) {
                    const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
                    if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
                        total += data.welcome_credits;
                    }
                }
                setCredits(total);
            }
            setIsLoading(false);
        };
        getUser();
    }, []);

    const handleUnlock = async () => {
        if (!user || credits === null || credits < CREDIT_COST) return;

        setIsGenerating(true);
        try {
            // Deduct credits
            const { error } = await supabase
                .from('user_profiles')
                .update({ credits: credits - CREDIT_COST })
                .eq('id', user.id);

            if (error) throw error;

            // Try to record transaction (may fail due to RLS, but that's okay)
            try {
                await supabase.from('credit_transactions').insert({
                    user_id: user.id,
                    amount: -CREDIT_COST,
                    type: 'custom_wallpaper',
                    description: `สร้างวอลเปเปอร์มงคลส่วนตัว: ${fullName}`,
                });
            } catch {
                // Transaction logging failed, but credit deduction succeeded
            }

            setCredits(credits - CREDIT_COST);
            setIsPremiumUnlocked(true);
        } catch (error) {
            console.error('Failed to unlock:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Function to fix unsupported CSS color functions for html2canvas
    const fixColorFunctions = (clone: Document) => {
        // Remove all SVG elements as they cause parsing issues with html2canvas
        const svgElements = clone.querySelectorAll('svg');
        svgElements.forEach((svg) => {
            svg.remove();
        });

        const allElements = clone.querySelectorAll('*');
        allElements.forEach((el) => {
            try {
                const computedStyle = window.getComputedStyle(el);
                const stylesToCheck = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor', 'textDecorationColor', 'fill', 'stroke', 'boxShadow', 'textShadow'];

                stylesToCheck.forEach((prop) => {
                    try {
                        const value = computedStyle.getPropertyValue(prop);
                        if (value && (value.includes('lab(') || value.includes('oklch(') || value.includes('oklab('))) {
                            (el as HTMLElement).style.setProperty(prop, prop.includes('Shadow') ? 'none' : '#ffffff', 'important');
                        }
                    } catch {
                        // Ignore errors for individual properties
                    }
                });

                // Check background
                const bg = computedStyle.background;
                if (bg && (bg.includes('lab(') || bg.includes('oklch(') || bg.includes('oklab('))) {
                    (el as HTMLElement).style.setProperty('background', '#0f172a', 'important');
                }
            } catch {
                // Ignore errors for individual elements
            }
        });
    };

    const handleDownload = async () => {
        if (!wallpaperRef.current || isGenerating) return;

        setIsGenerating(true);
        try {
            await document.fonts.ready;
            await new Promise(resolve => setTimeout(resolve, 300));

            const element = wallpaperRef.current;

            const html2canvas = (await import('html2canvas')).default;

            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#0f172a',
                logging: false,
                onclone: (clonedDoc: Document) => {
                    fixColorFunctions(clonedDoc);
                },
            } as Parameters<typeof html2canvas>[1]);

            const image = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.href = image;
            link.download = `wallpaper-${name}-${format}.png`;
            link.click();
        } catch (error) {
            console.error('Failed to generate wallpaper:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    const dimensions = format === 'mobile'
        ? { width: 1080, height: 1920 }
        : { width: 1920, height: 1080 };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-purple-500/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">วอลเปเปอร์มงคลส่วนตัว</h3>
                                <p className="text-xs text-amber-400/80">ออกแบบพิเศษเฉพาะคุณ</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0f1a] flex items-center justify-center min-h-[300px]">
                        <div className="relative">
                            {/* Scaled Preview */}
                            <div
                                className="origin-top shadow-2xl rounded-xl overflow-hidden border-2 border-white/20"
                                style={{
                                    transform: format === 'mobile' ? 'scale(0.18)' : 'scale(0.22)',
                                    width: dimensions.width,
                                    height: dimensions.height,
                                    marginBottom: format === 'mobile' ? -1580 : -840,
                                    marginRight: format === 'mobile' ? -880 : -1500,
                                }}
                            >
                                <WallpaperContent
                                    name={name}
                                    surname={surname}
                                    grade={grade}
                                    totalScore={totalScore}
                                    luckyNumbers={luckyNumbers}
                                    theme={theme}
                                    gradeStyle={gradeStyle}
                                    dayName={dayNames[day]}
                                    format={format}
                                    dimensions={dimensions}
                                    isPremiumUnlocked={isPremiumUnlocked}
                                    birthDay={day}
                                />
                            </div>

                            {/* Hidden Full-size for capture */}
                            <div style={{ position: 'fixed', left: '-30000px', top: 0, zIndex: -9999 }}>
                                <WallpaperContent
                                    ref={wallpaperRef}
                                    name={name}
                                    surname={surname}
                                    grade={grade}
                                    totalScore={totalScore}
                                    luckyNumbers={luckyNumbers}
                                    theme={theme}
                                    gradeStyle={gradeStyle}
                                    dayName={dayNames[day]}
                                    format={format}
                                    dimensions={dimensions}
                                    isPremiumUnlocked={true}
                                    birthDay={day}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 bg-slate-900/80 border-t border-white/10 space-y-4">
                        {/* Format Toggle */}
                        <div className="flex justify-center gap-2 bg-black/30 p-1 rounded-xl">
                            <button
                                onClick={() => setFormat('mobile')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${format === 'mobile'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Smartphone className="w-4 h-4" />
                                มือถือ (9:16)
                            </button>
                            <button
                                onClick={() => setFormat('desktop')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${format === 'desktop'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Monitor className="w-4 h-4" />
                                เดสก์ท็อป (16:9)
                            </button>
                        </div>

                        {/* Action Button */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                            </div>
                        ) : !user ? (
                            <Link
                                href="/login"
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold flex items-center justify-center gap-2 hover:from-slate-500 hover:to-slate-600 transition-all"
                            >
                                <Lock className="w-5 h-5" />
                                เข้าสู่ระบบเพื่อสร้างวอลเปเปอร์
                            </Link>
                        ) : !isPremiumUnlocked ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm px-2">
                                    <span className="text-slate-400">เครดิตของคุณ:</span>
                                    <span className="text-amber-400 font-bold">{credits} เครดิต</span>
                                </div>
                                {credits !== null && credits >= CREDIT_COST ? (
                                    <button
                                        onClick={handleUnlock}
                                        disabled={isGenerating}
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                กำลังปลดล็อก...
                                            </>
                                        ) : (
                                            <>
                                                <Crown className="w-5 h-5" />
                                                ปลดล็อกวอลเปเปอร์มงคล ({CREDIT_COST} เครดิต)
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href="/topup"
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Zap className="w-5 h-5" />
                                        เติมเครดิต (ต้องการ {CREDIT_COST} เครดิต)
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        กำลังสร้างวอลเปเปอร์...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        ดาวน์โหลดวอลเปเปอร์ HD
                                    </>
                                )}
                            </button>
                        )}

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {[
                                { icon: '✨', text: 'ชื่อมงคล' },
                                { icon: '🔢', text: 'เลขมงคล' },
                                { icon: '🕉️', text: 'ยันต์ประจำวัน' },
                            ].map((feature, i) => (
                                <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-lg mb-1">{feature.icon}</div>
                                    <div className="text-xs text-slate-400">{feature.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// Wallpaper Content Component
interface WallpaperContentProps {
    name: string;
    surname: string;
    grade: string;
    totalScore: number;
    luckyNumbers: number[];
    theme: typeof dayThemes.sunday;
    gradeStyle: typeof gradeStyles['A+'];
    dayName: string;
    format: 'mobile' | 'desktop';
    dimensions: { width: number; height: number };
    isPremiumUnlocked: boolean;
    birthDay: string;
}

// Sacred Pattern Generator for each day
const getSacredPattern = (pattern: string, color: string): React.ReactNode[] => {
    const patterns: { [key: string]: React.ReactNode[] } = {
        lotus: [...Array(8)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${20 + (i * 10) % 60}%`,
                left: `${5 + (i * 12) % 90}%`,
                fontSize: 20 + (i % 3) * 8,
                opacity: 0.15 + (i % 3) * 0.05,
                transform: `rotate(${i * 45}deg)`,
                color: color,
            }}>✿</div>
        )),
        star: [...Array(10)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${10 + (i * 9) % 80}%`,
                left: `${8 + (i * 11) % 84}%`,
                fontSize: 14 + (i % 4) * 6,
                opacity: 0.1 + (i % 3) * 0.05,
                color: color,
            }}>✦</div>
        )),
        flame: [...Array(6)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${15 + (i * 15) % 70}%`,
                left: `${10 + (i * 16) % 80}%`,
                fontSize: 24 + (i % 3) * 10,
                opacity: 0.12 + (i % 3) * 0.04,
                transform: `scaleX(${i % 2 ? -1 : 1})`,
                color: color,
            }}>🔥</div>
        )),
        leaf: [...Array(8)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${12 + (i * 12) % 76}%`,
                left: `${6 + (i * 13) % 88}%`,
                fontSize: 18 + (i % 3) * 8,
                opacity: 0.1 + (i % 3) * 0.05,
                transform: `rotate(${i * 45 + 20}deg)`,
                color: color,
            }}>🌿</div>
        )),
        moon: [...Array(7)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${8 + (i * 14) % 84}%`,
                left: `${12 + (i * 14) % 76}%`,
                fontSize: 16 + (i % 4) * 8,
                opacity: 0.08 + (i % 3) * 0.04,
                transform: `rotate(${i * 30}deg)`,
                color: color,
            }}>☽</div>
        )),
        diamond: [...Array(9)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${10 + (i * 11) % 80}%`,
                left: `${8 + (i * 12) % 84}%`,
                fontSize: 12 + (i % 4) * 6,
                opacity: 0.1 + (i % 3) * 0.04,
                transform: `rotate(45deg)`,
                color: color,
            }}>◆</div>
        )),
        saturn: [...Array(6)].map((_, i) => (
            <div key={i} style={{
                position: 'absolute',
                top: `${15 + (i * 14) % 70}%`,
                left: `${10 + (i * 15) % 80}%`,
                fontSize: 18 + (i % 3) * 10,
                opacity: 0.08 + (i % 3) * 0.04,
                color: color,
            }}>♄</div>
        )),
    };
    return patterns[pattern] || patterns.star;
};

const getAdaptiveNameFontSize = (fullName: string, isMobile: boolean, canvasWidth: number): number => {
    const baseFontSize = isMobile ? 62 : 52;
    const padding = isMobile ? 100 : 240; // horizontal padding from container
    const availableWidth = canvasWidth - padding;
    // Approximate character width as 0.6 * fontSize for Thai characters
    const charWidthRatio = 0.6;
    const estimatedWidth = fullName.length * baseFontSize * charWidthRatio;

    if (estimatedWidth <= availableWidth) return baseFontSize;

    const scaledSize = Math.floor(availableWidth / (fullName.length * charWidthRatio));
    const minSize = isMobile ? 36 : 30;
    return Math.max(scaledSize, minSize);
};

const WallpaperContent = React.forwardRef<HTMLDivElement, WallpaperContentProps>(
    ({ name, surname, grade, totalScore, luckyNumbers, theme, gradeStyle, dayName, format, dimensions, isPremiumUnlocked, birthDay }, ref) => {
        const isMobile = format === 'mobile';
        const fullName = surname ? `${name} ${surname}` : name;
        const nameFontSize = getAdaptiveNameFontSize(fullName, isMobile, dimensions.width);

        return (
            <div
                ref={ref}
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    background: `linear-gradient(180deg, #050510 0%, #0a0a18 20%, #0d1020 50%, #0a0a18 80%, #050510 100%)`,
                    fontFamily: 'var(--font-geist-sans), "Sarabun", sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Base Background Gradient Layer */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: theme.bgGradient,
                    }}
                />

                {/* Sacred Pattern Background - Unique per day */}
                {getSacredPattern(theme.pattern, theme.primary)}

                {/* Multi-layer Mystical Background */}
                {/* Layer 1: Primary aura glow */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: `
                            radial-gradient(ellipse 100% 60% at 50% -10%, ${theme.primary}35 0%, transparent 60%),
                            radial-gradient(ellipse 80% 50% at 50% 110%, ${theme.secondary}25 0%, transparent 50%),
                            radial-gradient(ellipse 40% 40% at 15% 30%, ${theme.tertiary}15 0%, transparent 50%),
                            radial-gradient(ellipse 40% 40% at 85% 70%, ${theme.tertiary}15 0%, transparent 50%)
                        `,
                    }}
                />

                {/* Layer 2: Divine light rays from top */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-30%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '200%',
                        height: '80%',
                        background: `conic-gradient(from 90deg at 50% 100%, 
                            transparent 0deg, ${theme.primary}12 20deg, transparent 40deg, 
                            ${theme.secondary}08 60deg, transparent 80deg,
                            ${theme.primary}10 100deg, transparent 120deg,
                            ${theme.secondary}08 140deg, transparent 160deg,
                            ${theme.primary}12 180deg
                        )`,
                        opacity: 0.8,
                    }}
                />

                {/* Layer 3: Sacred Mandala circles */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: isMobile ? '150%' : '100%',
                        height: isMobile ? '80%' : '100%',
                        opacity: 0.15,
                    }}
                >
                    {[180, 150, 120, 90, 60].map((r, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: `${r}%`,
                            height: `${r}%`,
                            borderRadius: '50%',
                            border: `1px solid ${theme.primary}`,
                            opacity: 0.3 - (i * 0.05),
                        }} />
                    ))}
                </div>

                {/* Ornate Frame */}
                <div
                    style={{
                        position: 'absolute',
                        inset: isMobile ? 25 : 35,
                        border: `2px solid ${theme.primary}40`,
                        borderRadius: 24,
                        boxShadow: `inset 0 0 60px ${theme.primary}10`,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: isMobile ? 35 : 50,
                        border: `1px solid ${theme.primary}20`,
                        borderRadius: 18,
                    }}
                />

                {/* Elegant Corner Ornaments */}
                {[
                    { top: 40, left: 40, deg: 0 },
                    { top: 40, right: 40, deg: 90 },
                    { bottom: 40, right: 40, deg: 180 },
                    { bottom: 40, left: 40, deg: 270 },
                ].map((pos, i) => {
                    const { deg, ...position } = pos;
                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                ...position,
                                width: isMobile ? 70 : 90,
                                height: isMobile ? 70 : 90,
                                transform: `rotate(${deg}deg)`,
                            }}
                        >
                            {/* Corner decorative lines */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 50,
                                height: 3,
                                background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary}20)`,
                                borderRadius: 3,
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 3,
                                height: 50,
                                background: `linear-gradient(180deg, ${theme.primary}, ${theme.primary}20)`,
                                borderRadius: 3,
                            }} />
                            {/* Corner jewel */}
                            <div style={{
                                position: 'absolute',
                                top: -5,
                                left: -5,
                                width: 12,
                                height: 12,
                                background: `radial-gradient(circle, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                                borderRadius: '50%',
                                boxShadow: `0 0 15px ${theme.primary}, 0 0 30px ${theme.primary}50`,
                            }} />
                            {/* Additional decorative element */}
                            <div style={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                fontSize: 16,
                                opacity: 0.6,
                                color: theme.primary,
                            }}>{theme.sacredSymbol}</div>
                        </div>
                    );
                })}

                {/* Floating Sacred Particles */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: `${10 + (i * 6) % 80}%`,
                            left: `${8 + (i * 9) % 84}%`,
                            width: 3 + (i % 4) * 2,
                            height: 3 + (i % 4) * 2,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${i % 2 ? theme.primary : theme.secondary}70 0%, transparent 70%)`,
                            boxShadow: `0 0 ${8 + i * 2}px ${i % 2 ? theme.primary : theme.secondary}50`,
                        }}
                    />
                ))}

                {/* Main Content Container */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        padding: isMobile ? '90px 50px' : '70px 120px',
                        textAlign: 'center',
                    }}
                >
                    {/* Top Section - Sacred Header with Deity */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Deity Icon with divine glow */}
                        <div
                            style={{
                                position: 'relative',
                                marginBottom: isMobile ? 25 : 20,
                            }}
                        >
                            {/* Triple layer glow effect */}
                            <div style={{
                                position: 'absolute',
                                inset: -50,
                                background: `radial-gradient(circle, ${theme.primary}40 0%, transparent 50%)`,
                                borderRadius: '50%',
                            }} />
                            <div style={{
                                position: 'absolute',
                                inset: -35,
                                background: `radial-gradient(circle, ${theme.secondary}30 0%, transparent 60%)`,
                                borderRadius: '50%',
                            }} />
                            <div
                                style={{
                                    position: 'relative',
                                    fontSize: isMobile ? 85 : 70,
                                    filter: `drop-shadow(0 0 25px ${theme.primary}) drop-shadow(0 0 50px ${theme.primary}50)`,
                                }}
                            >
                                {theme.deityEmoji}
                            </div>
                        </div>

                        {/* Deity Name with ornate styling - Better contrast */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 20 : 15, marginBottom: isMobile ? 12 : 8 }}>
                            <div style={{
                                fontSize: isMobile ? 26 : 16,
                                color: 'rgba(255,255,255,0.8)',
                            }}>{theme.sacredSymbol}</div>
                            <div style={{ width: isMobile ? 60 : 50, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6))' }} />
                            <div
                                style={{
                                    fontSize: isMobile ? 38 : 24,
                                    fontWeight: 800,
                                    color: '#ffffff',
                                    letterSpacing: '0.1em',
                                    textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
                                }}
                            >
                                {theme.deity}
                            </div>
                            <div style={{ width: isMobile ? 60 : 50, height: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)' }} />
                            <div style={{
                                fontSize: isMobile ? 26 : 16,
                                color: 'rgba(255,255,255,0.8)',
                            }}>{theme.sacredSymbol}</div>
                        </div>

                        {/* Day label with element */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 12, whiteSpace: 'nowrap' as const }}>
                            <div
                                style={{
                                    fontSize: isMobile ? 24 : 14,
                                    color: '#ffffff',
                                    letterSpacing: '0.15em',
                                    textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
                                    fontWeight: 700,
                                }}
                            >
                                คนเกิดวัน{dayName}
                            </div>
                            <div style={{
                                padding: isMobile ? '6px 18px' : '4px 12px',
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.35)',
                                borderRadius: 20,
                                fontSize: isMobile ? 18 : 12,
                                color: '#ffffff',
                                fontWeight: 700,
                                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                                whiteSpace: 'nowrap' as const,
                            }}>
                                {theme.element}
                            </div>
                        </div>
                    </div>

                    {/* Center Section - Yantra & Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                        {/* Sacred Yantra Symbol with enhanced frame */}
                        <div
                            style={{
                                position: 'relative',
                                marginBottom: isMobile ? 40 : 35,
                            }}
                        >
                            {/* Multiple glow layers */}
                            <div style={{
                                position: 'absolute',
                                inset: -60,
                                background: `radial-gradient(circle, ${theme.primary}15 0%, transparent 50%)`,
                                borderRadius: '50%',
                            }} />

                            {/* Yantra container with premium styling */}
                            <div
                                style={{
                                    position: 'relative',
                                    padding: isMobile ? '30px 45px' : '25px 40px',
                                    background: `linear-gradient(145deg, ${theme.primary}15 0%, ${theme.secondary}08 50%, ${theme.tertiary}05 100%)`,
                                    border: `3px solid ${theme.primary}60`,
                                    borderRadius: 24,
                                    boxShadow: `
                                        0 0 50px ${theme.primary}25, 
                                        0 0 100px ${theme.primary}10,
                                        inset 0 0 40px ${theme.primary}10,
                                        inset 0 2px 0 ${theme.primary}30
                                    `,
                                }}
                            >
                                {/* Corner decorations on yantra frame */}
                                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        [corner.split('-')[0]]: -6,
                                        [corner.split('-')[1]]: -6,
                                        width: 12,
                                        height: 12,
                                        background: theme.primary,
                                        borderRadius: '50%',
                                        boxShadow: `0 0 10px ${theme.primary}`,
                                    }} />
                                ))}

                                <div
                                    style={{
                                        fontSize: isMobile ? 90 : 75,
                                        fontWeight: 900,
                                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 40%, ${theme.tertiary} 70%, ${theme.primary} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontFamily: 'serif',
                                        lineHeight: 1,
                                        filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
                                    }}
                                >
                                    {theme.yantra}
                                </div>
                            </div>
                        </div>

                        {/* Mantra/Blessing text */}
                        <div
                            style={{
                                fontSize: isMobile ? 24 : 15,
                                color: 'rgba(255,255,255,0.9)',
                                fontStyle: 'italic',
                                marginBottom: isMobile ? 20 : 15,
                                letterSpacing: '0.12em',
                                textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
                                fontWeight: 500,
                                whiteSpace: 'nowrap' as const,
                            }}
                        >
                            ✦ {theme.mantra} ✦
                        </div>

                        {/* Decorative divider above name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 12, marginBottom: isMobile ? 20 : 15 }}>
                            <div style={{ width: isMobile ? 80 : 60, height: 1, background: `linear-gradient(90deg, transparent, ${theme.primary}80)` }} />
                            <div style={{ fontSize: isMobile ? 18 : 12, color: theme.primary, filter: `drop-shadow(0 0 6px ${theme.primary})` }}>✦</div>
                            <div style={{ width: isMobile ? 80 : 60, height: 1, background: `linear-gradient(90deg, ${theme.primary}80, transparent)` }} />
                        </div>

                        {/* Name Display - Enhanced with better contrast */}
                        <div
                            style={{
                                fontSize: nameFontSize,
                                fontWeight: 800,
                                color: '#ffffff',
                                textShadow: `
                                    0 0 80px ${theme.primary}40, 
                                    0 0 40px rgba(255,255,255,0.2),
                                    0 4px 20px rgba(0,0,0,0.9),
                                    0 2px 4px rgba(0,0,0,0.8)
                                `,
                                letterSpacing: '0.08em',
                                marginBottom: isMobile ? 16 : 12,
                                lineHeight: 1.2,
                                whiteSpace: 'nowrap' as const,
                            }}
                        >
                            {fullName}
                        </div>

                        {/* Blessing text - Better contrast */}
                        <div
                            style={{
                                fontSize: isMobile ? 26 : 16,
                                color: 'rgba(255,255,255,0.85)',
                                lineHeight: 1,
                                textShadow: '0 2px 15px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                whiteSpace: 'nowrap' as const,
                            }}
                        >
                            「 {theme.blessing} 」
                        </div>
                    </div>

                    {/* Bottom Section - Lucky Numbers & Branding */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 40 : 30 }}>
                        {/* Lucky Numbers with enhanced styling */}
                        <div>
                            <div
                                style={{
                                    fontSize: isMobile ? 22 : 13,
                                    color: '#ffffff',
                                    marginBottom: isMobile ? 24 : 18,
                                    letterSpacing: '0.15em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: isMobile ? 14 : 10,
                                    textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)',
                                    fontWeight: 600,
                                }}
                            >
                                <span style={{ color: '#ffffff' }}>◆</span>
                                เลขมงคลประจำตัว
                                <span style={{ color: '#ffffff' }}>◆</span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: isMobile ? 18 : 12,
                                    justifyContent: 'center',
                                }}
                            >
                                {(luckyNumbers || [0, 0, 0, 0]).slice(0, 4).map((num, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: isMobile ? 85 : 60,
                                            height: isMobile ? 85 : 60,
                                            borderRadius: isMobile ? 20 : 16,
                                            background: 'rgba(255,255,255,0.12)',
                                            border: '2px solid rgba(255,255,255,0.35)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: isMobile ? 38 : 26,
                                            fontWeight: 800,
                                            color: '#ffffff',
                                            boxShadow: '0 4px 25px rgba(0,0,0,0.4), 0 8px 40px rgba(0,0,0,0.25)',
                                            textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                                        }}
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Branding Footer - Premium Style */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isMobile ? 14 : 10,
                                padding: isMobile ? '16px 40px' : '12px 30px',
                                background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)',
                                border: '1px solid rgba(251,191,36,0.40)',
                                borderRadius: 100,
                                boxShadow: '0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(251,191,36,0.25)',
                            }}
                        >
                            <span style={{ fontSize: isMobile ? 26 : 16 }}>⭐</span>
                            <span style={{
                                fontSize: isMobile ? 24 : 15,
                                color: '#fde68a',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                            }}>
                                NAMEMONGKOL
                            </span>
                            <span style={{ fontSize: isMobile ? 16 : 10, color: 'rgba(255,255,255,0.6)' }}>
                                • namemongkol.com
                            </span>
                        </div>
                    </div>

                    {/* Watermark Overlay if not unlocked */}
                    {!isPremiumUnlocked && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none',
                            }}
                        >
                            <div
                                style={{
                                    padding: '10px 30px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '100px',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    backdropFilter: 'blur(4px)',
                                    transform: 'rotate(-15deg)',
                                    boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
                                }}
                            >
                                <span style={{ fontSize: 32, color: 'rgba(255,255,255,0.9)', fontWeight: 800, letterSpacing: '0.2em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                    PREVIEW
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

WallpaperContent.displayName = 'WallpaperContent';

export default CustomWallpaperGenerator;
