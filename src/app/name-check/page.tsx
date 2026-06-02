import { Metadata } from 'next';
import { Suspense } from 'react';
import ClientHome from '@/app/ClientHome';
import { HomeFallback } from '@/components/HomeFallback';
import { NameCheckSeoContent } from '@/components/NameCheckSeoContent';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'วิเคราะห์ชื่อ นามสกุล ฟรี | ถอดอักษรเป็นเลขศาสตร์ เช็กคู่เลขในชื่อ | NameMongkol',
    alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/name-check` },
    description:
        'เช็กชื่อจริง-นามสกุลแบบละเอียด ถอดตัวอักษรเป็นเลขศาสตร์ วิเคราะห์คู่เลขในชื่อและนามสกุล เช่น 14, 24, 65 พร้อมผลรวม ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์',
    keywords:
        'วิเคราะห์ชื่อ นามสกุล ฟรี, ตรวจชื่อจริงนามสกุล, ถอดอักษรเป็นเลขศาสตร์, วิเคราะห์คู่เลขในชื่อ, คู่เลขในนามสกุล, เลขศาสตร์ชื่อ, เช็กชื่อมงคล, ทักษาปกรณ์, อักษรกาลกิณี',
    openGraph: {
        title: 'วิเคราะห์ชื่อ-นามสกุลฟรี ถอดอักษรเป็นเลขศาสตร์ | NameMongkol',
        description:
            'วิเคราะห์ชื่อจริง-นามสกุลแบบละเอียด เห็นทั้งผลรวมเลขศาสตร์ ตารางถอดอักษร และคู่เลขในชื่อ-นามสกุลเพื่ออ่านพลังรายคู่',
        url: `${siteUrl}/name-check`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [
            `${siteUrl}/api/og?variant=default&title=วิเคราะห์ชื่อ-นามสกุลฟรี&subtitle=ถอดอักษรเป็นเลขศาสตร์+เช็กคู่เลขในชื่อ&tag=Name%20Analysis`,
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ชื่อ-นามสกุลฟรี ถอดอักษรเป็นเลขศาสตร์ | NameMongkol',
        description: 'เช็กชื่อจริง-นามสกุล เห็นผลรวม ตารางถอดอักษร และคู่เลขในชื่อ-นามสกุล ไม่ใช่ดูเฉพาะผลรวมเลขศาสตร์',
        images: [`${siteUrl}/api/og?variant=default&title=วิเคราะห์ชื่อ-นามสกุลฟรี`],
    },
};

// ── JSON-LD Schemas ──────────────────────────────────────────────────────────

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/name-check#webpage`,
    url: `${siteUrl}/name-check`,
    name: 'วิเคราะห์ชื่อ นามสกุล ฟรี | ถอดอักษรเป็นเลขศาสตร์ เช็กคู่เลขในชื่อ | NameMongkol',
    description: 'หน้าเช็กชื่อจริง-นามสกุลแบบละเอียดสำหรับดูผลรวมเลขศาสตร์ ตารางถอดอักษรเป็นเลข และคู่เลขในชื่อ-นามสกุลพร้อมคำอธิบายพลังรายคู่',
    isPartOf: { '@id': `${siteUrl}/#website` },
    inLanguage: 'th-TH',
    breadcrumb: { '@id': `${siteUrl}/name-check#breadcrumb` },
    speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '#name-check-method', '#name-check-faq'],
    },
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}/name-check#breadcrumb`,
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
            name: 'วิเคราะห์ชื่อ นามสกุล ฟรี',
            item: `${siteUrl}/name-check`,
        },
    ],
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'NameMongkol วิเคราะห์ละเอียดต่างจากการดูผลรวมเลขอย่างไร?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'จุดเด่นของ NameMongkol คือการวิเคราะห์ชื่อแบบละเอียด โดยถอดตัวอักษรแต่ละตัวเป็นค่าเลขศาสตร์ แล้วจับเลขที่อยู่ติดกันเป็นคู่ เช่น 14, 24, 65 เพื่ออ่านพลังส่งเสริม จุดที่ควรระวัง และความหมายเชิงลึกของชื่อ ไม่ใช่ดูเฉพาะผลรวมตัวเลขเท่านั้น',
            },
        },
        {
            '@type': 'Question',
            name: 'หน้า /name-check เหมาะกับการเช็กอะไร?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'เหมาะกับการเช็กชื่อจริงและนามสกุลแบบละเอียดก่อนเปลี่ยนชื่อ ตั้งชื่อลูก หรือเลือกชื่อที่เข้ากับนามสกุล ผู้ใช้จะเห็นผลรวมเลขศาสตร์ ตารางถอดรหัสตัวอักษร คู่เลขในชื่อ คู่เลขในนามสกุล และคำอธิบายพลังของแต่ละคู่',
            },
        },
        {
            '@type': 'Question',
            name: 'ผลลัพธ์หลังวิเคราะห์ชื่อแสดงอะไรบ้าง?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'ผลลัพธ์แสดงทั้งผลรวมเลขศาสตร์ คะแนนภาพรวม ตารางถอดอักษรเป็นเลข คู่เลขในชื่อ คู่เลขในนามสกุล ทักษาปกรณ์ อักษรกาลกิณี อายตนะ 6 และนิรันดร์ศาสตร์ เพื่อให้เห็นภาพรวมมากกว่าค่าเลขรวมเพียงค่าเดียว',
            },
        },
    ],
};

