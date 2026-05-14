import { Metadata } from 'next';
import Script from 'next/script';
import ClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'เปลี่ยนชื่อมงคล Pro - คัดเลือกชื่อเสริมดวงจากฐานข้อมูลคัดพิเศษ | NameMongkol',
    description: 'บริการคัดเลือกชื่อมงคล Pro สำหรับผู้ต้องการเปลี่ยนชื่อเสริมดวงอย่างจริงจัง กรองชื่อด้วยวรรคเดช วรรคศรี ทักษา เลขศาสตร์ และอักษรกาลกิณี จากฐานข้อมูลกว่า 1,172 ชื่อคัดพิเศษ',
    keywords: ['เปลี่ยนชื่อมงคล', 'เปลี่ยนชื่อเสริมดวง', 'ชื่อมงคลพรีเมียม', 'คัดเลือกชื่อมงคล Pro', 'วรรคเดช', 'วรรคศรี', 'ผลรวมเลขศาสตร์', 'อักษรนำ', 'ชื่อมงคลขั้นสูง', 'ตัวกรองชื่อ', 'ชื่อคัดพิเศษ'],

    openGraph: {
        title: 'เปลี่ยนชื่อมงคล Pro - คัดเลือกชื่อเสริมดวงจากฐานข้อมูลคัดพิเศษ',
        description: 'คัดเลือกชื่อมงคลสำหรับเปลี่ยนชื่อเสริมดวงอย่างจริงจัง กรองด้วยวรรคเดช วรรคศรี ทักษา เลขศาสตร์ จากฐานข้อมูลกว่า 1,172 ชื่อคัดพิเศษ',
        url: `${siteUrl}/premium-search`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=ค้นหาชื่อมงคล%20Pro&subtitle=ฐานข้อมูลชื่อคัดพิเศษ%20เสริมดวง%20100%25&tag=Premium%20Search`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เปลี่ยนชื่อมงคล Pro - คัดเลือกชื่อเสริมดวงจากฐานข้อมูลคัดพิเศษ | NameMongkol',
        description: 'คัดเลือกชื่อมงคลสำหรับเปลี่ยนชื่อเสริมดวงอย่างจริงจัง กรองด้วยวรรคเดช วรรคศรี ทักษา เลขศาสตร์',
        images: [`${siteUrl}/api/og?variant=default&title=ค้นหาชื่อมงคล%20Pro`],
    },
    alternates: {
        canonical: `${siteUrl}/premium-search`,
    },
};

// Enhanced JSON-LD Schema for SEO
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'NameMongkol Premium Search - ค้นหาชื่อมงคล Pro',
    'alternateName': 'ค้นหาชื่อมงคล Pro',
    'description': 'โปรแกรมค้นหาชื่อมงคล Pro คัดเฉพาะชื่อความหมายดี เลขศาสตร์เยี่ยม เหมาะสำหรับตั้งชื่อ/เปลี่ยนชื่อแบบจริงจัง ผ่านการคัดกรอง 3 ชั้น: ทักษา เลขศาสตร์ และความหมาย',
    'applicationCategory': 'LifestyleApplication',
    'operatingSystem': 'Web',
    'url': `${siteUrl}/premium-search`,
    'offers': {
        '@type': 'Offer',
        'price': '15',
        'priceCurrency': 'THB',
        'description': '15 เครดิตต่อการค้นหา 1 ครั้ง'
    },
    'featureList': [
        'ฐานข้อมูลชื่อมงคล 1,172 ชื่อที่คัดสรรแล้ว',
        'ระบบคัดกรองอักษรกาลกิณี 100%',
        'เลือกอักษรนำตามทักษา (วรรคเดช/วรรคศรี)',
        'กรองตามผลรวมเลขศาสตร์ เกรด A+ เท่านั้น',
        'กรองตามวันเกิดและเพศ',
        'ชื่อมีความหมายดี ไพเราะ ทันสมัย'
    ]
};

// FAQ Schema for SEO
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
        {
            '@type': 'Question',
            'name': 'ค้นหาชื่อมงคล Pro ต่างจากค้นหาทั่วไปอย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'ระบบค้นหาชื่อมงคล Pro ใช้ Premium Database ที่ผ่านการคัดกรอง 3 ชั้น: 1) คัดตามหลักทักษา ไม่มีอักษรกาลกิณี 2) คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ 3) ความหมายดี ไพเราะ ทันสมัย และสามารถเลือกอักษรนำวรรคเดช/ศรี ได้'
            }
        },
        {
            '@type': 'Question',
            'name': 'วรรคเดชและวรรคศรีคืออะไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'วรรคเดช คืออักษรนำที่ส่งเสริมเรื่องอำนาจบารมี การเลื่อนขั้นเลื่อนตำแหน่ง เหมาะกับผู้ต้องการความก้าวหน้าในหน้าที่การงาน ส่วนวรรคศรี คืออักษรนำที่ส่งเสริมเรื่องโชคลาภ เสน่ห์ความรัก เหมาะกับผู้ต้องการดึงดูดความโชคดีและเสน่ห์'
            }
        },
        {
            '@type': 'Question',
            'name': 'ค้นหาชื่อมงคล Pro ใช้กี่เครดิต?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'การค้นหาชื่อมงคล Pro ใช้ 15 เครดิตต่อ 1 ครั้ง โดยระบบจะสุ่มแสดงผล 20 รายชื่อจากฐานข้อมูลที่ตรงตามเงื่อนไขที่คุณเลือก'
            }
        }
    ]
};

export default function PremiumSearchPage() {
    return (
        <>
            <Script
                id="premium-search-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Script
                id="premium-search-faq-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <ClientPage />
        </>
    );
}
