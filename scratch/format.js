const fs = require('fs');

const filePath = 'c:\\\\Users\\\\ณวิธบุญยะรัตน์\\\\Desktop\\\\Next.js\\\\6.NAMEMONGKOL\\\\src\\\\data\\\\article-name-by-birthday.ts';
let content = fs.readFileSync(filePath, 'utf8');

function generateDaySection(id, dayName, subtitle, emoji, gradient, colorBase, badLetters, goodLetters, luckyNumbers, description, boyNames, girlNames) {
    const textColor = 'text-' + colorBase + '-400';
    const borderColor = 'border-' + colorBase + '-500/30';
    const hoverBorder = 'hover:border-' + colorBase + '-400/50';
    const shadowColor = 'shadow-' + colorBase + '-500/20';
    
    let boyNamesHtml = '';
    for (let name of boyNames) {
        boyNamesHtml += `
                    <div class="bg-slate-800/30 border border-slate-700/50 ${hoverBorder} rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg group flex items-center justify-between">
                        <div>
                            <div class="text-white font-bold text-lg mb-1 group-hover:${textColor} transition-colors">${name[0]} <span class="text-xs text-slate-500 font-normal ml-2">(${name[1]})</span></div>
                            <div class="text-slate-400 text-xs">${name[2]}</div>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border ${borderColor} ${textColor} font-bold shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                            ${name[3]}
                        </div>
                    </div>
        `;
    }

    let girlNamesHtml = '';
    for (let name of girlNames) {
        girlNamesHtml += `
                    <div class="bg-slate-800/30 border border-slate-700/50 ${hoverBorder} rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg group flex items-center justify-between">
                        <div>
                            <div class="text-white font-bold text-lg mb-1 group-hover:${textColor} transition-colors">${name[0]} <span class="text-xs text-slate-500 font-normal ml-2">(${name[1]})</span></div>
                            <div class="text-slate-400 text-xs">${name[2]}</div>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border ${borderColor} ${textColor} font-bold shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                            ${name[3]}
                        </div>
                    </div>
        `;
    }

    return `
    <!-- ${dayName} -->
    <section id="${id}" class="scroll-mt-24">
        <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadowColor} text-2xl flex-shrink-0">${emoji}</div>
            <div>
                <h2 class="text-2xl md:text-3xl font-bold ${textColor}">ชื่อมงคล: ${dayName}</h2>
                <p class="text-slate-400 text-sm mt-1">${description}</p>
            </div>
        </div>
        
        <div class="flex flex-wrap gap-3 mb-8 bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
            <div class="flex items-center gap-2 text-sm bg-red-500/10 text-red-300 px-3 py-2 rounded-xl border border-red-500/20">
                <span class="font-bold">🚫 ห้าม (กาลกิณี):</span> ${badLetters}
            </div>
            <div class="flex items-center gap-2 text-sm bg-green-500/10 text-green-300 px-3 py-2 rounded-xl border border-green-500/20">
                <span class="font-bold">✓ ใช้ได้:</span> ${goodLetters}
            </div>
            <div class="flex items-center gap-2 text-sm bg-blue-500/10 text-blue-300 px-3 py-2 rounded-xl border border-blue-500/20">
                <span class="font-bold">🔢 เลขมงคล:</span> ${luckyNumbers}
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Boy Names -->
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-xl">👨</span>
                    <h3 class="${textColor} font-bold text-lg">ชื่อลูกชาย${dayName}</h3>
                </div>
                <div class="space-y-3">
                    ${boyNamesHtml}
                </div>
            </div>

            <!-- Girl Names -->
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-xl">👧</span>
                    <h3 class="${textColor} font-bold text-lg">ชื่อลูกสาว${dayName}</h3>
                </div>
                <div class="space-y-3">
                    ${girlNamesHtml}
                </div>
            </div>
        </div>
    </section>
    `;
}

