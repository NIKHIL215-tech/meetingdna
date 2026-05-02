import { NextRequest, NextResponse } from 'next/server';
import { getCurrentOrgId } from '@/lib/auth';
import { connectIntegration } from '@/lib/services/org.service';
import { errorResponse } from '@/lib/errors';
import { validateIntegrationProvider } from '@/lib/validators';

export async function POST(req: NextRequest) {
    try {
        const orgId = await getCurrentOrgId();
        const body = await req.json();
        const provider = validateIntegrationProvider(body.provider);
        const result = await connectIntegration(orgId, provider);
        return NextResponse.json({ status: 'success', data: result });
    } catch (error) {
        return errorResponse(error);
    }
}
