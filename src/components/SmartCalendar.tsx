'use client';

import React from 'react';
import axios from 'axios';

interface OptimizationSuggestion {
    id: string;
    meetingTitle: string;
    currentSlot: string;
    suggestedSlot: string;
    impactScore: number;
    reason: string;
}

export default function SmartCalendar() {
    const [suggestions, setSuggestions] = React.useState<OptimizationSuggestion[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [optimizing, setOptimizing] = React.useState<string | null>(null);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            // simulate complex scheduling logic
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSuggestions([
                {
                    id: '1',
                    meetingTitle: 'Frontend Sync',
                    currentSlot: 'Mon 10:00 AM',
                    suggestedSlot: 'Mon 01:30 PM',
                    impactScore: 88,
                    reason: 'Moves meeting out of the primary morning deep-work window for 4 engineers.'
                },
                {
                    id: '2',
                    meetingTitle: 'Architecture Review',
                    currentSlot: 'Tue 02:00 PM',
                    suggestedSlot: 'Tue 04:00 PM',
                    impactScore: 65,
                    reason: 'Consolidates afternoon meetings to create a 3-hour uninterrupted block.'
                }
            ]);
        } catch (e) {
            console.error('Failed to fetch suggestions', e);
        } finally {
            setLoading(false);
        }
    };

    const handleOptimize = async (id: string) => {
        setOptimizing(id);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuggestions(prev => prev.filter(s => s.id !== id));
            alert('Calendar optimized! Meeting rescheduled and participants notified.');
        } finally {
            setOptimizing(null);
        }
    };

    return (
        <div className="glass-card rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] pointer-events-none"></div>

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Schedule Optimization</h3>
                    <p className="text-sm text-slate-500 font-medium">Telemetry-driven calendar optimization to maximize team focus windows.</p>
                </div>
                <button
                    onClick={fetchSuggestions}
                    disabled={loading}
                    className="px-6 py-2.5 bg-white/[0.03] border border-white/10 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50"
                >
                    {loading ? 'Analyzing Slots...' : 'Scan for Conflicts'}
                </button>
            </div>

            <div className="space-y-4">
                {suggestions.length === 0 && !loading && (
                    <div className="py-12 text-center border border-dashed border-white/10 rounded-3xl">
                        <p className="text-sm text-slate-500 font-medium italic">No critical conflicts detected. Calendar is currently optimized for deep work.</p>
                    </div>
                )}

                {suggestions.map((s) => (
                    <div key={s.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.04] transition-colors group">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-white">{s.meetingTitle}</h4>
                                <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-[10px] font-bold rounded uppercase tracking-tighter">
                                    +{s.impactScore}% Flow Impact
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                {s.reason}
                            </p>
                            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                                <span className="text-slate-500 line-through decoration-red-500/50">{s.currentSlot}</span>
                                <span className="text-slate-400">→</span>
                                <span className="text-brand-primary">{s.suggestedSlot}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOptimize(s.id)}
                            disabled={optimizing !== null}
                            className="px-8 py-3 bg-teal-500 text-white text-[11px] font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-teal-500/10 hover:scale-[1.05] transition-transform flex items-center gap-2 group-hover:bg-teal-400"
                        >
                            {optimizing === s.id ? 'Rescheduling...' : 'Apply Optimization'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                Simulated Google Calendar Integrations Active
            </div>
        </div>
    );
}
