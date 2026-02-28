import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
    const orgId = await getCurrentOrgId();
    const { privacyEnabled, dataSharingLevel } = await req.json();

    // In a real app, 'me' would be extracted from the session (auth).
    // For this prototype, we'll take the first user in the organization.
    const user = await prisma.user.findFirst({
        where: { orgId }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            privacyEnabled,
            dataSharingLevel,
        },
    });

    // RECORD AUDIT LOG
    await createAuditLog({
        orgId,
        userId: user.id,
        action: 'UPDATE_PRIVACY_SETTINGS',
        resource: 'USER_PROFILE',
        details: { privacyEnabled, dataSharingLevel },
    });

    return NextResponse.json(updatedUser);
}
