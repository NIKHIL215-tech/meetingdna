'use client';

import React from 'react';
import useSWR, { mutate } from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function OrgSwitcher() {
    const { data: orgs } = useSWR('/api/organizations', fetcher);

    // Get current org from cookie (simple way for client-side)
    const [currentOrgId, setCurrentOrgId] = React.useState<number | null>(null);

    React.useEffect(() => {
        const match = document.cookie.match(/meetingdna-org-id=(\d+)/);
        if (match) {
            setCurrentOrgId(parseInt(match[1], 10));
        }
    }, []);

    const handleOrgChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const orgId = parseInt(e.target.value, 10);
        try {
            await axios.post('/api/auth/org', { orgId });
            setCurrentOrgId(orgId);
            // Force refresh data across the app
            mutate(() => true);
            // Full reload to ensure layout and all server components pick up the change
            window.location.reload();
        } catch (error) {
            console.error('Failed to switch organization', error);
        }
    };

    if (!orgs) return null;

    return (
        <div className="relative group">
            <label className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-2 block">
                Organization Context
            </label>
            <select
                value={currentOrgId || ''}
                onChange={handleOrgChange}
                className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-teal-500/50 appearance-none cursor-pointer transition-all hover:bg-white/[0.05]"
            >
                <option value="" disabled className="bg-bg-surface text-slate-500">Select Organization</option>
                {orgs.map((org: any) => (
                    <option key={org.id} value={org.id} className="bg-bg-surface text-slate-100">
                        {org.name}
                    </option>
                ))}
            </select>
            <div className="absolute right-4 bottom-3.5 pointer-events-none text-slate-500 group-hover:text-teal-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </div>
    );
}
