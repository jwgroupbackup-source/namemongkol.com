import type { Metadata } from 'next';

import ClientHome from './ClientHome';
import { ogImageUrl, siteUrl } from '@/lib/seo';

const baseUrl = siteUrl.replace(/\/$/, '');
const pageTitle = 'วิเคราะห์ชื่อฟรี ถอดอักษรเป็นเลขศาสตร์ | เช็กคู่เลขในชื่อ | NameMongkol';
const pageDescription = 'วิเคราะห์ชื่อและนามสกุลฟรี ถอดอักษรเป็นเลขศาสตร์ วิเคราะห์คู่เลขในชื่อ เช่น 14, 24, 65 พร้อมเช็กผลรวม ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์';
const homeOgImage = ogImageUrl({
  variant: 'default',
  title: 'วิเคราะห์ชื่อฟรี ถอดอักษรเป็นเลขศาสตร์',
  subtitle: 'เช็กคู่เลขในชื่อ ผลรวม และพลังความหมายรายคู่',
});

const homeFaqs = [
  {
    question: 'วิเคราะห์ชื่อฟรีที่ NameMongkol ต้องล็อกอินไหม?',
    answer: 'ไม่ต้องล็อกอิน ผู้ใช้สามารถกรอกชื่อ นามสกุล และวันเกิดเพื่อดูผลวิเคราะห์ชื่อเบื้องต้นได้ทันที ส่วนการสมัครสมาชิกเหมาะกับผู้ที่ต้องการบันทึกผลย้อนหลัง รับเครดิตฟรี หรือใช้งานฟีเจอร์พรีเมียมเพิ่มเติม',
  },
  {
    question: 'การวิเคราะห์ชื่อมงคลคืออะไร?',
    answer: 'การวิเคราะห์ชื่อมงคลคือการตรวจสอบชื่อและนามสกุลด้วยหลักเลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์ เพื่อดูผลรวมตัวเลข อักษรกาลกิณี ความสมพงศ์กับนามสกุล และพลังของคู่เลขที่เกิดจากตัวอักษรในชื่อ',
  },
  {
    question: 'NameMongkol วิเคราะห์ละเอียดต่างจากการดูผลรวมเลขอย่างไร?',
    answer: 'จุดเด่นของ NameMongkol คือการวิเคราะห์ชื่อแบบละเอียด โดยถอดตัวอักษรแต่ละตัวเป็นค่าเลขศาสตร์ แล้วจับเลขที่อยู่ติดกันเป็นคู่ เช่น 14, 24, 65 เพื่ออ่านพลังส่งเสริม จุดที่ควรระวัง และความหมายเชิงลึกของชื่อ ไม่ใช่ดูเฉพาะผลรวมตัวเลขเท่านั้น',
  },
  {
    question: 'ควรใช้หน้าแรกนี้เมื่อไร?',
    answer: 'เหมาะสำหรับผู้ที่ต้องการเช็กชื่อปัจจุบันก่อนเปลี่ยนชื่อ ตรวจชื่อใหม่ก่อนใช้งานจริง หรือตรวจชื่อที่เตรียมตั้งให้ลูก โดยเริ่มจากผลฟรีก่อนแล้วค่อยต่อยอดไปยังการค้นหาชื่อมงคลหรือการวิเคราะห์เชิงลึก',
  },
  {
    question: 'NameMongkol ใช้ศาสตร์อะไรในการวิเคราะห์ชื่อ?',
    answer: 'ระบบใช้ 4 แกนหลัก ได้แก่ เลขศาสตร์สำหรับผลรวมตัวเลข ทักษาปกรณ์สำหรับวันเกิดและอักษรกาลกิณี อายตนะ 6 สำหรับภาพลักษณ์ทางสังคม และนิรันดร์ศาสตร์สำหรับความสมพงศ์ของชื่อกับนามสกุล',
  },
  {
    question: 'ใช้ NameMongkol ตั้งชื่อลูกได้ไหม?',
    answer: 'ใช้ได้ ผู้ปกครองสามารถค้นหาชื่อมงคล แล้วนำชื่อที่สนใจมาวิเคราะห์ร่วมกับนามสกุลและวันเกิด เพื่อช่วยคัดชื่อที่เสียงดี ความหมายดี และหลีกเลี่ยงอักษรที่ไม่เหมาะกับวันเกิด',
  },
  {
    question: 'ผลวิเคราะห์ชื่อฟรีต่างจากฟีเจอร์พรีเมียมอย่างไร?',
    answer: 'ผลฟรีช่วยดูภาพรวมชื่อ นามสกุล คะแนน และ 4 ศาสตร์หลัก ฟีเจอร์พรีเมียมเหมาะกับผู้ที่ต้องการคัดชื่อหลายตัวเลือก วิเคราะห์เชิงลึก หรือออกแบบชื่อใหม่แบบละเอียดกว่าเดิม',
  },
] as const;

