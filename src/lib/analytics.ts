/**
 * Analytics Tracking Utility — Central client-side event tracker.
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics';
 *   trackEvent('home.hero.analyze_click');
 *
 * Auto-capture via data attributes (mounted by AnalyticsProvider):
 *   <button data-track="login.social.google">Login with Google</button>
 */

import { supabase } from '@/utils/supabase';

const CLICK_SAMPLE_RATE = 0.35;
const DEDUPE_WINDOW_MS = 2000;
const ALWAYS_TRACK_KEYWORDS = [
    'analyze',
    'submit',
    'login',
    'signup',
    'topup',
    'payment',
    'unlock',
    'deduct',
    'download',
];

// ---------------------------------------------------------------------------
// Session ID (anonymous fallback)
// ---------------------------------------------------------------------------
let _sessionId: string | null = null;
const _recentEvents = new Map<string, number>();

function getSessionId(): string {
    if (_sessionId) return _sessionId;

    // Try to reuse from sessionStorage (persists across pages in same tab)
    if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('nm_sid');
        if (stored) {
            _sessionId = stored;
            return stored;
        }
        // Generate a simple random ID
        const id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        sessionStorage.setItem('nm_sid', id);
        _sessionId = id;
        return id;
    }
    return 'unknown';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface TrackEventOptions {
    /** Override auto-detected page path */
    pagePath?: string;
    /** Extra metadata (keep small — no PII) */
    metadata?: Record<string, unknown>;
}

/**
 * Track a user action event.
 *
 * @param buttonKey  Dot-notation key, e.g. "name_analysis.form.analyze"
 * @param options    Optional overrides
 */
export async function trackEvent(
    buttonKey: string,
    options: TrackEventOptions = {},
): Promise<void> {
    try {
        const pagePath = options.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
        const referrer = typeof document !== 'undefined' ? document.referrer : '';
        const normalizedKey = buttonKey.toLowerCase();
        const shouldAlwaysTrack = ALWAYS_TRACK_KEYWORDS.some(keyword => normalizedKey.includes(keyword));
        const dedupeKey = `${pagePath}:${buttonKey}`;
        const now = Date.now();
        const lastTrackedAt = _recentEvents.get(dedupeKey) ?? 0;

        if (now - lastTrackedAt < DEDUPE_WINDOW_MS) {
            return;
        }

        if (!shouldAlwaysTrack && Math.random() > CLICK_SAMPLE_RATE) {
            return;
        }

        _recentEvents.set(dedupeKey, now);

        // Get user_id if logged in
        let userId: string | null = null;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            userId = session?.user?.id ?? null;
        } catch {
            // not logged in — fine
        }

        const payload = {
            event_name: 'click',
            button_key: buttonKey,
            page_path: pagePath,
            user_id: userId,
            session_id: getSessionId(),
            referrer: referrer.slice(0, 500),
            metadata: options.metadata ?? {},
        };

        // Fire-and-forget POST to ingest endpoint
        fetch('/api/analytics/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true, // survive page navigations
        }).catch(() => {
            // Silently fail — analytics should never block UX
        });
    } catch {
        // Silently fail
    }
}

// ---------------------------------------------------------------------------
// Auto-capture: delegated click listener for [data-track] elements
// ---------------------------------------------------------------------------
let _listenerAttached = false;

export function attachAutoCapture(): void {
    if (typeof window === 'undefined' || _listenerAttached) return;
    _listenerAttached = true;

    document.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement)?.closest?.('[data-track]');
        if (!target) return;

        const buttonKey = (target as HTMLElement).dataset.track;
        if (!buttonKey) return;

        // Optional: extra metadata from data-track-meta (JSON string)
        let metadata: Record<string, unknown> = {};
        const metaStr = (target as HTMLElement).dataset.trackMeta;
        if (metaStr) {
            try { metadata = JSON.parse(metaStr); } catch { /* ignore */ }
        }

        trackEvent(buttonKey, { metadata });
    }, { capture: true, passive: true });
}
