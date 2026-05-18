import type { Metadata } from 'next';
import { Suspense } from 'react';
import UpdatePasswordClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'ตั้งรหัสผ่านใหม่ | NameMongkol',
    description: 'ตั้งรหัสผ่านใหม่สำหรับบัญชี NameMongkol ของคุณอย่างปลอดภัย',
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: 'ตั้งรหัสผ่านใหม่ | NameMongkol',
        description: 'ตั้งรหัสผ่านใหม่สำหรับบัญชี NameMongkol ของคุณอย่างปลอดภัย',
        url: `${siteUrl}/auth/update-password`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
    },
};

export default function UpdatePasswordPage() {
    return (
        <Suspense>
            <UpdatePasswordClientPage />
        </Suspense>
    );
}