const howToSteps = [
  {
    name: 'กรอกชื่อและนามสกุล',
    text: 'พิมพ์ชื่อจริงและนามสกุลที่ต้องการตรวจ ระบบรองรับชื่อภาษาไทยและชื่อภาษาอังกฤษ',
  },
  {
    name: 'เลือกวันเกิด',
    text: 'เลือกวันเกิดเพื่อให้ระบบตรวจทักษาปกรณ์ อักษรกาลกิณี และพลังที่สัมพันธ์กับวันเกิด',
  },
  {
    name: 'กดวิเคราะห์ชื่อฟรี',
    text: 'กดปุ่มวิเคราะห์เพื่อดูผลรวมเลขศาสตร์ ตารางถอดอักษรเป็นตัวเลข คู่เลขในชื่อและนามสกุล ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์ คะแนน และคำอธิบายเบื้องต้นทันที',
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      'วิเคราะห์ชื่อฟรี',
      'วิเคราะห์ชื่อไม่ต้องล็อกอิน',
      'วิเคราะห์ชื่อ นามสกุล ฟรี',
      'เช็กชื่อมงคล',
      'ตั้งชื่อมงคล',
      'ตั้งชื่อลูก',
      'เปลี่ยนชื่อ',
      'เลขศาสตร์ชื่อ',
      'ถอดอักษรเป็นเลขศาสตร์',
      'วิเคราะห์คู่เลขในชื่อ',
      'คู่เลขชื่อมงคล',
      'ทักษาปกรณ์',
      'อักษรกาลกิณี',
      'อายตนะ 6',
      'นิรันดร์ศาสตร์',
      'NameMongkol',
    ],
    alternates: { canonical: baseUrl },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [{
        url: homeOgImage,
        width: 1200,
        height: 630,
        alt: 'วิเคราะห์ชื่อฟรี ไม่ต้องล็อกอิน กับ NameMongkol',
        type: 'image/png',
      }],
      url: baseUrl,
      siteName: 'NameMongkol',
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [{
        url: homeOgImage,
        width: 1200,
        height: 630,
        alt: 'วิเคราะห์ชื่อฟรี ไม่ต้องล็อกอิน กับ NameMongkol',
      }],
    },
  };
}

export default async function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        'name': 'NameMongkol',
        'alternateName': 'เนมมงคล',
        'url': baseUrl,
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/icon-512.png`,
          'width': 512,
          'height': 512
        },
        'sameAs': [
          'https://www.facebook.com/namemongkol',
          'https://line.me/ti/p/@namemongkol'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        'url': baseUrl,
        'name': 'NameMongkol',
        'alternateName': 'เนมมงคล',
        'description': 'ศูนย์รวมเครื่องมือวิเคราะห์ชื่อฟรี ถอดอักษรเป็นเลขศาสตร์ วิเคราะห์คู่เลขในชื่อ ค้นหาชื่อมงคล ตั้งชื่อลูก เปลี่ยนชื่อ วิเคราะห์เบอร์โทร ลายมือ ออร่า และวอลเปเปอร์เสริมดวง',
        'inLanguage': 'th-TH',
        'publisher': { '@id': `${baseUrl}/#organization` },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${baseUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/#webpage`,
        'url': baseUrl,
        'name': pageTitle,
        'isPartOf': { '@id': `${baseUrl}/#website` },
        'about': { '@id': `${baseUrl}/#name-analysis-app` },
        'publisher': { '@id': `${baseUrl}/#organization` },
        'description': pageDescription,
        'inLanguage': 'th-TH',
        'isAccessibleForFree': true,
        'dateModified': '2026-05-25',
        'primaryImageOfPage': {
          '@type': 'ImageObject',
          'url': homeOgImage,
          'width': 1200,
          'height': 630,
          'caption': 'วิเคราะห์ชื่อฟรี ถอดอักษรเป็นเลขศาสตร์และเช็กคู่เลขในชื่อกับ NameMongkol'
        },
        'speakable': {
          '@type': 'SpeakableSpecification',
          'cssSelector': ['h1', '#home-seo-answer']
        }
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${baseUrl}/#name-analysis-app`,
        'name': 'NameMongkol',
        'url': baseUrl,
        'description': 'เว็บแอปวิเคราะห์ชื่อและนามสกุลฟรีที่ถอดอักษรเป็นเลขศาสตร์ วิเคราะห์คู่เลขในชื่อและนามสกุล พร้อมเครื่องมือค้นหาชื่อมงคล เปลี่ยนชื่อ และตั้งชื่อลูก',
        'applicationCategory': 'LifestyleApplication',
        'applicationSubCategory': 'Name analysis and auspicious naming',
        'operatingSystem': 'Web',
        'browserRequirements': 'ใช้งานผ่านเว็บเบราว์เซอร์บนมือถือ แท็บเล็ต และเดสก์ท็อป',
        'isAccessibleForFree': true,
        'featureList': [
          'วิเคราะห์ชื่อฟรีโดยไม่ต้องล็อกอิน',
          'ถอดตัวอักษรแต่ละตัวเป็นค่าเลขศาสตร์',
          'วิเคราะห์คู่เลขในชื่อและนามสกุลเพื่ออ่านพลังและความหมายรายคู่',
          'คำนวณเลขศาสตร์ชื่อและนามสกุล',
          'ตรวจทักษาปกรณ์และอักษรกาลกิณีตามวันเกิด',
          'วิเคราะห์อายตนะ 6 และนิรันดร์ศาสตร์',
          'ค้นหาชื่อมงคลสำหรับเปลี่ยนชื่อและตั้งชื่อลูก'
        ],
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'THB'
        }
      },
      {
        '@type': 'HowTo',
        '@id': `${baseUrl}/#how-to-analyze-name`,
        'name': 'วิธีวิเคราะห์ชื่อมงคลออนไลน์ฟรี ไม่ต้องล็อกอิน',
        'description': 'ขั้นตอนวิเคราะห์ชื่อและนามสกุลฟรีกับ NameMongkol สำหรับเช็กชื่อปัจจุบัน เปลี่ยนชื่อ หรือตั้งชื่อลูก พร้อมดูผลรวมเลขศาสตร์และคู่เลขรายตัว',
        'totalTime': 'PT1M',
        'step': howToSteps.map((step, index) => ({
          '@type': 'HowToStep',
          'position': index + 1,
          'name': step.name,
          'text': step.text
        }))
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        'mainEntity': homeFaqs.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'NameMongkol',
            'item': baseUrl
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        id="home-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientHome />
    </>
  );
}
