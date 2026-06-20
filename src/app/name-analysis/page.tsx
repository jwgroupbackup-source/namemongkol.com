import { Metadata } from 'next';
import Link from 'next/link';
import ClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';


export const metadata: Metadata = {
    title: 'วิเคราะห์ชื่อหลายชื่อพร้อมกัน | Bulk Name Analysis เช็กคู่เลขในชื่อ | NameMongkol',
    alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/name-analysis` },
    description: 'คัดกรองชื่อหลายชื่อพร้อมกันด้วยการถอดอักษรเป็นเลขศาสตร์ วิเคราะห์ผลรวมและคู่เลขในชื่อ เพื่อเปรียบเทียบหลายตัวเลือก ไม่ใช่จัดเกรดจากผลรวมอย่างเดียว',
    keywords: 'วิเคราะห์ชื่อหลายชื่อ, Bulk Name Analysis, คัดชื่อมงคล, ถอดอักษรเป็นเลขศาสตร์, วิเคราะห์คู่เลขในชื่อ, เปรียบเทียบชื่อมงคล, คู่เลขชื่อมงคล, Export CSV วิเคราะห์ชื่อ',
    openGraph: {
        title: 'วิเคราะห์ชื่อหลายชื่อพร้อมกัน เช็กผลรวมและคู่เลขในชื่อ | NameMongkol',
        description: 'Bulk analysis สำหรับคัดหลายชื่อด้วยผลรวมเลขศาสตร์ คู่เลขในชื่อ อักษรกาลกิณี และ export CSV/PDF',
        url: `${siteUrl}/name-analysis`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=Bulk%20Name%20Analysis&subtitle=ถอดอักษรเป็นเลขศาสตร์+เช็กคู่เลขในชื่อ&tag=Bulk%20Analysis`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ชื่อหลายชื่อพร้อมกัน เช็กคู่เลขในชื่อ | NameMongkol',
        description: 'คัดหลายชื่อด้วยผลรวมเลขศาสตร์และคู่เลขในชื่อ ไม่ใช่ดูผลรวมอย่างเดียว',
    },
};

