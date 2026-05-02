import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors';
import type { IntegrationProvider, IntegrationConnectResult, SyncTriggerResult } from '@/lib/types';
import crypto from 'crypto';

export async function listOrganizations() {
    return prisma.organization.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
    });
}

export async function getOrganization(orgId: number) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new NotFoundError('Organization');
    return org;
}

export async function connectIntegration(
    orgId: number,
    provider: IntegrationProvider
): Promise<IntegrationConnectResult> {
    await getOrganization(orgId);

    // In production: initiate OAuth flow and persist tokens
    return {
        success: true,
        provider,
        orgId,
        connectedAt: new Date().toISOString(),
    };
}

export async function triggerSync(orgId: number): Promise<SyncTriggerResult> {
    await getOrganization(orgId);

    // In production: enqueue a background job (e.g., BullMQ, Inngest)
    const jobId = crypto.randomUUID();

    return {
        jobId,
        orgId,
        status: 'queued',
        queuedAt: new Date().toISOString(),
    };
}
