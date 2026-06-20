import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

const baseUrl = siteUrl.replace(/\/$/, '');

export const metadata: Metadata = {
    title: 'ค้นหาชื่อมงคล 5,000+ ชื่อ | เริ่มเลือกชื่อแล้วนำไปวิเคราะห์คู่เลข | NameMongkol',
    alternates: { canonical: `${baseUrl}/search` },
    description: 'ค้นหาชื่อมงคลสำหรับตั้งชื่อลูกหรือเปลี่ยนชื่อจากฐานชื่อ 5,000+ ชื่อ แล้วนำชื่อที่สนใจไปวิเคราะห์ชื่อ-นามสกุลเพื่อดูผลรวมและคู่เลขแบบละเอียด',
    keywords: ['ค้นหาชื่อมงคล', 'ตั้งชื่อลูก', 'ชื่อมงคลฟรี', 'ชื่อเสริมดวง', 'ชื่อเกรด A', 'ชื่อความหมายดี', 'ชื่อมงคลชาย', 'ชื่อมงคลหญิง', 'ถอดอักษรเป็นเลขศาสตร์', 'วิเคราะห์คู่เลขในชื่อ'],
    openGraph: {
        title: 'ค้นหาชื่อมงคล 5,000+ ชื่อ | NameMongkol',
        description: 'ฐานชื่อเป็นจุดเริ่มต้น เลือกชื่อที่ถูกใจแล้วนำไปวิเคราะห์ชื่อ-นามสกุลเพื่อดูคู่เลขและพลังรายคู่แบบละเอียด',
        url: `${baseUrl}/search`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${baseUrl}/api/og?variant=default&title=ค้นหาชื่อมงคลฟรี&subtitle=เลือกชื่อแล้วนำไปวิเคราะห์คู่เลขแบบละเอียด&tag=Free%20Names`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ค้นหาชื่อมงคล 5,000+ ชื่อ | NameMongkol',
        description: 'เลือกชื่อจากฐานข้อมูล แล้วนำไปเช็กผลรวมและคู่เลขในชื่อ-นามสกุลอย่างละเอียด',
        images: [`${baseUrl}/api/og?variant=default&title=ค้นหาชื่อมงคลฟรี`],
    },
};

export default function SearchPage() {
    const webPageJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${baseUrl}/search#webpage`,
        'url': `${baseUrl}/search`,
        'name': 'ค้นหาชื่อมงคล 5,000+ ชื่อ | เริ่มเลือกชื่อแล้วนำไปวิเคราะห์คู่เลข | NameMongkol',
        'description': 'หน้าเริ่มต้นสำหรับค้นหาชื่อมงคลจากฐานข้อมูล แล้วนำชื่อที่สนใจไปวิเคราะห์ชื่อ-นามสกุลเพื่อดูผลรวมเลขศาสตร์และคู่เลขอย่างละเอียด',
        'inLanguage': 'th-TH',
        'isPartOf': { '@id': `${baseUrl}/#website` },
        'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': ['h1', '#search-next-step', '#search-faq'],
        },
    };

    // Enhanced JSON-LD Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'ค้นหาชื่อมงคลฟรีสำหรับตั้งชื่อลูก - NameMongkol',
        'alternateName': 'NameMongkol Free Auspicious Name Search',
        'description': 'ระบบค้นหาชื่อมงคลฟรีจากฐานข้อมูล 5,000+ ชื่อ ใช้เป็นจุดเริ่มต้นก่อนนำชื่อที่เลือกไปวิเคราะห์ชื่อ-นามสกุลเพื่อดูผลรวมและคู่เลขในชื่อแบบละเอียด',
        'url': `${baseUrl}/search`,
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
            'กรองตามเพศ ชาย/หญิง',
            'กรองตามผลรวมเลขศาสตร์',
            'แสดงวันที่ใช้ได้และห้ามใช้',
            'แสดงความหมายของชื่อ',
            'เป็นจุดเริ่มต้นก่อนนำชื่อไปวิเคราะห์คู่เลขกับนามสกุลในหน้า /name-check'
        ]
    };

    // FAQ Schema
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': 'เลือกชื่อจากหน้า Search แล้วต้องทำอะไรต่อ?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'หน้า Search เป็นจุดเริ่มต้นสำหรับค้นหาชื่อที่ความหมายดีและมีผลรวมเลขศาสตร์น่าสนใจ เมื่อได้ชื่อที่ถูกใจแล้วควรนำไปวิเคราะห์ชื่อ-นามสกุลในหน้า /name-check เพื่อดูคู่เลขในชื่อ คู่เลขในนามสกุล และพลังรายคู่แบบละเอียด'
                }
            },
            {
                '@type': 'Question',
                'name': 'ฐานชื่อมงคลต่างจากการวิเคราะห์ชื่อ-นามสกุลอย่างไร?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ฐานชื่อช่วยคัดตัวเลือกเบื้องต้นจากความหมาย วันเกิด เพศ และผลรวมเลขศาสตร์ แต่การวิเคราะห์ชื่อ-นามสกุลจะละเอียดกว่า เพราะถอดตัวอักษรเป็นค่าเลขศาสตร์และจับเลขที่ติดกันเป็นคู่เพื่ออ่านพลังส่งเสริม จุดที่ควรระวัง และความหมายเชิงลึกของชื่อ'
                }
            },
            {
                '@type': 'Question',
                'name': 'ค้นหาชื่อมงคลที่ NameMongkol เสียเงินไหม?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ฟรี ไม่มีค่าใช้จ่าย คุณสามารถค้นหาและตรวจสอบความหมายของชื่อมงคลกว่า 5,000 ชื่อได้ทันที โดยไม่มีข้อผูกมัดใดๆ'
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

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'หน้าแรก',
                'item': baseUrl,
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'ค้นหาชื่อมงคล ตั้งชื่อลูกชาย-หญิง',
                'item': `${baseUrl}/search`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
            />
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ClientPage />
            <section id="search-next-step" className="w-full bg-[#f8f8fc] px-4 pb-20 pt-10 text-slate-900">
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-950/90 p-6 text-slate-200 shadow-2xl shadow-slate-950/15 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300/80">Next Step</p>
                    <h2 className="mt-3 text-2xl font-bold text-white">ฐานชื่อคือจุดเริ่มต้น ก่อนตรวจคู่เลขแบบละเอียด</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                        หน้า Search ช่วยให้เริ่มจากชื่อที่ความหมายดีและมีผลรวมเลขศาสตร์น่าสนใจ แต่ก่อนใช้จริงควรนำชื่อที่เลือกไปวิเคราะห์ร่วมกับนามสกุล เพราะ NameMongkol จะถอดตัวอักษรเป็นเลขศาสตร์ แล้วจับเลขที่อยู่ติดกันเป็นคู่ เช่น 14, 24, 65 เพื่ออ่านพลังและความหมายเชิงลึกของชื่อ ไม่ใช่ดูเฉพาะผลรวมตัวเลขเท่านั้น
                    </p>
                </div>
            </section>
        </>
    );
}
