import { Meeting, Commit } from '@prisma/client';

const POST_WINDOW_HOURS = 4;

export function computeMeetingSeriesStats(
    meetings: Meeting[],
    commits: Commit[]
) {
    if (meetings.length === 0 || commits.length === 0) return null;

    const commitsSorted = commits.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    function countCommitsInWindow(start: Date, end: Date) {
        return commitsSorted.filter(
            (c) => c.timestamp >= start && c.timestamp <= end
        ).length;
    }

    const postCounts: number[] = [];
    meetings.forEach((m) => {
        const postStart = m.endTime;
        const postEnd = new Date(
            m.endTime.getTime() + POST_WINDOW_HOURS * 3600 * 1000
        );
        postCounts.push(countCommitsInWindow(postStart, postEnd));
    });

    const avgPost =
        postCounts.reduce((a, b) => a + b, 0) / Math.max(postCounts.length, 1);

    const minTs = commitsSorted[0].timestamp;
    const maxTs = commitsSorted[commitsSorted.length - 1].timestamp;
    const totalDurationHours =
        (maxTs.getTime() - minTs.getTime()) / (3600 * 1000);
    const total4hWindows = Math.max(totalDurationHours / POST_WINDOW_HOURS, 1);
    const baseline = commitsSorted.length / total4hWindows;

    let valueScore = 0;
    if (baseline > 0) {
        let diffRatio = (avgPost - baseline) / baseline;
        diffRatio = Math.max(Math.min(diffRatio, 1), -1);
        valueScore = Math.round(diffRatio * 100); // -100..100
    }

    return {
        avgPostMeetingCommits: avgPost,
        baselineCommits: baseline,
        valueScore,
        numOccurrences: meetings.length,
    };
}

export function computeUserStats(
    userId: number,
    meetings: Meeting[],
    commits: Commit[]
) {
    const commitsByHour = Array(24).fill(0) as number[];
    commits.forEach((c) => {
        const h = c.timestamp.getHours();
        commitsByHour[h] += 1;
    });

    const meetingHoursPerDay: Record<number, number> = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    };
    meetings.forEach((m) => {
        const durH =
            (m.endTime.getTime() - m.startTime.getTime()) / (3600 * 1000);
        const d = m.startTime.getDay();
        meetingHoursPerDay[d] += durH;
    });

    const totalMeetingHours = Object.values(meetingHoursPerDay).reduce(
        (a, b) => a + b,
        0
    );
    const totalCommits = commits.length;

    const burnoutFlag = totalMeetingHours > 20 && totalCommits < 20;

    return {
        userId,
        commitsByHour,
        meetingHoursPerDay,
        totalMeetingHours,
        totalCommits,
        burnoutFlag,
    };
}
