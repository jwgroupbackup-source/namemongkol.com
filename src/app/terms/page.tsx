import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Book, Scale, AlertCircle, Copyright, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { Metadata } from 'next';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'ข้อตกลงและเงื่อนไข | NameMongkol',
    description: 'ข้อตกลงและเงื่อนไขการใช้งาน NameMongkol ครอบคลุมบริการวิเคราะห์ชื่อมงคล เช็คเบอร์มงคล วิเคราะห์ลายมือด้วย AI ระบบเครดิต และนโยบายคืนเงิน ตามกฎหมายไทย',
    keywords: ['ข้อตกลง', 'เงื่อนไขการใช้งาน', 'Terms of Service', 'NameMongkol', 'กฎหมาย', 'วิเคราะห์ลายมือ', 'Palm Analysis', 'เบอร์มงคล', 'ระบบเครดิต'],

    alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/terms` },
    openGraph: {
        title: 'ข้อตกลงและเงื่อนไขการใช้งาน | NameMongkol',
        description: 'ข้อตกลงและเงื่อนไขการใช้งาน NameMongkol ครอบคลุมบริการวิเคราะห์ชื่อมงคล เช็คเบอร์มงคล วิเคราะห์ลายมือด้วย AI ระบบเครดิต และนโยบายคืนเงิน ตามกฎหมายไทย',
        url: `${siteUrl}/terms`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=ข้อตกลงและเงื่อนไข&subtitle=Terms%20of%20Service&tag=Legal`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ข้อตกลงและเงื่อนไขการใช้งาน | NameMongkol',
        description: 'ข้อตกลงและเงื่อนไขการใช้งาน NameMongkol ครอบคลุมบริการวิเคราะห์ชื่อมงคล เช็คเบอร์มงคล วิเคราะห์ลายมือด้วย AI ระบบเครดิต และนโยบายคืนเงิน ตามกฎหมายไทย',
        images: [`${siteUrl}/api/og?variant=default&title=ข้อตกลงและเงื่อนไข`],
    },
    robots: {
        index: true,
        follow: true,
    },
};

// JSON-LD for Terms of Service Page
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'ข้อตกลงและเงื่อนไขการใช้งาน NameMongkol',
    description: 'ข้อตกลงและเงื่อนไขการใช้งานเว็บไซต์ NameMongkol',
    url: `${siteUrl}/terms`,
    inLanguage: 'th-TH',
    isPartOf: {
        '@type': 'WebSite',
        name: 'NameMongkol',
        url: siteUrl,
    },
    about: {
        '@type': 'Thing',
        name: 'ข้อตกลงการใช้บริการ',
        description: 'Terms of Service สำหรับเว็บไซต์วิเคราะห์ชื่อมงคล เช็คเบอร์มงคล และวิเคราะห์ลายมือด้วย AI',
    },
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'หน้าหลัก',
                item: siteUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'ข้อตกลงและเงื่อนไข',
                item: `${siteUrl}/terms`,
            },
        ],
    },
    dateModified: '2026-01-09',
    publisher: {
        '@type': 'Organization',
        name: 'NameMongkol',
        url: siteUrl,
    },
};

