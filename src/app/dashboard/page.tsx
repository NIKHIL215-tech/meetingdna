'use client';

import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import axios from 'axios';
import Link from 'next/link';
import TeamHealthHeatmap from '@/components/TeamHealthHeatmap';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function DashboardPage() {
    const { data: heatmapData } = useSWR('/api/analytics/heatmap', fetcher);
    const { data: pulse } = useSWR('/api/analytics/pulse', fetcher);
    const { mutate } = useSWRConfig();

    const [syncing, setSyncing] = React.useState(false);

    const triggerSync = async () => {
        setSyncing(true);
        try {
            await axios.post('/api/sync/trigger');
            mutate('/api/analytics/heatmap');
            mutate('/api/analytics/pulse');
        } catch (e) {
            console.error('Sync failed', e);
        } finally {
            setSyncing(false);
        }
    };

    const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const displayDays = [1, 2, 3, 4, 5]; // Mon-Fri for display

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-white mb-3">
                        Organization <span className="text-gradient">Pulse</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium max-w-xl">
                        Universal telemetry correlation across all engineering workstreams.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={triggerSync}
                        disabled={syncing}
                        className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        <div className={`w-1.5 h-1.5 rounded-full bg-teal-500 ${syncing ? 'animate-ping' : 'animate-pulse'}`}></div>
                        {syncing ? 'Syncing...' : 'Live Sync'}
                    </button>
                    <button className="px-6 py-3 bg-brand-primary text-white text-[10px] font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-transform">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Active Series"
                    value={pulse?.activeSeriesCount ?? '--'}
                    trend="+2 this month"
                    color="teal"
                    progress={65}
                />
                <StatCard
                    label="Team Velocity"
                    value={pulse ? `${pulse.teamVelocity}%` : '--'}
                    trend="Stable"
                    color="blue"
                    progress={82}
                />
                <StatCard
                    label="Burnout Risk"
                    value={pulse ? `${pulse.burnoutRisk}%` : '--'}
                    trend="Moderate"
                    color="indigo"
                    progress={35}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Heatmap Section */}
                <div className="xl:col-span-2">
                    <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Weekly Focus Intensity</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Commit Density vs. Meetings</p>
                            </div>
                            <div className="flex gap-2">
                                {['Commits', 'Meetings'].map(l => (
                                    <div key={l} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${l === 'Commits' ? 'bg-teal-400' : 'bg-indigo-400'}`}></div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {displayDays.map((dayIdx) => (
                                <div key={dayIdx} className="flex items-center gap-6">
                                    <div className="w-12 text-[10px] font-black text-slate-600 uppercase tracking-widest">{daysLabels[dayIdx]}</div>
                                    <div className="flex-1">
                                        <TeamHealthHeatmap
                                            data={heatmapData?.matrix?.[dayIdx] || Array(24).fill(0)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-between items-center pt-8 border-t border-white/5">
                            <div className="flex gap-8">
                                <LegendItem label="Focus" color="bg-teal-400/20" />
                                <LegendItem label="Meeting" color="bg-indigo-400/40" />
                                <LegendItem label="Conflict" color="bg-red-400/40" />
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Updated in Real-time</p>
                        </div>
                    </div>
                </div>

                {/* Insights Side Panel */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-10 bg-gradient-to-br from-teal-500/10 to-transparent border-teal-500/20">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]"></span>
                            Strategic Insights
                        </h3>
                        <div className="space-y-6">
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                {pulse?.summarySnippet || "Synthesizing organizational signals..."}
                            </p>
                            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                                <InsightAction label="Optimize Engineering Sync" risk="High Impact" />
                                <InsightAction label="Deep Work Recovery" risk="Low Velocity Area" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-10 border-indigo-500/20 bg-indigo-500/5">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Detected Signals</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Context Switch', 'Silo Risk', 'High Focus', 'Burnout Alert'].map(s => (
                                <span key={s} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 text-[9px] font-bold rounded-xl border border-indigo-500/20 uppercase tracking-tighter">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, color, progress }: { label: string; value: string | number; trend: string; color: string; progress: number }) {
    const colorMap: any = {
        teal: 'from-teal-400 to-teal-600',
        blue: 'from-blue-400 to-blue-600',
        indigo: 'from-indigo-400 to-indigo-600',
    };

    return (
        <div className="glass-card rounded-[2rem] p-8 group relative overflow-hidden transition-all hover:translate-y-[-4px]">
            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-3xl font-black text-white tracking-tight">{value}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest ${color === 'teal' ? 'text-teal-400' : 'text-slate-400'}`}>
                    {trend}
                </div>
            </div>

            <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-1000`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}

function LegendItem({ label, color }: { label: string; color: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${color}`}></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}

function InsightAction({ label, risk }: { label: string; risk: string }) {
    return (
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] cursor-pointer transition-all">
            <div>
                <p className="text-[10px] font-bold text-white mb-0.5">{label}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{risk}</p>
            </div>
            <span className="text-slate-500 group-hover:text-teal-400 transition-colors">→</span>
        </div>
    );
}
