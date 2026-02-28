'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Organization {
    id: number;
    name: string;
    slug: string;
}

export function useOrg() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrgs() {
            try {
                const res = await axios.get('/api/organizations');
                setOrgs(res.data);

                const savedOrgId = localStorage.getItem('meetingdna_org_id');
                if (savedOrgId) {
                    const found = res.data.find((o: Organization) => o.id === Number(savedOrgId));
                    if (found) {
                        setCurrentOrg(found);
                    } else {
                        setCurrentOrg(res.data[0]);
                    }
                } else if (res.data.length > 0) {
                    setCurrentOrg(res.data[0]);
                }
            } catch (err) {
                console.error('Failed to fetch organizations', err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrgs();
    }, []);

    const switchOrg = (orgId: number) => {
        const org = orgs.find(o => o.id === orgId);
        if (org) {
            setCurrentOrg(org);
            localStorage.setItem('meetingdna_org_id', String(orgId));
            window.location.reload(); // Refresh to clear existing data states
        }
    };

    return { orgs, currentOrg, switchOrg, loading };
}
