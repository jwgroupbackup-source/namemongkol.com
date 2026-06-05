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
            <div className="relative overflow-hidden rounded-[1.35rem] border border-[#f0c976]/70 bg-[linear-gradient(145deg,#fffaf1_0%,#fff6e8_52%,#fff0d6_100%)] p-3 text-[#18223a] shadow-[0_0_0_1px_rgba(255,244,218,0.84),0_24px_70px_rgba(218,146,22,0.24),0_0_42px_rgba(250,194,87,0.28)] sm:rounded-[1.9rem] sm:p-6 lg:p-7">
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#f7d894] to-transparent" />
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(242,181,55,0.22),transparent_62%)] blur-2xl" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(245,203,122,0.18),transparent_64%)] blur-2xl" />

                <div className="pointer-events-none absolute left-4 top-4 hidden h-8 w-8 border-l border-t border-[#eac679]/70 sm:block" />
                <div className="pointer-events-none absolute right-4 top-4 hidden h-8 w-8 border-r border-t border-[#eac679]/70 sm:block" />
                <div className="pointer-events-none absolute bottom-4 left-4 hidden h-8 w-8 border-b border-l border-[#eac679]/60 sm:block" />
                <div className="pointer-events-none absolute bottom-4 right-4 hidden h-8 w-8 border-b border-r border-[#eac679]/60 sm:block" />

                <div className="relative z-10">
                    <div className="mb-3 text-center sm:mb-5">
                        <p className="mx-auto mb-3 hidden items-center gap-2 rounded-full border border-[#f0c976]/70 bg-[#fff4d8]/80 px-4 py-2 text-[11px] font-semibold text-[#b87507] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:inline-flex">
                            <Sparkles className="h-3.5 w-3.5" />
                            Free name analysis
                        </p>
                        <h2 className="text-2xl font-bold leading-tight text-[#17243d] sm:text-4xl">
                            เริ่มวิเคราะห์ชื่อฟรี
                        </h2>
                        <p className="mt-2 hidden text-sm leading-6 text-[#5d6676] sm:block">
                            กรอกข้อมูลพื้นฐาน แล้วดูผลจาก 4 ศาสตร์หลักได้ทันที
                        </p>
                    </div>

                    <div className="mb-5 hidden grid-cols-3 gap-2.5 sm:grid">
                        {formTrustItems.map((item) => (
                            <div
                                key={item.title}
                                className="min-h-[5.7rem] rounded-xl border border-[#efd49c] bg-[#fff8ed]/80 px-2.5 py-3 text-center shadow-[0_10px_24px_rgba(124,80,20,0.06)]"
                            >
                                <item.icon className="mx-auto mb-2 h-5 w-5 text-[#f0a313]" />
                                <p className="text-xs font-bold leading-snug text-[#1b2a44]">{item.title}</p>
                                <p className="mt-1 text-[10px] leading-snug text-[#7a6b58]">{item.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div className="hidden sm:block">
                            <label htmlFor="birth-day" className="mb-2 block text-xs font-bold text-[#1f2b43]">
                                วันเกิด
                            </label>
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8b75]" />
                                <select
                                    id="birth-day"
                                    value={day}
                                    onChange={(e) => onDayChange(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-[#e3d3bb] bg-[#fffdf9] px-10 py-3 text-sm font-medium text-[#24314a] outline-none transition-all placeholder:text-[#a89b89] focus:border-[#f0a313] focus:ring-2 focus:ring-[#f0a313]/20"
                                >
                                    {Object.entries(thaksaConfig).map(([key, config]) => (
                                        <option key={key} value={key}>
                                            {config.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8b75]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4">
                            <div>
                                <label htmlFor="input-name" className="mb-2 block text-xs font-bold text-[#1f2b43]">
                                    ชื่อจริง
                                </label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8b75]" />
                                    <input
                                        id="input-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => onNameChange(e.target.value)}
                                        placeholder="เช่น สมชาย / James"
                                        className="w-full rounded-xl border border-[#e3d3bb] bg-[#fffdf9] px-10 py-3 text-sm font-medium text-[#24314a] outline-none transition-all placeholder:text-[#a89b89] focus:border-[#f0a313] focus:ring-2 focus:ring-[#f0a313]/20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="input-surname" className="mb-2 block text-xs font-bold text-[#1f2b43]">
                                    นามสกุล
                                </label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8b75]" />
                                    <input
                                        id="input-surname"
                                        type="text"
                                        value={surname}
                                        onChange={(e) => onSurnameChange(e.target.value)}
                                        placeholder="เช่น ใจดี / Smith"
                                        className="w-full rounded-xl border border-[#e3d3bb] bg-[#fffdf9] px-10 py-3 text-sm font-medium text-[#24314a] outline-none transition-all placeholder:text-[#a89b89] focus:border-[#f0a313] focus:ring-2 focus:ring-[#f0a313]/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:block">
                            <p className="mb-2 text-xs font-bold text-[#1f2b43]">รองรับภาษา</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#f0a313] bg-[#fff4d8] px-3 py-2.5 text-sm font-bold text-[#7c4b00] shadow-[0_8px_18px_rgba(218,146,22,0.10)] outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#f0a313]/35"
                                    aria-pressed="true"
                                >
                                    <ThaiFlagMark />
                                    <span>ภาษาไทย</span>
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e3d3bb] bg-[#fffdf9] px-3 py-2.5 text-sm font-semibold text-[#6c7480] outline-none transition-all hover:border-[#e6bd75] hover:text-[#3f4a5d] focus-visible:ring-2 focus-visible:ring-[#f0a313]/25"
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
                            className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-base font-bold outline-none transition-all active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#f0a313]/35 sm:py-4 sm:text-lg ${
                                isDisabled
                                    ? 'cursor-not-allowed border border-[#d5c7b0] bg-[#ded6c8] text-[#9a8f7f]'
                                    : 'bg-[linear-gradient(135deg,#f8c24b_0%,#efa10d_52%,#d98400_100%)] text-[#fffaf1] shadow-[0_16px_32px_rgba(207,126,0,0.26),inset_0_1px_0_rgba(255,255,255,0.32)] hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(207,126,0,0.34),inset_0_1px_0_rgba(255,255,255,0.38)]'
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

                        <div className="flex items-start justify-center gap-2 px-1 text-center text-[10px] leading-relaxed text-[#7b7368] sm:px-2 sm:text-xs">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#798070]" />
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
