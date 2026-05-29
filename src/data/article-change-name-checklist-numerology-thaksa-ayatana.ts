import type { Article } from './articles';

const checklistRows = [
    {
        item: 'เลขศาสตร์',
        whatToCheck: 'ผลรวมชื่อจริง ผลรวมนามสกุล และผลรวมชื่อเต็ม',
        whyItMatters: 'ช่วยดูพลังภาพรวมของชื่อว่าหนุนการงาน การเงิน ความสัมพันธ์ และความมั่นคงหรือไม่',
        commonMistake: 'ดูเฉพาะชื่อจริงแล้วลืมรวมกับนามสกุล',
    },
    {
        item: 'ทักษา',
        whatToCheck: 'อักษรกาลกิณี อักษรศรี เดช มนตรี และกลุ่มอักษรตามวันเกิด',
        whyItMatters: 'ช่วยให้ชื่อสอดคล้องกับวันเกิด ลดอักษรที่เชื่อว่าเป็นอุปสรรค',
        commonMistake: 'เลือกชื่อผลรวมดีแต่มีอักษรกาลกิณีตามวันเกิด',
    },
    {
        item: 'อายตนะ',
        whatToCheck: 'พลังการรับรู้ ภาพจำ เสียงเรียก และความรู้สึกเมื่อผู้อื่นเรียกชื่อ',
        whyItMatters: 'ชื่อที่ดีควรส่งผลดีต่อภาพลักษณ์ การสื่อสาร และความมั่นใจของเจ้าของชื่อ',
        commonMistake: 'เลือกชื่อเลขดีแต่เรียกยากหรือให้ความรู้สึกไม่เป็นธรรมชาติ',
    },
    {
        item: 'นามสกุล',
        whatToCheck: 'ความยาว เสียงสัมผัส ผลรวม และความหมายเมื่ออ่านต่อกับชื่อจริง',
        whyItMatters: 'นามสกุลเป็นฐานพลังของชื่อเต็ม ชื่อใหม่ต้องส่งเสริม ไม่ขัดกัน',
        commonMistake: 'เลือกชื่อที่สวยเดี่ยว ๆ แต่พอรวมกับนามสกุลแล้วเสียงสะดุดหรือผลรวมตก',
    },
];

const renderChecklistRows = () => checklistRows
    .map((row, index) => `
          <tr class="hover:bg-slate-800/50">
            <td class="px-3 py-3 text-slate-500">${index + 1}</td>
            <td class="px-3 py-3 font-bold text-white">${row.item}</td>
            <td class="px-3 py-3">${row.whatToCheck}</td>
            <td class="px-3 py-3 text-emerald-200">${row.whyItMatters}</td>
            <td class="px-3 py-3 text-rose-200">${row.commonMistake}</td>
          </tr>`)
    .join('');

