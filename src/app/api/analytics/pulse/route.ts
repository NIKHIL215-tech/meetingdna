import { NextResponse } from 'next/server';
import { getCurrentOrgId } from '@/lib/auth';
import { getOrgPulse } from '@/lib/services/analytics.service';
import { errorResponse } from '@/lib/errors';

export async function GET() {
    try {
        const orgId = await getCurrentOrgId();
        const pulse = await getOrgPulse(orgId);
        return NextResponse.json({ status: 'success', data: pulse });
    } catch (error) {
        return errorResponse(error);
    }
}
