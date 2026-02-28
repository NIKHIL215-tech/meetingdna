import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeUserStats } from '@/lib/analytics';
import { generateUserSummaryHeuristics } from '@/lib/insights';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const userId = Number(id);
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { team: true }
    });

    if (!user)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const meetings = await prisma.meeting.findMany({
        where: { attendees: { some: { id: userId } } },
    });
    const commits = await prisma.commit.findMany({
        where: { authorId: userId },
    });

    const stats = computeUserStats(userId, meetings, commits);

    let existing = await prisma.userStats.findUnique({
        where: { userId },
    });

    if (!existing) {
        // Calculate missing fields for AI summary
        const topHours = [...stats.commitsByHour]
            .map((v, i) => ({ h: i, v }))
            .sort((a, b) => b.v - a.v)
            .slice(0, 3)
            .map((x) => x.h);

        const mostMeetingDays = Object.entries(stats.meetingHoursPerDay)
            .map(([k, v]) => ({ d: Number(k), v: v as number }))
            .sort((a, b) => b.v - a.v)
            .slice(0, 2)
            .map((x) => x.d);

        const bullets = await generateUserSummaryHeuristics({
            name: user.name,
            topHours,
            totalMeetingHours: stats.totalMeetingHours,
            mostMeetingDays,
            totalCommits: stats.totalCommits,
            burnoutFlag: stats.burnoutFlag,
        });

        existing = await prisma.userStats.create({
            data: {
                userId,
                meetingHoursPerDay: JSON.stringify(stats.meetingHoursPerDay),
                commitsByHour: JSON.stringify(stats.commitsByHour),
                burnoutFlag: stats.burnoutFlag,
                summaryBullets: JSON.stringify(bullets),
            },
        });
    }

    return NextResponse.json({
        user,
        stats: { ...stats },
        performanceSummary: existing.summaryBullets ? JSON.parse(existing.summaryBullets) : [],
    });
}
