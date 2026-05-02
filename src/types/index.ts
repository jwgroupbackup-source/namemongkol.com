export type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'wednesday_night' | 'thursday' | 'friday' | 'saturday';

export interface PairDefinition {
    grade: 'good' | 'bad' | 'neutral';
    title: string;
    description: string;
    tags: string[];
}

export interface PairAnalysis extends PairDefinition {
    pair: string;
    level: 0 | 1 | 2; // 0=Neutral, 1=Good, 2=Bad (Derived from grade)
}

export interface ThaksaDayConfig {
    name: string;
    borivan: string[];
    ayu: string[];
    dech: string[];
    si: string[];
    mula: string[];
    ussaha: string[];
    montri: string[];
    kali: string[];
}

export interface ThaksaMeaning {
    label: string;
    desc: string;
    color: string;
}

export interface AyatanaMeaning {
    title: string;
    desc: string;
}

export interface AyatanaResult extends AyatanaMeaning {
    score: number;
}

export interface PredictionResult {
    level: string;
    color: string;
    bgGradient: string;
    desc: string;
    stars: number;
}

export interface ThaksaAnalysisResult {
    analysis: Record<string, string[]>;
    surnameAnalysis?: Record<string, string[]>;
    hasKali: boolean;
    kaliChars: string[];
    surnameHasKali?: boolean;
    surnameKaliChars?: string[];
}

export interface AnalysisResult {
    name: string;
    surname: string;
    nameScore: number;
    surnameScore: number;
    totalScore: number;
    namePairs: PairAnalysis[];
    surnamePairs: PairAnalysis[];
    namePrediction: PredictionResult;
    surnamePrediction: PredictionResult;
    prediction: PredictionResult;
    thaksa: ThaksaAnalysisResult | null;
    ayatana: AyatanaResult;
    nameGrade: 'A+' | 'A' | 'B' | 'C';
    surnameGrade: 'A+' | 'A' | 'B' | 'C';
    grade: 'A+' | 'A' | 'B' | 'C'; // Combined grade
    isNirun: boolean;
}

export interface Wallpaper {
    id: number;
    name: string;
    image: string;
    day: string;
    tags: string[];
    premium: boolean;
    downloads: number;
    description?: string | null;
}


// AI Profession-based Phone Analysis Result
export interface PhoneAiAnalysis {
    alignment: { title: string; content: string; score: number };
    hidden_potential: { title: string; content: string };
    strategy: { title: string; content: string };
    verdict: string;
}

// Service types for reviews - SEO optimized with internal links
export type ReviewServiceType =
    | 'name-analysis'      // วิเคราะห์ชื่อ
    | 'phone-analysis'     // วิเคราะห์เบอร์มงคล
    | 'premium-search'     // ค้นหาชื่อมงคลพรีเมียม
    | 'premium-analysis'   // วิเคราะห์ชื่อแบบพรีเมียม
    | 'wallpapers'         // วอลเปเปอร์มงคล
    | 'general';           // ทั่วไป

export interface Review {
    id: string;
    nickname: string;
    avatar?: string;
    content: string;
    tags: string[];
    role?: string;
    date: string; // ISO string from created_at
    created_at?: string; // Database field
    rating: number;
    images?: string[]; // Array of image URLs
    category?: string;
    status?: 'pending' | 'approved' | 'rejected';
    user_id?: string; // Owner ID
    service_type?: ReviewServiceType; // บริการที่ใช้ - สำหรับ SEO
    is_verified?: boolean; // ผู้ใช้ที่ยืนยันแล้ว - E-E-A-T
    helpful_count?: number; // จำนวนคนที่กด Helpful
}
