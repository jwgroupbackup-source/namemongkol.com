/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const ALLOWED_MEMBER_TIERS = ['free', 'pro', 'vvip'] as const;
type MemberTier = (typeof ALLOWED_MEMBER_TIERS)[number];
type SearchableUserProfile = {
    id: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
};

function normalizeAdminUserSearch(value?: string | null) {
    return (value || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function tokenizeAdminUserSearch(value: string) {
    const normalized = normalizeAdminUserSearch(value);
    return normalized ? normalized.split(' ').filter(Boolean) : [];
}

function buildAdminUserSearchableText(profile: SearchableUserProfile) {
    const firstName = (profile.first_name || '').trim();
    const lastName = (profile.last_name || '').trim();
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    return normalizeAdminUserSearch([
        profile.id || '',
        firstName,
        lastName,
        fullName,
        profile.email || '',
    ].join(' '));
}

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

export async function GET(request: Request) {
    try {
        const supabase = await createAuthedClient();

        // Security Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const normalizedSearch = normalizeAdminUserSearch(search);
        const tier = (searchParams.get('tier') || '').toLowerCase();

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const hasTierFilter = ALLOWED_MEMBER_TIERS.includes(tier as MemberTier);

        if (normalizedSearch) {
            let searchQuery = supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (hasTierFilter) {
                searchQuery = searchQuery.eq('tier', tier);
            }

            const { data, error } = await searchQuery;

            if (error) throw error;

            const tokens = tokenizeAdminUserSearch(normalizedSearch);
            const filteredUsers = (data || []).filter((profile) => {
                const searchableText = buildAdminUserSearchableText(profile as SearchableUserProfile);
                return tokens.every((token) => searchableText.includes(token));
            });

            return NextResponse.json({
                success: true,
                users: filteredUsers.slice(from, to + 1),
                total: filteredUsers.length,
                page,
                limit
            });
        }

        let query = supabase
            .from('user_profiles')
            .select('*', { count: 'exact' })
            .range(from, to)
            .order('created_at', { ascending: false });

        if (hasTierFilter) {
            query = query.eq('tier', tier);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return NextResponse.json({
            success: true,
            users: data,
            total: count,
            page,
            limit
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createAuthedClient();

        // Security Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await request.json();
        const { id, credits, role, tier } = body;

        if (!id) throw new Error('User ID is required');

        const updates: any = {};
        if (credits !== undefined) updates.credits = credits;
        if (role !== undefined) updates.role = role;
        let normalizedTier: MemberTier | undefined;
        if (tier !== undefined) {
            normalizedTier = String(tier).toLowerCase() as MemberTier;
            if (!ALLOWED_MEMBER_TIERS.includes(normalizedTier)) {
                return NextResponse.json({ success: false, error: 'Invalid tier value' }, { status: 400 });
            }
            updates.tier = normalizedTier;
        }

        const { data: existingProfile, error: existingProfileError } = await supabase
            .from('user_profiles')
            .select('tier')
            .eq('id', id)
            .single();

        if (existingProfileError) throw existingProfileError;

        const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (normalizedTier && existingProfile?.tier !== normalizedTier) {
            const { error: historyError } = await supabase
                .from('member_tier_history')
                .insert({
                    user_id: id,
                    previous_tier: (existingProfile?.tier || 'free').toLowerCase(),
                    new_tier: normalizedTier,
                    changed_by: user.id,
                });

            if (historyError) {
                console.error('Failed to insert member tier history:', historyError);
            }
        }

        return NextResponse.json({ success: true, user: data });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