// JSON-LD Schemas for SEO
const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/name-analysis`,
    'url': `${siteUrl}/name-analysis`,
    'name': 'วิเคราะห์ชื่อหลายชื่อพร้อมกัน | Bulk Name Analysis เช็กคู่เลขในชื่อ | NameMongkol',
    'description': 'เครื่องมือคัดกรองหลายชื่อพร้อมกัน โดยถอดอักษรเป็นเลขศาสตร์ ตรวจผลรวม คู่เลขในชื่อ อักษรกาลกิณี และจัดเกรดเพื่อช่วยเปรียบเทียบชื่อจำนวนมาก',
    'inLanguage': 'th-TH',
    'isPartOf': {
        '@type': 'WebSite',
        'name': 'NameMongkol',
        'url': siteUrl,
    },
};

const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'NameMongkol Bulk Name Analysis',
    'description': 'ระบบวิเคราะห์ชื่อมงคลแบบกลุ่มที่ถอดตัวอักษรเป็นค่าเลขศาสตร์ ตรวจผลรวมและจับคู่เลขในชื่อเพื่อช่วยคัดหลายชื่อ ไม่ใช่จัดเกรดจากผลรวมเพียงอย่างเดียว',
    'url': `${siteUrl}/name-analysis`,
    'applicationCategory': 'LifestyleApplication',
    'operatingSystem': 'Web Browser',
    'offers': {
        '@type': 'Offer',
        'price': '5',
        'priceCurrency': 'THB',
        'description': 'ใช้งานผ่านระบบเครดิต เริ่มต้น 5 เครดิตสำหรับการวิเคราะห์ 1-10 ชื่อ',
    },
    'featureList': [
        'วิเคราะห์ชื่อพร้อมกันสูงสุด 1,000 ชื่อ',
        'ถอดตัวอักษรแต่ละตัวเป็นค่าเลขศาสตร์',
        'วิเคราะห์คู่เลขในชื่อเพื่ออ่านพลังและความหมายรายคู่',
        'จัดเกรดความมงคลโดยดูทั้งผลรวม คู่เลข และอักษรกาลกิณี',
        'ตรวจสอบวันที่ใช้ได้ตามทักษาปกรณ์',
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
            'name': 'Bulk Analysis ใช้วิธีจับคู่เลขอย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'ระบบจะถอดตัวอักษรของแต่ละชื่อเป็นค่าเลขศาสตร์ แล้วจับเลขที่อยู่ติดกันเป็นคู่เพื่ออ่านพลังและความหมายรายคู่ จากนั้นจึงใช้ร่วมกับผลรวม อักษรกาลกิณี และเกรดภาพรวมเพื่อช่วยคัดหลายชื่อ',
            },
        },
        {
            '@type': 'Question',
            'name': 'ทำไมการคัดหลายชื่อไม่ควรดูแค่ผลรวมเลขศาสตร์?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'ชื่อที่ผลรวมดีอาจมีคู่เลขบางตำแหน่งที่ควรระวัง หรือชื่อที่ผลรวมใกล้กันอาจให้พลังรายคู่ต่างกัน การดูคู่เลขช่วยให้เปรียบเทียบหลายชื่อได้ละเอียดกว่าใช้คะแนนรวมอย่างเดียว',
            },
        },
        {
            '@type': 'Question',
            'name': 'Bulk Analysis เหมาะกับใคร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'เหมาะกับพ่อแม่ที่มีรายชื่อให้ลูกหลายตัวเลือก ผู้ที่ต้องการเปลี่ยนชื่อและอยากเปรียบเทียบหลายชื่อ นักเลขศาสตร์ หรือทีมงานที่ต้องคัดกรองรายชื่อจำนวนมากก่อนนำชื่อที่ดีที่สุดไปวิเคราะห์ร่วมกับนามสกุลในหน้า /name-check',
            },
        },
    ],
};

const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'วิธีใช้ระบบวิเคราะห์ชื่อมงคลแบบกลุ่ม',
    'description': 'ขั้นตอนคัดหลายชื่อด้วยผลรวมเลขศาสตร์ คู่เลขในชื่อ และเกรดภาพรวม',
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
            'name': 'เริ่มวิเคราะห์',
            'text': 'ระบบจะถอดอักษรเป็นเลขศาสตร์ ตรวจผลรวม คู่เลขในชื่อ และอักษรกาลกิณีของแต่ละชื่อโดยอัตโนมัติ',
        },
        {
            '@type': 'HowToStep',
            'position': 3,
            'name': 'เปรียบเทียบผลลัพธ์และ Export',
            'text': 'ดูเกรด ผลรวมเลขศาสตร์ คู่เลขในชื่อ และคำอธิบายพลังรายคู่ จากนั้นจัดเรียงรายชื่อหรือส่งออกเป็น CSV/PDF เพื่อนำชื่อที่สนใจไปวิเคราะห์กับนามสกุลแบบละเอียด',
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
            {/* SSR H1 for Googlebot — keep visually hidden to avoid duplicate visible H1 in client UI */}
            <h1 className="sr-only">วิเคราะห์ชื่อหลายชื่อพร้อมกัน Bulk Name Analysis ถอดอักษรเป็นเลขศาสตร์ เช็กคู่เลขในชื่อ จัดเกรดหลายชื่อ Export CSV/PDF</h1>

            <script
                id="name-analysis-webpage-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
            <script
                id="name-analysis-software-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <script
                id="name-analysis-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                id="name-analysis-howto-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <script
                id="name-analysis-breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ClientPage />

            <section id="bulk-pair-analysis-seo" className="w-full bg-[#f8f8fc] px-4 pt-12 text-[#1a1a3e]">
                <div className="mx-auto max-w-4xl rounded-2xl border border-[#ddddf0] bg-white p-6 sm:p-8 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Bulk Pair Analysis</p>
                    <h2 className="mt-3 text-2xl font-bold text-[#1a1a3e]">คัดหลายชื่อด้วยคู่เลข ไม่ใช่ผลรวมอย่างเดียว</h2>
                    <p className="mt-4 text-sm leading-7 text-[#5a5a82] sm:text-base">
                        จุดเด่นของ NameMongkol คือการวิเคราะห์ชื่อแบบละเอียด โดยถอดตัวอักษรแต่ละตัวเป็นค่าเลขศาสตร์ แล้วจับเลขที่อยู่ติดกันเป็นคู่ เช่น 14, 24, 65 เพื่ออ่านพลังส่งเสริม จุดที่ควรระวัง และความหมายเชิงลึกของชื่อ ไม่ใช่ดูเฉพาะผลรวมตัวเลขเท่านั้น ในหน้า Bulk Analysis หลักการเดียวกันนี้ช่วยให้คุณเปรียบเทียบหลายชื่อได้เร็วขึ้น เห็นทั้งคะแนนรวม คู่เลขในชื่อ และจุดที่ควรระวังก่อนนำชื่อที่สนใจไปตรวจร่วมกับนามสกุลในหน้า /name-check
                    </p>
                </div>
            </section>

            {/* SSR Internal Links (lightweight) — helps crawlers discover related pages without relying on JS */}
            <div className="w-full bg-[#f8f8fc] text-[#1a1a3e] px-4 pb-24">
                <div className="max-w-4xl mx-auto border-t border-[#ddddf0] pt-10">
                    <p className="text-xs font-bold text-[#8e8eaa] uppercase tracking-widest mb-4">
                        บริการอื่นๆ ที่เกี่ยวข้อง
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/name-check" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            วิเคราะห์ชื่อ-นามสกุล (ฟรี)
                        </Link>
                        <Link href="/about" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            เกี่ยวกับ NameMongkol
                        </Link>
                        <Link href="/name-generator" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            สร้างชื่อมงคลด้วย AI
                        </Link>
                        <Link href="/search" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            ค้นหาชื่อมงคลฟรี 5,000+ ชื่อ
                        </Link>
                        <Link href="/premium-search" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            เปลี่ยนชื่อมงคล Pro
                        </Link>
                        <Link href="/premium-analysis" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            วิเคราะห์ชื่อขั้นสูง (Premium)
                        </Link>
                        <Link href="/phone-analysis" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            เช็คเบอร์มงคลกราฟพลังงาน 6 ด้าน
                        </Link>
                        <Link href="/palm-analysis" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            วิเคราะห์ลายมือออนไลน์ด้วย AI
                        </Link>
                        <Link href="/wallpapers" className="text-xs bg-white border border-[#ddddf0] hover:bg-[#f3f3f9] hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-full text-[#5a5a82] transition-colors shadow-sm">
                            วอลเปเปอร์มงคลเสริมดวง ดาวน์โหลดฟรี
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