// The new beautiful content
let newContent = `
<div class="space-y-16">

    <!-- บทนำ -->
    <section id="why-birthday-matters" class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-amber-400 to-purple-500 rounded-full hidden md:block"></div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-6 drop-shadow-sm">ทำไมวันเกิดถึงสำคัญ?</h2>
        <p class="text-lg text-slate-300 leading-relaxed mb-8">
            <strong>วันเกิด</strong> คือ "พื้นฐานโหราศาสตร์" ของแต่ละคน ทักษา-ปกรณ์บอกว่า:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-red-500/30 transition-all group relative overflow-hidden">
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
                <div class="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-110 transition-transform relative z-10">1</div>
                <h3 class="text-white font-semibold mb-2 relative z-10">อักษรศัตรู (กาลกิณี)</h3>
                <p class="text-sm text-slate-400 relative z-10">แต่ละวันมี "อักษรศัตรู" ที่ต้องหลีกเลี่ยง เพื่อไม่ให้เกิดอุปสรรค</p>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-amber-500/30 transition-all group relative overflow-hidden">
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
                <div class="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-110 transition-transform relative z-10">2</div>
                <h3 class="text-white font-semibold mb-2 relative z-10">อักษรเทพ (บริวาร/ศรี)</h3>
                <p class="text-sm text-slate-400 relative z-10">แต่ละวันมี "อักษรเทพ" ที่เป็นมงคล ช่วยส่งเสริมโชคลาภพิเศษ</p>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
                <div class="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-110 transition-transform relative z-10">3</div>
                <h3 class="text-white font-semibold mb-2 relative z-10">ความสอดคล้อง (เวหา)</h3>
                <p class="text-sm text-slate-400 relative z-10">ชื่อต้องตรงตามหลักเวหา (วันเกิด) ก่อน ถึงจะช่วยเสริมดวงได้เต็มที่</p>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-purple-500/30 transition-all group relative overflow-hidden">
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all"></div>
                <div class="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-110 transition-transform relative z-10">4</div>
                <h3 class="text-white font-semibold mb-2 relative z-10">ผลรวมตัวเลข</h3>
                <p class="text-sm text-slate-400 relative z-10">ผลรวมตัวเลขต้องเป็นมงคล ทำให้ชื่อแข็งแรงถึง 200%</p>
            </div>
        </div>
        <div class="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4 shadow-lg">
            <span class="text-2xl mt-1 drop-shadow-md">💡</span>
            <div>
                <strong class="text-amber-300 block mb-1">เคล็ดลับการตั้งชื่อที่สมบูรณ์แบบ:</strong>
                <span class="text-slate-300 text-sm leading-relaxed">เลือกชื่อจากวันเกิด ➝ ตรวจสอบว่าไม่ตรงกาลกิณี ➝ ตรวจสอบผลรวมตัวเลข ➝ วิเคราะห์ร่วมกับนามสกุล</span>
            </div>
        </div>
    </section>
`;

newContent += generateDaySection('monday-names', 'วันจันทร์', 'วันแรก', '💛', 'from-yellow-400 to-amber-500', 'yellow', 'ค ก ป', 'จ ช ด ต ถ ท ผ ฟ พ ภ ม ย ร ล ว ศ ษ ส ห ฮ', '2, 4, 6, 8', 'วันจันทร์เป็นวันของจันทร์เทพ ผู้ปกครองจิตใจ ชื่อที่เลือกจะมีความสงบ เมตตา และเหนือกว่า', [
    ['จิรวัฒน์', 'จ-ริ-วัฒ-น์', '"ลำแสงจิตรกรรม" ความรู้อันยาวนาน', '24'],
    ['ชลธร', 'ชล-ธร', '"น้ำสินค้า" ชีวิตมีความสอดคล้องราบรื่น', '18'],
    ['ศรัณย์', 'ศ-รัณ-ย์', '"อาศ้ยศรัท" ความภูมิใจและความรู้', '15'],
    ['ทีปรชัย', 'ที-ปร-ชัย', '"พยานชัย" ผู้มีชีวิตประสบความสำเร็จ', '41'],
    ['ธีระ', 'ธี-ระ', '"ผู้ถือศักดิ์" ผู้เป็นใหญ่และโดดเด่น', '13'],
    ['มนัสชัย', 'มนัส-ชัย', '"จิตชนะ" ผู้มีใจแข็งและประสบชัยชนะ', '36']
], [
    ['จิราภา', 'จิ-รา-ภา', '"จิตรสุขา" ผู้มีชีวิตน่ารักและศรัทธา', '19'],
    ['ชนาธิป', 'ชนา-ธิป', '"คนเป็นผู้นำ" ผู้มีความเป็นผู้บัญชาการ', '24'],
    ['ศศวรรษ', 'ศศ-วรรษ', '"สยามสัดดา" ผู้มีชีวิตเป็นสยาม', '35'],
    ['สมฤดี', 'สม-ฤดี', '"ฤดูดี" ผู้มีชีวิตดี และเหมาะสม', '36'],
    ['ดวงเดือน', 'ดวง-เดือน', '"ดวงจันทร์" ผู้มีความสว่าง', '26'],
    ['ชาลี', 'ชา-ลี', '"ศาสตร์ปลีก" ผู้มีความเฉลียวฉลาด', '17']
]);

