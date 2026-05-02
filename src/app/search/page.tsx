import { Metadata } from 'next';
import ClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'ตั้งชื่อมงคล 2569 ฟรี! รวม 5,000+ ชื่อเกรด A+ ชาย-หญิง | NameMongkol',
    alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/search` },
    description: 'ตั้งชื่อมงคล 2569 ฟรี! ค้นหาชื่อมงคลกว่า 5,000 ชื่อ คัดเกรด A+ ชาย-หญิง ความหมายดี หลีกเลี่ยงกาลกิณี กรองตามวันเกิด เพศ ผลรวมเลขศาสตร์ เหมาะสำหรับตั้งชื่อลูกและเปลี่ยนชื่อเสริมดวง',
    keywords: ['ตั้งชื่อมงคล', 'ตั้งชื่อลูก', 'ตั้งชื่อลูกชาย', 'ตั้งชื่อลูกสาว', 'ค้นหาชื่อมงคล', 'ชื่อมงคลฟรี', 'เปลี่ยนชื่อ', 'ชื่อเสริมดวง', 'ชื่อเกรด A', 'ชื่อความหมายดี', 'ชื่อตามวันเกิด', 'ผลรวมเลขศาสตร์', 'อักษรกาลกิณี', 'ชื่อลูกผู้ชาย', 'ชื่อลูกผู้หญิง', 'ชื่อมงคล 2569', 'รวมชื่อมงคล'],

    openGraph: {
        title: 'ตั้งชื่อมงคล 2569 ฟรี! รวม 5,000+ ชื่อเกรด A+ | NameMongkol',
        description: 'ตั้งชื่อมงคล 2569 ฟรี! ค้นหาชื่อเกรด A+ ชาย-หญิง ความหมายดี กรองตามวันเกิด หลีกเลี่ยงกาลกิณี',
        url: `${siteUrl}/search`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=ค้นหาชื่อมงคลฟรี&subtitle=ตั้งชื่อลูก%20เปลี่ยนชื่อใหม่%20เสริมดวง&tag=Free%20Names`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ตั้งชื่อมงคล 2569 ฟรี! รวม 5,000+ ชื่อเกรด A+ | NameMongkol',
        description: 'ตั้งชื่อมงคล 2569 ฟรี! ค้นหาชื่อเกรด A+ กว่า 5,000 ชื่อ ชาย-หญิง ครบทุกวันเกิด',
        images: [`${siteUrl}/api/og?variant=default&title=ค้นหาชื่อมงคลฟรี`],
    },
};

export default function SearchPage() {
    // Enhanced JSON-LD Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'ตั้งชื่อมงคล ฟรี - NameMongkol',
        'alternateName': 'NameMongkol Free Auspicious Name Search',
        'description': 'ระบบค้นหาชื่อมงคลฟรี รวมกว่า 5,000 ชื่อเกรด A+ คัดสรรแล้ว กรองตามวันเกิด เพศ ผลรวมเลขศาสตร์ เหมาะสำหรับตั้งชื่อลูกและเปลี่ยนชื่อใหม่',
        'url': `${siteUrl}/search`,
        'applicationCategory': 'LifestyleApplication',
        'operatingSystem': 'Web',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'THB',
            'description': 'ค้นหาชื่อมงคลฟรี ไม่มีค่าใช้จ่าย'
        },
        'featureList': [
            'ฐานข้อมูลชื่อมงคลกว่า 5,000 ชื่อ',
            'กรองตามวันเกิด',
            'กรองตามเพศ (ชาย/หญิง)',
            'กรองตามผลรวมเลขศาสตร์',
            'แสดงวันที่ใช้ได้และห้ามใช้',
            'ความหมายครบถ้วน'
        ],
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.8',
            'ratingCount': '512',
            'bestRating': '5'
        }
    };

    // FAQ Schema
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': 'ค้นหาชื่อมงคลที่ NameMongkol เสียเงินไหม?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ฟรี! ไม่มีค่าใช้จ่าย คุณสามารถค้นหาและตรวจสอบความหมายของชื่อมงคลกว่า 5,000 ชื่อได้ฟรีทันที โดยไม่มีข้อผูกมัดใดๆ'
                }
            },
            {
                '@type': 'Question',
                'name': 'มีรายชื่อมงคลให้เลือกกี่ชื่อ?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'เรามีฐานข้อมูลชื่อมงคลที่คัดสรรมาแล้วกว่า 5,000 รายชื่อ ครอบคลุมทุกวันเกิด ทั้งชายและหญิง พร้อมความหมายที่เป็นสิริมงคล'
                }
            },
            {
                '@type': 'Question',
                'name': 'ชื่อมงคลในระบบเชื่อถือได้แค่ไหน?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'รายชื่อทั้งหมดถูกคัดกรองตามหลักเลขศาสตร์และทักษาปกรณ์ โดยเน้นชื่อที่มีความหมายดีและไม่มีอักษรกาลกิณีพื้นฐาน'
                }
            },
            {
                '@type': 'Question',
                'name': 'เลือกชื่อจากที่นี่แล้วต้องทำอย่างไรต่อ?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'เมื่อได้ชื่อที่ถูกใจแล้ว แนะนำให้นำไปวิเคราะห์ชื่อ-นามสกุลอีกครั้ง เพื่อดูผลรวมร่วมกับนามสกุลของคุณว่าได้เกรด A+ หรือไม่'
                }
            },
            {
                '@type': 'Question',
                'name': 'ค้นหาชื่อมงคลฟรีต่างจากค้นหาชื่อมงคล Pro อย่างไร?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ค้นหาชื่อมงคลฟรีให้บริการฟรีจากฐานข้อมูล 5,000+ ชื่อ ส่วนค้นหาชื่อมงคล Pro ใช้ Premium Database ที่ผ่านการคัดกรอง 3 ชั้น สามารถเลือกอักษรนำวรรคเดช/ศรี และผลรวมเลขศาสตร์เกรด A+ เท่านั้น'
                }
            }
        ]
    };

    // ItemList Schema for better search visibility
    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'รายชื่อมงคลยอดนิยม',
        'description': 'รวมชื่อมงคลยอดนิยมที่คัดสรรแล้วสำหรับตั้งชื่อลูกและเปลี่ยนชื่อใหม่',
        'numberOfItems': 5000,
        'itemListOrder': 'https://schema.org/ItemListOrderAscending'
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <ClientPage />
        </>
    );
}
