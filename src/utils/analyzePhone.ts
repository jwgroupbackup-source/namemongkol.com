import { pairDefinitions as localDefinitions } from '@/data/pairDefinitions';
import { PairAnalysis, PairDefinition } from '@/types';
export interface PhoneAnalysisResult {
    phoneNumber: string;
    pairs: PairAnalysis[];
    totalScore: number;
    grade: string;
    stats: {
        finance: { pos: number, neg: number };
        luck: { pos: number, neg: number };
        love: { pos: number, neg: number };
        health: { pos: number, neg: number };
        intellect: { pos: number, neg: number };
        sense: { pos: number, neg: number };
    };
    prediction: string;
}

interface PhonePairMeaningRow {
    pair: string;
    grade: PairDefinition['grade'];
    title: string;
    description: string;
    tags: string[] | null;
}

let cachedDefinitions: Record<string, PairDefinition> | null = null;
let lastFetchTime = 0;

export const getPhonePairDefinitions = async (): Promise<Record<string, PairDefinition>> => {
    try {
        const now = Date.now();
        // Cache for 1 minute to allow distinct updates but improved performance
        if (!cachedDefinitions || (now - lastFetchTime > 60000)) {
            // Dynamic import to prevent SSR initialization issues with createBrowserClient
            const { supabase } = await import('@/utils/supabase');

            const { data, error } = await supabase
                .from('phone_pair_meanings')
                .select('*');

            if (!error && data && data.length > 0) {
                const dbDefs: Record<string, PairDefinition> = {};
                (data as PhonePairMeaningRow[]).forEach((row) => {
                    dbDefs[row.pair] = {
                        grade: row.grade,
                        title: row.title,
                        description: row.description,
                        tags: row.tags ?? []
                    };
                });
                cachedDefinitions = dbDefs;
                lastFetchTime = now;
            }
        }

        if (cachedDefinitions) {
            // Merge DB definitions over local ones
            return { ...localDefinitions, ...cachedDefinitions };
        }
    } catch (err) {
        console.warn('Failed to fetch phone meanings from DB, using local fallback.', err);
    }

    return localDefinitions;
};

