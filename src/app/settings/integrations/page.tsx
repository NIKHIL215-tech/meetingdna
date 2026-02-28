'use client';

import React from 'react';
import axios from 'axios';
import PrivacySettings from '@/components/PrivacySettings';
import Link from 'next/link';

const integrations = [
    {
        id: 'github',
        name: 'GitHub',
        description: 'Sync repository commits, pull requests, and code activity.',
        icon: '🐙',
        color: 'from-slate-700 to-slate-900',
    },
    {
        id: 'google-calendar',
        name: 'Google Calendar',
        description: 'Sync meeting schedules, attendee lists, and event metadata.',
        icon: '📅',
        color: 'from-blue-500 to-blue-700',
    },
    {
        id: 'slack',
        name: 'Slack',
        description: 'Analyze communication patterns and team engagement windows.',
        icon: '💬',
        color: 'from-purple-500 to-indigo-600',
    },
];

export default function IntegrationsPage() {
    const [loading, setLoading] = React.useState<string | null>(null);
    const [connected, setConnected] = React.useState<string[]>([]);

    const handleConnect = async (id: string) => {
        setLoading(id);
        try {
            // Simulate OAuth delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            await axios.post('/api/integrations/connect', { provider: id });
            setConnected(prev => [...prev, id]);
        } catch (e) {
            console.error('Failed to connect', e);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-gradient mb-3">Settings & Governance</h2>
                <p className="text-slate-500 text-lg max-w-2xl font-medium">
                    Manage your strategic data pipelines and granular privacy controls.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {integrations.map((item) => (
                            <div key={item.id} className="glass-card rounded-3xl p-8 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>

                                <div className="text-4xl mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                                    {item.description}
                                </p>

                                {connected.includes(item.id) ? (
                                    <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
                                        Active & Synced
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleConnect(item.id)}
                                        disabled={loading !== null}
                                        className="w-full py-3 bg-white/[0.03] border border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-xl uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {loading === item.id ? 'Connecting...' : 'Connect Service'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-2">Enterprise Security</h4>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-xl font-medium">
                                MeetingDNA uses enterprise-grade encryption for all service tokens. Audit logs are maintained for all administrative configuration changes.
                            </p>
                        </div>
                        <Link href="/admin/governance" className="px-8 py-4 bg-teal-500 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform flex items-center gap-2 text-center">
                            View Audit Logs
                        </Link>
                    </div>
                </div>

                <div className="xl:col-span-1">
                    <PrivacySettings />
                </div>
            </div>
        </div>
    );
}
