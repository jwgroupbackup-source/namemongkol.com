import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ClientPage from '../../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

const DAY_META: Record<string, { label: string; desc: string; keywords: string[] }> = {
    sunday: {
        label: 'วันอาทิตย์',
        desc: 'ดาวน์โหลดวอลเปเปอร์มงคลวันอาทิตย์ 2569 ฟรี! สิงห์ทองคำนำโชค ดอกบัวทอง ยันต์ศักดิ์สิทธิ์ เลขมงคล 159 เสริมอำนาจบารมี โชคลาภก้อนใหญ่ สีแดง-ทอง ออกแบบตามหลักโหราศาสตร์ไทยและฮวงจุ้ย',
        keywords: ['วอลเปเปอร์วันอาทิตย์', 'สีมงคลวันอาทิตย์', 'เสริมดวงวันอาทิตย์', 'วอลเปเปอร์สิงห์ทอง', 'เลข 159 เสริมดวง', 'พื้นหลังมงคลวันอาทิตย์', 'วอลเปเปอร์มงคล 2569', 'วอลเปเปอร์เสริมบารมี'],
    },
    monday: {
        label: 'วันจันทร์',
        desc: 'ดาวน์โหลดวอลเปเปอร์มงคลวันจันทร์ 2569 ฟรี! เทพพระจันทร์ประทับดอกบัว พร้อมสิงห์คู่ เหรียญทองนำโชค เลขมงคล 246 เสริมเสน่ห์ เมตตามหานิยม สีขาว-เงิน ออกแบบตามหลักโหราศาสตร์ไทย',
        keywords: ['วอลเปเปอร์วันจันทร์', 'สีมงคลวันจันทร์', 'เสริมดวงวันจันทร์', 'วอลเปเปอร์เมตตามหานิยม', 'วอลเปเปอร์เสน่ห์', 'เลข 246 เสริมดวง', 'พื้นหลังมงคลวันจันทร์', 'วอลเปเปอร์พระจันทร์'],
    },
    tuesday: {
        label: 'วันอังคาร',
        desc: 'ดาวน์โหลดวอลเปเปอร์มงคลวันอังคาร 2569 ฟรี! พระปางไสยาสน์ทองคำบนดอกบัว มณฑลยันต์ศักดิ์สิทธิ์ สิงห์คู่นำโชค เลขมงคล 356 เสริมความกล้าหาญ ก้าวหน้าในการงาน สีชมพู-ทอง ตามหลักโหราศาสตร์',
        keywords: ['วอลเปเปอร์วันอังคาร', 'สีมงคลวันอังคาร', 'เสริมดวงวันอังคาร', 'วอลเปเปอร์พระปางไสยาสน์', 'เลข 356 เสริมดวง', 'พื้นหลังมงคลวันอังคาร', 'วอลเปเปอร์เสริมการงาน', 'วอลเปเปอร์มณฑลยันต์'],
    },
    wednesday: {
        label: 'วันพุธ(กลางวัน)',
        desc: 'ดาวน์โหลดวอลเปเปอร์มงคลวันพุธกลางวัน 2569 ฟรี! พระแม่ลักษมีเทพีแห่งความมั่งคั่ง ช้างมงคลโปรยน้ำ ดอกบัวทอง เลขมงคล 456 เสริมวาจาเรียกทรัพย์ ค้าขายร่ำรวย สีเขียวมรกต ตามหลักฮวงจุ้ย',
        keywords: ['วอลเปเปอร์วันพุธ', 'วอลเปเปอร์วันพุธกลางวัน', 'สีมงคลวันพุธ', 'เสริมดวงวันพุธ', 'วอลเปเปอร์พระแม่ลักษมี', 'เลข 456 เสริมดวง', 'วอลเปเปอร์ค้าขายร่ำรวย', 'วอลเปเปอร์เรียกทรัพย์', 'พื้นหลังมงคลวันพุธ'],
    },
    wednesday_night: {
        label: 'วันพุธ(กลางคืน)',
        desc: 'ดาวน์โหลดวอลเปเปอร์มงคลวันพุธกลางคืน 2569 ฟรี! พระราหูอมจันทร์ ยันต์ทองศักดิ์สิทธิ์ มณีเขียวมรกต เลขมงคล 789 เสริมพลังป้องกันภัย แคล้วคลาด สีดำ-เขียว ออกแบบตามหลักโหราศาสตร์ไทย',
        keywords: ['วอลเปเปอร์วันพุธกลางคืน', 'เสริมดวงวันพุธกลางคืน', 'วอลเปเปอร์ราหู', 'สีมงคลวันพุธกลางคืน', 'วอลเปเปอร์พระราหูอมจันทร์', 'เลข 789 เสริมดวง', 'วอลเปเปอร์ป้องกันภัย', 'วอลเปเปอร์แคล้วคลาด', 'พื้นหลังมงคลวันพุธกลางคืน'],
    },
    thursday: {
        label: 'วันพฤหัสบดี',
        desc: 'ดาวน์โหลดวอลเปเปอร์มงคลวันพฤหัสบดี 2569 ฟรี! พระพุทธรูปทองคำปางสมาธิ วงยันต์อักขระขอม คัมภีร์ทองอัญมณี เลขมงคล 659 เสริมสติปัญญา ผู้ใหญ่อุปถัมภ์ สีส้ม-ทอง ตามหลักโหราศาสตร์ไทย',
        keywords: ['วอลเปเปอร์วันพฤหัสบดี', 'สีมงคลวันพฤหัสบดี', 'เสริมดวงวันพฤหัสบดี', 'วอลเปเปอร์พระพุทธรูปทองคำ', 'เลข 659 เสริมดวง', 'วอลเปเปอร์เสริมปัญญา', 'พื้นหลังมงคลวันพฤหัสบดี', 'วอลเปเปอร์เสริมการเรียน'],
    },
    friday: {
        label: 'วันศุกร์',
        desc: 'ดาวน์โหลดวอลเปเปอร์มงคลวันศุกร์ 2569 ฟรี! พระพุทธรูปเรืองแสงฟ้าคราม ดอกบัวทิพย์ พระแม่ลักษมี เมฆมงคลจีน เลขมงคล 624 เสริมโชคลาภ ความรัก ทรัพย์สินพูนทวี สีฟ้า-เขียว ตามหลักฮวงจุ้ย',
        keywords: ['วอลเปเปอร์วันศุกร์', 'สีมงคลวันศุกร์', 'เสริมดวงวันศุกร์', 'วอลเปเปอร์เสริมความรัก', 'เลข 624 เสริมดวง', 'วอลเปเปอร์เสริมทรัพย์สิน', 'พื้นหลังมงคลวันศุกร์', 'วอลเปเปอร์ดอกบัว'],
    },
    saturday: {
        label: 'วันเสาร์',
        desc: 'ดาวน์โหลดวอลเปเปอร์มงคลวันเสาร์ 2569 ฟรี! พระนาคปรก 7 เศียร เสือคู่ทองคำ อักษรจีน招財(เรียกทรัพย์) เลขมงคล 156 เสริมอำนาจ ปกป้องคุ้มครอง ความสำเร็จยั่งยืน สีม่วง-ทอง ตามหลักโหราศาสตร์',
        keywords: ['วอลเปเปอร์วันเสาร์', 'สีมงคลวันเสาร์', 'เสริมดวงวันเสาร์', 'วอลเปเปอร์พระนาคปรก', 'เลข 156 เสริมดวง', 'วอลเปเปอร์เสือคู่นำโชค', 'พื้นหลังมงคลวันเสาร์', 'วอลเปเปอร์เรียกทรัพย์จีน', 'วอลเปเปอร์เสริมอำนาจ'],
    },
};

