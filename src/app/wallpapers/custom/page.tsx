import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import CustomWallpaperSeoContent from '@/components/CustomWallpaperSeoContent';
import ClientPage from '../ClientPage';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'สร้างวอลเปเปอร์มงคลแบบส่วนตัว | NameMongkol',
    description: 'สร้างวอลเปเปอร์มงคลส่วนตัวด้วย AI ปรับตามชื่อ วันเกิด และเป้าหมายชีวิต เหมาะสำหรับเสริมการเงิน การงาน ความรัก และพลังใจ',
    keywords: [
        'สร้างวอลเปเปอร์มงคล',
        'วอลเปเปอร์มงคลส่วนตัว',
        'วอลเปเปอร์เสริมดวงส่วนตัว AI',
        'ออกแบบพื้นหลังมงคล',
        'NameMongkol',
    ],
    openGraph: {
        title: 'สร้างวอลเปเปอร์มงคลแบบส่วนตัว | NameMongkol',
        description: 'สร้างวอลเปเปอร์เสริมดวงส่วนตัวด้วย AI เพื่อโฟกัสการเงิน การงาน ความรัก และเป้าหมายเฉพาะของคุณ',
        url: `${siteUrl}/wallpapers/custom`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=สร้างวอลเปเปอร์มงคล&subtitle=ออกแบบส่วนตัวด้วย%20AI&tag=Custom%20Wallpaper`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'สร้างวอลเปเปอร์มงคลแบบส่วนตัว | NameMongkol',
        description: 'สร้างภาพวอลเปเปอร์มงคลจากชื่อและเป้าหมายของคุณ พร้อมใช้งานทันทีบนมือถือ',
        images: [`${siteUrl}/api/og?variant=default&title=สร้างวอลเปเปอร์มงคล&subtitle=ออกแบบส่วนตัวด้วย%20AI&tag=Custom%20Wallpaper`],
    },
    alternates: {
        canonical: `${siteUrl}/wallpapers/custom`,
    },
};

const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/wallpapers/custom`,
    url: `${siteUrl}/wallpapers/custom`,
    name: 'สร้างวอลเปเปอร์มงคลแบบส่วนตัว | NameMongkol',
    description:
        'เครื่องมือสร้างวอลเปเปอร์มงคลส่วนตัวด้วย AI ปรับตามชื่อ วันเกิด และเป้าหมายชีวิต เพื่อใช้งานจริงบนมือถือทุกวัน',
    inLanguage: 'th-TH',
    isPartOf: {
        '@type': 'WebSite',
        name: 'NameMongkol',
        url: siteUrl,
    },
};

const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีสร้างวอลเปเปอร์มงคลส่วนตัว',
    description: 'ขั้นตอนสร้างวอลเปเปอร์มงคลส่วนตัวด้วย NameMongkol',
    step: [
        {
            '@type': 'HowToStep',
            name: 'กรอกข้อมูลพื้นฐาน',
            text: 'ระบุชื่อหรือข้อมูลที่ต้องการให้ระบบใช้เป็นแนวทางสร้างภาพ',
        },
        {
            '@type': 'HowToStep',
            name: 'เลือกเป้าหมายและสไตล์ภาพ',
            text: 'เลือกธีมหลัก เช่น การเงิน การงาน หรือความรัก พร้อมโทนสีที่ชอบ',
        },
        {
            '@type': 'HowToStep',
            name: 'สร้างและดาวน์โหลด',
            text: 'กดสร้างภาพและดาวน์โหลดเพื่อนำไปตั้งเป็นวอลเปเปอร์มือถือ',
        },
    ],
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'สร้างวอลเปเปอร์มงคลต้องเริ่มจากอะไร?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'เริ่มจากกำหนดเป้าหมายที่ต้องการเสริม เช่น การเงินหรือการงาน แล้วเลือกโทนภาพและสีมงคลที่เหมาะกับคุณ ระบบจะช่วยสร้างภาพให้ทันที.',
            },
        },
        {
            '@type': 'Question',
            name: 'วอลเปเปอร์มงคลส่วนตัวต่างจากวอลเปเปอร์ทั่วไปอย่างไร?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'วอลเปเปอร์มงคลส่วนตัวจะปรับจากข้อมูลและเจตนาของผู้ใช้ เช่น ชื่อ วันเกิด หรือเป้าหมายชีวิต ทำให้ความหมายของภาพตรงตัวผู้ใช้มากขึ้น.',
            },
        },
        {
            '@type': 'Question',
            name: 'ใช้งานได้ฟรีหรือไม่?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'มีตัวเลือกให้ใช้งานได้ฟรี และมีฟีเจอร์เพิ่มเติมตามแพ็กเกจสำหรับผู้ใช้ที่ต้องการความละเอียดมากขึ้น.',
            },
        },
    ],
};

const softwareApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NameMongkol Custom Wallpaper Generator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    url: `${siteUrl}/wallpapers/custom`,
    description:
        'เครื่องมือสร้างวอลเปเปอร์มงคลส่วนตัวด้วย AI สำหรับผู้ใช้ที่ต้องการปรับภาพตามชื่อ วันเกิด และเป้าหมายชีวิต',
    inLanguage: 'th-TH',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'THB',
    },
    publisher: {
        '@type': 'Organization',
        name: 'NameMongkol',
        url: siteUrl,
    },
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
        { '@type': 'ListItem', position: 3, name: 'สร้างวอลเปเปอร์ส่วนตัว', item: `${siteUrl}/wallpapers/custom` },
    ],
};

export default function CustomWallpaperPage() {
    return (
        <>
            <Script
                id="wallpapers-custom-webpage"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
            />
            <Script
                id="wallpapers-custom-howto"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
            />
            <Script
                id="wallpapers-custom-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Script
                id="wallpapers-custom-software"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
            />
            <Script
                id="wallpapers-custom-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Suspense>
                <ClientPage initialTab="custom" />
            </Suspense>
            <CustomWallpaperSeoContent />
        </>
    );
}
