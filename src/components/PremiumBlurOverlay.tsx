'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, Crown, Zap, Eye, Gift, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

interface PremiumBlurOverlayProps {
    children: React.ReactNode;
    isLocked?: boolean;
    creditCost?: number;
    onUnlock?: () => void | Promise<void>;
    featureName?: string;
}

export const PremiumBlurOverlay: React.FC<PremiumBlurOverlayProps> = ({
    children,
    isLocked = true,
    creditCost = 10,
    onUnlock,
    featureName = 'คำทำนายเชิงลึก',
}) => {
    const router = useRouter();
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [credits, setCredits] = useState<number | null>(null);
    const [isLocallyUnlocked, setIsLocallyUnlocked] = useState(false);

    const fetchUserCredits = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('credits, welcome_credits, welcome_credits_granted_at')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching user credits:', error);
            return null;
        }
        let total = data?.credits ?? 0;
        if (data?.welcome_credits && data.welcome_credits > 0 && data?.welcome_credits_granted_at) {
            const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
            if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
                total += data.welcome_credits;
            }
        }
        return total;
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const latestCredits = await fetchUserCredits(user.id);
                setCredits(latestCredits);
            } else {
                setCredits(null);
            }
            setIsLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserCredits(session.user.id).then(setCredits);
            } else {
                setCredits(null);
                setIsLocallyUnlocked(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleCreditUpdate = () => {
            if (user) fetchUserCredits(user.id).then(setCredits);
        };

        window.addEventListener('force_credits_update', handleCreditUpdate);
        return () => {
            window.removeEventListener('force_credits_update', handleCreditUpdate);
        };
    }, [user]);

    const handleUnlockClick = async () => {
        if (!user) {
            router.push('/login?redirect=/&reason=unlock_premium');
            return;
        }

        setIsUnlocking(true);
        try {
            const { default: Swal } = await import('sweetalert2');

            const latestCredits = credits ?? (await fetchUserCredits(user.id));
            setCredits(latestCredits);

            if (latestCredits === null) {
                await Swal.fire({
                    title: 'ไม่สามารถดึงเครดิตได้',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff',
                    customClass: { popup: 'rounded-2xl' }
                });
                return;
            }

            if (latestCredits < creditCost) {
                const result = await Swal.fire({
                    title: 'เครดิตไม่เพียงพอ',
                    text: `การปลดล็อกต้องใช้ ${creditCost} เครดิต (ท่านมี ${latestCredits})`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'เติมเครดิต',
                    cancelButtonText: 'ยกเลิก',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#64748b',
                    customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
                });
                if (result.isConfirmed) router.push('/topup');
                return;
            }

            const confirm = await Swal.fire({
                title: `ปลดล็อก ${creditCost} เครดิต`,
                text: `เพื่อดู${featureName}ฉบับเต็ม`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#059669',
                cancelButtonColor: '#ef4444',
                customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
            });

            if (!confirm.isConfirmed) return;

            const { error } = await supabase.rpc('deduct_credits', { amount: creditCost });
            if (error) {
                console.error('deduct_credits error:', error);

                const message = error.message || 'เกิดข้อผิดพลาดในการตัดเครดิต';
                const looksLikeInsufficient = /insufficient|not\s*enough|เครดิตไม่พอ|ไม่เพียงพอ/i.test(message);

                const result = await Swal.fire({
                    title: looksLikeInsufficient ? 'เครดิตไม่เพียงพอ' : 'Error',
                    text: looksLikeInsufficient ? 'เครดิตไม่พอสำหรับการปลดล็อก กดเพื่อเติมเครดิต' : message,
                    icon: looksLikeInsufficient ? 'warning' : 'error',
                    showCancelButton: looksLikeInsufficient,
                    confirmButtonText: looksLikeInsufficient ? 'เติมเครดิต' : 'ตกลง',
                    cancelButtonText: looksLikeInsufficient ? 'ยกเลิก' : undefined,
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#64748b',
                    customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' }
                });
                if (looksLikeInsufficient && result.isConfirmed) router.push('/topup');
                return;
            }

            setCredits(latestCredits - creditCost);
            window.dispatchEvent(new Event('force_credits_update'));

            setIsLocallyUnlocked(true);
            await onUnlock?.();

            await Swal.fire({
                title: 'ปลดล็อกสำเร็จ!',
                text: `ตัด ${creditCost} เครดิตเรียบร้อยแล้ว`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff',
                customClass: { popup: 'rounded-2xl' }
            });
        } finally {
            setIsUnlocking(false);
        }
    };

    const effectiveLocked = isLocked && !isLocallyUnlocked;

    if (!effectiveLocked) {
        return <>{children}</>;
    }

    const benefits = [
        { icon: Eye, text: 'พลังเงาและอายตนะ 6' },
        { icon: Zap, text: 'คำทำนายเจาะลึกชีวิต' },
        { icon: Gift, text: 'วอลเปเปอร์เสริมดวงฟรี' },
    ];

    return (
        <div className="relative group">
            {/* Blurred Content Container */}
            <div className="relative overflow-hidden rounded-2xl">
                {/* Actual Content (Blurred) */}
                <div 
                    className="select-none pointer-events-none"
                    style={{ 
                        filter: 'blur(8px)',
                        WebkitFilter: 'blur(8px)',
                    }}
                    aria-hidden="true"
                >
                    {children}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white/95 pointer-events-none" />

                {/* Lock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 bg-amber-500/20 rounded-full blur-[80px] animate-pulse" />
                    </div>

                    {/* Lock Icon with Animation */}
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl animate-pulse" />
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center animate-bounce">
                            <Crown className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    {/* Feature Name */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#1a1a3e] mb-2 text-center">
                        🔮 {featureName}
                    </h3>

                    {/* Benefits List */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-sm">
                        {benefits.map((benefit, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-[#ddddf0] rounded-full text-xs text-[#5a5a82] shadow-sm"
                            >
                                <benefit.icon className="w-3 h-3 text-amber-500" />
                                <span>{benefit.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Unlock Button */}
                    <button
                        onClick={handleUnlockClick}
                        disabled={isUnlocking}
                        className="group/btn relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        
                        <span className="relative flex items-center gap-2">
                            {isUnlocking ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>กำลังปลดล็อก...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>ปลดล็อกคำทำนายฉบับเต็ม</span>
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                                        {creditCost} เครดิต
                                    </span>
                                </>
                            )}
                        </span>
                    </button>

                    {/* Login Prompt (if not logged in) */}
                    {!isLoading && !user && (
                        <p className="text-[#5a5a82] text-xs sm:text-sm mt-3 text-center">
                            <Link href="/login" className="text-amber-600 hover:text-amber-500 font-medium underline underline-offset-2">
                                เข้าสู่ระบบ
                            </Link>
                            {' '}เพื่อปลดล็อกและรับโบนัสฟรี 50 Coins!
                        </p>
                    )}

                    {/* Credit Balance (if logged in) */}
                    {user && (
                        <p className="text-[#5a5a82] text-xs sm:text-sm mt-3 text-center flex flex-wrap items-center justify-center gap-2">
                            {typeof credits === 'number' && (
                                <span className="text-[#1a1a3e]">เครดิตคงเหลือ: <span className="text-amber-600 font-bold">{credits}</span></span>
                            )}
                            <Link href="/topup" className="text-amber-600 hover:text-amber-500 font-medium flex items-center gap-1">
                                เติมเครดิต <ChevronRight className="w-3 h-3" />
                            </Link>
                        </p>
                    )}

                    {/* FOMO Text */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-[#5a5a82]">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-[10px] text-white border-2 border-white">A</div>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] text-white border-2 border-white">ก</div>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-[10px] text-white border-2 border-white">ค</div>
                        </div>
                        <span>มีผู้ปลดล็อกแล้ว <span className="text-amber-600 font-bold">2,847</span> คนในสัปดาห์นี้</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumBlurOverlay;
