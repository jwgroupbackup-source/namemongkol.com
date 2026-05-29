import type { Article } from './articles';

type NamePart = {
    word: string;
    reading: string;
    meaning: string;
};

type NameRow = {
    name: string;
    reading: string;
    meaning: string;
    group: string;
};

const sundayKalakiniPattern = /[ศษสหฬฮ]/;

const prefixes: NamePart[] = [
    { word: 'ธน', reading: 'ทะ-นะ', meaning: 'ทรัพย์และความมั่นคง' },
    { word: 'เดช', reading: 'เดด', meaning: 'อำนาจและบารมี' },
    { word: 'ชัย', reading: 'ไช', meaning: 'ชัยชนะ' },
    { word: 'ภัทร', reading: 'พัด', meaning: 'ความดีงามและความเจริญ' },
    { word: 'ธีร', reading: 'ที-ระ', meaning: 'นักปราชญ์ผู้กล้าหาญ' },
    { word: 'กิตติ', reading: 'กิด-ติ', meaning: 'เกียรติและชื่อเสียงดี' },
    { word: 'กร', reading: 'กอน', meaning: 'ผู้กระทำการสำเร็จ' },
    { word: 'ภูมิ', reading: 'พูม', meaning: 'แผ่นดินและความสง่างาม' },
    { word: 'บวร', reading: 'บอ-วอน', meaning: 'ความประเสริฐ' },
    { word: 'วร', reading: 'วอน', meaning: 'พรอันประเสริฐ' },
    { word: 'ปัญญ', reading: 'ปัน-ยา', meaning: 'ปัญญาและความรู้' },
    { word: 'กานต์', reading: 'กาน', meaning: 'เป็นที่รัก' },
    { word: 'อนันต์', reading: 'อะ-นัน', meaning: 'ความไม่สิ้นสุด' },
    { word: 'มนตรี', reading: 'มน-ตรี', meaning: 'ผู้เป็นที่ปรึกษา' },
    { word: 'รัตน์', reading: 'รัด', meaning: 'แก้วอันประเสริฐ' },
    { word: 'ภพ', reading: 'พบ', meaning: 'โลกและความรุ่งเรือง' },
];

const suffixes: NamePart[] = [
    { word: 'เดช', reading: 'เดด', meaning: 'อำนาจและบารมี' },
    { word: 'ชัย', reading: 'ไช', meaning: 'ชัยชนะ' },
    { word: 'ภัทร', reading: 'พัด', meaning: 'ความดีงาม' },
    { word: 'วัฒน์', reading: 'วัด', meaning: 'ความเจริญก้าวหน้า' },
    { word: 'กิตติ', reading: 'กิด-ติ', meaning: 'เกียรติที่ดี' },
    { word: 'กรณ์', reading: 'กอน', meaning: 'การงานและการกระทำ' },
    { word: 'พล', reading: 'พน', meaning: 'กำลังและพลังใจ' },
    { word: 'กานต์', reading: 'กาน', meaning: 'ความรักและความน่าชื่นชม' },
    { word: 'นันท์', reading: 'นัน', meaning: 'ความสุขและความยินดี' },
    { word: 'บวร', reading: 'บอ-วอน', meaning: 'ความประเสริฐ' },
    { word: 'รัตน์', reading: 'รัด', meaning: 'แก้วอันประเสริฐ' },
    { word: 'ธีร์', reading: 'ที', meaning: 'นักปราชญ์' },
    { word: 'ภูมิ', reading: 'พูม', meaning: 'ภูมิฐานและสง่างาม' },
    { word: 'ภพ', reading: 'พบ', meaning: 'โลกและความมั่นคง' },
    { word: 'บดินทร์', reading: 'บอ-ดิน', meaning: 'ผู้เป็นใหญ่ในแผ่นดิน' },
    { word: 'ปัญญ์', reading: 'ปัน', meaning: 'ผู้มีปัญญา' },
];

const getGroup = (name: string): string => {
    if (name.includes('เดช') || name.includes('ชัย') || name.includes('พล') || name.includes('บดินทร์')) {
        return 'อำนาจ บารมี และภาวะผู้นำ';
    }

    if (name.includes('ธน') || name.includes('รัตน์') || name.includes('วัฒน์')) {
        return 'ทรัพย์ ความมั่นคง และความเจริญ';
    }

    if (name.includes('ธี') || name.includes('ปัญญ') || name.includes('มนตรี')) {
        return 'ปัญญา ความคิด และผู้ใหญ่เกื้อหนุน';
    }

    return 'ชื่อเท่ เรียกง่าย และภาพลักษณ์ดี';
};

