import type { Article } from './articles';

type NameRoot = {
    word: string;
    reading: string;
    meaningLead: string;
    meaningTail: string;
};

type NameRow = {
    name: string;
    reading: string;
    meaning: string;
    group: string;
};

const thaiVowelOrMondayKaliPattern = /[ะาิีึืุูเแโใไำฤๅฦๅั็่้๊๋์อ]/;

const roots: NameRoot[] = [
    { word: 'ดล', reading: 'ดน', meaningLead: 'ผู้บันดาล', meaningTail: 'และพลังบันดาลสิ่งดี' },
    { word: 'ธน', reading: 'ทะ-นะ', meaningLead: 'ผู้มีทรัพย์', meaningTail: 'และความมั่งคั่ง' },
    { word: 'กนก', reading: 'กะ-หนก', meaningLead: 'ผู้มีคุณค่าดั่งทอง', meaningTail: 'และคุณค่าดั่งทอง' },
    { word: 'กมล', reading: 'กะ-มน', meaningLead: 'ผู้มีจิตใจงาม', meaningTail: 'และจิตใจอ่อนโยน' },
    { word: 'นภ', reading: 'นะ-พะ', meaningLead: 'ผู้สูงส่งดั่งฟ้า', meaningTail: 'และความสูงส่ง' },
    { word: 'พร', reading: 'พอน', meaningLead: 'ผู้มีพร', meaningTail: 'และพรอันดีงาม' },
    { word: 'พรรณ', reading: 'พัน', meaningLead: 'ผู้มีผิวพรรณงาม', meaningTail: 'และผิวพรรณงาม' },
    { word: 'วรรณ', reading: 'วัน', meaningLead: 'ผู้มีความงาม', meaningTail: 'และความงดงาม' },
    { word: 'มณ', reading: 'มะ-นะ', meaningLead: 'ผู้มีค่าดั่งแก้วมณี', meaningTail: 'และคุณค่าดั่งแก้ว' },
    { word: 'รตน', reading: 'ระ-ตะ-นะ', meaningLead: 'ผู้เป็นแก้วอันประเสริฐ', meaningTail: 'และความประเสริฐ' },
    { word: 'ศร', reading: 'สอน', meaningLead: 'ผู้มีพลังมุ่งมั่น', meaningTail: 'และความมุ่งมั่น' },
    { word: 'ยศ', reading: 'ยด', meaningLead: 'ผู้มีเกียรติ', meaningTail: 'และเกียรติยศ' },
    { word: 'ธรรม', reading: 'ทำ', meaningLead: 'ผู้ตั้งมั่นในความดี', meaningTail: 'และความดีงาม' },
    { word: 'ถนม', reading: 'ถะ-หนม', meaningLead: 'ผู้ได้รับการทะนุถนอม', meaningTail: 'และความอ่อนโยน' },
    { word: 'ปภ', reading: 'ปะ-พะ', meaningLead: 'ผู้มีแสงสว่าง', meaningTail: 'และความสว่าง' },
];

const suffixOrder = ['พร', 'วรรณ', 'ภร', 'มน', 'กมล', 'กนก', 'ธน', 'ยศ', 'ศร', 'พรรณ', 'มณ', 'รตน', 'นภ', 'ธรรม', 'ดล'];

const rootByWord = new Map(roots.map((root) => [root.word, root]));

const getGroup = (name: string): string => {
    if (name.includes('ธน') || name.includes('กนก') || name.includes('มณ') || name.includes('รตน')) {
        return 'ทรัพย์และความมั่งคั่ง';
    }

    if (name.includes('ธรรม') || name.includes('ศร') || name.includes('ยศ')) {
        return 'ปัญญา บารมี และความสำเร็จ';
    }

    if (name.includes('กมล') || name.includes('มน') || name.includes('ถนม')) {
        return 'เมตตาและความอ่อนโยน';
    }

    return 'เสน่ห์และความงดงาม';
};

