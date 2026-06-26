'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useCallback } from 'react';
import { Save, Settings, Tag } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { revalidateSettings } from '@/app/actions/revalidateSettings';
import {
    DEFAULT_PALM_SYSTEM_PROMPT,
    DEFAULT_PALM_USER_PROMPT,
    GEMINI_API_KEY_SECRET_KEY,
    PALM_PROMPT_VERSION_KEY,
    PALM_SYSTEM_PROMPT_KEY,
    PALM_USER_PROMPT_KEY,
} from '@/lib/palmPromptDefaults';

export default function AdminSettingsPage() {
    const [gtmId, setGtmId] = useState('');
    const [tiktokPixelId, setTiktokPixelId] = useState('');
    const [facebookPixelId, setFacebookPixelId] = useState('');
    const [promptPayNumber, setPromptPayNumber] = useState('');
    const [geminiApiKeyInput, setGeminiApiKeyInput] = useState('');
    const [hasGeminiApiKey, setHasGeminiApiKey] = useState(false);
    const [isAppSecretsReady, setIsAppSecretsReady] = useState(true);
    const [palmSystemPrompt, setPalmSystemPrompt] = useState(DEFAULT_PALM_SYSTEM_PROMPT);
    const [palmUserPrompt, setPalmUserPrompt] = useState(DEFAULT_PALM_USER_PROMPT);
    const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'slip2go'>('stripe');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const isMissingAppSecretsTableError = (error: any) => {
        const code = typeof error?.code === 'string' ? error.code : '';
        const message = typeof error?.message === 'string' ? error.message.toLowerCase() : '';
        const details = typeof error?.details === 'string' ? error.details.toLowerCase() : '';
        return code === 'PGRST205' || message.includes('app_secrets') || details.includes('app_secrets');
    };

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('key, value')
                .in('key', [
                    'gtm_id',
                    'tiktok_pixel_id',
                    'facebook_pixel_id',
                    'payment_gateway',
                    'promptpay_number',
                    'promptpay_id',
                    'promptpay',
                    'promptpay_phone',
                    'promptpay_account',
                    PALM_SYSTEM_PROMPT_KEY,
                    PALM_USER_PROMPT_KEY,
                    PALM_PROMPT_VERSION_KEY,
                ]);

            if (data) {
                const settingsMap = data.reduce((acc: any, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
                setGtmId(settingsMap['gtm_id'] || '');
                setTiktokPixelId(settingsMap['tiktok_pixel_id'] || '');
                setFacebookPixelId(settingsMap['facebook_pixel_id'] || '');
                setPromptPayNumber(
                    settingsMap['promptpay_number'] ||
                    settingsMap['promptpay_id'] ||
                    settingsMap['promptpay'] ||
                    settingsMap['promptpay_phone'] ||
                    settingsMap['promptpay_account'] ||
                    ''
                );
                setPaymentGateway(settingsMap['payment_gateway'] || 'stripe');
                setPalmSystemPrompt(settingsMap[PALM_SYSTEM_PROMPT_KEY] || DEFAULT_PALM_SYSTEM_PROMPT);
                setPalmUserPrompt(settingsMap[PALM_USER_PROMPT_KEY] || DEFAULT_PALM_USER_PROMPT);
            } else if (error) {
                console.error('Error fetching settings:', error);
            }

            const { data: secretData, error: secretError } = await supabase
                .from('app_secrets')
                .select('key')
                .eq('key', GEMINI_API_KEY_SECRET_KEY)
                .maybeSingle();

            if (secretError) {
                if (isMissingAppSecretsTableError(secretError)) {
                    setIsAppSecretsReady(false);
                    setHasGeminiApiKey(false);
                } else {
                    console.error('Error checking Gemini API key status:', secretError);
                }
            } else {
                setIsAppSecretsReady(true);
                setHasGeminiApiKey(Boolean(secretData?.key));
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async () => {
        const Swal = (await import('sweetalert2')).default;
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const updates = [
                { key: 'gtm_id', value: gtmId, description: 'Google Tag Manager Container ID', updated_by: user?.id },
                { key: 'tiktok_pixel_id', value: tiktokPixelId, description: 'TikTok Pixel ID', updated_by: user?.id },
                { key: 'facebook_pixel_id', value: facebookPixelId, description: 'Facebook Pixel ID', updated_by: user?.id },
                { key: 'promptpay_number', value: promptPayNumber, description: 'PromptPay ID/Phone for Manual Transfer', updated_by: user?.id },
                { key: 'promptpay_id', value: promptPayNumber, description: 'PromptPay ID/Phone for Manual Transfer (legacy)', updated_by: user?.id },
                { key: 'promptpay', value: promptPayNumber, description: 'PromptPay ID/Phone for Manual Transfer (legacy)', updated_by: user?.id },
                { key: 'payment_gateway', value: paymentGateway, description: 'Active Payment Gateway (stripe/slip2go)', updated_by: user?.id },
                { key: PALM_SYSTEM_PROMPT_KEY, value: palmSystemPrompt.trim(), description: 'Palm Analysis Gemini system instruction', updated_by: user?.id },
                { key: PALM_USER_PROMPT_KEY, value: palmUserPrompt.trim(), description: 'Palm Analysis Gemini user prompt template', updated_by: user?.id },
                { key: PALM_PROMPT_VERSION_KEY, value: String(Date.now()), description: 'Palm Analysis prompt cache-busting version', updated_by: user?.id },
            ];

            const { error } = await supabase
                .from('app_settings')
                .upsert(updates);

            if (error) throw error;
            await revalidateSettings();

            const newGeminiApiKey = geminiApiKeyInput.trim();
            if (newGeminiApiKey) {
                if (!isAppSecretsReady) {
                    throw new Error('ยังไม่ได้สร้างตาราง app_secrets กรุณารันไฟล์ src/data/create_app_secrets.sql ก่อน');
                }

                const { error: secretUpsertError } = await supabase
                    .from('app_secrets')
                    .upsert([
                        {
                            key: GEMINI_API_KEY_SECRET_KEY,
                            value: newGeminiApiKey,
                            description: 'Gemini API key for palm analysis',
                            updated_by: user?.id,
                        }
                    ]);

                if (secretUpsertError) throw secretUpsertError;
                setHasGeminiApiKey(true);
                setGeminiApiKeyInput('');
            }

            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: 'อัปเดตการตั้งค่าเรียบร้อยแล้ว',
                timer: 1500,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff'
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message,
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleResetPalmPrompts = async () => {
        // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;

        const result = await Swal.fire({
            title: 'รีเซ็ต Prompt?',
            text: 'ต้องการรีเซ็ต Palm System Prompt และ User Prompt กลับค่าเริ่มต้นหรือไม่',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'รีเซ็ต',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#f59e0b',
            background: '#1e293b',
            color: '#fff'
        });

        if (!result.isConfirmed) return;

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const promptUpdates = [
                { key: PALM_SYSTEM_PROMPT_KEY, value: DEFAULT_PALM_SYSTEM_PROMPT, description: 'Palm Analysis Gemini system instruction', updated_by: user?.id },
                { key: PALM_USER_PROMPT_KEY, value: DEFAULT_PALM_USER_PROMPT, description: 'Palm Analysis Gemini user prompt template', updated_by: user?.id },
                { key: PALM_PROMPT_VERSION_KEY, value: String(Date.now()), description: 'Palm Analysis prompt cache-busting version', updated_by: user?.id },
            ];

            const { error } = await supabase
                .from('app_settings')
                .upsert(promptUpdates);

            if (error) throw error;
            await revalidateSettings();

            setPalmSystemPrompt(DEFAULT_PALM_SYSTEM_PROMPT);
            setPalmUserPrompt(DEFAULT_PALM_USER_PROMPT);

            Swal.fire({
                icon: 'success',
                title: 'รีเซ็ตสำเร็จ',
                text: 'ระบบบันทึก Default Prompt เรียบร้อยและมีผลทันที',
                timer: 1800,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff'
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'รีเซ็ตไม่สำเร็จ',
                text: error.message,
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Settings className="text-emerald-500" />
                        ตั้งค่าระบบ (System Settings)
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">จัดการค่าต่างๆ ของระบบเว็บไซต์</p>
                </header>

                {/* Settings Card */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm space-y-8">

                    {/* Payment Gateway Setting */}
                    <div className="flex flex-col md:flex-row gap-6 border-b border-slate-800 pb-8">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Payment Gateway</h3>
                            </div>
                            <p className="text-sm text-slate-400">เลือกระบบชำระเงินหลักที่ต้องการใช้งานในหน้าเติมเครดิต</p>
                        </div>
                        <div className="md:w-2/3">
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                Active Gateway
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentGateway('stripe')}
                                    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentGateway === 'stripe'
                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                        : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="font-bold flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${paymentGateway === 'stripe' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                                        Stripe (PromptPay)
                                    </div>
                                    <span className="text-xs opacity-70">ระบบอัตโนมัติ 100%</span>
                                </button>

                                <button
                                    onClick={() => setPaymentGateway('slip2go')}
                                    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentGateway === 'slip2go'
                                        ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10'
                                        : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="font-bold flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${paymentGateway === 'slip2go' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-600'}`} />
                                        Slip2Go (Manual)
                                    </div>
                                    <span className="text-xs opacity-70">แนบสลิป (กึ่งอัตโนมัติ)</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Google Tag Manager */}
                    <div className="flex flex-col md:flex-row gap-6 border-b border-slate-800 pb-8">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                    <Tag size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">Google Tag Manager</h3>
                            </div>
                            <p className="text-sm text-slate-400">จัดการ GTM Container ID สำหรับการติดตามและวัดผลเว็บไซต์</p>
                        </div>
                        <div className="md:w-2/3">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                GTM ID
                            </label>
                            <input
                                type="text"
                                value={gtmId}
                                onChange={(e) => setGtmId(e.target.value)}
                                placeholder="GTM-XXXXXXX"
                                disabled={loading}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Facebook Pixel */}
                    <div className="flex flex-col md:flex-row gap-6 border-b border-slate-800 pb-8">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Facebook Pixel</h3>
                            </div>
                            <p className="text-sm text-slate-400">ใส่ Facebook Pixel ID เพื่อติดตาม Conversion จาก Facebook Ads</p>
                        </div>
                        <div className="md:w-2/3">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Pixel ID
                            </label>
                            <input
                                type="text"
                                value={facebookPixelId}
                                onChange={(e) => setFacebookPixelId(e.target.value)}
                                placeholder="XXXXXXXXXXXXXXX"
                                disabled={loading}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* TikTok Pixel */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-white">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12-1.07-1.35 1.05 16.32-6.57 15.68-7.98-.35-9.33-9.58-1.74-13.43 1.76-.89 3.8-.84 5.5.09v4.2c-.37-.18-.76-.32-1.17-.38-.8-.13-1.61-.01-2.33.34-1.25.61-1.99 1.95-1.84 3.33.15 1.35 1.13 2.51 2.44 2.87 1.71.49 3.55-.41 4.13-2.09.02-.45.03-.91.03-1.36V.02z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">TikTok Pixel</h3>
                            </div>
                            <p className="text-sm text-slate-400">ใส่ TikTok Pixel ID เพื่อติดตามผลลัพธ์จาก TikTok Ads</p>
                        </div>
                        <div className="md:w-2/3">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Pixel ID
                            </label>
                            <input
                                type="text"
                                value={tiktokPixelId}
                                onChange={(e) => setTiktokPixelId(e.target.value)}
                                placeholder="XXXXXXXXXXXXXXX"
                                disabled={loading}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* PromptPay Number */}
                    <div className="flex flex-col md:flex-row gap-6 border-t border-slate-800 pt-8">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">PromptPay Number</h3>
                            </div>
                            <p className="text-sm text-slate-400">หมายเลขพร้อมเพย์สำหรับโอนแบบแนบสลิป (Slip2Go)</p>
                        </div>
                        <div className="md:w-2/3">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                PromptPay ID / เบอร์โทรศัพท์
                            </label>
                            <input
                                type="text"
                                value={promptPayNumber}
                                onChange={(e) => setPromptPayNumber(e.target.value)}
                                placeholder="089xxxxxxx หรือ เลขบัตร/PromptPay ID"
                                disabled={loading}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Palm Analysis Prompt Settings */}
                    <div className="flex flex-col md:flex-row gap-6 border-t border-slate-800 pt-8">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M12 2v20" />
                                        <path d="M5 7h14" />
                                        <path d="M5 12h14" />
                                        <path d="M5 17h14" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Palm Analysis Prompt</h3>
                            </div>
                            <p className="text-sm text-slate-400">จัดการ Prompt ที่ส่งให้ Gemini สำหรับหน้า /palm-analysis (บันทึกแล้วมีผลทันที)</p>
                        </div>
                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">System Prompt</label>
                                <textarea
                                    rows={12}
                                    value={palmSystemPrompt}
                                    onChange={(e) => setPalmSystemPrompt(e.target.value)}
                                    disabled={loading}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all text-sm font-mono placeholder:text-slate-600"
                                />
                                <p className="text-xs text-slate-500 mt-1">ขั้นต่ำแนะนำ 200 ตัวอักษร เพื่อให้ API ใช้ prompt นี้แทน fallback</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">User Prompt Template</label>
                                <textarea
                                    rows={4}
                                    value={palmUserPrompt}
                                    onChange={(e) => setPalmUserPrompt(e.target.value)}
                                    disabled={loading}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all text-sm font-mono placeholder:text-slate-600"
                                />
                                <p className="text-xs text-slate-500 mt-1">ขั้นต่ำแนะนำ 20 ตัวอักษร เพื่อให้ API ใช้ prompt นี้แทน fallback</p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleResetPalmPrompts}
                                    disabled={loading || saving}
                                    className="px-4 py-2 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    รีเซ็ตกลับค่า Default Prompt
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Gemini API Key (Secret) */}
                    <div className="flex flex-col md:flex-row gap-6 border-t border-slate-800 pt-8">
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Gemini API Key</h3>
                            </div>
                            <p className="text-sm text-slate-400">จัดการคีย์ Gemini จากจุดเดียว (เก็บในตาราง secret แยกจาก app_settings)</p>
                            <p className="text-xs mt-2">
                                {hasGeminiApiKey ? (
                                    <span className="text-emerald-400">สถานะ: ตั้งค่าแล้ว</span>
                                ) : (
                                    <span className="text-amber-400">สถานะ: ยังไม่ได้ตั้งค่า</span>
                                )}
                            </p>
                        </div>
                        <div className="md:w-2/3">
                            {!isAppSecretsReady && (
                                <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                                    ยังไม่พบตาราง <span className="font-mono">app_secrets</span> — กรุณารันไฟล์ <span className="font-mono">src/data/create_app_secrets.sql</span> ก่อนใช้งานส่วนนี้
                                </div>
                            )}
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                New GEMINI_API_KEY (เว้นว่างหากไม่เปลี่ยน)
                            </label>
                            <input
                                type="password"
                                value={geminiApiKeyInput}
                                onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                                placeholder="วาง Gemini API Key ใหม่ที่นี่"
                                disabled={loading || !isAppSecretsReady}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-all font-mono placeholder:text-slate-600"
                            />
                            <p className="text-xs text-slate-500 mt-1">บันทึกพร้อมปุ่ม “บันทึกข้อมูลทั้งหมด” ด้านล่าง และจะไม่แสดงค่าเดิมบนหน้าจอ</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving || loading}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                    <span>กำลังบันทึก...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>บันทึกข้อมูลทั้งหมด</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
