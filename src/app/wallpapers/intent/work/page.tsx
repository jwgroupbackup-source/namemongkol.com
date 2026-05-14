import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { Suspense } from 'react';
import ClientPage from '../../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';
const canonical = `${siteUrl}/wallpapers/intent/work`;

// A/B Testing for CTR in GSC
// Variant A: Short & Direct (Focus on keyword density)
const titleA = 'วอลเปเปอร์มงคลเสริมดวงการงาน โหลดฟรี | NameMongkol';
const descriptionA = 'รวมวอลเปเปอร์มงคลเสริมดวงการงาน บารมี เลื่อนตำแหน่ง และความก้าวหน้า เลือกตามวันเกิด ดาวน์โหลดฟรี';

// Variant B: Long & Benefit-driven (Focus on emotion and CTR triggers)
const titleB = 'แจกฟรี! วอลเปเปอร์มงคลเสริมดวงการงาน บารมี เลื่อนตำแหน่ง';
const descriptionB = 'ดาวน์โหลดวอลเปเปอร์เสริมดวงการงานฟรี คัดเฉพาะภาพเสริมบารมี ผู้ใหญ่อุปถัมภ์ เลื่อนขั้น เลื่อนตำแหน่ง การงานก้าวหน้า';

// --- Active Variant (Change here to test) ---
const activeTitle = titleA;
const activeDescription = descriptionA;

export const metadata: Metadata = {
    title: activeTitle,
    description: activeDescription,
    keywords: ['วอลเปเปอร์เสริมดวงการงาน', 'วอลเปเปอร์เลื่อนตำแหน่ง', 'วอลเปเปอร์เสริมบารมี', 'วอลเปเปอร์มงคลการงาน', 'วอลเปเปอร์ความก้าวหน้า'],
    alternates: { canonical },
    openGraph: {
        title: activeTitle,
        description: activeDescription,
        url: canonical,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
    },
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
        { '@type': 'ListItem', position: 3, name: 'วอลเปเปอร์เสริมดวงการงาน', item: canonical },
    ],
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'วอลเปเปอร์เสริมดวงการงานเน้นเรื่องอะไร?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'เน้นพลังด้านความมั่นใจ การตัดสินใจ และความน่าเชื่อถือ เหมาะกับผู้ต้องการเติบโตในตำแหน่งงานหรือเพิ่มโอกาสทางธุรกิจ',
            },
        },
        {
            '@type': 'Question',
            name: 'ใช้วอลเปเปอร์การงานร่วมกับอะไรได้บ้าง?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'สามารถใช้ร่วมกับการวางแผนงานรายสัปดาห์ การตั้งเป้าหมาย KPI และการวิเคราะห์ชื่อเพื่อปรับพลังภาพรวมด้านงานให้ชัดเจนยิ่งขึ้น',
            },
        },
    ],
};

export default function WorkWallpapersIntentPage() {
    return (
        <>
            <h1 className="sr-only">วอลเปเปอร์มงคลเสริมดวงการงาน บารมี และความก้าวหน้า</h1>
            <Script id="wallpapers-intent-work-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <Script id="wallpapers-intent-work-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <Suspense>
                <ClientPage initialCategory="day" initialDay="all" initialTab="collection" />
            </Suspense>

            <section className="w-full bg-[#050b14] text-slate-200 px-4 pb-14">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">วอลเปเปอร์แนะนำสำหรับเสริมการงาน</h2>
                    <p className="text-slate-400 leading-relaxed mb-5">
                        เริ่มจากคอลเลกชันที่เด่นเรื่องบารมีและความก้าวหน้า เช่น วันอาทิตย์ วันอังคาร และวันพฤหัสบดี เพื่อช่วยย้ำเป้าหมายด้านการเติบโตในอาชีพ
                    </p>
                    <p className="text-slate-400 leading-relaxed mb-5">
                        ถ้าต้องการความแม่นยำเพิ่มขึ้นในบริบทงานของคุณ สามารถ{' '}
                        <Link
                            href="/wallpapers/custom"
                            className="font-medium text-emerald-300 hover:text-emerald-200 underline decoration-emerald-400/50 underline-offset-2"
                        >
                            สร้างวอลเปเปอร์เสริมการงานแบบกำหนดเอง
                        </Link>{' '}
                        เพื่อเลือกธีมบารมีและพลังการตัดสินใจที่เหมาะกับบทบาทปัจจุบัน
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/wallpapers/day/sunday" className="text-xs bg-slate-700/50 hover:bg-red-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วันอาทิตย์ เสริมบารมีผู้นำ</Link>
                        <Link href="/wallpapers/day/tuesday" className="text-xs bg-slate-700/50 hover:bg-pink-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วันอังคาร เสริมความกล้าตัดสินใจ</Link>
                        <Link href="/wallpapers/day/thursday" className="text-xs bg-slate-700/50 hover:bg-orange-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วันพฤหัสบดี เสริมปัญญาและผู้ใหญ่อุปถัมภ์</Link>
                        <Link href="/wallpapers/custom" className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-300 hover:text-emerald-200 transition-colors">✨ ตั้งค่าภาพงานเฉพาะเป้าหมาย</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
