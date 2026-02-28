'use client';

import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function GovernanceDashboard() {
    const { data: logs, isLoading } = useSWR('/api/audit', fetcher);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-gradient mb-3">Security & Governance</h2>
                <p className="text-slate-500 text-lg max-w-2xl font-medium">
                    Organizational transparency, immutable audit logs, and compliance oversight.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 glass-card rounded-[2.5rem] p-10 overflow-hidden relative">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold text-white">System Audit Log</h3>
                        <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold rounded-full border border-teal-500/20 uppercase tracking-widest">
                            Live Feed
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                        {isLoading ? (
                            <p className="text-slate-500 text-sm animate-pulse">Decrypting audit records...</p>
                        ) : logs?.map((log: any) => (
                            <div key={log.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start justify-between gap-6 group hover:bg-white/[0.04] transition-colors">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-bold rounded uppercase tracking-tighter border border-blue-500/20">
                                            {log.action}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-bold">{new Date(log.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 font-medium">
                                        {log.userId ? `User #${log.userId}` : 'System'} modified {log.resource.toLowerCase()}
                                    </p>
                                    {log.details && (
                                        <p className="text-[10px] text-slate-500 mt-2 font-mono bg-black/20 p-2 rounded">
                                            {log.details}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">IP ADRESS</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{log.ipAddress || 'Internal'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-teal-500/10 to-transparent border-teal-500/20">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Compliance Status</h4>
                        <div className="space-y-6">
                            <ComplianceCheck label="Data Portability" description="Users can export or delete their telemetry data." status="Pass" />
                            <ComplianceCheck label="Organization Isolation" description="Strict scoped filtering across all API layers." status="Pass" />
                            <ComplianceCheck label="Immutable Logging" description="Audit records are locked and cannot be modified." status="Pass" />
                            <ComplianceCheck label="PII Scrubbing" description="Sensitive identifiers are removed before aggregation." status="Pending" />
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 bg-black/20">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Export Records</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                            Generate a cryptographically signed CSV of the last 90 days of system activity for regulatory review.
                        </p>
                        <button className="w-full py-3 border border-white/10 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-white/5 transition-all">
                            Generate Security Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ComplianceCheck({ label, description, status }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white">{label}</p>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${status === 'Pass' ? 'bg-teal-500/20 text-teal-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {status}
                </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                {description}
            </p>
        </div>
    );
}
