'use client';

import React, { useState, Suspense, useEffect, useCallback, startTransition } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, Sparkles, Lock, Palette, ImageIcon, Crown, Sun, Star, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import { trackEvent } from '@/lib/analytics';
import dynamic from 'next/dynamic';

import { Wallpaper } from '@/types';

// Dynamic import for CustomWallpaperGenerator (standalone version)
const StandaloneWallpaperGenerator = dynamic(
    () => import('@/components/StandaloneWallpaperGenerator'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        )
    }
);

// Fallback constant for immediate load/SSR if needed, but we will rely on DB
const INITIAL_WALLPAPERS: Wallpaper[] = [
    { id: 1, name: 'สิงห์ทองนำโชค เลข 159 (วันอาทิตย์)', image: '/wallpapers/sunday.webp', day: 'sunday', tags: ['บารมี', 'อำนาจ', 'โชคลาภ', 'สิงห์ทอง'], premium: false, downloads: 2540, description: 'วอลเปเปอร์มงคลวันอาทิตย์: สิงห์ทองคำผู้ทรงอำนาจ ประทับบนดอกบัวทองท่ามกลางเหรียญโชคลาภ ด้านหลังเป็นยันต์มงคลและรัศมีพระอาทิตย์ทองอร่าม เลขมงคล 159 เสริมอำนาจบารมี ความยิ่งใหญ่ และโชคลาภก้อนใหญ่ พื้นหลังสีแดง-ทองตามสีมงคลประจำวันอาทิตย์ ขอบลายกนกทองอย่างวิจิตร เหมาะสำหรับผู้เกิดวันอาทิตย์ที่ต้องการเสริมบารมี ตำแหน่ง และการเป็นผู้นำ' },
    { id: 2, name: 'เทพพระจันทร์ประทานพร เลข 246 (วันจันทร์)', image: '/wallpapers/monday.webp', day: 'monday', tags: ['เมตตา', 'เสน่ห์', 'มหานิยม', 'พระจันทร์'], premium: false, downloads: 3120, description: 'วอลเปเปอร์มงคลวันจันทร์: เทพองค์ทรงเครื่องประทับนั่งสมาธิบนดอกบัว พระหัตถ์ถือดอกบัวขาว ด้านหลังเป็นพระจันทร์เต็มดวงเรืองรองพร้อมจักรวาลโคจร ขนาบข้างด้วยสิงห์คู่ผู้พิทักษ์และเหรียญทองนำโชค เลขมงคล 246 เสริมเสน่ห์และเมตตามหานิยม พื้นหลังสีขาว-เงิน-ฟ้าอ่อนอันนุ่มนวล เหมาะสำหรับผู้เกิดวันจันทร์ที่ต้องการดึงดูดมิตรภาพ ความรัก และผู้ใหญ่อุปถัมภ์' },
    { id: 3, name: 'พระปางไสยาสน์ ดอกบัว เลข 356 (วันอังคาร)', image: '/wallpapers/tuesday.webp', day: 'tuesday', tags: ['กล้าหาญ', 'การงาน', 'ชัยชนะ', 'มงคล'], premium: false, downloads: 1890, description: 'วอลเปเปอร์มงคลวันอังคาร: พระปางไสยาสน์ทองคำอันสงบงามประทับบนดอกบัวชมพูภายในมณฑลยันต์ (Mandala) ทรงศักดิ์สิทธิ์ ล้อมด้วยดอกบัวนำโชคและสิงห์คู่ทองคำ ยันต์มงคล 3 ดวงด้านบน มีพลังคุ้มครองและเสริมความกล้าหาญ เลขมงคล 356 เสริมพลังก้าวหน้าในหน้าที่การงาน พื้นหลังสีชมพู-ทองตามสีมงคลวันอังคาร เหมาะกับผู้ที่ต้องการเอาชนะอุปสรรคและก้าวสู่ความสำเร็จ' },
    { id: 4, name: 'พระแม่ลักษมี เรียกทรัพย์ เลข 456 (วันพุธกลางวัน)', image: '/wallpapers/Wednesday_lunch.webp', day: 'wednesday', tags: ['ค้าขาย', 'เรียกทรัพย์', 'ลักษมี', 'ร่ำรวย'], premium: false, downloads: 2100, description: 'วอลเปเปอร์มงคลวันพุธกลางวัน: พระแม่ลักษมีเทพีแห่งความมั่งคั่ง ทรงฉลองพระองค์สีเขียว-ทอง พระหัตถ์ถือดอกบัว ยืนบนดอกบัวชมพูท่ามกลางเหรียญทองที่ร่วงหล่นจากสวรรค์ ล้อมด้วยช้างมงคลโปรยน้ำแห่งโชคลาภ ขนขบด้วยนกยูงทองและขนนกยูง เลขมงคล 456 เสริมพลังวาจาเรียกทรัพย์ พื้นหลังสีเขียวมรกตตามสีมงคลวันพุธ เหมาะกับนักธุรกิจ นักขาย และผู้ที่ต้องการค้าขายร่ำรวย' },
    { id: 10, name: 'พระราหูอมจันทร์ ยันต์คุ้มครอง เลข 789 (วันพุธกลางคืน)', image: '/wallpapers/Wednesday_night.webp', day: 'wednesday_night', tags: ['ราหู', 'คุ้มครอง', 'แคล้วคลาด', 'กันภัย'], premium: false, downloads: 0, description: 'วอลเปเปอร์มงคลวันพุธกลางคืน: พระราหูอมจันทร์ทรงมหิทธิฤทธิ์ ประทับนั่งบนดอกบัวเขียวมรกต สวมมงกุฎทองอันวิจิตร พระวรกายเทาดำประดับมณี ด้านหลังเป็นวงยันต์มงคลทองเรืองรองท่ามกลางท้องฟ้ายามค่ำคืน มีพระจันทร์เสี้ยว ช้างทอง ลิง และมณีเขียวมรกตล้อมรอบ เลขมงคล 789 เสริมพลังป้องกันภัย แคล้วคลาดจากเคราะห์ร้าย พื้นหลังสีดำ-เขียวเข้มตามสัญลักษณ์พระราหู เหมาะกับผู้ที่ต้องเดินทางกลางคืนหรือต้องการเสริมความปลอดภัย' },
    { id: 5, name: 'พระพุทธรูปทองคำ ปัญญาบารมี เลข 659 (วันพฤหัสบดี)', image: '/wallpapers/thursday.webp', day: 'thursday', tags: ['สติปัญญา', 'ผู้ใหญ่อุปถัมภ์', 'การเรียน', 'ปัญญา'], premium: false, downloads: 2750, description: 'วอลเปเปอร์มงคลวันพฤหัสบดี: พระพุทธรูปทองคำปางสมาธิทรงรัศมีส่องสว่าง ประทับบนแท่นบัวทองคำ ด้านหลังเป็นวงยันต์อักขระขอมอันศักดิ์สิทธิ์เรืองรอง หนังสือคัมภีร์ทองประดับอัญมณีวางด้านหน้า ขนาบด้วยหนูคู่มงคลสื่อถึงความขยันขันแข็ง เลขมงคล 659 เสริมสติปัญญาและผู้ใหญ่อุปถัมภ์ พื้นหลังสีส้ม-ทองตามสีมงคลวันพฤหัสบดี เหมาะกับนักเรียน ครู อาจารย์ และผู้ที่ต้องการความก้าวหน้าทางวิชาการ' },
    { id: 6, name: 'พระพุทธรูปเรืองแสง ดอกบัวทิพย์ เลข 624 (วันศุกร์)', image: '/wallpapers/friday.webp', day: 'friday', tags: ['ความรัก', 'ทรัพย์สิน', 'โชคลาภ', 'ความสุข'], premium: false, downloads: 3420, description: 'วอลเปเปอร์มงคลวันศุกร์: พระพุทธรูปปางห้ามญาติทรงรัศมีฟ้าครามเรืองรอง ประทับบนดอกบัวชมพูทิพย์ ด้านหลังเป็นมณฑลยันต์ฟ้าอมเขียว ขนาบด้วยพระแม่ลักษมีประทับบนดอกบัว เหรียญทอง อัญมณีเพชรพลอย และเมฆมงคลจีน เลขมงคล 624 เสริมโชคลาภ ทรัพย์สินพูนทวี ความรัก และความสุข พื้นหลังสีฟ้า-เขียวตามสีมงคลวันศุกร์ เหมาะกับผู้ที่ต้องการดึงดูดความรักและความมั่งคั่ง' },
    { id: 7, name: 'พระนาคปรก เสือคู่นำโชค 招財 เลข 156 (วันเสาร์)', image: '/wallpapers/saturday.webp', day: 'saturday', tags: ['อำนาจ', 'คุ้มครอง', 'นาคปรก', 'เสือ'], premium: false, downloads: 1980, description: 'วอลเปเปอร์มงคลวันเสาร์: พระพุทธรูปปางนาคปรกทองคำ ประทับบนขดพญานาค 7 เศียรสีม่วงอันทรงพลัง ด้านหลังเป็นวงยันต์โหราศาสตร์พร้อมอักษรจีน "寶" (สมบัติ) "財" (ทรัพย์) "招財" (เรียกทรัพย์) ขนาบด้วยเสือคู่ทองคำผู้พิทักษ์ ช้างมงคล เหรียญทอง และอัญมณี สัญลักษณ์ดาวเสาร์อยู่ด้านบน เลขมงคล 156 เสริมอำนาจวาสนา ปกป้องคุ้มครอง พื้นหลังสีม่วง-ทองตามสีมงคลวันเสาร์ เหมาะกับผู้ที่ต้องการอำนาจ ความมั่นคง และการคุ้มครองจากสิ่งชั่วร้าย' },
    { id: 8, name: 'ท้าวเวสสุวรรณ ปลดหนี้', image: '/wallpapers/thao-wessuwan-v2.webp', day: 'all', tags: ['ปลดหนี้', 'กันชง', 'ท้าวเวสสุวรรณ'], premium: true, downloads: 4500, description: 'วอลเปเปอร์มงคลท้าวเวสสุวรรณ: องค์ท้าวเวสสุวรรณผู้พิทักษ์แห่งทิศเหนือ เทพแห่งความมั่งคั่งและการปกป้อง พลังปลดหนี้สิน กันชง และป้องกันอันตรายทุกรูปแบบ เป็นวอลเปเปอร์ที่นิยมมากที่สุดในหมู่คนไทยสายมู เหมาะกับทุกวันเกิด' },
    { id: 9, name: '4289 ท้าวเวสสุวรรณ (สีชมพู)', image: '/wallpapers/4289-vessavana-pink.webp', day: 'all', tags: ['การเงิน', 'โชคลาภ', '4289', 'ค้าขาย'], premium: false, downloads: 0, description: 'วอลเปเปอร์มงคลท้าวเวสสุวรรณ สีชมพู พร้อมเลขมงคล 4289: เหมาะอย่างยิ่งสำหรับคนทำมาค้าขาย เจ้าของธุรกิจ Sales และคนที่ต้องการเสริมดวงโชคลาภและการเงิน โดยเน้นที่ความราบรื่น (ปางเด็ก) และเงินทองไหลมาเทมา ตัวเลข 4289 หมายถึง สี่ร่ำรวย สองมั่งมี แปดมาก เก้าก้าวหน้า' },
];

