import { NextRequest, NextResponse } from 'next/server';
import { setOrgIdCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { orgId } = await req.json();

        if (typeof orgId !== 'number') {
            return NextResponse.json({ error: 'Invalid organization ID' }, { status: 400 });
        }

        await setOrgIdCookie(orgId);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to set organization context' }, { status: 500 });
    }
}