export const analyzePhoneNumber = (
    cleanNumber: string,
    definitions: Record<string, PairDefinition> = localDefinitions
): PhoneAnalysisResult | null => {
    if (cleanNumber.length !== 10) return null;

    // 3. Extract pairs from the last 7 digits (indices 3 to 9)
    // Example: 081-234-5678 -> clean: 0812345678
    // Pairs: 23, 34, 45, 56, 67, 78
    const meaningfulPart = cleanNumber.slice(3); // "2345678"
    const pairs: PairAnalysis[] = [];

    // Stats accumulators (0-100 scale for both Positive and Negative)
    const stats = {
        finance: { pos: 0, neg: 0 },
        luck: { pos: 0, neg: 0 },
        love: { pos: 0, neg: 0 },
        health: { pos: 0, neg: 0 },
        intellect: { pos: 0, neg: 0 },
        sense: { pos: 0, neg: 0 }
    };

    let totalScore = 0;

    const FRIEND_PAIRS = ['15', '51', '24', '42', '36', '63', '78', '87', '89', '98', '59', '95', '45', '54'];

    for (let i = 0; i < meaningfulPart.length - 1; i++) {
        const pairStr = meaningfulPart.slice(i, i + 2);
        const definition = definitions[pairStr] || {
            grade: 'neutral',
            title: 'ความหมายทั่วไป',
            description: 'ไม่มีข้อมูล',
            tags: []
        };

        const level = definition.grade === 'good' ? 1 : definition.grade === 'bad' ? 2 : 0;

        pairs.push({
            pair: pairStr,
            level,
            ...definition
        });

        // Update stats based on tags
        const tags = definition.tags || [];
        const isGood = definition.grade === 'good';
        const isBad = definition.grade === 'bad';
        const isFriendPair = FRIEND_PAIRS.includes(pairStr);

        const posImpact = isFriendPair ? 40 : 20; // Double impact for Friend Pairs
        const negImpact = 40; // Bad pair impact doubled

        // Simple scoring logic
        if (definition.grade === 'good') totalScore += posImpact;
        else if (definition.grade === 'neutral') totalScore -= 10;
        else totalScore -= 40; // Penalty doubled to 40 for bad pairs

        const updateStat = (key: keyof typeof stats) => {
            if (isGood) stats[key].pos += posImpact;
            if (isBad) stats[key].neg += negImpact;
        };

        if (tags.some(t => t.includes('เงิน') || t.includes('งาน') || t.includes('ธุรกิจ') || t.includes('รวย') || t.includes('อำนาจ') || t.includes('บารมี') || t.includes('ผู้นำ') || t.includes('ตำแหน่ง') || t.includes('บริวาร') || t.includes('หนี้สิน') || t.includes('ทรัพย์') || t.includes('ถูกโกง') || t.includes('ตกงาน') || t.includes('เปลี่ยนงาน') || t.includes('เอกสาร') || t.includes('เหนื่อยฟรี') || t.includes('เสียผลประโยชน์') || t.includes('เงินก้อนโต') || t.includes('ลงทุน') || t.includes('มั่นคง') || t.includes('เลื่อนขั้น') || t.includes('เจ้านายรัก') || t.includes('โอกาส') || t.includes('คุมบริวาร') || t.includes('ปกครอง') || t.includes('ขายดี') || t.includes('ปิดการขาย') || t.includes('วาจาเรียกทรัพย์') || t.includes('บริหารเงิน') || t.includes('บริหาร') || t.includes('ความสำเร็จสากล'))) updateStat('finance');
        if (tags.some(t => t.includes('โชค') || t.includes('ลาภ') || t.includes('เสี่ยง') || t.includes('ดวง') || t.includes('โชคลาภก้อนใหญ่') || t.includes('ค้าขายร่ำรวย') || t.includes('ปาฏิหาริย์'))) updateStat('luck');
        if (tags.some(t => t.includes('รัก') || t.includes('เสน่ห์') || t.includes('เมตตา') || t.includes('เนื้อคู่') || t.includes('ครอบครัว') || t.includes('เจ้าชู้') || t.includes('รักร้าว') || t.includes('พลัดพราก') || t.includes('โดดเดี่ยว') || t.includes('ไร้เสน่ห์') || t.includes('ไม่ชัดเจน') || t.includes('ทะเลาะ') || t.includes('อารมณ์ร้อน') || t.includes('ลุ่มหลง'))) updateStat('love');
        if (tags.some(t => t.includes('สุขภาพ') || t.includes('อุบัติเหตุ') || t.includes('ป่วย') || t.includes('โรค') || t.includes('ช่องท้อง') || t.includes('ผ่าตัด') || t.includes('กระดูก') || t.includes('เส้นประสาท') || t.includes('ความดัน') || t.includes('ไมเกรน') || t.includes('สายตา') || t.includes('ก้อนเนื้อ') || t.includes('มะเร็ง') || t.includes('พักผ่อนน้อย') || t.includes('ตับไต') || t.includes('สารพิษ') || t.includes('ภูมิแพ้') || t.includes('นารีเวช') || t.includes('ภูมิคุ้มกันบกพร่อง'))) updateStat('health');
        if (tags.some(t => t.includes('ปัญญา') || t.includes('เรียน') || t.includes('ฉลาด') || t.includes('สติ') || t.includes('วิชา') || t.includes('ความรู้'))) updateStat('intellect');
        if (tags.some(t => t.includes('ลางสังหรณ์') || t.includes('สัมผัส') || t.includes('สิ่งศักดิ์สิทธิ์') || t.includes('ปาฏิหาริย์') || t.includes('ลี้ลับ') || t.includes('เซนส์') || t.includes('คาดการณ์') || t.includes('สมาธิ') || t.includes('อ่านใจ'))) updateStat('sense');
    }





    // Special Rule: If all pairs are 'good' (Green), Health is automatically 100% (Safety/Auspicious)
    if (pairs.length > 0 && pairs.every(p => p.grade === 'good')) {
        stats.health.pos = 100;
        stats.health.neg = 0;
    }

    // Clamp stats 0-100
    Object.keys(stats).forEach(k => {
        const key = k as keyof typeof stats;
        stats[key].pos = Math.min(100, stats[key].pos);
        stats[key].neg = Math.min(100, stats[key].neg);
    });

    // Determine Grade and Prediction
    let grade = 'F';
    let prediction = 'เบอร์เหนื่อยเปล่า';
    const isAllGreen = pairs.length > 0 && pairs.every(p => p.grade === 'good');
    const hasBadPair = pairs.some(p => p.grade === 'bad');

    if (totalScore >= 80 && isAllGreen) {
        grade = 'A';
        prediction = 'เบอร์ดีมากๆ';
    } else if (totalScore >= 60 && !hasBadPair) {
        grade = 'B';
        prediction = 'เบอร์ดี';
    } else if (totalScore >= 40) {
        grade = 'C';
        prediction = 'เบอร์ทั่วไป';
    } else if (totalScore >= 20) {
        grade = 'D';
        prediction = 'เบอร์ค่อนข้างเหนื่อย';
    } else {
        grade = 'F';
        prediction = 'เบอร์เหนื่อยเปล่า';
    }

    // Formatted Number for display (0XX-XXX-XXXX)
    const formatted = `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;

    return {
        phoneNumber: formatted,
        pairs,
        totalScore,
        grade,
        stats,
        prediction
    };
};

export const analyzePhone = async (phoneNumber: string): Promise<PhoneAnalysisResult | null> => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) return null;

    const definitions = await getPhonePairDefinitions();
    return analyzePhoneNumber(cleanNumber, definitions);
};
