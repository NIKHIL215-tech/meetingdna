import { NextResponse } from 'next/server';
import { getCurrentOrgId } from '@/lib/auth';
import { getMeetingSeries } from '@/lib/services/meeting.service';
import { errorResponse } from '@/lib/errors';

export async function GET() {
    try {
        const orgId = await getCurrentOrgId();
        const series = await getMeetingSeries(orgId);
        return NextResponse.json({ status: 'success', data: series });
    } catch (error) {
        return errorResponse(error);
    }
}
