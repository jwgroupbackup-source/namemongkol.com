'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Zap, ArrowDownWideNarrow, FileSpreadsheet, ChevronRight, CheckCircle2 } from 'lucide-react';

// Animated counter hook
function useCountUp(target: number, duration = 1500, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

const FEATURES = [
    {
        icon: <Zap className="w-5 h-5 text-indigo-400" />,
        label: 'วิเคราะห์ได้สูงสุด',
        value: '1,000 ชื่อ',
        sub: 'ในคลิกเดียว',
        bg: 'from-indigo-500/10 to-violet-500/10',
        border: 'border-indigo-500/20',
    },
    {
        icon: <ArrowDownWideNarrow className="w-5 h-5 text-emerald-400" />,
        label: 'จัดเกรดอัตโนมัติ',
        value: 'A+ A B C',
        sub: 'พร้อมเรียงลำดับ',
        bg: 'from-emerald-500/10 to-teal-500/10',
        border: 'border-emerald-500/20',
    },
    {
        icon: <FileSpreadsheet className="w-5 h-5 text-amber-400" />,
        label: 'Export ผลลัพธ์',
        value: 'CSV & PDF',
        sub: 'ดาวน์โหลดทันที',
        bg: 'from-amber-500/10 to-orange-500/10',
        border: 'border-amber-500/20',
    },
];

const GRADE_DEMO = [
    { name: 'ณวิธ', sum: 19, grade: 'A+', color: 'bg-emerald-500 text-white border-emerald-400' },
    { name: 'กนิษฐา', sum: 45, grade: 'A+', color: 'bg-emerald-500 text-white border-emerald-400' },
    { name: 'ปิยะ', sum: 33, grade: 'B', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'สมหมาย', sum: 28, grade: 'C', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { name: 'วิภาดา', sum: 55, grade: 'A+', color: 'bg-emerald-500 text-white border-emerald-400' },
    { name: 'ธนกร', sum: 41, grade: 'A', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];

export const BulkAnalysisBanner = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const count1 = useCountUp(1000, 1400, visible);
    const count2 = useCountUp(5, 800, visible);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20"
            aria-label="วิเคราะห์ชื่อหลายชื่อพร้อมกัน"
        >
            {/* Main Banner Card */}
            <div className="relative rounded-[2rem] overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-[#0f1729]/95 via-[#130f2a]/95 to-[#0a0f1e]/95 shadow-[0_20px_80px_rgba(79,70,229,0.15)] backdrop-blur-xl">

                {/* Background glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
                    <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] rounded-full bg-fuchsia-600/8 blur-[80px]" />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

                    {/* Left: Copy + CTA */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 mb-5">
                            <ClipboardList className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Bulk Analysis</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                            วิเคราะห์ชื่อ<br />
                            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                                ครั้งละ {count1.toLocaleString()} ชื่อ
                            </span>
                        </h2>

                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-6 max-w-md">
                            จัดเกรด <span className="font-bold text-white">A+, A, B, C</span> อัตโนมัติ ตรวจคู่เลข กาลกิณี
                            และวันมงคลพร้อมกันทุกชื่อ ประหยัดเวลากว่า <span className="font-bold text-amber-400">{count2}× </span>
                            เทียบกับวิเคราะห์ทีละชื่อ
                        </p>

                        {/* Checklist */}
                        <ul className="space-y-2 mb-8 w-full max-w-xs">
                            {[
                                'วาง Copy/Paste ได้เลย 1 ชื่อต่อบรรทัด',
                                'เรียงลำดับจากดีที่สุดได้ทันที',
                                'Export CSV สำหรับ Excel / PDF สำหรับพิมพ์',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/name-analysis"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:-translate-y-1 active:scale-95"
                        >
                            <ClipboardList className="w-5 h-5" />
                            เริ่มวิเคราะห์หลายชื่อ
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <p className="mt-3 text-xs text-slate-500">
                            ใช้เพียง 5–100 เครดิต · วิเคราะห์ได้สูงสุด 1,000 ชื่อต่อครั้ง
                        </p>
                    </div>

                    {/* Right: Demo preview card */}
                    <div className="flex-shrink-0 w-full max-w-sm lg:max-w-xs xl:max-w-sm">

                        {/* Feature pills */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {FEATURES.map((f) => (
                                <div
                                    key={f.label}
                                    className={`flex flex-col items-center text-center gap-1 p-3 rounded-2xl bg-gradient-to-br ${f.bg} border ${f.border} backdrop-blur-sm`}
                                >
                                    {f.icon}
                                    <span className="text-[10px] font-bold text-white leading-tight">{f.value}</span>
                                    <span className="text-[9px] text-slate-400">{f.sub}</span>
                                </div>
                            ))}
                        </div>

                        {/* Fake result table */}
                        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden shadow-2xl">
                            <div className="px-4 py-3 border-b border-white/5 bg-white/[0.03] flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ตัวอย่างผลลัพธ์</span>
                            </div>
                            <div className="divide-y divide-white/5">
                                {GRADE_DEMO.map((row, i) => (
                                    <div
                                        key={row.name}
                                        className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.03] transition-colors"
                                        style={{
                                            opacity: visible ? 1 : 0,
                                            transform: visible ? 'translateX(0)' : 'translateX(-10px)',
                                            transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-500 font-mono text-xs w-5">{i + 1}</span>
                                            <span className="text-slate-200 font-medium text-sm">{row.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-indigo-300 font-bold text-sm">{row.sum}</span>
                                            <div className={`w-9 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${row.color}`}>
                                                {row.grade}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <span className="text-[10px] text-slate-500">6 จาก 1,000 รายชื่อ</span>
                                <span className="text-[10px] font-bold text-indigo-400">↓ Export CSV</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
