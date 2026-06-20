import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, CheckCircle2, Cookie, Database, FileText, Lock, Scale, Shield } from 'lucide-react';
import { Metadata } from 'next';
import { siteUrl } from '@/lib/seo';

const privacyUrl = `${siteUrl}/privacy`;
const lastUpdated = '2 มิถุนายน 2569';
const dateModified = '2026-06-02';

export const metadata: Metadata = {
    title: {
        absolute: 'นโยบายความเป็นส่วนตัว | NameMongkol',
    },
    description: 'นโยบายความเป็นส่วนตัวของ NameMongkol อธิบายการเก็บ ใช้ ปกป้อง และลบข้อมูลผู้ใช้ ครอบคลุมชื่อ เบอร์ รูปภาพ AI Analytics Cookies และการชำระเงิน',
    keywords: [
        'นโยบายความเป็นส่วนตัว',
        'PDPA',
        'NameMongkol',
        'ข้อมูลส่วนบุคคล',
        'คุกกี้',
        'วิเคราะห์ชื่อ',
        'วิเคราะห์ลายมือ',
        'AI',
    ],
    alternates: { canonical: privacyUrl },
    openGraph: {
        title: 'นโยบายความเป็นส่วนตัว | NameMongkol',
        description: 'ข้อมูลเกี่ยวกับการเก็บ ใช้ ปกป้อง และลบข้อมูลส่วนบุคคลเมื่อใช้งาน NameMongkol',
        url: privacyUrl,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=${encodeURIComponent('นโยบายความเป็นส่วนตัว')}&subtitle=PDPA&tag=Legal`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'นโยบายความเป็นส่วนตัว | NameMongkol',
        description: 'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลผู้ใช้ของ NameMongkol',
        images: [`${siteUrl}/api/og?variant=default&title=${encodeURIComponent('นโยบายความเป็นส่วนตัว')}`],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': privacyUrl,
    name: 'นโยบายความเป็นส่วนตัว NameMongkol',
    description: 'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของ NameMongkol',
    url: privacyUrl,
    inLanguage: 'th-TH',
    dateModified,
    isPartOf: {
        '@type': 'WebSite',
        name: 'NameMongkol',
        url: siteUrl,
    },
    about: {
        '@type': 'Thing',
        name: 'นโยบายความเป็นส่วนตัวและ PDPA',
    },
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'หน้าแรก',
                item: siteUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'นโยบายความเป็นส่วนตัว',
                item: privacyUrl,
            },
        ],
    },
    publisher: {
        '@type': 'Organization',
        name: 'NameMongkol',
        url: siteUrl,
    },
};

const collectedData = [
    {
        title: 'ข้อมูลบัญชีและการเข้าสู่ระบบ',
        items: ['อีเมล ชื่อโปรไฟล์ รูปโปรไฟล์ และข้อมูลจาก Google/LINE OAuth เมื่อผู้ใช้เลือกเข้าสู่ระบบ', 'สถานะสมาชิก เครดิต และประวัติการใช้บริการที่เกี่ยวข้องกับบัญชี'],
    },
    {
        title: 'ข้อมูลสำหรับวิเคราะห์',
        items: ['ชื่อ นามสกุล วันเกิด เพศ และข้อมูลที่ผู้ใช้กรอกในเครื่องมือวิเคราะห์ชื่อ', 'เบอร์โทรศัพท์หรือชุดตัวเลขที่ใช้วิเคราะห์เบอร์มงคล', 'ภาพฝ่ามือ ภาพออร่า หรือข้อมูลที่อัปโหลดเพื่อใช้กับบริการ AI เฉพาะรายการ'],
    },
    {
        title: 'ข้อมูลธุรกรรมและการใช้งาน',
        items: ['รายการเติมเครดิต สถานะการชำระเงิน เลขอ้างอิง และข้อมูลที่จำเป็นต่อการยืนยันธุรกรรม', 'รีวิว คะแนน ความคิดเห็น และข้อมูลการติดต่อที่ผู้ใช้ยินยอมส่งให้', 'ข้อมูล analytics เช่น หน้าเว็บที่เข้าชม ปุ่มที่คลิก referrer อุปกรณ์ เบราว์เซอร์ และเวลาการใช้งาน'],
    },
];

const processors = [
    'Supabase สำหรับฐานข้อมูล authentication storage และ session cookies',
    'Vercel สำหรับ hosting, deployment, performance และ Vercel Analytics',
    'Google Tag Manager สำหรับจัดการ tracking script ที่เปิดใช้งาน',
    'Facebook Pixel และ TikTok Pixel เมื่อมีการตั้งค่า pixel ในระบบ production',
    'Stripe และ PromptPay สำหรับการรับชำระเงินหรือยืนยันธุรกรรม',
    'Google และ LINE สำหรับ OAuth login หรือการติดต่อผ่าน LINE Official Account',
];

const rights = [
    'ขอเข้าถึงหรือขอสำเนาข้อมูลส่วนบุคคล',
    'ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่เป็นปัจจุบัน',
    'ขอลบหรือระงับการใช้ข้อมูลในกรณีที่กฎหมายอนุญาต',
    'คัดค้านหรือถอนความยินยอมต่อการประมวลผลบางประเภท',
    'ขอทราบรายละเอียดการใช้ข้อมูลและผู้ให้บริการที่เกี่ยวข้อง',
];

export default function PrivacyPage() {
    return (
        <>
            <Script
                id="privacy-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_32%)] pointer-events-none" />

                <div className="relative mx-auto w-full max-w-5xl px-4 pt-24 md:pt-32 pb-28 md:pb-20">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 group">
                        <span className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={16} />
                        </span>
                        <span className="text-sm font-medium">กลับสู่หน้าแรก</span>
                    </Link>

                    <header className="text-center space-y-6 mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 shadow-2xl shadow-amber-500/20">
                            <Shield className="w-10 h-10" />
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">นโยบายความเป็นส่วนตัว</h1>
                            <p className="text-slate-400">ปรับปรุงล่าสุด: {lastUpdated}</p>
                        </div>
                    </header>

                    <div className="space-y-6">
                        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 md:p-8">
                            <p className="text-lg leading-relaxed text-slate-300">
                                NameMongkol ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้ นโยบายนี้อธิบายว่าเราเก็บ ใช้ จัดเก็บ
                                แบ่งปัน และลบข้อมูลอย่างไรเมื่อคุณใช้งานบริการวิเคราะห์ชื่อ เบอร์ ลายมือ ออร่า วอลเปเปอร์
                                บทความ รีวิว บัญชีผู้ใช้ เครดิต และการชำระเงินบนเว็บไซต์
                            </p>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <Database className="shrink-0 text-blue-300" size={28} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">1. ข้อมูลที่เราเก็บรวบรวม</h2>
                                    <div className="mt-5 grid gap-4">
                                        {collectedData.map((group) => (
                                            <div key={group.title} className="rounded-xl border border-white/10 bg-black/20 p-4">
                                                <h3 className="font-semibold text-blue-200">{group.title}</h3>
                                                <ul className="mt-3 space-y-2 text-slate-300">
                                                    {group.items.map((item) => (
                                                        <li key={item} className="flex gap-2">
                                                            <CheckCircle2 className="mt-0.5 shrink-0 text-blue-400" size={17} />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <FileText className="shrink-0 text-amber-300" size={28} />
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white">2. เราใช้ข้อมูลเพื่ออะไร</h2>
                                    <ul className="space-y-2 text-slate-300">
                                        {[
                                            'ประมวลผลและแสดงผลการวิเคราะห์ตามบริการที่ผู้ใช้เลือก',
                                            'สร้างประสบการณ์การใช้งานบัญชี เครดิต ประวัติ และบริการแบบสมาชิก',
                                            'ยืนยันการชำระเงิน ป้องกันธุรกรรมซ้ำ และดูแลความปลอดภัยของระบบ',
                                            'ปรับปรุงคุณภาพเนื้อหา บทความ เครื่องมือ และประสบการณ์ผู้ใช้',
                                            'ติดต่อกลับเมื่อผู้ใช้ร้องขอความช่วยเหลือหรือใช้สิทธิตามกฎหมาย',
                                        ].map((item) => (
                                            <li key={item} className="flex gap-2">
                                                <CheckCircle2 className="mt-0.5 shrink-0 text-amber-300" size={17} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-sm leading-relaxed text-slate-300">
                                        ผลการวิเคราะห์ด้านชื่อ เบอร์ ลายมือ หรือออร่าเป็นข้อมูลประกอบการตัดสินใจ ไม่ใช่คำรับรองผลลัพธ์ทางกฎหมาย การแพทย์ การเงิน หรือชะตาชีวิตแบบตายตัว
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <Lock className="shrink-0 text-emerald-300" size={28} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">3. ผู้ให้บริการและการแบ่งปันข้อมูล</h2>
                                    <p className="mt-3 text-slate-300 leading-relaxed">
                                        เราไม่ขายข้อมูลส่วนบุคคลของผู้ใช้ แต่จำเป็นต้องใช้ผู้ให้บริการบางรายเพื่อให้เว็บไซต์ทำงานได้ครบถ้วน
                                        โดยจำกัดการเข้าถึงตามหน้าที่ของแต่ละบริการ
                                    </p>
                                    <ul className="mt-5 grid gap-2 text-slate-300">
                                        {processors.map((item) => (
                                            <li key={item} className="flex gap-2 rounded-lg bg-black/20 px-4 py-3">
                                                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={17} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
                                <Cookie className="mb-4 text-cyan-300" size={28} />
                                <h2 className="text-xl font-bold text-white">4. Cookies และ Analytics</h2>
                                <p className="mt-3 text-slate-300 leading-relaxed">
                                    เราใช้คุกกี้ที่จำเป็นสำหรับ session การเข้าสู่ระบบ การตั้งค่าภาษา และความปลอดภัย
                                    รวมถึง analytics/pixel ที่เปิดใช้งานใน production เพื่อวัดการใช้งานและปรับปรุงเว็บไซต์
                                    ผู้ใช้สามารถจัดการคุกกี้บางประเภทได้จากเบราว์เซอร์หรือแบนเนอร์คุกกี้ของเว็บไซต์
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
                                <Lock className="mb-4 text-purple-300" size={28} />
                                <h2 className="text-xl font-bold text-white">5. การเก็บรักษาและการลบข้อมูล</h2>
                                <p className="mt-3 text-slate-300 leading-relaxed">
                                    เราเก็บข้อมูลเท่าที่จำเป็นต่อการให้บริการ ความปลอดภัย การทำบัญชี และการปฏิบัติตามกฎหมาย
                                    ข้อมูลภาพหรือผลวิเคราะห์ที่เกี่ยวกับบริการ AI จะถูกใช้เพื่อประมวลผลบริการนั้นเป็นหลัก
                                    หากต้องการลบข้อมูลหรือบัญชี สามารถติดต่อทีมงานผ่าน LINE Official Account
                                </p>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <Scale className="shrink-0 text-violet-300" size={28} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">6. สิทธิของผู้ใช้ตาม PDPA</h2>
                                    <p className="mt-3 text-slate-300">ผู้ใช้สามารถติดต่อเราเพื่อใช้สิทธิดังต่อไปนี้ตามเงื่อนไขที่กฎหมายกำหนด</p>
                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        {rights.map((item) => (
                                            <div key={item} className="flex gap-2 rounded-lg bg-black/20 px-4 py-3 text-slate-300">
                                                <CheckCircle2 className="mt-0.5 shrink-0 text-violet-300" size={17} />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-amber-300/30 bg-gradient-to-r from-slate-900 to-amber-950/30 p-6 md:p-8 text-center">
                            <h2 className="text-2xl font-bold text-white">ติดต่อเรื่องข้อมูลส่วนบุคคล</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-slate-300 leading-relaxed">
                                หากต้องการขอเข้าถึง แก้ไข ลบข้อมูล ถอนความยินยอม หรือแจ้งข้อกังวลเกี่ยวกับความเป็นส่วนตัว
                                โปรดติดต่อทีมงานผ่าน LINE Official Account เราจะพิจารณาคำขอตามกฎหมายและตอบกลับโดยเร็วที่สุด
                            </p>
                            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href="https://lin.ee/8N4ab3b"
                                    target="_blank"
                                    className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 hover:bg-amber-300 transition-colors"
                                >
                                    ติดต่อผ่าน LINE OA
                                </Link>
                                <Link
                                    href="/terms"
                                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
                                >
                                    อ่านเงื่อนไขการใช้งาน
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
