'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, RefreshCw, ScanLine, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import SvgOverlay from './SvgOverlay';
import { PalmAnalysisResult } from '@/types/palm-analysis';

interface PalmScannerProps {
  onAnalyze: (imageBase64: string) => void;
  onReset?: () => void;
  isAnalyzing: boolean;
  result: PalmAnalysisResult | null;
}

interface PhotoQuality {
  sharpness: number;
  lighting: number;
  contrast: number;
  overall: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toRounded(value: number): number {
  return Math.round(value);
}

function getPhotoQualityFromImageData(imageData: ImageData): PhotoQuality {
  const data = imageData.data;
  const pixelCount = data.length / 4;
  const luminance = new Float32Array(pixelCount);

  let brightnessSum = 0;
  for (let index = 0; index < pixelCount; index++) {
    const base = index * 4;
    const red = data[base];
    const green = data[base + 1];
    const blue = data[base + 2];
    const value = 0.299 * red + 0.587 * green + 0.114 * blue;
    luminance[index] = value;
    brightnessSum += value;
  }

  const width = imageData.width;
  const height = imageData.height;
  const avgBrightness = brightnessSum / pixelCount;

  let varianceSum = 0;
  for (let index = 0; index < pixelCount; index++) {
    const diff = luminance[index] - avgBrightness;
    varianceSum += diff * diff;
  }
  const stdDev = Math.sqrt(varianceSum / pixelCount);

  let edgeSum = 0;
  let edgeCount = 0;
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const currentIndex = y * width + x;
      const rightIndex = currentIndex + 1;
      const downIndex = currentIndex + width;
      const gx = Math.abs(luminance[currentIndex] - luminance[rightIndex]);
      const gy = Math.abs(luminance[currentIndex] - luminance[downIndex]);
      edgeSum += gx + gy;
      edgeCount++;
    }
  }

  const edgeMean = edgeCount > 0 ? edgeSum / edgeCount : 0;
  const lightingScore = clamp(100 - Math.abs(avgBrightness - 145) * 1.3, 0, 100);
  const contrastScore = clamp((stdDev / 64) * 100, 0, 100);
  const sharpnessScore = clamp((edgeMean / 45) * 100, 0, 100);
  const overall = clamp(sharpnessScore * 0.48 + lightingScore * 0.34 + contrastScore * 0.18, 0, 100);

  return {
    sharpness: toRounded(sharpnessScore),
    lighting: toRounded(lightingScore),
    contrast: toRounded(contrastScore),
    overall: toRounded(overall),
  };
}

async function evaluateDataUrlQuality(dataUrl: string): Promise<PhotoQuality> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context error'));
        return;
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(getPhotoQualityFromImageData(imageData));
    };
    image.onerror = () => reject(new Error('Failed to load image for quality check'));
    image.src = dataUrl;
  });
}

function qualityHint(quality: PhotoQuality): string {
  if (quality.overall >= 75) return 'คุณภาพภาพดีมาก เหมาะกับการวิเคราะห์เส้นละเอียด';
  if (quality.overall >= 60) return 'คุณภาพภาพพอใช้ แนะนำเพิ่มแสงหรือถือกล้องให้นิ่งขึ้น';
  return 'คุณภาพภาพยังต่ำ แนะนำเพิ่มแสง วางฝ่ามือเต็มเฟรม และถ่ายมุมตรง';
}