const buildNames = (): NameRow[] => {
    const rows: NameRow[] = [];
    const seen = new Set<string>();

    for (const prefix of roots) {
        for (const suffixWord of suffixOrder) {
            const suffix = rootByWord.get(suffixWord);

            if (!suffix || prefix.word === suffix.word) {
                continue;
            }

            const name = `${prefix.word}${suffix.word}`;

            if (seen.has(name) || thaiVowelOrMondayKaliPattern.test(name)) {
                continue;
            }

            seen.add(name);
            rows.push({
                name,
                reading: `${prefix.reading}-${suffix.reading}`,
                meaning: `${prefix.meaningLead}${suffix.meaningTail}`,
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
            <td class="px-3 py-3 text-pink-300">${row.reading}</td>
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
        <thead class="bg-gradient-to-r from-pink-900/50 to-slate-800 text-pink-200 uppercase text-xs font-bold">
          <tr>
            <th class="px-3 py-3 w-12">#</th>
            <th class="px-3 py-3 min-w-28">ชื่อ</th>
            <th class="px-3 py-3 min-w-32">คำอ่าน</th>
            <th class="px-3 py-3 min-w-64">ความหมาย</th>
            <th class="px-3 py-3 min-w-40">แนวทางเสริม</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
${renderRows(rows, offset)}
        </tbody>
      </table>
    </div>
  </section>`;

const firstGroup = nameRows.slice(0, 45);
const secondGroup = nameRows.slice(45, 90);
const thirdGroup = nameRows.slice(90, 135);
const fourthGroup = nameRows.slice(135, 180);

export const articleMondayGirlNoVowelMeaning2569: Article = {
    id: 'article-monday-girl-no-vowel-meaning-2569',
    slug: 'monday-girl-names-2569-no-vowels-meaning',
    title: '180 ชื่อมงคลผู้หญิงวันจันทร์ 2569 ไม่มีสระ พร้อมความหมาย',
    excerpt: 'รวมชื่อมงคลผู้หญิงวันจันทร์ 2569 แบบไม่มีสระ ไม่มี อ และไม่มีเครื่องหมายกาลกิณีตามหลักทักษา พร้อมคำอ่าน ความหมาย และแนวทางเสริมดวงให้เลือกใช้ได้ง่าย',
    coverImage: '/images/articles/cover-monday-girl-no-vowels-meaning-2569.webp',
    coverImageAlt: 'ชื่อมงคลผู้หญิงวันจันทร์ 2569 ไม่มีสระ พร้อมความหมาย',
    date: '2026-05-29',
    author: 'อาจารย์ณัฐ (NameMongkol)',
    category: 'ชื่อมงคลตามวันเกิด',
    keywords: [
        'ชื่อมงคลผู้หญิงวันจันทร์ 2569',
        'ชื่อมงคลผู้หญิงวันจันทร์ ไม่มีสระ',
        'ชื่อผู้หญิงวันจันทร์ พร้อมความหมาย',
        'ชื่อลูกสาววันจันทร์ 2569',
        'ตั้งชื่อลูกสาววันจันทร์',
        'ชื่อไม่มีสระ ผู้หญิง',
        'ชื่อมงคลวันจันทร์ผู้หญิง',
        'ชื่อคนเกิดวันจันทร์ ผู้หญิง',
        'ชื่อวันจันทร์ไม่มีสระ',
        'ทักษาวันจันทร์ ผู้หญิง',
    ],
    metaTitle: '180 ชื่อมงคลผู้หญิงวันจันทร์ 2569 ไม่มีสระ พร้อมความหมาย | NameMongkol',
    metaDescription: 'รวม 180 ชื่อมงคลผู้หญิงวันจันทร์ 2569 ไม่มีสระ ไม่มี อ พร้อมคำอ่าน ความหมาย และแนวทางเสริมดวงตามหลักทักษา เหมาะสำหรับตั้งชื่อลูกสาวปี 2569',
    relatedSlugs: [
        'monday-girl-names-2569-no-sara',
        '700-auspicious-names-by-birthday-2569',
        'girl-names-2569-auspicious-modern',
        'forbidden-letters-kalakini',
        'auspicious-names-by-birthday-2026',
    ],
    dateModified: '2026-05-29',
    toc: [
        { title: 'คนเกิดวันจันทร์ทำไมควรเลี่ยงสระ', id: 'intro', level: 2 },
        { title: 'ชื่อมงคลผู้หญิงวันจันทร์ กลุ่มเสน่ห์และความงาม', id: 'beauty', level: 2 },
        { title: 'ชื่อมงคลผู้หญิงวันจันทร์ กลุ่มทรัพย์และความมั่งคั่ง', id: 'wealth', level: 2 },
        { title: 'ชื่อมงคลผู้หญิงวันจันทร์ กลุ่มปัญญาและบารมี', id: 'wisdom', level: 2 },
        { title: 'ชื่อมงคลผู้หญิงวันจันทร์ กลุ่มสั้น กระชับ จำง่าย', id: 'modern', level: 2 },
        { title: 'วิธีเลือกชื่อให้เหมาะกับนามสกุล', id: 'how-to-choose', level: 2 },
        { title: 'FAQ', id: 'faq', level: 2 },
    ],
    faqItems: [
        {
            question: 'ชื่อมงคลผู้หญิงวันจันทร์ต้องไม่มีสระทุกตัวเลยไหม?',
            answer: 'ตามหลักทักษา คนเกิดวันจันทร์ควรเลี่ยงสระที่เขียนปรากฏในชื่อ รวมถึง อ และเครื่องหมายกาลกิณีที่ใช้ประกอบเสียง บทความนี้จึงคัดชื่อที่เขียนด้วยพยัญชนะเป็นหลักเพื่อให้ตรวจง่ายขึ้น',
        },
        {
            question: 'ชื่อไม่มีสระอ่านออกเสียงได้จริงไหม?',
            answer: 'อ่านได้จริง เพราะภาษาไทยมีคำจำนวนมากที่ไม่มีรูปสระปรากฏ แต่ยังอ่านด้วยเสียงสระโดยธรรมชาติ เช่น ดล อ่านว่า ดน หรือ พร อ่านว่า พอน จึงควรดูคำอ่านประกอบก่อนเลือกใช้',
        },
        {
            question: 'เลือกชื่อจากบทความนี้แล้วต้องเช็กอะไรเพิ่ม?',
            answer: 'ควรเช็กผลรวมเลขศาสตร์ของชื่อร่วมกับนามสกุล และตรวจว่าไม่มีอักษรกาลกิณีอื่นตามวันเกิด เพื่อให้ชื่อเหมาะกับเจ้าของชื่อมากที่สุด',
        },
        {
            question: 'บทความนี้เหมาะกับชื่อลูกสาวปี 2569 ไหม?',
            answer: 'เหมาะสำหรับพ่อแม่ที่กำลังตั้งชื่อลูกสาวเกิดวันจันทร์ในปี 2569 เพราะจัดชื่อให้ไม่มีสระตามหลักทักษา พร้อมคำอ่านและความหมายให้เทียบเลือกได้ทันที',
        },
    ],
    content: `
<div class="space-y-10">
  <section id="intro" class="space-y-5">
    <h2 class="sr-only">คนเกิดวันจันทร์ทำไมควรเลี่ยงสระ</h2>
    <p class="text-xl text-slate-300 leading-relaxed">
      สำหรับ <strong class="text-amber-300">ชื่อมงคลผู้หญิงวันจันทร์ 2569</strong> จุดที่ต้องระวังที่สุดคือกลุ่มสระ เพราะตามหลักทักษาปกรณ์ คนเกิดวันจันทร์ถือว่าสระและอักษร <strong class="text-rose-300">อ</strong> เป็นกลุ่มกาลกิณี ชื่อที่ดีจึงนิยมเลือกแบบ <strong class="text-pink-300">ไม่มีสระที่เขียนปรากฏ</strong> อ่านง่าย ความหมายดี และเข้ากับนามสกุลได้ลงตัว
    </p>
    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">คัดตามวันเกิด</h3>
        <p class="mt-2 text-sm text-slate-300">เลี่ยงสระ อ และเครื่องหมายที่ใช้เป็นกาลกิณีของวันจันทร์</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">มีคำอ่านกำกับ</h3>
        <p class="mt-2 text-sm text-slate-300">ชื่อไม่มีสระอาจอ่านได้หลายแบบ จึงใส่คำอ่านไว้ให้เลือกง่าย</p>
      </div>
      <div class="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h3 class="font-bold text-white">พร้อมความหมาย</h3>
        <p class="mt-2 text-sm text-slate-300">ทุกชื่อมีความหมายเพื่อช่วยเทียบโทนชื่อก่อนนำไปเช็กเลขศาสตร์</p>
      </div>
    </div>
    <div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5">
      <p class="text-amber-100 leading-relaxed">
        หมายเหตุ: คำว่าไม่มีสระในบทความนี้หมายถึงไม่มีรูปสระในตัวสะกดของชื่อ แต่คำอ่านยังมีเสียงสระตามธรรมชาติของภาษาไทย ก่อนใช้จริงควรตรวจร่วมกับนามสกุลและวันเกิดอีกครั้ง
      </p>
    </div>
  </section>

${renderTable('ชื่อมงคลผู้หญิงวันจันทร์ กลุ่มเสน่ห์และความงาม', 'beauty', firstGroup, 0, 'กลุ่มนี้เหมาะกับชื่อที่ต้องการภาพจำอ่อนโยน น่ารัก มีเสน่ห์ และยังคงความเป็นชื่อไทยที่เขียนเรียบหรู')}

${renderTable('ชื่อมงคลผู้หญิงวันจันทร์ กลุ่มทรัพย์และความมั่งคั่ง', 'wealth', secondGroup, 45, 'คัดชื่อที่มีรากความหมายเกี่ยวกับทรัพย์ ทอง แก้วมณี ความมั่นคง และคุณค่า เหมาะกับชื่อลูกสาวที่อยากให้มีพลังด้านความอุดมสมบูรณ์')}

${renderTable('ชื่อมงคลผู้หญิงวันจันทร์ กลุ่มปัญญาและบารมี', 'wisdom', thirdGroup, 90, 'กลุ่มนี้เน้นความหมายด้านความดี เกียรติ ความมุ่งมั่น และความสำเร็จ เหมาะกับชื่อที่อยากให้ดูสง่าและมีน้ำหนัก')}

${renderTable('ชื่อมงคลผู้หญิงวันจันทร์ กลุ่มสั้น กระชับ จำง่าย', 'modern', fourthGroup, 135, 'ชื่อในกลุ่มนี้เหมาะกับพ่อแม่ที่อยากได้ชื่อเขียนสวย เรียกง่าย และยังคงกฎไม่มีสระสำหรับคนเกิดวันจันทร์')}

  <section id="how-to-choose" class="space-y-4">
    <h2 class="text-2xl md:text-3xl font-bold text-white">วิธีเลือกชื่อให้เหมาะกับนามสกุล</h2>
    <div class="space-y-3 text-slate-300 leading-relaxed">
      <p><strong class="text-white">1. เลือกชื่อที่อ่านง่ายก่อน</strong> ชื่อไม่มีสระบางชื่ออ่านได้หลายแบบ ควรเลือกคำอ่านที่ครอบครัวชอบและสะกดได้ชัดเจน</p>
      <p><strong class="text-white">2. เทียบความหมายกับบุคลิกที่ต้องการ</strong> ถ้าต้องการชื่ออ่อนโยนให้เลือกกลุ่มเมตตา ถ้าต้องการชื่อมีพลังให้เลือกกลุ่มทรัพย์ ปัญญา หรือบารมี</p>
      <p><strong class="text-white">3. เช็กเลขศาสตร์พร้อมนามสกุล</strong> ชื่อที่ดีควรไม่ดูเฉพาะชื่อจริง แต่ต้องดูผลรวมชื่อและนามสกุลร่วมกันด้วย</p>
    </div>
    <div class="flex flex-wrap gap-3 pt-2">
      <a href="/name-check" class="inline-flex items-center rounded-lg bg-amber-400 px-5 py-3 font-bold text-slate-950 hover:bg-amber-300">เช็กชื่อพร้อมนามสกุล</a>
      <a href="/articles/monday-girl-names-2569-no-sara" class="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 font-bold text-white hover:bg-slate-800">ดู 400 ชื่อวันจันทร์เพิ่มเติม</a>
      <a href="/search" class="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 font-bold text-white hover:bg-slate-800">ค้นหาชื่อมงคล</a>
    </div>
  </section>
</div>
`
};
