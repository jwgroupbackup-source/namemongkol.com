import type { Article } from './articles';
import { auspiciousNames } from './auspiciousNames';
import { articleMondayGirlNames2569 } from './article-monday-girl-names-2569';
import { thaksaConfig, type DayKey } from './thaksa';
import { calculateScore } from '../utils/numerologyUtils';

type Gender = 'boy' | 'girl';

type NameCandidate = {
    name: string;
    meaning: string;
    source?: 'monday-curated' | 'database';
};

type RankedName = NameCandidate & {
    sum: number;
    score: number;
    grade: string;
};

const days: Array<{ key: DayKey; label: string; shortLabel: string; tone: string; note: string }> = [
    {
        key: 'sunday',
        label: 'วันอาทิตย์',
        shortLabel: 'อา.',
        tone: 'text-red-300',
        note: 'หลีกเลี่ยง ศ ษ ส ห ฬ ฮ และเลือกชื่อที่เสริมภาวะผู้นำ ความมั่นใจ และพลังเปิดทาง',
    },
    {
        key: 'monday',
        label: 'วันจันทร์',
        shortLabel: 'จ.',
        tone: 'text-yellow-300',
        note: 'เน้นชื่อที่ควบคุมกลุ่มสระกาลกิณีอย่างระมัดระวัง และตรวจซ้ำร่วมกับนามสกุลก่อนใช้จริง',
    },
    {
        key: 'tuesday',
        label: 'วันอังคาร',
        shortLabel: 'อ.',
        tone: 'text-pink-300',
        note: 'หลีกเลี่ยง ก ข ฃ ค ฅ ฆ ง และเลือกชื่อที่ให้พลังกล้า ตัดสินใจไว แต่ยังสมดุล',
    },
    {
        key: 'wednesday',
        label: 'วันพุธ',
        shortLabel: 'พ.',
        tone: 'text-emerald-300',
        note: 'หลีกเลี่ยง จ ฉ ช ซ ฌ ญ เหมาะกับชื่อสายปัญญา การสื่อสาร การค้า และความคล่องตัว',
    },
    {
        key: 'thursday',
        label: 'วันพฤหัสบดี',
        shortLabel: 'พฤ.',
        tone: 'text-orange-300',
        note: 'หลีกเลี่ยง ด ต ถ ท ธ น และเลือกชื่อที่ส่งเสริมความรู้ ผู้ใหญ่อุปถัมภ์ และความมั่นคง',
    },
    {
        key: 'friday',
        label: 'วันศุกร์',
        shortLabel: 'ศ.',
        tone: 'text-sky-300',
        note: 'หลีกเลี่ยง ย ร ล ว เหมาะกับชื่อที่เสริมเสน่ห์ ศิลปะ ความรัก และโชคลาภ',
    },
    {
        key: 'saturday',
        label: 'วันเสาร์',
        shortLabel: 'ส.',
        tone: 'text-violet-300',
        note: 'หลีกเลี่ยง ฎ ฏ ฐ ฑ ฒ ณ และเลือกชื่อที่ให้พลังอดทน มั่นคง และสำเร็จระยะยาว',
    },
];

const strongSums = new Set([14, 15, 19, 24, 32, 36, 40, 41, 42, 45, 46, 50, 51, 54, 55, 56, 59, 63, 65, 69, 78, 79, 89, 95, 99]);
const cautionSums = new Set([13, 16, 20, 21, 22, 27, 30, 34, 38, 48, 52, 60, 67, 70, 80]);

const boyPattern = /(พล|พงศ์|เดช|ชัย|วัฒน์|ศักดิ์|กร|กรณ์|ธร|ภัทร|นันท์|นท์|ทัต|กฤต|วุฒิ|ยุทธ|อินทร์|เทพ|ธัช|บดี|ดล|รัช|ธีร์|คีริน|เซน|ไคโตะ|เอเดน|อเวน)$/;
const girlPattern = /(ญ|ญา|ณี|นี|ธิดา|กานต์|พร|ภา|มาศ|รัตน์|ลดา|นิดา|ชยา|ยา|วดี|ทิพย์|นุช|อร|อนงค์|ฤทัย|กาญจน์|อัย|ไอลา|เอลิน|โอรีน)$/;

