import { NextRequest, NextResponse } from 'next/server';

const ORG_ID_COOKIE = 'meetingdna-org-id';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only guard API routes
    if (!pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Auth routes are exempt
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    const orgIdCookie = req.cookies.get(ORG_ID_COOKIE)?.value;
    const orgId = orgIdCookie ? parseInt(orgIdCookie, 10) : NaN;

    const res = NextResponse.next();

    // Forward orgId as a header so route handlers can read it without a DB call
    // when the cookie is already set.
    if (!isNaN(orgId)) {
        res.headers.set('x-org-id', orgId.toString());
    }

    return res;
}

export const config = {
    matcher: '/api/:path*',
};
