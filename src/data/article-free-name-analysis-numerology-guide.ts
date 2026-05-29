import type { Article } from './articles';

const scoreExamples = [
    {
        label: 'ตัวอย่างชื่อจริง',
        text: 'ธนชัย',
        formula: 'ธ=4 + น=5 + ช=2 + ั=4 + ย=8',
        total: 23,
        note: 'ดูเฉพาะชื่อจริง เหมาะสำหรับเทียบพลังเบื้องต้นของชื่อ',
    },
    {
        label: 'ตัวอย่างชื่อสั้น',
        text: 'กิตติ',
        formula: 'ก=1 + ิ=4 + ต=3 + ต=3 + ิ=4',
        total: 15,
        note: 'ชื่อสั้นไม่ได้แปลว่าพลังน้อย ต้องดูค่าตัวอักษรรวมกัน',
    },
    {
        label: 'ตัวอย่างชื่อ+นามสกุล',
        text: 'ธนชัย วัฒนกุล',
        formula: 'ชื่อจริง 23 + นามสกุล 26',
        total: 49,
        note: 'ผลรวมใช้งานจริงควรดูชื่อและนามสกุลร่วมกัน',
    },
];

const renderExampleRows = () => scoreExamples
    .map((row) => `
          <tr class="hover:bg-slate-800/50">
            <td class="px-3 py-3 font-bold text-white">${row.label}</td>
            <td class="px-3 py-3 text-amber-200">${row.text}</td>
            <td class="px-3 py-3">${row.formula}</td>
            <td class="px-3 py-3 text-center text-2xl font-black text-emerald-300">${row.total}</td>
            <td class="px-3 py-3 text-slate-300">${row.note}</td>
          </tr>`)
    .join('');

