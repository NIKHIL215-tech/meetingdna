import { NextRequest, NextResponse } from 'next/server';
import { getCurrentOrgId } from '@/lib/auth';
import { correlateMeeting } from '@/lib/services/meeting.service';
import { errorResponse } from '@/lib/errors';
import { validateMeetingId } from '@/lib/validators';

export async function POST(req: NextRequest) {
    try {
        const orgId = await getCurrentOrgId();
        const body = await req.json();
        const meetingId = validateMeetingId(body.meetingId);
        const result = await correlateMeeting(meetingId, orgId);
        return NextResponse.json({ status: 'success', data: result });
    } catch (error) {
        return errorResponse(error);
    }
}