const buildNames = (): NameRow[] => {
    const rows: NameRow[] = [];
    const seen = new Set<string>();

    for (const prefix of prefixes) {
        for (const suffix of suffixes) {
            if (prefix.word === suffix.word) {
                continue;
            }

            const name = `${prefix.word}${suffix.word}`;

            if (seen.has(name) || sundayKalakiniPattern.test(name)) {
                continue;
            }

            seen.add(name);
            rows.push({
                name,
                reading: `${prefix.reading}-${suffix.reading}`,
                meaning: `${prefix.meaning} ผู้มี${suffix.meaning}`,
                group: getGroup(name),
            });
        }
    }

    return rows.slice(0, 180);
};

const nameRows = buildNames();

const renderRows = (rows: NameRow[], offset: number) => rows
    .map((row, index) => `
          <tr class="hover:bg-slate-800/50">
            <td class="px-3 py-3 text-slate-500">${offset + index + 1}</td>
            <td class="px-3 py-3 font-bold text-white text-lg">${row.name}</td>
            <td class="px-3 py-3 text-orange-300">${row.reading}</td>
            <td class="px-3 py-3">${row.meaning}</td>
            <td class="px-3 py-3 text-amber-200">${row.group}</td>
          </tr>`)
    .join('');

const renderTable = (title: string, id: string, rows: NameRow[], offset: number, intro: string) => `
  <section id="${id}" class="space-y-4">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold text-white">${title}</h2>
      <p class="mt-3 text-slate-300 leading-relaxed">${intro}</p>
    </div>
    <div class="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/60">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-gradient-to-r from-orange-900/50 to-slate-800 text-orange-200 uppercase text-xs font-bold">
          <tr>
            <th class="px-3 py-3 w-12">#</th>
            <th class="px-3 py-3 min-w-32">ชื่อ</th>
            <th class="px-3 py-3 min-w-36">คำอ่าน</th>
            <th class="px-3 py-3 min-w-72">ความหมาย</th>
            <th class="px-3 py-3 min-w-52">แนวทางเสริม</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
${renderRows(rows, offset)}
        </tbody>
      </table>
    </div>
  </section>`;

const leaderNames = nameRows.slice(0, 45);
const wealthNames = nameRows.slice(45, 90);
const wisdomNames = nameRows.slice(90, 135);
const modernNames = nameRows.slice(135, 180);

