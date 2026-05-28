'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Facebook, Eye, EyeOff, Loader2, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { trackEvent } from '@/lib/analytics';

// Rate limit error interface
interface RateLimitError {
    error: string;
    code: string;
    retryAfter?: number;
    remaining?: number;
}

export default function LoginClientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
    const [retryAfter, setRetryAfter] = useState<number | null>(null);

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const isPasswordResetSuccess = searchParams.get('reset') === 'success';

    const getSafeRedirectPath = useCallback((): string => {
        const candidate = searchParams.get('redirect') || '/';
        if (!candidate.startsWith('/') || candidate.startsWith('//')) return '/';
        return candidate;
    }, [searchParams]);

    const isBulkRedirect = getSafeRedirectPath().startsWith('/name-analysis');

    useEffect(() => {
        if (!isBulkRedirect) return;
        void trackEvent('login.page.from_bulk_analysis', {
            metadata: {
                redirect: getSafeRedirectPath(),
            },
        });
    }, [getSafeRedirectPath, isBulkRedirect]);

    // Format retry time for display
    const formatRetryTime = useCallback((seconds: number): string => {
        if (seconds < 60) return `${seconds} วินาที`;
        const minutes = Math.ceil(seconds / 60);
        if (minutes < 60) return `${minutes} นาที`;
        const hours = Math.ceil(minutes / 60);
        return `${hours} ชั่วโมง`;
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAgreed) return;
        if (retryAfter && retryAfter > 0) return; // Prevent submit while rate limited
        
        setIsLoading(true);
        setError(null);

        try {
            // Use API route with rate limiting
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // Handle rate limiting
            if (response.status === 429) {
                const rateLimitData = data as RateLimitError;
                setError(rateLimitData.error);
                setRemainingAttempts(0);
                if (rateLimitData.retryAfter) {
                    setRetryAfter(rateLimitData.retryAfter);
                    // Start countdown
                    const countdown = setInterval(() => {
                        setRetryAfter(prev => {
                            if (prev === null || prev <= 1) {
                                clearInterval(countdown);
                                return null;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
                return;
            }

            // Handle validation/auth errors
            if (!response.ok) {
                const errorData = data as RateLimitError;
                setError(errorData.error);
                if (errorData.remaining !== undefined) {
                    setRemainingAttempts(errorData.remaining);
                }
                return;
            }

            // Success - Set session from API response
            if (data.session) {
                await supabase.auth.setSession(data.session);
            }

            router.refresh();
            router.push(getSafeRedirectPath());

        } catch (err: unknown) {
            console.error('Login error:', err);
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!isAgreed) return;
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getSafeRedirectPath())}`,
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            console.error('Google login error:', err);
            setError((err as Error).message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google');
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        if (!isAgreed) return;
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getSafeRedirectPath())}`,
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            console.error('Facebook login error:', err);
            setError((err as Error).message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Facebook');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden flex items-center justify-center px-4 pt-24 pb-28 md:py-4">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-amber-200 mb-2">
                            เข้าสู่ระบบ
                        </h1>
                        <p className="text-slate-400 text-sm">
                            ยินดีต้อนรับกลับเข้าสู่ระบบ
                        </p>
                        {isBulkRedirect && (
                            <p className="mt-3 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                                เข้าสู่ระบบเพื่อใช้งานวิเคราะห์หลายชื่อแบบพรีเมียม (ใช้เครดิตตามจำนวนชื่อ)
                            </p>
                        )}
                    </div>

                    {/* Value Proposition */}
                    <div className="mb-6 grid grid-cols-2 gap-2">
                        {[
                            { emoji: '🎁', text: 'รับฟรี 30 เครดิต' },
                            { emoji: '💾', text: 'บันทึกผลย้อนหลัง' },
                            { emoji: '🔮', text: 'ปลดล็อกคำทำนายเชิงลึก' },
                            { emoji: '🖼️', text: 'แลกวอลเปเปอร์มงคล' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                                <span className="text-sm">{item.emoji}</span>
                                <span className="text-[11px] text-slate-300 font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <div className="flex-1">
                                <span>{error}</span>
                                {retryAfter && retryAfter > 0 && (
                                    <div className="mt-2 flex items-center gap-2 text-amber-400">
                                        <Clock className="w-4 h-4" />
                                        <span>รอได้ใน {formatRetryTime(retryAfter)}</span>
                                    </div>
                                )}
                                {remainingAttempts !== null && remainingAttempts > 0 && (
                                    <div className="mt-1 text-xs text-slate-400">
                                        เหลือโอกาสอีก {remainingAttempts} ครั้ง
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {isPasswordResetSuccess && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span>ตั้งรหัสผ่านใหม่สำเร็จแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">อีเมล</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="name@example.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">รหัสผ่าน</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-12 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                                    disabled={isLoading}
                                />
                                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">จดจำฉัน</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-amber-400 hover:text-amber-300 transition-colors pointer-events-auto"
                            >
                                ลืมรหัสผ่าน?
                            </button>
                        </div>

                        {/* Agreement Checkbox */}
                        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isAgreed}
                                        onChange={(e) => setIsAgreed(e.target.checked)}
                                        className="peer sr-only"
                                        disabled={isLoading}
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-500 rounded bg-transparent peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all"></div>
                                    <svg className="absolute w-3.5 h-3.5 text-slate-900 pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="text-xs text-slate-400 pt-0.5 leading-relaxed">
                                    ฉันได้อ่านและยอมรับ <Link href="/privacy" className="text-amber-400 hover:underline">นโยบายความเป็นส่วนตัว</Link> และ <Link href="/terms" className="text-amber-400 hover:underline">ข้อตกลงการใช้งาน</Link> ของ NameMongkol
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isAgreed}
                            data-track="login.form.submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>กำลังเข้าสู่ระบบ...</span>
                                </>
                            ) : (
                                <>
                                    <span>เข้าสู่ระบบ</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 text-slate-500 bg-[#0f172a]/50 backdrop-blur-sm">หรือเข้าสู่ระบบด้วย</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            data-track="login.social.facebook"
                            className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                            disabled={isLoading || !isAgreed}
                        >
                            <div className="bg-white rounded-full p-0.5">
                                <Facebook className="w-5 h-5 text-[#1877F2] fill-current" />
                            </div>
                            <span>ดำเนินการต่อด้วย Facebook</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            data-track="login.social.google"
                            className="w-full py-3 px-4 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                            disabled={isLoading || !isAgreed}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.52 12.29C23.52 11.43 23.44 10.71 23.3 10.05H12V14.53H18.57C18.3 16.08 17.38 17.5 15.93 18.53V21.75H19.75C21.99 19.66 23.52 16.47 23.52 12.29Z" fill="#4285F4" />
                                <path d="M12 24C15.24 24 17.96 22.92 19.98 21.05L16.2 17.7C15.09 18.45 13.67 18.9 12 18.9C8.84 18.9 6.16 16.71 5.2 13.8L1.35 16.79C3.36 20.9 7.42 24 12 24Z" fill="#34A853" />
                                <path d="M5.21 13.8C4.95 12.98 4.79 12.11 4.79 11.99C4.79 11.1 4.93 10.23 5.19 9.4L1.35 6.42C0.49 8.13 0 10.02 0 11.99C0 14.12 0.53 16.14 1.48 17.97L5.21 13.8Z" fill="#FBBC05" />
                                <path d="M12 5.1C14.33 5.1 15.91 6.11 16.8 6.96L20.08 3.73C18.06 1.84 15.34 0 12 0C7.42 0 3.36 3.1 1.35 7.21L5.2 10.2C6.16 7.28 8.84 5.1 12 5.1Z" fill="#EA4335" />
                            </svg>
                            <span>ดำเนินการต่อด้วย Google</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        ยังไม่มีบัญชีใช่ไหม?{' '}
                        <Link href="/register" className={`text-amber-400 hover:text-amber-300 font-medium transition-colors ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                            สมัครสมาชิก
                        </Link>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
            )}
        </div>
    );
}

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });
            if (error) throw error;
            setIsSent(true);
        } catch (err: unknown) {
            console.error('Reset password error:', err);
            setError((err as Error).message || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">ลืมรหัสผ่าน?</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {isSent ? (
                        <div className="text-center py-8 animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">ส่งอีเมลเรียบร้อยแล้ว</h3>
                            <p className="text-slate-400 mb-6">
                                กรุณาตรวจสอบอีเมลของคุณ (รวมถึงในโฟลเดอร์ขยะ) เพื่อทำการตั้งรหัสผ่านใหม่
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <p className="text-sm text-slate-400">
                                กรุณากรอกอีเมลที่ท่านใช้สมัครสมาชิก ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้ทางอีเมล
                            </p>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300 ml-1">อีเมลของคุณ</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
                                        placeholder="name@example.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>กำลังดำเนินการ...</span>
                                    </>
                                ) : (
                                    <span>ส่งลิงก์รีเซ็ตรหัสผ่าน</span>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
