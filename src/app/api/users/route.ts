import { NextResponse } from 'next/server';
import { getCurrentOrgId } from '@/lib/auth';
import { listUsers } from '@/lib/services/user.service';
import { errorResponse } from '@/lib/errors';

export async function GET() {
    try {
        const orgId = await getCurrentOrgId();
        const users = await listUsers(orgId);
        return NextResponse.json({ status: 'success', data: users });
    } catch (error) {
        return errorResponse(error);
    }
}