const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีวิเคราะห์ชื่อ-นามสกุลแบบละเอียดที่ NameMongkol',
    description: 'ขั้นตอนเช็กชื่อจริงและนามสกุล โดยถอดอักษรเป็นเลขศาสตร์ รวมเลข และจับคู่เลขเพื่ออ่านพลังรายคู่',
    totalTime: 'PT1M',
    step: [
        {
            '@type': 'HowToStep',
            position: 1,
            name: 'กรอกชื่อจริงและนามสกุล',
            text: 'พิมพ์ชื่อจริงและนามสกุลที่ต้องการตรวจ เพื่อให้ระบบถอดตัวอักษรแต่ละตัวเป็นค่าเลขศาสตร์',
        },
        {
            '@type': 'HowToStep',
            position: 2,
            name: 'เลือกวันเกิด',
            text: 'เลือกวันเกิดเพื่อให้ระบบตรวจทักษาปกรณ์ อักษรกาลกิณี และพลังที่สัมพันธ์กับวันเกิด',
        },
        {
            '@type': 'HowToStep',
            position: 3,
            name: 'ดูผลรวมและคู่เลขรายตัว',
            text: 'ผลลัพธ์จะแสดงทั้งผลรวมเลขศาสตร์ ตารางถอดรหัสเลขศาสตร์ คู่เลขในชื่อ คู่เลขในนามสกุล และคำอธิบายพลังของแต่ละคู่ ไม่ใช่จัดเกรดจากผลรวมเพียงอย่างเดียว',
        },
    ],
};

export default function NameCheckPage() {
    return (
        <>
            <script
                id="name-check-webpage-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
            <script
                id="name-check-breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                id="name-check-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                id="name-check-howto-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />

            <section className="relative z-10 mx-auto mt-10 w-full max-w-5xl px-4 text-center sm:mt-16 md:mt-20">
                <div className="rounded-[1.75rem] border border-white/8 bg-slate-950/35 px-5 py-8 shadow-[0_18px_55px_rgba(5,8,20,0.24)] backdrop-blur-xl sm:px-8 md:px-12">
                    <p className="mx-auto mb-4 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                        เครื่องมือวิเคราะห์ชื่อฟรี
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                        วิเคราะห์ชื่อ-นามสกุลฟรี ถอดอักษรเป็นเลขศาสตร์และเช็กคู่เลขในชื่อ
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                        เช็กชื่อจริงและนามสกุลในหน้าเดียว ระบบจะถอดตัวอักษรเป็นค่าเลขศาสตร์ รวมคะแนนภาพรวม แล้วจับเลขที่อยู่ติดกันเป็นคู่เพื่ออ่านพลังและความหมายรายคู่ พร้อมตรวจทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์
                    </p>
                </div>
            </section>

            {/* Reuse the main Home tool — same experience, different URL targeting new keyword */}
            <Suspense fallback={<HomeFallback heroHeadingLevel="h2" />}>
                <ClientHome heroHeadingLevel="h2" />
            </Suspense>

            <NameCheckSeoContent />
        </>
    );
}
