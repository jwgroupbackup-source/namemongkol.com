'use client';

import React, { useState } from 'react';
import { Check, Zap, Code2, Shield, Terminal, ArrowRight } from 'lucide-react';

export default function DevPricingDemo() {
    const [annual, setAnnual] = useState(true);

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-cyan-500/30">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/5 blur-[120px]" />
                <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-violet-500/5 blur-[100px]" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
                        <Terminal size={14} />
                        Pricing for Builders
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                        Ship faster. <br className="hidden md:block" />
                        <span className="text-zinc-500">Scale infinitely.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                        A transparent, predictable pricing model designed for developers and modern engineering teams. No surprise bills.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 pt-8">
                        <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
                        <button 
                            onClick={() => setAnnual(!annual)}
                            className="relative w-14 h-8 rounded-full bg-zinc-800 border border-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 ${annual ? 'translate-x-6 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : ''}`} />
                        </button>
                        <span className={`text-sm font-medium flex items-center gap-2 ${annual ? 'text-white' : 'text-zinc-500'}`}>
                            Annually <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">Save 20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
                    
                    {/* Hobby Tier */}
                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] transition-colors">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2">Hobby</h3>
                            <p className="text-sm text-zinc-400 h-10">Perfect for side projects and indie hackers.</p>
                            <div className="mt-6">
                                <span className="text-4xl font-black text-white tracking-tighter">$0</span>
                                <span className="text-zinc-500 font-medium">/mo</span>
                            </div>
                        </div>
                        <button className="w-full py-3 mb-8 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors border border-white/5">
                            Start for free
                        </button>
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Includes</p>
                            <ul className="space-y-3">
                                {['10,000 API requests/mo', '1 GB Database Storage', 'Community Support', 'Shared infrastructure'].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <Check size={16} className="text-zinc-600 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Pro Tier (Accentuated) */}
                    <div className="relative p-8 rounded-[2rem] bg-cyan-500/5 border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.05)] md:-mt-4 z-10">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-400 rounded-full text-zinc-950 text-xs font-bold tracking-wide uppercase shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <Zap size={18} className="text-cyan-400" /> Pro
                            </h3>
                            <p className="text-sm text-cyan-100/50 h-10">For scaling startups and production apps.</p>
                            <div className="mt-6 flex items-baseline">
                                <span className="text-5xl font-black text-white tracking-tighter">${annual ? '49' : '59'}</span>
                                <span className="text-cyan-500 font-medium ml-1">/mo</span>
                            </div>
                        </div>
                        <button className="w-full py-3 mb-8 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold transition-colors shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            Start free 14-day trial
                        </button>
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-cyan-500/50 uppercase tracking-wider">Everything in Hobby, plus</p>
                            <ul className="space-y-3">
                                {['1,000,000 API requests/mo', '50 GB Database Storage', 'Priority Email Support', 'Dedicated execution context', 'Custom domains'].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-200">
                                        <Check size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] transition-colors">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <Shield size={18} className="text-zinc-500" /> Enterprise
                            </h3>
                            <p className="text-sm text-zinc-400 h-10">Custom infrastructure for large-scale operations.</p>
                            <div className="mt-6">
                                <span className="text-4xl font-black text-white tracking-tighter">Custom</span>
                            </div>
                        </div>
                        <button className="w-full py-3 mb-8 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors border border-white/5 flex items-center justify-center gap-2 group">
                            Contact Sales <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Everything in Pro, plus</p>
                            <ul className="space-y-3">
                                {['Unlimited API requests', 'Custom Storage Limits', '24/7 Phone Support', 'SSO / SAML', 'SLA Guarantees', 'On-premise deployment options'].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <Check size={16} className="text-zinc-600 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Developer Focus Section */}
                <div className="mt-32 p-1 border border-white/5 bg-white/[0.01] rounded-3xl overflow-hidden">
                    <div className="bg-zinc-950/50 backdrop-blur-xl p-8 md:p-12 rounded-[1.3rem] border border-white/5">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold tracking-wide uppercase mb-6">
                                    <Code2 size={14} /> Built for engineers
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tight mb-4">No vendor lock-in. <br/> Just clean APIs.</h2>
                                <p className="text-zinc-400 leading-relaxed mb-8">
                                    Our platform integrates seamlessly with your existing stack. Write code, push to deploy, and let us handle the infrastructure scaling.
                                </p>
                                <div className="flex gap-4">
                                    <button className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-lg transition-colors">
                                        Read the Docs
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 font-mono text-sm shadow-2xl relative">
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                </div>
                                <div className="pt-8 text-zinc-300 space-y-2">
                                    <p><span className="text-pink-400">import</span> {'{'} Client {'}'} <span className="text-pink-400">from</span> <span className="text-emerald-400">'@devtool/sdk'</span>;</p>
                                    <br/>
                                    <p><span className="text-pink-400">const</span> db = <span className="text-pink-400">new</span> <span className="text-cyan-400">Client</span>({'{'} apiKey: process.env.API_KEY {'}'});</p>
                                    <br/>
                                    <p><span className="text-zinc-500">// Initialize connection instantly</span></p>
                                    <p><span className="text-pink-400">await</span> db.<span className="text-cyan-400">connect</span>();</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