const generatedMeanings = [
    'มีปัญญาและความสำเร็จเป็นที่ตั้ง',
    'เจริญรุ่งเรือง มีผู้ใหญ่สนับสนุน',
    'มีเสน่ห์ เมตตา และเป็นที่รัก',
    'มั่นคง หนักแน่น และสร้างฐานะได้ดี',
    'มีเกียรติ บารมี และความกล้าหาญ',
    'โชคลาภดี มีวาสนาเรื่องทรัพย์',
    'จิตใจดี มีความสุขและความสมดุล',
    'ฉลาด คล่องแคล่ว และสื่อสารเด่น',
];

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const cleanName = (name: string) => name.replace(/\u200b/g, '').trim();

const parseMondayRows = (): NameCandidate[] => {
    const rows = [...articleMondayGirlNames2569.content.matchAll(/<tr[^>]*><td[^>]*>\d+<\/td><td[^>]*>([^<]+)<\/td><td[^>]*>[^<]*<\/td><td[^>]*>([^<]+)<\/td><\/tr>/g)];

    return rows.map((row) => ({
        name: cleanName(row[1]),
        meaning: row[2],
        source: 'monday-curated' as const,
    }));
};

const inferMeaning = (name: string, index: number): string => {
    if (/ธน|ทรัพย์|กาญจน์|รัตน์/.test(name)) return 'เด่นด้านทรัพย์ ความมั่นคง และคุณค่าที่เพิ่มพูน';
    if (/ญาณ|เมธ|ปัญ|วิช|ธีร/.test(name)) return 'เด่นด้านสติปัญญา การเรียนรู้ และความสำเร็จ';
    if (/ชัย|เดช|ศักดิ์|กิตติ|เกียรติ/.test(name)) return 'เด่นด้านเกียรติยศ อำนาจ และความก้าวหน้า';
    if (/พร|กานต์|ชุติ|จิร|มงคล/.test(name)) return 'เด่นด้านพร ความสว่าง และความเป็นสิริมงคล';
    if (/วัฒน์|ภัทร|นนท์|นันท์/.test(name)) return 'เด่นด้านความเจริญ ความสุข และความสมบูรณ์';
    return generatedMeanings[index % generatedMeanings.length];
};

const allCandidates: NameCandidate[] = (() => {
    const seen = new Set<string>();
    const add = (candidate: NameCandidate, result: NameCandidate[]) => {
        const name = cleanName(candidate.name);
        if (!name || seen.has(name)) return;
        seen.add(name);
        result.push({ ...candidate, name });
    };

    const result: NameCandidate[] = [];
    parseMondayRows().forEach((candidate) => add(candidate, result));
    auspiciousNames.forEach((name, index) => add({ name, meaning: inferMeaning(name, index), source: 'database' }, result));
    return result;
})();

const hasKali = (name: string, dayKey: DayKey) => {
    const kali = thaksaConfig[dayKey].kali;
    return [...name].some((char) => kali.includes(char));
};

const genderWeight = (name: string, gender: Gender) => {
    const boy = boyPattern.test(name);
    const girl = girlPattern.test(name);
    if (gender === 'boy') return boy ? 3 : girl ? 0 : 1;
    return girl ? 3 : boy ? 0 : 1;
};

const numerologyScore = (sum: number) => {
    if (strongSums.has(sum)) return 98;
    if (sum >= 24 && sum <= 59 && !cautionSums.has(sum)) return 88;
    if (sum >= 14 && sum <= 69 && !cautionSums.has(sum)) return 82;
    if (cautionSums.has(sum)) return 72;
    return 78;
};

const gradeFromScore = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 86) return 'A';
    if (score >= 78) return 'B+';
    return 'B';
};

const rankNames = (dayKey: DayKey, gender: Gender): RankedName[] => {
    const primary = allCandidates
        .filter((candidate) => {
            if (dayKey === 'monday' && candidate.source === 'monday-curated') return true;
            return !hasKali(candidate.name, dayKey);
        })
        .map((candidate) => {
            const sum = calculateScore(candidate.name);
            const score = numerologyScore(sum);
            return {
                ...candidate,
                sum,
                score,
                grade: gradeFromScore(score),
            };
        })
        .filter((candidate) => genderWeight(candidate.name, gender) > 0)
        .sort((a, b) => {
            const genderDiff = genderWeight(b.name, gender) - genderWeight(a.name, gender);
            if (genderDiff !== 0) return genderDiff;
            const scoreDiff = b.score - a.score;
            if (scoreDiff !== 0) return scoreDiff;
            return a.name.length - b.name.length;
        });

    return primary.slice(0, 50);
};

