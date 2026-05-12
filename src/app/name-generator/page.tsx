import { Metadata } from 'next';
import ClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'AI นวัตกรรมสร้างชื่อมงคล Grade A+ สั่งทำพิเศษ | NameMongkol',
    alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/name-generator` },
    description: 'ทดลองสร้างชื่อมงคลนวัตกรรมใหม่ เกรด A+ ด้วย AI ที่รับประกันความสมบูรณ์แบบ 100% ตามหลักเลขศาสตร์ ไม่มีคู่เลขกาลกิณี',
};

export default function NameGeneratorPage() {
    return <ClientPage />;
}
