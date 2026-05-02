import { InferenceClient } from '@huggingface/inference';

// Model used for all text generation — swap to any HF chat-compatible model
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';

function getClient() {
    return new InferenceClient(process.env.HUGGINGFACE_API_KEY || '');
}

const hasValidKey = () =>
    !!process.env.HUGGINGFACE_API_KEY &&
    process.env.HUGGINGFACE_API_KEY !== 'hf_your_key_here';

async function chatComplete(systemPrompt: string, userPrompt: string): Promise<string> {
    const client = getClient();
    const response = await client.chatCompletion({
        model: HF_MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        max_tokens: 256,
        temperature: 0.5,
    });
    return response.choices[0]?.message?.content?.trim() || '';
}

export async function generateMeetingInsights(input: {
    title: string;
    valueScore: number;
    avgPost: number;
    baseline: number;
    numOccurrences: number;
}) {
    const { title, valueScore, avgPost, baseline, numOccurrences } = input;

    if (!hasValidKey()) {
        return {
            statusLabel: valueScore > 20 ? 'High Value' : valueScore < -10 ? 'Low Value' : 'Neutral',
            explanation: 'Insight generation skipped: Valid HuggingFace API key required.',
            recommendation: 'Set HUGGINGFACE_API_KEY in .env for AI-driven recommendations.',
        };
    }

    const userPrompt = `Meeting title: "${title}"
Value score: ${valueScore} (range -100 to 100)
Avg commits after meeting: ${avgPost.toFixed(2)}
Baseline commits per window: ${baseline.toFixed(2)}
Occurrences: ${numOccurrences}

Respond in exactly this format:
Label: <High Value|Neutral|Low Value>
Explanation: <1-2 sentences>
Recommendation: <keep as is|shorten|reduce frequency|consider cancelling>`;

    try {
        const text = await chatComplete(
            'You are an engineering analytics assistant. Be concise and data-driven.',
            userPrompt
        );

        const labelMatch = text.match(/Label:\s*(.*)/i);
        const explanationMatch = text.match(/Explanation:\s*(.*)/i);
        const recMatch = text.match(/Recommendation:\s*(.*)/i);

        return {
            statusLabel: labelMatch?.[1]?.trim() || (valueScore > 20 ? 'High Value' : valueScore < -10 ? 'Low Value' : 'Neutral'),
            explanation: explanationMatch?.[1]?.trim() || 'Heuristic analysis applied.',
            recommendation: recMatch?.[1]?.trim() || 'Review meeting cadence.',
        };
    } catch (error) {
        console.error('HuggingFace insights error:', error);
        return {
            statusLabel: valueScore > 20 ? 'High Value' : valueScore < -10 ? 'Low Value' : 'Neutral',
            explanation: 'Intelligence layer throttled. Heuristic analysis applied.',
            recommendation: 'Verify HuggingFace API key and quota.',
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
    const { name, topHours, totalMeetingHours, mostMeetingDays, totalCommits, burnoutFlag } = input;

    if (!hasValidKey()) {
        return [
            `Most productive during hours: ${topHours.join(', ')}.`,
            'Protect focus time on heavy meeting days.',
            burnoutFlag ? 'High meeting load detected — overload risk flagged.' : 'Workload appears sustainable.',
        ];
    }

    const userPrompt = `Developer: ${name}
Peak productive hours (24h): ${JSON.stringify(topHours)}
Weekly meeting hours: ${totalMeetingHours.toFixed(1)}
Heaviest meeting days (0=Sun): ${JSON.stringify(mostMeetingDays)}
Total commits: ${totalCommits}
Burnout risk: ${burnoutFlag}

Write exactly 3 bullet points (start each with "- "), each under 20 words:
1. When this person is most productive.
2. When to protect focus time or reschedule meetings.
3. Workload note (mention overload only if burnout risk is true).`;

    try {
        const text = await chatComplete(
            'You are a developer performance coach. Be concise and actionable.',
            userPrompt
        );

        const bullets = text
            .split('\n')
            .filter((l) => l.trim().startsWith('-') || /^\d+\./.test(l.trim()))
            .map((l) => l.replace(/^[-\d.\s]+/, '').trim())
            .filter(Boolean)
            .slice(0, 3);

        return bullets.length === 3 ? bullets : [
            `Most productive during hours: ${topHours.join(', ')}.`,
            'Protect focus time on heavy meeting days.',
            burnoutFlag ? 'High meeting load — overload risk flagged.' : 'Workload appears sustainable.',
        ];
    } catch (error) {
        console.error('HuggingFace summary error:', error);
        return [
            `Most productive during hours: ${topHours.join(', ')}.`,
            'Protect focus time on heavy meeting days.',
            burnoutFlag ? 'High meeting load — overload risk flagged.' : 'Workload appears sustainable.',
        ];
    }
}
