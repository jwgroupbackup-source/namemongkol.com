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
                className="flex items-center justify-between gap-3 w-full px-5 py-3 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl hover:border-amber-500/40 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-amber-500/20 rounded-lg">
                        <Gift className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-amber-200">สมัครฟรี รับ 30 เครดิต</span>
                        <span className="block text-[10px] text-slate-400">ปลดล็อกคำทำนายเชิงลึก + บันทึกผลย้อนหลัง</span>
                    </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
};