export const articleFreeNameAnalysisNumerologyGuide: Article = {
    id: 'article-free-name-analysis-numerology-guide',
    slug: 'free-name-analysis-numerology-guide',
    title: 'วิเคราะห์ชื่อฟรีคืออะไร ดูผลรวมเลขศาสตร์อย่างไรให้ไม่พลาด',
    excerpt: 'อธิบายการวิเคราะห์ชื่อฟรีแบบเข้าใจง่าย วิธีดูผลรวมเลขศาสตร์จากชื่อจริงและนามสกุล จุดที่ควรระวัง และวิธีอ่านผลวิเคราะห์ชื่อให้แม่นขึ้นก่อนตัดสินใจเปลี่ยนชื่อ',
    coverImage: '/images/articles/cover-free-name-analysis-numerology-guide.webp',
    coverImageAlt: 'วิเคราะห์ชื่อฟรีคืออะไร ดูผลรวมเลขศาสตร์อย่างไร',
    date: '2026-05-29',
    author: 'อาจารย์ณัฐ (NameMongkol)',
    category: 'ความรู้ศาสตร์มงคล',
    keywords: [
        'วิเคราะห์ชื่อฟรี',
        'วิเคราะห์ชื่อ',
        'ดูผลรวมเลขศาสตร์',
        'เลขศาสตร์ชื่อ',
        'วิเคราะห์ชื่อและนามสกุล',
        'เช็คชื่อฟรี',
        'เช็คชื่อมงคล',
        'ผลรวมชื่อมงคล',
        'วิธีคำนวณเลขศาสตร์ชื่อ',
        'เปลี่ยนชื่อมงคล',
    ],
    metaTitle: 'วิเคราะห์ชื่อฟรีคืออะไร ดูผลรวมเลขศาสตร์อย่างไรให้ไม่พลาด | NameMongkol',
    metaDescription: 'คู่มือวิเคราะห์ชื่อฟรี วิธีดูผลรวมเลขศาสตร์จากชื่อจริงและนามสกุล พร้อมตัวอย่างคำนวณ จุดที่คนมักพลาด และวิธีอ่านผลวิเคราะห์ชื่อให้แม่นขึ้น',
    relatedSlugs: [
        'what-is-name-analysis',
        'namemongkol-number-pairs',
        '700-auspicious-names-by-birthday-2569',
        'thaksa-pakorn-naming-guide',
        'change-name-destiny-tuning-2569',
    ],
    dateModified: '2026-05-29',
    toc: [
        { title: 'วิเคราะห์ชื่อฟรีคืออะไร', id: 'what-is-free-analysis', level: 2 },
        { title: 'เลขศาสตร์ชื่อคำนวณอย่างไร', id: 'how-numerology-works', level: 2 },
        { title: 'ตัวอย่างดูผลรวมเลขศาสตร์', id: 'score-examples', level: 2 },
        { title: 'ดูผลรวมอย่างไรให้ไม่พลาด', id: 'avoid-mistakes', level: 2 },
        { title: 'ควรดูอะไรนอกจากผลรวม', id: 'beyond-total-score', level: 2 },
        { title: 'ใช้เครื่องมือวิเคราะห์ชื่อฟรีให้คุ้ม', id: 'how-to-use-tool', level: 2 },
        { title: 'FAQ', id: 'faq', level: 2 },
    ],
    faqItems: [
        {
            question: 'วิเคราะห์ชื่อฟรีคืออะไร?',
            answer: 'วิเคราะห์ชื่อฟรีคือการตรวจพลังของชื่อเบื้องต้น เช่น ผลรวมเลขศาสตร์ อักษรกาลกิณีตามวันเกิด และความเข้ากันของชื่อกับนามสกุล โดยไม่ต้องเสียค่าใช้จ่ายก่อนเริ่มคัดชื่อจริง',
        },
        {
            question: 'ดูผลรวมเลขศาสตร์ต้องดูชื่ออย่างเดียวหรือนามสกุลด้วย?',
            answer: 'ควรดูทั้งชื่อจริงและนามสกุลร่วมกัน เพราะพลังที่ใช้จริงในเอกสารและชีวิตประจำวันคือชื่อเต็ม หากดูชื่อจริงอย่างเดียวอาจพลาดภาพรวมของผลรวมทั้งหมด',
        },
        {
            question: 'ผลรวมเลขศาสตร์ดีแล้วแปลว่าชื่อนั้นดีแน่นอนไหม?',
            answer: 'ยังไม่เสมอไป ควรดูทักษาตามวันเกิด อักษรกาลกิณี คู่เลขในชื่อ ความหมาย และความไพเราะร่วมกันด้วย เพราะชื่อที่ดีควรสมดุลหลายมิติ',
        },
        {
            question: 'ถ้าไม่รู้วันเกิดยังวิเคราะห์ชื่อฟรีได้ไหม?',
            answer: 'ยังดูผลรวมเลขศาสตร์และความหมายเบื้องต้นได้ แต่การตรวจทักษาและอักษรกาลกิณีจะละเอียดขึ้นเมื่อรู้วันเกิดของเจ้าของชื่อ',
        },
    ],
    content: `
<div class="space-y-10">
  <section id="what-is-free-analysis" class="space-y-5">
    <h2 class="sr-only">วิเคราะห์ชื่อฟรีคืออะไร</h2>
    <p class="text-xl text-slate-300 leading-relaxed">
      <strong class="text-amber-300">วิเคราะห์ชื่อฟรี</strong> คือการตรวจพลังของชื่อเบื้องต้นก่อนตัดสินใจใช้ชื่อจริง เปลี่ยนชื่อ หรือตั้งชื่อลูก โดยดูทั้ง <strong class="text-white">ผลรวมเลขศาสตร์</strong> อักษรตามวันเกิด ความหมายของชื่อ และความเข้ากันกับนามสกุล จุดสำคัญคือไม่ควรดูแค่ “เลขรวมสวยไหม” แต่ต้องดูว่าพลังของชื่อเต็มเหมาะกับเจ้าของชื่อหรือไม่
    </p>
    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">ดูผลรวม</h3>
        <p class="mt-2 text-sm text-slate-300">แปลงตัวอักษรไทยเป็นตัวเลข แล้วบวกค่าทั้งชื่อหรือนามสกุล</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">ดูวันเกิด</h3>
        <p class="mt-2 text-sm text-slate-300">ตรวจอักษรกาลกิณีและกลุ่มทักษาที่ควรเสริมตามวันเกิด</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">ดูชื่อเต็ม</h3>
        <p class="mt-2 text-sm text-slate-300">ชื่อจริงที่ดีควรอ่านพร้อมนามสกุล เพราะผลรวมชื่อเต็มคือพลังใช้งานจริง</p>
      </div>
    </div>
  </section>

  <section id="how-numerology-works" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">เลขศาสตร์ชื่อคำนวณอย่างไร</h2>
    <p class="text-slate-300 leading-relaxed">
      หลักเลขศาสตร์ชื่อจะกำหนดค่าตัวเลขให้ตัวอักษรแต่ละตัว เช่น ก=1, ข=2, ค=4, จ=6, น=5, ย=8 รวมถึงสระและวรรณยุกต์บางตัว จากนั้นนำค่าทั้งหมดมาบวกกันเป็นผลรวมของชื่อ การดูผลที่แม่นขึ้นควรแยกเป็น 3 ชั้น: ผลรวมชื่อจริง, ผลรวมนามสกุล และผลรวมชื่อจริง+นามสกุล
    </p>
    <div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5">
      <p class="text-amber-100 leading-relaxed">
        สูตรจำง่าย: เขียนชื่อให้ตรงตามบัตรประชาชน → แปลงตัวอักษรทุกตัวเป็นเลข → บวกผลรวมชื่อจริง → บวกผลรวมนามสกุล → อ่านผลชื่อเต็มร่วมกับวันเกิด
      </p>
    </div>
  </section>

  <section id="score-examples" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">ตัวอย่างดูผลรวมเลขศาสตร์</h2>
    <div class="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/60">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-gradient-to-r from-emerald-900/50 to-slate-800 text-emerald-200 uppercase text-xs font-bold">
          <tr>
            <th class="px-3 py-3 min-w-36">กรณี</th>
            <th class="px-3 py-3 min-w-32">ข้อความ</th>
            <th class="px-3 py-3 min-w-72">วิธีบวก</th>
            <th class="px-3 py-3 text-center">ผลรวม</th>
            <th class="px-3 py-3 min-w-64">ข้อสังเกต</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
${renderExampleRows()}
        </tbody>
      </table>
    </div>
    <p class="text-sm text-slate-400 leading-relaxed">
      ตัวอย่างนี้แสดงวิธีดูผลรวมเบื้องต้นเท่านั้น การแปลว่าดีหรือควรปรับต้องอ่านร่วมกับตำราเลขศาสตร์ คู่เลขในชื่อ ทักษา และวันเกิด
    </p>
  </section>

  <section id="avoid-mistakes" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">ดูผลรวมอย่างไรให้ไม่พลาด</h2>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-5">
        <h3 class="font-bold text-white">1. อย่าดูชื่อจริงอย่างเดียว</h3>
        <p class="mt-2 text-slate-300 leading-relaxed">หลายคนเจอชื่อจริงผลรวมดี แต่พอรวมกับนามสกุลแล้วพลังเปลี่ยนไป ควรตรวจชื่อเต็มทุกครั้ง</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-5">
        <h3 class="font-bold text-white">2. อย่าลืมสระและวรรณยุกต์</h3>
        <p class="mt-2 text-slate-300 leading-relaxed">การเขียนชื่อผิดหนึ่งตัวอาจทำให้ผลรวมเปลี่ยน ต้องใช้ตัวสะกดจริงตามเอกสาร</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-5">
        <h3 class="font-bold text-white">3. อย่าดูเลขรวมโดยตัดวันเกิดทิ้ง</h3>
        <p class="mt-2 text-slate-300 leading-relaxed">ชื่อที่ผลรวมดีอาจมีอักษรกาลกิณีของวันเกิด จึงควรตรวจวันเกิดควบคู่เสมอ</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-5">
        <h3 class="font-bold text-white">4. อย่ามองข้ามคู่เลข</h3>
        <p class="mt-2 text-slate-300 leading-relaxed">บางชื่อผลรวมดี แต่คู่เลขภายในชื่ออาจมีพลังขัดแย้ง ควรอ่านทั้งผลรวมและลำดับเลขในชื่อ</p>
      </div>
    </div>
  </section>

  <section id="beyond-total-score" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">ควรดูอะไรนอกจากผลรวม</h2>
    <p class="text-slate-300 leading-relaxed">
      การวิเคราะห์ชื่อที่ดีควรดูมากกว่าเลขรวม เพราะชื่อคือชุดพลังหลายชั้น ทั้งเสียงอ่าน ความหมาย ตัวอักษร วันเกิด และนามสกุล หากต้องการเลือกชื่อให้ใช้งานจริง ควรตรวจอย่างน้อย 5 เรื่องนี้
    </p>
    <ul class="grid gap-3 text-slate-300 md:grid-cols-2">
      <li class="rounded-lg border border-slate-700 bg-slate-900/60 p-4"><strong class="text-white">ความหมาย:</strong> ชื่อควรมีความหมายดี ไม่กำกวม และเหมาะกับเพศ/บุคลิก</li>
      <li class="rounded-lg border border-slate-700 bg-slate-900/60 p-4"><strong class="text-white">ทักษา:</strong> ตรวจอักษรกาลกิณีและกลุ่มอักษรเสริมตามวันเกิด</li>
      <li class="rounded-lg border border-slate-700 bg-slate-900/60 p-4"><strong class="text-white">คู่เลข:</strong> อ่านพลังเลขที่เรียงต่อกันในชื่อ ไม่ดูแค่ผลรวมปลายทาง</li>
      <li class="rounded-lg border border-slate-700 bg-slate-900/60 p-4"><strong class="text-white">เสียงอ่าน:</strong> ชื่อควรเรียกง่าย ไม่คล้ายคำลบ และเข้ากับนามสกุล</li>
    </ul>
  </section>

  <section id="how-to-use-tool" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">ใช้เครื่องมือวิเคราะห์ชื่อฟรีให้คุ้ม</h2>
    <div class="space-y-3 text-slate-300 leading-relaxed">
      <p><strong class="text-white">1. กรอกชื่อจริงและนามสกุลให้ตรงเอกสาร</strong> รวมสระ วรรณยุกต์ และการันต์ให้ครบ</p>
      <p><strong class="text-white">2. ใส่วันเกิดถ้ารู้</strong> เพื่อให้ระบบตรวจทักษาและอักษรกาลกิณีได้แม่นขึ้น</p>
      <p><strong class="text-white">3. อ่านผลรวมและคำแนะนำคู่กัน</strong> อย่าดูแค่คะแนนสูงหรือต่ำ แต่ดูว่าเสียตรงไหนและควรปรับอะไร</p>
    </div>
    <div class="flex flex-wrap gap-3 pt-2">
      <a href="/name-check" class="inline-flex items-center rounded-lg bg-amber-400 px-5 py-3 font-bold text-slate-950 hover:bg-amber-300">วิเคราะห์ชื่อฟรี</a>
      <a href="/articles/namemongkol-number-pairs" class="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 font-bold text-white hover:bg-slate-800">อ่านเรื่องคู่เลขในชื่อ</a>
      <a href="/articles/what-is-name-analysis" class="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 font-bold text-white hover:bg-slate-800">พื้นฐานการวิเคราะห์ชื่อ</a>
    </div>
  </section>
</div>
`
};