export const articleChangeNameChecklistNumerologyThaksaAyatana: Article = {
    id: 'article-change-name-checklist-numerology-thaksa-ayatana',
    slug: 'change-auspicious-name-checklist-numerology-thaksa-ayatana-surname',
    title: 'เปลี่ยนชื่อมงคลต้องดูอะไรบ้าง เลขศาสตร์ ทักษา อายตนะ และนามสกุล',
    excerpt: 'คู่มือเช็กก่อนเปลี่ยนชื่อมงคล ต้องดูเลขศาสตร์ ทักษา อายตนะ และนามสกุลอย่างไร เพื่อให้ชื่อใหม่ไม่ใช่แค่เพราะ แต่หนุนดวงและใช้ได้จริง',
    coverImage: '/images/articles/cover-change-name-checklist-4-pillars.webp',
    coverImageAlt: 'เปลี่ยนชื่อมงคลต้องดูอะไรบ้าง เลขศาสตร์ ทักษา อายตนะ และนามสกุล',
    date: '2026-05-29',
    author: 'อาจารย์ณัฐ (NameMongkol)',
    category: 'เปลี่ยนชื่อมงคล',
    keywords: [
        'เปลี่ยนชื่อมงคล',
        'เปลี่ยนชื่อต้องดูอะไร',
        'เลขศาสตร์ชื่อ',
        'ทักษาชื่อ',
        'อายตนะชื่อ',
        'ชื่อกับนามสกุล',
        'วิเคราะห์ชื่อก่อนเปลี่ยน',
        'เปลี่ยนชื่อเสริมดวง',
        'ชื่อมงคลและนามสกุล',
        'เช็คชื่อก่อนเปลี่ยนชื่อ',
    ],
    metaTitle: 'เปลี่ยนชื่อมงคลต้องดูอะไรบ้าง เลขศาสตร์ ทักษา อายตนะ นามสกุล | NameMongkol',
    metaDescription: 'คู่มือก่อนเปลี่ยนชื่อมงคล ต้องดูเลขศาสตร์ ทักษา อายตนะ และนามสกุลอย่างไร พร้อม checklist จุดที่คนมักพลาดก่อนเลือกชื่อใหม่',
    relatedSlugs: [
        'free-name-analysis-numerology-guide',
        'change-name-destiny-tuning-2569',
        'what-is-name-analysis',
        'namemongkol-number-pairs',
        'thaksa-pakorn-naming-guide',
    ],
    dateModified: '2026-05-29',
    toc: [
        { title: 'เปลี่ยนชื่อมงคลต้องดูอะไรบ้าง', id: 'intro', level: 2 },
        { title: 'Checklist 4 แกนก่อนเปลี่ยนชื่อ', id: 'checklist', level: 2 },
        { title: '1. เลขศาสตร์ชื่อ', id: 'numerology', level: 2 },
        { title: '2. ทักษาตามวันเกิด', id: 'thaksa', level: 2 },
        { title: '3. อายตนะและพลังเสียงเรียก', id: 'ayatana', level: 2 },
        { title: '4. นามสกุลและชื่อเต็ม', id: 'surname', level: 2 },
        { title: 'ลำดับตรวจชื่อก่อนเปลี่ยนจริง', id: 'workflow', level: 2 },
        { title: 'FAQ', id: 'faq', level: 2 },
    ],
    faqItems: [
        {
            question: 'เปลี่ยนชื่อมงคลต้องดูอะไรเป็นอันดับแรก?',
            answer: 'ควรเริ่มจากวันเกิดและนามสกุลก่อน เพราะสองสิ่งนี้เปลี่ยนยาก จากนั้นค่อยคัดชื่อที่ไม่มีอักษรกาลกิณี มีความหมายดี และนำไปดูผลรวมเลขศาสตร์ร่วมกับนามสกุล',
        },
        {
            question: 'เลขศาสตร์ดีแล้วจำเป็นต้องดูทักษาอีกไหม?',
            answer: 'ควรดูทักษาร่วมด้วยเสมอ เพราะชื่อที่ผลรวมเลขศาสตร์ดีอาจมีอักษรกาลกิณีตามวันเกิด ทำให้ชื่อยังไม่สมดุลในอีกศาสตร์หนึ่ง',
        },
        {
            question: 'อายตนะในการตั้งชื่อคืออะไร?',
            answer: 'อายตนะในบริบทชื่อคือการดูพลังการรับรู้ของชื่อ เช่น เสียงเรียก ภาพจำ ความรู้สึกเมื่อได้ยินชื่อ และผลต่อบุคลิกหรือความมั่นใจของเจ้าของชื่อ',
        },
        {
            question: 'ทำไมต้องดูนามสกุลก่อนเปลี่ยนชื่อ?',
            answer: 'เพราะชื่อจริงจะถูกใช้ร่วมกับนามสกุลเสมอ ผลรวม เสียงอ่าน และความหมายของชื่อเต็มจึงสำคัญกว่าการดูชื่อเดี่ยวเพียงอย่างเดียว',
        },
    ],
    content: `
<div class="space-y-10">
  <section id="intro" class="space-y-5">
    <h2 class="sr-only">เปลี่ยนชื่อมงคลต้องดูอะไรบ้าง</h2>
    <p class="text-xl text-slate-300 leading-relaxed">
      การ <strong class="text-amber-300">เปลี่ยนชื่อมงคล</strong> ไม่ควรเลือกจากชื่อที่เพราะหรือผลรวมเลขศาสตร์สวยเพียงอย่างเดียว เพราะชื่อใหม่จะถูกใช้ร่วมกับวันเกิด นามสกุล เสียงเรียก และภาพจำของเจ้าของชื่อเสมอ บทความนี้สรุป 4 แกนที่ควรตรวจให้ครบก่อนตัดสินใจ ได้แก่ <strong class="text-white">เลขศาสตร์ ทักษา อายตนะ และนามสกุล</strong>
    </p>
    <div class="grid gap-4 md:grid-cols-4">
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">เลขศาสตร์</h3>
        <p class="mt-2 text-sm text-slate-300">ดูผลรวมและคู่เลขของชื่อ</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">ทักษา</h3>
        <p class="mt-2 text-sm text-slate-300">ตรวจอักษรตามวันเกิด</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">อายตนะ</h3>
        <p class="mt-2 text-sm text-slate-300">ดูเสียง ภาพจำ และพลังการรับรู้</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">นามสกุล</h3>
        <p class="mt-2 text-sm text-slate-300">ดูชื่อเต็ม ไม่ใช่ชื่อเดี่ยว</p>
      </div>
    </div>
  </section>

  <section id="checklist" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">Checklist 4 แกนก่อนเปลี่ยนชื่อ</h2>
    <div class="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/60">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-gradient-to-r from-amber-900/50 to-slate-800 text-amber-200 uppercase text-xs font-bold">
          <tr>
            <th class="px-3 py-3 w-12">#</th>
            <th class="px-3 py-3 min-w-28">ศาสตร์</th>
            <th class="px-3 py-3 min-w-64">ต้องเช็กอะไร</th>
            <th class="px-3 py-3 min-w-72">สำคัญอย่างไร</th>
            <th class="px-3 py-3 min-w-64">จุดที่มักพลาด</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
${renderChecklistRows()}
        </tbody>
      </table>
    </div>
  </section>

  <section id="numerology" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">1. เลขศาสตร์ชื่อ: ดูทั้งชื่อ นามสกุล และชื่อเต็ม</h2>
    <p class="text-slate-300 leading-relaxed">
      เลขศาสตร์คือการแปลงตัวอักษรเป็นตัวเลขแล้วหาผลรวม แต่การเปลี่ยนชื่อที่รอบคอบต้องดูมากกว่าผลรวมชื่อจริง ควรแยกดู 3 ชั้นคือ ผลรวมชื่อจริง ผลรวมนามสกุล และผลรวมชื่อจริงรวมกับนามสกุล เพราะพลังที่ใช้จริงคือชื่อเต็มที่ปรากฏในเอกสารและการเรียกขาน
    </p>
    <div class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5">
      <p class="text-emerald-100 leading-relaxed">
        ถ้าชื่อใหม่ได้เลขดี แต่พอรวมกับนามสกุลแล้วผลรวมตก หรือมีคู่เลขที่ไม่เหมาะกับเป้าหมายชีวิต ควรกลับไปปรับตัวอักษรอีกครั้งก่อนใช้จริง
      </p>
    </div>
  </section>

  <section id="thaksa" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">2. ทักษาตามวันเกิด: เลี่ยงกาลกิณีและเลือกอักษรเสริม</h2>
    <p class="text-slate-300 leading-relaxed">
      ทักษาปกรณ์ช่วยดูว่าอักษรใดเหมาะหรือไม่เหมาะกับคนเกิดแต่ละวัน ก่อนเปลี่ยนชื่อควรตรวจว่าไม่มีอักษรกาลกิณีตามวันเกิด และพิจารณาใช้อักษรที่เสริมด้านที่ต้องการ เช่น เดชเพื่ออำนาจและบารมี ศรีเพื่อโชคลาภและเสน่ห์ มนตรีเพื่อผู้ใหญ่เกื้อหนุน หรือมูละเพื่อทรัพย์ฐานะ
    </p>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-5">
        <h3 class="font-bold text-white">ควรทำ</h3>
        <p class="mt-2 text-slate-300">รู้วันเกิดให้ชัด แล้วตรวจอักษรต้องห้ามก่อนเริ่มคัดชื่อ</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-5">
        <h3 class="font-bold text-white">ควรเลี่ยง</h3>
        <p class="mt-2 text-slate-300">อย่าเลือกชื่อเพราะผลรวมเลขศาสตร์ดีโดยไม่เช็กกาลกิณี</p>
      </div>
    </div>
  </section>

  <section id="ayatana" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">3. อายตนะและพลังเสียงเรียก: ชื่อต้องดีเมื่อคนเรียกจริง</h2>
    <p class="text-slate-300 leading-relaxed">
      อายตนะในงานวิเคราะห์ชื่อคือการดูผลของชื่อผ่านการรับรู้ เช่น เสียงที่ได้ยิน ภาพจำของชื่อ ความรู้สึกของผู้เรียกและผู้ถูกเรียก ชื่อบางชื่อผลรวมดีแต่เรียกยาก สะกดซับซ้อน หรือฟังแล้วไม่เข้ากับบุคลิกเจ้าของชื่อ แบบนี้อาจไม่เหมาะกับการใช้จริงในชีวิตประจำวัน
    </p>
    <ul class="grid gap-3 text-slate-300 md:grid-cols-3">
      <li class="rounded-lg border border-slate-700 bg-slate-900/60 p-4"><strong class="text-white">เสียง:</strong> เรียกง่าย ไม่สะดุด ไม่คล้ายคำลบ</li>
      <li class="rounded-lg border border-slate-700 bg-slate-900/60 p-4"><strong class="text-white">ภาพจำ:</strong> ให้บุคลิกที่เจ้าของชื่อต้องการ</li>
      <li class="rounded-lg border border-slate-700 bg-slate-900/60 p-4"><strong class="text-white">การใช้งาน:</strong> เขียนง่าย ใช้ในงาน เอกสาร และออนไลน์ได้ดี</li>
    </ul>
  </section>

  <section id="surname" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">4. นามสกุลและชื่อเต็ม: ฐานสำคัญที่ห้ามมองข้าม</h2>
    <p class="text-slate-300 leading-relaxed">
      นามสกุลคือฐานของชื่อเต็ม หากนามสกุลยาวมาก ชื่อใหม่อาจควรสั้นลงเพื่อให้เรียกง่าย หากนามสกุลมีเสียงหนัก ชื่อจริงอาจควรมีเสียงนุ่มขึ้นเพื่อสมดุล และถ้าผลรวมนามสกุลมีแนวโน้มเฉพาะ ควรเลือกชื่อจริงที่เข้ามาหนุน ไม่ใช่ซ้ำจุดอ่อนเดิม
    </p>
    <div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5">
      <p class="text-amber-100 leading-relaxed">
        หลักจำง่าย: ชื่อจริงคือพลังที่เลือกได้ แต่นามสกุลคือฐานที่ต้องทำงานร่วมกัน ชื่อใหม่จึงควรดีเมื่ออ่านเป็นชื่อเต็ม ไม่ใช่ดีเฉพาะตอนแยกดูชื่อเดียว
      </p>
    </div>
  </section>

  <section id="workflow" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">ลำดับตรวจชื่อก่อนเปลี่ยนจริง</h2>
    <div class="space-y-3 text-slate-300 leading-relaxed">
      <p><strong class="text-white">1. กำหนดเป้าหมายของชื่อใหม่</strong> เช่น เสริมงาน เสริมเงิน เสริมความมั่นใจ หรือปรับภาพลักษณ์</p>
      <p><strong class="text-white">2. ตรวจวันเกิดและอักษรกาลกิณี</strong> เพื่อคัดชื่อที่ผิดหลักออกตั้งแต่ต้น</p>
      <p><strong class="text-white">3. คำนวณเลขศาสตร์ชื่อเต็ม</strong> ดูชื่อจริง นามสกุล และผลรวมทั้งหมดร่วมกัน</p>
      <p><strong class="text-white">4. อ่านเสียงและความหมาย</strong> ลองเรียกชื่อเต็มออกเสียงจริงหลายครั้ง แล้วดูว่าเข้ากับตัวตนหรือไม่</p>
      <p><strong class="text-white">5. ตรวจซ้ำก่อนยื่นเปลี่ยนชื่อ</strong> เพราะการแก้เอกสารหลังเปลี่ยนชื่อมีขั้นตอนตามมาอีกหลายส่วน</p>
    </div>
    <div class="flex flex-wrap gap-3 pt-2">
      <a href="/name-check" class="inline-flex items-center rounded-lg bg-amber-400 px-5 py-3 font-bold text-slate-950 hover:bg-amber-300">วิเคราะห์ชื่อก่อนเปลี่ยน</a>
      <a href="/articles/free-name-analysis-numerology-guide" class="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 font-bold text-white hover:bg-slate-800">ดูวิธีอ่านเลขศาสตร์</a>
      <a href="/articles/change-name-destiny-tuning-2569" class="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 font-bold text-white hover:bg-slate-800">คู่มือเปลี่ยนชื่อฉบับเต็ม</a>
    </div>
  </section>
</div>
`
};
