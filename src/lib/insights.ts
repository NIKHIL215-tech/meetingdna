import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateMeetingInsights(input: {
    title: string;
    valueScore: number;
    avgPost: number;
    baseline: number;
    numOccurrences: number;
}) {
    const { title, valueScore, avgPost, baseline, numOccurrences } = input;
    const prompt = `
Meeting title: "${title}"
Meeting value score: ${valueScore}
Average commits after meeting: ${avgPost.toFixed(2)}
Baseline commits per window: ${baseline.toFixed(2)}
Occurrences: ${numOccurrences}

1. Classify as "High value", "Neutral", or "Low value".
2. Explain why in 1-2 short sentences.
3. Recommend: keep as is / shorten / reduce frequency / consider cancelling.

Return:

Label: ...
Explanation: ...
Recommendation: ...
`;

    const res = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt,
    });

    const text = (res.output[0] as any)?.content?.[0]?.text || '';

    const labelMatch = text.match(/Label:\s*(.*)/i);
    const explanationMatch = text.match(/Explanation:\s*(.*)/i);
    const recMatch = text.match(/Recommendation:\s*(.*)/i);

    return {
        statusLabel: labelMatch?.[1]?.trim() || '',
        explanation: explanationMatch?.[1]?.trim() || '',
        recommendation: recMatch?.[1]?.trim() || '',
    };
}

export async function generateUserSummaryHeuristics(input: {
    name: string;
    topHours: number[];
    totalMeetingHours: number;
    mostMeetingDays: number[];
    totalCommits: number;
    burnoutFlag: boolean;
}) {
    const {
        name,
        topHours,
        totalMeetingHours,
        mostMeetingDays,
        totalCommits,
        burnoutFlag,
    } = input;

    const prompt = `
Name: ${name}
Top productive hours: ${JSON.stringify(topHours)}
Total weekly meeting hours: ${totalMeetingHours.toFixed(1)}
Days with most meetings (0=Mon..6=Sun): ${JSON.stringify(mostMeetingDays)}
Total commits: ${totalCommits}
Burnout risk flag: ${burnoutFlag}

Write 3 short bullet points:
1. When this person is most productive.
2. Suggest when to protect focus time or move meetings.
3. Note on workload; mention overload risk only if burnoutFlag is true.

Each bullet under 20 words.
`;

    const res = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt,
    });

    const text = (res.output[0] as any)?.content?.[0]?.text || '';

    const bullets = text
        .split('\n')
        .filter(
            (l: string) =>
                l.trim().startsWith('-') ||
                l.trim().match(/^\d+\./)
        )
        .map((l: string) => l.replace(/^[-\d\.\s]+/, '').trim())
        .slice(0, 3);

    return bullets;
}
