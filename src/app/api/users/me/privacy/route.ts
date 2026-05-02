import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { updateUserPrivacy } from '@/lib/services/user.service';
import { errorResponse } from '@/lib/errors';
import { validatePrivacyPayload } from '@/lib/validators';

export async function POST(req: NextRequest) {
    try {
        const orgId = await getCurrentOrgId();
        const body = await req.json();
        const { privacyEnabled, dataSharingLevel, optOutReason } = validatePrivacyPayload(body);

        // Resolve "me" — in production this comes from the session token
        const me = await prisma.user.findFirst({ where: { orgId } });
        if (!me) {
            const { NotFoundError } = await import('@/lib/errors');
            throw new NotFoundError('User');
        }

        const updated = await updateUserPrivacy(me.id, orgId, privacyEnabled, dataSharingLevel, optOutReason);

        await createAuditLog({
            orgId,
            userId: me.id,
            action: 'UPDATE_PRIVACY_SETTINGS',
            resource: 'USER_PROFILE',
            details: { privacyEnabled, dataSharingLevel },
        });

        return NextResponse.json({ status: 'success', data: updated });
    } catch (error) {
        return errorResponse(error);
    }
}
