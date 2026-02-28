import { cookies } from 'next/headers';
import { prisma } from './prisma';

const ORG_ID_COOKIE = 'meetingdna-org-id';

export async function getCurrentOrgId(): Promise<number> {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(ORG_ID_COOKIE)?.value;

    if (cookieValue) {
        const parsed = parseInt(cookieValue, 10);
        if (!isNaN(parsed)) {
            return parsed;
        }
    }

    // Fallback to the first organization if no cookie is set
    const firstOrg = await prisma.organization.findFirst({
        select: { id: true },
    });

    return firstOrg?.id || 1;
}

export async function setOrgIdCookie(orgId: number) {
    const cookieStore = await cookies();
    cookieStore.set(ORG_ID_COOKIE, orgId.toString(), {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
}
