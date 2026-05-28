import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'ประวัติการใช้งาน | NameMongkol - ดูผลวิเคราะห์ย้อนหลัง',
    description: 'ดูประวัติการวิเคราะห์ชื่อมงคล เบอร์มงคล และรายการอื่นๆ ของคุณ ย้อนดูผลลัพธ์การทำนายที่เคยบันทึกไว้ พร้อมเครดิตและการชำระเงิน',
    keywords: ['ประวัติการใช้งาน', 'ผลวิเคราะห์ย้อนหลัง', 'NameMongkol', 'ประวัติชื่อมงคล', 'รายการวิเคราะห์'],

    openGraph: {
        title: 'ประวัติการใช้งาน | NameMongkol',
        description: 'ดูประวัติการวิเคราะห์ชื่อมงคลและรายการอื่นๆ ของคุณ',
        url: `${siteUrl}/history`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=ประวัติการใช้งาน&subtitle=ย้อนดูผลวิเคราะห์และรายการทั้งหมดของคุณ&tag=History`],
    },
    twitter: {
        card: 'summary',
        title: 'ประวัติการใช้งาน | NameMongkol',
        description: 'ดูประวัติการวิเคราะห์ชื่อมงคลและรายการอื่นๆ ของคุณ',
    },
    robots: {
        index: false, // History pages are personal and should not be indexed
        follow: false,
    },
};

export default function HistoryPage() {
    return <ClientPage />;
}
