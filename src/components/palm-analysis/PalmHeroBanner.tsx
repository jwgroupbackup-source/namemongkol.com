'use client';

import React from 'react';
import Image from 'next/image';

export default function PalmHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/20 mb-2 sm:mb-6 shadow-xl shadow-black/20">
      {/* SEO: H1 ซ่อนไว้ให้ search engine อ่านได้ — ข้อความแสดงอยู่ในภาพแบนเนอร์แล้ว */}
      <h1 className="sr-only">วิเคราะห์ลายมือออนไลน์ แบบมืออาชีพด้วย AI</h1>

      <Image
        src="/banner/ai-palm-reading-online-banner.webp"
        alt="วิเคราะห์ลายมือด้วย AI - วิเคราะห์ลายมือออนไลน์ 4 เส้นหลัก เส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนา | NameMongkol"
        width={1568}
        height={400}
        className="w-full h-auto rounded-2xl sm:rounded-3xl"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        priority
      />
    </section>
  );
}
