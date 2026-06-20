'use client';

import React from 'react';
import { Star, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import Image from 'next/image';
import Link from 'next/link';

export const HomeSeoContent = () => {
    const { t } = useLanguage();

    return (
        <section className="w-full max-w-4xl mx-auto mt-16 mb-12 px-4">
            <div
                id="home-seo-answer"
                className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8 shadow-sm"
            >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Free Name Analysis
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-snug text-[#1a1a3e] sm:text-3xl">
                    วิเคราะห์ชื่อฟรีแบบละเอียด ถอดอักษรเป็นเลขศาสตร์และเช็กคู่เลขในชื่อ
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#5a5a82] sm:text-base">
                    NameMongkol ช่วยวิเคราะห์ชื่อและนามสกุลด้วย 4 ศาสตร์หลัก ได้แก่ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์ จุดเด่นคือการถอดตัวอักษรแต่ละตัวเป็นค่าเลขศาสตร์ แล้วจับเลขที่อยู่ติดกันเป็นคู่ เช่น 14, 24, 65 เพื่ออ่านพลังส่งเสริม จุดที่ควรระวัง และความหมายเชิงลึกของชื่อ ไม่ใช่ดูเฉพาะผลรวมตัวเลขเท่านั้น
                </p>
                <div className="mt-5 grid gap-3 text-sm text-[#5a5a82] sm:grid-cols-3">
                    <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
                        <h3 className="font-semibold text-amber-600">1. ถอดอักษรเป็นเลข</h3>
                        <p className="mt-2 leading-relaxed">แปลงตัวอักษรในชื่อและนามสกุลเป็นค่าเลขศาสตร์ทีละตัว</p>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
                        <h3 className="font-semibold text-amber-600">2. รวมเลขศาสตร์</h3>
                        <p className="mt-2 leading-relaxed">ดูผลรวมชื่อ นามสกุล และคะแนนภาพรวมตามหลัก 4 ศาสตร์</p>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
                        <h3 className="font-semibold text-amber-600">3. จับคู่เลขรายตัว</h3>
                        <p className="mt-2 leading-relaxed">อ่านพลังและความหมายของคู่เลขที่เรียงต่อกันในชื่อ</p>
                    </div>
                </div>
            </div>

            <div className="mb-10 grid gap-4 md:grid-cols-2">
                <Link
                    href="/name-check"
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-5 transition-colors hover:border-amber-300 hover:bg-amber-100 shadow-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Intent 01</p>
                    <h2 className="mt-2 text-xl font-bold text-[#1a1a3e]">เช็กชื่อของตัวเองก่อนเปลี่ยนชื่อ</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#5a5a82]">
                        เหมาะสำหรับคนที่อยากรู้ว่าชื่อปัจจุบันส่งผลต่อการงาน การเงิน และภาพลักษณ์อย่างไร ก่อนตัดสินใจเปลี่ยนชื่อจริง
                    </p>
                    <p className="mt-4 text-sm font-medium text-amber-600">ไปวิเคราะห์ชื่อ-นามสกุลฟรี</p>
                </Link>

                <Link
                    href="/search"
                    className="rounded-2xl border border-sky-200 bg-sky-50 p-5 transition-colors hover:border-sky-300 hover:bg-sky-100 shadow-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Intent 02</p>
                    <h2 className="mt-2 text-xl font-bold text-[#1a1a3e]">หาชื่อมงคลให้ลูก หรือชื่อใหม่ของคุณ</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#5a5a82]">
                        เหมาะสำหรับพ่อแม่และคนที่กำลังหาชื่อใหม่ โดยเริ่มจากรายชื่อมงคล แล้วค่อยนำชื่อที่ชอบไปวิเคราะห์ร่วมกับนามสกุลอีกครั้ง
                    </p>
                    <p className="mt-4 text-sm font-medium text-sky-600">ไปค้นหาชื่อมงคลฟรี</p>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ddddf0] shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold text-amber-500 mb-4 flex items-center gap-2 tracking-tight">
                        <Star className="w-5 h-5" />
                        {t('sections.homeSeo.whyTitle')}
                    </h2>
                    <p className="text-[#5a5a82] leading-relaxed mb-4">
                        {t('sections.homeSeo.whyDesc1')}
                    </p>
                    <p className="text-[#5a5a82] leading-relaxed">
                        {t('sections.homeSeo.whyDesc2')}
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ddddf0] shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold text-emerald-500 mb-4 flex items-center gap-2 tracking-tight">
                        <TrendingUp className="w-5 h-5" />
                        {t('sections.homeSeo.changeTitle')}
                    </h2>
                    <p className="text-[#5a5a82] leading-relaxed mb-4">
                        {t('sections.homeSeo.changeDesc1')}
                    </p>
                    <p className="text-[#5a5a82] leading-relaxed">
                        {t('sections.homeSeo.changeDesc2')}
                    </p>
                </div>
            </div>

            <div className="mb-16">
                <div className="text-center mb-10 sm:mb-14">
                    <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider border border-blue-200 mb-5 inline-block">
                        {t('sections.homeSeo.pillarBadge')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a3e] mb-5 tracking-tight">{t('sections.homeSeo.pillarTitle')}</h2>
                    <p className="text-[#5a5a82] max-w-[65ch] mx-auto text-sm sm:text-base leading-relaxed">
                        {t('sections.homeSeo.pillarDesc')}
                    </p>
                </div>

                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 px-1 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-6 sm:p-8 rounded-2xl bg-white border border-[#ddddf0] hover:border-amber-400 transition-all hover:-translate-y-1 group shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 font-bold mb-5 group-hover:scale-110 transition-transform">1</div>
                        <h3 className="font-bold text-lg sm:text-xl text-[#1a1a3e] mb-3 tracking-tight group-hover:text-amber-500 transition-colors">{t('sections.knowledge.tabs.numerology')}</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            แปลงค่าอักษรเป็นตัวเลข เพื่อดูอิทธิพลดาวเคราะห์ที่ส่งผลต่อเจ้าชะตา (ผลรวมที่ดี เช่น 14, 15, 24, 45, 59)
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-6 sm:p-8 rounded-2xl bg-white border border-[#ddddf0] hover:border-emerald-400 transition-all hover:-translate-y-1 group shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold mb-5 group-hover:scale-110 transition-transform">2</div>
                        <h3 className="font-bold text-lg sm:text-xl text-[#1a1a3e] mb-3 tracking-tight group-hover:text-emerald-500 transition-colors">{t('sections.knowledge.tabs.thaksa')}</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            ภูมิพยากรณ์ประจำวันเกิด หาอักษรที่เป็น &quot;เดช&quot; &quot;ศรี&quot; &quot;มนตรี&quot; และหลีกเลี่ยง &quot;กาลกิณี&quot; อย่างเด็ดขาด
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-6 sm:p-8 rounded-2xl bg-white border border-[#ddddf0] hover:border-rose-400 transition-all hover:-translate-y-1 group shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 font-bold mb-5 group-hover:scale-110 transition-transform">3</div>
                        <h3 className="font-bold text-lg sm:text-xl text-[#1a1a3e] mb-3 tracking-tight group-hover:text-rose-500 transition-colors">{t('sections.knowledge.tabs.ayatana')}</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            ศาสตร์แห่งการยอมรับทางสังคม สะท้อนว่าคนรอบข้างมองเราอย่างไร (เปรียบเทียบกับคน 9 ประเภท เช่น ราชินี, เศรษฐี)
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-6 sm:p-8 rounded-2xl bg-white border border-[#ddddf0] hover:border-blue-400 transition-all hover:-translate-y-1 group shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-bold mb-5 group-hover:scale-110 transition-transform">4</div>
                        <h3 className="font-bold text-lg sm:text-xl text-[#1a1a3e] mb-3 tracking-tight group-hover:text-blue-500 transition-colors">{t('sections.knowledge.tabs.nirun')}</h3>
                        <p className="text-sm text-[#5a5a82]">
                            หัวใจสำคัญ! ตรวจสอบความสมพงศ์ระหว่าง &quot;ชื่อต้น&quot; และ &quot;นามสกุล&quot; ให้อยู่ร่วมกันแล้วส่งเสริมกัน ไม่ขัดแย้ง
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-[#ddddf0] mt-10 bg-white transition-all group">
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
                    className="group rounded-2xl border border-sky-200 bg-sky-50 hover:bg-sky-100 p-5 transition-all shadow-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-2">
                        วิเคราะห์ชื่อฟรี
                    </p>
                    <p className="text-[#1a1a3e] font-bold leading-snug">
                        วิเคราะห์ชื่อ-นามสกุล ฟรี รู้ผลทันที
                    </p>
                    <p className="mt-2 text-sm text-[#5a5a82] leading-relaxed">
                        ใช้สำหรับเช็กชื่อปัจจุบันว่าผลรวมเลขศาสตร์ กาลกิณี ความสมพงศ์กับนามสกุล และภาพรวม 4 ศาสตร์อยู่ในเกณฑ์ดีหรือไม่
                    </p>
                    <p className="mt-3 text-sm text-sky-600 font-medium">
                        ไปหน้า /name-check →
                    </p>
                </Link>

                <Link
                    href="/search"
                    className="group rounded-2xl border border-amber-200 bg-amber-50 hover:bg-amber-100 p-5 transition-all shadow-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">
                        ค้นหาชื่อมงคลฟรี
                    </p>
                    <p className="text-[#1a1a3e] font-bold leading-snug">
                        ค้นหาชื่อมงคลฟรี 5,000+ ชื่อ
                    </p>
                    <p className="mt-2 text-sm text-[#5a5a82] leading-relaxed">
                        เหมาะสำหรับตั้งชื่อลูก เปลี่ยนชื่อใหม่ หรือหาไอเดียชื่อมงคลก่อน แล้วค่อยนำชื่อที่ชอบไปวิเคราะห์ร่วมกับนามสกุล
                    </p>
                    <p className="mt-3 text-sm text-amber-600 font-medium">
                        ไปหน้า /search →
                    </p>
                </Link>

                <Link
                    href="/premium-search"
                    className="group rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 p-5 transition-all shadow-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">
                        เปลี่ยนชื่อ Pro
                    </p>
                    <p className="text-[#1a1a3e] font-bold leading-snug">
                        เปลี่ยนชื่อมงคล Pro คัดชื่อเสริมดวง
                    </p>
                    <p className="mt-2 text-sm text-[#5a5a82] leading-relaxed">
                        ฐานข้อมูลคัดพิเศษ เลือกอักษรนำตามทักษา และคัดผลรวมเลขศาสตร์ระดับสูง
                    </p>
                    <p className="mt-3 text-sm text-emerald-600 font-medium">
                        ไปหน้า /premium-search →
                    </p>
                </Link>

                <Link
                    href="/premium-analysis"
                    className="group rounded-2xl border border-purple-200 bg-purple-50 hover:bg-purple-100 p-5 transition-all shadow-sm"
                >
                    <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-2">
                        Premium Analysis
                    </p>
                    <p className="text-[#1a1a3e] font-bold leading-snug">
                        วิเคราะห์ชื่อมงคลขั้นสูง (เวลาเกิด/ลัคนา)
                    </p>
                    <p className="mt-2 text-sm text-[#5a5a82] leading-relaxed">
                        เจาะลึกเฉพาะบุคคลด้วยวัน-เดือน-ปีและเวลาตกฟาก เพื่อคัดชื่อที่ “เหมาะกับดวง” มากขึ้น
                    </p>
                    <p className="mt-3 text-sm text-purple-600 font-medium">
                        ไปหน้า /premium-analysis →
                    </p>
                </Link>
            </div>

            <div className="mt-10 rounded-2xl border border-[#ddddf0] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <Shield className="h-4 w-4" />
                    ใช้หน้าแรกเป็นจุดเริ่มต้น แล้วค่อยไปต่อในหน้าที่ตรงกับโจทย์ของคุณ
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#5a5a82] sm:text-base">
                    ถ้าคุณต้องการรู้ทันทีว่าชื่อปัจจุบันดีหรือไม่ ให้เริ่มจากหน้าวิเคราะห์ชื่อฟรี แต่ถ้ากำลังหาชื่อใหม่หรือตั้งชื่อลูก ควรเริ่มที่หน้าค้นหาชื่อมงคลก่อน แล้วค่อยกลับมาวิเคราะห์ร่วมกับนามสกุลเพื่อเช็กความเหมาะสมขั้นสุดท้าย
                </p>
            </div>
        </section>
    );
};