newContent += generateDaySection('tuesday-names', 'วันอังคาร', 'วันที่สอง', '🩷', 'from-pink-400 to-rose-500', 'pink', 'จ ช ซ', 'ก ค ด ต ถ ท ผ ฟ พ ภ ม ย ร ล ว ศ ษ ส ห ฮ', '3, 5, 7, 9', 'วันอังคารเป็นวันของอังคารเทพ ผู้ให้ความกล้าหาญ เลือกชื่อเพื่อให้บุคคลมีความแข็งแรง มีอำนาจ', [
    ['กิจศักดิ์', 'กิจ-ศัก-ดิ์', '"กิจกรรมศักดิ์" ผู้มีธุรกิจประสบความสำเร็จ', '36'],
    ['ศิลป์', 'ศิ-ลป์', '"ศิลปะแสง" ผู้มีความชำนาญ', '14'],
    ['ทีรศักดิ์', 'ที-รศัก-ดิ์', '"ผู้ถือศักดิ์" ผู้มีเกียรติ', '19'],
    ['ศิริพล', 'ศิ-รี-พล', '"ศิริพลเมืองไทย" ผู้มีเกียรติและอำนาจ', '24'],
    ['ราชเดช', 'รา-ช-เดช', '"พระราชเดช" ผู้ใต้พระบัญชา', '28'],
    ['ธวัช', 'ธ-วัช', '"ธรรมวัจน์" ผู้มีวาจาดี', '11']
], [
    ['กัญญา', 'กัญ-ญา', '"หญิงสุกุมาร์" ผู้มีความไพบูลย์', '35'],
    ['ศิรินทร์', 'ศิ-ริน-ทร์', '"ศิริทรงน่า" ผู้มีศรี เกียรติยศ', '36'],
    ['ทนยา', 'ทน-ยา', '"ทนยาสมหวัง" ผู้มีความอดทน', '28'],
    ['ศดรัณ', 'ศ-ดรัณ', '"ศศิเดชดรัณ" ผู้มีเดชปรีชา', '39'],
    ['ศศิมา', 'ศศิ-มา', '"จันทร์มา" ผู้มาจากดวงจันทร์', '27'],
    ['ศรีเพชร', 'ศรี-เพชร', '"ศรีเพชรราคา" ผู้มีศรีคุณค่า', '33']
]);

newContent += generateDaySection('wednesday-names', 'วันพุธ', 'วันที่สาม', '💚', 'from-emerald-400 to-green-500', 'emerald', 'ด ต ล', 'ก ค จ ช ถ ท ผ ฟ พ ภ ม ย ร ว ศ ษ ส ห ฮ', '4, 6, 8', 'วันพุธเป็นวันของพุธเทพ ผู้ปกครองการค้า ความรู้ และการสื่อสาร เหมาะสำหรับชื่อที่สื่อการเรียนรู้', [
    ['สมชาย', 'สม-ชาย', '"ชายสมบูรณ์" ผู้มีชีวิตดีบูรณ์', '15'],
    ['สุวัฒน์', 'สุ-วัฒ-น์', '"สุดยอดวัฒนา" ผู้มีชีวิตอันดีเลิศ', '36'],
    ['วิชิต', 'วิ-ชิ-ต', '"วิชญาณชิต" ผู้มีความรู้ชำนาญ', '14'],
    ['พรมศักดิ์', 'พรม-ศัก-ดิ์', '"พรมแห่งศักดิ์" ผู้มีศักดิ์สิทธิ์', '24'],
    ['วีรชัย', 'วี-รชัย', '"วีรชัยวิบูลย์" ผู้มีชัยเหนือ', '22'],
    ['พิศาล', 'พิ-สา-ล', '"พิศาลพร" ผู้มีพรพิเศษ', '18']
], [
    ['สุชาดา', 'สุ-ชา-ดา', '"สุขโชค" ผู้มีความสุขโชคดี', '24'],
    ['ศศิชา', 'ศศิ-ชา', '"จันทร์ชา" ผู้มีความสว่างจ้า', '36'],
    ['สิรินทร์', 'สิ-รีน-ทร์', '"ศรีศิริ" ผู้มีศรีคุณค่า', '36'],
    ['วรรณา', 'วรร-นา', '"ธรรมณา" ผู้มีพรธรรม', '36'],
    ['พัชรา', 'พัช-รา', '"พัชรมงคล" ผู้มีมงคลเหมือนพัชร', '26'],
    ['วิภา', 'วิ-ภา', '"วิภวะมา" ผู้มาจากน้อยไปมาก', '14']
]);

