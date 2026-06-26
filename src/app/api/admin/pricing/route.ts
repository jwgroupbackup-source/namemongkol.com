/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function createAuthedClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignored
                    }
                },
            },
        }
    );
}

// Helper to check admin role
async function checkAdmin(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role === 'admin';
}

export async function POST(request: Request) {
    try {
        const supabase = await createAuthedClient();
        if (!(await checkAdmin(supabase))) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { id, name, price, credits, description, popular, color } = body;

        // Validation
        if (!id || !name || !price || !credits) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('pricing_tiers')
            .insert({
                id,
                name,
                price,
                credits,
                description,
                popular: popular || false,
                color: color || 'from-blue-500 to-cyan-500'
            })
            .select()
            .single();

        if (error) throw error;
        revalidateTag('pricing', 'max');

        return NextResponse.json({ success: true, tier: data });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createAuthedClient();
        if (!(await checkAdmin(supabase))) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { id, name, price, credits, description, popular, color } = body;

        if (!id) {
            return NextResponse.json({ error: 'Tier ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('pricing_tiers')
            .update({
                name,
                price,
                credits,
                description,
                popular,
                color,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        revalidateTag('pricing', 'max');

        return NextResponse.json({ success: true, tier: data });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createAuthedClient();
        if (!(await checkAdmin(supabase))) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Tier ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('pricing_tiers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        revalidateTag('pricing', 'max');

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
