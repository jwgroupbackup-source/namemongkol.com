import type { Article } from './articles';
import { premiumNamesRaw } from './premiumNamesRaw';
import { thaksaConfig, thaksaMeanings } from './thaksa';
import { parsePremiumNames } from '../utils/premiumDataParser';
import { AUSPICIOUS_SUMS } from '../utils/gradeResult';

type AnalyzedName = {
    name: string;
    totalScore: number;
    score: number;
    grade: 'A+' | 'A' | 'B+';
    focus: string;
    reason: string;
};

const dayConfig = thaksaConfig.wednesday_night;
const auspiciousSums = new Set(AUSPICIOUS_SUMS);

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const hasAny = (name: string, chars: string[]) => [...name].some((char) => chars.includes(char));

const hasWednesdayNightKali = (name: string) => hasAny(name, dayConfig.kali);

const getScore = (totalScore: number) => {
    if (auspiciousSums.has(totalScore)) return 95;
    if (totalScore >= 24 && totalScore <= 65) return 88;
    return 82;
};

const getGrade = (score: number): AnalyzedName['grade'] => {
    if (score >= 95) return 'A+';
    if (score >= 88) return 'A';
    return 'B+';
};

const getFocus = (name: string) => {
    if (hasAny(name, dayConfig.si)) return 'เสริมศรี: โชคลาภ เสน่ห์ และความสำเร็จ';
    if (hasAny(name, dayConfig.montri)) return 'เสริมมนตรี: ผู้ใหญ่เมตตา มีคนสนับสนุน';
    if (hasAny(name, dayConfig.ussaha)) return 'เสริมอุตสาหะ: ความเพียร การเรียนรู้ และงาน';
    if (hasAny(name, dayConfig.mula)) return 'เสริมมูละ: ฐานะ หลักทรัพย์ และรากฐานชีวิต';
    if (hasAny(name, dayConfig.ayu)) return 'เสริมอายุ: สุขภาพและความมั่นคง';
    return 'ชื่ออ่านง่าย ไม่มีอักษรกาลกิณีวันพุธกลางคืน';
};

const getReason = (totalScore: number, grade: AnalyzedName['grade']) => {
    if (grade === 'A+') {
        return `ไม่มี ${dayConfig.kali.join(' ')} และผลรวม ${totalScore} อยู่ในกลุ่มเลขมงคล`;
    }

    return `ไม่มี ${dayConfig.kali.join(' ')} ผลรวม ${totalScore} ใช้คัดก่อนตรวจร่วมกับนามสกุล`;
};

const analyzedNames: AnalyzedName[] = parsePremiumNames(premiumNamesRaw)
    .filter((item) => item.gender === 'male')
    .filter((item) => item.name.length >= 2)
    .filter((item) => !hasWednesdayNightKali(item.name))
    .map((item) => {
        const score = getScore(item.totalScore);
        const grade = getGrade(score);

        return {
            name: item.name,
            totalScore: item.totalScore,
            score,
            grade,
            focus: getFocus(item.name),
            reason: getReason(item.totalScore, grade),
        };
    })
    .sort((a, b) => {
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;

        const sumDiff = Number(auspiciousSums.has(b.totalScore)) - Number(auspiciousSums.has(a.totalScore));
        if (sumDiff !== 0) return sumDiff;

        return a.name.localeCompare(b.name, 'th');
    })
    .slice(0, 50);

const renderNameRows = () =>
    analyzedNames
        .map((item, index) => `
            <tr class="border-b border-slate-700/40 hover:bg-slate-800/60">
                <td class="px-3 py-3 text-slate-500 text-sm">${index + 1}</td>
                <td class="px-3 py-3 font-bold text-white whitespace-nowrap">${escapeHtml(item.name)}</td>
                <td class="px-3 py-3 text-slate-300">${escapeHtml(item.focus)}</td>
                <td class="px-3 py-3 text-center text-amber-300 font-semibold">${item.totalScore}</td>
                <td class="px-3 py-3 text-center">
                    <span class="inline-flex min-w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-300">${item.score}/100</span>
                </td>
                <td class="px-3 py-3 text-center">
                    <span class="inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-200">${item.grade}</span>
                </td>
                <td class="px-3 py-3 text-slate-300">${escapeHtml(item.reason)}</td>
            </tr>
        `)
        .join('');

