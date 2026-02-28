import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    try {
        const { message, history, stats, userName } = await req.json();

        const systemPrompt = `
            You are a performance analyst for MeetingDNA.
            You have access to the production telemetry for ${userName}.
            
            UserData:
            - Total Commits: ${stats.totalCommits}
            - Total Meeting Hours: ${stats.totalMeetingHours}
            - Burnout Risk: ${stats.burnoutFlag ? 'HIGH' : 'LOW'}
            - Productivity Windows: ${stats.commitsByHour.join(', ')} (24-hour array)
            
            Your goal is to provide specific, data-driven advice. If they ask about velocity, look at their commit peaks. 
            If they ask about meetings, look at their meeting load. 
            Be professional, encouraging, and highly technical. Keep responses concise (under 3 sentences).
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...history.map((m: any) => ({ role: m.type === 'insight' ? 'assistant' : 'user', content: m.text })),
                { role: "user", content: message }
            ],
            temperature: 0.7,
        });

        const reply = response.choices[0].message.content || "I'm analyzing your telemetry, but I need more data to provide a precise response.";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Coach API Error:', error);
        return NextResponse.json({ error: 'Failed to synchronize with Performance Analyst.' }, { status: 500 });
    }
}
