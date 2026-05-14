import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { Suspense } from 'react';
import ClientPage from '../../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';
const canonical = `${siteUrl}/wallpapers/intent/love`;

// A/B Testing for CTR in GSC
// Variant A: Short & Direct (Focus on keyword density)
const titleA = 'วอลเปเปอร์มงคลเสริมดวงความรัก โหลดฟรี | NameMongkol';
const descriptionA = 'รวมวอลเปเปอร์มงคลเสริมความรัก เมตตามหานิยม เสน่ห์ และความสัมพันธ์ที่ดี เลือกตามวันเกิดและดาวน์โหลดฟรี';

// Variant B: Long & Benefit-driven (Focus on emotion and CTR triggers)
const titleB = 'แจกฟรี! วอลเปเปอร์มงคลเสริมดวงความรัก เสน่ห์ เมตตามหานิยม';
const descriptionB = 'ดาวน์โหลดวอลเปเปอร์เสริมดวงความรักฟรี ดึงดูดเนื้อคู่ เพิ่มเสน่ห์ เมตตามหานิยม คนรักคนหลง พร้อมเคล็ดลับเลือกสีให้ตรงวันเกิด';

// --- Active Variant (Change here to test) ---
const activeTitle = titleA;
const activeDescription = descriptionA;

export const metadata: Metadata = {
    title: activeTitle,
    description: activeDescription,
    keywords: ['วอลเปเปอร์เสริมดวงความรัก', 'วอลเปเปอร์เสน่ห์', 'วอลเปเปอร์เมตตามหานิยม', 'วอลเปเปอร์ความรัก', 'วอลเปเปอร์มงคลความรัก'],
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
        { '@type': 'ListItem', position: 3, name: 'วอลเปเปอร์เสริมดวงความรัก', item: canonical },
    ],
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'วอลเปเปอร์เสริมความรักเหมาะกับใคร?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'เหมาะกับผู้ที่ต้องการเพิ่มเสน่ห์ สร้างความสัมพันธ์ที่ดีขึ้น หรืออยากเริ่มต้นความรักใหม่ โดยแนะนำให้เลือกภาพที่สื่อถึงความอบอุ่นและเมตตา',
            },
        },
        {
            '@type': 'Question',
            name: 'ควรเลือกสีวอลเปเปอร์ความรักอย่างไร?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'สามารถเลือกโทนชมพู ฟ้า หรือสีที่สอดคล้องกับวันเกิดเพื่อช่วยเพิ่มความมั่นใจและพลังบวกด้านความสัมพันธ์',
            },
        },
    ],
};

export default function LoveWallpapersIntentPage() {
    return (
        <>
            <h1 className="sr-only">วอลเปเปอร์มงคลเสริมดวงความรัก เสน่ห์ เมตตามหานิยม</h1>
            <Script id="wallpapers-intent-love-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <Script id="wallpapers-intent-love-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <Suspense>
                <ClientPage initialCategory="day" initialDay="all" initialTab="collection" />
            </Suspense>

            <section className="w-full bg-[#050b14] text-slate-200 px-4 pb-14">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">วอลเปเปอร์เสริมเสน่ห์และความสัมพันธ์</h2>
                    <p className="text-slate-400 leading-relaxed mb-5">
                        แนะนำเริ่มจากคอลเลกชันวันจันทร์และวันศุกร์ที่เน้นพลังเมตตาและความรัก หรือใช้ร่วมกับบริการวิเคราะห์ชื่อเพื่อเพิ่มความสอดคล้องด้านดวงความรัก
                    </p>
                    <p className="text-slate-400 leading-relaxed mb-5">
                        สำหรับคนที่อยากกำหนด mood ภาพให้ตรงกับสถานะความสัมพันธ์ของตัวเอง ลอง{' '}
                        <Link
                            href="/wallpapers/custom"
                            className="font-medium text-amber-300 hover:text-amber-200 underline decoration-amber-400/50 underline-offset-2"
                        >
                            สร้างวอลเปเปอร์สายความรักแบบส่วนตัว
                        </Link>{' '}
                        เพื่อปรับโทน สี และสัญลักษณ์ให้เข้ากับเป้าหมายหัวใจของคุณ
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/wallpapers/day/monday" className="text-xs bg-slate-700/50 hover:bg-yellow-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วันจันทร์ เมตตามหานิยม</Link>
                        <Link href="/wallpapers/day/friday" className="text-xs bg-slate-700/50 hover:bg-cyan-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วันศุกร์ เสริมความรัก</Link>
                        <Link href="/premium-analysis" className="text-xs bg-slate-700/50 hover:bg-purple-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">วิเคราะห์ชื่อ Premium (เจาะลึกดวง)</Link>
                        <Link href="/wallpapers/custom" className="text-xs bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-full text-amber-300 hover:text-amber-200 transition-colors">✨ ออกแบบภาพรักเฉพาะคุณ</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
