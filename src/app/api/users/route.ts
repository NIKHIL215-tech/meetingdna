import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';

export async function GET() {
    const orgId = await getCurrentOrgId();

    const users = await prisma.user.findMany({
        where: { orgId },
        include: {
            team: true
        }
    });
    return NextResponse.json(users);
}