newContent += generateDaySection('thursday-names', 'วันพฤหัสบดี', 'วันที่สี่', '🧡', 'from-orange-400 to-amber-500', 'orange', 'ถ ท พ', 'ก ค จ ช ด ต ผ ฟ ภ ม ย ร ล ว ศ ษ ส ห ฮ', '3, 5, 7, 9', 'วันพฤหัสบดีเป็นวันของพฤหัสบดีเทพ ผู้ให้สติปัญญา โชค และสมบูรณ์ โชค', [
    ['กศลน์', 'กศ-ลน์', '"กศลเจริญ" ผู้มีกุศลเพิ่มพูน', '24'],
    ['คณาหาร', 'คณา-หาร', '"คณารุจ" ผู้มีคุณสมบัติ', '36'],
    ['จรรยา', 'จรร-ยา', '"จริยธรรม" ผู้มีศีลธรรมเหมาะสม', '39'],
    ['สมศักดิ์', 'สม-ศัก-ดิ์', '"ศักดิ์สมบูรณ์" ผู้มีศักดิ์อันเหมาะสม', '41'],
    ['รัตน์', 'รัต-น์', '"รัตนะชัย" ผู้มีเหมือนอัญมณี', '13'],
    ['สหัส', 'สหัส', '"สหัสศรี" ผู้มีศรีมากมายเหมือนพันชั้น', '23']
], [
    ['กิติยา', 'กิ-ติ-ยา', '"กิติยศ" ผู้มีชื่อเสียงยศ', '14'],
    ['ศชลา', 'ศ-ชลา', '"ศชลาง" ผู้มีศรีบูรณ์', '24'],
    ['คณัญชา', 'คณัญ-ชา', '"คณะหญิงดี" ผู้มีคุณ', '35'],
    ['ชยาวรรณ', 'ชยา-วรร-ณ', '"ชยาวรรณ์" ผู้มีชัยและธรรม', '36'],
    ['กมลา', 'กม-ลา', '"กมลชา" ผู้มีความบริสุทธิ์', '25'],
    ['ศรีสมา', 'ศรี-สมา', '"ศรีสมบูรณ์" ผู้มีศรีดีบูรณ์', '32']
]);

newContent += generateDaySection('friday-names', 'วันศุกร์', 'วันที่ห้า', '💙', 'from-blue-400 to-indigo-500', 'blue', 'ผ ฟ ม', 'ก ค จ ช ด ต ถ ท พ ภ ย ร ล ว ศ ษ ส ห ฮ', '2, 4, 6, 8', 'วันศุกร์เป็นวันของศุกร์เทพ ผู้ให้ความสุข ความรักความเมตตา คุณวัฒนาปลายถนนหรือศรุษคน', [
    ['กิตติศักดิ์', 'กิต-ติ-ศัก-ดิ์', '"กิติศักดิ์สินสมบัติ" ผู้มีเกียรติและศักดิ์', '19'],
    ['ธนพล', 'ธน-พล', '"ธนพลมากมาย" ผู้มีอำนาจและเงินทอง', '41'],
    ['ศรัชฎา', 'ศ-รัช-ฎา', '"ศรัชศรรพ" ผู้มีศรีบริวาร', '36'],
    ['จิรศักดิ์', 'จิร-ศัก-ดิ์', '"จิรศักดิ์ศรี" ผู้มีศรีศักดิ์นานนาน', '24'],
    ['สัณทณ์', 'สัณ-ทณ์', '"สัณฑเทพ" ผู้ถูกเทพถูก', '16'],
    ['พิทยา', 'พิท-ยา', '"พิทยาคม" ผู้มีปัญญา', '14']
], [
    ['สฎีภา', 'สฎี-ภา', '"ศริภา" ผู้มาจากศรี', '19'],
    ['กัญญา', 'กัญ-ญา', '"กัญญาโสดา" ผู้หญิงกำลัง', '35'],
    ['ศศิชา', 'ศศิ-ชา', '"ศศิจันทร์" ผู้มีจันทร์ศศิ', '36'],
    ['ชัญญา', 'ชัญ-ญา', '"ชัญชาลา" ผู้มีเจริยะ', '24'],
    ['เสาวณีย์', 'เสาว-ณีย์', '"ดาวเสาว์" ผู้ศรัทธาเป็นดาว', '37'],
    ['นิสา', 'นิ-สา', '"นิสายา" ผู้มีกลึก', '18']
]);

