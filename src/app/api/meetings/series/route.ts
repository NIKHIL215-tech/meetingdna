import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeMeetingSeriesStats } from '@/lib/analytics';
import { generateMeetingInsights } from '@/lib/insights';
import { getCurrentOrgId } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const orgId = await getCurrentOrgId();

    const meetings = await prisma.meeting.findMany({
        where: { orgId }
    });
    const commits = await prisma.commit.findMany({
        where: {
            repo: { orgId }
        }
    });

    const bySeries: Record<string, typeof meetings> = {};
    meetings.forEach((m: any) => {
        bySeries[m.seriesKey] = bySeries[m.seriesKey] || [];
        bySeries[m.seriesKey].push(m);
    });

    const seriesKeys = Object.keys(bySeries);
    const result = [];

    for (const key of seriesKeys) {
        const stats = computeMeetingSeriesStats(bySeries[key], commits);
        if (!stats) continue;

        let existing = await prisma.meetingSeriesStats.findUnique({
            where: { seriesKey: key },
        });

        if (!existing) {
            const insights = await generateMeetingInsights({
                title: bySeries[key][0].title,
                valueScore: stats.valueScore,
                avgPost: stats.avgPostMeetingCommits,
                baseline: stats.baselineCommits,
                numOccurrences: stats.numOccurrences,
            });

            existing = await prisma.meetingSeriesStats.create({
                data: {
                    seriesKey: key,
                    avgPostMeetingCommits: stats.avgPostMeetingCommits,
                    baselineCommits: stats.baselineCommits,
                    valueScore: stats.valueScore,
                    numOccurrences: stats.numOccurrences,
                    statusLabel: insights.statusLabel,
                    explanation: insights.explanation,
                    recommendation: insights.recommendation,
                },
            });
        }

        result.push({
            title: bySeries[key][0].title,
            ...existing,
        });
    }

    return NextResponse.json(result);
}
