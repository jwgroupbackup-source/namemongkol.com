import { Metadata } from 'next';
import ProfileClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'โปรไฟล์ของฉัน | NameMongkol',
    description: 'จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณบน NameMongkol ดูเครดิตคงเหลือ เชื่อมต่อ LINE และจัดการข้อมูลส่วนตัว',
    keywords: ['โปรไฟล์', 'บัญชีผู้ใช้', 'ตั้งค่า', 'NameMongkol', 'สมาชิก'],

    openGraph: {
        title: 'โปรไฟล์ของฉัน | NameMongkol',
        description: 'จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ',
        url: `${siteUrl}/profile`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'โปรไฟล์ของฉัน | NameMongkol',
        description: 'จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ',
    },
    robots: {
        index: false, // Profile pages should not be indexed
        follow: false,
    },
};

export default function ProfilePage() {
    return <ProfileClientPage />;
}
