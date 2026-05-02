import { NextResponse } from 'next/server';
import { getCurrentOrgId } from '@/lib/auth';
import { triggerSync } from '@/lib/services/org.service';
import { errorResponse } from '@/lib/errors';

export async function POST() {
    try {
        const orgId = await getCurrentOrgId();
        const result = await triggerSync(orgId);
        return NextResponse.json({ status: 'success', data: result });
    } catch (error) {
        return errorResponse(error);
    }
}
