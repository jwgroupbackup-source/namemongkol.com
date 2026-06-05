import { supabase } from '@/utils/supabase';
import type { PremiumNameData } from '@/utils/premiumDataParser';
import type { LeadingCharType } from '@/app/premium-search/premiumSearchUtils';

interface UserCreditProfile {
    credits: number | null;
    welcome_credits: number | null;
    welcome_credits_granted_at: string | null;
}

export const getEffectiveUserCredits = async (userId: string): Promise<number | null> => {
    const { data } = await supabase
        .from('user_profiles')
        .select('credits, welcome_credits, welcome_credits_granted_at')
        .eq('id', userId)
        .maybeSingle();

    const profile = data as UserCreditProfile | null;
    if (!profile) return null;

    let total = profile.credits ?? 0;
    if (profile.welcome_credits && profile.welcome_credits > 0 && profile.welcome_credits_granted_at) {
        const grantedAt = new Date(profile.welcome_credits_granted_at).getTime();
        if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
            total += profile.welcome_credits;
        }
    }

    return total;
};

export const deductCredits = async (amount: number): Promise<void> => {
    const { error } = await supabase.rpc('deduct_credits', { amount });
    if (error) throw error;
};

export const getUserTier = async (userId: string): Promise<string> => {
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('tier')
        .eq('id', userId)
        .maybeSingle();

    return (((profile as { tier?: string | null } | null)?.tier) || 'free').toLowerCase();
};

export interface SavePremiumUnlockHistoryParams {
    userId: string;
    selectedDay: string;
    targetScore: string;
    leadingCharType: LeadingCharType;
    selectedLetter: string | null;
    unlockedNames: PremiumNameData[];
}

export const savePremiumUnlockHistoryIfEligible = async ({
    userId,
    selectedDay,
    targetScore,
    leadingCharType,
    selectedLetter,
    unlockedNames,
}: SavePremiumUnlockHistoryParams): Promise<void> => {
    const tier = await getUserTier(userId);
    if (tier !== 'pro' && tier !== 'vvip') return;

    await supabase.rpc('cleanup_analysis_history_by_tier');
    await supabase.from('analysis_history').insert({
        user_id: userId,
        type: 'gacha',
        input_data: { selectedDay, selectedScore: targetScore || 'All', leadingChar: leadingCharType, selectedLetter },
        result_data: unlockedNames.map(item => ({
            name: item.name,
            totalScore: item.totalScore,
            meaning: `เหมาะกับวัน: ${item.suitableDays.join(', ')}`,
            notes: item.scoreBreakdown
        }))
    });
};
