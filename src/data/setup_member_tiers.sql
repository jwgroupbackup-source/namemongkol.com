-- Setup member tiers for admin-managed membership levels.
-- Policy: free / pro / vvip, no expiry, no automatic upgrade on payment.

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS tier text;

-- Backfill missing or unsupported values before applying constraints.
UPDATE public.user_profiles
SET tier = 'free'
WHERE tier IS NULL
   OR tier NOT IN ('free', 'pro', 'vvip');

ALTER TABLE public.user_profiles
ALTER COLUMN tier SET DEFAULT 'free';

ALTER TABLE public.user_profiles
ALTER COLUMN tier SET NOT NULL;

ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_tier_check;

ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_tier_check
CHECK (tier IN ('free', 'pro', 'vvip'));

CREATE INDEX IF NOT EXISTS idx_user_profiles_tier
ON public.user_profiles(tier);
