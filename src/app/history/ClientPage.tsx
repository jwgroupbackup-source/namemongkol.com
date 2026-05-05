'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { supabase } from '@/utils/supabase';
import { History, ChevronDown, ChevronUp, Target, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FOCUS_TOPIC_LABELS, FocusTopic } from '@/utils/premiumAnalysisUtils';

type MemberTier = 'free' | 'pro' | 'vvip';

const normalizeTier = (tier?: string | null): MemberTier => {
    const normalized = (tier || '').toLowerCase();
    if (normalized === 'pro' || normalized === 'vvip') return normalized;
    return 'free';
};

interface HistoryItem {
    id: string;
    created_at: string;
    type: 'premium_analysis' | 'gacha' | 'name_search';
    input_data: {
        surname?: string;
        birthDate?: string;
        birthTime?: string;
        focus?: FocusTopic;
        astDay?: string;
        raw_text?: string;
        count?: number;
        selectedDay?: string;
        selectedGender?: string;
        selectedLetter?: string;
        selectedScore?: string;
        unlockedCount?: number;
    };
    result_data: any[]; // Flexible for diverse result types
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [memberTier, setMemberTier] = useState<MemberTier>('free');

    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setIsLoading(false);
                return;
            }

            await supabase.rpc('cleanup_analysis_history_by_tier');

            const { data: profile } = await supabase
                .from('user_profiles')
                .select('tier')
                .eq('id', user.id)
                .maybeSingle();

            const tier = normalizeTier(profile?.tier);
            setMemberTier(tier);

            if (tier === 'free') {
                setHistory([]);
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('analysis_history')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Failed to fetch analysis history:', error);
            }

            if (data) {
                setHistory(data as HistoryItem[]);
            }
            setIsLoading(false);
        };

        fetchHistory();
    }, []);

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedIds(newSet);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">
            <main className="w-full max-w-[1400px] min-h-screen transition-all duration-300 relative overflow-hidden px-4 pt-6 md:pt-32 pb-28">
                {/* Background Decor */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-slate-500/5 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-5xl space-y-8 pt-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg">
                            <History size={32} className="text-slate-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-100">ประวัติการใช้งาน</h1>
                            <p className="text-slate-400">
                                {memberTier === 'vvip'
                                    ? 'รายการวิเคราะห์ชื่อมงคลย้อนหลัง (เก็บข้อมูลสูงสุด 90 วัน)'
                                    : memberTier === 'pro'
                                        ? 'รายการวิเคราะห์ชื่อมงคลย้อนหลัง (เก็บข้อมูลสูงสุด 30 วัน)'
                                        : 'ฟีเจอร์ประวัติการใช้งานสำหรับสมาชิก Pro และ VVIP'}
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20">
                            <span className="animate-spin text-4xl block mb-4">⏳</span>
                            <p className="text-slate-500">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : memberTier === 'free' ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5 border-dashed">
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-30 text-amber-400" />
                            <p className="text-xl font-medium text-slate-300">ประวัติการใช้งานสำหรับสมาชิก Pro และ VVIP</p>
                            <p className="text-sm mt-2 text-slate-500">อัปเกรดสมาชิกเพื่อเริ่มเก็บประวัติการวิเคราะห์ย้อนหลัง</p>
                            <Link
                                href="/topup?plan=vvip"
                                className="inline-flex mt-5 px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors font-semibold"
                            >
                                อัปเกรดสมาชิก
                            </Link>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5 border-dashed">
                            <History size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-xl font-medium text-slate-400">ยังไม่มีประวัติการใช้งาน</p>
                            <p className="text-sm mt-2 text-slate-500">ประวัติการวิเคราะห์ของคุณจะแสดงที่นี่</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <div key={item.id} className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
                                    {/* History Header Item */}
                                    <div
                                        onClick={() => toggleExpand(item.id)}
                                        className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-12 rounded-full ${item.type === 'premium_analysis' ? 'bg-amber-500' :
                                                item.type === 'name_search' ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-200">
                                                    {item.type === 'premium_analysis' ? 'วิเคราะห์ชื่อมงคลขั้นสูง' :
                                                        item.type === 'name_search' ? `ค้นหาชื่อมงคล (${item.input_data.unlockedCount || item.result_data?.length || 0} ชื่อ)` :
                                                            'สุ่มชื่อมงคล (Gacha)'}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} /> {formatDate(item.created_at)}
                                                    </span>
                                                    {item.input_data.focus && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-500/80">
                                                            <Target size={12} />
                                                            {FOCUS_TOPIC_LABELS[item.input_data.focus] || item.input_data.focus}
                                                        </span>
                                                    )}
                                                    {/* Surname or Raw Text hint */}
                                                    {item.input_data.surname && (
                                                        <span className="text-slate-500">
                                                            (นามสกุล: {item.input_data.surname})
                                                        </span>
                                                    )}
                                                    {item.type === 'name_search' && (
                                                        <>
                                                            {item.input_data.selectedDay && item.input_data.selectedDay !== 'all' && (
                                                                <span className="text-slate-500">วันเกิด: {item.input_data.selectedDay}</span>
                                                            )}
                                                            {item.input_data.selectedLetter && item.input_data.selectedLetter !== 'all' && (
                                                                <span className="text-slate-500">อักษร: {item.input_data.selectedLetter}</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span className="text-sm font-medium">
                                                {item.result_data?.length || 0} รายชื่อ
                                            </span>
                                            {expandedIds.has(item.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedIds.has(item.id) && (
                                        <div className="border-t border-white/5 bg-slate-950/30 p-6 animate-fade-in-up">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {item.type === 'name_search' ? (
                                                    item.result_data.map((result: any, idx) => (
                                                        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between gap-4">
                                                            <div>
                                                                <h4 className="text-lg font-bold text-indigo-100">{result.name}</h4>
                                                                <p className="text-xs text-slate-500 mt-1">
                                                                    วันมงคล: {Array.isArray(result.suitableDays) && result.suitableDays.length > 0 ? result.suitableDays.join(', ') : '-'}
                                                                </p>
                                                            </div>
                                                            <div className="text-2xl font-black text-slate-700 opacity-30">
                                                                {result.totalScore}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    item.result_data.map((result: any, idx) => (
                                                        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-lg font-bold text-amber-100">{result.name}</h4>
                                                                    {result.grade === 'A+' && <span className="text-amber-500 text-xs px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">A+</span>}
                                                                </div>
                                                                <p className="text-sm text-slate-400 line-clamp-1 mb-2">{result.meaning}</p>
                                                                <div className="text-xs text-slate-500 flex flex-col gap-1">
                                                                    {result.notes?.map((n: string, i: number) => (
                                                                        <span key={i} className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> {n}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="text-2xl font-black text-slate-700 opacity-30">
                                                                {result.totalScore}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
