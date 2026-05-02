import { prisma } from '@/lib/prisma';
import type { OrgPulseResult, HeatmapCell } from '@/lib/types';

const PULSE_CACHE_MINUTES = 5;

export async function getOrgPulse(orgId: number): Promise<OrgPulseResult> {
    const cacheThreshold = new Date();
    cacheThreshold.setMinutes(cacheThreshold.getMinutes() - PULSE_CACHE_MINUTES);

    const cached = await prisma.orgPulse.findFirst({
        where: { orgId, timestamp: { gte: cacheThreshold } },
        orderBy: { timestamp: 'desc' },
    });

    if (cached) return cached;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [meetings, commits] = await Promise.all([
        prisma.meeting.findMany({ where: { orgId } }),
        prisma.commit.findMany({ where: { repo: { orgId }, timestamp: { gte: weekAgo } } }),
    ]);

    const activeSeriesCount = new Set(meetings.map((m) => m.seriesKey)).size;
    const signalsDetected = commits.length + meetings.length;
    const teamVelocity = Math.min(100, Math.round((commits.length / 20) * 100));
    const focusScore = Math.max(0, 100 - meetings.length * 2);
    const burnoutRisk = meetings.length > 5 ? 35 : 10;
    const summarySnippet =
        focusScore < 50
            ? 'Meeting density is impacting deep-work windows. Consider moving status-checks to asynchronous updates.'
            : 'Team focus windows are healthy. Velocity trend is positive across key repositories.';

    return prisma.orgPulse.create({
        data: { orgId, activeSeriesCount, teamVelocity, focusScore, burnoutRisk, signalsDetected, summarySnippet },
    });
}

export async function getHeatmap(orgId: number): Promise<HeatmapCell[]> {
    const users = await prisma.user.findMany({
        where: { orgId, privacyEnabled: false },
        include: { meetings: true },
    });

    const heatmap: HeatmapCell[] = await Promise.all(
        users.map(async (user) => {
            const commitCount = await prisma.commit.count({ where: { authorId: user.id } });
            const meetingHours = user.meetings.reduce((sum, m) => {
                return sum + (m.endTime.getTime() - m.startTime.getTime()) / 3_600_000;
            }, 0);
            const burnoutRisk = meetingHours > 20 && commitCount < 20;

            return {
                userId: user.id,
                userName: user.name,
                meetingHours: Math.round(meetingHours * 10) / 10,
                commitCount,
                burnoutRisk,
            };
        })
    );

    return heatmap;
}
