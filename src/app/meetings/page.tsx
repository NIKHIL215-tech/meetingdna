'use client';

import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function MeetingsPage() {
    const { data: series, error } = useSWR('/api/meetings/series', fetcher);

    if (error) return <div className="text-rose-400 p-10 font-bold glass-card rounded-2xl">Analysis failure: Could not retrieve meeting telemetry.</div>;
    if (!series) return <div className="p-10 text-slate-500 animate-pulse font-medium">Decrypting meeting value scores...</div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-extrabold tracking-tight text-gradient mb-3">Meeting Analytics</h2>
                    <p className="text-slate-500 text-lg max-w-2xl font-medium">
                        Aggregated impact analysis of recurring syncs on engineering output.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort: Impact</div>
                    <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter: All</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {series.map((s: any) => (
                    <div key={s.seriesKey} className="glass-card rounded-[2.5rem] p-10 group relative overflow-hidden hover:border-brand-primary/40 transition-all duration-500">
                        {/* Background Decorative Element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>

                        <div className="relative flex flex-col h-full">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-brand-primary transition-colors">{s.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {s.numOccurrences} Occurrences
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${s.statusLabel === 'High Value' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                                            s.statusLabel === 'Low Value' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                            }`}>
                                            {s.statusLabel}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Impact Score</p>
                                    <p className={`text-4xl font-black ${s.valueScore > 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                                        {s.valueScore > 0 ? '+' : ''}{s.valueScore.toFixed(0)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-5 rounded-3xl bg-black/20 border border-white/5">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Post-Sync Output</p>
                                    <p className="text-xl font-bold text-white">{s.avgPostMeetingCommits.toFixed(1)} <span className="text-xs text-slate-500 font-medium">avg/commits</span></p>
                                </div>
                                <div className="p-5 rounded-3xl bg-black/20 border border-white/5">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Team Baseline</p>
                                    <p className="text-xl font-bold text-white">{s.baselineCommits.toFixed(1)} <span className="text-xs text-slate-500 font-medium">avg/commits</span></p>
                                </div>
                            </div>

                            <div className="mt-auto space-y-6">
                                <div className="p-6 rounded-3xl bg-brand-primary/5 border border-brand-primary/10">
                                    <p className="text-xs text-brand-primary font-black uppercase tracking-[0.2em] mb-3">Strategic Recommendation</p>
                                    <p className="text-slate-200 text-sm leading-relaxed font-medium">"{s.recommendation}"</p>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed italic px-2">
                                    {s.explanation}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend / Info */}
            <div className="p-8 glass-card rounded-3xl border-dashed border-white/10 opacity-60 hover:opacity-100 transition-opacity">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-[0.2em]">Telemetry Methodology</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                    Impact score is derived from the delta between post-meeting commit frequency and the team's 14-day rolling baseline.
                    Scores &gt; +20 indicate high-leverage syncs that unblock production. Scores &lt; -10 suggest cognitive drag or context-switching overhead.
                </p>
            </div>
        </div>
    );
}
