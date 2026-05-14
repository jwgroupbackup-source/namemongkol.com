import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { Suspense } from 'react';
import ClientPage from '../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'วอลเปเปอร์มงคลตามราศี เสริมดวงชะตา | NameMongkol',
    description: 'รวมวอลเปเปอร์มงคลเสริมดวงตาม 12 ราศี เมษ พฤษภ เมถุน กรกฎ สิงห์ กันย์ ตุลย์ พิจิก ธนู มังกร กุมภ์ มีน ดาวน์โหลดฟรี',
    keywords: ['วอลเปเปอร์ราศี', 'วอลเปเปอร์มงคลราศี', 'เสริมดวงตามราศี', 'NameMongkol'],
    openGraph: {
        title: 'วอลเปเปอร์มงคลตามราศี | NameMongkol',
        description: 'รวมวอลเปเปอร์มงคลเสริมดวงครบทั้ง 12 ราศี',
        url: `${siteUrl}/wallpapers/zodiac`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วอลเปเปอร์มงคลตามราศี | NameMongkol',
        description: 'รวมวอลเปเปอร์มงคลเสริมดวงครบทั้ง 12 ราศี',
        images: [`${siteUrl}/api/og?variant=default&title=วอลเปเปอร์ตามราศี&subtitle=เสริมดวงครบ%2012%20ราศี&tag=Wallpapers`],
    },
    alternates: {
        canonical: `${siteUrl}/wallpapers/zodiac`,
    },
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
        { '@type': 'ListItem', position: 3, name: 'วอลเปเปอร์ตามราศี', item: `${siteUrl}/wallpapers/zodiac` },
    ],
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'วอลเปเปอร์มงคลตามราศีต่างจากตามวันเกิดอย่างไร?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'วอลเปเปอร์ตามราศีจะอิงพลังดาวและคาแรกเตอร์ของราศี ขณะที่วอลเปเปอร์ตามวันเกิดจะอิงสีและพลังของวันเกิด ทั้งสองแนวทางใช้เสริมดวงร่วมกันได้',
            },
        },
        {
            '@type': 'Question',
            name: 'ควรเลือกราศีแบบ Tropical หรือแบบไทย?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'ในหน้านี้ใช้ช่วงวันที่ราศียอดนิยมสำหรับผู้ใช้งานไทย หากต้องการความแม่นยำเฉพาะบุคคล ควรตรวจข้อมูลวันเดือนปีเกิดร่วมกับบริการวิเคราะห์เชิงลึก',
            },
        },
    ],
};

export default function ZodiacIndexPage() {
    return (
        <>
            <h1 className="sr-only">วอลเปเปอร์มงคลตามราศี ฟรี เสริมดวงครบ 12 ราศี</h1>
            <Script
                id="wallpapers-zodiac-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Script
                id="wallpapers-zodiac-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Suspense>
                <ClientPage initialCategory="zodiac" initialTab="collection" />
            </Suspense>
            <section className="w-full bg-[#050b14] text-slate-200 px-4 pb-12">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">รวมวอลเปเปอร์มงคลตามราศีทั้ง 12 ราศี</h2>
                    <p className="text-slate-400 leading-relaxed mb-4">
                        เลือกราศีของคุณเพื่อดูวอลเปเปอร์มงคลที่ออกแบบตามธีมและพลังของแต่ละราศี พร้อมดาวน์โหลดและใช้งานได้ทันทีบนมือถือ
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        หากต้องการภาพที่ปรับตามเป้าหมายส่วนตัวมากขึ้น สามารถไปที่{' '}
                        <Link
                            href="/wallpapers/custom"
                            className="font-medium text-amber-300 hover:text-amber-200 underline decoration-amber-400/50 underline-offset-2"
                        >
                            เครื่องมือสร้างวอลเปเปอร์เฉพาะบุคคล
                        </Link>{' '}
                        เพื่อกำหนดธีม สี และคอนเซ็ปต์ให้ตรงเจตนาของคุณ
                    </p>
                </div>
            </section>
        </>
    );
}
