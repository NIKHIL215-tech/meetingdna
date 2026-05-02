import { NextRequest, NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';
import { errorResponse, AppError } from '@/lib/errors';
import { validateCoachPayload } from '@/lib/validators';

const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';

function getClient() {
    return new InferenceClient(process.env.HUGGINGFACE_API_KEY || '');
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history, stats, userName } = validateCoachPayload(body);

        const systemPrompt = `You are a performance analyst for MeetingDNA.
You have access to the production telemetry for ${userName}.

UserData:
- Total Commits: ${(stats as any).totalCommits}
- Total Meeting Hours: ${(stats as any).totalMeetingHours}
- Burnout Risk: ${(stats as any).burnoutFlag ? 'HIGH' : 'LOW'}
- Productivity Windows: ${(stats as any).commitsByHour?.join(', ')} (24-hour array)

Provide specific, data-driven advice. Be professional, encouraging, and highly technical. Keep responses under 3 sentences.`;

        const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...history.map((m) => ({
                role: (m.type === 'insight' ? 'assistant' : 'user') as 'assistant' | 'user',
                content: m.text,
            })),
            { role: 'user' as const, content: message },
        ];

        const response = await getClient().chatCompletion({
            model: HF_MODEL,
            messages,
            max_tokens: 256,
            temperature: 0.7,
        });

        const reply =
            response.choices[0]?.message?.content?.trim() ||
            "I'm analyzing your telemetry, but I need more data to provide a precise response.";

        return NextResponse.json({ status: 'success', data: { reply } });
    } catch (error) {
        if (error instanceof AppError) return errorResponse(error);
        console.error('Coach API Error:', error);
        return errorResponse(new AppError('Failed to synchronize with Performance Analyst.', 500));
    }
}
