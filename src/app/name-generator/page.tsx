import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import ClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

const baseUrl = siteUrl.replace(/\/$/, '');

export const metadata: Metadata = {
    title: 'สร้างชื่อมงคลด้วย AI เกรด A+ ตามวันเกิด | NameMongkol',
    alternates: { canonical: `${baseUrl}/name-generator` },
    description: 'สร้างชื่อมงคลด้วย AI สำหรับตั้งชื่อลูก เปลี่ยนชื่อ หรือชื่อแบรนด์ คัดชื่อเกรด A+ ตามหลักเลขศาสตร์ คู่เลขมงคล และอักษรนำที่เหมาะสม',
    keywords: ['สร้างชื่อมงคลด้วย AI', 'AI ตั้งชื่อมงคล', 'สร้างชื่อเกรด A+', 'ตั้งชื่อลูกด้วย AI', 'เปลี่ยนชื่อด้วย AI', 'ชื่อมงคล AI', 'ชื่อเกรด A+', 'คู่เลขมงคล'],
    openGraph: {
        title: 'สร้างชื่อมงคลด้วย AI เกรด A+ ตามวันเกิด | NameMongkol',
        description: 'สร้างชื่อมงคลใหม่ด้วย AI คัดชื่อเกรด A+ ตามหลักเลขศาสตร์ คู่เลขมงคล และอักษรนำที่เหมาะสม',
        url: `${baseUrl}/name-generator`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${baseUrl}/api/og?variant=default&title=สร้างชื่อมงคลด้วย%20AI&subtitle=คัดชื่อเกรด%20A%2B%20ตามหลักเลขศาสตร์&tag=AI%20Name%20Generator`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'สร้างชื่อมงคลด้วย AI เกรด A+ | NameMongkol',
        description: 'สร้างชื่อมงคลใหม่ด้วย AI ตามหลักเลขศาสตร์และคู่เลขมงคล',
        images: [`${baseUrl}/api/og?variant=default&title=สร้างชื่อมงคลด้วย%20AI`],
    },
};

export default function NameGeneratorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${baseUrl}/name-generator#webpage`,
                'url': `${baseUrl}/name-generator`,
                'name': 'สร้างชื่อมงคลด้วย AI เกรด A+ ตามวันเกิด | NameMongkol',
                'description': 'เครื่องมือสร้างชื่อมงคลด้วย AI สำหรับตั้งชื่อลูก เปลี่ยนชื่อ หรือชื่อแบรนด์ โดยคัดชื่อเกรด A+ ตามหลักเลขศาสตร์และคู่เลขมงคล',
                'inLanguage': 'th-TH',
                'isPartOf': { '@id': `${baseUrl}/#website` },
                'mainEntity': { '@id': `${baseUrl}/name-generator#software` },
            },
            {
                '@type': 'SoftwareApplication',
                '@id': `${baseUrl}/name-generator#software`,
                'name': 'NameMongkol AI Name Generator',
                'alternateName': 'สร้างชื่อมงคลด้วย AI',
                'description': 'เครื่องมือสร้างชื่อมงคลด้วย AI สำหรับตั้งชื่อลูก เปลี่ยนชื่อ หรือชื่อแบรนด์ โดยคัดชื่อเกรด A+ ตามหลักเลขศาสตร์และคู่เลขมงคล',
                'url': `${baseUrl}/name-generator`,
                'applicationCategory': 'LifestyleApplication',
                'operatingSystem': 'Web',
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'THB',
                },
                'featureList': [
                    'สร้างชื่อมงคลใหม่ด้วย AI',
                    'คัดชื่อเกรด A+ ตามหลักเลขศาสตร์',
                    'ตรวจคู่เลขมงคลในชื่อ',
                    'เลือกอักษรนำหน้าที่ต้องการ',
                    'ดาวน์โหลดผลลัพธ์เป็น CSV',
                ],
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${baseUrl}/name-generator#breadcrumb`,
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
                        'name': 'สร้างชื่อมงคลด้วย AI',
                        'item': `${baseUrl}/name-generator`,
                    },
                ],
            },
            {
                '@type': 'HowTo',
                '@id': `${baseUrl}/name-generator#howto`,
                'name': 'วิธีสร้างชื่อมงคลด้วย AI',
                'description': 'ขั้นตอนการใช้ NameMongkol AI Name Generator เพื่อสร้างชื่อมงคลเกรด A+',
                'step': [
                    {
                        '@type': 'HowToStep',
                        'position': 1,
                        'name': 'เลือกอักษรนำ',
                        'text': 'เลือกอักษรนำหน้าที่ต้องการให้ AI ใช้เป็นจุดเริ่มต้นในการสร้างชื่อ',
                    },
                    {
                        '@type': 'HowToStep',
                        'position': 2,
                        'name': 'กดสร้างชื่อ',
                        'text': 'ระบบจะประกอบตัวอักษรและคัดเฉพาะชื่อที่มีผลรวมเลขศาสตร์และคู่เลขมงคล',
                    },
                    {
                        '@type': 'HowToStep',
                        'position': 3,
                        'name': 'นำชื่อไปวิเคราะห์ร่วมกับนามสกุล',
                        'text': 'เลือกชื่อที่สนใจแล้วนำไปตรวจร่วมกับนามสกุลเพื่อดูผลรวมจริงก่อนใช้งาน',
                    },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': `${baseUrl}/name-generator#faq`,
                'mainEntity': [
                    {
                        '@type': 'Question',
                        'name': 'สร้างชื่อมงคลด้วย AI ต่างจากค้นหาชื่อมงคลอย่างไร?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'หน้าสร้างชื่อมงคลด้วย AI ใช้ระบบประกอบชื่อใหม่จากตัวอักษรและคู่เลขมงคล ส่วนหน้าค้นหาชื่อมงคลเป็นฐานข้อมูลรายชื่อที่มีอยู่แล้ว เหมาะกับการเลือกชื่อจากรายการสำเร็จรูป',
                        },
                    },
                    {
                        '@type': 'Question',
                        'name': 'ชื่อที่ AI สร้างใช้ได้ทันทีไหม?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'ควรนำชื่อที่สนใจไปวิเคราะห์ร่วมกับนามสกุลและวันเกิดอีกครั้ง เพราะผลรวมชื่อจริงต้องคิดจากชื่อและนามสกุลรวมกัน',
                        },
                    },
                    {
                        '@type': 'Question',
                        'name': 'เครื่องมือนี้เหมาะกับใคร?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'เหมาะกับผู้ที่ต้องการไอเดียชื่อใหม่สำหรับตั้งชื่อลูก เปลี่ยนชื่อ หรือชื่อแบรนด์ และต้องการเริ่มจากชื่อที่ผ่านเกณฑ์เลขศาสตร์พื้นฐานก่อน',
                        },
                    },
                ],
            },
        ],
    };

    return (
        <>
            <Script
                id="name-generator-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ClientPage />
            <section className="bg-[#0f172a] px-4 pb-20 text-slate-200">
                <div className="mx-auto max-w-4xl border-t border-white/10 pt-12">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                        AI Naming Workflow
                    </p>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        สร้างชื่อมงคลด้วย AI แล้วควรตรวจอะไรต่อก่อนใช้จริง
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                        เครื่องมือนี้ช่วยสร้างชื่อใหม่ที่ผ่านเกณฑ์ผลรวมเลขศาสตร์และคู่เลขมงคลในระดับเริ่มต้น เหมาะสำหรับหาไอเดียชื่อจำนวนมากอย่างรวดเร็ว
                        แต่ก่อนนำไปใช้จริงควรตรวจร่วมกับนามสกุล วันเกิด และอักษรกาลกิณี เพื่อให้รู้ว่าชื่อนั้นส่งเสริมดวงของเจ้าของชื่อจริงหรือไม่
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
                            <h3 className="font-semibold text-amber-200">1. สร้างรายชื่อ</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                เลือกอักษรนำแล้วให้ AI สร้างชื่อเกรด A+ เป็นชุด เพื่อใช้เป็นตัวเลือกตั้งต้น
                            </p>
                        </div>
                        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5">
                            <h3 className="font-semibold text-cyan-200">2. วิเคราะห์กับนามสกุล</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                นำชื่อที่ชอบไปเช็กชื่อและนามสกุล เพื่อดูผลรวมจริงและความสมพงศ์ของชื่อเต็ม
                            </p>
                        </div>
                        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-5">
                            <h3 className="font-semibold text-emerald-200">3. คัดชื่อเสริมดวง</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                ถ้าต้องการชื่อที่คัดตามวันเกิด อักษรนำ และวรรคเดช/ศรี ให้ใช้ระบบ Pro ต่อ
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3 text-sm">
                        <Link href="/name-check" className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-cyan-200 hover:bg-cyan-400/10">
                            วิเคราะห์ชื่อกับนามสกุลฟรี
                        </Link>
                        <Link href="/search" className="rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2 text-amber-200 hover:bg-amber-400/10">
                            ค้นหาชื่อมงคลจากฐานข้อมูล
                        </Link>
                        <Link href="/premium-search" className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-emerald-200 hover:bg-emerald-400/10">
                            เปลี่ยนชื่อมงคล Pro
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
