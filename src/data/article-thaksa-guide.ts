import { Article } from './articles';

export const articleThaksaGuide: Article = {
    id: 'article-thaksa-guide',
    slug: 'thaksa-pakorn-naming-guide',
    title: 'ทักษา-ปกรณ์: หลักคำตั้งชื่อลูกให้ตรงจุด — หลีกเลี่ยงอักษรกาลกิณี',
    excerpt: 'ศึกษาทักษา-ปกรณ์ — ศาสตร์การเลือกอักษรให้ตรงกับวันเกิด วิธีหลีกเลี่ยงอักษรกาลกิณี พยัญชนะที่มงคล และเทคนิกการตั้งชื่อลูกให้ปลอดภัยจากพลังเลวร้าย',
    coverImage: '/cover-thaksa-guide.svg',
    coverImageAlt: 'ทักษา-ปกรณ์: ศาสตร์การตั้งชื่อตามวันเกิด 7 วัน | NameMongkol',
    date: '2026-04-28',
    author: 'อาจารย์ณัฐ (NameMongkol)',
    category: 'ศาสตร์มงคล',
    keywords: [
        'ทักษา ปกรณ์', 'ทักษาตั้งชื่อ', 'อักษรกาลกิณี', 'อักษรศัตรู', 'วันเกิด',
        'ตั้งชื่อตามทักษา', 'ตั้งชื่อตามวันเกิด', 'พยัญชนะมงคล', 'พยัญชนะศัตรู',
        'ทักษา หลักการ', 'วิธีหลีกเลี่ยงกาลกิณี', 'ทักษากับตั้งชื่อ'
    ],
    metaTitle: 'ทักษา-ปกรณ์: หลักการตั้งชื่อลูกตามวันเกิด | NameMongkol',
    metaDescription: 'ศึกษาทักษา-ปกรณ์ วิธีหลีกเลี่ยงอักษรกาลกิณี ตารางอักษรมงคล-ศัตรูตามวันเกิด และเทคนิกตั้งชื่อลูกให้ปลอดภัยสูงสุด',
    relatedSlugs: ['baby-naming-guide-2569', 'เลขศาสตร์-ตั้งชื่อมงคล', 'boy-names-2569-50-auspicious', 'girl-names-2569-50-auspicious'],
    dateModified: '2026-04-28',
    toc: [
        { title: 'ทักษา-ปกรณ์ คืออะไร?', id: 'what-is-thaksa', level: 2 },
        { title: 'อักษรกาลกิณี คือ "อักษรศัตรู" ตามวันเกิด', id: 'kalakini-enemy-letters', level: 2 },
        { title: 'ตารางเต็ม: ทักษา-อักษรกาลกิณี-ตัวอักษรมงคล', id: 'full-thaksa-table', level: 2 },
        { title: 'เทคนิกการหลีกเลี่ยงอักษรกาลกิณี', id: 'techniques-avoid-kalakini', level: 2 },
        { title: 'ทักษากับชื่อ: ตัวอย่างการนำไปใช้', id: 'thaksa-examples', level: 2 },
        { title: 'ทักษา vs เลขศาสตร์: ใช้ร่วมกันอย่างไร?', id: 'thaksa-vs-numerology', level: 2 },
        { title: 'FAQ: คำถามเกี่ยวกับทักษา', id: 'faq-thaksa', level: 2 },
    ],
    faqItems: [
        {
            question: 'ทั้งชื่อต้นและนามสกุล ต้องหลีกเลี่ยงกาลกิณี ใช่ไหม?',
            answer: 'ใช่แล้ว! อักษรกาลกิณีต้องหลีกเลี่ยง ทั้งในชื่อต้นและนามสกุล เพราะทั้งสองส่วนจะตรวจสอบพื้นฐานของผู้นั้น'
        },
        {
            question: 'วันเกิด "กลางคืน" vs "กลางวัน" ทำให้ผลต่างไหม?',
            answer: 'ใช่ ทักษาจะแตกต่าง พิเศษอย่างเดียวคือ "วันพุธ" ที่แยกเป็น "พุธกลางวัน" และ "พุธกลางคืน" มีอักษรกาลกิณีต่างกัน'
        },
        {
            question: 'ถ้าไม่รู้เวลาเกิดแน่นอน ใช้ "ประมาณ" ได้ไหม?',
            answer: 'ได้แต่อาจไม่แน่นอน ทักษาถือว่ามีความสำคัญ หากเป็นไปได้ สอบถามแม่ หรือตรวจสอบเอกสารออกแบบให้ได้วันเกิดที่แน่นอน'
        },
        {
            question: 'ตั้งชื่อลูกแฝด วันเกิดต่างกัน ทำให้ทักษาต่างไหม?',
            answer: 'ใช่แล้ว แฝดแต่ละคนมีเวลาเกิดต่างกัน (อาจต่างกันนาที-ชั่วโมง) ให้ตั้งชื่อแต่ละคนแยกกัน ตามวันเกิดของแต่ละคน'
        }
    ],
    content: `
<div class="space-y-12">

    <!-- บทนำ -->
    <section id="what-is-thaksa">
        <h2 class="text-3xl font-bold text-amber-400 mb-4">ทักษา-ปกรณ์ คืออะไร?</h2>
        <p class="text-lg text-slate-300 leading-relaxed mb-6">
            <strong>"ทักษา-ปกรณ์"</strong> คือ ศาสตร์ดัดแปลงว่า<strong class="text-amber-300">"วันเกิดและอักษร ต้องตรงกัน"</strong>
        </p>
        <p class="text-lg text-slate-300 leading-relaxed mb-6">
            ทักษา-ปกรณ์บอกว่า แต่ละวันเกิด มีพยัญชนะที่ "เข้าเวหา" (มงคล) และพยัญชนะที่ "ขัดเวหา" (กาลกิณี) ซึ่งต้องหลีกเลี่ยง
        </p>
    </section>

    <!-- กาลกิณี -->
    <section id="kalakini-enemy-letters">
        <h2 class="text-3xl font-bold text-amber-400 mb-4">อักษรกาลกิณี คือ "อักษรศัตรู" ตามวันเกิด</h2>
        <p class="text-lg text-slate-300 leading-relaxed mb-6">
            <strong class="text-rose-300">"กาลกิณี"</strong> คือ ตำแหน่งที่ 8 ของทักษา ซึ่งถือเป็นตำแหน่งร้ายที่สุด
            หากชื่อมีอักษรที่ตกในตำแหน่งกาลกิณี เชื่อว่าจะนำพาอุปสรรค ศัตรู และเคราะห์ร้ายมาสู่เจ้าของชื่อ
        </p>
        <div class="bg-rose-900/20 border border-rose-500/30 rounded-lg p-6 mb-6">
            <p class="text-slate-300 text-sm leading-relaxed">
                <strong class="text-rose-300">⚠️ สำคัญ:</strong> แต่ละวันเกิดมีกาลกิณีต่างกัน! อักษรที่เป็นกาลกิณีของวันอาทิตย์
                อาจเป็นอักษรมงคลของวันอื่น ดังนั้นต้องตรวจสอบตามวันเกิดเฉพาะเจาะจง
            </p>
        </div>
    </section>

    <!-- ตารางเต็ม -->
    <section id="full-thaksa-table">
        <h2 class="text-3xl font-bold text-amber-400 mb-4">ตารางเต็ม: ทักษา 8 ตำแหน่ง ครบทุกวันเกิด</h2>

        <p class="text-slate-300 leading-relaxed mb-6">
            ทักษาแบ่งพยัญชนะไทยออกเป็น <strong class="text-amber-300">8 วรรค</strong> ตามหลักอักษรสมัย แล้วหมุนเวียนตำแหน่งตามวันเกิด โดยแต่ละตำแหน่งมีความหมาย:
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div class="bg-slate-800/50 rounded-lg p-3 text-center">
                <span class="text-slate-200 font-bold text-sm">บริวาร</span>
                <p class="text-slate-400 text-xs mt-1">คนรอบข้าง ครอบครัว</p>
            </div>
            <div class="bg-blue-900/30 rounded-lg p-3 text-center">
                <span class="text-blue-200 font-bold text-sm">อายุ</span>
                <p class="text-slate-400 text-xs mt-1">สุขภาพ ความเป็นอยู่</p>
            </div>
            <div class="bg-amber-900/30 rounded-lg p-3 text-center">
                <span class="text-amber-200 font-bold text-sm">เดช</span>
                <p class="text-slate-400 text-xs mt-1">อำนาจ เกียรติยศ</p>
            </div>
            <div class="bg-emerald-900/30 rounded-lg p-3 text-center">
                <span class="text-emerald-200 font-bold text-sm">ศรี</span>
                <p class="text-slate-400 text-xs mt-1">โชคลาภ เสน่ห์</p>
            </div>
            <div class="bg-indigo-900/30 rounded-lg p-3 text-center">
                <span class="text-indigo-200 font-bold text-sm">มูละ</span>
                <p class="text-slate-400 text-xs mt-1">หลักทรัพย์ มรดก</p>
            </div>
            <div class="bg-purple-900/30 rounded-lg p-3 text-center">
                <span class="text-purple-200 font-bold text-sm">อุตสาหะ</span>
                <p class="text-slate-400 text-xs mt-1">ความขยัน การงาน</p>
            </div>
            <div class="bg-sky-900/30 rounded-lg p-3 text-center">
                <span class="text-sky-200 font-bold text-sm">มนตรี</span>
                <p class="text-slate-400 text-xs mt-1">ผู้ใหญ่ ที่พึ่ง</p>
            </div>
            <div class="bg-rose-900/30 rounded-lg p-3 text-center">
                <span class="text-rose-200 font-bold text-sm">กาลกิณี</span>
                <p class="text-slate-400 text-xs mt-1">อุปสรรค ศัตรู ⚠️</p>
            </div>
        </div>
        
        <div class="bg-slate-800/50 rounded-lg p-6 mb-8 overflow-x-auto">
            <h3 class="text-lg font-bold text-amber-300 mb-4">ตารางอักษรกาลกิณี (ห้ามใช้) ตามวันเกิด</h3>
            <table class="w-full text-sm text-slate-300">
                <thead class="border-b border-amber-500/30">
                    <tr>
                        <th class="text-left px-4 py-3 text-amber-300">วันเกิด</th>
                        <th class="text-left px-4 py-3 text-red-300">🚫 อักษรกาลกิณี (ห้าม)</th>
                        <th class="text-left px-4 py-3 text-amber-300">ทักษาที่เป็นกาลกิณี</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                    <tr>
                        <td class="px-4 py-3 font-bold text-yellow-400">อาทิตย์</td>
                        <td class="px-4 py-3 text-red-400 font-bold">ศ ษ ส ห ฬ ฮ</td>
                        <td class="px-4 py-3 text-slate-400">วรรค ศอ–ฮอ</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-yellow-400">จันทร์</td>
                        <td class="px-4 py-3 text-red-400 font-bold">สระ + วรรณยุกต์</td>
                        <td class="px-4 py-3 text-slate-400">สระ, ไม้หันอากาศ, การันต์, วรรณยุกต์</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-red-400">อังคาร</td>
                        <td class="px-4 py-3 text-red-400 font-bold">ก ข ฃ ค ฅ ฆ ง</td>
                        <td class="px-4 py-3 text-slate-400">วรรค กอ</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-pink-400">พุธ (กลางวัน)</td>
                        <td class="px-4 py-3 text-red-400 font-bold">จ ฉ ช ซ ฌ ญ</td>
                        <td class="px-4 py-3 text-slate-400">วรรค จอ</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-pink-400">พุธ (กลางคืน/ราหู)</td>
                        <td class="px-4 py-3 text-red-400 font-bold">บ ป ผ ฝ พ ฟ ภ ม</td>
                        <td class="px-4 py-3 text-slate-400">วรรค บอ</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-orange-400">พฤหัสบดี</td>
                        <td class="px-4 py-3 text-red-400 font-bold">ด ต ถ ท ธ น</td>
                        <td class="px-4 py-3 text-slate-400">วรรค ดอ</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-cyan-400">ศุกร์</td>
                        <td class="px-4 py-3 text-red-400 font-bold">ย ร ล ว</td>
                        <td class="px-4 py-3 text-slate-400">วรรค ยอ</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-purple-400">เสาร์</td>
                        <td class="px-4 py-3 text-red-400 font-bold">ฎ ฏ ฐ ฑ ฒ ณ</td>
                        <td class="px-4 py-3 text-slate-400">วรรค ฎอ</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6 mb-6">
            <p class="text-amber-200 text-sm">
                <strong>💡 ตัวอย่างวิธีใช้:</strong> ลูกเกิดวันอังคาร → ต้องหลีกเลี่ยง "ก ข ค ฆ ง" (วรรค กอ) ในชื่อต้นและนามสกุล
            </p>
        </div>
    </section>

    <!-- เทคนิก -->
    <section id="techniques-avoid-kalakini">
        <h2 class="text-3xl font-bold text-amber-400 mb-4">เทคนิกการหลีกเลี่ยงอักษรกาลกิณี</h2>
        
        <div class="space-y-6">
            <div class="bg-slate-800/50 rounded-lg p-6">
                <h3 class="text-lg font-bold text-amber-300 mb-3">① ตรวจสอบชื่อต้นก่อน</h3>
                <p class="text-slate-300 text-sm leading-relaxed mb-3">
                    ให้ความสำคัญกับอักษรตัวแรกของชื่อ เนื่องจากเป็นตัวแรกที่ติดตัวเด็กตั้งแต่วัน 1
                </p>
                <div class="bg-slate-900/50 rounded p-3 text-slate-300 text-sm">
                    ตัวอย่าง: ลูกเกิดวันอาทิตย์ (ห้าม ศ ษ ส ห ฬ ฮ)<br/>
                    ❌ ชื่อ "สิริรัตน์" (มีตัว ส = กาลกิณี)<br/>
                    ✅ ชื่อ "ธนกร" (ไม่มีอักษรกาลกิณี)
                </div>
            </div>

            <div class="bg-slate-800/50 rounded-lg p-6">
                <h3 class="text-lg font-bold text-amber-300 mb-3">② ตรวจสอบนามสกุล</h3>
                <p class="text-slate-300 text-sm leading-relaxed mb-3">
                    หากนามสกุลขึ้นต้นด้วยอักษรกาลกิณี ให้เลือกชื่อต้นที่มีผลรวมดีเป็นพิเศษเพื่อชดเชย
                </p>
                <div class="bg-slate-900/50 rounded p-3 text-slate-300 text-sm">
                    ตัวอย่าง: นามสกุล "ดีมาก" (เริ่มด้วย ด) + ลูกเกิดวันพฤหัสบดี (ด = กาลกิณี)<br/>
                    → เลือกชื่อต้นที่เกรด A+ เพื่อ compensate
                </div>
            </div>
            <div class="bg-slate-800/50 rounded-lg p-6">
                <h3 class="text-lg font-bold text-amber-300 mb-3">③ ใช้เครื่องมือ NameMongkol ตรวจสอบ</h3>
                <p class="text-slate-300 text-sm leading-relaxed mb-3">
                    หลังเลือกชื่อ นำไปกรอก NameMongkol จะช่วยเช็คว่าไม่มีกาลกิณีและคำนวณผลรวมให้
                </p>
            </div>
        </div>
    </section>

    <!-- ตัวอย่าง -->
    <section id="thaksa-examples">
        <h2 class="text-3xl font-bold text-amber-400 mb-4">ทักษากับชื่อ: ตัวอย่างการนำไปใช้</h2>
        
        <div class="space-y-4 text-slate-300">
            <div class="bg-slate-800/50 rounded-lg p-6">
                <h4 class="font-bold text-amber-300 mb-2">ตัวอย่าง 1: เด็กชายเกิดวันอังคาร นามสกุล "สิมเมือง"</h4>
                <ul class="text-sm space-y-1 ml-4">
                    <li>🚫 ห้าม: ก ข ค ฆ ง (วรรค กอ = กาลกิณีวันอังคาร)</li>
                    <li>✅ นามสกุล "สิมเมือง" → เริ่มด้วย ส ไม่ตรงกาลกิณี ✓</li>
                    <li>💡 เลือกชื่อ: "ธนกร" — ตัว ธ ไม่ใช่กาลกิณี แต่ ตัว ก = กาลกิณี ⚠️</li>
                    <li>💡 เลือกชื่อ: "ธนเดช" — ไม่มีอักษรกาลกิณีเลย ✅</li>
                </ul>
            </div>

            <div class="bg-slate-800/50 rounded-lg p-6">
                <h4 class="font-bold text-amber-300 mb-2">ตัวอย่าง 2: เด็กสาวเกิดวันศุกร์ นามสกุล "พิมลา"</h4>
                <ul class="text-sm space-y-1 ml-4">
                    <li>🚫 ห้าม: ย ร ล ว (วรรค ยอ = กาลกิณีวันศุกร์)</li>
                    <li>⚠️ นามสกุล "พิมลา" มีตัว ล (กาลกิณี) → ต้องใช้ชื่อต้นเกรด A+ เพื่อชดเชย</li>
                    <li>💡 เลือกชื่อ: "กัญญา" หรือ "ธนิกา" (ไม่มี ย ร ล ว + ผลรวมดี)</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- ทักษา vs เลขศาสตร์ -->
    <section id="thaksa-vs-numerology">
        <h2 class="text-3xl font-bold text-amber-400 mb-4">ทักษา vs เลขศาสตร์: ใช้ร่วมกันอย่างไร?</h2>
        
        <div class="bg-slate-800/50 rounded-lg p-6 mb-6">
            <table class="w-full text-sm text-slate-300">
                <thead class="border-b border-amber-500/30">
                    <tr>
                        <th class="text-left px-4 py-3 text-amber-300">ศาสตร์</th>
                        <th class="text-left px-4 py-3 text-amber-300">ตรวจสอบ</th>
                        <th class="text-left px-4 py-3 text-amber-300">อิทธิพล</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                    <tr>
                        <td class="px-4 py-3 font-bold text-amber-400">ทักษา</td>
                        <td class="px-4 py-3">อักษรแรกให้ตรงวันเกิด</td>
                        <td class="px-4 py-3">วันเกิดแยกตัวแน่นอน</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3 font-bold text-amber-400">เลขศาสตร์</td>
                        <td class="px-4 py-3">ผลรวมตัวเลขชื่อ+นามสกุล</td>
                        <td class="px-4 py-3">ระดับมงคลโดยรวม</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="bg-gradient-to-r from-amber-900/30 to-slate-900/30 border border-amber-500/30 rounded-lg p-6">
            <p class="text-amber-300 text-sm mb-3"><strong>✨ วิธีใช้ทั้งสอง:</strong></p>
            <ol class="text-slate-300 text-sm space-y-2 list-decimal list-inside">
                <li>เลือกชื่อที่ <strong>ไม่มีอักษรกาลกิณี</strong> ตามทักษา (ข้อ 1)</li>
                <li>จากชื่อที่เลือก นำไป <strong>ตรวจเลขศาสตร์</strong> ว่าผลรวมดีไหม (ข้อ 2)</li>
                <li>หากผลรวมไม่ดี ลองเลือกชื่อใหม่ โดยยังคงไม่มีกาลกิณี</li>
                <li>วนซ้ำจนกว่า <strong>ทักษา ✓ + เลขศาสตร์ ✓ = เกรด A+</strong></li>
            </ol>
        </div>
    </section>

</div>
    `,
};
