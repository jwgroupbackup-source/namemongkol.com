'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Save } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export const SaveResultCTA = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user);
        });
    }, []);

    if (isLoggedIn) return null;

    return (
        <div className="mt-5 animate-fade-in">
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-[#f8f8fc] p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-start gap-3">
                        <div className="shrink-0 rounded-xl bg-amber-100 p-2.5 ring-1 ring-amber-200">
                            <Save className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-[#1a1a3e] sm:text-base">วิเคราะห์ฟรีเสร็จแล้ว, บันทึกผลนี้ไว้ต่อได้เลย</h4>
                            <p className="mt-1 text-xs leading-relaxed text-[#5a5a82] sm:text-sm">
                                สมัครฟรีเพื่อเก็บประวัติผลวิเคราะห์ เปรียบเทียบหลายชื่อเดิมกับชื่อใหม่ และรับ 30 เครดิตสำหรับปลดล็อกคำทำนายเชิงลึก
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/login?redirect=/"
                        data-track="result.save_cta_click"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-600 active:scale-[0.98] sm:whitespace-nowrap"
                    >
                        <Gift className="h-4 w-4" />
                        สมัครรับ 30 เครดิตฟรี
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
