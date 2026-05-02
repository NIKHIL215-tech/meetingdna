import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';
import { errorResponse } from '@/lib/errors';

export async function GET() {
    try {
        const orgId = await getCurrentOrgId();

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const commits = await prisma.commit.findMany({
            where: { repo: { orgId }, timestamp: { gte: weekAgo } },
            select: { timestamp: true },
        });

        const matrix = Array.from({ length: 7 }, () => Array(24).fill(0));
        for (const commit of commits) {
            const d = new Date(commit.timestamp);
            matrix[d.getDay()][d.getHours()]++;
        }

        let maxCommits = 0;
        matrix.flat().forEach((c) => { if (c > maxCommits) maxCommits = c; });

        const normalized = matrix.map((day) =>
            day.map((c) => (maxCommits > 0 ? c / maxCommits : 0))
        );

        return NextResponse.json({
            status: 'success',
            data: { matrix: normalized, maxCommits, totalCommits: commits.length },
        });
    } catch (error) {
        return errorResponse(error);
    }
}