export default function TermsPage() {
    return (
        <>
            <Script
                id="terms-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-amber-900/20 to-transparent pointer-events-none" />
                <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />

                <div className="relative w-full max-w-[1400px] px-4 pt-6 md:pt-32 pb-28 md:pb-20">
                    {/* Navigation */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="text-sm font-medium">กลับสู่หน้าหลัก</span>
                    </Link>

                    {/* Header */}
                    <div className="text-center space-y-6 mb-16 relative">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/20 mb-2 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Book className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                ข้อตกลงและเงื่อนไข
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm md:text-base">
                                <ShieldCheck size={16} className="text-green-500" />
                                <p>มีผลบังคับใช้เมื่อ: 9 มกราคม 2569</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid gap-6 md:gap-8">
                        {/* Introduction Card */}
                        <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl">
                            <p className="text-slate-300 leading-relaxed text-lg">
                                ยินดีต้อนรับสู่ <span className="text-amber-400 font-semibold">NameMongkol.com</span> การใช้งานเว็บไซต์นี้แสดงว่าท่านยอมรับข้อตกลงและเงื่อนไขดังต่อไปนี้เพื่อให้สังคมแห่งการแบ่งปันความมงคลนี้เป็นไปอย่างเรียบร้อย
                            </p>
                        </div>

                        {/* Section 1 */}
                        <section className="bg-[#1e293b]/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                            <div className="flex items-start gap-4 md:gap-6">
                                <div className="shrink-0 p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                                    <Scale size={24} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                                        1. ลักษณะของบริการ
                                    </h2>
                                    <p className="text-slate-300">
                                        ให้บริการวิเคราะห์ข้อมูลทางภาษาศาสตร์ (Onomastics) และสถิติเชิงตัวเลข เพื่อใช้เป็นแนวทางในการตั้งชื่อและสร้างสรรค์ผลงานดิจิทัล บริการของเราครอบคลุมถึง: การวิเคราะห์ชื่อแบบปกติและเจาะลึก (Premium), การวิเคราะห์ชื่อจำนวนมาก (Bulk Analysis), บริการเช็คเบอร์มงคลตามหลักเลขศาสตร์, บริการวิเคราะห์ลายมือด้วย AI ขั้นสูง, บริการวิเคราะห์พลังงานออร่า และบริการสร้างสรรค์วอลเปเปอร์มงคลเฉพาะบุคคลตามหลักโหราศาสตร์
                                    </p>
                                    <div className="mt-4 p-4 md:p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-sm md:text-base text-amber-100 flex gap-4 items-start">
                                        <AlertCircle className="shrink-0 mt-0.5 text-amber-400" size={20} />
                                        <div>
                                            <strong className="block text-amber-400 mb-1">คำสงวนสิทธิ์ (Disclaimer)</strong>
                                            <p className="opacity-90">
                                                ผลลัพธ์จากการวิเคราะห์เป็นข้อมูลทางสถิติและหลักการทางภาษาศาสตร์เพื่อนำไปประยุกต์ใช้เท่านั้น การตัดสินใจนำไปใช้งานขึ้นอยู่กับดุลยพินิจของผู้ใช้บริการ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="bg-[#1e293b]/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                            <div className="flex items-start gap-4 md:gap-6">
                                <div className="shrink-0 p-3 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                                    <Zap size={24} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                                        2. ระบบเครดิตและการชำระเงิน
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <h3 className="font-semibold text-white mb-2">💎 การใช้งานเครดิต</h3>
                                            <p className="text-sm text-slate-400">ใช้แลกบริการ Premium เช่น ค้นหาชื่อระดับสูง, ดาวน์โหลดวอลเปเปอร์พิเศษ, วิเคราะห์ลายมือด้วย AI (30 เครดิต/ครั้ง) หรือการวิเคราะห์ชื่อจำนวนมาก (Bulk Analysis)</p>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <h3 className="font-semibold text-white mb-2">🚫 นโยบายการคืนเงิน</h3>
                                            <p className="text-sm text-slate-400">
                                                เนื่องจากบริการของเราเป็นสินค้าดิจิทัลที่ผลิตขึ้นเฉพาะบุคคล (Personalized Digital Goods) และมีการส่งมอบข้อมูลทันทีหลังการชำระเงิน บริษัทจึงขอสงวนสิทธิ์ในการ <span className="text-red-300">ไม่คืนเงินในทุกกรณี</span> เว้นแต่จะเกิดความผิดพลาดจากระบบที่ไม่สามารถส่งมอบข้อมูลได้ตามที่ระบุไว้
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-1">* เครดิตที่ซื้อไม่มีวันหมดอายุ ตราบใดที่ระบบยังให้บริการ | เครดิตฟรีต้อนรับสมาชิกใหม่มีอายุ 30 วัน</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="bg-[#1e293b]/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                            <div className="flex items-start gap-4 md:gap-6">
                                <div className="shrink-0 p-3 rounded-2xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                                    <Copyright size={24} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-rose-200 transition-colors">
                                        3. ทรัพย์สินทางปัญญา
                                    </h2>
                                    <ul className="space-y-3 text-slate-300">
                                        <li className="flex gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-xs border border-green-500/20">✓</span>
                                            <span>
                                                <strong className="text-white">อนุญาต:</strong> ดาวน์โหลดวอลเปเปอร์เพื่อใช้งานส่วนตัว (Personal Use) เช่น ตั้งหน้าจอมือถือ
                                            </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xs border border-red-500/20">✕</span>
                                            <span>
                                                <strong className="text-white">ไม่อนุญาต:</strong> นำไฟล์ภาพ, บทวิเคราะห์ ไปจำหน่าย, แจกจ่ายต่อ, ดัดแปลง หรือใช้ในเชิงพาณิชย์
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 4 - User Generated Content */}
                        <section className="bg-[#1e293b]/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                            <div className="flex items-start gap-4 md:gap-6">
                                <div className="shrink-0 p-3 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 group-hover:bg-fuchsia-500/20 transition-colors">
                                    <Book size={24} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-fuchsia-200 transition-colors">
                                        4. เนื้อหาที่สร้างโดยผู้ใช้ (User-Generated Content)
                                    </h2>
                                    <p className="text-slate-300">
                                        ในการส่งคำติชม หรือรีวิวการใช้งาน (Reviews) บนแพลตฟอร์มของเรา ท่านตกลงที่จะใช้ถ้อยคำที่สุภาพและไม่ละเมิดสิทธิ์ของผู้อื่น โดยท่านอนุญาต (License) ให้ NameMongkol มีสิทธิ์ในการนำข้อความรีวิวและชื่อโปรไฟล์ของท่านไปแสดงผลบนเว็บไซต์หรือใช้ในสื่อเพื่อการประชาสัมพันธ์บริการของเรา
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 5 - Customer Support */}
                        <section className="bg-[#1e293b]/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all duration-300 group">
                            <div className="flex items-start gap-4 md:gap-6">
                                <div className="shrink-0 p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                    <ShieldCheck size={24} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                                        5. การสนับสนุนลูกค้า
                                    </h2>
                                    <p className="text-slate-300">
                                        หากท่านประสบปัญหาในการใช้งาน หรือต้องการสอบถามข้อมูลเพิ่มเติมเกี่ยวกับบริการ สามารถติดต่อทีมงานได้ผ่านช่องทางดังนี้:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-semibold uppercase">Official Customer Support</p>
                                                <p className="text-amber-400 font-bold">LINE: @namemongkol</p>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-semibold uppercase">Email Support</p>
                                                <p className="text-white font-medium">support@namemongkol.com</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-2">
                                        ทีมงานพร้อมให้บริการทุกวัน เวลา 09:00 - 22:00 น.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-16 text-center border-t border-white/5 pt-8">
                        <p className="text-slate-500 text-sm">
                            © 2024–2026 NameMongkol.com - สงวนลิขสิทธิ์ตามกฎหมาย
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
