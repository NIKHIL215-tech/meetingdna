'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingHero() {
    return (
        <section className="relative pt-48 pb-32 px-8 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none blur-3xl"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                        <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Enterprise Analytics v5.0</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Decode the <br />
                        <span className="text-gradient drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">Engineering DNA</span> <br />
                        of your Organization.
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-slate-400 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                        The organizational telemetry layer that correlates every meeting, every commit, and every communication signal into a unified engineering pulse.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
                        <Link href="/dashboard" className="w-full md:w-auto px-10 py-5 bg-teal-500 text-white font-bold rounded-2xl uppercase tracking-widest shadow-2xl shadow-teal-500/40 hover:scale-105 hover:bg-teal-400 transition-all flex items-center justify-center gap-3">
                            Start Tracking Free
                            <span className="text-lg">→</span>
                        </Link>
                        <button className="w-full md:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl uppercase tracking-widest hover:bg-white/10 transition-all">
                            View Roadmap
                        </button>
                    </div>
                </div>

                {/* Animated DNA Telemetry Mockup */}
                <div className="mt-24 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000">
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent z-20"></div>
                    <div className="glass-card rounded-[3rem] p-1 border-white/10 shadow-2xl shadow-teal-500/5 overflow-hidden">
                        <div className="bg-bg-base/80 rounded-[2.8rem] h-[500px] flex items-center justify-center relative overflow-hidden">
                            {/* SVG DNA Helix Animation */}
                            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 400">
                                <DNAHelix color="#2dd4bf" delay={0} />
                                <DNAHelix color="#3b82f6" delay={1} />
                            </svg>

                            <div className="relative z-30 text-center max-w-lg mx-auto">
                                <div className="p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-3xl">
                                    <div className="flex items-center gap-3 mb-6 justify-center">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-base bg-slate-800"></div>)}
                                        </div>
                                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Universal Correlation</span>
                                    </div>
                                    <p className="text-2xl font-black text-white italic leading-tight mb-4">
                                        "Detected 14% implementation drift in Backend Sprint Cycle."
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <div className="px-3 py-1 bg-teal-500/10 rounded-full text-[9px] font-bold text-teal-400 uppercase">Jira</div>
                                        <div className="px-3 py-1 bg-blue-500/10 rounded-full text-[9px] font-bold text-blue-400 uppercase">GitHub</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DNAHelix({ color, delay }: { color: string, delay: number }) {
    return (
        <g stroke={color} strokeWidth="2" fill="none">
            {Array.from({ length: 20 }).map((_, i) => (
                <circle
                    key={i}
                    r="3"
                    fill={color}
                    className="animate-dna"
                    style={{
                        animationDelay: `${i * 0.1 + delay}s`,
                        cx: `${100 + i * 35}`,
                        cy: '200'
                    }}
                >
                    <animate
                        attributeName="cy"
                        values="150;250;150"
                        dur="3s"
                        begin={`${i * 0.1 + delay}s`}
                        repeatCount="indefinite"
                    />
                </circle>
            ))}
        </g>
    );
}
