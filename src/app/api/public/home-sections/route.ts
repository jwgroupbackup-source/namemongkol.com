import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 1800;

const getSupabase = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

interface WallpaperStat {
    id: number;
    downloads: number;
}

interface HomeArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    cover_image: string;
    date: string;
    author: string;
    category: string;
}

export async function GET() {
    const supabase = getSupabase();

    try {
        const [wallpaperRes, articleRes] = await Promise.all([
            supabase
                .from('wallpapers')
                .select('id, downloads')
                .in('id', [1, 2, 3, 4]),
            supabase
                .from('articles')
                .select('id, slug, title, excerpt, cover_image, date, author, category')
                .eq('is_published', true)
                .order('date', { ascending: false })
                .limit(3),
        ]);

        if (wallpaperRes.error) throw wallpaperRes.error;
        if (articleRes.error) throw articleRes.error;

        const wallpapers = (wallpaperRes.data ?? []) as WallpaperStat[];
        const articles = (articleRes.data ?? []) as HomeArticle[];

        return NextResponse.json(
            {
                success: true,
                data: {
                    wallpapers,
                    articles,
                },
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
                },
            },
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                data: {
                    wallpapers: [],
                    articles: [],
                },
            },
            { status: 500 },
        );
    }
}
