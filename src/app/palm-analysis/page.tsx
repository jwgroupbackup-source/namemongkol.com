import React from 'react';
import { Metadata } from 'next';
import PalmAnalysisClient from './PalmAnalysisClient';
import { PalmSeoContent } from '@/components/PalmSeoContent';
import PalmHeroBanner from '@/components/palm-analysis/PalmHeroBanner';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';
const canonicalUrl = `${siteUrl.replace(/\/$/, '')}/palm-analysis`;

export const metadata: Metadata = {
  title: 'วิเคราะห์ลายมือออนไลน์ด้วย AI ดู 4 เส้นหลักฟรี | NameMongkol',
  description:
    'วิเคราะห์ลายมือออนไลน์ด้วย AI อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา ตรวจคุณภาพภาพก่อนวิเคราะห์ลายมือ สรุปผลเข้าใจง่าย วิเคราะห์ลายมือด้วย AI ได้ทันทีบน NameMongkol',
  keywords: [
    'วิเคราะห์ลายมือ',
    'วิเคราะห์ลายมือออนไลน์',
    'วิเคราะห์ลายมือด้วย AI',
    'อ่านลายมือจากภาพมือ',
    'ดูลายมือออนไลน์',
    'ดูดวงลายมือ',
    'เช็คลายมือ 4 เส้นหลัก',
    'เส้นลายมือแต่ละเส้นหมายถึงอะไร',
    'เส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา',
    'วิเคราะห์ลายมือ AI ฟรี',
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'วิเคราะห์ลายมือออนไลน์ด้วย AI ดู 4 เส้นหลักฟรี | NameMongkol',
    description: 'วิเคราะห์ลายมือออนไลน์ด้วย AI จากภาพฝ่ามือจริง ดูเส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา พร้อมสรุปผลเข้าใจง่าย',
    url: canonicalUrl,
    siteName: 'NameMongkol',
    locale: 'th_TH',
    type: 'website',
    images: [`${siteUrl}/api/og?variant=palm`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'วิเคราะห์ลายมือออนไลน์ด้วย AI ดู 4 เส้นหลักฟรี | NameMongkol',
    description: 'วิเคราะห์ลายมือด้วย AI จากภาพฝ่ามือจริง อ่านเส้นหลัก 4 ด้าน สรุปผลทันที',
    images: [`${siteUrl}/api/og?variant=palm`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function PalmAnalysisPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': canonicalUrl,
        url: canonicalUrl,
        name: 'วิเคราะห์ลายมือออนไลน์ด้วย AI ดู 4 เส้นหลักฟรี | NameMongkol',
        description:
          'วิเคราะห์ลายมือออนไลน์ด้วย AI อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา ตรวจคุณภาพภาพก่อนวิเคราะห์ลายมือ สรุปผลเข้าใจง่าย',
        inLanguage: 'th-TH',
        isPartOf: {
          '@type': 'WebSite',
          name: 'NameMongkol',
          url: siteUrl,
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Palm Analysis AI - NameMongkol',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        url: canonicalUrl,
        description:
          'เครื่องมือวิเคราะห์ลายมือออนไลน์ด้วย AI อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา พร้อมสรุปผลเชิงแนวโน้ม',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'THB',
          description: 'วิเคราะห์ลายมือพื้นฐานฟรี และมีโหมดเชิงลึกในระบบเครดิต',
        },
        featureList: [
          'วิเคราะห์เส้นลายมือ 4 เส้นหลัก (เส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา)',
          'ตรวจคุณภาพภาพก่อนเริ่มวิเคราะห์',
          'อ่านผลลัพธ์เชิงแนวโน้มแบบเข้าใจง่าย',
          'สรุปจุดเด่นและจุดที่ควรพัฒนา',
          'แนะนำการใช้งานผลวิเคราะห์เชิงบวกในชีวิตประจำวัน',
          'ใช้งานได้ทันทีผ่านมือถือและเว็บเบราว์เซอร์',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'วิเคราะห์ลายมือ AI แม่นยำแค่ไหน?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ความแม่นยำขึ้นกับคุณภาพภาพมือ มุมกล้อง และความชัดของเส้นลายมือ ผลลัพธ์จึงควรใช้เป็นแนวโน้มเบื้องต้น ไม่ใช่ข้อสรุปตายตัว 100 เปอร์เซ็นต์',
            },
          },
          {
            '@type': 'Question',
            name: 'เส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา บอกอนาคตได้แน่นอนหรือไม่?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ลายมือมักใช้สะท้อนแนวโน้มและบุคลิกในมุมหนึ่ง มากกว่าการฟันธงอนาคตแบบแน่นอน โดยผลลัพธ์ควรใช้ร่วมกับวิจารณญาณของผู้ใช้งาน',
            },
          },
          {
            '@type': 'Question',
            name: 'ต้องเตรียมรูปมืออย่างไรให้วิเคราะห์ได้ละเอียดขึ้น?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ควรถ่ายภาพในแสงเพียงพอ เห็นฝ่ามือเต็มเฟรม ภาพไม่เบลอ และกล้องตั้งตรง เพื่อให้ระบบตรวจจับเส้นลายมือได้ชัดเจนขึ้น',
            },
          },
          {
            '@type': 'Question',
            name: 'ควรใช้รูปมือซ้ายหรือมือขวาในการวิเคราะห์?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'สามารถวิเคราะห์ได้ทั้งสองมือ แต่ควรถ่ายให้ชัดในสภาพแสงใกล้เคียงกัน หากต้องการเปรียบเทียบแนวโน้ม แนะนำให้วิเคราะห์ทั้งมือซ้ายและมือขวาแยกกัน',
            },
          },
          {
            '@type': 'Question',
            name: 'ถ้ารูปมือมืดหรือเบลอจะกระทบผลวิเคราะห์ไหม?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'มีผลโดยตรงครับ หากภาพมืด เบลอ หรือมีเงาบัง เส้นหลักจะถูกตรวจจับได้ไม่ครบ ทำให้ผลสรุปคลาดเคลื่อนได้ จึงควรตรวจคุณภาพภาพก่อนกดวิเคราะห์ทุกครั้ง',
            },
          },
          {
            '@type': 'Question',
            name: 'ลายมือเปลี่ยนแปลงได้ตามช่วงชีวิตหรือไม่?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ลายมือและวิธีแปลผลมักถูกมองว่าเป็นแนวโน้มที่เปลี่ยนได้ตามประสบการณ์ สุขภาพ และพฤติกรรม จึงควรวิเคราะห์เป็นระยะเพื่อดูภาพรวมการเปลี่ยนแปลงของตนเอง',
            },
          },
          {
            '@type': 'Question',
            name: 'วิเคราะห์ลายมือออนไลน์ต่างจากไปดูกับหมอดูอย่างไร?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'การวิเคราะห์ลายมือออนไลน์ด้วย AI ใช้การประมวลผลภาพและอัลกอริทึมเพื่อตรวจจับเส้นหลัก ให้ผลลัพธ์รวดเร็ว สะดวก ใช้ได้ทุกที่ทุกเวลา แต่ไม่ได้ทดแทนประสบการณ์เฉพาะทางของผู้เชี่ยวชาญ จึงเหมาะใช้เป็นข้อมูลเบื้องต้นก่อนปรึกษาเพิ่มเติม',
            },
          },
          {
            '@type': 'Question',
            name: 'วิเคราะห์ลายมือด้วย AI ฟรีหรือเปล่า?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'สามารถเริ่มวิเคราะห์ลายมือด้วย AI ได้ฟรีบน NameMongkol โดยอัปโหลดภาพฝ่ามือ ระบบจะตรวจคุณภาพภาพและวิเคราะห์เส้นหลัก 4 เส้นให้ทันที สำหรับผลวิเคราะห์เชิงลึกจะใช้ระบบเครดิต',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'วิเคราะห์ลายมือออนไลน์', item: canonicalUrl },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'วิธีวิเคราะห์ลายมือออนไลน์ด้วย AI',
        description: 'ขั้นตอนใช้งานเครื่องมือวิเคราะห์ลายมือออนไลน์บน NameMongkol ให้ได้ผลลัพธ์ที่ชัดเจน',
        totalTime: 'PT3M',
        tool: [
          {
            '@type': 'HowToTool',
            name: 'กล้องมือถือหรือรูปภาพฝ่ามือที่ชัดเจน',
          },
          {
            '@type': 'HowToTool',
            name: 'แสงธรรมชาติหรือแสงสีขาวที่เพียงพอ',
          },
        ],
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'เตรียมแสงและจัดฝ่ามือ',
            text: 'ถ่ายภาพในแสงเพียงพอ วางฝ่ามือให้เต็มเฟรม และหลีกเลี่ยงเงาทับเส้นหลัก',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'อัปโหลดภาพหรือถ่ายภาพใหม่',
            text: 'เลือกอัปโหลดรูปจากเครื่อง หรือเปิดกล้องแล้วถ่ายภาพใหม่ในหน้า Palm Scanner',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'ตรวจคุณภาพภาพก่อนวิเคราะห์',
            text: 'ตรวจคะแนนความคม แสง และคอนทราสต์ให้เหมาะสมก่อนเริ่มวิเคราะห์',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'กดเริ่มวิเคราะห์และอ่านผลสรุป',
            text: 'ระบบจะแสดงผลอ่านเส้นหลัก 4 ด้าน จุดเด่น จุดที่ควรพัฒนา และคำแนะนำใช้งานผลลัพธ์',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#020617] relative overflow-hidden pt-20 md:pt-20 lg:pt-24 pb-36 md:pb-12 px-3 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-12%] w-[40%] h-[40%] rounded-full bg-blue-700/15 blur-[130px]" />
          <div className="absolute bottom-[-10%] right-[-12%] w-[40%] h-[40%] rounded-full bg-violet-700/15 blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-2.5 sm:space-y-8">
          <PalmHeroBanner />
          <PalmAnalysisClient />
          <PalmSeoContent />
        </div>
      </main>
    </>
  );
}
