import { Metadata } from 'next';
import Script from 'next/script';
import ClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';


export const metadata: Metadata = {
    title: 'เช็คชื่อมงคลหลายชื่อพร้อมกัน 2569 | Bulk Name Analysis | NameMongkol',
    alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/name-analysis` },
    description: 'เครื่องมือเช็คชื่อมงคลแบบกลุ่ม (Bulk Analysis) วิเคราะห์สูงสุด 1,000 ชื่อพร้อมกัน จัดเกรด A+ ตรวจคู่เลข กาลกิณี ส่งออก CSV/PDF เหมาะตั้งชื่อลูก เปลี่ยนชื่อ HR',
    keywords: 'เช็คชื่อมงคลหลายชื่อ, เปรียบเทียบชื่อมงคล, จัดเกรดชื่อ A+, คู่เลขชื่อมงคล, กาลกิณีชื่อ, วิเคราะห์ชื่อหลายชื่อ, คัดกรองชื่อมงคล, Bulk Name Analysis, Export วิเคราะห์ชื่อ PDF, วิเคราะห์ชื่อพนักงาน HR, ผลรวมเลขศาสตร์ชื่อ',

    openGraph: {
        title: 'เช็คชื่อมงคลหลายชื่อพร้อมกัน 2569 | Bulk Analysis',
        description: 'วิเคราะห์ชื่อสูงสุด 1,000 ชื่อพร้อมกัน จัดเกรด A+ ตรวจคู่เลข กาลกิณี ส่งออก CSV/PDF',
        url: `${siteUrl}/name-analysis`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=Bulk%20Name%20Analysis&subtitle=วิเคราะห์ชื่อหลายรายการพร้อมกัน%20จัดเกรดอัตโนมัติ&tag=Bulk%20Analysis`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เช็คชื่อมงคลหลายชื่อพร้อมกัน 2569 | Bulk Analysis',
        description: 'วิเคราะห์ชื่อสูงสุด 1,000 ชื่อพร้อมกัน จัดเกรด A+ ตรวจคู่เลข กาลกิณี ส่งออก CSV/PDF',
        images: [`${siteUrl}/api/og?variant=default&title=Bulk%20Name%20Analysis`],
    },
};