const VALID_DAYS = Object.keys(DAY_META);

type Props = { params: Promise<{ day: string }> };

export async function generateStaticParams() {
    return VALID_DAYS.map((day) => ({ day }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { day } = await params;
    const meta = DAY_META[day];
    if (!meta) return {};

    const title = `วอลเปเปอร์มงคล${meta.label} 2569 เสริมดวง | NameMongkol`;
    return {
        title,
        description: meta.desc,
        keywords: [...meta.keywords, 'วอลเปเปอร์มงคล', 'NameMongkol'],
        openGraph: {
            title,
            description: meta.desc,
            url: `${siteUrl}/wallpapers/day/${day}`,
            siteName: 'NameMongkol',
            locale: 'th_TH',
            type: 'website',
            images: [`${siteUrl}/api/og?variant=default&title=${encodeURIComponent(`วอลเปเปอร์มงคล${meta.label}`)}&subtitle=${encodeURIComponent('เสริมดวง 2569')}&tag=Wallpapers`],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: meta.desc,
        },
        alternates: {
            canonical: `${siteUrl}/wallpapers/day/${day}`,
        },
    };
}

export default async function DayWallpapersPage({ params }: Props) {
    const { day } = await params;
    if (!VALID_DAYS.includes(day)) notFound();

    const meta = DAY_META[day];

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
            { '@type': 'ListItem', position: 3, name: `${meta.label}`, item: `${siteUrl}/wallpapers/day/${day}` },
        ],
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `วอลเปเปอร์มงคล${meta.label}ช่วยเรื่องอะไร?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `วอลเปเปอร์มงคล${meta.label}เน้นเสริมพลังตามสีมงคลและสัญลักษณ์ประจำวันเกิด ช่วยเพิ่มโฟกัสและกำลังใจด้านการเงิน การงาน และความสัมพันธ์ในชีวิตประจำวัน`,
                },
            },
            {
                '@type': 'Question',
                name: `ควรเลือกวอลเปเปอร์${meta.label}แบบไหนให้เหมาะกับเป้าหมาย?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `หากต้องการเน้นการเงินให้เลือกภาพที่มีสัญลักษณ์เรียกทรัพย์ หากต้องการเน้นงานให้เลือกภาพที่สื่อถึงอำนาจและความมั่นคง และควรตั้งภาพที่มองเห็นบ่อยเพื่อเสริมการย้ำเป้าหมาย`,
                },
            },
        ],
    };

    return (
        <>
            <h1 className="sr-only">{`วอลเปเปอร์มงคล${meta.label} ฟรี 2569 เสริมดวงตามวันเกิด`}</h1>
            <Script
                id={`wallpapers-day-${day}-breadcrumb`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Script
                id={`wallpapers-day-${day}-faq`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Suspense>
                <ClientPage initialCategory="day" initialDay={day} initialTab="collection" />
            </Suspense>
            <section className="w-full bg-[#050b14] text-slate-200 px-4 pb-12">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                        {`วอลเปเปอร์มงคล${meta.label} ฟรี 2569 เหมาะกับใคร`}
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        {`คอลเลกชันวอลเปเปอร์มงคล${meta.label}ชุดนี้ออกแบบให้สอดคล้องกับสีมงคลประจำวันและสัญลักษณ์เสริมดวงเด่นของวันเกิด ช่วยย้ำเป้าหมายด้านการเงิน การงาน และความรักเมื่อใช้งานเป็นหน้าจอประจำวัน`}
                    </p>
                </div>
            </section>
        </>
    );
}
