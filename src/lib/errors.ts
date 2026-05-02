import { NextResponse } from 'next/server';

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

export function errorResponse(error: unknown): NextResponse {
    if (error instanceof AppError) {
        return NextResponse.json(
            { status: 'error', error: error.message, code: error.code },
            { status: error.statusCode }
        );
    }

    console.error('Unhandled error:', error);
    return NextResponse.json(
        { status: 'error', error: 'Internal server error' },
        { status: 500 }
    );
}
