import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { Suspense } from 'react';
import ClientPage from '../../ClientPage';
import { siteUrl } from '@/lib/seo';
const canonical = `${siteUrl}/wallpapers/intent/finance`;

// A/B Testing for CTR in GSC
// Variant A: Short & Direct (Focus on keyword density)
const titleA = 'วอลเปเปอร์มงคลเสริมดวงการเงิน โหลดฟรี | NameMongkol';
const descriptionA = 'รวมวอลเปเปอร์มงคลเสริมดวงการเงิน เรียกทรัพย์ โชคลาภ ค้าขาย พร้อมดีไซน์ตามวันเกิดและเลขมงคล ดาวน์โหลดฟรี';

// Variant B: Long & Benefit-driven (Focus on emotion and CTR triggers)
const titleB = 'แจกฟรี! วอลเปเปอร์มงคลเสริมดวงการเงิน เรียกทรัพย์ โชคลาภ';
const descriptionB = 'ดาวน์โหลดวอลเปเปอร์เสริมดวงการเงินฟรี คัดเฉพาะภาพมงคลเรียกทรัพย์ เสริมโชคลาภ ค้าขายดี ปลดหนี้ พร้อมเคล็ดลับตั้งหน้าจอให้ปัง';

// --- Active Variant (Change here to test) ---
const activeVariant = process.env.NEXT_PUBLIC_WALLPAPER_INTENT_META_VARIANT === 'B' ? 'B' : 'A';
const activeTitle = activeVariant === 'B' ? titleB : titleA;
const activeDescription = activeVariant === 'B' ? descriptionB : descriptionA;

export const metadata: Metadata = {
    title: activeTitle,
    description: activeDescription,
    keywords: ['วอลเปเปอร์เสริมดวงการเงิน', 'วอลเปเปอร์เรียกทรัพย์', 'วอลเปเปอร์โชคลาภ', 'วอลเปเปอร์ค้าขาย', 'วอลเปเปอร์มงคลการเงิน'],
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
        { '@type': 'ListItem', position: 3, name: 'วอลเปเปอร์เสริมดวงการเงิน', item: canonical },
    ],
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'วอลเปเปอร์เสริมดวงการเงินควรเลือกแบบไหน?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'ควรเลือกภาพที่มีสัญลักษณ์เรียกทรัพย์ เช่น เลขมงคลหรือองค์เทพด้านการเงิน และเลือกโทนสีที่สอดคล้องกับวันเกิดเพื่อให้ใช้งานได้ต่อเนื่องในชีวิตประจำวัน',
            },
        },
        {
            '@type': 'Question',
            name: 'ตั้งวอลเปเปอร์การเงินแล้วต้องทำอะไรต่อ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'ใช้วอลเปเปอร์ควบคู่กับการตั้งเป้าหมายการเงินให้ชัดเจน เช่น เก็บเงิน ลดหนี้ หรือเพิ่มยอดขาย เพื่อให้ภาพมงคลช่วยย้ำพฤติกรรมเชิงบวกได้ดีขึ้น',
            },
        },
    ],
};

export default function FinanceWallpapersIntentPage() {
    return (
        <>
            <h1 className="sr-only">วอลเปเปอร์มงคลเสริมดวงการเงิน เรียกทรัพย์ โชคลาภ</h1>
            <Script id="wallpapers-intent-finance-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <Script id="wallpapers-intent-finance-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <Suspense>
                <ClientPage initialCategory="day" initialDay="all" initialTab="collection" />
            </Suspense>

            <section className="w-full bg-[#050b14] text-slate-200 px-4 pb-14">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">วอลเปเปอร์เรียกทรัพย์ที่แนะนำ</h2>
                    <p className="text-slate-400 leading-relaxed mb-5">
                        เน้นคอลเลกชันที่เกี่ยวข้องกับการเงิน เช่น วันพุธกลางวัน, วันศุกร์ และชุดท้าวเวสสุวรรณ เพื่อช่วยย้ำเป้าหมายด้านรายรับและโชคลาภ
                    </p>
                    <p className="text-slate-400 leading-relaxed mb-5">
                        ถ้าต้องการภาพที่เน้นเป้าการเงินแบบเฉพาะตัวมากขึ้น ลอง{' '}
                        <Link
                            href="/wallpapers/custom"
                            className="font-medium text-cyan-300 hover:text-cyan-200 underline decoration-cyan-400/50 underline-offset-2"
                        >
                            สร้างพื้นหลังมงคลตามเป้าหมายของคุณ
                        </Link>{' '}
                        แล้วกำหนดธีมเรียกทรัพย์ที่ตรงกับแผนของคุณ
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/wallpapers/day/wednesday" className="text-xs bg-slate-700/50 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วันพุธ(กลางวัน) เรียกทรัพย์</Link>
                        <Link href="/wallpapers/day/friday" className="text-xs bg-slate-700/50 hover:bg-cyan-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วันศุกร์ เสริมโชคลาภ</Link>
                        <Link href="/wallpapers/day/saturday" className="text-xs bg-slate-700/50 hover:bg-purple-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วันเสาร์ เสริมบารมีการเงิน</Link>
                        <Link href="/wallpapers/custom" className="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-3 py-1.5 rounded-full text-cyan-300 hover:text-cyan-200 transition-colors">✨ Custom การเงินเฉพาะบุคคล</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
