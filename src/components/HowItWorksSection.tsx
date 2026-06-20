'use client';

import React from 'react';
import { ClipboardList, Cpu, Eye } from 'lucide-react';

const steps = [
    {
        num: '①',
        icon: ClipboardList,
        title: 'ระบุชื่อและวันเกิด',
        desc: 'กรอกชื่อ นามสกุล และวันเกิด เพื่อส่งให้ระบบคำนวณพื้นดวงชะตา',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        cardBg: 'bg-gradient-to-br from-amber-50/80 to-[#fff8ee]',
        cardBorder: 'border-amber-300/40',
    },
    {
        num: '②',
        icon: Cpu,
        title: 'ระบบคำนวณ 4 ศาสตร์',
        desc: 'วิเคราะห์ร่วมกันระหว่าง เลขศาสตร์ ทักษา อายตนะ 6 และนิรันดร์ศาสตร์',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        cardBg: 'bg-gradient-to-br from-emerald-50/80 to-[#f0fdf4]',
        cardBorder: 'border-emerald-300/40',
    },
    {
        num: '③',
        icon: Eye,
        title: 'ทราบผลทำนายทันที',
        desc: 'ภาพรวมคะแนน คู่เลข และเกรดฟรี พร้อมตัวเลือกต่อยอดทำนายเชิงลึก',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        cardBg: 'bg-gradient-to-br from-purple-50/80 to-[#faf5ff]',
        cardBorder: 'border-purple-300/40',
    },
];

export const HowItWorksSection = () => {
    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-16 relative z-10">
            <div className="text-center mb-6 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a3e] mb-3">
                    วิธีเช็คชื่อมงคลกับ NameMongkol
                </h2>
                <p className="text-[#5a5a82] max-w-xl mx-auto text-sm sm:text-base">
                    วิเคราะห์ชื่อจริงได้ง่ายๆ ภายใน 3 ขั้นตอน พร้อมรับผลทำนายเชิงลึก
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className={`relative ${step.cardBg} shadow-sm border ${step.cardBorder} rounded-2xl p-4 sm:p-6 text-center hover:-translate-y-1 hover:shadow-md transition-all group`}
                    >
                        {/* Step number */}
                        <div className={`text-4xl font-bold ${step.color.replace('400', '200')} absolute top-3 right-4`}>
                            {step.num}
                        </div>

                        <div className={`w-14 h-14 ${step.bg.replace('500/10', '50')} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                            <step.icon className={`w-7 h-7 ${step.color.replace('400', '600')}`} />
                        </div>

                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-1.5 sm:mb-2">{step.title}</h3>
                        <p className="text-[#5a5a82] text-sm leading-relaxed">{step.desc}</p>

                        {/* Connector arrow (hidden on last + mobile) */}
                        {i < steps.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-[#ddddf0] text-xl">
                                →
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
