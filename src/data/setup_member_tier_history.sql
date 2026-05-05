-- Track member tier updates performed by admins.

CREATE TABLE IF NOT EXISTS public.member_tier_history (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL,
    previous_tier text NOT NULL,
    new_tier text NOT NULL,
    changed_by uuid NOT NULL,
    changed_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.member_tier_history
DROP CONSTRAINT IF EXISTS member_tier_history_previous_tier_check;

ALTER TABLE public.member_tier_history
ADD CONSTRAINT member_tier_history_previous_tier_check
CHECK (previous_tier IN ('free', 'pro', 'vvip'));

ALTER TABLE public.member_tier_history
DROP CONSTRAINT IF EXISTS member_tier_history_new_tier_check;

ALTER TABLE public.member_tier_history
ADD CONSTRAINT member_tier_history_new_tier_check
CHECK (new_tier IN ('free', 'pro', 'vvip'));

CREATE INDEX IF NOT EXISTS idx_member_tier_history_user_id
ON public.member_tier_history(user_id);

CREATE INDEX IF NOT EXISTS idx_member_tier_history_changed_at
ON public.member_tier_history(changed_at DESC);

CREATE INDEX IF NOT EXISTS idx_member_tier_history_changed_by
ON public.member_tier_history(changed_by);

ALTER TABLE public.member_tier_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read member tier history" ON public.member_tier_history;
CREATE POLICY "Admins can read member tier history"
ON public.member_tier_history
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.user_profiles
        WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admins can insert member tier history" ON public.member_tier_history;
CREATE POLICY "Admins can insert member tier history"
ON public.member_tier_history
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.user_profiles
        WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
    )
);
