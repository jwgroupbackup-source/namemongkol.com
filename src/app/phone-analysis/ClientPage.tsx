'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { analyzePhone, PhoneAnalysisResult as IPhoneAnalysisResult } from '@/utils/analyzePhone';
import { PhoneAnalysisResult } from '@/components/PhoneAnalysisResult';
import { PhoneSacredBackground } from '@/components/PhoneSacredBackground';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/utils/supabase';
import { getEffectiveCredits } from '@/utils/credits';
import { PHONE_AI_COST } from '@/lib/phoneAiPromptDefaults';
import type { PhoneAiAnalysis } from '@/types';

const PhoneHeader = () => {
    const { t } = useLanguage();

    return (
        <div className="relative z-10 text-center w-full max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-16 animate-fade-in-up">
            {/* Decorative glowing orb behind the text for a premium feel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] sm:w-[80%] h-[150%] bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 blur-[60px] md:blur-[80px] -z-10 rounded-full pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-5 hover:border-amber-500/30 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <span className="text-amber-400 animate-pulse">✦</span>
                <span className="text-xs md:text-sm font-semibold text-amber-100 tracking-wider uppercase">เช็คเบอร์มงคลฟรี</span>
            </div>
            
            <div aria-hidden="true" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                {t('pages.phoneAnalysis.heroTitle')}{' '}
                <span className="text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                    {t('pages.phoneAnalysis.heroHighlight')}
                </span>
            </div>
            
            <p className="text-sm sm:text-base text-slate-300 max-w-[65ch] mx-auto leading-relaxed">
                {t('pages.phoneAnalysis.heroSubtitle')}
            </p>
        </div>
    );
};

const SocialProof = () => {
    const { t } = useLanguage();

    return (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-200/90" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.60)' }}>
            <span className="flex items-center gap-1.5">
                <span className="text-amber-400">★</span> 4.9/5 {t('pages.phoneAnalysis.socialRating')}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-500/50" />
            <span>{t('pages.phoneAnalysis.socialAnalyzed')}</span>
        </div>
    );
};

const ClientPageFallback = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
            <main className="w-full max-w-[1400px] transition-all duration-300 min-h-screen px-4 pt-20 md:pt-28 pb-10 relative flex flex-col items-center">
                <PhoneSacredBackground />

                <PhoneHeader />

                {/* Input Section - Static/Disabled for fallback */}
                <div className="w-full max-w-2xl relative z-10 animate-fade-in-up delay-100">
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-2 sm:p-3 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
                        <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                            <input
                                type="text"
                                disabled
                                placeholder={t('pages.phoneAnalysis.placeholder')}
                                className="phone-analysis-input flex-1 px-6 py-4 rounded-2xl outline-none transition-all text-lg font-medium text-center sm:text-left tracking-wider"
                            />
                            <button
                                disabled
                                className="phone-analysis-button-disabled px-8 py-4 rounded-2xl font-bold cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
                            >
                                <Search size={20} />
                                <span>{t('pages.phoneAnalysis.analyzeButton')}</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center mt-3 text-xs text-amber-400/70" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                        ฟรี! วิเคราะห์ได้ไม่จำกัดจำนวนครั้ง
                    </p>

                    <SocialProof />
                </div>

                {/* SEO Content is rendered server-side in page.tsx */}
            </main>
        </div>
    );
};

export default function ClientPage() {
    return (
        <React.Suspense fallback={<ClientPageFallback />}>
            <ClientPageContent />
        </React.Suspense>
    );
}

function ClientPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { t } = useLanguage();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<IPhoneAnalysisResult | null>(null);
    const [error, setError] = useState('');

    // AI Analysis state
    const [aiAnalysis, setAiAnalysis] = useState<PhoneAiAnalysis | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiProfession, setAiProfession] = useState('');
    const aiInFlightRef = useRef(false);

    const performAnalysis = useCallback(async (number: string) => {
        setLoading(true);
        setError('');

        // Simulate API delay for UX (slightly faster for direct link visits)
        await new Promise(resolve => setTimeout(resolve, 500));

        const analysis = await analyzePhone(number);
        if (analysis) {
            setResult(analysis);
        } else {
            setError(t('pages.phoneAnalysis.errors.failed'));
        }

        setLoading(false);
    }, [t]);

    // Check URL for number on mount/update
    useEffect(() => {
        const numberParam = searchParams.get('number');
        // Only run if we have a number param, it's valid, and we don't have a result yet (or the result doesn't match)
        if (numberParam && /^\d{10}$/.test(numberParam)) {
            // If the current result matches the param, don't re-analyze
            if (result && result.phoneNumber.replace(/-/g, '') === numberParam) return;

            // Defer to avoid set-state-in-effect warning
            setTimeout(() => {
                setPhoneNumber(numberParam);
                performAnalysis(numberParam);
            }, 0);
        }
    }, [searchParams, performAnalysis, result]);



    const handleAnalyze = async () => {
        setError('');
        if (!phoneNumber) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            const Swal = (await import('sweetalert2')).default;
            const authResult = await Swal.fire({
                title: '🔒 กรุณาเข้าสู่ระบบ',
                html: '<p style="color:#94a3b8">คุณต้องเข้าสู่ระบบก่อนจึงจะทำนายเบอร์ได้</p>',
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
                router.push('/login');
            }
            return;
        }

        // Basic validation
        const clean = phoneNumber.replace(/\D/g, '');
        if (clean.length !== 10) {
            setError(t('pages.phoneAnalysis.errors.invalid'));
            return;
        }

        // Update URL - useEffect will handle the analysis
        const params = new URLSearchParams(searchParams.toString());
        params.set('number', clean);
        router.replace(`?${params.toString()}`);
    };

    // ── AI Profession Analysis Handler ──
    const handleAiAnalysis = async () => {
        if (!result || !aiProfession.trim() || aiInFlightRef.current) return;

        const Swal = (await import('sweetalert2')).default;

        // Step 1: Auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            const authResult = await Swal.fire({
                title: '🔒 กรุณาเข้าสู่ระบบ',
                html: '<p style="color:#94a3b8">คุณต้องเข้าสู่ระบบก่อนใช้งาน AI วิเคราะห์เชิงลึก</p>',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#d97706',
                customClass: { popup: 'rounded-2xl border border-amber-500/20' },
            });
            if (authResult.isConfirmed) router.push('/login');
            return;
        }

        // Step 2: Credit check
        const latestCredits = await getEffectiveCredits(user.id);
        if (latestCredits.total < PHONE_AI_COST) {
            const topupResult = await Swal.fire({
                title: '💳 เครดิตไม่เพียงพอ',
                html: `<p style="color:#94a3b8">ต้องใช้ <strong style="color:#fbbf24">${PHONE_AI_COST} เครดิต</strong> คุณมี <strong style="color:#ef4444">${latestCredits.total} เครดิต</strong></p>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'เติมเครดิต',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#d97706',
                customClass: { popup: 'rounded-2xl border border-amber-500/20' },
            });
            if (topupResult.isConfirmed) router.push('/topup');
            return;
        }

        // Step 3: Confirmation
        const confirmResult = await Swal.fire({
            title: '✨ ยืนยันการวิเคราะห์ AI',
            html: `<p style="color:#94a3b8">วิเคราะห์เชิงลึกตามอาชีพ "<strong style="color:#fbbf24">${aiProfession.trim()}</strong>" จะใช้ <strong style="color:#fbbf24">${PHONE_AI_COST} เครดิต</strong></p><p style="color:#94a3b8;margin-top:4px">คุณมี <strong style="color:#34d399">${latestCredits.total} เครดิต</strong> (คงเหลือ ${latestCredits.total - PHONE_AI_COST} เครดิต)</p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `ยืนยัน (ใช้ ${PHONE_AI_COST} เครดิต)`,
            cancelButtonText: 'ยกเลิก',
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#d97706',
            customClass: { popup: 'rounded-2xl border border-amber-500/20' },
        });
        if (!confirmResult.isConfirmed) return;

        // Step 4: Call AI API first, deduct credits AFTER success
        // (avoids broken refund flow — deduct_credits rejects negative amounts)
        aiInFlightRef.current = true;
        setAiLoading(true);
        setAiAnalysis(null);

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000);

            const response = await fetch('/api/analyze-phone-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: result.phoneNumber,
                    profession: aiProfession.trim(),
                    pairs: result.pairs.map(p => ({
                        pair: p.pair,
                        level: p.level,
                        grade: p.grade,
                        title: p.title,
                        description: p.description,
                        tags: p.tags,
                    })),
                    grade: result.grade,
                    stats: result.stats,
                    totalScore: result.totalScore,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})) as { error?: string; details?: string; code?: string };
                const retryAfter = response.headers.get('Retry-After');
                const retrySeconds = retryAfter ? Math.max(1, Math.ceil(Number(retryAfter))) : 30;
                const baseMessage = errorData.error || `API error ${response.status}`;
                const message = response.status === 429
                    ? `${baseMessage} กรุณารอ ${retrySeconds} วินาทีแล้วลองใหม่`
                    : errorData.details
                        ? `${baseMessage} (${errorData.details})`
                        : baseMessage;
                throw new Error(message);
            }

            const data = await response.json();
            if (data.success && data.analysis) {
                // Step 5: Deduct credits only after successful analysis
                const { error: deductError } = await supabase.rpc('deduct_credits', { amount: PHONE_AI_COST });
                if (deductError) {
                    console.error('[phone-ai] Credit deduction failed after success:', deductError);
                    // Still show result — credit issue can be resolved separately
                }
                window.dispatchEvent(new Event('force_credits_update'));
                setAiAnalysis(data.analysis);
            } else {
                throw new Error('Invalid response from AI');
            }
        } catch (err) {
            console.error('[phone-ai] Analysis failed:', err);

            const errorMessage = err instanceof Error && err.name === 'AbortError'
                ? 'การวิเคราะห์ใช้เวลานานเกินไป กรุณาลองใหม่'
                : err instanceof Error
                    ? err.message
                    : 'ไม่สามารถวิเคราะห์ได้ กรุณาลองใหม่';

            await Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: errorMessage,
                icon: 'error',
                background: '#1e293b',
                color: '#fff',
                customClass: { popup: 'rounded-2xl' },
            });
        } finally {
            setAiLoading(false);
            aiInFlightRef.current = false;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAnalyze();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
            <main className="w-full max-w-[1400px] transition-all duration-300 min-h-screen px-4 pt-20 md:pt-28 pb-36 md:pb-28 relative flex flex-col items-center">
                <PhoneSacredBackground />

                {/* Header Section */}
                {!result && <PhoneHeader />}

                {/* Input Section */}
                {!result && (
                    <div className="w-full max-w-2xl relative z-10 animate-fade-in-up delay-100">
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-2.5 sm:p-3 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
                            <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setPhoneNumber(val);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('pages.phoneAnalysis.placeholder')}
                                    className="phone-analysis-input flex-1 px-5 py-4 rounded-2xl outline-none transition-all text-lg font-medium text-center sm:text-left tracking-wider"
                                />
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading || phoneNumber.length !== 10}
                                    data-track="phone.hero.analyze"
                                    className={`
                                        px-6 sm:px-8 py-4 rounded-2xl font-bold text-white transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 min-w-full sm:min-w-[160px]
                                        ${phoneNumber.length === 10
                                            ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.22)] hover:shadow-[0_0_32px_rgba(245,158,11,0.30)] border border-amber-400/20 cursor-pointer'
                                            : 'bg-slate-800/50 text-slate-500 border border-white/5 cursor-not-allowed'}
                                    `}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                                    <span>{t('pages.phoneAnalysis.analyzeButton')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Helper text + counter */}
                        <div className="flex items-center justify-between mt-3 px-3 gap-3">
                            <p className="text-xs text-amber-400/70" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                                ฟรี! วิเคราะห์ได้ไม่จำกัดจำนวนครั้ง
                            </p>
                            {phoneNumber.length > 0 && (
                                <span className={`text-xs font-mono tabular-nums transition-colors ${phoneNumber.length === 10 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {phoneNumber.length}/10
                                </span>
                            )}
                        </div>

                        <div className="flex justify-center mt-2">
                            <SocialProof />
                        </div>

                        {error && (
                            <p className="text-red-400 text-center mt-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20 text-sm font-medium animate-shake">
                                {error}
                            </p>
                        )}
                    </div>
                )}

                {!result && (
                    <div className="md:hidden fixed inset-x-4 bottom-4 z-30">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 py-3 shadow-2xl shadow-black/30">
                            <div className="flex items-center gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">พร้อมวิเคราะห์</p>
                                    <p className="text-sm font-semibold text-white truncate">
                                        {phoneNumber.length > 0 ? `${phoneNumber.length}/10 หมายเลข` : 'กรอกหมายเลข 10 หลักเพื่อเริ่ม'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading || phoneNumber.length !== 10}
                                    className={`shrink-0 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${phoneNumber.length === 10
                                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 active:scale-95'
                                        : 'bg-slate-800/70 text-slate-500 border border-white/5'
                                        }`}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                                    วิเคราะห์
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Content - Show only when no result */}
                {!result && (
                    <>{/* SEO content rendered server-side in page.tsx */}</>
                )}

                {result && (
                    <div className="w-full flex flex-col items-center gap-8 relative z-10">
                        <PhoneAnalysisResult
                            result={result}
                            onReset={() => {
                                window.location.href = '/phone-analysis';
                            }}
                            aiAnalysis={aiAnalysis}
                            aiLoading={aiLoading}
                            aiProfession={aiProfession}
                            onAiProfessionChange={setAiProfession}
                            onRequestAiAnalysis={handleAiAnalysis}
                        />

                        <button
                            onClick={() => {
                                window.location.href = '/phone-analysis';
                            }}
                            className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                        >
                            {t('pages.phoneAnalysis.reset')}
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}
