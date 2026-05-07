'use client';

import React from 'react';
import { Book, Star, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import Image from 'next/image';
import Link from 'next/link';

export const HomeSeoContent = () => {
    const { t } = useLanguage();

    return (
        <section className="w-full max-w-4xl mx-auto mt-16 mb-12 px-4">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2 tracking-tight">
                        <Star className="w-5 h-5" />
                        {t('sections.homeSeo.whyTitle')}
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        {t('sections.homeSeo.whyDesc1')}
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        {t('sections.homeSeo.whyDesc2')}
                    </p>
                </div>

                <div className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2 tracking-tight">
                        <TrendingUp className="w-5 h-5" />
                        {t('sections.homeSeo.changeTitle')}
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        {t('sections.homeSeo.changeDesc1')}
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        {t('sections.homeSeo.changeDesc2')}
                    </p>
                </div>
            </div>

            <div className="mb-16">
                <div className="text-center mb-10 sm:mb-14">
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20 mb-5 inline-block">
                        {t('sections.homeSeo.pillarBadge')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">{t('sections.homeSeo.pillarTitle')}</h2>
                    <p className="text-slate-400 max-w-[65ch] mx-auto text-sm sm:text-base leading-relaxed">
                        {t('sections.homeSeo.pillarDesc')}
                    </p>
                </div>

                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 px-1 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all hover:-translate-y-1 group backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold mb-5 group-hover:scale-110 transition-transform">1</div>
                        <h3 className="font-bold text-lg sm:text-xl text-white mb-3 tracking-tight group-hover:text-amber-400 transition-colors">{t('sections.knowledge.tabs.numerology')}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            แปลงค่าอักษรเป็นตัวเลข เพื่อดูอิทธิพลดาวเคราะห์ที่ส่งผลต่อเจ้าชะตา (ผลรวมที่ดี เช่น 14, 15, 24, 45, 59)
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1 group backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold mb-5 group-hover:scale-110 transition-transform">2</div>
                        <h3 className="font-bold text-lg sm:text-xl text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">{t('sections.knowledge.tabs.thaksa')}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            ภูมิพยากรณ์ประจำวันเกิด หาอักษรที่เป็น &quot;เดช&quot; &quot;ศรี&quot; &quot;มนตรี&quot; และหลีกเลี่ยง &quot;กาลกิณี&quot; อย่างเด็ดขาด
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-rose-500/30 transition-all hover:-translate-y-1 group backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold mb-5 group-hover:scale-110 transition-transform">3</div>
                        <h3 className="font-bold text-lg sm:text-xl text-white mb-3 tracking-tight group-hover:text-rose-400 transition-colors">{t('sections.knowledge.tabs.ayatana')}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            ศาสตร์แห่งการยอมรับทางสังคม สะท้อนว่าคนรอบข้างมองเราอย่างไร (เปรียบเทียบกับคน 9 ประเภท เช่น ราชินี, เศรษฐี)
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1 group backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold mb-5 group-hover:scale-110 transition-transform">4</div>
                        <h3 className="font-bold text-lg sm:text-xl text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">{t('sections.knowledge.tabs.nirun')}</h3>
                        <p className="text-sm text-slate-400">
                            หัวใจสำคัญ! ตรวจสอบความสมพงศ์ระหว่าง &quot;ชื่อต้น&quot; และ &quot;นามสกุล&quot; ให้อยู่ร่วมกันแล้วส่งเสริมกัน ไม่ขัดแย้ง
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/5 mt-10 hover:border-white/10 transition-all bg-white/5 backdrop-blur-sm group">
                <Image
                    src="/banner/ศัพท์น่ารู้ก่อนตั้งชื่ออมงคล-_ทักษา_.webp"
                    alt="ศัพท์น่ารู้ก่อนตั้งชื่อมงคล (ทักษา)"
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority={false}
                />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Link
                    href="/name-check"
                    className="group rounded-2xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 p-5 transition-all backdrop-blur-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/90 mb-2">
                        วิเคราะห์ชื่อฟรี
                    </p>
                    <p className="text-white font-bold leading-snug">
                        วิเคราะห์ชื่อ-นามสกุล ฟรี รู้ผลทันที
                    </p>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        ใช้สำหรับเช็กชื่อปัจจุบันว่าผลรวมเลขศาสตร์ กาลกิณี และความสมพงศ์กับนามสกุลอยู่ในเกณฑ์ดีหรือไม่
                    </p>
                    <p className="mt-3 text-sm text-sky-300 group-hover:text-sky-200">
                        ไปหน้า /name-check →
                    </p>
                </Link>

                <Link
                    href="/search"
                    className="group rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 p-5 transition-all backdrop-blur-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-2">
                        ค้นหาชื่อมงคลฟรี
                    </p>
                    <p className="text-white font-bold leading-snug">
                        ค้นหาชื่อมงคลฟรี 5,000+ ชื่อ
                    </p>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        เหมาะสำหรับตั้งชื่อลูก/เปลี่ยนชื่อใหม่ แล้วค่อยนำชื่อที่ชอบไปวิเคราะห์ร่วมกับนามสกุล
                    </p>
                    <p className="mt-3 text-sm text-amber-300 group-hover:text-amber-200">
                        ไปหน้า /search →
                    </p>
                </Link>

                <Link
                    href="/premium-search"
                    className="group rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 p-5 transition-all backdrop-blur-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300/90 mb-2">
                        Pro Search
                    </p>
                    <p className="text-white font-bold leading-snug">
                        ค้นหาชื่อมงคล Pro (วรรคเดช/วรรคศรี)
                    </p>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        ฐานข้อมูลคัดพิเศษ เลือกอักษรนำตามทักษา และคัดผลรวมเลขศาสตร์ระดับสูง
                    </p>
                    <p className="mt-3 text-sm text-emerald-300 group-hover:text-emerald-200">
                        ไปหน้า /premium-search →
                    </p>
                </Link>

                <Link
                    href="/premium-analysis"
                    className="group rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 p-5 transition-all backdrop-blur-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-purple-300/90 mb-2">
                        Premium Analysis
                    </p>
                    <p className="text-white font-bold leading-snug">
                        วิเคราะห์ชื่อมงคลขั้นสูง (เวลาเกิด/ลัคนา)
                    </p>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        เจาะลึกเฉพาะบุคคลด้วยวัน-เดือน-ปีและเวลาตกฟาก เพื่อคัดชื่อที่ “เหมาะกับดวง” มากขึ้น
                    </p>
                    <p className="mt-3 text-sm text-purple-300 group-hover:text-purple-200">
                        ไปหน้า /premium-analysis →
                    </p>
                </Link>
            </div>
        </section>
    );
};
