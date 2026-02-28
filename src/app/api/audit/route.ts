import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';

export async function GET() {
    const orgId = await getCurrentOrgId();

    const logs = await prisma.auditLog.findMany({
        where: { orgId },
        orderBy: { timestamp: 'desc' },
        take: 50,
        include: {
            org: {
                select: { name: true }
            }
        }
    });

    return NextResponse.json(logs);
}
