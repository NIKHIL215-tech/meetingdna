'use client';

import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import SmartCalendar from '@/components/SmartCalendar';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function PredictivePage() {
    const { data: pulse } = useSWR('/api/analytics/pulse', fetcher);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-gradient mb-3">Predictive Intelligence</h2>
                <p className="text-slate-500 text-lg max-w-2xl font-medium">
                    Forecasting team health and organizational velocity using autonomous telemetry correlation.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Forecast Card */}
                <div className="lg:col-span-1 glass-card rounded-[2.5rem] p-10 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-indigo-500/20">
                    <h3 className="text-lg font-bold text-white mb-6">90-Day Burnout Forecast</h3>
                    <div className="space-y-8">
                        <ForecastMetric label="Current Risk" value={`${pulse?.burnoutRisk ?? '--'}%`} trend="Stable" />
                        <ForecastMetric label="Projected (30d)" value="42%" trend="Rising" color="text-yellow-400" />
                        <ForecastMetric label="Projected (90d)" value="58%" trend="Critical" color="text-red-400" />
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <p className="text-xs text-slate-500 leading-relaxed italic">
                            "Predictive model detects rising meeting density in April. Recommendation: Implement 'Async Fridays' to stabilize focus windows."
                        </p>
                    </div>
                </div>

                {/* Velocity Trend */}
                <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg font-bold text-white">Engineering Velocity Projection</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2"><div className="w-2 h-0.5 bg-teal-500"></div><span className="text-[10px] text-slate-400 font-bold uppercase">Actual</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-0.5 bg-dashed bg-blue-500 border-t border-dashed border-blue-500"></div><span className="text-[10px] text-slate-400 font-bold uppercase">Predicted</span></div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-3 px-4">
                        {[40, 55, 45, 70, 60, 85, 80].map((v, i) => (
                            <div key={i} className="flex-1 bg-teal-500/20 rounded-t-lg relative group transition-all hover:bg-teal-500/40" style={{ height: `${v}%` }}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Week {i + 1}</div>
                            </div>
                        ))}
                        {[75, 70, 65, 60].map((v, i) => (
                            <div key={i} className="flex-1 bg-blue-500/10 border-x border-t border-dashed border-blue-500/30 rounded-t-lg relative group transition-all hover:bg-blue-500/20" style={{ height: `${v}%` }}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Forecast</div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-xs text-slate-500 text-center font-medium">
                        Projected velocity decline correlates with the upcoming 'Q3 Planning' meeting series.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <SmartCalendar />
            </div>
        </div>
    );
}

function ForecastMetric({ label, value, trend, color = "text-white" }: { label: string; value: string; trend: string; color?: string }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</p>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
            </div>
            <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Status</span>
                <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 bg-white/5 rounded ${color === 'text-white' ? 'text-teal-400' : color}`}>{trend}</span>
            </div>
        </div>
    );
}
