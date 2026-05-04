'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Sparkles,
    User,
    Baby,
    Briefcase,
    Download,
    Share2,
    Crown,
    MessageCircle,
    Shield,
    Palette,
    RotateCcw,
    BookOpen,
    Zap,
    Users,
    Volume2,
    Eye,
    ChevronDown,
    Code,
    Heart,
    Hash,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { getEffectiveCredits } from '@/utils/credits';
import type { AuraResult } from '@/data/auraAnalysis';
import { LOADING_MESSAGES } from '@/data/auraAnalysis';
import { AuraCosmicBackground } from '@/components/AuraCosmicBackground';

const AURA_ANALYSIS_COST = 10;
const COOLDOWN_SECONDS = 30;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Step = 'input' | 'loading' | 'result';
type Purpose = 'self' | 'baby' | 'brand';
type Gender = 'male' | 'female';

const PURPOSE_OPTIONS: { value: Purpose; label: string; icon: React.ElementType }[] = [
    { value: 'self', label: 'ชื่อตัวเอง', icon: User },
    { value: 'baby', label: 'ชื่อลูก', icon: Baby },
    { value: 'brand', label: 'ชื่อแบรนด์', icon: Briefcase },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClientPage() {
    // State
    const [step, setStep] = useState<Step>('input');
    const [name, setName] = useState('');
    const [purpose, setPurpose] = useState<Purpose>('self');
    const [gender, setGender] = useState<Gender>('male');
    const [result, setResult] = useState<AuraResult | null>(null);
    const [error, setError] = useState('');
    const [loadingIdx, setLoadingIdx] = useState(0);
    const [imagePrompt, setImagePrompt] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);
    const [userCredits, setUserCredits] = useState<number | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const inFlightRef = useRef(false);
    const router = useRouter();

    const resultRef = useRef<HTMLDivElement>(null);

    // -----------------------------------------------------------------------
    // Fetch and watch credits
    // -----------------------------------------------------------------------
    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const credits = await getEffectiveCredits(user.id);
                    setUserCredits(credits.total);
                }
            } catch {
                // Not logged in
            }
        };
        fetchCredits();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const credits = await getEffectiveCredits(session.user.id);
                setUserCredits(credits.total);
            } else {
                setUserCredits(null);
            }
        });

        return () => { subscription.unsubscribe(); };
    }, []);

    // Clean up interval on unmount
    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

    const startCooldown = useCallback((seconds = COOLDOWN_SECONDS) => {
        const safeSeconds = Math.max(1, Math.ceil(seconds));
        setCooldown(safeSeconds);
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    if (cooldownRef.current) clearInterval(cooldownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    // -----------------------------------------------------------------------
    // Loading animation — cycle through messages
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (step !== 'loading') return;

        const interval = setInterval(() => {
            setLoadingIdx((prev) => {
                if (prev >= LOADING_MESSAGES.length - 1) return prev;
                return prev + 1;
            });
        }, 1200);

        return () => clearInterval(interval);
    }, [step]);

    // -----------------------------------------------------------------------
    // Submit handler
    // -----------------------------------------------------------------------
    const handleSubmit = useCallback(async () => {
        if (cooldown > 0 || inFlightRef.current) return;
        setError('');
        const trimmed = name.trim();

        if (!trimmed) {
            setError('กรุณากรอกชื่อ');
            return;
        }

        // Prevent double submits
        inFlightRef.current = true;
        let creditDeducted = false;

        try {
            const Swal = (await import('sweetalert2')).default;

            // 1. Check Auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                const authResult = await Swal.fire({
                    title: '🔒 กรุณาเข้าสู่ระบบ',
                    html: '<p style="color:#94a3b8">คุณต้องเข้าสู่ระบบก่อนจึงจะวิเคราะห์ออร่าได้</p>',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'เข้าสู่ระบบ',
                    cancelButtonText: 'ยกเลิก',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#d97706',
                    customClass: { popup: 'rounded-2xl border border-amber-500/20' },
                });
                if (authResult.isConfirmed) {
                    router.push('/login?redirect=/aura-analysis');
                }
                inFlightRef.current = false;
                return;
            }

            // 2. Check Credits
            const latestCredits = await getEffectiveCredits(user.id);
            setUserCredits(latestCredits.total);

            if (latestCredits.total < AURA_ANALYSIS_COST) {
                const topupResult = await Swal.fire({
                    title: '💰 เครดิตไม่เพียงพอ',
                    html: `<p style="color:#94a3b8">การวิเคราะห์ออร่าใช้ <strong style="color:#fbbf24">${AURA_ANALYSIS_COST} เครดิต</strong></p><p style="color:#94a3b8;margin-top:4px">คุณมี <strong style="color:#ef4444">${latestCredits.total} เครดิต</strong></p>`,
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'เติมเครดิต',
                    cancelButtonText: 'ยกเลิก',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#d97706',
                    customClass: { popup: 'rounded-2xl border border-amber-500/20' },
                });
                if (topupResult.isConfirmed) {
                    router.push('/topup');
                }
                inFlightRef.current = false;
                return;
            }

            // 3. Confirmation
            const confirmResult = await Swal.fire({
                title: '✨ ยืนยันการวิเคราะห์ออร่าด้วย AI',
                html: `<p style="color:#94a3b8">การวิเคราะห์จะใช้ <strong style="color:#fbbf24">${AURA_ANALYSIS_COST} เครดิต</strong></p><p style="color:#94a3b8;margin-top:4px">คุณมี <strong style="color:#34d399">${latestCredits.total} เครดิต</strong> (คงเหลือ ${latestCredits.total - AURA_ANALYSIS_COST} เครดิต)</p>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `ยืนยัน (ใช้ ${AURA_ANALYSIS_COST} เครดิต)`,
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#d97706',
                customClass: { popup: 'rounded-2xl border border-amber-500/20' },
            });

            if (!confirmResult.isConfirmed) {
                inFlightRef.current = false;
                return;
            }

            // 4. Deduct credits
            const { error: deductError } = await supabase.rpc('deduct_credits', { amount: AURA_ANALYSIS_COST });
            if (deductError) {
                await Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถหักเครดิตได้ กรุณาลองใหม่',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff',
                    customClass: { popup: 'rounded-2xl' },
                });
                inFlightRef.current = false;
                return;
            }

            creditDeducted = true;
            setUserCredits((prev) => (prev !== null ? prev - AURA_ANALYSIS_COST : null));
            window.dispatchEvent(new Event('force_credits_update'));

            // 5. Transition to loading state
            setLoadingIdx(0);
            setStep('loading');

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 65_000); // Route is maxDuration 60s

            try {
                const res = await fetch('/api/analyze-aura', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: trimmed,
                        purpose,
                        gender: purpose === 'brand' ? undefined : gender,
                    }),
                    signal: controller.signal,
                });
                
                clearTimeout(timeoutId);

                const json = await res.json();

                if (!res.ok || !json.success) {
                    // Check quota/rate limiting
                    if (res.status === 429 || json.code === 'QUOTA_EXHAUSTED' || json.code === 'RATE_LIMITED') {
                        startCooldown(COOLDOWN_SECONDS);
                        throw new Error('QUOTA');
                    }
                    throw new Error(json.error || 'เกิดข้อผิดพลาด');
                }

                // API success, mark deduction as finalized
                creditDeducted = false;

                // Wait for loading animation to finish (minimum display time)
                const minDelay = LOADING_MESSAGES.length * 1200;
                await new Promise((r) => setTimeout(r, minDelay));

                setResult(json.data as AuraResult);
                setImagePrompt(json.imagePrompt ?? '');
                setStep('result');
            } catch (fetchErr) {
                clearTimeout(timeoutId);
                throw fetchErr;
            }
        } catch (err: unknown) {
            // Refund credits if deducted but API failed
            if (creditDeducted) {
                try {
                    await supabase.rpc('deduct_credits', { amount: -AURA_ANALYSIS_COST });
                    setUserCredits((prev) => (prev !== null ? prev + AURA_ANALYSIS_COST : null));
                    window.dispatchEvent(new Event('force_credits_update'));
                    console.log('[aura] Credits refunded after failed analysis');
                } catch (refundErr) {
                    console.error('[aura] Failed to refund credits:', refundErr);
                }
            }

            let message = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
            if (err instanceof DOMException && err.name === 'AbortError') {
                message = 'การวิเคราะห์ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง';
            } else if (err instanceof Error) {
                if (err.message === 'QUOTA') {
                    message = 'ระบบมีผู้ใช้งานจำนวนมากในขณะนี้ กรุณารอสักครู่แล้วลองใหม่';
                } else {
                    message = err.message;
                }
            }
            
            setError(message);
            setStep('input');
        } finally {
            inFlightRef.current = false;
        }
    }, [name, purpose, gender, cooldown, router, startCooldown]);

    // -----------------------------------------------------------------------
    // Download as image
    // -----------------------------------------------------------------------
    const handleDownload = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await toPng(resultRef.current, {
                backgroundColor: '#0f172a',
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `aura-${result?.name ?? 'result'}.png`;
            link.href = dataUrl;
            link.click();
        } catch {
            // silent fallback
        }
    }, [result]);

    // -----------------------------------------------------------------------
    // Share
    // -----------------------------------------------------------------------
    const handleShare = useCallback(async () => {
        const shareData = {
            title: `ออร่าของ "${result?.name}" — ${result?.archetype}`,
            text: `ค้นพบตัวตนที่ซ่อนอยู่ในชื่อ "${result?.name}" กับ NameMongkol`,
            url: `${window.location.origin}/aura-analysis`,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // user cancelled
            }
        } else {
            await navigator.clipboard.writeText(shareData.url);
            alert('คัดลอกลิงก์แล้ว!');
        }
    }, [result]);

    // -----------------------------------------------------------------------
    // Reset
    // -----------------------------------------------------------------------
    const handleReset = () => {
        setStep('input');
        setResult(null);
        setError('');
        setName('');
        setLoadingIdx(0);
        setImagePrompt('');
        setShowPrompt(false);
    };

    // =======================================================================
    // RENDER
    // =======================================================================

    return (
        <div className="min-h-screen relative aura-page-shell">
            <AuraCosmicBackground />

            <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 sm:pt-28 sm:pb-12">
                {/* Page Header */}
                <div className="text-center mb-10 sm:mb-14 md:mb-16 relative">
                    {/* Decorative glowing orb behind the text for a premium feel */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] sm:w-[80%] h-[150%] bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 blur-[60px] md:blur-[80px] -z-10 rounded-full pointer-events-none" />
                    
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-5 hover:border-amber-500/30 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                        <Sparkles size={16} className="text-amber-400 animate-pulse" />
                        <span className="text-xs md:text-sm font-semibold text-amber-100 tracking-wider uppercase">AI Personality Analysis</span>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                        ค้นหาตัวตนด้วย <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_30px_rgba(201,147,58,0.3)]">ออร่า</span>
                        <br className="hidden sm:block" /> และพลังงานจากชื่อ
                    </h1>
                    
                    <p className="text-sm sm:text-base text-slate-300 max-w-[65ch] mx-auto leading-relaxed">
                        ถอดรหัสความหมายที่ซ่อนอยู่ในตัวอักษร ด้วยระบบ AI ขั้นสูง <br className="hidden md:block"/> ค้นพบ <span className="font-medium text-amber-300">12 Archetype</span> พลังงานสีมงคล และศาสตร์แห่งตัวตนที่แท้จริงของคุณ 
                    </p>
                </div>

                {/* ============================================================= */}
                {/* STEP 1: INPUT FORM                                            */}
                {/* ============================================================= */}
                {step === 'input' && (
                    <div className="max-w-lg mx-auto mt-2 sm:mt-3 animate-fade-in-up">
                        <div className="bg-white/5 border border-white/5 rounded-2xl backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
                            <div className="relative z-10">
                            {/* Name Input */}
                            <label className="aura-form-label block mb-1.5 text-sm font-medium">
                                ชื่อที่ต้องการวิเคราะห์
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder="พิมพ์ชื่อที่นี่..."
                                maxLength={100}
                                className="aura-input w-full px-4 py-3 rounded-xl focus:outline-none transition-all text-base"
                            />


                            {/* Purpose Selector */}
                            <label className="aura-form-label block mt-5 mb-2 text-sm font-medium">
                                จุดประสงค์
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {PURPOSE_OPTIONS.map((opt) => {
                                    const Icon = opt.icon;
                                    const active = purpose === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setPurpose(opt.value)}
                                            className={`aura-segment-button flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium ${active
                                                ? 'aura-segment-button-active'
                                                : ''
                                                }`}
                                        >
                                            <Icon size={20} className="aura-segment-icon" />
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Gender Selector — hidden for brand */}
                            {purpose !== 'brand' && (
                                <div className="mt-5">
                                    <label className="aura-form-label block mb-2 text-sm font-medium">เพศ</label>
                                    <div className="flex gap-3">
                                        {(['male', 'female'] as const).map((g) => (
                                            <label
                                                key={g}
                                                className={`aura-segment-button flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${gender === g
                                                    ? 'aura-segment-button-active'
                                                    : ''
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={g}
                                                    checked={gender === g}
                                                    onChange={() => setGender(g)}
                                                    className="sr-only"
                                                />
                                                {g === 'male' ? '👨 ชาย' : '👩 หญิง'}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="mt-4 p-4 bg-red-900/40 border border-red-800 rounded-xl text-red-200 text-center text-sm backdrop-blur-sm">
                                    {error === 'QUOTA' ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <p>ระบบมีผู้ใช้งานจำนวนมากในขณะนี้ กรุณารอสักครู่แล้วลองใหม่</p>
                                            <button
                                                onClick={() => setError('')}
                                                disabled={cooldown > 0}
                                                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                {cooldown > 0 ? `รอสักครู่... (${cooldown}วิ)` : 'ลองอีกครั้ง'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <p>{error}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Credits Info */}
                            <div className="aura-pricing-row mt-6 flex items-center justify-between text-sm px-1">
                                <span>ค่าบริการวิเคราะห์</span>
                                <div className="text-right">
                                    <span className="font-semibold text-amber-400">{AURA_ANALYSIS_COST} เครดิต</span>
                                    {userCredits !== null && (
                                        <span className="text-slate-500 text-[11px] block mt-0.5">
                                            (คงเหลือ {userCredits} เครดิต)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={!name.trim() || cooldown > 0}
                                className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 text-white font-bold text-base transition-all duration-200 hover:bg-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.22)] hover:shadow-[0_0_32px_rgba(245,158,11,0.30)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:bg-slate-800/50 disabled:text-slate-500 disabled:shadow-none border border-amber-400/20 disabled:border-white/5"
                            >
                                <Sparkles size={18} />
                                เริ่มวิเคราะห์ออร่าด้วย AI
                            </button>
                        </div>
                        </div>
                    </div>
                )}

                {/* ============================================================= */}
                {/* STEP 2: LOADING STATE                                         */}
                {/* ============================================================= */}
                {step === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <Sparkles size={40} className="text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                        </div>
                        <p className="text-lg font-medium text-amber-300 transition-all duration-300 min-h-[28px]">
                            {LOADING_MESSAGES[loadingIdx]}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">กรุณารอสักครู่...</p>
                    </div>
                )}

                {/* ============================================================= */}
                {/* STEP 3: RESULT CARD                                           */}
                {/* ============================================================= */}
                {step === 'result' && result && (
                    <div className="animate-fade-in-up">
                        <div
                            ref={resultRef}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-2xl"
                        >
                            {/* Two-column layout: image + data */}
                            <div className="grid md:grid-cols-2">
                                {/* LEFT — Persona Image */}
                                <div className="relative min-h-[320px] md:min-h-[480px] bg-gradient-to-br from-[#1a1040] to-[#0f172a] flex items-center justify-center overflow-hidden">
                                    {/* Decorative radial */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,147,58,0.12)_0%,_transparent_70%)]" />

                                    {result.imageSource === 'generated' ? (
                                        /* AI-generated image */
                                        <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-8">
                                            <div className="relative">
                                                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 blur-xl" />
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={result.imageUrl}
                                                    alt={`ภาพออร่า AI สำหรับ ${result.name}`}
                                                    className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl object-cover border-2 border-amber-500/30 shadow-[0_0_40px_rgba(201,147,58,0.2)]"
                                                />
                                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
                                                    <span className="text-[10px] font-medium text-amber-300">AI Generated</span>
                                                </div>
                                            </div>
                                            {/* Name + Archetype */}
                                            <div className="text-center mt-2">
                                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">{result.name}</h2>
                                                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/5 backdrop-blur-sm">
                                                    <Crown size={14} className="text-amber-400" />
                                                    <span className="text-xs sm:text-sm font-medium text-amber-400 tracking-wide uppercase">{result.archetype}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Placeholder — moodboard gradient + emoji */
                                        <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-8">
                                            <div
                                                className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-amber-500/30 shadow-[0_0_40px_rgba(201,147,58,0.2)] flex items-center justify-center overflow-hidden"
                                                style={{
                                                    background: `linear-gradient(135deg, ${result.moodboard[0]?.hex ?? '#D4AF37'}40, ${result.moodboard[1]?.hex ?? '#1B1464'}40, ${result.moodboard[2]?.hex ?? '#8B0000'}40)`,
                                                }}
                                            >
                                                <span className="text-6xl sm:text-7xl">
                                                    {result.spiritIdentity.match(/\p{Emoji_Presentation}/u)?.[0] ?? '✨'}
                                                </span>
                                            </div>
                                            {/* Name + Archetype */}
                                            <div className="text-center">
                                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{result.name}</h2>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                                                    <Crown size={14} className="text-amber-400" />
                                                    <span className="text-xs sm:text-sm font-medium text-amber-300">{result.archetype}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT — Analysis Data */}
                                <div className="p-5 sm:p-6 md:p-8 space-y-5">
                                    {/* Score Badge */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Shield size={18} className="text-amber-400" />
                                            ผลวิเคราะห์ออร่า
                                        </h3>
                                        <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-500/20">
                                            {result.score}
                                        </span>
                                    </div>

                                    {/* Personality Traits */}
                                    <div>
                                        <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Personality Traits</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.personalityTraits.map((trait) => (
                                                <span
                                                    key={trait}
                                                    className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-300 text-xs sm:text-sm font-medium"
                                                >
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Vibe Analysis */}
                                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <MessageCircle size={16} className="text-amber-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Vibe Analysis</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{result.vibeAnalysis}</p>
                                    </div>

                                    {/* 4-Grid Info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Career Fit */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Briefcase size={14} className="text-amber-400" />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Career Fit</span>
                                            </div>
                                            <p className="text-sm text-slate-200 font-medium">{result.careerFit}</p>
                                        </div>

                                        {/* Voice & Tone */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <MessageCircle size={14} className="text-amber-400" />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Voice & Tone</span>
                                            </div>
                                            <p className="text-sm text-slate-200 font-medium">{result.voiceTone}</p>
                                        </div>

                                        {/* Spirit Identity */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Shield size={14} className="text-amber-400" />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Spirit Identity</span>
                                            </div>
                                            <p className="text-sm text-slate-200 font-medium">{result.spiritIdentity}</p>
                                        </div>

                                        {/* Visual Moodboard */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Palette size={14} className="text-amber-400" />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Moodboard</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                {result.moodboard.map((color) => (
                                                    <div key={color.hex} className="flex items-center gap-1.5 group">
                                                        <div
                                                            className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                                                            style={{ backgroundColor: color.hex }}
                                                            title={`${color.name} (${color.hex})`}
                                                        />
                                                        <span className="text-[10px] text-slate-400 hidden sm:inline group-hover:text-slate-200 transition-colors">
                                                            {color.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Enhanced Analysis Sections ── */}

                                    {/* First Impression Score */}
                                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Eye size={16} className="text-amber-400" />
                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">คะแนนความประทับใจแรก</span>
                                            </div>
                                            <span className="text-lg font-bold text-amber-400">{result.firstImpressionScore}/100</span>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/5">
                                            <div
                                                className="h-full rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000"
                                                style={{ width: `${result.firstImpressionScore}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Phonetic Analysis */}
                                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Volume2 size={16} className="text-amber-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">การวิเคราะห์เสียงของชื่อ (Phonetics)</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{result.phoneticAnalysis}</p>
                                    </div>

                                    {/* Semantic Analysis */}
                                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <BookOpen size={16} className="text-amber-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">ความหมายเชิงสัญลักษณ์ (Semantics)</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{result.semanticAnalysis}</p>
                                    </div>

                                    {/* Name Energy Breakdown */}
                                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Zap size={16} className="text-amber-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">พลังงานแต่ละพยางค์</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{result.nameEnergyBreakdown}</p>
                                    </div>

                                    {/* Social Perception */}
                                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users size={16} className="text-amber-400" />
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">การรับรู้จากคนรอบข้าง</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{result.socialPerception}</p>
                                    </div>

                                    {/* ── NEW: Deep Analysis Sections ── */}

                                    {/* 📖 Meaning Breakdown */}
                                    {result.meaning && (
                                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BookOpen size={16} className="text-amber-400" />
                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">📖 ถอดรหัสความหมายของชื่อ</span>
                                            </div>
                                            <p className="text-base font-semibold text-amber-200 mb-2">{result.meaning}</p>
                                            {result.meaningBreakdown && (
                                                <p className="text-sm text-slate-300 leading-relaxed">{result.meaningBreakdown}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* 👤 Identity Analysis */}
                                    {result.identity && result.identity.length > 0 && (
                                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <User size={16} className="text-amber-400" />
                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">👤 การวิเคราะห์ตัวตน (Identity)</span>
                                            </div>
                                            <ul className="space-y-1.5">
                                                {result.identity.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                                        <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* ✨ Aura Colors */}
                                    {result.auraColors && result.auraColors.length > 0 && (
                                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Sparkles size={16} className="text-amber-400" />
                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">✨ การวิเคราะห์ออร่า (Aura & Energy)</span>
                                            </div>
                                            <div className="space-y-3">
                                                {result.auraColors.map((aura, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                        <span className="text-2xl flex-shrink-0">{aura.emoji}</span>
                                                        <div>
                                                            <p className="text-sm font-semibold text-amber-200 tracking-tight">
                                                                {idx === 0 ? 'ออร่าหลัก' : 'ออร่ารอง'}: {aura.color}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{aura.meaning}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 🤝 Relationship */}
                                    {result.relationship && (
                                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Heart size={16} className="text-amber-400" />
                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">🤝 ด้านความรักและความสัมพันธ์</span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed">{result.relationship}</p>
                                        </div>
                                    )}

                                    {/* 🔢 Numerology */}
                                    {result.numerologyTotal > 0 && (
                                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Hash size={16} className="text-amber-400" />
                                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">🔢 พลังงานตัวเลข (Numerology)</span>
                                                </div>
                                                <span className="text-lg font-bold text-amber-400">{result.numerologyTotal}</span>
                                            </div>
                                            {result.numerologyMeaning && (
                                                <p className="text-sm text-slate-300 leading-relaxed">{result.numerologyMeaning}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Visual Mood Keywords */}
                                    <div>
                                        <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Visual Style Keywords</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.visualMoodKeywords.map((keyword) => (
                                                <span
                                                    key={keyword}
                                                    className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-300 text-xs sm:text-sm font-medium"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prompt Viewer — outside resultRef so it's excluded from image export */}
                        {imagePrompt && (
                            <div className="mt-4 rounded-2xl border border-slate-500/20 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                                <button
                                    onClick={() => setShowPrompt((v) => !v)}
                                    className="w-full flex items-center justify-between px-5 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Code size={16} className="text-slate-400" />
                                        ดู Prompt ที่ใช้สร้างภาพ (AI)
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 transition-transform duration-200 ${showPrompt ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {showPrompt && (
                                    <div className="px-5 pb-4">
                                        <pre className="text-xs text-slate-400 bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 whitespace-pre-wrap break-words max-h-40 overflow-y-auto font-mono leading-relaxed">
                                            {imagePrompt}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
                            >
                                <Download size={16} />
                                บันทึกรูป
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
                            >
                                <Share2 size={16} />
                                แชร์
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <RotateCcw size={16} />
                                วิเคราะห์ชื่อใหม่
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
