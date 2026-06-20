'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PalmScanner from '@/components/palm-analysis/PalmScanner';
import PalmResults from '@/components/palm-analysis/PalmResults';
import { PalmAnalysisResult } from '@/types/palm-analysis';
import { supabase } from '@/utils/supabase';
import { getEffectiveCredits } from '@/utils/credits';

const PALM_ANALYSIS_COST = 20;

// Compress image adaptively to reduce Gemini API token usage and speed up processing.
// Strategy: resize first, then lower JPEG quality/width until payload is near target size.
function estimateDataUriBytes(dataUri: string): number {
  const base64 = dataUri.split(',')[1] || '';
  return Math.floor((base64.length * 3) / 4);
}

function compressImage(dataUri: string, maxWidth = 1024, initialQuality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const TARGET_MAX_BYTES = 350 * 1024; // ~350KB — balanced: fast upload + enough detail for AI
      const MIN_QUALITY = 0.50;
      const MIN_WIDTH = 600;

      const { width: originalWidth, height: originalHeight } = img;
      let width = originalWidth;
      let height = originalHeight;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context error'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Measure average brightness to adapt enhancement for dark images
      const measureBrightness = (ctx: CanvasRenderingContext2D, w: number, h: number): number => {
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;
        let sum = 0;
        for (let i = 0; i < d.length; i += 16) { // sample every 4th pixel
          sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        }
        return sum / (d.length / 16);
      };

      // Apply unsharp mask to enhance palm creases & ridges for better AI detection
      const applyUnsharpMask = (ctx: CanvasRenderingContext2D, w: number, h: number, amount = 0.45, radius = 1) => {
        const original = ctx.getImageData(0, 0, w, h);
        // Create blurred version using a temporary canvas
        const blurCanvas = document.createElement('canvas');
        blurCanvas.width = w;
        blurCanvas.height = h;
        const blurCtx = blurCanvas.getContext('2d');
        if (!blurCtx) return;
        blurCtx.filter = `blur(${radius}px)`;
        blurCtx.drawImage(canvas, 0, 0, w, h);
        const blurred = blurCtx.getImageData(0, 0, w, h);

        const data = original.data;
        const blurData = blurred.data;
        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            const diff = data[i + c] - blurData[i + c];
            data[i + c] = Math.min(255, Math.max(0, data[i + c] + diff * amount));
          }
        }
        ctx.putImageData(original, 0, 0);
      };

      // Adaptive CLAHE-like local contrast enhancement for dark/low-contrast images
      const applyLocalContrastEnhancement = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;
        // Build luminance histogram
        const hist = new Uint32Array(256);
        for (let i = 0; i < d.length; i += 4) {
          const lum = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
          hist[lum]++;
        }
        // Build CDF for histogram equalization
        const cdf = new Float32Array(256);
        const totalPixels = d.length / 4;
        cdf[0] = hist[0] / totalPixels;
        for (let i = 1; i < 256; i++) {
          cdf[i] = cdf[i - 1] + hist[i] / totalPixels;
        }
        // Blend original with equalized (partial — 35% equalized to avoid over-processing)
        const blendFactor = 0.35;
        for (let i = 0; i < d.length; i += 4) {
          const lum = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
          const equalized = Math.round(cdf[lum] * 255);
          const ratio = lum > 0 ? equalized / lum : 1;
          for (let c = 0; c < 3; c++) {
            const orig = d[i + c];
            const mapped = Math.round(orig * ratio);
            d[i + c] = Math.min(255, Math.max(0, Math.round(orig * (1 - blendFactor) + mapped * blendFactor)));
          }
        }
        ctx.putImageData(imgData, 0, 0);
      };

      const render = (targetWidth: number, targetHeight: number, quality: number) => {
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }

        // First pass: draw raw image to measure brightness
        ctx.filter = 'none';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const avgBrightness = measureBrightness(ctx, targetWidth, targetHeight);

        // Adaptive enhancement based on image brightness
        const isDark = avgBrightness < 90;
        const isVeryDark = avgBrightness < 60;
        const brightnessBoost = isVeryDark ? 1.35 : isDark ? 1.18 : 1.02;
        const contrastBoost = isVeryDark ? 1.45 : isDark ? 1.30 : 1.18;
        const unsharpAmount = isVeryDark ? 0.70 : isDark ? 0.55 : 0.45;

        // Re-draw with adaptive filter
        ctx.filter = `contrast(${contrastBoost}) saturate(1.05) brightness(${brightnessBoost})`;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        ctx.filter = 'none';

        // Apply local contrast enhancement for dark images to reveal hidden creases
        if (isDark) {
          applyLocalContrastEnhancement(ctx, targetWidth, targetHeight);
        }

        // Unsharp mask to enhance fine crease details (stronger for dark images)
        applyUnsharpMask(ctx, targetWidth, targetHeight, unsharpAmount, isDark ? 1.5 : 1);
        return canvas.toDataURL('image/jpeg', quality);
      };

      let quality = initialQuality;
      let compressed = render(width, height, quality);

      // Pass 1: reduce JPEG quality while keeping resolution
      while (estimateDataUriBytes(compressed) > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
        quality = Math.max(MIN_QUALITY, Number((quality - 0.06).toFixed(2)));
        compressed = render(width, height, quality);
      }

      // Pass 2: if still too large, reduce resolution gradually
      while (estimateDataUriBytes(compressed) > TARGET_MAX_BYTES && width > MIN_WIDTH) {
        const nextWidth = Math.max(MIN_WIDTH, Math.round(width * 0.85));
        const nextHeight = Math.round((originalHeight * nextWidth) / originalWidth);
        width = nextWidth;
        height = nextHeight;
        compressed = render(width, height, quality);
      }

      resolve(compressed);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUri;
  });
}