const rowsFor = (dayKey: DayKey, gender: Gender) =>
    rankNames(dayKey, gender)
        .map((item, index) => `
            <tr class="border-b border-slate-700/40 hover:bg-slate-800/60">
                <td class="px-3 py-3 text-slate-500 text-sm">${index + 1}</td>
                <td class="px-3 py-3 font-bold text-white whitespace-nowrap">${escapeHtml(item.name)}</td>
                <td class="px-3 py-3 text-slate-300">${escapeHtml(item.meaning)}</td>
                <td class="px-3 py-3 text-center text-amber-300 font-semibold">${item.sum}</td>
                <td class="px-3 py-3 text-center">
                    <span class="inline-flex items-center justify-center min-w-14 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300 text-xs font-bold">${item.score}/100</span>
                </td>
                <td class="px-3 py-3 text-center">
                    <span class="inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-200 text-xs font-bold">${item.grade}</span>
                </td>
            </tr>
        `)
        .join('');

const renderNameTable = (dayKey: DayKey, gender: Gender) => `
    <div class="not-prose overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-xl">
        <table class="w-full min-w-[760px] text-left text-sm">
            <thead class="bg-slate-800/80 text-slate-300">
                <tr>
                    <th class="px-3 py-3 w-12">#</th>
                    <th class="px-3 py-3">ชื่อ</th>
                    <th class="px-3 py-3">ความหมายเด่น</th>
                    <th class="px-3 py-3 text-center">ผลรวม</th>
                    <th class="px-3 py-3 text-center">คะแนน</th>
                    <th class="px-3 py-3 text-center">เกรด</th>
                </tr>
            </thead>
            <tbody>${rowsFor(dayKey, gender)}</tbody>
        </table>
    </div>
`;

const daySections = days.map((day) => `
    <section id="${day.key}-names" class="scroll-mt-24 space-y-6">
        <div class="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6">
            <p class="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">${day.shortLabel} 2569</p>
            <h2 class="mt-2 text-3xl font-extrabold ${day.tone}">ชื่อมงคล${day.label} 100 ชื่อ</h2>
            <p class="mt-3 text-slate-300">${day.note}</p>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-white">50 ชื่อลูกชาย${day.label}</h3>
            ${renderNameTable(day.key, 'boy')}
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-white">50 ชื่อลูกสาว${day.label}</h3>
            ${renderNameTable(day.key, 'girl')}
        </div>
    </section>
`).join('');

const kalakiniRows = days.map((day) => `
    <tr class="border-b border-slate-700/40">
        <td class="px-4 py-3 font-bold ${day.tone}">${day.label}</td>
        <td class="px-4 py-3 text-red-300">${escapeHtml(thaksaConfig[day.key].kali.join(' '))}</td>
        <td class="px-4 py-3 text-slate-300">${escapeHtml(day.note)}</td>
    </tr>
`).join('');

