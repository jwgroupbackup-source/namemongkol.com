'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { X, Sparkles, Gift, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface WelcomeCreditModalProps {
    user: User | null;
}

export const WelcomeCreditModal: React.FC<WelcomeCreditModalProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [welcomeCredits, setWelcomeCredits] = useState(30);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;
        let timer: number | null = null;
        let animationFrame: number | null = null;

        const checkWelcomeBonus = async () => {
            // 1. เช็ค localStorage ก่อน (fast path)
            const hasSeenWelcome = localStorage.getItem(`welcome_bonus_seen_${user.id}`);
            if (hasSeenWelcome) return;

            // 2. เช็คจาก DB ว่าเป็นสมาชิกใหม่ที่ได้รับ welcome credits หรือไม่
            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('welcome_credits, welcome_credits_granted, welcome_credits_granted_at')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error || !data) return;

                // ถ้ายังไม่ได้รับ welcome credits หรือเคยเห็นแล้ว (จาก DB)
                if (!data.welcome_credits_granted) return;

                // ถ้า welcome credits หมดอายุแล้ว ไม่ต้องแสดง
                if (data.welcome_credits_granted_at) {
                    const grantedAt = new Date(data.welcome_credits_granted_at);
                    const expiry = new Date(grantedAt.getTime() + 30 * 24 * 60 * 60 * 1000);

                    if (new Date() > expiry) {
                        // หมดอายุแล้ว ไม่ต้องแสดง
                        localStorage.setItem(`welcome_bonus_seen_${user.id}`, 'true');
                        return;
                    }

                    setExpiresAt(expiry.toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }));
                }

                setWelcomeCredits(data.welcome_credits ?? 30);

                // 3. เช็คว่าสร้างบัญชีภายใน 7 วัน (ขยายจาก 24 ชม. เพื่อให้ครอบคลุมมากขึ้น)
                const createdAt = new Date(user.created_at).getTime();
                const now = new Date().getTime();
                const sevenDays = 7 * 24 * 60 * 60 * 1000;
                const isNewUser = (now - createdAt) < sevenDays;

                if (!isNewUser) {
                    localStorage.setItem(`welcome_bonus_seen_${user.id}`, 'true');
                    return;
                }

                // แสดง Modal พร้อม confetti
                timer = window.setTimeout(() => {
                    if (cancelled) return;

                    setIsOpen(true);
                    const duration = 3 * 1000;
                    const end = Date.now() + duration;

                    void import('canvas-confetti').then(({ default: confetti }) => {
                        if (cancelled) return;

                        const frame = () => {
                            if (cancelled) return;

                            confetti({
                                particleCount: 3,
                                angle: 60,
                                spread: 55,
                                origin: { x: 0 },
                                colors: ['#fbbf24', '#f59e0b', '#d97706']
                            });
                            confetti({
                                particleCount: 3,
                                angle: 120,
                                spread: 55,
                                origin: { x: 1 },
                                colors: ['#fbbf24', '#f59e0b', '#d97706']
                            });

                            if (Date.now() < end) {
                                animationFrame = window.requestAnimationFrame(frame);
                            }
                        };

                        frame();
                    });
                }, 1500);
            } catch {
                // ถ้า query ล้มเหลว ไม่แสดง modal (fail silently)
                return;
            }
        };

        checkWelcomeBonus();

        return () => {
            cancelled = true;
            if (timer !== null) {
                window.clearTimeout(timer);
            }
            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, [user]);

    const handleClose = () => {
        setIsOpen(false);
        if (user) {
            localStorage.setItem(`welcome_bonus_seen_${user.id}`, 'true');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Card */}
            <div className="relative bg-[#1e293b] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-amber-500/20 transform scale-100 animate-scale-in overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-[50px] pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-amber-500 blur-xl opacity-40 animate-pulse"></div>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 rotate-3 border-2 border-amber-200/20">
                            <Gift size={40} className="text-white drop-shadow-md" />
                        </div>
                        <div className="absolute -right-2 -top-2 bg-white text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg rotate-12">
                            FREE!
                        </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        ยินดีต้อนรับสมาชิกใหม่!
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base mb-6 px-4">
                        ขอบคุณที่สมัครสมาชิกกับ NameMongkol <br />
                        คุณได้รับเครดิตฟรีแล้ว เพื่อเริ่มต้นความเป็นมงคล
                    </p>

                    {/* Credit Box — signup bonus */}
                    <div className="w-full bg-slate-900/50 border border-amber-500/30 rounded-xl p-4 mb-3 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Sparkles size={20} className="text-amber-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">โบนัสต้อนรับ</p>
                                <p className="text-white font-bold">Welcome Gift</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                                +{welcomeCredits}
                            </span>
                            <span className="text-amber-500/70 text-xs font-bold ml-1">Credits</span>
                        </div>
                    </div>

                    {/* Review Bonus Row */}
                    <div className="w-full bg-slate-900/30 border border-violet-500/20 rounded-xl p-4 mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                                <Star size={20} className="text-violet-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">เขียนรีวิว</p>
                                <p className="text-slate-300 text-sm font-medium">แชร์ประสบการณ์ของคุณ</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-violet-400">+30</span>
                            <span className="text-violet-500/70 text-xs font-bold ml-1">Credits</span>
                        </div>
                    </div>

                    {/* Expiry Info */}
                    {expiresAt && (
                        <div className="w-full bg-amber-500/5 border border-amber-500/10 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2">
                            <Clock size={14} className="text-amber-500/60 shrink-0" />
                            <p className="text-xs text-amber-400/80">
                                ใช้ได้ถึงวันที่ <span className="font-semibold text-amber-300">{expiresAt}</span>
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleClose}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mb-3"
                    >
                        เริ่มใช้งานเลย!
                        <Sparkles size={18} className="animate-pulse" />
                    </button>

                    <Link
                        href="/reviews"
                        onClick={handleClose}
                        className="w-full border border-violet-500/30 hover:border-violet-500/60 text-violet-400 hover:text-violet-300 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Star size={16} />
                        เขียนรีวิว รับเพิ่ม 30 เครดิต →
                    </Link>

                    <p className="mt-4 text-[10px] text-slate-500">
                        *เครดิตฟรีมีอายุการใช้งาน 30 วัน นับจากวันสมัครสมาชิก
                    </p>
                </div>
            </div>
        </div>
    );
};