const COOLDOWN_SECONDS = 30;

function parseRetryAfterSeconds(retryAfterHeader: string | null): number | null {
  if (!retryAfterHeader) return null;

  const numeric = Number(retryAfterHeader);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return Math.max(1, Math.ceil(numeric));
  }

  const parsedDate = Date.parse(retryAfterHeader);
  if (!Number.isNaN(parsedDate)) {
    const diffMs = parsedDate - Date.now();
    return diffMs > 0 ? Math.max(1, Math.ceil(diffMs / 1000)) : 1;
  }

  return null;
}

async function safeParseResponseBody(response: Response): Promise<Record<string, any>> {
  const rawText = await response.text();
  if (!rawText) return {};

  try {
    const parsed = JSON.parse(rawText);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return { error: rawText.slice(0, 200) };
  }
}

function isPalmAnalysisResult(value: Record<string, any>): value is PalmAnalysisResult {
  return Boolean(
    value &&
      typeof value === 'object' &&
      value.scores &&
      value.line_analysis &&
      typeof value.summary === 'string'
  );
}

export default function PalmAnalysisClient() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PalmAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [, setUserCredits] = useState<number | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlightRef = useRef(false);

  // Fetch user credits on mount + listen for auth changes
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const credits = await getEffectiveCredits(user.id);
          setUserCredits(credits.total);
        }
      } catch {
        // Not logged in
      }
    };
    fetchCredits();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const credits = await getEffectiveCredits(session.user.id);
        setUserCredits(credits.total);
      } else {
        setUserCredits(null);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  // Called when user clicks "วิเคราะห์รูปใหม่" to clear all previous state
  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = useCallback((seconds = COOLDOWN_SECONDS) => {
    const safeSeconds = Math.max(1, Math.ceil(seconds));
    setCooldown(safeSeconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleAnalyze = async (imageBase64: string) => {
    if (cooldown > 0 || inFlightRef.current) return;

    // ── Fix: Lock immediately to prevent double-tap race condition ──
    inFlightRef.current = true;
    let creditDeducted = false;

    try {
      const Swal = (await import('sweetalert2')).default;

      // Step 1: Auth check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const authResult = await Swal.fire({
          title: '🔒 กรุณาเข้าสู่ระบบ',
          html: '<p style="color:#cbd5e1">คุณต้องเข้าสู่ระบบก่อนจึงจะใช้งานวิเคราะห์ลายมือได้</p>',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'เข้าสู่ระบบ',
          cancelButtonText: 'ยกเลิก',
          background: '#ffffff',
          color: '#1a1a3e',
          confirmButtonColor: '#f59e0b',
          customClass: { popup: 'rounded-2xl border border-[#ddddf0] shadow-xl' },
        });
        if (authResult.isConfirmed) {
          router.push('/login?redirect=/palm-analysis');
        }
        return;
      }

      // Step 2: Credit check
      const latestCredits = await getEffectiveCredits(user.id);
      setUserCredits(latestCredits.total);

      if (latestCredits.total < PALM_ANALYSIS_COST) {
        const topupResult = await Swal.fire({
          title: '💰 เครดิตไม่เพียงพอ',
          html: `<p style="color:#cbd5e1">การวิเคราะห์ลายมือใช้ <strong style="color:#fbbf24">${PALM_ANALYSIS_COST} เครดิต</strong></p><p style="color:#cbd5e1;margin-top:4px">คุณมี <strong style="color:#ef4444">${latestCredits.total} เครดิต</strong></p>`,
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'เติมเครดิต',
          cancelButtonText: 'ยกเลิก',
          background: '#ffffff',
          color: '#1a1a3e',
          confirmButtonColor: '#f59e0b',
          customClass: { popup: 'rounded-2xl border border-[#ddddf0] shadow-xl' },
        });
        if (topupResult.isConfirmed) {
          router.push('/topup');
        }
        return;
      }

      // Step 3: Confirmation
      const confirmResult = await Swal.fire({
        title: '✨ ยืนยันการวิเคราะห์',
        html: `<p style="color:#cbd5e1">การวิเคราะห์ลายมือจะใช้ <strong style="color:#fbbf24">${PALM_ANALYSIS_COST} เครดิต</strong></p><p style="color:#cbd5e1;margin-top:4px">คุณมี <strong style="color:#34d399">${latestCredits.total} เครดิต</strong> (คงเหลือ ${latestCredits.total - PALM_ANALYSIS_COST} เครดิต)</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `ยืนยัน (ใช้ ${PALM_ANALYSIS_COST} เครดิต)`,
        cancelButtonText: 'ยกเลิก',
        background: '#ffffff',
        color: '#1a1a3e',
        confirmButtonColor: '#f59e0b',
        customClass: { popup: 'rounded-2xl border border-[#ddddf0] shadow-xl' },
      });
      if (!confirmResult.isConfirmed) return;

      // Step 4: Deduct credits
      const { error: deductError } = await supabase.rpc('deduct_credits', { amount: PALM_ANALYSIS_COST });
      if (deductError) {
        await Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถหักเครดิตได้ กรุณาลองใหม่',
          icon: 'error',
          background: '#ffffff',
          color: '#1a1a3e',
          customClass: { popup: 'rounded-2xl border border-[#ddddf0] shadow-xl' },
        });
        return;
      }

      creditDeducted = true;
      setUserCredits((prev) => (prev !== null ? prev - PALM_ANALYSIS_COST : null));
      window.dispatchEvent(new Event('force_credits_update'));

      // Proceed with analysis
      setIsAnalyzing(true);
      setError(null);
      setResult(null);

      // Compress image before sending
      const compressed = await compressImage(imageBase64);

      // ── Fix: Add timeout to prevent infinite spinner ──
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40_000);

      try {
        const response = await fetch('/api/analyze-palm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageBase64: compressed }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await safeParseResponseBody(response);

        if (!response.ok) {
          console.error('[palm] API error:', JSON.stringify(data));

          // User-friendly message for quota errors
          if (response.status === 429 || data.code === 'QUOTA_EXHAUSTED' || data.code === 'RATE_LIMITED') {
            const retryAfterSeconds = parseRetryAfterSeconds(response.headers.get('retry-after'));
            startCooldown(retryAfterSeconds ?? COOLDOWN_SECONDS);
            throw new Error('QUOTA');
          }

          throw new Error(data.details || data.error || 'ไม่สามารถวิเคราะห์ภาพได้');
        }

        if (!isPalmAnalysisResult(data)) {
          throw new Error('รูปแบบข้อมูลผลวิเคราะห์ไม่ถูกต้อง');
        }

        // Success — mark credits as consumed (no refund needed)
        creditDeducted = false;
        setResult(data);
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      console.error('Analysis error:', err);

      // ── Fix: Refund credits if deducted but analysis failed ──
      if (creditDeducted) {
        try {
          await supabase.rpc('deduct_credits', { amount: -PALM_ANALYSIS_COST });
          setUserCredits((prev) => (prev !== null ? prev + PALM_ANALYSIS_COST : null));
          window.dispatchEvent(new Event('force_credits_update'));
          console.log('[palm] Credits refunded after failed analysis');
        } catch (refundErr) {
          console.error('[palm] Failed to refund credits:', refundErr);
        }
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('การวิเคราะห์ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง');
      } else {
        const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
        setError(message);
      }
    } finally {
      inFlightRef.current = false;
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="w-full">
      {result ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 lg:gap-8 items-start">
          <div className="xl:col-span-5 space-y-3 sm:space-y-4">
            <PalmScanner 
              onAnalyze={handleAnalyze}
              onReset={handleReset}
              isAnalyzing={isAnalyzing} 
              result={result} 
            />
          </div>
          <div className="xl:col-span-7">
            <PalmResults result={result} />
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-3 sm:space-y-4">
        <PalmScanner 
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          isAnalyzing={isAnalyzing} 
          result={result} 
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center text-sm shadow-sm" role="alert" aria-live="assertive">
            {error === 'QUOTA' ? (
              <div className="flex flex-col items-center gap-3">
                <p>ระบบมีผู้ใช้งานจำนวนมากในขณะนี้ กรุณารอสักครู่แล้วลองใหม่</p>
                <button
                  onClick={() => setError(null)}
                  disabled={cooldown > 0}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {cooldown > 0 ? `รอสักครู่... (${cooldown}วินาที)` : 'ลองอีกครั้ง'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <p>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            )}
          </div>
        )}

        </div>
      )}
    </section>
  );
}