const thaksaRows = [
    ['บริวาร', dayConfig.borivan, thaksaMeanings.borivan.desc],
    ['อายุ', dayConfig.ayu, thaksaMeanings.ayu.desc],
    ['เดช', ['สระทั้งหมด'], thaksaMeanings.dech.desc],
    ['ศรี', dayConfig.si, thaksaMeanings.si.desc],
    ['มูละ', dayConfig.mula, thaksaMeanings.mula.desc],
    ['อุตสาหะ', dayConfig.ussaha, thaksaMeanings.ussaha.desc],
    ['มนตรี', dayConfig.montri, thaksaMeanings.montri.desc],
    ['กาลกิณี', dayConfig.kali, thaksaMeanings.kali.desc],
] as const;

const renderThaksaRows = () =>
    thaksaRows
        .map(([label, chars, desc]) => `
            <tr class="border-b border-slate-700/40 ${label === 'กาลกิณี' ? 'bg-rose-950/30' : ''}">
                <td class="px-4 py-3 font-bold ${label === 'กาลกิณี' ? 'text-rose-200' : 'text-amber-200'}">${label}</td>
                <td class="px-4 py-3 text-white font-semibold">${escapeHtml(chars.join(' '))}</td>
                <td class="px-4 py-3 text-slate-300">${desc}</td>
            </tr>
        `)
        .join('');

const articleImage = (src: string, alt: string, caption?: string) => `
    <figure class="not-prose clear-both mx-auto my-8 w-full max-w-[min(100%,960px)] rounded-3xl border border-white/10 bg-slate-950/70 p-2 shadow-2xl shadow-amber-950/20 md:p-3 xl:max-w-[min(92vw,1040px)]">
        <a href="${src}" target="_blank" rel="noopener noreferrer" class="block rounded-2xl bg-slate-900/60 p-1 transition hover:bg-slate-900 md:p-2" aria-label="${escapeHtml(`เปิดภาพขนาดเต็ม: ${alt}`)}">
            <img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" class="h-auto w-full rounded-xl object-contain" />
        </a>
        ${caption ? `<figcaption class="px-3 pb-2 pt-3 text-sm leading-relaxed text-slate-300 md:px-4">${escapeHtml(caption)} <span class="text-amber-300">คลิกเพื่อดูภาพขนาดเต็ม</span></figcaption>` : '<figcaption class="px-3 pb-2 pt-3 text-sm leading-relaxed text-slate-400 md:px-4">คลิกเพื่อดูภาพขนาดเต็ม</figcaption>'}
    </figure>
`;

