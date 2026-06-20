'use client';

import React, { useState } from 'react';
import { Shield, Star, Zap, CheckCircle2, XCircle, Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface PremiumSEOSectionProps {
    allNamesLength: number;
}

export default function PremiumSEOSection({ allNamesLength }: PremiumSEOSectionProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: 'เปลี่ยนชื่อมงคล Pro ต่างจากค้นหาทั่วไปอย่างไร?',
            a: 'ระบบเปลี่ยนชื่อมงคล Pro ใช้ ฐานข้อมูลชื่อคัดกรอง ที่ผ่านการคัดกรอง 3 ชั้น: 1) คัดตามหลักทักษา ไม่มีอักษรกาลกิณี 2) คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ 3) ความหมายดี ไพเราะ ทันสมัย และสามารถเลือกอักษรนำวรรคเดช/ศรี ได้'
        },
        {
            q: 'วรรคเดชและวรรคศรีคืออะไร?',
            a: 'วรรคเดช คืออักษรนำที่ส่งเสริมเรื่องอำนาจบารมี การเลื่อนขั้นเลื่อนตำแหน่ง เหมาะกับผู้ต้องการความก้าวหน้าในหน้าที่การงาน ส่วน วรรคศรี คืออักษรนำที่ส่งเสริมเรื่องโชคลาภ เสน่ห์ความรัก เหมาะกับผู้ต้องการดึงดูดความโชคดีและเสน่ห์'
        },
        {
            q: 'เปลี่ยนชื่อมงคล Pro ใช้กี่เครดิต?',
            a: 'การปลดล็อกชื่อใช้ 15 เครดิตต่อการปลดล็อก 1 ครั้ง (สูงสุด 20 รายชื่อ) ในแต่ละหมวดอักษรที่คุณประสงค์จะเปิดใช้งาน'
        }
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
        <section className="mt-24 pt-16 border-t border-slate-200 space-y-24 relative z-10">
            {/* Background Glows for SEO section */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[200px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Section A */}
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-black text-center text-[#1a1a3e] mb-6">
                    ทำไมต้อง <span className="text-emerald-600 drop-shadow-sm">&quot;เปลี่ยนชื่อมงคล Pro&quot;</span>?
                </h2>
                <p className="text-lg md:text-xl text-[#5a5a82] leading-relaxed mb-12 text-center max-w-3xl mx-auto">
                    ระบบ Pro แตกต่างจากการตั้งชื่อทั่วไป เพราะเราใช้ <strong className="text-emerald-600 font-semibold">ฐานข้อมูลชื่อคัดกรอง</strong> ที่ผ่านการคัดกรองมาแล้วถึง 3 ชั้น
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: Shield, title: 'ชั้นที่ 1: คัดตามหลักทักษา', desc: 'อักษรนำดี กาลกิณีไม่มี 100% ทุกชื่อผ่านการตรวจสอบว่าไม่มีอักษรต้องห้ามตามวันเกิด', color: 'emerald' },
                        { icon: Star, title: 'ชั้นที่ 2: คัดตามเลขศาสตร์', desc: 'คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ เช่น 14, 15, 24, 36, 45 ที่ส่งเสริมดวงชะตาอย่างแท้จริง', color: 'amber' },
                        { icon: Zap, title: 'ชั้นที่ 3: ความหมายดี', desc: 'ความหมายดี ไพเราะ ไม่เชย เหมาะกับยุคสมัย เรียกชื่อแล้วดูดี มีความหมายเป็นสิริมงคล', color: 'purple' }
                    ].map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div key={i} className={`group bg-[#0f172a] border border-[#1e293b] shadow-md rounded-3xl p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-${feature.color}-500/30`}>
                                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                    <Icon className={`w-7 h-7 text-${feature.color}-400 drop-shadow-md`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                    {feature.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Section B: Comparison Table */}
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-4xl font-black text-[#1a1a3e]">
                        เปรียบเทียบ <span className="text-[#5a5a82]">ค้นหาทั่วไป</span> vs <span className="text-emerald-600 drop-shadow-sm">Pro</span>
                    </h2>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden space-y-4">
                    {comparisons.map((row, i) => (
                        <div key={i} className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 space-y-4 shadow-md backdrop-blur-sm">
                            <h4 className="text-sm font-bold text-slate-200 text-center">{row.feature}</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center min-h-[80px]">
                                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">ทั่วไป</span>
                                    {typeof row.free === 'boolean' ? (
                                        row.free ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-slate-600" />
                                    ) : (
                                        <span className="text-sm text-slate-300 font-semibold text-center leading-tight">{row.free}</span>
                                    )}
                                </div>
                                <div className={`rounded-xl p-4 border flex flex-col items-center justify-center min-h-[80px] ${row.highlightPro ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-white/5 border-white/5'}`}>
                                    <span className="block text-[10px] text-emerald-400 uppercase tracking-widest mb-2 font-black">Pro</span>
                                    {typeof row.pro === 'boolean' ? (
                                        row.pro ? <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow-md" /> : <XCircle className="w-6 h-6 text-red-400" />
                                    ) : (
                                        <span className="text-sm text-emerald-300 font-extrabold text-center leading-tight drop-shadow-md">{row.pro}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-hidden bg-[#0f172a] rounded-3xl border border-[#1e293b] shadow-md backdrop-blur-xl">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="text-left py-6 px-8 text-slate-400 font-bold uppercase tracking-wider text-xs">คุณสมบัติ</th>
                                <th className="text-center py-6 px-8 text-slate-400 font-bold uppercase tracking-wider text-xs">ค้นหาทั่วไป</th>
                                <th className="text-center py-6 px-8 text-emerald-400 font-black uppercase tracking-wider text-xs bg-emerald-500/5">เปลี่ยนชื่อมงคล Pro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {comparisons.map((row, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-8 text-slate-300 font-medium">{row.feature}</td>
                                    <td className="text-center py-5 px-8 text-slate-300">
                                        {typeof row.free === 'boolean' ? (
                                            row.free ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto opacity-70" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />
                                        ) : row.free}
                                    </td>
                                    <td className={`text-center py-5 px-8 font-extrabold ${row.highlightPro ? 'text-emerald-300 bg-emerald-500/[0.03] group-hover:bg-emerald-500/[0.05]' : 'text-emerald-400/80 bg-emerald-500/[0.01]'}`}>
                                        {typeof row.pro === 'boolean' ? (
                                            row.pro ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto drop-shadow-sm" /> : <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                        ) : row.pro}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center bg-emerald-50 border border-emerald-500/30 rounded-3xl p-10 sm:p-14 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05),transparent_50%)]" />
                    <div className="relative z-10">
                        <p className="text-[#5a5a82] mb-6 text-lg">
                            💡 <strong className="text-emerald-600">คำแนะนำสำคัญ:</strong> หลังได้ชื่อที่ต้องการแล้ว อย่าลืมนำไป
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0f172a] text-white font-black rounded-2xl transition-all hover:-translate-y-1 shadow-md hover:shadow-xl border border-[#1e293b] hover:border-emerald-500/30"
                        >
                            <Sparkles size={20} className="text-emerald-400" />
                            วิเคราะห์ชื่อ-สกุล ก่อนนำไปใช้
                        </Link>
                        <p className="text-[#5a5a82] text-sm mt-6 font-medium">
                            เพื่อตรวจสอบความเข้ากันของชื่อกับนามสกุล และดูผลวิเคราะห์แบบละเอียด
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-4 pb-20">
                <h2 className="text-2xl md:text-3xl font-black text-center text-[#1a1a3e] flex items-center justify-center gap-3 mb-8">
                    <HelpCircle className="w-8 h-8 text-emerald-600" />
                    คำถามที่พบบ่อย
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openFaqIndex === index;
                        return (
                            <div key={index} className={`bg-white border ${isOpen ? 'border-emerald-500/30 shadow-md' : 'border-slate-200 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-300`}>
                                <button
                                    type="button"
                                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                    className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 font-bold text-[#1a1a3e] hover:text-emerald-600 transition-colors focus:outline-none"
                                >
                                    <span className="text-base sm:text-lg flex items-start gap-3">
                                        <span className="text-emerald-600 shrink-0 font-black">Q.</span>
                                        <span className="leading-snug pt-0.5">{faq.q}</span>
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-[#5a5a82] shrink-0 transition-transform duration-300 mt-1 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                        isOpen ? 'max-h-[500px] bg-slate-50' : 'max-h-0'
                                    }`}
                                >
                                    <div className="p-6 pt-0 text-sm sm:text-base text-[#5a5a82] leading-relaxed flex items-start gap-3">
                                        <span className="text-amber-600 font-black shrink-0">A.</span>
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