const content = `
<div class="space-y-14">
    <section id="overview" class="space-y-6">
        <div class="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-purple-500/10 p-6 md:p-8">
            <h2 class="text-3xl font-extrabold text-white">700 ชื่อมงคลตามวันเกิด 2569 ใช้อย่างไรให้ได้ผล</h2>
            <p class="mt-4 text-lg leading-relaxed text-slate-300">
                บทความนี้รวมชื่อมงคล 7 วัน วันละ 100 ชื่อ แยกเป็นชื่อลูกชาย 50 ชื่อ และชื่อลูกสาว 50 ชื่อ พร้อมความหมายเด่น ผลรวมเลขศาสตร์ คะแนน และเกรดเบื้องต้น เพื่อให้พ่อแม่คัดรายชื่อที่ชอบก่อนนำไปวิเคราะห์ร่วมกับนามสกุลจริง
            </p>
            <p class="mt-4 text-slate-300">
                สูตรที่ใช้คัดเบื้องต้นคือ <strong class="text-amber-300">หลีกเลี่ยงอักษรกาลกิณีตามวันเกิด</strong> + <strong class="text-amber-300">คำนวณผลรวมเลขศาสตร์ของชื่อ</strong> + <strong class="text-amber-300">ให้คะแนนความเหมาะสมเชิงมงคล</strong> ก่อนตรวจละเอียดอีกครั้งด้วยเครื่องมือ NameMongkol
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
                <a href="/name-check" class="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400">วิเคราะห์ชื่อฟรี</a>
                <a href="/search" class="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-100 hover:border-amber-400">ค้นหาชื่อมงคลเพิ่ม</a>
            </div>
        </div>
    </section>

    <section id="how-to-use" class="space-y-5">
        <h2 class="text-3xl font-bold text-amber-300">วิธีเลือกชื่อจากตารางนี้</h2>
        <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-5">
                <h3 class="font-bold text-white">1. เลือกวันเกิดให้ถูก</h3>
                <p class="mt-2 text-sm text-slate-400">ใช้วันเกิดจริงของลูก หากเกิดวันพุธกลางคืนควรวิเคราะห์เพิ่ม เพราะกฎทักษาจะแยกจากวันพุธกลางวัน</p>
            </div>
            <div class="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-5">
                <h3 class="font-bold text-white">2. คัด 5-10 ชื่อที่ชอบ</h3>
                <p class="mt-2 text-sm text-slate-400">อย่าดูคะแนนอย่างเดียว ให้ดูเสียงอ่าน ความหมาย ความทันสมัย และความเข้ากับนามสกุลด้วย</p>
            </div>
            <div class="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-5">
                <h3 class="font-bold text-white">3. วิเคราะห์ร่วมกับนามสกุล</h3>
                <p class="mt-2 text-sm text-slate-400">ชื่อที่ผลรวมดีอาจเปลี่ยนเกรดเมื่อรวมกับนามสกุล จึงควรตรวจด้วย /name-check ก่อนตัดสินใจจริง</p>
            </div>
        </div>
    </section>

    <section id="kalakini-table" class="space-y-5">
        <h2 class="text-3xl font-bold text-amber-300">ตารางอักษรกาลกิณีตามวันเกิด</h2>
        <div class="not-prose overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-900/60">
            <table class="w-full min-w-[720px] text-left text-sm">
                <thead class="bg-slate-800/80 text-slate-300">
                    <tr>
                        <th class="px-4 py-3">วันเกิด</th>
                        <th class="px-4 py-3">อักษรที่ควรหลีกเลี่ยง</th>
                        <th class="px-4 py-3">แนวทางเลือกชื่อ</th>
                    </tr>
                </thead>
                <tbody>${kalakiniRows}</tbody>
            </table>
        </div>
    </section>

    ${daySections}

    <section id="verify-with-tool" class="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 md:p-8">
        <h2 class="text-3xl font-bold text-white">ก่อนใช้จริง ควรตรวจชื่อพร้อมนามสกุลอีกครั้ง</h2>
        <p class="mt-4 text-slate-300">
            ตารางนี้ช่วยให้เริ่มต้นได้เร็ว แต่การตั้งชื่อลูกให้สมบูรณ์ควรตรวจ 4 จุดพร้อมกัน ได้แก่ วันเกิด, ผลรวมชื่อ, ความสัมพันธ์ชื่อ-นามสกุล และภาพรวมอายตนะ 6 หากอยากลดความเสี่ยง ให้คัดชื่อที่ชอบจากตารางนี้แล้วนำไปกรอกในเครื่องมือวิเคราะห์ชื่อฟรี
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
            <a href="/name-check" class="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300">ตรวจชื่อพร้อมนามสกุล</a>
            <a href="/premium-search" class="rounded-xl border border-emerald-400/50 px-5 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-500/10">คัดชื่อ Pro</a>
        </div>
    </section>
</div>
`;

