
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Image as ImageIcon, Phone, Users } from 'lucide-react';

export const ArticleCTA = () => {
    return (
        <div className="my-8">
            <p className="text-[#5a5a82] mb-4">
                อยากรู้ว่าชื่อของคุณดีแค่ไหน?{' '}
                <Link href="/name-check" className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2">
                    วิเคราะห์ชื่อมงคลฟรี
                </Link>{' '}หรือ{' '}
                <Link href="/name-analysis" className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2">
                    เช็คชื่อมงคลหลายชื่อพร้อมกัน
                </Link>
            </p>
            <p className="text-[#5a5a82] text-sm mb-4">
                ต้องการเสริมดวงเฉพาะเป้าหมาย? ลองใช้{' '}
                <Link href="/wallpapers/intent/finance" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">วอลเปเปอร์การเงิน</Link>{' '}
                / <Link href="/wallpapers/intent/love" className="text-pink-600 hover:text-pink-700 underline underline-offset-2">วอลเปเปอร์ความรัก</Link>{' '}
                / <Link href="/wallpapers/intent/work" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">วอลเปเปอร์การงาน</Link>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">

            {/* Mandatory: วิเคราะห์ชื่อมงคล - links to /name-check (Golden Rule) */}
            <Link href="/name-check" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-[#f0f0f8] border border-amber-300 hover:border-amber-400 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:shadow-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 block">แนะนำ</span>
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-1 group-hover:text-amber-700 transition-colors">วิเคราะห์ชื่อมงคล</h3>
                        <p className="text-[#5a5a82] text-xs mb-0 line-clamp-2">
                            เช็คดวงชื่อฟรี ด้วย AI ผสาน 4 ศาสตร์ เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-500 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* เช็คชื่อมงคลหลายชื่อ - links to /name-analysis for bulk intent */}
            <Link href="/name-analysis" className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-indigo-400 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:shadow-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mb-3 text-indigo-600">
                            <Users className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-1 group-hover:text-indigo-600 transition-colors">เช็คชื่อมงคลหลายชื่อ</h3>
                        <p className="text-[#5a5a82] text-xs mb-0 line-clamp-2">
                            เช็คชื่อมงคล ตรวจสอบหลายชื่อพร้อมกัน สูงสุด 1,000 ชื่อ
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Premium Analysis Card */}
            <Link href="/premium-analysis" className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-purple-400 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:shadow-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-3 text-purple-600">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-1 group-hover:text-purple-600 transition-colors">วิเคราะห์ชื่อ Premium</h3>
                        <p className="text-[#5a5a82] text-xs mb-0 line-clamp-2">
                            เจาะลึก 4 ศาสตร์ ทักษา เลขศาสตร์ อายตนะ 6 และพลังเงา
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Wallpapers Card */}
            <Link href="/wallpapers" className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:shadow-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-3 text-amber-600">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-1 group-hover:text-amber-600 transition-colors">วอลเปเปอร์มงคล</h3>
                        <p className="text-[#5a5a82] text-xs mb-0 line-clamp-2">
                            เสริมดวงด้วยภาพหน้าจอมือถือ ออกแบบเฉพาะดวงชะตาคุณ
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Phone Analysis Card */}
            <Link href="/phone-analysis" className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-emerald-400 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:shadow-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mb-3 text-emerald-600">
                            <Phone className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-1 group-hover:text-emerald-600 transition-colors">เช็คเบอร์มงคล 6 ด้าน</h3>
                        <p className="text-[#5a5a82] text-xs mb-0 line-clamp-2">
                            เช็คกราฟพลังงาน 6 ด้าน เกรด A-F และคู่เลข
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Search Auspicious Names Card */}
            <Link href="/search" className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:shadow-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-3 text-amber-600">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-1 group-hover:text-amber-600 transition-colors">ตั้งชื่อมงคล ตั้งชื่อลูก</h3>
                        <p className="text-[#5a5a82] text-xs mb-0 line-clamp-2">
                            ค้นหาชื่อมงคลจาก 5,000+ รายชื่อ คัดเกรด A+ ฟรี
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Name Generator Card - replaces duplicate name-analysis link */}
            <Link href="/name-generator" className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:shadow-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a3e] mb-1 group-hover:text-blue-600 transition-colors">สร้างชื่อมงคลด้วย AI</h3>
                        <p className="text-[#5a5a82] text-xs mb-0 line-clamp-2">
                            ให้ AI สร้างชื่อมงคลเกรด A+ ตามวันเกิดและความต้องการเฉพาะ
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            </div>
        </div>
    );
};
