import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';

export async function GET() {
    const orgId = await getCurrentOrgId();

    // Fetch commits for the last 7 days for the current organization
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const commits = await prisma.commit.findMany({
        where: {
            repo: { orgId },
            timestamp: { gte: weekAgo },
        },
        select: {
            timestamp: true,
        },
    });

    // Initialize a 7x24 matrix (Day index 0-6, Hour 0-23)
    const heatmap = Array.from({ length: 7 }, () => Array(24).fill(0));

    commits.forEach((commit) => {
        const date = new Date(commit.timestamp);
        const day = date.getDay(); // 0 (Sun) to 6 (Sat)
        const hour = date.getHours(); // 0-23
        heatmap[day][hour]++;
    });

    // Normalize data for the UI (0 to 1 intensity)
    let maxCommits = 0;
    heatmap.forEach((day) => {
        day.forEach((count) => {
            if (count > maxCommits) maxCommits = count;
        });
    });

    const normalizedHeatmap = heatmap.map((day) =>
        day.map((count) => (maxCommits > 0 ? count / maxCommits : 0))
    );

    return NextResponse.json({
        matrix: normalizedHeatmap,
        metadata: {
            maxCommits,
            totalCommits: commits.length,
        },
    });
}
