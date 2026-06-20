import React from 'react';
import { Search, Layers, Activity } from 'lucide-react';

export const UspSection = () => {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-16 relative z-10">
            <div className="text-center mb-8 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-600 mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                    จุดเด่นของการตั้งชื่อมงคล กับ NameMongkol
                </h2>
                <p className="text-[#5a5a82] max-w-[65ch] mx-auto text-base sm:text-lg leading-relaxed">
                    เช็คชื่อตัวเองหรือตั้งชื่อลูกใหม่ได้อย่างแม่นยำและใช้งานฟรี ผสาน 4 ศาสตร์หลักของไทยไว้ในหน้าเดียว ช่วยให้คุณได้ชื่อมงคลที่ดีที่สุด
                </p>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar px-1 pb-2 sm:gap-5 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0 md:snap-none">
                {/* USP 1 */}
                <div className="w-[78%] shrink-0 snap-start bg-gradient-to-br from-[#fffbf3] to-[#fef7ec] border border-amber-200/50 p-4 sm:p-6 rounded-2xl hover:border-amber-300 hover:shadow-md transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                        <Search size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-600 mb-2 sm:mb-3 tracking-tight group-hover:text-amber-500 transition-colors">
                        วิเคราะห์เจาะลึกคู่เลขมงคล
                    </h3>
                    <p className="text-[#5a5a82] leading-relaxed text-sm sm:text-base">
                        ไม่ใช่แค่ดูผลรวม แต่เราถอดรหัส <strong>&quot;ทุกคู่ตัวเลข&quot;</strong> ในชื่อ-นามสกุล เพื่อหาจุดเด่นและแนวทางแก้ไขก่อนตัดสินใจเปลี่ยนชื่อจริง
                    </p>
                </div>

                {/* USP 2 */}
                <div className="w-[78%] shrink-0 snap-start bg-gradient-to-br from-[#fffbf3] to-[#fef7ec] border border-amber-200/50 p-4 sm:p-6 rounded-2xl hover:border-amber-300 hover:shadow-md transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                        <Layers size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-600 mb-2 sm:mb-3 tracking-tight group-hover:text-amber-500 transition-colors">
                        ผสาน 4 ศาสตร์สำคัญ
                    </h3>
                    <p className="text-[#5a5a82] leading-relaxed text-sm sm:text-base">
                        วิเคราะห์ครบมิติด้วย <strong>เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์</strong> ดูง่าย ครบจบในหน้าจอเดียว
                    </p>
                </div>

                {/* USP 3 */}
                <div className="w-[78%] shrink-0 snap-start bg-gradient-to-br from-[#fffbf3] to-[#fef7ec] border border-amber-200/50 p-4 sm:p-6 rounded-2xl hover:border-amber-300 hover:shadow-md transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                        <Activity size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-600 mb-2 sm:mb-3 tracking-tight group-hover:text-amber-500 transition-colors">
                        ถอดรหัสลึกถึงพลังเงา
                    </h3>
                    <p className="text-[#5a5a82] leading-relaxed text-sm sm:text-base">
                        เช็กชื่อฟรีเบื้องต้น พร้อมตัวเลือกปลดล็อกดู <strong>&quot;พลังเงา&quot;</strong> และคำทำนายพรีเมียม เพื่อกรองชื่อที่ดีที่สุดสำหรับคุณ
                    </p>
                </div>
            </div>
        </section>
    );
};