newContent += generateDaySection('saturday-names', 'วันเสาร์', 'วันที่หก', '💜', 'from-purple-400 to-violet-500', 'purple', 'พ ภ ร', 'ก ค จ ช ด ต ถ ท ผ ฟ ม ย ล ว ศ ษ ส ห ฮ', '1, 3, 5, 7, 9', 'วันเสาร์เป็นวันของเสาร์เทพ ผู้ให้ความขยัน ความมั่นคง และความจริงใจ', [
    ['สมธรรม', 'สม-ธรร-ม', '"ธรรมสมบูรณ์" ผู้มีธรรมบูรณ์', '24'],
    ['สมัชชา', 'สมัช-ชา', '"สมัชชะ" ผู้มีสมมิติ', '36'],
    ['กิตติ', 'กิต-ติ', '"กิติศรี" ผู้มีชื่อเสียง', '19'],
    ['คณัญชา', 'คณัญ-ชา', '"คณชาย" ผู้มีคุณ', '35'],
    ['ศักดิชัย', 'ศัก-ดิ-ชัย', '"ศักดิชัยสินเสร็จ" ผู้มีศักดิและชัยชนะ', '27'],
    ['ศีลพล', 'ศีล-พล', '"ศีลพลศักดิ์" ผู้มีศีลและพล', '25']
], [
    ['สมบุญ', 'สม-บุญ', '"บุญสมบูรณ์" ผู้มีบุญเต็มบูรณ์', '24'],
    ['ศรีมนต์', 'ศรี-มนต์', '"ศรีมนตม์" ผู้มีศรีกวี', '36'],
    ['สมนึก', 'สม-นึก', '"นึกสมมติ" ผู้มีสติรู้สึก', '14'],
    ['สมฤดี', 'สม-ฤดี', '"ฤดีสมบูรณ์" ผู้มีฤดูดี', '36'],
    ['สิริมนต์', 'สิริ-มนต์', '"สิริมนต์" ผู้มีศรีกวี', '28'],
    ['สมศรี', 'สม-ศรี', '"สมศรีสินเสร็จ" ผู้มีศรีบูรณ์', '29']
]);

newContent += generateDaySection('sunday-names', 'วันอาทิตย์', 'วันที่เจ็ด', '❤️', 'from-red-400 to-rose-600', 'red', 'ว ซ ท', 'ก ค จ ช ด ต ถ ผ ฟ พ ภ ม ย ร ล ศ ษ ส ห ฮ', '1, 3, 5, 7, 9', 'วันอาทิตย์เป็นวันของสูร้ย์เทพ ผู้ให้ความสว่าง ความอบอุ่น และความมั่นคงเหมือนสุริยะ', [
    ['สเมธ', 'สเมธ', '"ศรีเมธา" ผู้มีปัญญา', '24'],
    ['ศิลป์', 'ศิ-ลป์', '"ศิลปัง" ผู้มีศิลป์', '14'],
    ['กัลยา', 'กัล-ยา', '"กัลยาณ" ผู้มีความดีงาม', '36'],
    ['จิตร์', 'จิ-ตร์', '"จิตรศร" ผู้มีใจทะยานไป', '41'],
    ['ภูมิ', 'ภู-มิ', '"ภูมิศักดิ์" ผู้มีศักดิ์บนแผ่นดิน', '11'],
    ['สมควร', 'สม-ควร', '"ควรสมควร" ผู้มีสมควรดี', '33']
], [
    ['สุชาดา', 'สุ-ชา-ดา', '"ชาดา" ผู้มีชีวิตดี', '24'],
    ['ศศิชา', 'ศศิ-ชา', '"จันทร์ชา" ผู้มีความสว่าง', '36'],
    ['ศศิลา', 'ศศิ-ลา', '"จันทร์ลา" ผู้มีความสว่างเต็มไปหมด', '39'],
    ['กัญญา', 'กัญ-ญา', '"กัญญาผู้" ผู้หญิงกำลัง', '35'],
    ['สรยา', 'สร-ยา', '"สรยา" ผู้มีความสร', '21'],
    ['ชมพู่', 'ชม-พู่', '"ชมพู่มงคล" ผู้มีสีชมพู่ดี', '23']
]);

