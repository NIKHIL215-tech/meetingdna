import { NextResponse } from 'next/server';
import { listOrganizations } from '@/lib/services/org.service';
import { errorResponse } from '@/lib/errors';

export async function GET() {
    try {
        const orgs = await listOrganizations();
        return NextResponse.json({ status: 'success', data: orgs });
    } catch (error) {
        return errorResponse(error);
    }
}
