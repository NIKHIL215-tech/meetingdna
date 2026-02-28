import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';

export async function GET() {
    const orgId = await getCurrentOrgId();

    // Check for a fresh Pulse snapshot (last 5 minutes)
    const fiveMinsAgo = new Date();
    fiveMinsAgo.setMinutes(fiveMinsAgo.getMinutes() - 5);

    const existingPulse = await prisma.orgPulse.findFirst({
        where: {
            orgId,
            timestamp: { gte: fiveMinsAgo },
        },
        orderBy: { timestamp: 'desc' },
    });

    if (existingPulse) {
        return NextResponse.json(existingPulse);
    }

    // Calculate new Pulse snapshot
    const meetings = await prisma.meeting.findMany({ where: { orgId } });
    const users = await prisma.user.findMany({ where: { orgId } });
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const commits = await prisma.commit.findMany({
        where: {
            repo: { orgId },
            timestamp: { gte: weekAgo },
        },
    });

    // Aggregation logic for organizational health metrics
    const activeSeriesCount = new Set(meetings.map(m => m.seriesKey)).size;
    const signalsDetected = commits.length + meetings.length;

    // Simulated scoring based on signals
    const teamVelocity = Math.min(100, Math.round((commits.length / 20) * 100));
    const focusScore = Math.max(0, 100 - (meetings.length * 2)); // High meetings = low focus
    const burnoutRisk = meetings.length > 5 ? 35 : 10;

    const summarySnippet = focusScore < 50
        ? "Meeting density is impacting deep-work windows. Consider moving status-checks to asynchronous updates."
        : "Team focus windows are healthy. Velocity trend is positive across key repositories.";

    const newPulse = await prisma.orgPulse.create({
        data: {
            orgId,
            activeSeriesCount,
            teamVelocity,
            focusScore,
            burnoutRisk,
            signalsDetected,
            summarySnippet,
        },
    });

    return NextResponse.json(newPulse);
}
