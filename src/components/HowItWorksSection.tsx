'use client';

import React from 'react';
import { ClipboardList, Cpu, Eye } from 'lucide-react';

const steps = [
    {
        num: '①',
        icon: ClipboardList,
        title: 'กรอกชื่อ + วันเกิด',
        desc: 'ใส่ชื่อจริง นามสกุล และเลือกวันเกิดของคุณ',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
    },
    {
        num: '②',
        icon: Cpu,
        title: 'ระบบวิเคราะห์ 3 ศาสตร์',
        desc: 'เลขศาสตร์ + ทักษาปกรณ์ + อายตนะ 6 คำนวณพร้อมกัน',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
    },
    {
        num: '③',
        icon: Eye,
        title: 'ดูผลฟรีทันที',
        desc: 'เห็นคะแนน คู่เลข ทักษา ฟรี — ปลดล็อกเชิงลึกได้ถ้าต้องการ',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
    },
];

export const HowItWorksSection = () => {
    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16 relative z-10">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                    วิเคราะห์ชื่อใน <span className="text-amber-400">3 ขั้นตอน</span>
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                    ง่าย รวดเร็ว และใช้งานได้ฟรีเพียงสมัครสมาชิก
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className={`relative bg-slate-900/50 border ${step.border} rounded-2xl p-6 text-center hover:-translate-y-1 transition-all group`}
                    >
                        {/* Step number */}
                        <div className={`text-4xl font-bold ${step.color} opacity-20 absolute top-3 right-4`}>
                            {step.num}
                        </div>

                        <div className={`w-14 h-14 ${step.bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                            <step.icon className={`w-7 h-7 ${step.color}`} />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>

                        {/* Connector arrow (hidden on last + mobile) */}
                        {i < steps.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-600 text-xl">
                                →
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
