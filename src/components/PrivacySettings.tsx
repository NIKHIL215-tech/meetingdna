'use client';

import React from 'react';
import axios from 'axios';

interface PrivacySettingsProps {
    initialSettings?: {
        privacyEnabled: boolean;
        dataSharingLevel: string;
    };
}

export default function PrivacySettings({ initialSettings }: PrivacySettingsProps) {
    const [enabled, setEnabled] = React.useState(initialSettings?.privacyEnabled || false);
    const [level, setLevel] = React.useState(initialSettings?.dataSharingLevel || 'FULL');
    const [loading, setLoading] = React.useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.post('/api/users/me/privacy', {
                privacyEnabled: enabled,
                dataSharingLevel: level,
            });
            alert('Privacy settings updated successfully.');
        } catch (error) {
            console.error('Failed to update privacy settings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card rounded-[2rem] p-8 space-y-8 h-full">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">Personal Privacy Controls</h3>
                <p className="text-sm text-slate-500 font-medium">Control how your workspace telemetry is used for organizational analytics.</p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                        <p className="text-sm font-bold text-white mb-1">Enhanced Privacy Mode</p>
                        <p className="text-xs text-slate-500">When enabled, your individual metrics are strictly anonymized.</p>
                    </div>
                    <button
                        onClick={() => setEnabled(!enabled)}
                        className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-teal-500' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Sharing Level</p>
                    <div className="grid grid-cols-1 gap-3">
                        <LevelOption
                            selected={level === 'FULL'}
                            value="FULL"
                            label="Standard (Recommended)"
                            description="Contribute to focus heatmaps and burnout risk assessment."
                            onClick={() => setLevel('FULL')}
                        />
                        <LevelOption
                            selected={level === 'AGGREGATED'}
                            value="AGGREGATED"
                            label="Aggregated Only"
                            description="Data is only used for high-level organizational trends."
                            onClick={() => setLevel('AGGREGATED')}
                        />
                        <LevelOption
                            selected={level === 'NONE'}
                            value="NONE"
                            label="Complete Opt-Out (Ghost Mode)"
                            description="Remove all telemetry from organizational intelligence."
                            onClick={() => setLevel('NONE')}
                            warning
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="w-full py-4 bg-brand-primary text-white text-xs font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
                {loading ? 'Saving Changes...' : 'Save Privacy Configuration'}
            </button>
        </div>
    );
}

function LevelOption({ selected, label, description, onClick, warning }: any) {
    return (
        <div
            onClick={onClick}
            className={`p-4 border rounded-2xl cursor-pointer transition-all ${selected
                    ? 'bg-teal-500/10 border-teal-500/50'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
        >
            <div className="flex items-center gap-3 mb-1">
                <div className={`w-3 h-3 rounded-full border-2 ${selected ? 'bg-teal-500 border-teal-500' : 'border-slate-600'}`}></div>
                <p className={`text-sm font-bold ${warning && selected ? 'text-red-400' : 'text-white'}`}>{label}</p>
            </div>
            <p className="text-xs text-slate-500 ml-6">{description}</p>
        </div>
    );
}
