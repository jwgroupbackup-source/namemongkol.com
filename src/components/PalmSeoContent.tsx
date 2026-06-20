import React from 'react';
import Link from 'next/link';
import { Brain, Heart, Sparkles, Compass, Camera, ShieldCheck } from 'lucide-react';

export const PalmSeoContent = () => {
  const faqItems = [
    {
      question: 'วิเคราะห์ลายมือ AI แม่นยำแค่ไหน?',
      answer:
        'ความแม่นยำขึ้นกับคุณภาพภาพมือ มุมกล้อง และความชัดของเส้นลายมือ ผลลัพธ์จึงควรใช้เป็นแนวโน้มเบื้องต้นเพื่อสะท้อนตัวเอง ไม่ใช่ข้อสรุปตายตัว 100%.',
    },
    {
      question: 'ดูลายมือออนไลน์แทนการปรึกษาผู้เชี่ยวชาญได้ไหม?',
      answer:
        'เหมาะสำหรับเริ่มต้นทำความเข้าใจภาพรวมอย่างรวดเร็ว แต่ไม่ควรใช้แทนคำปรึกษาเชิงวิชาชีพด้านสุขภาพ การเงิน หรือกฎหมายเมื่อเป็นเรื่องสำคัญ.',
    },
    {
      question: 'เส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา บอกอนาคตได้แน่นอนหรือไม่?',
      answer:
        'ลายมือมักใช้สะท้อนบุคลิกและแนวโน้มชีวิตมากกว่าการฟันธงอนาคตแบบแน่นอน ปัจจัยสำคัญยังคงเป็นการตัดสินใจ การลงมือทำ และสภาพแวดล้อมของแต่ละคน.',
    },
    {
      question: 'ถ้าผลวิเคราะห์ออกมาไม่ดีควรทำอย่างไร?',
      answer:
        'ใช้ผลวิเคราะห์เป็นข้อมูลเพื่อปรับพฤติกรรมเชิงบวก เช่น การวางแผน การดูแลสุขภาพ และการพัฒนาทักษะ ไม่จำเป็นต้องกังวลเกินไป เพราะแนวโน้มชีวิตเปลี่ยนได้เสมอ.',
    },
    {
      question: 'ต้องเตรียมรูปมืออย่างไรให้วิเคราะห์ได้ละเอียดขึ้น?',
      answer:
        'ควรถ่ายภาพในแสงสว่างเพียงพอ ฝ่ามือเต็มเฟรม กล้องตั้งตรง และภาพไม่เบลอ เพื่อให้ระบบมองเห็นเส้นหลักได้ครบและสรุปผลได้ชัดเจนขึ้น.',
    },
    {
      question: 'วิเคราะห์ลายมือออนไลน์ กับไปดูกับหมอดู ต่างกันอย่างไร?',
      answer:
        'การวิเคราะห์ลายมือออนไลน์ด้วย AI ใช้การประมวลผลภาพเพื่อตรวจจับเส้นหลัก ให้ผลลัพธ์รวดเร็ว สะดวก ใช้ได้ทุกที่ทุกเวลา แต่ไม่ได้ทดแทนประสบการณ์เฉพาะทางของผู้เชี่ยวชาญ จึงเหมาะใช้เป็นข้อมูลเบื้องต้นก่อนปรึกษาเพิ่มเติม.',
    },
    {
      question: 'วิเคราะห์ลายมือด้วย AI บน NameMongkol ต้องเสียเงินไหม?',
      answer:
        'สามารถเริ่มวิเคราะห์ลายมือด้วย AI ได้ฟรี โดยอัปโหลดภาพฝ่ามือ ระบบจะตรวจคุณภาพภาพและวิเคราะห์เส้นหลัก 4 เส้นให้ทันที สำหรับผลวิเคราะห์เชิงลึกจะใช้ระบบเครดิต.',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto mt-16 mb-10 px-1 sm:px-4">
      <div className="text-center mb-10 sm:mb-12">
        <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-200 inline-block mb-5">
          วิเคราะห์ลายมือออนไลน์ • วิเคราะห์ลายมือด้วย AI
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a3e] mb-4 leading-tight">
          วิเคราะห์ลายมือออนไลน์ด้วย AI: ดูดวงลายมือเบื้องต้นแบบเข้าใจง่าย
        </h2>
        <p className="text-[#5a5a82] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          หากคุณกำลังค้นหา <strong>วิเคราะห์ลายมือ</strong> หรือ <strong>วิเคราะห์ลายมือด้วย AI</strong> หน้านี้ช่วยให้เริ่มต้น
          <strong>วิเคราะห์ลายมือออนไลน์</strong> ได้ทันที ด้วยการอ่านเส้นหลัก 4 เส้นจากภาพฝ่ามือ พร้อมคำอธิบายชัดเจนและนำไปใช้วางแผนชีวิตได้จริง
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
        <div className="bg-white border border-[#ddddf0] rounded-2xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-xl font-bold text-amber-600 mb-3">วิเคราะห์ลายมือ คืออะไร?</h3>
          <p className="text-[#5a5a82] leading-relaxed">
            การอ่านลายมือเป็นศาสตร์เชิงสัญลักษณ์ที่ใช้สะท้อนแนวโน้มบุคลิก ความคิด และการใช้ชีวิต ผลลัพธ์จากระบบ
            AI เหมาะกับการสำรวจตัวเองเบื้องต้น เพื่อช่วยตั้งคำถามและวางแผนได้มีสติมากขึ้น
          </p>
        </div>

        <div className="bg-white border border-[#ddddf0] rounded-2xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-xl font-bold text-amber-600 mb-3">ดูลายมือออนไลน์ ทำงานอย่างไร?</h3>
          <p className="text-[#5a5a82] leading-relaxed">
            ระบบจะวิเคราะห์ตำแหน่งเส้นหลักจากรูปฝ่ามือ สรุปคะแนนแต่ละด้าน และอธิบายจุดเด่น-จุดที่ควรพัฒนาในรูปแบบอ่านง่าย
            เพื่อให้คุณนำผลไปใช้ต่อยอดได้ทันที
          </p>
        </div>
      </div>

      <div className="bg-slate-50 border border-[#ddddf0] rounded-3xl p-6 sm:p-8 mb-10 sm:mb-12">
        <h3 className="text-2xl font-bold text-[#1a1a3e] mb-6">เส้นหลักที่ระบบใช้ในการดูดวงลายมือ</h3>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold">
              <Heart className="w-4 h-4" /> เส้นชีวิต (Life Line)
            </div>
            <p className="text-[#5a5a82] text-sm leading-relaxed">ใช้ดูภาพรวมพลังชีวิต สุขภาวะ และจังหวะการเปลี่ยนแปลงสำคัญ</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
              <Brain className="w-4 h-4" /> เส้นสมอง (Head Line)
            </div>
            <p className="text-[#5a5a82] text-sm leading-relaxed">สะท้อนวิธีคิด การตัดสินใจ ความถนัด และแนวโน้มด้านการงาน</p>
          </div>
          <div className="rounded-xl border border-pink-100 bg-pink-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-pink-700 font-semibold">
              <Sparkles className="w-4 h-4" /> เส้นหัวใจ (Heart Line)
            </div>
            <p className="text-[#5a5a82] text-sm leading-relaxed">บอกแนวโน้มด้านอารมณ์ ความสัมพันธ์ และรูปแบบการแสดงความรัก</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-amber-700 font-semibold">
              <Compass className="w-4 h-4" /> เส้นวาสนา (Fate Line)
            </div>
            <p className="text-[#5a5a82] text-sm leading-relaxed">ใช้ดูทิศทางชีวิต โอกาส ความสำเร็จ และความมั่นคงในระยะยาว</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-10 sm:mb-12">
        <div className="bg-white border border-[#ddddf0] rounded-2xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#1a1a3e] mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-500" /> วิธีถ่ายรูปมือให้วิเคราะห์แม่นขึ้น
          </h3>
          <ul className="space-y-2.5 text-[#5a5a82] text-sm leading-relaxed">
            <li>• ใช้แสงธรรมชาติหรือแสงสว่างเพียงพอ</li>
            <li>• วางฝ่ามือให้เต็มเฟรม ไม่เอียง</li>
            <li>• ถือกล้องนิ่ง ภาพไม่เบลอ</li>
            <li>• หลีกเลี่ยงเงาทับหรือแสงสะท้อนแรง</li>
          </ul>
        </div>

        <div className="bg-white border border-[#ddddf0] rounded-2xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#1a1a3e] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" /> ใช้ผลวิเคราะห์อย่างสมดุล
          </h3>
          <p className="text-[#5a5a82] text-sm leading-relaxed mb-3">
            ผลจาก AI Palmistry ควรใช้เพื่อการสะท้อนตนเองและวางแผนเชิงบวก ไม่ใช่ใช้ตัดสินทุกเรื่องแบบเด็ดขาด
          </p>
          <p className="text-[#5a5a82] text-sm leading-relaxed">
            หากเป็นเรื่องสำคัญด้านสุขภาพ การเงิน หรือกฎหมาย ควรปรึกษาผู้เชี่ยวชาญเฉพาะทางเพิ่มเติม
          </p>
        </div>
      </div>

      <div className="mb-10 sm:mb-12">
        <div className="text-center mb-6 sm:mb-8">
          <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-sm font-semibold border border-violet-200 inline-block mb-3">
            🔬 หลักการวิเคราะห์
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a3e] mb-3">ระบบวิเคราะห์ลายมือคำนวณอย่างไร?</h3>
          <p className="text-[#5a5a82] max-w-2xl mx-auto leading-relaxed">
            NameMongkol วิเคราะห์ภาพลายมือด้วยขั้นตอนที่ชัดเจน 4 ส่วน เพื่อให้ผลลัพธ์อ่านง่ายและนำไปใช้วางแผนชีวิตได้จริง
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#ddddf0] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">📷</div>
            <h4 className="font-bold text-[#1a1a3e] mb-2">ตรวจคุณภาพภาพ</h4>
            <p className="text-sm text-[#5a5a82] leading-relaxed">ประเมินความคมชัด แสง และคอนทราสต์ก่อนเริ่ม เพื่อลดความคลาดเคลื่อนจากภาพมืดหรือเบลอ</p>
          </div>
          <div className="bg-white border border-[#ddddf0] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">🖐️</div>
            <h4 className="font-bold text-[#1a1a3e] mb-2">ตรวจจับเส้นหลัก</h4>
            <p className="text-sm text-[#5a5a82] leading-relaxed">ระบบแยกตำแหน่งเส้นชีวิต เส้นสมอง เส้นหัวใจ และเส้นวาสนา จากภาพฝ่ามือที่อัปโหลด</p>
          </div>
          <div className="bg-white border border-[#ddddf0] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">🧭</div>
            <h4 className="font-bold text-[#1a1a3e] mb-2">แปลผลเชิงแนวโน้ม</h4>
            <p className="text-sm text-[#5a5a82] leading-relaxed">สรุปจุดเด่น จุดที่ควรพัฒนา และมุมมองการใช้ชีวิตจากความสัมพันธ์ของเส้นหลักทั้ง 4 ด้าน</p>
          </div>
          <div className="bg-white border border-[#ddddf0] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">✨</div>
            <h4 className="font-bold text-[#1a1a3e] mb-2">สรุปและคำแนะนำ</h4>
            <p className="text-sm text-[#5a5a82] leading-relaxed">แสดงผลแบบอ่านง่ายทันที เพื่อช่วยใช้เป็นข้อมูลประกอบการวางแผนชีวิตในเชิงบวก</p>
          </div>
        </div>
      </div>

      <div className="mb-10 sm:mb-12">
        <div className="text-center mb-6 sm:mb-8">
          <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-sm font-semibold border border-cyan-200 inline-block mb-3">
            ⚖️ เปรียบเทียบ
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a3e] mb-3">NameMongkol vs เว็บวิเคราะห์ลายมือออนไลน์ทั่วไป</h3>
          <p className="text-[#5a5a82] max-w-2xl mx-auto leading-relaxed">
            เปรียบเทียบแบบเป็นกลางเพื่อช่วยเลือกเครื่องมือที่เหมาะกับการใช้งานจริงของคุณ
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#ddddf0] bg-white shadow-sm">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-[#5a5a82] font-semibold">ฟีเจอร์</th>
                <th className="text-center py-3 px-4 text-amber-600 font-bold">NameMongkol</th>
                <th className="text-center py-3 px-4 text-slate-500 font-semibold">เว็บทั่วไป</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="py-3 px-4 text-[#5a5a82]">AI วิเคราะห์จากภาพฝ่ามือจริง</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">มี</td><td className="py-3 px-4 text-center text-slate-500">บางแพลตฟอร์ม</td></tr>
              <tr><td className="py-3 px-4 text-[#5a5a82]">ตรวจคุณภาพภาพก่อนวิเคราะห์</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">มี</td><td className="py-3 px-4 text-center text-slate-500">มักไม่มี</td></tr>
              <tr><td className="py-3 px-4 text-[#5a5a82]">อ่านเส้นหลัก 4 เส้นครบ</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">ครบ</td><td className="py-3 px-4 text-center text-slate-500">แล้วแต่บริการ</td></tr>
              <tr><td className="py-3 px-4 text-[#5a5a82]">สรุปผลแบบเข้าใจง่าย</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">ชัดเจน</td><td className="py-3 px-4 text-center text-slate-500">ระดับพื้นฐาน</td></tr>
              <tr><td className="py-3 px-4 text-[#5a5a82]">ใช้งานผ่านมือถือทันที</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">รองรับ</td><td className="py-3 px-4 text-center text-slate-500">ส่วนใหญ่รองรับ</td></tr>
              <tr><td className="py-3 px-4 text-[#5a5a82]">วิเคราะห์ได้ทันทีออนไลน์</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">ได้ทันที</td><td className="py-3 px-4 text-center text-slate-500">ขึ้นกับระบบ</td></tr>
              <tr><td className="py-3 px-4 text-[#5a5a82]">เชื่อมโยงบริการมงคลอื่นในที่เดียว</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">เชื่อมโยงครบ</td><td className="py-3 px-4 text-center text-slate-500">มักแยกบริการ</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-10 sm:mb-12">
        <div className="text-center mb-6 sm:mb-8">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200 inline-block mb-3">
            🎯 คำตอบสั้นแบบตรงคำถาม
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a3e] mb-3">เส้นลายมือ 4 เส้นหลักบอกอะไรบ้าง?</h3>
          <p className="text-[#5a5a82] max-w-3xl mx-auto leading-relaxed">
            คำตอบสั้น: เส้นชีวิตดูพลังชีวิตและจังหวะการเปลี่ยนแปลง, เส้นสมองดูวิธีคิดและการตัดสินใจ, เส้นหัวใจดูรูปแบบอารมณ์และความสัมพันธ์, เส้นวาสนาดูทิศทางชีวิตและความมั่นคงระยะยาว
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <h4 className="text-emerald-700 font-semibold mb-2">เส้นชีวิต (Life Line)</h4>
            <p className="text-sm text-[#5a5a82] leading-relaxed">เน้นภาพรวมพลังชีวิตและการรับมือกับการเปลี่ยนแปลง ไม่ได้หมายถึงอายุขัยแบบตายตัว</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <h4 className="text-blue-700 font-semibold mb-2">เส้นสมอง (Head Line)</h4>
            <p className="text-sm text-[#5a5a82] leading-relaxed">สะท้อนแนวคิด ความเป็นเหตุผล การวิเคราะห์ และรูปแบบการตัดสินใจในงานและชีวิต</p>
          </div>
          <div className="rounded-xl border border-pink-100 bg-pink-50 p-4 shadow-sm">
            <h4 className="text-pink-700 font-semibold mb-2">เส้นหัวใจ (Heart Line)</h4>
            <p className="text-sm text-[#5a5a82] leading-relaxed">บอกแนวโน้มด้านอารมณ์ การเปิดใจ ความสัมพันธ์ และวิธีสื่อสารความรู้สึกกับคนรอบตัว</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
            <h4 className="text-amber-700 font-semibold mb-2">เส้นวาสนา (Fate Line)</h4>
            <p className="text-sm text-[#5a5a82] leading-relaxed">สะท้อนทิศทางการเติบโต ความมั่นคง และจังหวะโอกาสสำคัญจากการลงมือทำอย่างต่อเนื่อง</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-bold text-[#1a1a3e] mb-5">คำถามที่พบบ่อยเกี่ยวกับการวิเคราะห์ลายมือออนไลน์</h3>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-xl border border-[#ddddf0] bg-white p-4 sm:p-5 shadow-sm">
              <h4 className="text-[#1a1a3e] font-semibold mb-2">{item.question}</h4>
              <p className="text-[#5a5a82] text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-slate-500 leading-relaxed border-t border-[#ddddf0] pt-6">
        ดูเพิ่มเติม: <Link href="/articles" className="text-amber-600 hover:text-amber-700">บทความความรู้เสริมดวง</Link> •{' '}
        <Link href="/name-analysis" className="text-amber-600 hover:text-amber-700">เช็คชื่อมงคลหลายชื่อพร้อมกัน</Link> •{' '}
        <Link href="/phone-analysis" className="text-amber-600 hover:text-amber-700">เช็คเบอร์มงคลกราฟพลังงาน 6 ด้าน</Link> •{' '}
        <Link href="/wallpapers" className="text-amber-600 hover:text-amber-700">วอลเปเปอร์มงคลเสริมดวง ดาวน์โหลดฟรี</Link>
      </div>
    </section>
  );
};
