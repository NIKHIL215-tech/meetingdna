import { prisma } from '@/lib/prisma';
import { computeUserStats } from '@/lib/analytics';
import { generateUserSummaryHeuristics } from '@/lib/insights';
import { NotFoundError } from '@/lib/errors';
import type { UserStatsResult } from '@/lib/types';

export interface UserWithStats {
    user: Awaited<ReturnType<typeof prisma.user.findUnique>>;
    stats: UserStatsResult;
    performanceSummary: string[];
}

export async function getUserWithStats(userId: number): Promise<UserWithStats> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { team: true },
    });

    if (!user) throw new NotFoundError('User');

    const [meetings, commits] = await Promise.all([
        prisma.meeting.findMany({ where: { attendees: { some: { id: userId } } } }),
        prisma.commit.findMany({ where: { authorId: userId } }),
    ]);

    const stats = computeUserStats(userId, meetings, commits);

    let existing = await prisma.userStats.findUnique({ where: { userId } });

    if (!existing) {
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

    return {
        user,
        stats,
        performanceSummary: existing.summaryBullets ? JSON.parse(existing.summaryBullets) : [],
    };
}

export async function updateUserPrivacy(
    userId: number,
    orgId: number,
    privacyEnabled: boolean,
    dataSharingLevel: string,
    optOutReason?: string
) {
    const user = await prisma.user.findUnique({ where: { id: userId, orgId } });
    if (!user) throw new NotFoundError('User');

    return prisma.user.update({
        where: { id: userId },
        data: { privacyEnabled, dataSharingLevel, optOutReason },
        select: { id: true, privacyEnabled: true, dataSharingLevel: true, optOutReason: true },
    });
}

export async function listUsers(orgId: number) {
    return prisma.user.findMany({
        where: { orgId },
        include: { team: true },
        orderBy: { name: 'asc' },
    });
}
