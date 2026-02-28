import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';

export async function POST() {
    const orgId = await getCurrentOrgId();

    // Find a repo and user in this org to attribute the simulated commit to
    const repo = await prisma.repo.findFirst({ where: { orgId } });
    const user = await prisma.user.findFirst({ where: { orgId } });

    if (!repo || !user) {
        return NextResponse.json({ error: 'No repo or user found for this organization' }, { status: 400 });
    }

    // Generate a random commit for "today" at the current hour
    const now = new Date();
    const sha = Math.random().toString(36).substring(2, 15);

    const commit = await prisma.commit.create({
        data: {
            sha: `sim-${sha}`,
            timestamp: now,
            authorId: user.id,
            repoId: repo.id,
        },
    });

    return NextResponse.json({
        success: true,
        commit: {
            sha: commit.sha,
            timestamp: commit.timestamp,
            user: user.name,
        }
    });
}