const content = `
<div class="space-y-12">
  <section id="quick-answer" class="space-y-6">
    <div class="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl shadow-amber-950/20">
      <p class="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">คำตอบสั้นก่อนเลือกชื่อ</p>
      <h2 class="mt-3 text-3xl font-extrabold text-white">ลูกชายเกิดวันพุธกลางคืนควรตั้งชื่ออย่างไร?</h2>
      <p class="mt-4 text-lg leading-relaxed text-slate-300">
        ถ้าลูกชายเกิดตั้งแต่ <strong class="text-white">18.00 น. ของวันพุธ ถึง 05.59 น. ของวันพฤหัสบดี</strong> ตามหลักทักษาจะนับเป็น <strong class="text-amber-300">วันพุธกลางคืน หรือราหู</strong> ควรเริ่มจากการเลี่ยงอักษรกาลกิณี <strong class="text-rose-300">${dayConfig.kali.join(' ')}</strong> แล้วค่อยดูผลรวมเลขศาสตร์และความเข้ากันกับนามสกุลจริง
      </p>
      ${articleImage('/images/articles/wednesday-night-birth-time-infographic.webp', 'วันพุธกลางคืนนับตั้งแต่ 18.00 น. ถึง 05.59 น.', 'วันพุธกลางคืนนับเวลาไหน: เริ่ม 18.00 น. วันพุธ ถึง 05.59 น. วันพฤหัสบดี')}
      <div class="mt-6 grid gap-3 md:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-sm text-slate-400">เวลาเริ่มต้น</p>
          <p class="mt-1 text-2xl font-bold text-white">18.00 น.</p>
          <p class="text-sm text-slate-400">วันพุธ</p>
        </div>
        <div class="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
          <p class="text-sm text-amber-100">อักษรที่ควรหลีกเลี่ยง</p>
          <p class="mt-2 text-3xl font-extrabold text-rose-200">${dayConfig.kali.join(' ')}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-sm text-slate-400">เวลาสิ้นสุด</p>
          <p class="mt-1 text-2xl font-bold text-white">05.59 น.</p>
          <p class="text-sm text-slate-400">วันพฤหัสบดี</p>
        </div>
      </div>
    </div>
    <p class="text-slate-300 leading-relaxed">
      จากการดูหน้าอันดับต้น เช่น Enfa, theAsianparent, Wongnai และ Kapook พบว่าหลายเว็บให้รายชื่อจำนวนมากและกฎอักษรห้ามเป็นหลัก จุดที่บทความนี้เพิ่มให้ชัดขึ้นคือการแยกตารางทักษาวันพุธกลางคืนแบบครบหมวด พร้อมรายชื่อจากฐานข้อมูล NameMongkol ที่ผ่านการกรองอักษรกาลกิณีและคำนวณผลรวมเบื้องต้นแล้ว
    </p>
  </section>

  <section id="wednesday-day-vs-night" class="space-y-5">
    <h2 class="text-2xl md:text-3xl font-bold text-white">พุธกลางคืนต่างจากพุธกลางวันอย่างไร</h2>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <h3 class="text-xl font-bold text-emerald-200">วันพุธกลางวัน</h3>
        <p class="mt-2 text-slate-300">โดยทั่วไปนับช่วงกลางวันของวันพุธ และมีอักษรกาลกิณีคนละชุดกับพุธกลางคืน จึงไม่ควรใช้ลิสต์เดียวกันแบบเหมารวม</p>
      </div>
      <div class="rounded-2xl border border-indigo-400/25 bg-indigo-400/10 p-5">
        <h3 class="text-xl font-bold text-indigo-100">วันพุธกลางคืน หรือราหู</h3>
        <p class="mt-2 text-slate-300">นับ 18.00 น. วันพุธ ถึง 05.59 น. วันพฤหัสบดี อักษรกาลกิณีคือ ${dayConfig.kali.join(' ')} และมีพลังทักษาเฉพาะของราหู</p>
      </div>
    </div>
  </section>

  <section id="naming-framework" class="space-y-5">
    <h2 class="text-2xl md:text-3xl font-bold text-white">หลักการตั้งชื่อลูกชายเกิดวันพุธกลางคืน</h2>
    <p class="text-slate-300 leading-relaxed">ก่อนเลือกชื่อจากตาราง ควรมองภาพรวมให้ครบ 5 ชั้น คือทักษา เลขศาสตร์ อายตนะ ความหมาย และความเข้ากับนามสกุล เพื่อให้ชื่อที่เลือกไม่ได้ดีแค่ตัวอักษร แต่เหมาะกับชีวิตจริงของลูกด้วย</p>
    <div class="grid gap-4 md:grid-cols-3">
      ${articleImage('/images/articles/wednesday-night-naming-mind-map.svg', 'หลักการตั้งชื่อลูกชายเกิดวันพุธกลางคืน', 'Mind Map: 5 หลักที่ควรเช็กก่อนตั้งชื่อ')}
      ${articleImage('/images/articles/wednesday-night-top-10-boy-names.svg', '10 ชื่อมงคลยอดนิยมสำหรับลูกชายวันพุธกลางคืน', 'Top 10 ชื่อมงคลจากรายชื่อที่ผ่านการคัดเบื้องต้น')}
      ${articleImage('/images/articles/wednesday-night-naming-flowchart.svg', 'ขั้นตอนตรวจชื่อมงคลวันพุธกลางคืน', 'Flowchart: วันเกิด → ทักษา → เลขศาสตร์ → นามสกุล → คะแนน')}
    </div>
  </section>

  <section id="thaksa-table" class="space-y-5">
    <h2 class="text-2xl md:text-3xl font-bold text-white">ตารางอักษรทักษาวันพุธกลางคืน</h2>
    <p class="text-slate-300 leading-relaxed">ตารางนี้ใช้กฎจากระบบทักษาของ NameMongkol เพื่อช่วยคัดชื่อเบื้องต้น ก่อนนำชื่อไปตรวจเลขศาสตร์ คู่เลข และนามสกุลจริงอีกครั้ง</p>
    ${articleImage('/images/articles/wednesday-night-thaksa-table-infographic.webp', 'ตารางอักษรทักษาวันพุธกลางคืน', 'อินโฟกราฟิกตารางทักษาวันพุธกลางคืน พร้อมไฮไลท์อักษรกาลกิณี')}
    <div class="not-prose overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-xl">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="bg-slate-800/90 text-slate-200">
          <tr>
            <th class="px-4 py-3">หมวดทักษา</th>
            <th class="px-4 py-3">อักษร</th>
            <th class="px-4 py-3">ความหมายโดยย่อ</th>
          </tr>
        </thead>
        <tbody>${renderThaksaRows()}</tbody>
      </table>
    </div>
  </section>

  <section id="kalakini-warning" class="space-y-5">
    <h2 class="text-2xl md:text-3xl font-bold text-white">อักษรกาลกิณีที่ควรหลีกเลี่ยง</h2>
    ${articleImage('/images/articles/wednesday-night-kalakini-letters-infographic.webp', 'อักษรกาลกิณีวันพุธกลางคืน', 'ตัวอักษรต้องห้ามวันพุธกลางคืน: บ ป ผ ฝ พ ฟ ภ ม')}
    <div class="rounded-3xl border border-rose-500/30 bg-rose-950/25 p-6">
      <p class="text-lg leading-relaxed text-rose-100">
        สำหรับลูกชายเกิดวันพุธกลางคืน ควรหลีกเลี่ยงตัวอักษร <strong class="text-white">${dayConfig.kali.join(' ')}</strong> ไม่ใช่เฉพาะตัวหน้า แต่ควรตรวจทั้งชื่อ เพราะตัวอักษรเหล่านี้อยู่ในหมวดกาลกิณีของวันพุธกลางคืน
      </p>
      <div class="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-8">
        ${dayConfig.kali.map((char) => `<span class="rounded-2xl border border-rose-300/20 bg-white/10 px-4 py-3 text-center text-3xl font-black text-rose-100">${char}</span>`).join('')}
      </div>
    </div>
  </section>

  <section id="score-system" class="space-y-5">
    <h2 class="text-2xl md:text-3xl font-bold text-white">ระบบให้คะแนนชื่อมงคลดูอะไรบ้าง</h2>
    ${articleImage('/images/articles/auspicious-name-score-dashboard.webp', 'ตัวอย่างการวิเคราะห์คะแนนชื่อมงคล', 'ตัวอย่าง Dashboard คะแนนชื่อมงคล: ทักษา เลขศาสตร์ อายตนะ ความหมาย และนามสกุล')}
    <div class="grid gap-4 md:grid-cols-5">
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="font-bold text-amber-200">ทักษา</p><p class="mt-2 text-sm text-slate-300">ดูวันเกิดและอักษรกาลกิณี</p></div>
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="font-bold text-amber-200">เลขศาสตร์</p><p class="mt-2 text-sm text-slate-300">ดูผลรวมและคู่เลขในชื่อ</p></div>
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="font-bold text-amber-200">อายตนะ</p><p class="mt-2 text-sm text-slate-300">ดูแรงส่งด้านจิตใจและภาพรวม</p></div>
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="font-bold text-amber-200">ความหมาย</p><p class="mt-2 text-sm text-slate-300">อ่านง่าย ไพเราะ และมีเจตนาดี</p></div>
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="font-bold text-amber-200">นามสกุล</p><p class="mt-2 text-sm text-slate-300">ตรวจคะแนนรวมก่อนใช้จริง</p></div>
    </div>
  </section>

  <section id="analyzed-names" class="space-y-5">
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">ตัวอย่างจากฐานข้อมูล</p>
      <h2 class="mt-2 text-2xl md:text-3xl font-bold text-white">50 ชื่อลูกชายวันพุธกลางคืนที่ผ่านการวิเคราะห์เบื้องต้น</h2>
      <p class="mt-3 text-slate-300 leading-relaxed">
        รายชื่อนี้คัดจากฐานข้อมูลชื่อของ NameMongkol โดยกรองชื่อที่เหมาะกับผู้ชายหรือใช้ได้กลาง ๆ ตัดชื่อที่มีอักษรกาลกิณีวันพุธกลางคืนออก แล้วเรียงจากคะแนนเลขศาสตร์เบื้องต้น เหมาะสำหรับใช้เป็น short list ก่อนตรวจชื่อกับนามสกุลจริง
      </p>
    </div>
    ${articleImage('/images/articles/wednesday-night-boy-name-examples.webp', 'ตัวอย่างชื่อลูกชายมงคลวันพุธกลางคืน', 'ตัวอย่างชื่อมงคลสำหรับลูกชายเกิดวันพุธกลางคืน ก่อนคัดลงตาราง 50 ชื่อ')}
    <div class="not-prose overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-xl">
      <table class="w-full min-w-[980px] text-left text-sm">
        <thead class="bg-slate-800/90 text-slate-200">
          <tr>
            <th class="px-3 py-3 w-12">#</th>
            <th class="px-3 py-3">ชื่อ</th>
            <th class="px-3 py-3">ความหมาย/แนวพลัง</th>
            <th class="px-3 py-3 text-center">ผลรวม</th>
            <th class="px-3 py-3 text-center">คะแนน</th>
            <th class="px-3 py-3 text-center">เกรด</th>
            <th class="px-3 py-3">เหตุผลที่เหมาะ</th>
          </tr>
        </thead>
        <tbody>${renderNameRows()}</tbody>
      </table>
    </div>
    <p class="text-sm text-slate-400">หมายเหตุ: คะแนนและเกรดในตารางเป็นการคัดกรองจากชื่อเดี่ยวเท่านั้น ชื่อจริงที่ดีที่สุดควรตรวจร่วมกับนามสกุล วันเกิด และคู่เลขในชื่ออีกครั้ง</p>
  </section>

  <section id="how-to-use-with-surname" class="space-y-5">
    <h2 class="text-2xl md:text-3xl font-bold text-white">เลือกชื่อแล้วต้องดูนามสกุลด้วยไหม</h2>
    <div class="rounded-3xl border border-amber-500/25 bg-amber-500/10 p-6">
      <p class="text-slate-200 leading-relaxed">
        ควรดูร่วมกันเสมอ เพราะชื่อเดี่ยวอาจไม่มีอักษรกาลกิณีและผลรวมดี แต่เมื่อนำไปบวกกับนามสกุลแล้วผลรวมรวม หรือคู่เลขบางตำแหน่งอาจเปลี่ยนภาพรวมได้ วิธีที่ปลอดภัยคือเลือกชื่อที่ชอบ 5-10 ชื่อจากตารางนี้ แล้วนำไปตรวจพร้อมนามสกุลจริง
      </p>
      <div class="mt-5 grid gap-3 md:grid-cols-3">
        <a href="/name-check" class="rounded-2xl bg-amber-400 px-5 py-4 text-center font-bold text-slate-950 transition hover:bg-amber-300">วิเคราะห์ชื่อพร้อมนามสกุลฟรี</a>
        <a href="/search" class="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-bold text-white transition hover:bg-white/10">ค้นหาชื่อมงคลเพิ่มเติม</a>
        <a href="/premium-search" class="rounded-2xl border border-amber-400/30 bg-slate-950 px-5 py-4 text-center font-bold text-amber-200 transition hover:bg-slate-900">ดูชื่อพรีเมียมที่คัดคะแนนแล้ว</a>
      </div>
      <div class="mt-6">
        ${articleImage('/images/articles/name-check-family-cta-wednesday-night.webp', 'ตรวจชื่อพร้อมนามสกุลฟรี', 'ให้ทุกชื่อเป็นจุดเริ่มต้นของชีวิตที่ดี ตรวจชื่อพร้อมนามสกุลก่อนใช้จริง')}
      </div>
    </div>
  </section>

  <section id="faq" class="space-y-5">
    ${articleImage('/images/articles/wednesday-night-good-vs-bad-name.webp', 'เปรียบเทียบชื่อมงคลวันพุธกลางคืน', 'เปรียบเทียบชื่อที่เหมาะกับวันพุธกลางคืนกับชื่อที่มีอักษรกาลกิณี')}
    <h2 class="text-2xl md:text-3xl font-bold text-white">คำถามที่พบบ่อย</h2>
    <p class="text-slate-300">สรุปคำตอบสำคัญสำหรับพ่อแม่ที่กำลังตั้งชื่อลูกชายเกิดวันพุธกลางคืน</p>
  </section>
</div>
`;

