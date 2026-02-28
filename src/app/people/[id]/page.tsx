'use client';

import { use, useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PersonDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const { data, error } = useSWR(`/api/users/${params.id}/stats`, fetcher);

    const [messages, setMessages] = useState<any[]>([
        { type: 'insight', text: "Hello! I've analyzed your performance telemetry. What specific metrics should we deep-dive into today?" }
    ]);
    const [coachInput, setCoachInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    if (error) return <div className="text-rose-400 p-10 glass-card rounded-3xl">Telemetry Link Failure: Failed to synchronize user telemetry.</div>;
    if (!data) return <div className="p-10 text-slate-500 animate-pulse font-black text-xl text-center">Loading Performance Profile...</div>;

    const { user, stats, performanceSummary } = data;

    const commitsChartData = stats.commitsByHour.map((count: number, hour: number) => ({
        hour: `${hour}:00`,
        commits: count
    }));

    const meetingsChartData = Object.entries(stats.meetingHoursPerDay).map(([day, hours]: [string, any]) => ({
        name: WEEKDAYS[Number(day)],
        hours: hours
    }));

    const handleChat = async () => {
        if (!coachInput.trim() || isTyping) return;

        const userMsg = coachInput;
        setCoachInput('');
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setIsTyping(true);

        try {
            const res = await axios.post('/api/analytics/coach', {
                message: userMsg,
                history: messages.slice(-5), // contextual window
                stats,
                userName: user.name
            });
            setMessages(prev => [...prev, { type: 'insight', text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { type: 'insight', text: "I'm experiencing a telemetry sync delay. Please try again in a moment." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center font-black text-4xl text-white shadow-2xl">
                        {user.name[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-5xl font-black text-gradient">{user.name}</h2>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${stats.burnoutFlag ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                                }`}>
                                {stats.burnoutFlag ? 'Burnout Risk: High' : 'Status: Optimal'}
                            </span>
                        </div>
                        <p className="text-slate-500 text-lg font-bold uppercase tracking-widest">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <MiniStat label="Total Commits" value={stats.totalCommits} />
                    <MiniStat label="Meeting Time" value={`${stats.totalMeetingHours.toFixed(1)}h`} />
                    <MiniStat label="Velocity" value="High" />
                    <MiniStat label="Advocate" value="Expert" />
                </div>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-10">
                <div className="2xl:col-span-2 space-y-10">
                    <div className="glass-card rounded-[3rem] p-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <div className="w-40 h-40 rounded-full bg-brand-primary"></div>
                        </div>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-white mb-1">Production Rhythm</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Hourly Commit Heat-wave</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-brand-primary">Peak: {Math.max(...stats.commitsByHour)} commits/h</p>
                            </div>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={commitsChartData}>
                                    <defs>
                                        <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="hour" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', padding: '12px' }}
                                        itemStyle={{ color: '#2dd4bf', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="commits" stroke="#2dd4bf" strokeWidth={4} fillOpacity={1} fill="url(#colorCommits)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="glass-card rounded-[3rem] p-10">
                            <h3 className="text-xl font-black text-white mb-2">Cognitive Load</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-10">Weekly Meeting Hours</p>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={meetingsChartData}>
                                        <XAxis dataKey="name" stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                                            {meetingsChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.hours > 4 ? '#f43f5e' : '#3b82f6'} fillOpacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-card rounded-[3rem] p-10 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                <h3 className="text-xl font-black text-white">Performance Insight</h3>
                            </div>
                            <div className="space-y-6">
                                {performanceSummary?.map((bullet: string, idx: number) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500/40 group-hover:bg-indigo-400 transition-colors shrink-0"></div>
                                        <p className="text-slate-300 text-sm leading-relaxed font-medium capitalize">{bullet}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-full min-h-[600px]">
                    <div className="glass-card rounded-[3rem] p-10 bg-bg-surface flex-1 flex flex-col border-brand-secondary/20 shadow-2xl shadow-indigo-500/5">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-white">Performance Coach <span className="text-indigo-400">Analytics</span></h3>
                            <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-400 uppercase tracking-widest border border-indigo-500/20">Active Session</div>
                        </div>

                        <div className="flex-1 space-y-6 mb-10 overflow-y-auto pr-4 scrollbar-hide">
                            {messages.map((m, idx) => (
                                <CoachMessage
                                    key={idx}
                                    type={m.type}
                                    text={m.text}
                                />
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-indigo-600/10 text-slate-500 border border-indigo-500/10 p-4 rounded-3xl text-xs animate-pulse">
                                        Calculating insights...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask the Performance Coach..."
                                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-colors"
                                value={coachInput}
                                onChange={(e) => setCoachInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                            />
                            <button
                                onClick={handleChat}
                                disabled={isTyping}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                ↑
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="glass-card rounded-2xl p-4 min-w-[120px]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black text-white">{value}</p>
        </div>
    );
}

function CoachMessage({ type, text }: { type: 'insight' | 'user', text: string }) {
    return (
        <div className={`flex ${type === 'insight' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${type === 'insight' ? 'bg-indigo-600/10 text-slate-200 border border-indigo-500/10' : 'bg-brand-primary/10 text-white border border-brand-primary/10'
                }`}>
                {text}
            </div>
        </div>
    );
}