newContent += `
    <!-- เลขมงคลตามวัน -->
    <section id="lucky-numbers-by-day" class="scroll-mt-24">
        <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-6 drop-shadow-sm">🔢 เลขมงคลตามวันเกิด</h2>
        <p class="text-slate-300 mb-8 text-lg">
            นอกจากชื่อที่ตรงวันเกิดแล้ว <strong class="text-white">เลขศาสตร์</strong> ก็มีความสำคัญไม่แพ้กัน ผลรวมตัวเลขของชื่อเต็มจะบ่งบอกถึง "ระดับมงคล" ของชื่อนั้น
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-yellow-500/30 transition-all hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-2xl">💛</span>
                    <h3 class="text-yellow-400 font-bold text-lg">วันจันทร์</h3>
                </div>
                <div class="space-y-2">
                    <p class="text-slate-300 text-sm"><strong class="text-white">เลขมงคล:</strong> 2, 4, 6, 8, 11, 13, 20, 24</p>
                    <p class="text-slate-400 text-sm"><strong class="text-white">เลขศาสตร์:</strong> ความสงบ เมตตา ความรักใคร่ มีเสน่ห์</p>
                </div>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-pink-500/30 transition-all hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-2xl">🩷</span>
                    <h3 class="text-pink-400 font-bold text-lg">วันอังคาร</h3>
                </div>
                <div class="space-y-2">
                    <p class="text-slate-300 text-sm"><strong class="text-white">เลขมงคล:</strong> 3, 5, 7, 9, 15, 18, 24, 30</p>
                    <p class="text-slate-400 text-sm"><strong class="text-white">เลขศาสตร์:</strong> ความกล้าหาญ ความแข็งแกร่ง อำนาจ</p>
                </div>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-2xl">💚</span>
                    <h3 class="text-emerald-400 font-bold text-lg">วันพุธ</h3>
                </div>
                <div class="space-y-2">
                    <p class="text-slate-300 text-sm"><strong class="text-white">เลขมงคล:</strong> 4, 6, 8, 9, 13, 15, 22, 26</p>
                    <p class="text-slate-400 text-sm"><strong class="text-white">เลขศาสตร์:</strong> ปัญญา การค้า การสื่อสาร</p>
                </div>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-orange-500/30 transition-all hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-2xl">🧡</span>
                    <h3 class="text-orange-400 font-bold text-lg">วันพฤหัสบดี</h3>
                </div>
                <div class="space-y-2">
                    <p class="text-slate-300 text-sm"><strong class="text-white">เลขมงคล:</strong> 3, 5, 7, 9, 12, 14, 23, 30</p>
                    <p class="text-slate-400 text-sm"><strong class="text-white">เลขศาสตร์:</strong> สติปัญญา โชค ความสมบูรณ์</p>
                </div>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-blue-500/30 transition-all hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-2xl">💙</span>
                    <h3 class="text-blue-400 font-bold text-lg">วันศุกร์</h3>
                </div>
                <div class="space-y-2">
                    <p class="text-slate-300 text-sm"><strong class="text-white">เลขมงคล:</strong> 2, 4, 6, 8, 16, 17, 25, 26</p>
                    <p class="text-slate-400 text-sm"><strong class="text-white">เลขศาสตร์:</strong> ความสุข ความรัก ความศรัทธา ศรีลาภ</p>
                </div>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-purple-500/30 transition-all hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-2xl">💜</span>
                    <h3 class="text-purple-400 font-bold text-lg">วันเสาร์</h3>
                </div>
                <div class="space-y-2">
                    <p class="text-slate-300 text-sm"><strong class="text-white">เลขมงคล:</strong> 1, 3, 5, 7, 9, 18, 19, 28</p>
                    <p class="text-slate-400 text-sm"><strong class="text-white">เลขศาสตร์:</strong> ความขยัน ความมั่นคง ความจริงใจ</p>
                </div>
            </div>
            <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-red-500/30 transition-all hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-2xl">❤️</span>
                    <h3 class="text-red-400 font-bold text-lg">วันอาทิตย์</h3>
                </div>
                <div class="space-y-2">
                    <p class="text-slate-300 text-sm"><strong class="text-white">เลขมงคล:</strong> 1, 3, 5, 7, 9, 10, 19, 28</p>
                    <p class="text-slate-400 text-sm"><strong class="text-white">เลขศาสตร์:</strong> ความสว่าง อบอุ่น ความมั่นคง ผู้นำ</p>
                </div>
            </div>
        </div>
        
        <div class="mt-8 bg-gradient-to-r from-red-900/40 to-amber-900/40 border border-red-500/30 rounded-2xl p-5 flex items-start gap-4">
            <span class="text-2xl mt-1">⚡</span>
            <div>
                <strong class="text-red-300 block mb-1">ข้อควรระวัง:</strong>
                <span class="text-slate-300 text-sm leading-relaxed">ถึงจะเลือกชื่อจากวันเกิดแล้ว แต่ถ้าผลรวมตัวเลขออกมาเป็นเลขร้าย (เช่น 14, 15, 16, 20, 21, 22, 26, 27 เป็นต้น) ชื่อนั้นก็ยังไม่ดี ต้องเลือกชื่อใหม่ให้ได้ผลรวมดี</span>
            </div>
        </div>
    </section>

    <!-- ตรวจสอบ -->
    <section id="verify-birthday-names" class="scroll-mt-24">
        <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-6 drop-shadow-sm">✅ วิธีตรวจสอบชื่อของลูกตามวันเกิด</h2>
        <div class="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
            <div class="space-y-6 relative z-10">
                <div class="flex gap-4">
                    <div class="w-8 h-8 rounded-full bg-slate-700 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                        <strong class="text-white block mb-1">ตรวจสอบวันเกิด</strong>
                        <p class="text-sm text-slate-400">ดูตารางด้านบน ค้นหาวันเกิดของลูก</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="w-8 h-8 rounded-full bg-slate-700 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                        <strong class="text-white block mb-1">ตรวจอักษรแรก</strong>
                        <p class="text-sm text-slate-400">ตรวจสอบอักษรแรกของชื่อ ว่าไม่ตรงกับ "ห้าม" (อักษรกาลกิณี)</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="w-8 h-8 rounded-full bg-slate-700 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                        <strong class="text-white block mb-1">ตรวจผลรวมตัวเลข</strong>
                        <p class="text-sm text-slate-400">นำชื่อเต็มที่เลือก ไปกรอกในเครื่องมือ <a href="/" class="text-amber-400 hover:text-amber-300 hover:underline transition-colors">NameMongkol</a> เพื่อดูผลรวม</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="w-8 h-8 rounded-full bg-slate-700 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                        <strong class="text-white block mb-1">ตรวจสอบกับนามสกุล</strong>
                        <p class="text-sm text-slate-400">วิเคราะห์ชื่อเต็ม (ชื่อ + นามสกุล) เพื่อให้ได้เกรด A+</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-amber-500/20">5</div>
                    <div>
                        <strong class="text-amber-400 block mb-1">ยืนยัน</strong>
                        <p class="text-sm text-slate-400">หลังได้เกรด A+ ชื่อนั้นถูกต้องและมงคลแล้ว</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="text-center mt-8">
            <p class="text-slate-300 text-sm mb-4">
                <strong>💡 ไม่แน่ใจเลยหรือไม่?</strong> ลองเล่นกับตัวอย่างชื่อจากตารางด้านบน หลังจากนั้นค่อยไปเลือกชื่อของลูกของตัวเอง
            </p>
            <a href="/" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5">
                เริ่มวิเคราะห์ชื่อของคุณเลย
            </a>
        </div>
    </section>

</div>
`;

const originalContentRegex = /content:\s*\`([\s\S]*)\`\s*,/m;

const updatedFileContent = content.replace(originalContentRegex, 'content: `\n' + newContent + '`,\n');

fs.writeFileSync(filePath, updatedFileContent, 'utf8');
console.log('File updated successfully!');
