'use client';

import React from 'react';
import {
    CalendarDays,
    ChevronDown,
    LockKeyhole,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    UserRound,
    Zap,
} from 'lucide-react';
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
    {
        title: 'ใช้ฟรีทันที',
        detail: 'ไม่ต้องสมัคร',
        icon: ShieldCheck,
    },
    {
        title: 'ไม่ต้องล็อกอิน',
        detail: 'ปลอดภัย 100%',
        icon: LockKeyhole,
    },
    {
        title: 'รู้ผลเร็ว',
        detail: 'ภายในไม่กี่วินาที',
        icon: Zap,
    },
];

const ThaiFlagMark = () => (
    <span
        aria-hidden="true"
        className="relative h-3.5 w-5 overflow-hidden rounded-[3px] border border-black/10 shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
    >
        <span className="absolute inset-x-0 top-0 h-[18%] bg-[#d01c1f]" />
        <span className="absolute inset-x-0 top-[18%] h-[16%] bg-white" />
        <span className="absolute inset-x-0 top-[34%] h-[32%] bg-[#241d76]" />
        <span className="absolute inset-x-0 top-[66%] h-[16%] bg-white" />
        <span className="absolute inset-x-0 bottom-0 h-[18%] bg-[#d01c1f]" />
    </span>
);

const EnglishFlagMark = () => (
    <span
        aria-hidden="true"
        className="relative h-3.5 w-5 overflow-hidden rounded-[3px] border border-black/10 bg-[#012169] shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
    >
        <span className="absolute left-[-18%] top-1/2 h-[2px] w-[140%] -translate-y-1/2 rotate-[32deg] bg-white" />
        <span className="absolute left-[-18%] top-1/2 h-[2px] w-[140%] -translate-y-1/2 -rotate-[32deg] bg-white" />
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-white" />
        <span className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-white" />
        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#c8102e]" />
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-[#c8102e]" />
    </span>
);

export const InputForm: React.FC<InputFormProps> = ({
    name,
    surname,
    day,
    onNameChange,
    onSurnameChange,
    onDayChange,
    onAnalyze,
    loading,
}) => {
    const isDisabled = !name || loading;

    return (
        <div className="w-full animate-fade-in-up">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-amber-400/70 bg-[#071a34] p-4 text-slate-100 shadow-[0_22px_70px_rgba(3,10,28,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] sm:rounded-[2rem] sm:p-6 lg:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(67,112,184,0.28),transparent_42%),linear-gradient(180deg,rgba(19,43,83,0.78),rgba(3,15,34,0.96))]" />
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.17),transparent_62%)] blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_64%)] blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-3 text-center sm:mb-5">
                        <p className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/70 bg-amber-400/10 px-4 py-2 text-[11px] font-semibold text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.18)]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Free name analysis
                        </p>
                        <h2 className="text-3xl font-extrabold leading-tight text-slate-50 drop-shadow-sm sm:text-4xl">
                            เริ่มวิเคราะห์ชื่อฟรี
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            กรอกข้อมูลพื้นฐาน แล้วดูผลจาก 4 ศาสตร์หลักได้ทันที
                        </p>
                    </div>

                    <div className="mb-5 grid grid-cols-3 gap-2.5">
                        {formTrustItems.map((item) => (
                            <div
                                key={item.title}
                                className="min-h-[5.15rem] rounded-xl border border-slate-500/45 bg-slate-900/28 px-2 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:min-h-[5.7rem] sm:px-2.5"
                            >
                                <item.icon className="mx-auto mb-2 h-5 w-5 text-amber-400" />
                                <p className="text-[11px] font-bold leading-snug text-slate-50 sm:text-xs">{item.title}</p>
                                <p className="mt-1 text-[10px] leading-snug text-slate-400">{item.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label htmlFor="birth-day" className="mb-2 block text-xs font-bold text-slate-100">
                                วันเกิด
                            </label>
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <select
                                    id="birth-day"
                                    value={day}
                                    onChange={(e) => onDayChange(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-slate-500/45 bg-[#102545] px-10 py-3 text-sm font-medium text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                                >
                                    {Object.entries(thaksaConfig).map(([key, config]) => (
                                        <option key={key} value={key}>
                                            {config.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4">
                            <div>
                                <label htmlFor="input-name" className="mb-2 block text-xs font-bold text-slate-100">
                                    ชื่อจริง
                                </label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="input-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => onNameChange(e.target.value)}
                                        placeholder="เช่น สมชาย / James"
                                        className="w-full rounded-xl border border-slate-500/45 bg-[#102545] px-10 py-3 text-sm font-medium text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="input-surname" className="mb-2 block text-xs font-bold text-slate-100">
                                    นามสกุล
                                </label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="input-surname"
                                        type="text"
                                        value={surname}
                                        onChange={(e) => onSurnameChange(e.target.value)}
                                        placeholder="เช่น ใจดี / Smith"
                                        className="w-full rounded-xl border border-slate-500/45 bg-[#102545] px-10 py-3 text-sm font-medium text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-bold text-slate-100">รองรับภาษา</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400/16 px-3 py-2.5 text-sm font-bold text-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition-all focus-visible:ring-2 focus-visible:ring-amber-400/35"
                                    aria-pressed="true"
                                >
                                    <ThaiFlagMark />
                                    <span>ภาษาไทย</span>
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-500/45 bg-[#102545] px-3 py-2.5 text-sm font-semibold text-slate-300 outline-none transition-all hover:border-amber-400/50 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-amber-400/25"
                                    aria-pressed="false"
                                >
                                    <EnglishFlagMark />
                                    <span>English</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onAnalyze}
                            disabled={isDisabled}
                            data-track="home.hero.analyze"
                            className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-base font-bold outline-none transition-all active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-amber-300/45 sm:py-4 sm:text-lg ${
                                isDisabled
                                    ? 'cursor-not-allowed border border-amber-300/50 bg-gradient-to-b from-amber-300/85 to-amber-500/85 text-[#3d2602] opacity-80 shadow-[0_0_20px_rgba(245,158,11,0.24),inset_0_1px_0_rgba(255,255,255,0.35)]'
                                    : 'border border-amber-200/70 bg-gradient-to-b from-amber-300 to-amber-500 text-[#3d2602] shadow-[0_0_24px_rgba(245,158,11,0.38),inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-0.5 hover:from-amber-200 hover:to-amber-400'
                            }`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <RefreshCw className="h-5 w-5 animate-spin" /> กำลังวิเคราะห์...
                                    </>
                                ) : (
                                    'เริ่มวิเคราะห์ชื่อฟรี'
                                )}
                            </span>
                            <span className="relative z-10 mt-0.5 block text-[11px] font-medium opacity-85">
                                วิเคราะห์ด้วย 4 ศาสตร์หลัก
                            </span>
                        </button>

                        <div className="flex items-start justify-center gap-2 px-1 text-center text-[10px] leading-relaxed text-slate-400 sm:px-2 sm:text-xs">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                            <p>
                                ใช้งานฟรีได้ทันที ไม่มีค่าใช้จ่าย ข้อมูลของคุณจะถูกเก็บเป็นความลับและปลอดภัย 100%
                                ไม่เปิดเผยต่อบุคคลที่สาม
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
