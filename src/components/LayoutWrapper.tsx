'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { MobileSecondaryNav } from './MobileSecondaryNav';
import { MobileHeader } from './MobileHeader';
import { TopNav } from './TopNav';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

const SacredCosmicBackground = dynamic(
    () => import('./SacredCosmicBackground').then(mod => ({ default: mod.SacredCosmicBackground })),
    { ssr: false, loading: () => null }
);
const BottomNav = dynamic(() => import('./BottomNav').then(mod => mod.BottomNav), { ssr: false });

const WelcomeCreditModal = dynamic(() => import('./WelcomeCreditModal').then(mod => mod.WelcomeCreditModal), {
    ssr: false
});

const LiveTicker = dynamic(() => import('./LiveTicker').then(mod => mod.LiveTicker), {
    ssr: false,
    loading: () => null
});


export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const backgroundExcludedPaths = ['/phone-analysis', '/aura-analysis'];
    const shouldShowSacredBackground = !backgroundExcludedPaths.includes(pathname) && !pathname.startsWith('/wallpapers');
    const isAdminPage = pathname.startsWith('/admin');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Admin pages use their own layout (AdminSidebar) — skip the main site shell
    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <div className="cosmic-app-shell flex min-h-screen overflow-x-hidden">
            {shouldShowSacredBackground ? <SacredCosmicBackground /> : null}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="relative z-10 flex-1 min-w-0 lg:pl-[360px] transition-all duration-300 bg-transparent">
                <MobileHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} user={user} />
                <TopNav />
                <MobileSecondaryNav />
                {children}
            </div>
            <WelcomeCreditModal user={user} />
            <LiveTicker />
            <BottomNav />
        </div>
    );
};