const DAYS = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'sunday', label: 'วันอาทิตย์' },
    { value: 'monday', label: 'วันจันทร์' },
    { value: 'tuesday', label: 'วันอังคาร' },
    { value: 'wednesday', label: 'วันพุธ(กลางวัน)' },
    { value: 'wednesday_night', label: 'วันพุธ(กลางคืน)' },
    { value: 'thursday', label: 'วันพฤหัส' },
    { value: 'friday', label: 'วันศุกร์' },
    { value: 'saturday', label: 'วันเสาร์' },
];

// Day color dots — brand color per day
const DAY_COLORS: Record<string, string> = {
    all: 'bg-amber-500',
    sunday: 'bg-red-500',
    monday: 'bg-yellow-400',
    tuesday: 'bg-pink-500',
    wednesday: 'bg-green-500',
    wednesday_night: 'bg-emerald-800 ring-1 ring-emerald-500',
    thursday: 'bg-orange-500',
    friday: 'bg-blue-500',
    saturday: 'bg-purple-500',
};

const DAY_LABELS: Record<string, string> = {
    all: 'ทุกวัน',
    sunday: 'วันอาทิตย์',
    monday: 'วันจันทร์',
    tuesday: 'วันอังคาร',
    wednesday: 'วันพุธ(กลางวัน)',
    wednesday_night: 'วันพุธ(กลางคืน)',
    thursday: 'วันพฤหัสบดี',
    friday: 'วันศุกร์',
    saturday: 'วันเสาร์',
    aries: 'ราศีเมษ',
    taurus: 'ราศีพฤษภ',
    gemini: 'ราศีเมถุน',
    cancer: 'ราศีกรกฎ',
    leo: 'ราศีสิงห์',
    virgo: 'ราศีกันย์',
    libra: 'ราศีตุลย์',
    scorpio: 'ราศีพิจิก',
    sagittarius: 'ราศีธนู',
    capricorn: 'ราศีมังกร',
    aquarius: 'ราศีกุมภ์',
    pisces: 'ราศีมีน',
};

