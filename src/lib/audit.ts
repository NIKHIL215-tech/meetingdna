import { prisma } from './prisma';

export async function createAuditLog({
    orgId,
    userId,
    action,
    resource,
    details,
    ipAddress,
}: {
    orgId: number;
    userId?: number;
    action: string;
    resource: string;
    details?: any;
    ipAddress?: string;
}) {
    try {
        return await prisma.auditLog.create({
            data: {
                orgId,
                userId,
                action,
                resource,
                details: details ? JSON.stringify(details) : null,
                ipAddress,
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
}
