'use client';

import React, { useState } from 'react';
import { Shield, Star, Zap, CheckCircle2, XCircle, Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface PremiumSEOSectionProps {
    allNamesLength: number;
}

const featureCards = [
    {
        icon: Shield,
        title: 'ชั้นที่ 1: คัดตามหลักทักษา',
        desc: 'อักษรนำดี กาลกิณีไม่มี 100% ทุกชื่อผ่านการตรวจสอบว่าไม่มีอักษรต้องห้ามตามวันเกิด',
        card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-white',
        iconBox: 'border-emerald-200 bg-white text-emerald-600',
    },
    {
        icon: Star,
        title: 'ชั้นที่ 2: คัดตามเลขศาสตร์',
        desc: 'คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ เช่น 14, 15, 24, 36, 45 ที่ส่งเสริมดวงชะตาอย่างแท้จริง',
        card: 'border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50/70 to-white',
        iconBox: 'border-amber-200 bg-white text-amber-600',
    },
    {
        icon: Zap,
        title: 'ชั้นที่ 3: ความหมายดี',
        desc: 'ความหมายดี ไพเราะ ไม่เชย เหมาะกับยุคสมัย เรียกชื่อแล้วดูดี มีความหมายเป็นสิริมงคล',
        card: 'border-violet-200 bg-gradient-to-br from-violet-50 via-purple-50/70 to-white',
        iconBox: 'border-violet-200 bg-white text-violet-600',
    },
];

export default function PremiumSEOSection({ allNamesLength }: PremiumSEOSectionProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: 'เปลี่ยนชื่อมงคล Pro ต่างจากค้นหาทั่วไปอย่างไร?',
            a: 'ระบบ Pro ใช้ฐานข้อมูลชื่อคัดกรองที่ผ่าน 3 ชั้น: ทักษา, เลขศาสตร์ระดับ A+, และความหมายที่เหมาะกับการใช้งานจริง พร้อมตัวเลือกอักษรนำวรรคเดชหรือวรรคศรี',
        },
        {
            q: 'วรรคเดชและวรรคศรีคืออะไร?',
            a: 'วรรคเดชช่วยเสริมอำนาจ บารมี และความก้าวหน้า ส่วนวรรคศรีช่วยเสริมโชคลาภ เสน่ห์ และความนิยม เหมาะกับเป้าหมายชีวิตที่ต่างกัน',
        },
        {
            q: 'เปลี่ยนชื่อมงคล Pro ใช้กี่เครดิต?',
            a: 'การปลดล็อกรายชื่อใช้ 15 เครดิตต่อครั้ง โดยแสดงได้สูงสุด 20 รายชื่อต่อหมวดอักษรที่เลือก',
        },
    ];

    const comparisons = [
        { feature: 'คัดกรองอักษรกาลกิณี', free: true, pro: true },
        { feature: 'เลือกอักษรนำ (วรรคเดช/ศรี)', free: false, pro: true },
        { feature: 'เกรดของผลรวมเลขศาสตร์', free: 'คละเกรด', pro: 'เกรด A+ เท่านั้น', highlightPro: true },
        { feature: 'จำนวนชื่อในฐานข้อมูล', free: '5,000+', pro: `${allNamesLength.toLocaleString()} (คัดพิเศษ)`, highlightPro: true },
        { feature: 'กรองตามเพศ', free: false, pro: true },
        { feature: 'คุณภาพความหมาย', free: 'ปานกลาง', pro: 'คัดสรรพิเศษ', highlightPro: true },
    ];

    return (
        <section className="relative z-10 mt-24 space-y-24 border-t border-emerald-100 pt-16">
            <div className="absolute left-1/2 top-0 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-full max-w-2xl -translate-x-1/2 rounded-full bg-emerald-100/60 blur-[120px]" />

            <div className="mx-auto max-w-4xl px-4">
                <h2 className="mb-6 text-center text-3xl font-black text-[#1a1a3e] md:text-5xl">
                    ทำไมต้อง <span className="text-emerald-700">&quot;เปลี่ยนชื่อมงคล Pro&quot;</span>?
                </h2>
                <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-[#5a5a82] md:text-xl">
                    ระบบ Pro แตกต่างจากการตั้งชื่อทั่วไป เพราะใช้ <strong className="font-semibold text-emerald-700">ฐานข้อมูลชื่อคัดกรอง</strong> ที่ผ่านการคัดมาแล้ว 3 ชั้น
                </p>

                <div className="grid gap-6 md:grid-cols-3">
                    {featureCards.map(({ icon: Icon, title, desc, card, iconBox }) => (
                        <div key={title} className={`group rounded-3xl border p-6 shadow-[0_18px_42px_rgba(16,185,129,0.07)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(16,185,129,0.12)] ${card}`}>
                            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform group-hover:scale-110 ${iconBox}`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold tracking-wide text-[#1a1a3e]">{title}</h3>
                            <p className="text-sm leading-relaxed text-[#5a5a82] md:text-base">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-8 px-4">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-[#1a1a3e] md:text-4xl">
                        เปรียบเทียบ <span className="text-[#5a5a82]">ค้นหาทั่วไป</span> vs <span className="text-emerald-700">Pro</span>
                    </h2>
                </div>

                <div className="space-y-4 md:hidden">
                    {comparisons.map((row) => (
                        <div key={row.feature} className="space-y-4 rounded-2xl border border-emerald-100 bg-white/85 p-5 shadow-[0_14px_34px_rgba(16,185,129,0.08)]">
                            <h4 className="text-center text-sm font-bold text-[#1a1a3e]">{row.feature}</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex min-h-[80px] flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#5a5a82]">ทั่วไป</span>
                                    {typeof row.free === 'boolean'
                                        ? row.free ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <XCircle className="h-6 w-6 text-slate-300" />
                                        : <span className="text-center text-sm font-semibold leading-tight text-[#5a5a82]">{row.free}</span>}
                                </div>
                                <div className={`flex min-h-[80px] flex-col items-center justify-center rounded-xl border p-4 ${row.highlightPro ? 'border-emerald-200 bg-emerald-50 shadow-[0_10px_24px_rgba(16,185,129,0.10)]' : 'border-emerald-100 bg-white'}`}>
                                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-emerald-700">Pro</span>
                                    {typeof row.pro === 'boolean'
                                        ? row.pro ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <XCircle className="h-6 w-6 text-red-400" />
                                        : <span className="text-center text-sm font-extrabold leading-tight text-emerald-700">{row.pro}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-[0_18px_44px_rgba(16,185,129,0.08)] md:block">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-emerald-100 bg-emerald-50/70">
                                <th className="px-8 py-6 text-left text-xs font-bold uppercase tracking-wider text-[#5a5a82]">คุณสมบัติ</th>
                                <th className="px-8 py-6 text-center text-xs font-bold uppercase tracking-wider text-[#5a5a82]">ค้นหาทั่วไป</th>
                                <th className="bg-emerald-100/60 px-8 py-6 text-center text-xs font-black uppercase tracking-wider text-emerald-700">เปลี่ยนชื่อมงคล Pro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {comparisons.map((row) => (
                                <tr key={row.feature} className="transition-colors hover:bg-emerald-50/40">
                                    <td className="px-8 py-5 font-medium text-[#1a1a3e]">{row.feature}</td>
                                    <td className="px-8 py-5 text-center text-[#5a5a82]">
                                        {typeof row.free === 'boolean'
                                            ? row.free ? <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" /> : <XCircle className="mx-auto h-5 w-5 text-slate-300" />
                                            : row.free}
                                    </td>
                                    <td className={`px-8 py-5 text-center font-extrabold ${row.highlightPro ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-50/40 text-emerald-600'}`}>
                                        {typeof row.pro === 'boolean'
                                            ? row.pro ? <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" /> : <XCircle className="mx-auto h-5 w-5 text-red-500" />
                                            : row.pro}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4">
                <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-10 text-center shadow-[0_18px_44px_rgba(16,185,129,0.10)] sm:p-14">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_50%)]" />
                    <div className="relative z-10">
                        <p className="mb-6 text-lg text-[#5a5a82]">
                            <strong className="text-emerald-700">คำแนะนำสำคัญ:</strong> หลังได้ชื่อที่ต้องการแล้ว อย่าลืมนำไป
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-white px-8 py-4 font-black text-[#1a1a3e] shadow-[0_12px_32px_rgba(16,185,129,0.12)] transition-all hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50"
                        >
                            <Sparkles size={20} className="text-emerald-600" />
                            วิเคราะห์ชื่อ-สกุล ก่อนนำไปใช้
                        </Link>
                        <p className="mt-6 text-sm font-medium text-[#5a5a82]">
                            เพื่อตรวจสอบความเข้ากันของชื่อกับนามสกุล และดูผลวิเคราะห์แบบละเอียด
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 pb-20">
                <h2 className="mb-8 flex items-center justify-center gap-3 text-center text-2xl font-black text-[#1a1a3e] md:text-3xl">
                    <HelpCircle className="h-8 w-8 text-emerald-700" />
                    คำถามที่พบบ่อย
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openFaqIndex === index;
                        return (
                            <div key={faq.q} className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isOpen ? 'border-emerald-300 shadow-[0_14px_34px_rgba(16,185,129,0.12)]' : 'border-emerald-100 shadow-sm'}`}>
                                <button
                                    type="button"
                                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                    className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left font-bold text-[#1a1a3e] transition-colors hover:text-emerald-700 focus:outline-none"
                                >
                                    <span className="flex items-start gap-3 text-base sm:text-lg">
                                        <span className="shrink-0 font-black text-emerald-700">Q.</span>
                                        <span className="pt-0.5 leading-snug">{faq.q}</span>
                                    </span>
                                    <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-[#5a5a82] transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-700' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] bg-emerald-50/50' : 'max-h-0'}`}>
                                    <div className="flex items-start gap-3 p-6 pt-0 text-sm leading-relaxed text-[#5a5a82] sm:text-base">
                                        <span className="shrink-0 font-black text-amber-700">A.</span>
                                        <span className="pt-0.5">{faq.a}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
