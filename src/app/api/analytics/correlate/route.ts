import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentOrgId } from '@/lib/auth';

/**
 * SIMULATED Semantic Correlation API
 * In a production app, this would use a Vector DB (Pinecone/Weaviate) 
 * and an Embedding model to find overlaps between transcripts and commits.
 */
export async function POST(req: NextRequest) {
    const orgId = await getCurrentOrgId();
    const { meetingId } = await req.json();

    if (!meetingId) {
        return NextResponse.json({ error: 'meetingId is required' }, { status: 400 });
    }

    // 1. Fetch meeting context
    const meeting = await prisma.meeting.findUnique({
        where: { id: meetingId, orgId },
    });

    if (!meeting) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // 2. Simulate RAG Search
    // We'll calculate a "Semantic Score" based on commit frequency around the meeting
    // plus a random correlation factor for simulation.
    const weekAgo = new Date(meeting.startTime);
    weekAgo.setDate(weekAgo.getDate() - 3);
    const threeDaysAfter = new Date(meeting.startTime);
    threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

    const relatedCommits = await prisma.commit.findMany({
        where: {
            repo: { orgId },
            timestamp: {
                gte: weekAgo,
                lte: threeDaysAfter,
            }
        },
        take: 5
    });

    const correlationScore = Math.min(95, 40 + (relatedCommits.length * 8));

    const insights = correlationScore > 70
        ? "High alignment detected: Discussion in '" + meeting.title + "' directly correlates with recent architectural changes in the main repository."
        : "Potential Implementation Drift: Meeting topics diverged from active development work in the last 72 hours.";

    return NextResponse.json({
        meetingId,
        orgId,
        correlationScore,
        insights,
        topSignals: relatedCommits.map(c => ({
            sha: c.sha.substring(0, 7),
            relevance: Math.round(Math.random() * 20) + 70
        })),
        timestamp: new Date().toISOString()
    });
}