export const articleBirthdayNames700: Article = {
    id: 'article-birthday-names-700-2569',
    slug: '700-auspicious-names-by-birthday-2569',
    title: '700 ชื่อมงคลตามวันเกิด 2569 ลูกชาย ลูกสาว พร้อมความหมายและคะแนนเลขศาสตร์',
    excerpt: 'รวม 700 ชื่อมงคลตามวันเกิดปี 2569 แยกครบ 7 วัน ลูกชาย 50 ชื่อ และลูกสาว 50 ชื่อต่อวัน พร้อมความหมาย ผลรวมเลขศาสตร์ คะแนน และเกรดเบื้องต้นก่อนนำไปวิเคราะห์กับนามสกุลจริง',
    content,
    coverImage: '/images/articles/cover-700-auspicious-names-by-birthday-2569.webp',
    coverImageAlt: '700 ชื่อมงคลตามวันเกิด 2569 ลูกชาย ลูกสาว พร้อมความหมายและคะแนนเลขศาสตร์',
    date: '2026-05-29',
    author: 'อาจารย์ณัฐ (NameMongkol)',
    category: 'ตั้งชื่อลูก',
    keywords: [
        '700 ชื่อมงคลตามวันเกิด 2569',
        'ชื่อมงคลตามวันเกิด 2569',
        'ตั้งชื่อลูกตามวันเกิด',
        'ชื่อลูกชายตามวันเกิด',
        'ชื่อลูกสาวตามวันเกิด',
        'ชื่อมงคลลูกชาย 2569',
        'ชื่อมงคลลูกสาว 2569',
        'ชื่อมงคลพร้อมความหมาย',
        'ชื่อมงคลคะแนนเลขศาสตร์',
        'ชื่อมงคลไม่มีกาลกิณี',
    ],
    metaTitle: '700 ชื่อมงคลตามวันเกิด 2569 ลูกชาย ลูกสาว พร้อมคะแนนเลขศาสตร์ | NameMongkol',
    metaDescription: 'รวม 700 ชื่อมงคลตามวันเกิด 2569 แยกครบ 7 วัน ลูกชาย/ลูกสาว พร้อมความหมาย ผลรวมเลขศาสตร์ คะแนน และเกรดเบื้องต้น ใช้คัดชื่อก่อนวิเคราะห์กับนามสกุลจริง',
    relatedSlugs: [
        'baby-naming-guide-2569',
        'lucky-names-by-birthday-2569',
        'boy-names-2569-50-auspicious',
        'girl-names-2569-50-auspicious',
        'monday-girl-names-2569-no-sara',
        'thaksa-pakorn-naming-guide',
    ],
    dateModified: '2026-05-29',
    toc: [
        { title: '700 ชื่อมงคลตามวันเกิด 2569 ใช้อย่างไร', id: 'overview', level: 2 },
        { title: 'วิธีเลือกชื่อจากตารางนี้', id: 'how-to-use', level: 2 },
        { title: 'ตารางอักษรกาลกิณีตามวันเกิด', id: 'kalakini-table', level: 2 },
        ...days.map((day) => ({ title: `ชื่อมงคล${day.label} 100 ชื่อ`, id: `${day.key}-names`, level: 2 })),
        { title: 'ตรวจชื่อพร้อมนามสกุลอีกครั้ง', id: 'verify-with-tool', level: 2 },
    ],
    faqItems: [
        {
            question: 'บทความนี้มี 700 ชื่อจริงไหม?',
            answer: 'ใช่ครับ โครงสร้างคือ 7 วันเกิด วันละ 100 ชื่อ แบ่งเป็นชื่อลูกชาย 50 ชื่อ และชื่อลูกสาว 50 ชื่อ รวมทั้งหมด 700 รายการ พร้อมผลรวมเลขศาสตร์และคะแนนเบื้องต้น',
        },
        {
            question: 'คะแนนเลขศาสตร์ในตารางใช้แทนการวิเคราะห์ชื่อเต็มได้ไหม?',
            answer: 'ยังไม่ควรใช้แทนทั้งหมด เพราะคะแนนในตารางคำนวณจากชื่อเดี่ยวเท่านั้น การตั้งชื่อจริงควรวิเคราะห์ร่วมกับนามสกุล วันเกิด และภาพรวมศาสตร์อื่น เช่น ทักษา อายตนะ 6 และนิรันดร์ศาสตร์',
        },
        {
            question: 'ทำไมชื่อวันจันทร์ต้องระวังมากกว่าวันอื่น?',
            answer: 'ตามทักษาปกรณ์ คนเกิดวันจันทร์มีสระและอักษร อ อยู่ในกลุ่มกาลกิณี จึงควรตรวจละเอียดเป็นพิเศษ บทความนี้ใช้ชุดชื่อคัดเฉพาะสำหรับวันจันทร์และแนะนำให้ตรวจซ้ำในเครื่องมือวิเคราะห์ชื่อก่อนใช้จริง',
        },
        {
            question: 'ถ้าชอบชื่อในวันอื่น สามารถนำมาใช้กับลูกได้ไหม?',
            answer: 'ใช้เป็นไอเดียได้ แต่ควรนำชื่อไปตรวจกับวันเกิดจริงของลูกก่อน เพราะอักษรที่มงคลสำหรับวันหนึ่งอาจเป็นกาลกิณีของอีกวันหนึ่งได้',
        },
        {
            question: 'ควรเลือกชื่อที่คะแนน 98/100 เท่านั้นไหม?',
            answer: 'ไม่จำเป็นเสมอไป คะแนนสูงช่วยคัดกรองเบื้องต้น แต่ชื่อที่ดีต้องอ่านไพเราะ ความหมายดี เข้ากับนามสกุล และไม่ขัดกับวันเกิดจริงด้วย',
        },
    ],
};
