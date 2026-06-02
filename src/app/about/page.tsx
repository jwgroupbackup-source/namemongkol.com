import AboutSection from '@/components/AboutSection';
import { Metadata } from 'next';
import Script from 'next/script';
import { siteUrl } from '@/lib/seo';

const aboutUrl = `${siteUrl}/about`;

export const metadata: Metadata = {
    title: {
        absolute: 'เกี่ยวกับ NameMongkol | วิเคราะห์ชื่อ เบอร์ ลายมือ และพลังมงคล',
    },
    description: 'รู้จัก NameMongkol แพลตฟอร์มวิเคราะห์ชื่อมงคล เบอร์โทร ลายมือ ออร่า วอลเปเปอร์ และบทความ ด้วยหลักเลขศาสตร์ ทักษา อายตนะ 6 และ AI',
    keywords: [
        'เกี่ยวกับ NameMongkol',
        'วิเคราะห์ชื่อมงคล',
        'ตั้งชื่อมงคล',
        'วิเคราะห์เบอร์มงคล',
        'วิเคราะห์ลายมือ',
        'วิเคราะห์ออร่า',
        'วอลเปเปอร์มงคล',
        'เลขศาสตร์',
        'ทักษาปกรณ์',
        'อายตนะ 6',
    ],
    alternates: { canonical: aboutUrl },
    openGraph: {
        title: 'เกี่ยวกับ NameMongkol | วิเคราะห์ชื่อ เบอร์ ลายมือ และพลังมงคล',
        description: 'แพลตฟอร์มวิเคราะห์ชื่อมงคลและพลังตัวเลขที่ผสานหลักศาสตร์ไทยกับระบบ AI พร้อมเครื่องมือ บทความ รีวิว และนโยบายความเป็นส่วนตัวที่โปร่งใส',
        url: aboutUrl,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [
            {
                url: `${siteUrl}/api/og?variant=about`,
                width: 1200,
                height: 630,
                alt: 'เกี่ยวกับ NameMongkol แพลตฟอร์มวิเคราะห์ชื่อมงคล',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เกี่ยวกับ NameMongkol | วิเคราะห์ชื่อ เบอร์ ลายมือ และพลังมงคล',
        description: 'รู้จักแนวทางวิเคราะห์ของ NameMongkol ทั้งชื่อ เบอร์ ลายมือ ออร่า วอลเปเปอร์ บทความ และรีวิว',
        images: [`${siteUrl}/api/og?variant=about`],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'NameMongkol',
            alternateName: 'เนมมงคล',
            url: siteUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/icon-512.png`,
                width: 512,
                height: 512,
            },
            description: 'แพลตฟอร์มวิเคราะห์ชื่อมงคล เบอร์โทร ลายมือ ออร่า วอลเปเปอร์ และบทความความรู้ด้านชื่อมงคล',
            foundingDate: '2024',
            areaServed: {
                '@type': 'Country',
                name: 'Thailand',
            },
            sameAs: [
                'https://www.facebook.com/namemongkol',
                'https://line.me/ti/p/@namemongkol',
            ],
            knowsAbout: [
                'เลขศาสตร์',
                'ทักษาปกรณ์',
                'อายตนะ 6',
                'การตั้งชื่อมงคล',
                'การวิเคราะห์ชื่อ',
                'การวิเคราะห์เบอร์โทรศัพท์',
                'การวิเคราะห์ลายมือ',
                'การวิเคราะห์ออร่า',
                'วอลเปเปอร์มงคล',
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                availableLanguage: ['Thai'],
            },
        },
        {
            '@type': 'AboutPage',
            '@id': aboutUrl,
            url: aboutUrl,
            name: 'เกี่ยวกับ NameMongkol',
            description: 'ข้อมูลเกี่ยวกับ NameMongkol วิธีวิเคราะห์ บริการ และมาตรฐานความเป็นส่วนตัวของแพลตฟอร์ม',
            inLanguage: 'th-TH',
            isPartOf: {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                name: 'NameMongkol',
                url: siteUrl,
            },
            about: {
                '@id': `${siteUrl}/#organization`,
            },
            mainEntity: {
                '@id': `${siteUrl}/#organization`,
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
                        name: 'เกี่ยวกับเรา',
                        item: aboutUrl,
                    },
                ],
            },
            dateModified: '2026-06-02',
            publisher: {
                '@id': `${siteUrl}/#organization`,
            },
        },
    ],
};

export default function AboutPage() {
    return (
        <main className="bg-slate-950 min-h-screen pb-28">
            <Script
                id="about-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutSection />
        </main>
    );
}
