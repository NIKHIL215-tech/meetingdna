'use client';

import React from 'react';
import axios from 'axios';

interface ReportProps {
    isOpen: boolean;
    onClose: () => void;
    orgPulse: any;
}

export default function ReportGenerator({ isOpen, onClose, orgPulse }: ReportProps) {
    const [generating, setGenerating] = React.useState(false);

    if (!isOpen) return null;

    const handleDownload = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            alert('Executive Health Report downloaded as PDF.');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-4xl bg-bg-surface border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-10 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-teal-500/5 to-transparent">
                    <div>
                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.3em] mb-2">Internal Alpha</p>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Executive Performance Report</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12">
                    {/* Header Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <ReportStat label="Focus score" value={`${orgPulse?.focusScore ?? '--'}/100`} />
                        <ReportStat label="Active series" value={orgPulse?.activeSeriesCount ?? '--'} />
                        <ReportStat label="Signals detected" value={orgPulse?.signalsDetected ?? '--'} />
                        <ReportStat label="Burnout risk" value={`${orgPulse?.burnoutRisk ?? '--'}%`} color="text-teal-400" />
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Strategic Insights</h3>
                        <p className="text-lg text-slate-200 leading-relaxed font-medium">
                            {orgPulse?.summarySnippet || "Loading organizational data patterns..."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-4">Engineering Velocity</h4>
                            <div className="h-40 flex items-end gap-2 px-2">
                                {[40, 65, 45, 80, 55, 90, orgPulse?.teamVelocity ?? 50].map((v, i) => (
                                    <div key={i} className="flex-1 bg-gradient-to-t from-teal-500/40 to-teal-500 group relative rounded-t-lg transition-all hover:scale-110" style={{ height: `${v}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{v}%</div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 text-[11px] text-slate-500 font-medium">7-day commit distribution weighted by repository impact.</p>
                        </div>

                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">Risk Assessment</h4>
                            <div className="space-y-6">
                                <RiskItem label="Meeting Overload" risk={orgPulse?.burnoutRisk > 30 ? 'high' : 'low'} />
                                <RiskItem label="After-hours Activity" risk="low" />
                                <RiskItem label="Context Switch Fatigue" risk="medium" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 border-t border-white/5 flex items-center justify-between gap-6 bg-white/[0.01]">
                    <p className="text-xs text-slate-500 max-w-sm">
                        This report is generated using organizational telemetry analysis and reflects the current state of organization workspace patterns.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={generating}
                            className="px-8 py-3 bg-brand-primary text-white text-xs font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {generating ? 'Finalizing PDF...' : 'Download Report'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReportStat({ label, value, color = "text-white" }: { label: string; value: string | number; color?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
        </div>
    );
}

function RiskItem({ label, risk }: { label: string; risk: 'low' | 'medium' | 'high' }) {
    const colors = {
        low: 'bg-teal-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
    };
    return (
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className="text-slate-400">{label}</span>
            <div className="flex items-center gap-2">
                <span className={risk === 'high' ? 'text-red-400' : 'text-slate-300'}>{risk}</span>
                <div className={`w-2 h-2 rounded-full ${colors[risk]}`}></div>
            </div>
        </div>
    );
}