// JSON-LD Schemas for SEO
const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'NameMongkol Bulk Name Analysis',
    'description': 'ระบบวิเคราะห์ชื่อมงคลแบบกลุ่ม (Bulk Analysis) ตรวจสอบหลายชื่อพร้อมกันสูงสุด 1,000 ชื่อ พร้อมจัดเกรดอัตโนมัติ',
    'url': `${siteUrl}/name-analysis`,
    'applicationCategory': 'LifestyleApplication',
    'operatingSystem': 'Web Browser',
    'offers': {
        '@type': 'Offer',
        'price': '5',
        'priceCurrency': 'THB',
        'priceValidUntil': '2026-12-31',
        'description': 'เริ่มต้น 5 เครดิต สำหรับ 1-10 ชื่อ',
    },
    'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '1280',
        'bestRating': '5',
        'worstRating': '1',
    },
    'featureList': [
        'วิเคราะห์ชื่อพร้อมกันสูงสุด 1,000 ชื่อ',
        'จัดเกรดความมงคลอัตโนมัติ (A+, A, B, C)',
        'คำนวณผลรวมเลขศาสตร์แต่ละชื่อ',
        'วิเคราะห์คู่ตัวเลขมงคล (🟢🟠🔴)',
        'ตรวจสอบวันที่ใช้ได้ (มงคล/กาลกิณี)',
        'Export ผลลัพธ์เป็น CSV และ PDF',
        'บันทึกประวัติการวิเคราะห์',
    ],
    'screenshot': `${siteUrl}/api/og?variant=default&title=Bulk%20Name%20Analysis`,
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
        {
            '@type': 'Question',
            'name': 'Bulk Analysis วิเคราะห์ได้กี่ชื่อพร้อมกัน?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'ระบบ Bulk Analysis รองรับการวิเคราะห์ได้สูงสุด 1,000 ชื่อต่อครั้ง โดยแบ่งเป็น 3 ระดับ: Entry (1-10 ชื่อ = 5 เครดิต), Standard (11-100 ชื่อ = 30 เครดิต), Power User (101-1,000 ชื่อ = 100 เครดิต)',
            },
        },
        {
            '@type': 'Question',
            'name': 'เกรด A+ หมายความว่าอย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'เกรด A+ หมายถึงชื่อที่มีผลรวมเลขศาสตร์เป็นมงคลสูงสุด มีคู่ตัวเลขที่ดี (🟢) และใช้ได้กับหลายวันเกิด ถือเป็นชื่อที่แนะนำอย่างยิ่ง',
            },
        },
        {
            '@type': 'Question',
            'name': 'คู่ตัวเลข 🟢🟠🔴 หมายความว่าอย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': '🟢 (สีเขียว) = คู่ตัวเลขมงคล ส่งเสริมโชคลาภและบารมี, 🟠 (สีส้ม) = ปานกลาง ต้องอดทนแต่จะสำเร็จ, 🔴 (สีแดง) = ควรระวัง อาจมีอุปสรรคหรือปัญหาสุขภาพ',
            },
        },
        {
            '@type': 'Question',
            'name': 'สามารถ Export ผลลัพธ์ออกมาได้ไหม?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'ได้ ระบบรองรับการ Export ผลลัพธ์เป็นไฟล์ CSV สำหรับใช้ใน Excel หรือ Google Sheets และ PDF สำหรับพิมพ์หรือแชร์ให้ผู้อื่น',
            },
        },
        {
            '@type': 'Question',
            'name': 'Bulk Analysis เหมาะกับใคร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'เหมาะสำหรับ: 1) พ่อแม่ที่กำลังตั้งชื่อลูกและมีหลายตัวเลือก 2) ผู้ที่ต้องการเปลี่ยนชื่อและอยากเปรียบเทียบหลายชื่อ 3) นักเลขศาสตร์ที่ต้องการตรวจสอบรายชื่อจำนวนมาก 4) HR ที่ต้องการวิเคราะห์ชื่อพนักงาน',
            },
        },
        {
            '@type': 'Question',
            'name': 'คู่เลขชื่อมงคล 🟢🟠🔴 คำนวณอย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'ระบบนำค่าเลขศาสตร์ของอักขระแต่ละตัวในชื่อมาจับคู่เรียงต่อกัน แล้วเทียบกับตำราเลขศาสตร์ 🟢 (48 คู่มงคล เช่น 14, 15, 24, 36, 99) = ส่งเสริมโชคลาภ 🟠 (3 คู่กลาง เช่น 33, 47, 74) = ต้องอดทน 🔴 (คู่อื่นๆ) = ควรระวังอุปสรรค',
            },
        },
        {
            '@type': 'Question',
            'name': 'กาลกิณีในชื่อคืออะไร ส่งผลอย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'กาลกิณีคือกลุ่มอักษรที่ไม่เหมาะกับวันเกิดแต่ละวัน เช่น คนเกิดวันอาทิตย์ไม่ควรมีอักษร ศ ษ ส ฬ ฮ ห ในชื่อ ระบบ NameMongkol ตรวจสอบอัตโนมัติว่าชื่อใดใช้ได้กับวันเกิดใดบ้าง ครบทั้ง 7 วัน',
            },
        },
        {
            '@type': 'Question',
            'name': 'ผลรวมเลขศาสตร์ชื่อเท่าไหร่ถือว่ามงคล?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'ตามตำราเลขศาสตร์ไทย ผลรวมเลขที่เป็นมงคลมีทั้งหมด 27 ค่า ได้แก่ 9, 14, 15, 19, 24, 36, 40, 41, 42, 44, 45, 46, 50, 51, 54, 55, 56, 59, 60, 63, 64, 65, 90, 91, 92, 95, 99 ชื่อที่ผลรวมตรงกับค่าเหล่านี้จะได้เกรด A ขึ้นไป',
            },
        },
        {
            '@type': 'Question',
            'name': 'HR สามารถใช้วิเคราะห์ชื่อพนักงานได้อย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'HR สามารถวางรายชื่อพนักงานหรือทีมงาน (สูงสุด 1,000 ชื่อ) แล้วกดวิเคราะห์ ระบบจะจัดเกรด A+/A/B/C ให้ทุกชื่อพร้อมกัน ดาวน์โหลดเป็น CSV สำหรับ Excel หรือ PDF สำหรับทำรายงานนำเสนอได้ทันที',
            },
        },
    ],
};

const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'วิธีใช้ระบบวิเคราะห์ชื่อมงคลแบบกลุ่ม (Bulk Analysis)',
    'description': 'ขั้นตอนการวิเคราะห์ชื่อหลายชื่อพร้อมกันด้วย NameMongkol Bulk Analysis',
    'step': [
        {
            '@type': 'HowToStep',
            'position': 1,
            'name': 'วางรายชื่อ',
            'text': 'พิมพ์หรือวางรายชื่อที่ต้องการวิเคราะห์ลงในช่อง โดยใส่ 1 ชื่อต่อ 1 บรรทัด รองรับสูงสุด 1,000 ชื่อ',
        },
        {
            '@type': 'HowToStep',
            'position': 2,
            'name': 'กดเริ่มวิเคราะห์',
            'text': 'ตรวจสอบจำนวนชื่อและเครดิตที่ต้องใช้ จากนั้นกดปุ่ม "เริ่มวิเคราะห์" ระบบจะประมวลผลทันที',
        },
        {
            '@type': 'HowToStep',
            'position': 3,
            'name': 'ดูผลลัพธ์และ Export',
            'text': 'ดูผลลัพธ์พร้อมเกรด ผลรวมเลขศาสตร์ และคู่ตัวเลข สามารถจัดเรียงตามเกรด และ Export เป็น CSV หรือ PDF',
        },
    ],
    'totalTime': 'PT2M',
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
        {
            '@type': 'ListItem',
            'position': 1,
            'name': 'หน้าแรก',
            'item': siteUrl,
        },
        {
            '@type': 'ListItem',
            'position': 2,
            'name': 'วิเคราะห์ชื่อแบบกลุ่ม (Bulk Analysis)',
            'item': `${siteUrl}/name-analysis`,
        },
    ],
};

export default function NameAnalysisPage() {
    return (
        <>
            <Script
                id="name-analysis-software-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <Script
                id="name-analysis-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Script
                id="name-analysis-howto-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <Script
                id="name-analysis-breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ClientPage />
        </>
    );
}