export const articleWednesdayNightBoyNames2569: Article = {
    id: 'article-wednesday-night-boy-names-2569',
    slug: 'boy-names-wednesday-night-2569',
    title: 'ตั้งชื่อลูกชายเกิดวันพุธกลางคืน 2569 พร้อมชื่อมงคลที่ผ่านการวิเคราะห์',
    excerpt: 'คู่มือตั้งชื่อลูกชายเกิดวันพุธกลางคืน 2569 พร้อมวิธีนับเวลาเกิด อักษรกาลกิณีที่ควรเลี่ยง ตารางทักษาราหู และ 50 ตัวอย่างชื่อจากฐานข้อมูลที่ผ่านการวิเคราะห์คะแนนเบื้องต้น',
    coverImage: '/images/articles/cover-wednesday-night-boy-names-2569.webp',
    coverImageAlt: 'ตั้งชื่อลูกชายเกิดวันพุธกลางคืน 2569',
    date: '2026-06-05',
    author: 'อาจารย์ณัฐ (NameMongkol)',
    category: 'ชื่อมงคลตามวันเกิด',
    keywords: [
        'ตั้งชื่อลูกชายเกิดวันพุธกลางคืน',
        'ชื่อลูกชายวันพุธกลางคืน',
        'ชื่อมงคลลูกชายวันพุธกลางคืน',
        'อักษรกาลกิณีวันพุธกลางคืน',
        'ลูกชายเกิดวันพุธกลางคืนชื่ออะไรดี',
        'ตั้งชื่อลูกตามวันเกิดวันพุธกลางคืน',
        'ชื่อผู้ชายวันพุธกลางคืน 2569',
    ],
    metaTitle: 'ตั้งชื่อลูกชายเกิดวันพุธกลางคืน 2569: 50 ชื่อมงคล พร้อมอักษรห้าม | NameMongkol',
    metaDescription: 'รวมชื่อลูกชายเกิดวันพุธกลางคืน 2569 พร้อมวิธีนับเวลาเกิด อักษรกาลกิณี บ ป ผ ฝ พ ฟ ภ ม ตารางทักษา และตัวอย่างชื่อที่ผ่านการวิเคราะห์คะแนน',
    relatedSlugs: [
        '700-auspicious-names-by-birthday-2569',
        'auspicious-boy-names-2569',
        'boy-names-2569-50-auspicious',
        'baby-naming-guide-2569',
        'forbidden-letters-kalakini',
        'thaksa-pakorn-naming-guide',
    ],
    dateModified: '2026-06-05',
    toc: [
        { title: 'คำตอบสั้นก่อนเลือกชื่อ', id: 'quick-answer', level: 2 },
        { title: 'พุธกลางคืนต่างจากพุธกลางวันอย่างไร', id: 'wednesday-day-vs-night', level: 2 },
        { title: 'หลักการตั้งชื่อลูกชายเกิดวันพุธกลางคืน', id: 'naming-framework', level: 2 },
        { title: 'ตารางอักษรทักษาวันพุธกลางคืน', id: 'thaksa-table', level: 2 },
        { title: 'อักษรกาลกิณีที่ควรหลีกเลี่ยง', id: 'kalakini-warning', level: 2 },
        { title: 'ระบบให้คะแนนชื่อมงคลดูอะไรบ้าง', id: 'score-system', level: 2 },
        { title: '50 ชื่อที่ผ่านการวิเคราะห์เบื้องต้น', id: 'analyzed-names', level: 2 },
        { title: 'เลือกชื่อแล้วต้องดูนามสกุลด้วยไหม', id: 'how-to-use-with-surname', level: 2 },
        { title: 'คำถามที่พบบ่อย', id: 'faq', level: 2 },
    ],
    faqItems: [
        {
            question: 'ลูกชายเกิดวันพุธกลางคืนนับกี่โมง?',
            answer: 'โดยแนวทางที่ใช้ในบทความนี้ วันพุธกลางคืนหรือราหูเริ่มตั้งแต่ 18.00 น. ของวันพุธ ถึง 05.59 น. ของวันพฤหัสบดี หากเกิดก่อนช่วงนี้ให้ตรวจตามวันพุธกลางวันแทน',
        },
        {
            question: 'อักษรห้ามของวันพุธกลางคืนคืออะไร?',
            answer: 'อักษรกาลกิณีของวันพุธกลางคืนคือ บ ป ผ ฝ พ ฟ ภ ม ควรหลีกเลี่ยงในชื่อจริง โดยตรวจทั้งชื่อ ไม่ใช่เฉพาะตัวอักษรตัวแรก',
        },
        {
            question: 'พุธกลางคืนกับพุธกลางวันต่างกันอย่างไร?',
            answer: 'ต่างกันที่ช่วงเวลาและชุดอักษรทักษา วันพุธกลางวันกับวันพุธกลางคืนมีอักษรกาลกิณีคนละชุด จึงควรเลือกชื่อจากกฎของช่วงเวลาเกิดที่ถูกต้อง',
        },
        {
            question: 'ใช้ชื่อที่มีสระได้ไหม?',
            answer: 'ใช้ได้ครับ สำหรับวันพุธกลางคืน สระอยู่ในหมวดเดช ไม่ใช่อักษรกาลกิณี แต่ยังควรตรวจผลรวมเลขศาสตร์และความเข้ากันกับนามสกุลร่วมด้วย',
        },
        {
            question: 'ต้องดูนามสกุลร่วมด้วยหรือไม่?',
            answer: 'ควรดูร่วมด้วยเสมอ เพราะชื่อเดี่ยวที่ดีอาจให้ผลรวมรวมกับนามสกุลต่างกัน การตรวจชื่อพร้อมนามสกุลช่วยเห็นคะแนนรวม คู่เลข และจุดที่ควรระวังได้แม่นขึ้น',
        },
        {
            question: 'ถ้ามีอักษรกาลกิณีตัวเดียวใช้ได้ไหม?',
            answer: 'ถ้าเคร่งตามหลักทักษา ควรหลีกเลี่ยงอักษรกาลกิณีแม้มีเพียงตัวเดียว แต่หากเป็นชื่อที่ครอบครัวชอบมาก ควรนำไปวิเคราะห์ร่วมกับนามสกุลและดูภาพรวมหลายศาสตร์ก่อนตัดสินใจ',
        },
    ],
    content,
};