export default function PalmScanner({ onAnalyze, onReset, isAnalyzing, result }: PalmScannerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [liveQuality, setLiveQuality] = useState<PhotoQuality | null>(null);
  const [capturedQuality, setCapturedQuality] = useState<PhotoQuality | null>(null);
  const [processingStep, setProcessingStep] = useState(0);

  const processingStepMessages = [
    'กำลังประมวลผลภาพลายมือ โปรดรอสักครู่...',
    'กำลังวิเคราะห์เส้นลายมือ...',
    'กำลังจัดรูปแบบผลวิเคราะห์...',
  ] as const;

  useEffect(() => {
    if (!isAnalyzing) {
      return;
    }
    const interval = setInterval(() => {
      setProcessingStep((prev) => (prev + 1) % processingStepMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAnalyzing, processingStepMessages.length]);

  const hasLowLineDetail = React.useMemo(() => {
    if (!result) return false;
    const avgLinePoints =
      result.lines.length > 0 ? result.lines.reduce((sum, line) => sum + line.points.length, 0) / result.lines.length : 0;
    const quality = result.image_quality;
    const lowQuality = !!quality && (quality.sharpness < 30 || quality.lighting < 25 || (quality.perspective ?? 65) < 30 || (quality.occlusion ?? 65) < 25);
    return avgLinePoints < 3 || lowQuality;
  }, [result]);

  const hasLowCaptureQuality = !result && !!capturedQuality && capturedQuality.overall < 60;
  const currentStep = isAnalyzing ? 3 : imageSrc ? 2 : 1;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImageSrc(dataUrl);
      setIsCameraOpen(false);
      setCameraError(null);
      setLiveQuality(null);

      evaluateDataUrlQuality(dataUrl)
        .then((quality) => setCapturedQuality(quality))
        .catch(() => setCapturedQuality(null));
    };
    reader.readAsDataURL(file);
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
    setLiveQuality(null);
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง กรุณาใช้อัปโหลดรูปแทน');
      return;
    }

    if (!window.isSecureContext) {
      setCameraError('ไม่สามารถเปิดกล้องได้ในโหมดไม่ปลอดภัย กรุณาเปิดผ่าน HTTPS หรือ localhost');
      return;
    }

    try {
      setCameraError(null);
      stopCamera();

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      setIsCameraOpen(true);
      setImageSrc(null);
      setCapturedQuality(null);
      setLiveQuality(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      const error = err as DOMException;
      if (error?.name === 'NotAllowedError') {
        setCameraError('เบราว์เซอร์ปฏิเสธสิทธิ์กล้อง กรุณาอนุญาต Camera ใน Site Settings แล้วลองใหม่');
      } else if (error?.name === 'NotFoundError') {
        setCameraError('ไม่พบอุปกรณ์กล้องในเครื่อง กรุณาตรวจสอบว่ากล้องพร้อมใช้งาน');
      } else {
        setCameraError('ไม่สามารถเข้าถึงกล้องได้ในขณะนี้ กรุณาลองใหม่ หรือใช้แอปกล้องแทน');
      }
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageSrc(dataUrl);
    setCapturedQuality(liveQuality);
    if (navigator.vibrate) navigator.vibrate(50);
    stopCamera();
  };

  const handleAnalyze = () => {
    if (!imageSrc) return;
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    onAnalyze(imageSrc);
  };

  const reset = () => {
    setImageSrc(null);
    setIsCameraOpen(false);
    setCameraError(null);
    setCapturedQuality(null);
    setLiveQuality(null);
    stopCamera();
    onReset?.();
  };

  React.useEffect(() => {
    if (!isCameraOpen) return;

    const timer = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = 360;
      canvas.height = 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setLiveQuality(getPhotoQualityFromImageData(imageData));
    }, 600);

    return () => {
      window.clearInterval(timer);
    };
  }, [isCameraOpen]);

  React.useEffect(() => {
    if (!isCameraOpen || !videoRef.current || !streamRef.current) return;
    const video = videoRef.current;
    video.srcObject = streamRef.current;

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((error) => {
        console.error('Video play() failed:', error);
      });
    }
  }, [isCameraOpen]);

  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const updateDimensions = () => {
      if (!imageContainerRef.current) return;
      const container = imageContainerRef.current;
      const containerRatio = container.clientWidth / container.clientHeight;
      const imgRatio = img.naturalWidth / img.naturalHeight;

      let renderWidth: number;
      let renderHeight: number;

      if (imgRatio > containerRatio) {
        renderWidth = container.clientWidth;
        renderHeight = container.clientWidth / imgRatio;
      } else {
        renderHeight = container.clientHeight;
        renderWidth = container.clientHeight * imgRatio;
      }

      setImageDimensions({ width: renderWidth, height: renderHeight });
    };

    updateDimensions();
    (window as any)._updatePalmImageDimensions = updateDimensions;
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if ((window as any)._updatePalmImageDimensions) {
        (window as any)._updatePalmImageDimensions();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      delete (window as any)._updatePalmImageDimensions;
    };
  }, [imageSrc]);

  return (
    <section className="w-full max-w-2xl mx-auto bg-gradient-to-b from-[#0a3d2a]/95 via-[#0d4a33]/90 to-[#0a3528]/95 backdrop-blur-md border border-emerald-600/30 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-emerald-900/30 relative overflow-visible sm:overflow-hidden" aria-label="เครื่องมือสแกนลายมือ">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/8 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/8 rounded-full blur-[90px] pointer-events-none" />

      <header className="mb-2 sm:mb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-base sm:text-lg font-bold text-amber-200 flex items-center gap-1.5">
            <ScanLine className="w-4 h-4 text-amber-300" />
            Palm Scanner
          </h2>
          <span className="text-[11px] text-amber-200/70 border border-amber-500/30 bg-amber-500/10 rounded-full px-2 py-0.5 shrink-0">Step {currentStep}/3</span>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
          {[1, 2, 3].map((step) => {
            const active = currentStep >= step;
            return (
              <div key={step} className={`rounded-md border px-1.5 py-1 text-center text-[11px] font-medium transition-colors ${active ? 'border-amber-500/40 bg-gradient-to-r from-amber-600/20 to-amber-500/10 text-amber-200' : 'border-emerald-700/40 bg-emerald-950/40 text-emerald-600'}`}>
                {step === 1 && 'เลือกภาพ'}
                {step === 2 && 'ตรวจคุณภาพ'}
                {step === 3 && 'วิเคราะห์'}
              </div>
            );
          })}
        </div>
      </header>

      <div className="relative w-full min-h-[360px] sm:min-h-0 sm:aspect-[4/5] bg-[#061f16] rounded-xl overflow-hidden border border-emerald-700/30 flex flex-col items-center justify-center mb-2 sm:mb-3">
        {isCameraOpen && (
          <div className="absolute inset-0 z-[1] pointer-events-none">
            {/* Palm outline removed as requested, leaving a clean camera feed */}
          </div>
        )}

        {!imageSrc && !isCameraOpen && (
          <div className="flex flex-col items-center justify-center p-4 sm:p-4 text-center space-y-3 sm:space-y-2.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800/70 to-emerald-900/40 border border-emerald-600/30 flex items-center justify-center shadow-lg shadow-black/20">
              <Upload className="w-8 h-8 text-amber-300/90" />
            </div>
            <p className="text-emerald-50 text-base sm:text-sm font-semibold leading-snug max-w-xs">
              อัปโหลดรูปภาพลายมือของคุณ หรือถ่ายรูปใหม่
            </p>
            <ul className="grid grid-cols-1 gap-1.5 text-amber-200/75 text-[12px] sm:text-[11px] leading-relaxed text-left max-w-xs">
              <li>• ฝ่ามือเต็มเฟรม ไม่ถูกตัดขอบ</li>
              <li>• ภาพไม่เบลอ และมีแสงเพียงพอ</li>
              <li>• มือหงายตรงกับกล้องให้มากที่สุด</li>
            </ul>

            <div className="grid grid-cols-1 sm:flex sm:flex-row gap-2 mt-2 w-full max-w-xs sm:w-auto">
              <label className="cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-lg shadow-amber-500/20 active:scale-[0.98]">
                <Upload className="w-4 h-4" />
                อัปโหลดรูป
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
              <button
                onClick={startCamera}
                className="bg-emerald-800/50 hover:bg-emerald-700/50 text-emerald-100 px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 border border-emerald-600/30 w-full sm:w-auto active:scale-[0.98]"
              >
                <Camera className="w-4 h-4" />
                ถ่ายรูป
              </button>
              <input ref={captureInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
            </div>

            {cameraError && (
              <div className="w-full mt-2 space-y-2">
                <p className="text-xs text-rose-300 leading-relaxed" role="alert">{cameraError}</p>
                <button
                  onClick={() => captureInputRef.current?.click()}
                  className="w-full bg-emerald-800/50 hover:bg-emerald-700/50 text-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-emerald-600/30"
                >
                  ใช้แอปกล้องมือถือแทน
                </button>
              </div>
            )}
          </div>
        )}

        {isCameraOpen && (
          <div className="relative w-full h-full">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Compact quality pill — top-right, minimal space usage */}
            {liveQuality && (
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium border ${
                  liveQuality.overall >= 75
                    ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                    : liveQuality.overall >= 50
                    ? 'bg-amber-950/60 border-amber-500/30 text-amber-300'
                    : 'bg-rose-950/60 border-rose-500/30 text-rose-300'
                }`}>
                  <span className="text-[10px]">📷</span>
                  <span>{liveQuality.overall}%</span>
                  {liveQuality.overall >= 75 && <CheckCircle2 className="w-3 h-3" />}
                </div>
              </div>
            )}

            {/* Bottom controls — capture button centered, cancel on right */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              {/* Instruction hint — merged into bottom bar */}
              <div className="text-center mb-3 pointer-events-none">
                <span className="text-amber-300/80 text-[11px] font-medium">
                  🖐️ ถ่ายให้เห็นฝ่ามือชัดเจน • หงายมือขึ้น
                </span>
              </div>

              <div className="flex items-center justify-center gap-6 pb-4 px-4">
                {/* Spacer for centering */}
                <div className="w-12" />

                {/* Capture button */}
                <button
                  onClick={captureImage}
                  className="w-16 h-16 bg-white rounded-full border-[3px] border-amber-400/60 flex items-center justify-center shadow-lg shadow-black/30 hover:scale-105 active:scale-90 transition-transform"
                  title={liveQuality ? qualityHint(liveQuality) : 'ถ่ายภาพ'}
                >
                  <div className="w-12 h-12 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-slate-700" />
                  </div>
                </button>

                {/* Cancel button */}
                <button
                  onClick={stopCamera}
                  className="w-12 h-12 bg-slate-800/80 text-white rounded-full backdrop-blur-sm flex items-center justify-center text-xs font-medium border border-slate-600/50"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {imageSrc && (
          <div ref={imageContainerRef} className="relative w-full h-full flex items-center justify-center bg-black">
            <img src={imageSrc} alt="ภาพฝ่ามือสำหรับการวิเคราะห์" className="max-w-full max-h-full object-contain" onLoad={handleImageLoad} />

            {isAnalyzing && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-20" />}

            {result && result.lines && imageDimensions.width > 0 && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                style={{ width: `${imageDimensions.width}px`, height: `${imageDimensions.height}px` }}
              >
                <SvgOverlay lines={result.lines} width={imageDimensions.width} height={imageDimensions.height} />
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {imageSrc && !isAnalyzing && !result && (
        <>
          {capturedQuality && (
            <div className="mb-2 p-2.5 rounded-lg border border-emerald-700/40 bg-emerald-950/40 text-emerald-100 text-xs sm:text-sm" aria-live="polite">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5">
                  {hasLowCaptureQuality ? <AlertTriangle className="w-3.5 h-3.5 text-amber-300" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                  คุณภาพภาพที่ใช้วิเคราะห์
                </span>
                <span className="font-semibold text-amber-200">{capturedQuality.overall}%</span>
              </div>
              <p className={`mt-0.5 text-[11px] ${hasLowCaptureQuality ? 'text-amber-200' : 'text-emerald-300'}`}>{qualityHint(capturedQuality)}</p>
            </div>
          )}

          <div className="hidden sm:flex gap-2">
            <button
              onClick={reset}
              className="flex-1 bg-emerald-800/40 hover:bg-emerald-700/40 text-emerald-100 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 border border-emerald-600/30"
            >
              <RefreshCw className="w-4 h-4" />
              เปลี่ยนรูป
            </button>
            <button
              onClick={handleAnalyze}
              className="flex-[2] bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-slate-900 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5"
            >
              <ScanLine className="w-4 h-4" />
              เริ่มวิเคราะห์ลายมือ (20 เครดิต)
            </button>
          </div>

          <div className="sm:hidden fixed inset-x-3 bottom-[70px] z-[70]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl p-3 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2">
                <button
                  onClick={reset}
                  className="shrink-0 bg-emerald-900/70 text-emerald-100 px-3 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 border border-emerald-600/30 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  เปลี่ยนรูป
                </button>
                <button
                  onClick={handleAnalyze}
                  className="min-w-0 flex-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 px-3 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <ScanLine className="w-4 h-4 shrink-0" />
                  <span className="truncate">เริ่มวิเคราะห์ (20 เครดิต)</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isAnalyzing && (
        <div
          className="w-full max-w-md mx-auto mb-2 rounded-xl border border-emerald-700/40 bg-emerald-950/50 backdrop-blur p-3 space-y-2.5"
          role="status"
          aria-live="polite"
          aria-label="กำลังประมวลผล"
        >
          <div
            className="w-full h-2 rounded-full bg-emerald-900/60 overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="h-full w-[40%] min-w-[80px] rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-yellow-300 animate-progress-indeterminate"
              aria-hidden="true"
            />
          </div>
          <p className="text-center text-emerald-100 text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 w-full">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-300" aria-hidden="true" />
            {processingStepMessages[processingStep]}
          </p>
        </div>
      )}

      {result && (
        <>
          {hasLowLineDetail && (
            <div className="w-full mt-2 p-2.5 rounded-lg border border-amber-600/40 bg-amber-900/15 text-amber-200 text-xs sm:text-sm text-center">
              ระบบพบว่ารายละเอียดเส้นลายมือยังไม่ชัดพอ แนะนำถ่ายใหม่ในที่แสงสว่างมากขึ้น ให้ฝ่ามือเต็มเฟรม และถือกล้องตรงกับฝ่ามือ
            </div>
          )}

          <button
            onClick={reset}
            className="w-full bg-emerald-800/40 hover:bg-emerald-700/40 text-emerald-100 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 border border-emerald-600/30 mt-2"
          >
            <RefreshCw className="w-4 h-4" />
            วิเคราะห์รูปใหม่
          </button>
        </>
      )}
    </section>
  );
}

// ─── Palm shape guide path (SVG viewBox 300×400) ─────────────────────────────
// Anatomically correct: 5 distinct fingers with rounded tips & visible gaps
const PALM_GUIDE_PATH = [
  // Start at bottom-left of wrist
  'M 100 385',

  // Left wrist & palm side (going up)
  'C 80 368, 58 335, 50 300',
  'C 42 265, 38 235, 38 210',

  // ── THUMB ── extends left and upward
  'C 34 195, 24 170, 20 150',
  'C 15 128, 18 112, 28 105',
  'C 38 98, 48 105, 50 120',
  'C 53 140, 55 160, 58 178',

  // V-web between thumb and index
  'Q 65 198, 76 185',

  // ── INDEX FINGER ── left side up
  'C 74 155, 72 120, 74 85',
  'C 75 60, 80 42, 90 35',
  // Rounded tip
  'Q 98 26, 106 35',
  // Right side down
  'C 112 45, 114 65, 115 90',
  'L 115 150',

  // V-web between index and middle
  'Q 120 162, 128 150',

  // ── MIDDLE FINGER ── tallest, left side up
  'C 127 115, 126 78, 128 45',
  'C 130 22, 136 8, 146 3',
  // Rounded tip
  'Q 152 -2, 158 5',
  // Right side down
  'C 166 14, 170 32, 172 55',
  'L 174 110',
  'L 174 150',

  // V-web between middle and ring
  'Q 180 164, 187 150',

  // ── RING FINGER ── left side up
  'C 186 118, 185 85, 187 55',
  'C 189 38, 195 25, 205 20',
  // Rounded tip
  'Q 213 15, 220 22',
  // Right side down
  'C 227 32, 228 52, 228 75',
  'L 227 120',
  'L 226 150',

  // V-web between ring and pinky
  'Q 232 163, 238 152',

  // ── PINKY FINGER ── left side up
  'C 237 130, 236 108, 238 88',
  'C 240 72, 245 60, 252 55',
  // Rounded tip
  'Q 259 50, 264 57',
  // Right side down
  'C 269 66, 270 80, 269 100',
  'L 267 135',
  'L 265 168',

  // Right side of palm (going down)
  'C 263 205, 260 245, 255 278',
  'C 248 312, 235 345, 215 368',
  'C 200 382, 185 388, 165 390',

  // Bottom of wrist
  'C 145 392, 125 390, 110 387',
  'L 100 385',
  'Z',
].join(' ');
