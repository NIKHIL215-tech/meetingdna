'use client';

import React from 'react';

const features = [
    {
        title: 'Meeting Analysis',
        description: 'Auto-calculate the real ROI of every sync by correlating discussion topics with downstream production commits.',
        icon: '📊',
        color: 'from-teal-500/20 to-teal-500/5'
    },
    {
        title: 'Predictive Fatigue',
        description: 'Advanced physiological modeling to detect burnout risk before users even realize they are overextended.',
        icon: '🧠',
        color: 'from-blue-500/20 to-blue-500/5'
    },
    {
        title: 'Schedule Optimization',
        description: 'Automated calendar optimization. Reposition meetings into low-productivity slots to protect developer deep-work.',
        icon: '🗓️',
        color: 'from-indigo-500/20 to-indigo-500/5'
    },
    {
        title: 'Governance & Privacy',
        description: 'Enterprise-grade transparency with immutable audit logs and granular user-level telemetry opt-out controls.',
        icon: '🛡️',
        color: 'from-slate-500/20 to-slate-500/5'
    }
];

export default function FeatureShowcase() {
    return (
        <section id="features" className="py-32 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
                    <div>
                        <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-widest mb-4">Core Platform</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                            High-Resolution <br />
                            <span className="text-gradient">Team Insight.</span>
                        </h3>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
                            We bridge the gap between human interaction and technical output. By mining the "DNA" of your organization's work patterns, MeetingDNA provides a high-fidelity map of your team's health and velocity.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Latency', value: '<2ms' },
                            { label: 'Security', status: 'SOC2 Ready' },
                            { label: 'Uptime', value: '99.99%' },
                            { label: 'RAG', status: 'Active' },
                        ].map((stat, i) => (
                            <div key={i} className="p-8 border border-white/5 rounded-3xl bg-white/[0.02]">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-xl font-black text-white">{stat.value || stat.status}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="glass-card rounded-[2.5rem] p-10 group relative hover:translate-y-[-12px] hover:rotate-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                            style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]`}></div>
                            <div className="text-5xl mb-8 relative z-10 filter group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all">{f.icon}</div>
                            <h4 className="text-xl font-bold text-white mb-4 relative z-10">{f.title}</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed relative z-10 group-hover:text-slate-300 transition-colors">
                                {f.description}
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10 group-hover:text-teal-400 transition-colors flex items-center gap-2">
                                Explore Capability
                                <span className="translate-x-0 group-hover:translate-x-2 transition-transform">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
