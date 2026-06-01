'use client';

import React from 'react';
import { CalendarDays, CheckCircle2, RefreshCw, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { thaksaConfig } from '@/data/thaksaConfig';

interface InputFormProps {
    name: string;
    surname: string;
    day: string;
    onNameChange: (val: string) => void;
    onSurnameChange: (val: string) => void;
    onDayChange: (val: string) => void;
    onAnalyze: () => void;
    loading: boolean;
}

const formTrustItems = [
    { label: 'ใช้ฟรีทันที', icon: CheckCircle2, className: 'text-emerald-200' },
    { label: 'ไม่ต้องล็อกอิน', icon: ShieldCheck, className: 'text-sky-200' },
    { label: 'รู้ผลเร็ว', icon: Zap, className: 'text-amber-200' },
];

export const InputForm: React.FC<InputFormProps> = ({
    name,
    surname,
    day,
    onNameChange,
    onSurnameChange,
    onDayChange,
    onAnalyze,
    loading
}) => {
    return (
        <div className="w-full animate-fade-in-up">
            <div className="relative overflow-hidden rounded-[1.35rem] border border-amber-200/25 bg-[linear-gradient(145deg,rgba(16,22,38,0.96),rgba(8,12,22,0.95))] p-4 shadow-[0_28px_90px_rgba(1,4,15,0.52),0_0_36px_rgba(215,177,106,0.10)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-6 lg:p-7">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/60 to-transparent" />
                <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(215,177,106,0.16),transparent_64%)] blur-2xl" />

                <div className="relative z-10">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-100">
                                <Sparkles className="h-3.5 w-3.5" />
                                Free name analysis
                            </p>
                            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                                เริ่มวิเคราะห์ชื่อฟรี
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                กรอกข้อมูลพื้นฐาน แล้วดูผลจาก 4 ศาสตร์หลักได้ทันที
                            </p>
                        </div>
                        <div className="hidden rounded-2xl border border-amber-200/15 bg-black/20 p-3 text-amber-200 sm:block">
                            <CalendarDays className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="mb-5 grid grid-cols-3 gap-2">
                        {formTrustItems.map((item) => (
                            <div key={item.label} className="flex min-h-14 flex-col justify-center rounded-xl border border-white/8 bg-white/[0.04] px-2.5 py-2 text-left">
                                <item.icon className={`mb-1 h-3.5 w-3.5 ${item.className}`} />
                                <span className="text-[11px] font-semibold leading-snug text-slate-100 sm:text-xs">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="birth-day" className="cosmic-label mb-2 ml-1 block text-xs font-medium tracking-wide sm:text-sm">วันเกิด</label>
                            <select
                                id="birth-day"
                                value={day}
                                onChange={(e) => onDayChange(e.target.value)}
                                className="cosmic-input cosmic-text-crisp w-full cursor-pointer rounded-xl bg-[#0f1725]/80 px-3 py-3 text-sm outline-none transition-all focus:border-amber-300 focus:bg-[#1a2333]/90 focus:ring-2 focus:ring-amber-500/20 sm:px-4 sm:py-3.5 sm:text-base"
                            >
                                {Object.entries(thaksaConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                            <div>
                                <label htmlFor="input-name" className="cosmic-label mb-2 ml-1 block text-xs font-medium tracking-wide sm:text-sm">ชื่อจริง</label>
                                <input
                                    id="input-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => onNameChange(e.target.value)}
                                    placeholder="เช่น สมชาย / James"
                                    className="cosmic-input cosmic-text-crisp cosmic-muted-placeholder w-full rounded-xl bg-[#0f1725]/80 px-3 py-3 text-sm outline-none transition-all focus:border-amber-300 focus:bg-[#1a2333]/90 focus:ring-2 focus:ring-amber-500/20 sm:px-4 sm:py-3.5 sm:text-base"
                                />
                            </div>
                            <div>
                                <label htmlFor="input-surname" className="cosmic-label mb-2 ml-1 block text-xs font-medium tracking-wide sm:text-sm">นามสกุล</label>
                                <input
                                    id="input-surname"
                                    type="text"
                                    value={surname}
                                    onChange={(e) => onSurnameChange(e.target.value)}
                                    placeholder="เช่น ใจดี / Smith"
                                    className="cosmic-input cosmic-text-crisp cosmic-muted-placeholder w-full rounded-xl bg-[#0f1725]/80 px-3 py-3 text-sm outline-none transition-all focus:border-amber-300 focus:bg-[#1a2333]/90 focus:ring-2 focus:ring-amber-500/20 sm:px-4 sm:py-3.5 sm:text-base"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>รองรับ:</span>
                            <span className="rounded-full border border-amber-300/15 bg-amber-300/10 px-2.5 py-1 font-medium text-amber-100">ภาษาไทย</span>
                            <span className="rounded-full border border-blue-300/15 bg-blue-300/10 px-2.5 py-1 font-medium text-blue-100">English</span>
                        </div>

                        <button
                            onClick={onAnalyze}
                            disabled={!name || loading}
                            data-track="home.hero.analyze"
                            className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-base font-semibold shadow-lg shadow-amber-900/30 transition-all active:scale-[0.99] sm:py-4 sm:text-lg ${!name || loading ? 'cosmic-button-disabled cursor-not-allowed' : 'cosmic-primary-button ring-1 ring-amber-300/50 hover:-translate-y-0.5'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <RefreshCw className="h-5 w-5 animate-spin" /> กำลังวิเคราะห์...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" /> เริ่มวิเคราะห์ชื่อฟรี
                                    </>
                                )}
                            </span>
                        </button>

                        <p className="text-center text-[11px] leading-relaxed text-slate-400 sm:text-xs">
                            ใช้งานฟรีได้ทันที ส่วนการสมัครสมาชิกมีไว้สำหรับบันทึกผลย้อนหลัง เปรียบเทียบหลายชื่อ และปลดล็อกคำทำนายเชิงลึก
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
