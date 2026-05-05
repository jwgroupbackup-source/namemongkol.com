-- Reset and enforce tier-based history retention.
-- Policy:
-- - free: no history access and no history insert
-- - pro: keep 30 days
-- - vvip: keep 90 days

ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Start a fresh history cycle for all users.
TRUNCATE TABLE public.analysis_history;

ALTER TABLE public.analysis_history
DROP CONSTRAINT IF EXISTS analysis_history_type_check;

ALTER TABLE public.analysis_history
ADD CONSTRAINT analysis_history_type_check
CHECK (type IN ('premium_analysis', 'gacha', 'name_search'));

CREATE INDEX IF NOT EXISTS idx_analysis_history_user_created_at
ON public.analysis_history(user_id, created_at DESC);

DROP POLICY IF EXISTS "Users can insert their own history" ON public.analysis_history;
DROP POLICY IF EXISTS "Users can view their own history" ON public.analysis_history;
DROP POLICY IF EXISTS "Pro and VVIP can insert own history" ON public.analysis_history;
DROP POLICY IF EXISTS "Pro and VVIP can view retained own history" ON public.analysis_history;

CREATE POLICY "Pro and VVIP can insert own history"
ON public.analysis_history
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.tier IN ('pro', 'vvip')
  )
);

CREATE POLICY "Pro and VVIP can view retained own history"
ON public.analysis_history
FOR SELECT
USING (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND (
        (up.tier = 'pro' AND public.analysis_history.created_at >= (timezone('utc'::text, now()) - INTERVAL '30 days'))
        OR
        (up.tier = 'vvip' AND public.analysis_history.created_at >= (timezone('utc'::text, now()) - INTERVAL '90 days'))
      )
  )
);

CREATE OR REPLACE FUNCTION public.cleanup_analysis_history_by_tier()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_free integer := 0;
  deleted_pro integer := 0;
  deleted_vvip integer := 0;
BEGIN
  -- Remove all history for free (or unknown) members.
  DELETE FROM public.analysis_history ah
  USING public.user_profiles up
  WHERE ah.user_id = up.id
    AND COALESCE(up.tier, 'free') NOT IN ('pro', 'vvip');
  GET DIAGNOSTICS deleted_free = ROW_COUNT;

  -- Keep only last 30 days for pro.
  DELETE FROM public.analysis_history ah
  USING public.user_profiles up
  WHERE ah.user_id = up.id
    AND up.tier = 'pro'
    AND ah.created_at < (timezone('utc'::text, now()) - INTERVAL '30 days');
  GET DIAGNOSTICS deleted_pro = ROW_COUNT;

  -- Keep only last 90 days for vvip.
  DELETE FROM public.analysis_history ah
  USING public.user_profiles up
  WHERE ah.user_id = up.id
    AND up.tier = 'vvip'
    AND ah.created_at < (timezone('utc'::text, now()) - INTERVAL '90 days');
  GET DIAGNOSTICS deleted_vvip = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_free', deleted_free,
    'deleted_pro', deleted_pro,
    'deleted_vvip', deleted_vvip,
    'deleted_total', deleted_free + deleted_pro + deleted_vvip,
    'cleaned_at', timezone('utc'::text, now())
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_analysis_history_by_tier() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_analysis_history_by_tier() TO service_role;
