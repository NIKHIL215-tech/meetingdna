'use client';

import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function PeoplePage() {
    const { data: users, error } = useSWR('/api/users', fetcher);

    if (error) return <div className="text-rose-400 p-10 glass-card rounded-3xl">Directory Error: Access to team telemetry denied.</div>;
    if (!users) return <div className="p-10 text-slate-500 animate-pulse font-bold">Scanning team signatures...</div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-extrabold tracking-tight text-gradient mb-3">Team Performance</h2>
                    <p className="text-slate-500 text-lg max-w-2xl font-medium">
                        Strategic distribution and cognitive load monitoring for the engineering org.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{users.length} Active Contributors</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((user: any) => (
                    <Link
                        key={user.id}
                        href={`/people/${user.id}`}
                        className="group glass-card rounded-[2.5rem] p-10 relative overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-teal-500/10"
                    >
                        {/* Visual Accents */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                                <span className="text-3xl font-black text-white">{user.name[0]}</span>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-bg-surface border border-brand-primary/20 flex items-center justify-center p-1.5">
                                    <div className="w-full h-full rounded-full bg-teal-500 animate-pulse"></div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2 group-hover:text-brand-primary transition-colors">{user.name}</h3>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-8">{user.email}</p>

                            <div className="w-full pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xs font-bold text-teal-400">Peak Focus</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Impact</p>
                                    <p className="text-xs font-bold text-white">High</p>
                                </div>
                            </div>

                            <div className="mt-10 w-full">
                                <div className="py-3 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-bold text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                    View Performance Report
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
