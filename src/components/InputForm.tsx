'use client';

import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
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
        <div className="w-full max-w-lg animate-fade-in-up">
            <div className="relative rounded-[1.25rem] sm:rounded-[1.75rem] p-3.5 sm:p-8 overflow-hidden border border-amber-500/30 bg-gradient-to-b from-[#131e32]/95 to-[#0a0f18]/95 shadow-[0_8px_40px_rgba(215,177,106,0.15)] backdrop-blur-xl">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(215,177,106,0.15),transparent_60%)] pointer-events-none" />
                <div className="relative z-10 space-y-3.5 sm:space-y-6">
                    <div>
                        <label htmlFor="birth-day" className="cosmic-label mb-1.5 sm:mb-2 ml-1 block text-xs sm:text-sm font-medium tracking-wide">วันเกิด</label>
                        <div className="relative">
                            <select
                                id="birth-day"
                                value={day}
                                onChange={(e) => onDayChange(e.target.value)}
                                className="cosmic-input cosmic-text-crisp w-full cursor-pointer rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-sm sm:text-lg outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 focus:bg-[#1a2333]/90 bg-[#0f1725]/80"
                            >
                                {Object.entries(thaksaConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label htmlFor="input-name" className="cosmic-label mb-1.5 sm:mb-2 ml-1 block text-xs sm:text-sm font-medium tracking-wide">ชื่อจริง</label>
                            <input
                                id="input-name"
                                type="text"
                                value={name}
                                onChange={(e) => onNameChange(e.target.value)}
                                placeholder="เช่น สมชาย / James"
                                className="cosmic-input cosmic-text-crisp cosmic-muted-placeholder w-full rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-lg outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 focus:bg-[#1a2333]/90 bg-[#0f1725]/80"
                            />
                        </div>
                        <div>
                            <label htmlFor="input-surname" className="cosmic-label mb-1.5 sm:mb-2 ml-1 block text-xs sm:text-sm font-medium tracking-wide">นามสกุล</label>
                            <input
                                id="input-surname"
                                type="text"
                                value={surname}
                                onChange={(e) => onSurnameChange(e.target.value)}
                                placeholder="เช่น ใจดี / Smith"
                                className="cosmic-input cosmic-text-crisp cosmic-muted-placeholder w-full rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-lg outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 focus:bg-[#1a2333]/90 bg-[#0f1725]/80"
                            />
                        </div>
                    </div>

                    {/* Language Support Chips */}
                    <div className="hidden sm:flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500">รองรับ:</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/20 bg-amber-500/10 text-amber-300/80">
                            🇹🇭 ภาษาไทย
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/10 text-blue-300/80">
                            🇬🇧 English
                        </span>
                    </div>

                    <button
                        onClick={onAnalyze}
                        disabled={!name || loading}
                        data-track="home.hero.analyze"
                        className={`w-full group relative overflow-hidden rounded-xl py-3.5 sm:py-4 font-semibold text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-900/30 ${!name ? 'cosmic-button-disabled cursor-not-allowed' : 'cosmic-primary-button ring-1 ring-amber-400/50'
                            }`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" /> กำลังวิเคราะห์...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" /> วิเคราะห์ชื่อฟรี
                                </>
                            )}
                        </span>
                    </button>
                    <p className="text-center text-[11px] leading-relaxed text-slate-400 sm:text-xs">
                        เห็นผลพื้นฐานได้ทันที สมัครฟรีเมื่อต้องการบันทึกผลและปลดล็อกคำทำนายเชิงลึก
                    </p>
                </div>
            </div>
        </div>
    );
};
