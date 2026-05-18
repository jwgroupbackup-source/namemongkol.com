'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { Package, Bitcoin, Zap, ShieldCheck, CheckCircle2, Upload } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPromptPayCheckoutSession, verifyPromptPayTransaction } from '@/app/actions/stripe';
import ManualPaymentModal from '@/components/ManualPaymentModal';


interface PricingTier {
    id: string;
    credits: number;
    price: number;
    name: string;
    description: string;
    popular?: boolean;
    color: string;
}

const fetchTiers = async () => {
    try {
        const res = await fetch('/api/pricing');
        const data = await res.json();
        if (data.success) {
            return data.tiers;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch tiers', error);
        return [];
    }
};

interface TopUpPageProps {
    gateway: string;
    promptpayNumber?: string;
}

export default function TopUpPage({ gateway, promptpayNumber }: TopUpPageProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [tiers, setTiers] = useState<PricingTier[]>([]);

    // State for Modal Logic
    const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
    const [paymentMode] = useState<'stripe' | 'slip2go'>(gateway === 'slip2go' ? 'slip2go' : 'stripe');

    useEffect(() => {
        // Only run Stripe verification if we are in Stripe mode
        if (gateway === 'stripe') {
            const verifyPayment = async () => {
                const status = searchParams.get('payment_status');
                const sessionId = searchParams.get('session_id');
                // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;

                if (status === 'success' && sessionId) {
                    // Remove params immediately to prevent double-firing (though idempotency handles it)
                    // router.replace('/topup'); 
                    // Better to wait for verification so we can show result.

                    Swal.fire({
                        title: 'กำลังตรวจสอบการชำระเงิน...',
                        text: 'กรุณารอสักครู่ ระบบกำลังยืนยันยอดเงินและเติมเครดิต',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    try {
                        const result = await verifyPromptPayTransaction(sessionId);

                        if (result.success) {
                            Swal.fire({
                                title: 'เติมเครดิตสำเร็จ!',
                                text: `คุณได้รับ ${result.credits} เครดิตเรียบร้อยแล้ว`,
                                icon: 'success',
                                confirmButtonText: 'ตกลง',
                                confirmButtonColor: '#10b981',
                            }).then(() => {
                                router.replace('/topup');
                                window.dispatchEvent(new Event('force_credits_update'));
                            });
                        } else {
                            Swal.fire({
                                title: 'เกิดข้อผิดพลาด',
                                text: result.message || 'ไม่สามารถยืนยันการชำระเงินได้',
                                icon: 'error',
                                confirmButtonText: 'ติดต่อเจ้าหน้าที่',
                            });
                        }
                    } catch (error: any) {
                        Swal.fire({
                            title: 'เกิดข้อผิดพลาด',
                            text: error.message,
                            icon: 'error',
                        });
                    }
                } else if (status === 'cancelled') {
                    Swal.fire({
                        title: 'ยกเลิกการชำระเงิน',
                        text: 'คุณได้ยกเลิกการชำระเงิน',
                        icon: 'info',
                        confirmButtonText: 'ตกลง',
                    }).then(() => {
                        router.replace('/topup');
                    });
                }
            };

            verifyPayment();
        }
    }, [searchParams, router, gateway]);

    useEffect(() => {
        const loadTiers = async () => {
            const data = await fetchTiers();
            setTiers(data);
        };
        loadTiers();
    }, []);

    useEffect(() => {
        if (tiers.length === 0) return;

        const plan = searchParams.get('plan')?.toLowerCase();
        const priceParam = searchParams.get('price');
        let preferredTier: PricingTier | undefined;

        if (plan === 'vvip') {
            preferredTier = tiers.find((tier) =>
                tier.price === 599 ||
                tier.id.toLowerCase().includes('vvip') ||
                tier.name.toLowerCase().includes('vvip') ||
                tier.name.toLowerCase().includes('fortune') ||
                tier.name.toLowerCase().includes('whale')
            );
        } else if (priceParam) {
            const price = Number(priceParam);
            if (!Number.isNaN(price)) {
                preferredTier = tiers.find((tier) => tier.price === price);
            }
        }

        if (preferredTier) {
            setSelectedTier(preferredTier);
        }
    }, [tiers, searchParams]);

    const handleSelectTier = async (tier: PricingTier) => {
        if (paymentMode === 'slip2go') {
            setSelectedTier(tier);
            return;
        }

        setIsLoading(true);
        try {
            const result = await createPromptPayCheckoutSession(tier.price, tier.credits, tier.name);
            if (result && result.url) {
                window.location.assign(result.url);
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถสร้างรายการชำระเงินได้',
                icon: 'error',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#ef4444',
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">
            <main className="w-full max-w-[1400px] min-h-screen relative overflow-hidden px-3 sm:px-4 pt-16 md:pt-32 pb-32 md:pb-28">
                {/* Background Decor */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-5xl space-y-5 md:space-y-12 pt-0 md:pt-8">
                    {/* Header */}
                    <div className="text-center space-y-2 md:space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-300 text-xs md:text-sm font-medium">
                            <Zap size={14} className="md:w-4 md:h-4" />
                            <span>Top Up Credits</span>
                        </div>
                        <h1 className="text-[2rem] md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                            เติมเครดิตเพื่อใช้งาน
                        </h1>
                        <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto px-1 sm:px-4 leading-relaxed">
                            เลือกแพ็กเกจเครดิตที่คุ้มค่าสำหรับคุณ เพื่อใช้งานบริการวิเคราะห์ชื่อมงคลขั้นสูงและบริการอื่นๆ
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8 pb-20 md:pb-0">
                        {tiers.length === 0 ? (
                            <div className="col-span-3 text-center py-10 text-slate-400">Loading packages...</div>
                        ) : tiers.map((tier) => (
                            <div
                                key={tier.id}
                                className={`relative group p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[2rem] border transition-all duration-500 md:hover:-translate-y-2 hover:shadow-2xl flex flex-col ${tier.popular
                                    ? 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)] scale-100 md:scale-105 z-10'
                                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                                    }`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1 bg-amber-500 rounded-full text-[#140f0a] text-[10px] md:text-xs font-black tracking-wider uppercase shadow-lg shadow-amber-500/20 flex items-center gap-1.5">
                                        <Package size={10} className="md:w-3 md:h-3" /> BEST SELLER
                                    </div>
                                )}

                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-white mb-2 md:mb-6 shadow-lg`}>
                                    <Bitcoin size={20} className="md:w-7 md:h-7" />
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-lg md:text-xl font-bold text-white">{tier.name}</h3>
                                    <p className="text-slate-400 text-xs md:text-sm">{tier.description}</p>
                                </div>

                                <div className="mt-2 md:mt-4 mb-3 md:mb-8">
                                    <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{tier.price}</span>
                                    <span className="text-slate-500 ml-2 text-sm md:text-lg">baht</span>
                                </div>

                                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8 text-slate-300 font-medium bg-white/5 px-3 sm:px-4 py-3 rounded-xl border border-white/5">
                                    <Zap size={16} className="md:w-5 md:h-5 text-amber-400" />
                                    <span className="text-lg md:text-xl font-bold text-white">{tier.credits}</span> Credits
                                </div>

                                <div className="mt-auto">
                                    {paymentMode === 'stripe' ? (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectTier(tier)}
                                            disabled={isLoading}
                                            className={`w-full min-h-12 py-3 md:py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base ${isLoading
                                                ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                                                : tier.popular
                                                    ? 'bg-amber-500 hover:bg-amber-400 text-[#140f0a] shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            {isLoading ? 'กำลังดำเนินการ...' : 'ซื้อแพ็กเกจ (PromptPay)'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleSelectTier(tier)}
                                            className={`w-full min-h-12 py-3 md:py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base ${tier.popular
                                                ? 'bg-amber-500 hover:bg-amber-400 text-[#140f0a] shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            <Upload size={18} /> แจ้งสลิปโอนเงิน
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Manual Payment Modal */}
                    {selectedTier && paymentMode === 'slip2go' && (
                        <ManualPaymentModal
                            price={selectedTier.price}
                            credits={selectedTier.credits}
                            tierId={selectedTier.id}
                            tierName={selectedTier.name}
                            promptpayNumber={promptpayNumber}
                            onClose={() => setSelectedTier(null)}
                        />
                    )}

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-16 pt-5 md:pt-8 border-t border-white/5 opacity-50">
                        <div className="flex items-center gap-2 md:gap-3 text-slate-400">
                            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                            <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-slate-400">
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                            <span className="text-sm font-medium">Instant Credit</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                            <Package className="w-6 h-6" />
                            <span className="text-sm font-medium">No Expiry (Purchased)</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
