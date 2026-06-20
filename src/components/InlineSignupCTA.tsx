'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gift, ArrowRight } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export const InlineSignupCTA = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Default hidden
    const [ready, setReady] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user);
            setReady(true);
        });
    }, []);

    if (!ready || isLoggedIn) return null;

    return (
        <div className="w-full max-w-lg mt-5 animate-fade-in">
            <Link
                href="/login"
                data-track="home.inline_cta.signup"
                className="flex items-center justify-between gap-3 w-full px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl hover:border-amber-300 transition-all group shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-amber-100 rounded-lg border border-amber-200">
                        <Gift className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-amber-700">สมัครฟรีไว้บันทึกผล และรับ 30 เครดิต</span>
                        <span className="block text-[10px] text-[#5a5a82]">วิเคราะห์ฟรีได้เลยตอนนี้, ส่วนสมาชิกใช้เก็บประวัติและปลดล็อกฟีเจอร์เพิ่ม</span>
                    </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
};
