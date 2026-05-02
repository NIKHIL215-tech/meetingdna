import { NextRequest, NextResponse } from 'next/server';
import { getUserWithStats } from '@/lib/services/user.service';
import { errorResponse } from '@/lib/errors';
import { validateUserId } from '@/lib/validators';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = validateUserId(id);
        const result = await getUserWithStats(userId);
        return NextResponse.json({ status: 'success', data: result });
    } catch (error) {
        return errorResponse(error);
    }
}