export const articleSundayBoyNamesAvoidKalakini2569: Article = {
    id: 'article-sunday-boy-names-avoid-kalakini-2569',
    slug: 'sunday-boy-names-2569-avoid-kalakini',
    title: '180 ชื่อมงคลผู้ชายวันอาทิตย์ 2569 หลีกเลี่ยงอักษรกาลกิณี',
    excerpt: 'รวมชื่อมงคลผู้ชายวันอาทิตย์ 2569 คัดให้หลีกเลี่ยงอักษรกาลกิณี ศ ษ ส ห ฬ ฮ ตามหลักทักษา พร้อมคำอ่าน ความหมาย และแนวทางเลือกชื่อให้เหมาะกับลูกชาย',
    coverImage: '/images/articles/cover-sunday-boy-avoid-kalakini-2569.webp',
    coverImageAlt: 'ชื่อมงคลผู้ชายวันอาทิตย์ 2569 หลีกเลี่ยงอักษรกาลกิณี',
    date: '2026-05-29',
    author: 'อาจารย์ณัฐ (NameMongkol)',
    category: 'ชื่อมงคลตามวันเกิด',
    keywords: [
        'ชื่อมงคลผู้ชายวันอาทิตย์ 2569',
        'ชื่อผู้ชายวันอาทิตย์',
        'ชื่อลูกชายวันอาทิตย์',
        'ตั้งชื่อลูกชายวันอาทิตย์',
        'ชื่อมงคลวันอาทิตย์ผู้ชาย',
        'ชื่อวันอาทิตย์หลีกเลี่ยงกาลกิณี',
        'อักษรกาลกิณีวันอาทิตย์',
        'ชื่อผู้ชายไม่มี ศ ษ ส ห ฬ ฮ',
        'ชื่อมงคลลูกชาย 2569',
        'ทักษาวันอาทิตย์ ผู้ชาย',
    ],
    metaTitle: '180 ชื่อมงคลผู้ชายวันอาทิตย์ 2569 หลีกเลี่ยงอักษรกาลกิณี | NameMongkol',
    metaDescription: 'รวม 180 ชื่อมงคลผู้ชายวันอาทิตย์ 2569 เลี่ยงอักษรกาลกิณี ศ ษ ส ห ฬ ฮ พร้อมคำอ่าน ความหมาย และวิธีเลือกชื่อให้เข้ากับนามสกุล',
    relatedSlugs: [
        '700-auspicious-names-by-birthday-2569',
        'auspicious-boy-names-2569',
        'boy-names-2569-50-auspicious',
        'forbidden-letters-kalakini',
        'thaksa-pakorn-naming-guide',
    ],
    dateModified: '2026-05-29',
    toc: [
        { title: 'อักษรกาลกิณีวันอาทิตย์คืออะไร', id: 'intro', level: 2 },
        { title: 'ชื่อผู้ชายวันอาทิตย์ กลุ่มผู้นำและบารมี', id: 'leader', level: 2 },
        { title: 'ชื่อผู้ชายวันอาทิตย์ กลุ่มทรัพย์และความมั่นคง', id: 'wealth', level: 2 },
        { title: 'ชื่อผู้ชายวันอาทิตย์ กลุ่มปัญญาและผู้ใหญ่เกื้อหนุน', id: 'wisdom', level: 2 },
        { title: 'ชื่อผู้ชายวันอาทิตย์ กลุ่มเท่ กระชับ จำง่าย', id: 'modern', level: 2 },
        { title: 'วิธีเลือกชื่อผู้ชายวันอาทิตย์ให้ใช้ได้จริง', id: 'how-to-choose', level: 2 },
        { title: 'FAQ', id: 'faq', level: 2 },
    ],
    faqItems: [
        {
            question: 'อักษรกาลกิณีของคนเกิดวันอาทิตย์คืออะไร?',
            answer: 'ตามหลักทักษา คนเกิดวันอาทิตย์ควรหลีกเลี่ยงอักษร ศ ษ ส ห ฬ ฮ ในชื่อ เพราะเป็นกลุ่มกาลกิณีที่เชื่อว่าอาจเพิ่มอุปสรรคหรือพลังติดขัดให้เจ้าของชื่อ',
        },
        {
            question: 'ชื่อผู้ชายวันอาทิตย์ในบทความนี้เลี่ยงกาลกิณีครบไหม?',
            answer: 'รายชื่อในบทความนี้คัดโดยตัดอักษร ศ ษ ส ห ฬ ฮ ออกจากตัวสะกดของชื่อทั้งหมด เพื่อให้เหมาะกับการเริ่มคัดชื่อผู้ชายเกิดวันอาทิตย์',
        },
        {
            question: 'ต้องดูเลขศาสตร์ร่วมด้วยหรือไม่?',
            answer: 'ควรดูร่วมด้วยเสมอ เพราะชื่อที่เลี่ยงกาลกิณีได้ดีแล้วยังควรมีผลรวมเลขศาสตร์ที่เข้ากับนามสกุล วันเกิด และเป้าหมายชีวิตของเจ้าของชื่อ',
        },
        {
            question: 'ถ้าชื่อมีเสียง ส แต่ไม่มีตัว ส เขียนในชื่อ ใช้ได้ไหม?',
            answer: 'โดยหลักทักษาจะดูตัวอักษรที่เขียนปรากฏในชื่อเป็นหลัก หากไม่มี ศ ษ ส ห ฬ ฮ ในตัวสะกด ก็ถือว่าเลี่ยงกาลกิณีวันอาทิตย์ในระดับตัวอักษรแล้ว',
        },
    ],
    content: `
<div class="space-y-10">
  <section id="intro" class="space-y-5">
    <h2 class="sr-only">อักษรกาลกิณีวันอาทิตย์คืออะไร</h2>
    <p class="text-xl text-slate-300 leading-relaxed">
      การตั้ง <strong class="text-amber-300">ชื่อมงคลผู้ชายวันอาทิตย์ 2569</strong> ควรเริ่มจากการคัดอักษรกาลกิณีออกก่อน โดยคนเกิดวันอาทิตย์ควรหลีกเลี่ยง <strong class="text-rose-300">ศ ษ ส ห ฬ ฮ</strong> ตามหลักทักษา จากนั้นจึงค่อยดูความหมาย คำอ่าน ความไพเราะ และผลรวมชื่อร่วมกับนามสกุล
    </p>
    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">เลี่ยงกาลกิณีก่อน</h3>
        <p class="mt-2 text-sm text-slate-300">ตัดชื่อที่มี ศ ษ ส ห ฬ ฮ ออก เพื่อให้ตรงหลักวันอาทิตย์</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">คุมภาพลักษณ์ผู้ชาย</h3>
        <p class="mt-2 text-sm text-slate-300">เลือกชื่อที่ให้โทนผู้นำ กล้าหาญ มั่นคง และเรียกง่าย</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">ตรวจชื่อกับนามสกุล</h3>
        <p class="mt-2 text-sm text-slate-300">ชื่อจริงควรเช็กเลขศาสตร์ร่วมกับนามสกุลก่อนใช้จริง</p>
      </div>
    </div>
    <div class="rounded-lg border border-orange-500/30 bg-orange-500/10 p-5">
      <p class="text-orange-100 leading-relaxed">
        สูตรจำง่าย: วันอาทิตย์ให้เลี่ยงกลุ่มเสียงสูงบางตัวคือ ศ ษ ส ห ฬ ฮ แล้วเลือกชื่อที่มีพลังเดช มนตรี ศรี หรือมูละเด่นขึ้นตามเป้าหมายของครอบครัว
      </p>
    </div>
  </section>

${renderTable('ชื่อผู้ชายวันอาทิตย์ กลุ่มผู้นำและบารมี', 'leader', leaderNames, 0, 'เหมาะกับลูกชายที่ต้องการชื่อให้ภาพจำมั่นใจ เข้มแข็ง มีความเป็นผู้นำ และยังคงเลี่ยงอักษรกาลกิณีวันอาทิตย์ครบถ้วน')}

${renderTable('ชื่อผู้ชายวันอาทิตย์ กลุ่มทรัพย์และความมั่นคง', 'wealth', wealthNames, 45, 'กลุ่มนี้เน้นชื่อที่มีรากความหมายด้านทรัพย์ ความเจริญ ความมั่นคง และความก้าวหน้า เหมาะกับชื่อที่อยากให้ดูภูมิฐาน')}

${renderTable('ชื่อผู้ชายวันอาทิตย์ กลุ่มปัญญาและผู้ใหญ่เกื้อหนุน', 'wisdom', wisdomNames, 90, 'เลือกชื่อที่ให้โทนฉลาด สุขุม มีเหตุผล ได้รับความไว้วางใจจากผู้ใหญ่ และเหมาะกับเส้นทางเรียนหรือการงานในอนาคต')}

${renderTable('ชื่อผู้ชายวันอาทิตย์ กลุ่มเท่ กระชับ จำง่าย', 'modern', modernNames, 135, 'ชื่อกลุ่มนี้เหมาะสำหรับพ่อแม่ที่อยากได้ชื่อเรียกง่าย เขียนไม่ยาวเกินไป และยังดูเป็นชื่อผู้ชายสมัยใหม่')}

  <section id="how-to-choose" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">วิธีเลือกชื่อผู้ชายวันอาทิตย์ให้ใช้ได้จริง</h2>
    <div class="space-y-3 text-slate-300 leading-relaxed">
      <p><strong class="text-white">1. ตรวจตัวอักษรกาลกิณี</strong> ชื่อที่เลือกควรไม่มี ศ ษ ส ห ฬ ฮ ปรากฏในตัวสะกดของชื่อ</p>
      <p><strong class="text-white">2. เลือกความหมายให้ตรงเป้าหมาย</strong> ถ้าอยากได้ชื่อดูหนักแน่นให้เลือกกลุ่มผู้นำ ถ้าอยากได้ชื่อดูภูมิฐานให้เลือกกลุ่มทรัพย์และความมั่นคง</p>
      <p><strong class="text-white">3. เช็กผลรวมกับนามสกุล</strong> หลังได้ชื่อที่ชอบแล้ว ควรนำชื่อจริงรวมกับนามสกุลไปตรวจเลขศาสตร์และภาพรวมทักษาอีกครั้ง</p>
    </div>
    <div class="flex flex-wrap gap-3 pt-2">
      <a href="/name-check" class="inline-flex items-center rounded-lg bg-amber-400 px-5 py-3 font-bold text-slate-950 hover:bg-amber-300">เช็กชื่อพร้อมนามสกุล</a>
      <a href="/articles/700-auspicious-names-by-birthday-2569" class="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 font-bold text-white hover:bg-slate-800">ดูชื่อมงคลตามวันเกิด</a>
      <a href="/articles/forbidden-letters-kalakini" class="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 font-bold text-white hover:bg-slate-800">ดูอักษรกาลกิณี 7 วัน</a>
    </div>
  </section>
</div>
`
};