const buildWallpaperAlt = (wp: Wallpaper) => {
    const dayLabel = DAY_LABELS[wp.day] || 'เสริมดวง';
    const intent = wp.tags.slice(0, 3).join(', ');
    return `วอลเปเปอร์มงคล ${wp.name} สำหรับ${dayLabel} ปี 2569 เสริมดวง ${intent} | NameMongkol`;
};

const classifyTrafficSource = (params: URLSearchParams): string => {
    if (typeof document === 'undefined') return 'unknown';

    const utmSource = params.get('utm_source')?.toLowerCase() || '';
    const utmMedium = params.get('utm_medium')?.toLowerCase() || '';
    const hasPaidSignal = Boolean(params.get('gclid')) || ['cpc', 'ppc', 'paid'].includes(utmMedium);

    const referrer = document.referrer || '';
    if (!referrer) return 'direct';

    try {
        const host = new URL(referrer).hostname.toLowerCase();
        const isGoogleReferrer = host.includes('google.') || host.includes('googleadservices.com');
        if ((isGoogleReferrer || utmSource === 'google') && !hasPaidSignal) {
            return 'google_organic';
        }
    } catch {
        return 'other';
    }

    return 'other';
};

// Zodiac categories
type CategoryType = 'day' | 'zodiac';

const ZODIAC_SIGNS = [
    { value: 'all', label: 'ทั้งหมด', emoji: '✨' },
    { value: 'aries', label: 'เมษ', emoji: '♈', date: '13 เม.ย. - 14 พ.ค.' },
    { value: 'taurus', label: 'พฤษภ', emoji: '♉', date: '14 พ.ค. - 14 มิ.ย.' },
    { value: 'gemini', label: 'เมถุน', emoji: '♊', date: '14 มิ.ย. - 14 ก.ค.' },
    { value: 'cancer', label: 'กรกฎ', emoji: '♋', date: '14 ก.ค. - 16 ส.ค.' },
    { value: 'leo', label: 'สิงห์', emoji: '♌', date: '16 ส.ค. - 16 ก.ย.' },
    { value: 'virgo', label: 'กันย์', emoji: '♍', date: '16 ก.ย. - 16 ต.ค.' },
    { value: 'libra', label: 'ตุลย์', emoji: '♎', date: '16 ต.ค. - 15 พ.ย.' },
    { value: 'scorpio', label: 'พิจิก', emoji: '♏', date: '15 พ.ย. - 15 ธ.ค.' },
    { value: 'sagittarius', label: 'ธนู', emoji: '♐', date: '15 ธ.ค. - 14 ม.ค.' },
    { value: 'capricorn', label: 'มังกร', emoji: '♑', date: '14 ม.ค. - 12 ก.พ.' },
    { value: 'aquarius', label: 'กุมภ์', emoji: '♒', date: '12 ก.พ. - 14 มี.ค.' },
    { value: 'pisces', label: 'มีน', emoji: '♓', date: '14 มี.ค. - 13 เม.ย.' },
];

