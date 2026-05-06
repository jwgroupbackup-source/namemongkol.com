import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import ClientHome from './ClientHome';
import { calculateScore } from '@/utils/calculateScore';
import { getPrediction } from '@/utils/getPrediction';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const name = searchParams.name as string | undefined;
  const surname = searchParams.surname as string | undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

  const canonicalUrl = siteUrl.replace(/\/$/, '') || 'https://www.namemongkol.com';

  if (!name) {
    return {
      title: 'วิเคราะห์ชื่อ-นามสกุล ฟรี 2569 ด้วย AI 4 ศาสตร์ | NameMongkol',
      description: 'วิเคราะห์ชื่อ-นามสกุลฟรีแบบรายชื่อ ด้วยระบบ AI ผสาน 4 ศาสตร์: เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์ เช็คพลังเงา ผลรวมชื่อ และอักษรกาลกิณีอย่างละเอียด',
      keywords: 'วิเคราะห์ชื่อ, วิเคราะห์นามสกุล, วิเคราะห์ชื่อมงคล, วิเคราะห์ชื่อฟรี, วิเคราะห์ชื่อ-นามสกุล 2569, ดูดวงชื่อ, ผลรวมเลขศาสตร์, อักษรกาลกิณี, เลขศาสตร์, ทักษาปกรณ์, อายตนะ 6, นิรันดร์ศาสตร์, NameMongkol',
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: 'วิเคราะห์ชื่อ-นามสกุล ฟรี 2569 ด้วย AI 4 ศาสตร์ | NameMongkol',
        description: 'วิเคราะห์ชื่อ-นามสกุลฟรี เช็คพลังเงา ผลรวมเลขศาสตร์ และอักษรกาลกิณีด้วย AI ผสาน 4 ศาสตร์',
        images: [{
          url: `${siteUrl}/api/og?variant=default&title=NameMongkol%20-%20วิเคราะห์ชื่อมงคล&subtitle=เช็คพลังเงา%20ผลรวมเลขศาสตร์%20และความหมายชื่อของคุณ`,
          width: 1200,
          height: 630,
          alt: 'วิเคราะห์ชื่อ ฟรี ด้วย AI ผสาน 4 ศาสตร์ - NameMongkol',
          type: 'image/png',
        }],
        url: 'https://www.namemongkol.com',
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ชื่อ-นามสกุล ฟรี 2569 ด้วย AI 4 ศาสตร์ | NameMongkol',
        description: 'วิเคราะห์ชื่อ-นามสกุลฟรี เช็คพลังเงา ผลรวมเลขศาสตร์ และอักษรกาลกิณีด้วย AI ผสาน 4 ศาสตร์',
        images: [{
          url: `${siteUrl}/api/og?variant=default`,
          width: 1200,
          height: 630,
          alt: 'วิเคราะห์ชื่อ ฟรี - NameMongkol',
        }],
      },

    }
  }

  const cleanName = name.trim();
  const cleanSurname = (surname || '').trim();
  const totalScore = calculateScore(cleanName) + calculateScore(cleanSurname);
  const prediction = getPrediction(totalScore);

  const title = `วิเคราะห์ชื่อ: ${cleanName} ${cleanSurname} (ผลรวม ${totalScore})`;
  const description = `ความหมาย: ${prediction.desc} - ระดับ: ${prediction.level}`;

  return {
    title: `${title} - NameMongkol`,
    description: description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: title,
      description: description,
      images: [`${siteUrl}/api/og?variant=analysis&name=${encodeURIComponent(cleanName)}&surname=${encodeURIComponent(cleanSurname)}&score=${totalScore}&subtitle=${encodeURIComponent(description)}`],
      url: `/?name=${encodeURIComponent(cleanName)}&surname=${encodeURIComponent(cleanSurname)}&day=${searchParams.day || 'sunday'}`,
      type: 'website',
    }
  }
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.namemongkol.com/#website',
        'url': 'https://www.namemongkol.com',
        'name': 'NameMongkol',
        'description': 'วิเคราะห์ชื่อ ตั้งชื่อมงคล ตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง ด้วยระบบ AI ผสาน 4 ศาสตร์',
        'inLanguage': 'th-TH',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://www.namemongkol.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.namemongkol.com/#webpage',
        'url': 'https://www.namemongkol.com',
        'name': 'วิเคราะห์ชื่อ ฟรี! ตั้งชื่อมงคล เปลี่ยนชื่อเสริมดวง 2569 | NameMongkol',
        'isPartOf': { '@id': 'https://www.namemongkol.com/#website' },
        'description': 'วิเคราะห์ชื่อ นามสกุล ฟรี! วิเคราะห์ชื่อมงคล ตั้งชื่อลูก ด้วยระบบ AI ผสาน 4 ศาสตร์',
        'inLanguage': 'th-TH',
        'primaryImageOfPage': {
          '@type': 'ImageObject',
          'url': 'https://www.namemongkol.com/api/og?variant=default&title=NameMongkol%20-%20วิเคราะห์ชื่อมงคล&subtitle=เช็คพลังเงา%20ผลรวมเลขศาสตร์%20และความหมายชื่อของคุณ',
          'width': 1200,
          'height': 630,
          'caption': 'วิเคราะห์ชื่อมงคล ฟรี ด้วย AI ผสาน 4 ศาสตร์ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์ - NameMongkol'
        }
      },
      {
        '@type': 'SoftwareApplication',
        'name': 'NameMongkol - วิเคราะห์ชื่อมงคล',
        'description': 'แอปพลิเคชันวิเคราะห์ชื่อมงคลด้วย AI ผสาน 4 ศาสตร์ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์',
        'applicationCategory': 'LifestyleApplication',
        'operatingSystem': 'Web',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'THB'
        }
      },
      {
        '@type': 'HowTo',
        'name': 'วิธีวิเคราะห์ชื่อมงคลออนไลน์ ฟรี',
        'description': 'ขั้นตอนการวิเคราะห์ชื่อมงคลที่ NameMongkol — ง่ายเพียง 3 ขั้นตอน',
        'totalTime': 'PT1M',
        'step': [
          {
            '@type': 'HowToStep',
            'position': 1,
            'name': 'กรอกชื่อ-นามสกุล',
            'text': 'พิมพ์ชื่อและนามสกุลของคุณในช่องด้านบน ระบบรองรับทั้งชื่อภาษาไทยและภาษาอังกฤษ'
          },
          {
            '@type': 'HowToStep',
            'position': 2,
            'name': 'เลือกวันเกิด',
            'text': 'เลือกวันเกิดเพื่อตรวจสอบอักษรทักษาปกรณ์ กาลกิณี และอายตนะ 6 ที่ตรงกับดวงชะตาของคุณ'
          },
          {
            '@type': 'HowToStep',
            'position': 3,
            'name': 'กดวิเคราะห์ รอผลทันที',
            'text': 'กดปุ่มวิเคราะห์ ระบบ AI จะคำนวณผลรวมเลขศาสตร์ ตรวจสอบทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์ พร้อมแสดงผลครบ 4 ศาสตร์ทันที'
          }
        ]
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'วิเคราะห์ชื่อมงคล คืออะไร ทำไมต้องเช็ค?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'การวิเคราะห์ชื่อมงคลคือการตรวจสอบว่าชื่อ-นามสกุลส่งผลอย่างไรต่อดวงชะตาเจ้าชื่อ โดยใช้หลักเลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์ ชื่อที่มงคลจะช่วยเสริมโชคลาภ การงาน และลดอุปสรรคในชีวิต NameMongkol ให้บริการวิเคราะห์ชื่อมงคลฟรีด้วยระบบ AI ที่ผสานศาสตร์โบราณ 4 แขนง'
            }
          },
          {
            '@type': 'Question',
            'name': 'วิเคราะห์ชื่อมงคลที่ NameMongkol แม่นยำแค่ไหน?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'NameMongkol ใช้ระบบ AI ประมวลผลร่วมกับ 4 ศาสตร์หลัก ได้แก่ เลขศาสตร์, ทักษาปกรณ์, อายตนะ 6 และนิรันดร์ศาสตร์ ซึ่งเป็นตำราโหราศาสตร์ไทยโบราณที่ได้รับการยอมรับ ทำให้ผลลัพธ์มีความละเอียดและแม่นยำกว่าโปรแกรมทั่วไป'
            }
          },
          {
            '@type': 'Question',
            'name': 'วิเคราะห์ชื่อมงคลฟรีที่ NameMongkol ต้องสมัครสมาชิกไหม?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'ไม่ต้องสมัครสมาชิก! NameMongkol ให้บริการวิเคราะห์ชื่อมงคลฟรี ไม่จำกัดจำนวนครั้ง คุณสามารถกรอกชื่อและวันเกิดเพื่อดูผลวิเคราะห์ครบทั้ง 4 ศาสตร์ได้ทันที สำหรับบริการเพิ่มเติม เช่น วิเคราะห์หลายชื่อพร้อมกัน (Bulk Analysis) หรือค้นหาชื่อมงคล Premium จะใช้ระบบเครดิต'
            }
          },
          {
            '@type': 'Question',
            'name': 'ผลรวมตัวเลขที่ดีที่สุด ควรเป็นเลขอะไร?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'ผลรวมที่ดีขึ้นอยู่กับอาชีพและดวงชะตาของแต่ละบุคคล แต่โดยทั่วไป ผลรวมที่จัดว่าดีเยี่ยมในระดับสากล ได้แก่ 14, 15, 24, 36, 41, 42, 45, 50, 51, 54, 56, 59, 63, 65 ซึ่งส่งผลดีในด้านความสำเร็จและการเงิน'
            }
          },
          {
            '@type': 'Question',
            'name': 'เปลี่ยนชื่อแล้ว ชีวิตจะดีขึ้นภายในกี่วัน?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'ตามหลักครูบาอาจารย์ เชื่อว่าเมื่อเปลี่ยนชื่อใหม่แล้ว จะเริ่มเห็นผลการเปลี่ยนแปลงภายใน 3-6 เดือน โดยพลังของชื่อใหม่จะค่อยๆ ส่งผลต่อความคิด การตัดสินใจ และดึงดูดสิ่งดีๆ เข้ามา ทั้งนี้ขึ้นอยู่กับการทำบุญและการปฏิบัติตนควบคู่กันไปด้วย'
            }
          },
          {
            '@type': 'Question',
            'name': 'อักษรกาลกิณี คืออะไร? ทำไมต้องห้าม?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'อักษรกาลกิณี คือพยัญชนะที่เป็นอริกับดวงวันเกิด หากมีในชื่อจะเปรียบเสมือนมีอุปสรรคขัดขวาง ทำให้ชีวิตเหนื่อยยาก มีศัตรู หรือเกิดอุบัติเหตุได้ง่าย การตั้งชื่อมงคลจึงควรหลีกเลี่ยงอักษรกาลกิณีอย่างเด็ดขาด'
            }
          },
          {
            '@type': 'Question',
            'name': 'ใช้ NameMongkol ตั้งชื่อลูกได้หรือไม่?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'ได้แน่นอน! ระบบของเราสามารถใช้วิเคราะห์เพื่อตั้งชื่อลูกแรกเกิดได้ โดยพิจารณาจากวันเกิด (ทักษา) เพื่อหาตัวอักษรที่เป็นมงคล (เดช, ศรี, มนตรี) และหลีกเลี่ยงกาลกิณี เพื่อวางรากฐานชีวิตที่ดีให้กับบุตรหลานของคุณ'
            }
          },
          {
            '@type': 'Question',
            'name': 'พลังเงาในชื่อคืออะไร?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'พลังเงาคือพลังงานซ่อนเร้นในชื่อที่ส่งผลต่อบุคลิกภาพและโชคชะตา วิเคราะห์จากตัวอักษรและผลรวมเลขศาสตร์ ช่วยให้เข้าใจจุดแข็งจุดอ่อนของชื่อ'
            }
          },
          {
            '@type': 'Question',
            'name': 'วิเคราะห์ชื่อ นามสกุล ฟรี ต้องทำอย่างไร?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'กรอกชื่อและนามสกุลในช่องด้านบน เลือกวันเกิด แล้วกดวิเคราะห์ NameMongkol จะคำนวณผลรวมเลขศาสตร์ของทั้งชื่อและนามสกุลพร้อมกัน วิเคราะห์ชื่อ นามสกุล ฟรี ไม่ต้องสมัครสมาชิก รู้ผลทันที ครบทั้ง 4 ศาสตร์'
            }
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'วิเคราะห์ชื่อมงคล',
            'item': 'https://www.namemongkol.com'
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="home-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <ClientHome />
      </Suspense>
    </>
  );
}
