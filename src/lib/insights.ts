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

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-key-here') {
        return {
            statusLabel: valueScore > 20 ? 'High Value' : valueScore < -10 ? 'Low Value' : 'Neutral',
            explanation: 'Insight generation skipped: Valid OpenAI API key required.',
            recommendation: 'Configure OPENAI_API_KEY in .env for AI-driven recommendations.',
        };
    }

    try {
        const res = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
        });

        const text = res.choices[0]?.message?.content || '';

        const labelMatch = text.match(/Label:\s*(.*)/i);
        const explanationMatch = text.match(/Explanation:\s*(.*)/i);
        const recMatch = text.match(/Recommendation:\s*(.*)/i);

        return {
            statusLabel: labelMatch?.[1]?.trim() || '',
            explanation: explanationMatch?.[1]?.trim() || '',
            recommendation: recMatch?.[1]?.trim() || '',
        };
    } catch (error) {
        console.error('OpenAI Error:', error);
        return {
            statusLabel: valueScore > 20 ? 'High Value' : valueScore < -10 ? 'Low Value' : 'Neutral',
            explanation: 'Intelligence layer throttled. Heuristic analysis applied.',
            recommendation: 'Verify API capacity and network connectivity.',
        };
    }
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

    const res = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
    });

    const text = res.choices[0]?.message?.content || '';

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