const ZODIAC_WALLPAPERS: Wallpaper[] = [
    { id: 1001, name: 'ราศีเมษ', image: '/wallpapers/ราศีเมษ.webp', day: 'aries', tags: ['ราศีเมษ', 'ผู้นำ', 'กล้าหาญ', 'โชคลาภ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีเมษ: ผสานพลังสองโลกระหว่างพระพิฆเนศ (เทพเจ้าแห่งสติปัญญาและการขจัดอุปสรรค) กับหัวแกะทองคำสัญลักษณ์ประจำราศีเมษ ตัวแทนแห่งความเป็นผู้นำ กล้าหาญ และจุดเริ่มต้นใหม่ รหัสเลขมงคล "36" และ "639" จัดวางอย่างสมดุลเพื่อเรียกทรัพย์และโชคดี ภาพใช้โทนสีฟ้าคราม ม่วง และทองคำในสไตล์ Mediterranean-Oriental ที่เป็นเอกลักษณ์ เหมาะสำหรับผู้เกิดราศีเมษ (13 เม.ย. – 14 พ.ค.) ที่ต้องการเสริมดวงความสำเร็จ บารมี และดึงดูดโชคลาภใหม่ทุกครั้งที่ปลดล็อกหน้าจอ' },
    { id: 1002, name: 'ราศีพฤษภ', image: '/wallpapers/ราศีพฤษภ.webp', day: 'taurus', tags: ['ราศีพฤษภ', 'มั่นคง', 'ร่ำรวย', 'ทรัพย์สิน'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีพฤษภ: ผสานพลังพระแม่ลักษมี (เทพีแห่งความมั่งคั่งและความโชคดี) กับสัญลักษณ์วัวทองคำอันทรงพลังของราศีพฤษภ ตัวแทนแห่งความมั่นคง ความอดทน และความร่ำรวย รหัสเลขมงคลจัดวางอย่างลงตัวเพื่อเสริมพลังการเงินและทรัพย์สิน ภาพใช้โทนสีเขียวมรกต ทองคำ และน้ำตาลอ่อน สื่อถึงความอุดมสมบูรณ์ของธรรมชาติ เหมาะสำหรับผู้เกิดราศีพฤษภ (14 พ.ค. – 14 มิ.ย.) ที่ต้องการสร้างความมั่นคงทางการเงิน เสริมดวงบ้านและที่ดิน และดึงดูดทรัพย์สินเข้ามาในชีวิต' },
    { id: 1003, name: 'ราศีเมถุน', image: '/wallpapers/ราศีเมถุน.webp', day: 'gemini', tags: ['ราศีเมถุน', 'สื่อสาร', 'เฉลียวฉลาด', 'ค้าขาย'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีเมถุน: ผสานพลังพระพุธ (เทพแห่งการสื่อสารและพาณิชย์) กับสัญลักษณ์คู่แฝดทองคำของราศีเมถุน ตัวแทนแห่งความเฉลียวฉลาด ไหวพริบ และทักษะการเจรจา รหัสเลขมงคลช่วยเสริมพลังด้านการค้าขายและการแสดงออก ภาพใช้โทนสีเหลืองสดใส เขียวอ่อน และเงิน สื่อถึงความว่องไวและความคิดสร้างสรรค์ เหมาะสำหรับผู้เกิดราศีเมถุน (14 มิ.ย. – 14 ก.ค.) ที่ต้องการเสริมทักษะการสื่อสาร การเจรจาต่อรอง และดึงดูดโอกาสธุรกิจใหม่ๆ' },
    { id: 1004, name: 'ราศีกรกฎ', image: '/wallpapers/ราศีกรกฎ .webp', day: 'cancer', tags: ['ราศีกรกฎ', 'ครอบครัว', 'อ่อนโยน', 'ความรัก'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีกรกฎ: ผสานพลังพระจันทร์ (ดาวเจ้าชาตาแห่งอารมณ์และจิตใจ) กับสัญลักษณ์ปูทองคำของราศีกรกฎ ตัวแทนแห่งความรัก ความอบอุ่น และความผูกพันในครอบครัว รหัสเลขมงคลช่วยเสริมพลังความสัมพันธ์และเมตตาบารมี ภาพใช้โทนสีขาวเงิน ฟ้าอ่อน และชมพูบาน สื่อถึงความนุ่มนวลและความสงบ เหมาะสำหรับผู้เกิดราศีกรกฎ (14 ก.ค. – 16 ส.ค.) ที่ต้องการเสริมความรัก ความเข้าใจในครอบครัว และดึงดูดพลังงานแห่งความอบอุ่นเข้ามาในชีวิต' },
    { id: 1005, name: 'ราศีสิงห์', image: '/wallpapers/ราศีสิงห์.webp', day: 'leo', tags: ['ราศีสิงห์', 'บารมี', 'เกียรติยศ', 'อำนาจ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีสิงห์: ผสานพลังพระอาทิตย์ (ดาวเจ้าชาตาแห่งพลังชีวิตและบารมี) กับสัญลักษณ์สิงโตทองคำของราศีสิงห์ ตัวแทนแห่งอำนาจ เกียรติยศ และความโดดเด่น รหัสเลขมงคลช่วยเสริมพลังบารมีและการเป็นที่ยอมรับ ภาพใช้โทนสีทองอร่ามและส้มสดสื่อถึงพลังงานแห่งดวงอาทิตย์ เหมาะสำหรับผู้เกิดราศีสิงห์ (16 ส.ค. – 16 ก.ย.) ที่ต้องการเสริมบารมี ก้าวสู่ตำแหน่งผู้นำ และดึงดูดการยอมรับจากคนรอบข้าง' },
    { id: 1006, name: 'ราศีกันย์', image: '/wallpapers/ราศีกันย์.webp', day: 'virgo', tags: ['ราศีกันย์', 'รอบคอบ', 'สติปัญญา', 'สุขภาพ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีกันย์: ผสานพลังพระแม่สรัสวดี (เทพีแห่งสติปัญญาและศิลปะ) กับสัญลักษณ์หญิงสาวทองคำของราศีกันย์ ตัวแทนแห่งความรอบคอบ ระเบียบวินัย และวิจารณญาณอันเฉียบคม รหัสเลขมงคลช่วยเสริมพลังการเรียนรู้และสุขภาพที่แข็งแรง ภาพใช้โทนสีเขียวพาสเทล น้ำเงินหม่น และทองคำ สื่อถึงความสงบและการวิเคราะห์ เหมาะสำหรับผู้เกิดราศีกันย์ (16 ก.ย. – 16 ต.ค.) ที่ต้องการเสริมสติปัญญา ความก้าวหน้าในหน้าที่การงาน และรักษาสุขภาพให้แข็งแกร่ง' },
    { id: 1007, name: 'ราศีตุลย์', image: '/wallpapers/ราศีตุลย์ .webp', day: 'libra', tags: ['ราศีตุลย์', 'ความรัก', 'สมดุล', 'เสน่ห์'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีตุลย์: ผสานพลังพระศุกร์ (ดาวเจ้าชาตาแห่งความรักและความงาม) กับสัญลักษณ์ตาชั่งทองคำของราศีตุลย์ ตัวแทนแห่งความสมดุล ความยุติธรรม และเสน่ห์ดึงดูดใจ รหัสเลขมงคลช่วยเสริมพลังความสัมพันธ์และความสุขในชีวิตคู่ ภาพใช้โทนสีชมพูอ่อน ม่วงลาเวนเดอร์ และทองคำ สื่อถึงความงามและความโรแมนติก เหมาะสำหรับผู้เกิดราศีตุลย์ (16 ต.ค. – 15 พ.ย.) ที่ต้องการเสริมเสน่ห์ ดึงดูดคนรัก และสร้างความสมดุลที่สวยงามในชีวิต' },
    { id: 1008, name: 'ราศีพิจิก', image: '/wallpapers/ราศีพิจิก.webp', day: 'scorpio', tags: ['ราศีพิจิก', 'พลัง', 'ลึกซึ้ง', 'มุ่งมั่น'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีพิจิก: ผสานพลังพระอังคาร (ดาวเจ้าชาตาแห่งความกล้าและการต่อสู้) กับสัญลักษณ์แมงป่องทองคำของราศีพิจิก ตัวแทนแห่งพลังภายใน ความลึกซึ้ง และความมุ่งมั่นไม่ย่อท้อ รหัสเลขมงคลช่วยเสริมพลังด้านการงานและการลงทุน ภาพใช้โทนสีดำกำมะหยี่ แดงเลือดนก และทองคำ สื่อถึงความลึกและพลังลึกลับ เหมาะสำหรับผู้เกิดราศีพิจิก (15 พ.ย. – 15 ธ.ค.) ที่ต้องการเสริมพลังใจ ความมุ่งมั่นสู่ความสำเร็จ และคุ้มครองจากสิ่งไม่ดี' },
    { id: 1009, name: 'ราศีธนู', image: '/wallpapers/ราศีธนู.webp', day: 'sagittarius', tags: ['ราศีธนู', 'โชคลาภ', 'อิสระ', 'เดินทาง'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีธนู: ผสานพลังพระพฤหัสบดี (ดาวเจ้าชาตาแห่งโชคลาภและปัญญา) กับสัญลักษณ์คนธนูทองคำของราศีธนู ตัวแทนแห่งความอิสระเสรี การเดินทาง และการเปิดรับโอกาสใหม่ รหัสเลขมงคลช่วยดึงดูดโชคดีและความสำเร็จในระยะยาว ภาพใช้โทนสีม่วงอินดิโก้ ฟ้าสด และทองคำ สื่อถึงจักรวาลอันกว้างใหญ่ เหมาะสำหรับผู้เกิดราศีธนู (15 ธ.ค. – 14 ม.ค.) ที่ต้องการเสริมโชคลาภ ความสำเร็จในการเรียนและการงาน และเปิดรับพลังงานใหม่จากจักรวาล' },
    { id: 1010, name: 'ราศีมังกร', image: '/wallpapers/ราศีมังกร .webp', day: 'capricorn', tags: ['ราศีมังกร', 'ความสำเร็จ', 'อำนาจ', 'ธุรกิจ'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีมังกร: ผสานพลังพระเสาร์ (ดาวเจ้าชาตาแห่งความวินัยและความอดทน) กับสัญลักษณ์มังกรทองคำของราศีมังกร ตัวแทนแห่งความสำเร็จ อำนาจ และความก้าวหน้าที่มั่นคงยั่งยืน รหัสเลขมงคลช่วยเสริมพลังธุรกิจและการบริหารจัดการ ภาพใช้โทนสีดำ เทาเงิน และทองคำ สื่อถึงความเข้มแข็งและความน่าเชื่อถือ เหมาะสำหรับผู้เกิดราศีมังกร (14 ม.ค. – 12 ก.พ.) ที่ต้องการเสริมความสำเร็จในธุรกิจ ก้าวขึ้นสู่ตำแหน่งสูง และสร้างมรดกที่ยิ่งใหญ่ให้ลูกหลาน' },
    { id: 1011, name: 'ราศีกุมภ์', image: '/wallpapers/ราศีกุมภ์.webp', day: 'aquarius', tags: ['ราศีกุมภ์', 'สร้างสรรค์', 'อัจฉริยะ', 'นวัตกรรม'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีกุมภ์: ผสานพลังพระยูเรนัส (ดาวเจ้าชาตาแห่งนวัตกรรมและความเป็นปัจเจก) กับสัญลักษณ์ผู้แบกคนโทน้ำทองคำของราศีกุมภ์ ตัวแทนแห่งความคิดสร้างสรรค์ อัจฉริยภาพ และวิสัยทัศน์อันกว้างไกล รหัสเลขมงคลช่วยเสริมพลังการคิดค้นและการเปลี่ยนแปลง ภาพใช้โทนสีฟ้าไฟฟ้า ม่วงนีออน และเงิน สื่อถึงเทคโนโลยีและอนาคต เหมาะสำหรับผู้เกิดราศีกุมภ์ (12 ก.พ. – 14 มี.ค.) ที่ต้องการเสริมความคิดสร้างสรรค์ นวัตกรรม และการดึงดูดเพื่อนร่วมอุดมการณ์' },
    { id: 1012, name: 'ราศีมีน', image: '/wallpapers/ราศีมีน.webp', day: 'pisces', tags: ['ราศีมีน', 'จิตวิญญาณ', 'เมตตา', 'ญาณทิพย์'], premium: true, downloads: 0, description: 'วอลเปเปอร์มงคลราศีมีน: ผสานพลังพระโพสิดอน (เทพเจ้าแห่งท้องทะเลและพลังจิต) กับสัญลักษณ์ปลาคู่ทองคำของราศีมีน ตัวแทนแห่งญาณทิพย์ พลังจิตวิญญาณ และเมตตาบารมีอันยิ่งใหญ่ รหัสเลขมงคลช่วยเชื่อมต่อพลังงานจักรวาลและดึงดูดสิ่งดีๆ ภาพใช้โทนสีฟ้าครามลึก เขียวมรกต และทองคำ สื่อถึงมหาสมุทรแห่งจิตวิญญาณ เหมาะสำหรับผู้เกิดราศีมีน (14 มี.ค. – 13 เม.ย.) ที่ต้องการเสริมญาณทิพย์ ความสงบสุขภายใน และดึงดูดพลังงานบวกจากจักรวาลเข้ามาในชีวิต' },
];

// Zodiac wallpaper IDs for cost lookup
const ZODIAC_IDS = new Set(ZODIAC_WALLPAPERS.map(w => w.id));
const getWallpaperCost = (wallpaper: Wallpaper) => ZODIAC_IDS.has(wallpaper.id) ? 10 : 15;

// Tab types
type TabType = 'collection' | 'custom';

export interface WallpaperPageProps {
    initialCategory?: CategoryType;
    initialDay?: string;
    initialZodiac?: string;
    initialTab?: TabType;
}

function WallpapersContent({ initialCategory: propCategory, initialDay: propDay, initialZodiac: propZodiac, initialTab: propTab }: WallpaperPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Props from sub-routes take precedence, then fallback to query params for backward compat
    const initialDay = propDay || searchParams.get('day') || 'all';
    const initialTab = propTab || (searchParams.get('tab') as TabType) || 'collection';
    const initialCat = propCategory || (searchParams.get('zodiac') ? 'zodiac' : undefined);

    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [selectedDay, setSelectedDay] = useState(initialDay);
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
    const [userCredits, setUserCredits] = useState<number | null>(null);
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>(INITIAL_WALLPAPERS);
    const [zodiacWallpapers, setZodiacWallpapers] = useState<Wallpaper[]>(ZODIAC_WALLPAPERS);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>(initialCat || 'day');
    const [selectedZodiac, setSelectedZodiac] = useState(propZodiac || searchParams.get('zodiac') || 'all');
    const [showCopied, setShowCopied] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [downloadStep, setDownloadStep] = useState<string>('');
    const [trafficSource, setTrafficSource] = useState<string>('unknown');

    // Fetch Wallpapers from Supabase
    useEffect(() => {
        const fetchWallpapers = async () => {
            try {
                const { data, error } = await supabase
                    .from('wallpapers')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) {
                    console.error('Error fetching wallpapers:', error);
                    // use fallback
                } else if (data && data.length > 0) {
                    setWallpapers(data);
                    setZodiacWallpapers(prev => prev.map(zodiacWallpaper => {
                        const matchedWallpaper = data.find(item => item.id === zodiacWallpaper.id);
                        return matchedWallpaper ? { ...zodiacWallpaper, downloads: matchedWallpaper.downloads } : zodiacWallpaper;
                    }));
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallpapers();
    }, []);

    // Deep link to wallpaper via ID
    const wallpaperId = searchParams.get('id');
    useEffect(() => {
        if (wallpaperId && wallpapers.length > 0) {
            const wp = wallpapers.find(w => w.id === Number(wallpaperId));
            if (wp) setSelectedWallpaper(wp);
        }
    }, [wallpaperId, wallpapers]);

    useEffect(() => {
        setTrafficSource(classifyTrafficSource(searchParams));
    }, [searchParams]);

    useEffect(() => {
        trackEvent('wallpapers.page.view', {
            metadata: {
                traffic_source: trafficSource,
            },
        });
    }, [trafficSource]);


    // Reusable function to fetch user credits from DB
    const fetchUserCredits = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const { data } = await supabase
                .from('user_profiles')
                .select('credits, welcome_credits, welcome_credits_granted_at')
                .eq('id', session.user.id)
                .maybeSingle();
            if (data) {
                let total = data.credits ?? 0;
                if (data.welcome_credits && data.welcome_credits > 0 && data.welcome_credits_granted_at) {
                    const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
                    if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
                        total += data.welcome_credits;
                    }
                }
                setUserCredits(total);
            }
        }
    }, []);

    // Fetch credits on mount
    useEffect(() => {
        fetchUserCredits();
    }, [fetchUserCredits]);

    // Listen for force_credits_update events (from other components / tabs)
    useEffect(() => {
        const handleCreditUpdate = () => {
            fetchUserCredits();
        };
        window.addEventListener('force_credits_update', handleCreditUpdate);
        return () => {
            window.removeEventListener('force_credits_update', handleCreditUpdate);
        };
    }, [fetchUserCredits]);

    // ESC key closes the detail panel
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedWallpaper(null);
        };
        if (selectedWallpaper) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedWallpaper]);

    const filteredWallpapers = wallpapers.filter(wp =>
        selectedDay === 'all' || wp.day === selectedDay || wp.day === 'all'
    );

    const filteredZodiacWallpapers = zodiacWallpapers.filter(wp =>
        selectedZodiac === 'all' || wp.day === selectedZodiac
    );

    // Build the shareable URL for the current filter state
    const getShareUrl = () => {
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        if (activeTab === 'custom') return `${base}/wallpapers/custom`;
        if (selectedCategory === 'zodiac' && selectedZodiac !== 'all') return `${base}/wallpapers/zodiac/${selectedZodiac}`;
        if (selectedCategory === 'day' && selectedDay !== 'all') return `${base}/wallpapers/day/${selectedDay}`;
        if (selectedCategory === 'zodiac') return `${base}/wallpapers/zodiac`;
        return `${base}/wallpapers`;
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getShareUrl());
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch {
            // fallback
            const textArea = document.createElement('textarea');
            textArea.value = getShareUrl();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    };

    // Navigate to sub-route when category buttons are pressed
    const navigateDay = useCallback((day: string) => {
        startTransition(() => {
            setSelectedDay(day);
            if (day === 'all') {
                router.push('/wallpapers', { scroll: false });
            } else {
                router.push(`/wallpapers/day/${day}`, { scroll: false });
            }
        });
    }, [router]);
    const navigateZodiac = useCallback((sign: string) => {
        startTransition(() => {
            setSelectedZodiac(sign);
            if (sign === 'all') {
                router.push('/wallpapers', { scroll: false });
            } else {
                router.push(`/wallpapers/zodiac/${sign}`, { scroll: false });
            }
        });
    }, [router]);
    const navigateCategory = useCallback((cat: CategoryType) => {
        startTransition(() => {
            setSelectedCategory(cat);
            if (cat === 'zodiac') {
                router.push('/wallpapers/zodiac', { scroll: false });
            } else {
                router.push('/wallpapers', { scroll: false });
            }
        });
    }, [router]);
    const navigateTab = useCallback((tab: TabType) => {
        startTransition(() => {
            setActiveTab(tab);
            if (tab === 'custom') {
                router.push('/wallpapers/custom', { scroll: false });
            } else {
                router.push('/wallpapers', { scroll: false });
            }
        });
    }, [router]);

    const updateLocalDownloads = (wallpaper: Wallpaper, newCount?: number) => {
        const updater = (item: Wallpaper) =>
            item.id === wallpaper.id
                ? { ...item, downloads: newCount ?? item.downloads + 1 }
                : item;

        if (ZODIAC_IDS.has(wallpaper.id)) {
            setZodiacWallpapers(prev => prev.map(updater));
        } else {
            setWallpapers(prev => prev.map(updater));
        }

        // Also sync modal state
        setSelectedWallpaper(prev =>
            prev && prev.id === wallpaper.id
                ? { ...prev, downloads: newCount ?? prev.downloads + 1 }
                : prev
        );
    };

    const handleDownload = async (wallpaper: Wallpaper) => {
        trackEvent('wallpapers.detail.download_click', {
            metadata: {
                wallpaper_id: wallpaper.id,
                premium: wallpaper.premium,
                traffic_source: trafficSource,
            },
        });

        // Dynamic import SweetAlert2
        const Swal = (await import('sweetalert2')).default;

        // 1. Check Auth
        setDownloadingId(wallpaper.id);
        setDownloadStep('กำลังตรวจสอบสิทธิ์...');
        const { data: { session } } = await supabase.auth.getSession();

        const canAnonymousDownload = !wallpaper.premium && trafficSource === 'google_organic';

        if (!session && !canAnonymousDownload) {
            trackEvent('wallpapers.download.auth_gate', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                },
            });

            setDownloadingId(null);
            setDownloadStep('');
            Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านต้องเข้าสู่ระบบก่อนจึงจะสามารถดาวน์โหลดวอลเปเปอร์มงคลได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#d33',
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    trackEvent('wallpapers.download.login_click', {
                        metadata: {
                            wallpaper_id: wallpaper.id,
                            premium: wallpaper.premium,
                            traffic_source: trafficSource,
                        },
                    });
                    const returnPath = `${window.location.pathname}${window.location.search}`;
                    router.push(`/login?redirect=${encodeURIComponent(returnPath)}`);
                }
            });
            return;
        }

        if (!session && canAnonymousDownload) {
            trackEvent('wallpapers.download.guest_allowed', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                },
            });
        }

        // 2. Handle Premium Logic
        if (wallpaper.premium) {
            const COST = getWallpaperCost(wallpaper);

            // Check balance
            if (userCredits === null || userCredits < COST) {
                Swal.fire({
                    title: 'เครดิตไม่เพียงพอ',
                    text: `วอลเปเปอร์นี้ต้องใช้ ${COST} เครดิต (ท่านมี ${userCredits || 0})`,
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'เติมเครดิต',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#10b981',
                    background: '#1e293b',
                    color: '#fff'
                }).then((res) => {
                    if (res.isConfirmed) router.push('/topup');
                });
                return;
            }

            // Confirm
            const confirm = await Swal.fire({
                title: 'ยืนยันการดาวน์โหลด',
                text: `ต้องการใช้ ${COST} เครดิตเพื่อดาวน์โหลดภาพนี้หรือไม่?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `ยืนยัน (หัก ${COST} เครดิต)`,
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff'
            });

            if (!confirm.isConfirmed) {
                setDownloadingId(null);
                setDownloadStep('');
                return;
            }

            // Deduct credits
            setDownloadStep('กำลังหักเครดิต...');
            try {
                const { error } = await supabase.rpc('deduct_credits', { amount: COST });
                if (error) throw error;

                // Optimistic local update + sync from DB for accuracy
                setUserCredits(prev => (prev !== null ? prev - COST : null));
                window.dispatchEvent(new Event('force_credits_update'));
            } catch (error) {
                console.error('Deduct error:', error);
                setDownloadingId(null);
                setDownloadStep('');
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถตัดเครดิตได้ กรุณาลองใหม่', 'error');
                return;
            }
        }

        // 3. Increment Download Count
        trackEvent('wallpapers.download.start', {
            metadata: {
                wallpaper_id: wallpaper.id,
                premium: wallpaper.premium,
                traffic_source: trafficSource,
            },
        });

        setDownloadStep('กำลังบันทึกยอดดาวน์โหลด...');
        try {
            const { data: rpcData, error: rpcError } = await supabase.rpc('increment_wallpaper_downloads', { wallpaper_id: wallpaper.id });

            if (rpcError) {
                throw rpcError;
            }

            // Use actual count from DB if returned, otherwise fallback to +1
            const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
            if (row && row.success && typeof row.new_downloads === 'number') {
                updateLocalDownloads(wallpaper, row.new_downloads);
            } else {
                updateLocalDownloads(wallpaper);
            }
        } catch (e) {
            console.error('Failed to increment downloads:', e);
            trackEvent('wallpapers.download.count_increment_failed', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                },
            });
            // ตาม policy: ให้ดาวน์โหลดต่อได้ แต่แจ้งเตือนว่าเคาน์เตอร์อาจไม่อัปเดตทันที
            Swal.fire({
                icon: 'warning',
                title: 'ระบบบันทึกยอดดาวน์โหลดล่าช้า',
                text: 'ดาวน์โหลดไฟล์ได้ปกติ แต่ยอดดาวน์โหลดอาจอัปเดตภายหลัง',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1e293b',
                color: '#fff'
            });
        }

        // 4. Convert WebP → PNG via Canvas and trigger download
        setDownloadStep('กำลังแปลงไฟล์ภาพ...');
        const filename = `namemongkol-${wallpaper.id}-${Date.now()}`;
        try {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            const pngBlob = await new Promise<Blob>((resolve, reject) => {
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) { reject(new Error('Canvas not supported')); return; }
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob((blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error('toBlob failed'));
                        }, 'image/png');
                    } catch (err) { reject(err); }
                };
                img.onerror = () => reject(new Error('Image load failed'));
                img.src = wallpaper.image;
            });
            const url = URL.createObjectURL(pngBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            trackEvent('wallpapers.download.success', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                    format: 'png',
                },
            });
        } catch {
            // Fallback: download original WebP if PNG conversion fails
            const link = document.createElement('a');
            link.href = wallpaper.image;
            link.download = `${filename}.webp`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            trackEvent('wallpapers.download.success', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    premium: wallpaper.premium,
                    traffic_source: trafficSource,
                    format: 'webp_fallback',
                },
            });
        }

        setDownloadStep('เสร็จสิ้น! 🎉');
        setTimeout(() => {
            setDownloadingId(null);
            setDownloadStep('');
        }, 1500);

        // 5. Re-fetch credits from DB to ensure accuracy after transaction
        if (wallpaper.premium) {
            await fetchUserCredits();

            Swal.fire({
                icon: 'success',
                title: 'ดาวน์โหลดสำเร็จ',
                text: `หัก ${getWallpaperCost(wallpaper)} เครดิตเรียบร้อยแล้ว`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1e293b',
                color: '#fff'
            });
        } else if (!session && canAnonymousDownload) {
            trackEvent('wallpapers.download.soft_cta_impression', {
                metadata: {
                    wallpaper_id: wallpaper.id,
                    traffic_source: trafficSource,
                },
            });

            const softCta = await Swal.fire({
                title: 'ดาวน์โหลดสำเร็จฟรี',
                text: 'สมัครสมาชิกฟรีเพื่อบันทึกประวัติและปลดล็อกวอลเปเปอร์พรีเมียม',
                icon: 'success',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'สมัครสมาชิกฟรี',
                denyButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ไว้ทีหลัง',
                confirmButtonColor: '#10b981',
                denyButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff',
            });

            if (softCta.isConfirmed) {
                trackEvent('wallpapers.download.soft_cta_register_click', {
                    metadata: {
                        wallpaper_id: wallpaper.id,
                        traffic_source: trafficSource,
                    },
                });
                const returnPath = `${window.location.pathname}${window.location.search}`;
                router.push(`/register?redirect=${encodeURIComponent(returnPath)}`);
            } else if (softCta.isDenied) {
                trackEvent('wallpapers.download.soft_cta_login_click', {
                    metadata: {
                        wallpaper_id: wallpaper.id,
                        traffic_source: trafficSource,
                    },
                });
                const returnPath = `${window.location.pathname}${window.location.search}`;
                router.push(`/login?redirect=${encodeURIComponent(returnPath)}`);
            }
        }
    };

    return (
        <div className="w-full max-w-[1400px] px-4 pt-24 md:pt-32 pb-28 min-h-screen bg-[#050b14] text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-amber-200 mb-2">
                            วอลเปเปอร์มงคล เสริมดวงชะตา บารมี และโชคลาภ
                        </h1>
                        <p className="text-slate-400">
                            ยกระดับพลังบวกให้กับชีวิตทุกครั้งที่เปิดหน้าจอมือถือ ด้วยพลังแห่งภาพมงคลและสีมงคลตามวันเกิด
                        </p>
                    </div>

                    {/* Main Tabs + Share */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex w-full sm:w-fit bg-slate-800 p-1.5 rounded-2xl border border-white/10">
                            <button
                                onClick={() => navigateTab('collection')}
                                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${activeTab === 'collection'
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                <ImageIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                <span className="truncate">คอลเลกชันมงคล</span>
                            </button>
                            <button
                                onClick={() => navigateTab('custom')}
                                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${activeTab === 'custom'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                <Palette className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                <span className="truncate">สร้างวอลเปเปอร์ส่วนตัว</span>
                                <Crown className="w-3 h-3 sm:w-[14px] sm:h-[14px] text-amber-400 flex-shrink-0" />
                            </button>
                        </div>
                        {/* Share / Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white transition-all w-full sm:w-auto"
                        >
                            {showCopied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                            {showCopied ? 'คัดลอกแล้ว!' : 'แชร์ลิงก์หมวดนี้'}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'collection' ? (
                        <motion.div
                            key="collection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Category Selector */}
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigateCategory('day')}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === 'day'
                                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                                                : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-white hover:bg-slate-700'
                                        }`}
                                    >
                                        <Sun size={16} />
                                        วันเกิด
                                    </button>
                                    <button
                                        onClick={() => navigateCategory('zodiac')}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === 'zodiac'
                                                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40'
                                                : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-white hover:bg-slate-700'
                                        }`}
                                    >
                                        <Star size={16} />
                                        ราศี
                                    </button>
                                </div>

                                {/* Day Filter - show when 'day' category is selected */}
                                {selectedCategory === 'day' && (
                                    <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto max-w-full no-scrollbar w-fit">
                                        {DAYS.map((d) => (
                                            <button
                                                key={d.value}
                                                onClick={() => navigateDay(d.value)}
                                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedDay === d.value
                                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                                    }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DAY_COLORS[d.value] ?? 'bg-slate-500'}`} />
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Zodiac Filter - show when 'zodiac' category is selected */}
                                {selectedCategory === 'zodiac' && (
                                    <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto max-w-full no-scrollbar">
                                        {ZODIAC_SIGNS.map((z) => (
                                            <button
                                                key={z.value}
                                                onClick={() => navigateZodiac(z.value)}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedZodiac === z.value
                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                                    }`}
                                            >
                                                <span className="text-base">{z.emoji}</span>
                                                {z.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {(selectedCategory === 'day' ? filteredWallpapers : filteredZodiacWallpapers).map((wp, idx) => {
                                    // Featured card: first card shown when "ทั้งหมด" is selected and is the top-download special card
                                    const isFeatured =
                                        idx === 0 &&
                                        ((selectedCategory === 'day' && selectedDay === 'all' && wp.day === 'all') ||
                                         (selectedCategory === 'zodiac' && selectedZodiac === 'all'));
                                    return (
                                    <div
                                        key={wp.id}
                                        className={`group relative rounded-2xl overflow-hidden bg-slate-800 border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-xl cursor-pointer ${isFeatured ? 'col-span-2 row-span-2 aspect-auto' : 'aspect-[9/16]'}`}
                                        onClick={() => {
                                            setSelectedWallpaper(wp);
                                            trackEvent('wallpapers.card.open_detail', {
                                                metadata: {
                                                    wallpaper_id: wp.id,
                                                    premium: wp.premium,
                                                    category: selectedCategory,
                                                    day_filter: selectedDay,
                                                    zodiac_filter: selectedZodiac,
                                                    traffic_source: trafficSource,
                                                },
                                            });
                                        }}
                                    >
                                        <Image
                                            src={wp.image}
                                            alt={buildWallpaperAlt(wp)}
                                            fill
                                            sizes={isFeatured ? "(max-width: 640px) 100vw, (max-width: 1024px) 65vw, 42vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 15vw"}
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            priority={isFeatured || idx < 2}
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />

                                        {/* Badges */}
                                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                            {wp.premium && (
                                                <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                                                    <Lock size={8} /> {getWallpaperCost(wp)} เครดิต
                                                </span>
                                            )}
                                            <span className="bg-black/60 text-white/80 text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                                <Download size={8} /> {wp.downloads.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 w-full p-3">
                                            <h3 className={`text-white font-bold line-clamp-1 mb-1 ${isFeatured ? 'text-base' : 'text-sm'}`}>{wp.name}</h3>
                                            {isFeatured && wp.description && (
                                                <p className="text-slate-300 text-xs line-clamp-2 mb-2 leading-relaxed">{wp.description.slice(0, 80)}…</p>
                                            )}
                                            <div className="flex flex-wrap gap-1">
                                                {wp.tags.slice(0, isFeatured ? 4 : 3).map(t => (
                                                    <span key={t} className="text-[9px] text-slate-300 bg-white/10 px-1.5 py-0.5 rounded-md">
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            {/* Empty state */}
                            {!loading && (selectedCategory === 'day' ? filteredWallpapers : filteredZodiacWallpapers).length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                                    <ImageIcon size={36} className="text-slate-700" />
                                    <p className="text-slate-500 text-sm">ยังไม่มีวอลเปเปอร์ในหมวดนี้</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="custom"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StandaloneWallpaperGenerator />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Slide-in Detail Panel - right side */}
                <AnimatePresence>
                {activeTab === 'collection' && selectedWallpaper && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="panel-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 z-40"
                            onClick={() => setSelectedWallpaper(null)}
                        />

                        {/* Panel */}
                        <motion.div
                            key="panel"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm z-50 bg-slate-900 border-l border-white/10 flex flex-col overflow-y-auto shadow-2xl"
                        >
                            {/* Close */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">รายละเอียด</span>
                                <button
                                    onClick={() => setSelectedWallpaper(null)}
                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    aria-label="ปิด"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            {/* Image */}
                            <div className="relative w-full aspect-[9/16] bg-black flex-shrink-0 overflow-hidden">
                                <Image
                                    src={selectedWallpaper.image}
                                    alt={buildWallpaperAlt(selectedWallpaper)}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 384px"
                                    className="object-contain"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col px-5 py-5 space-y-4">
                                {/* Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {selectedWallpaper.premium ? (
                                        <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Lock size={10} /> {getWallpaperCost(selectedWallpaper)} เครดิต
                                        </span>
                                    ) : (
                                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
                                            <Sparkles size={10} /> ฟรี
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-500 flex items-center gap-1 px-2 py-0.5 bg-slate-800 rounded-full border border-white/5">
                                        <Download size={10} /> {selectedWallpaper.downloads.toLocaleString()} ดาวน์โหลด
                                    </span>
                                </div>

                                {/* Name */}
                                <h2 className="text-lg font-bold text-white leading-tight">
                                    {selectedWallpaper.name}
                                </h2>

                                {/* Description */}
                                {selectedWallpaper.description && (
                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                                            <Sparkles size={12} /> คุณสมบัติมงคล
                                        </h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {selectedWallpaper.description}
                                        </p>
                                    </div>
                                )}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedWallpaper.tags.map(t => (
                                        <span key={t} className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg border border-white/10">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Footer */}
                            <div className="flex-shrink-0 px-5 pb-6 pt-4 border-t border-white/10 space-y-3">
                                {userCredits !== null && (
                                    <p className="text-xs text-slate-500 text-right">
                                        เครดิตของคุณ: <span className="text-amber-400 font-bold">{userCredits.toLocaleString()}</span>
                                    </p>
                                )}
                                <button
                                    onClick={() => handleDownload(selectedWallpaper)}
                                    disabled={downloadingId === selectedWallpaper.id}
                                    data-track="wallpapers.detail.download"
                                    className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                                        downloadingId === selectedWallpaper.id
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'hover:scale-[1.02] active:scale-[0.98]'
                                    } ${selectedWallpaper.premium
                                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                                        : 'bg-white text-black hover:bg-slate-100 shadow-lg shadow-white/10'
                                    }`}
                                >
                                    {downloadingId === selectedWallpaper.id ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>{downloadStep || 'กำลังดาวน์โหลด...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download size={18} />
                                            {selectedWallpaper.premium ? `แลก ${getWallpaperCost(selectedWallpaper)} เครดิต` : 'ดาวน์โหลดฟรี'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function WallpapersPage(props: WallpaperPageProps = {}) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-amber-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div></div>}>
            <WallpapersContent {...props} />
        </Suspense>
    );
}
