import { ValidationError } from '@/lib/errors';
import type { IntegrationProvider } from '@/lib/types';

const VALID_PROVIDERS: IntegrationProvider[] = ['github', 'google_calendar', 'slack', 'jira'];

const VALID_SHARING_LEVELS = ['FULL', 'ANONYMIZED', 'NONE'];

export function validateIntegrationProvider(provider: unknown): IntegrationProvider {
    if (!provider || !VALID_PROVIDERS.includes(provider as IntegrationProvider)) {
        throw new ValidationError(
            `Invalid provider. Must be one of: ${VALID_PROVIDERS.join(', ')}`
        );
    }
    return provider as IntegrationProvider;
}

export function validateMeetingId(id: unknown): number {
    const parsed = Number(id);
    if (!id || isNaN(parsed) || parsed <= 0) {
        throw new ValidationError('meetingId must be a positive integer');
    }
    return parsed;
}

export function validateUserId(id: unknown): number {
    const parsed = Number(id);
    if (!id || isNaN(parsed) || parsed <= 0) {
        throw new ValidationError('userId must be a positive integer');
    }
    return parsed;
}

export function validatePrivacyPayload(body: unknown): {
    privacyEnabled: boolean;
    dataSharingLevel: string;
    optOutReason?: string;
} {
    const b = body as Record<string, unknown>;

    if (typeof b.privacyEnabled !== 'boolean') {
        throw new ValidationError('privacyEnabled must be a boolean');
    }

    if (!b.dataSharingLevel || !VALID_SHARING_LEVELS.includes(b.dataSharingLevel as string)) {
        throw new ValidationError(
            `dataSharingLevel must be one of: ${VALID_SHARING_LEVELS.join(', ')}`
        );
    }

    return {
        privacyEnabled: b.privacyEnabled,
        dataSharingLevel: b.dataSharingLevel as string,
        optOutReason: typeof b.optOutReason === 'string' ? b.optOutReason : undefined,
    };
}

export function validateCoachPayload(body: unknown): {
    message: string;
    history: { type: string; text: string }[];
    stats: Record<string, unknown>;
    userName: string;
} {
    const b = body as Record<string, unknown>;

    if (!b.message || typeof b.message !== 'string') {
        throw new ValidationError('message is required');
    }
    if (!b.userName || typeof b.userName !== 'string') {
        throw new ValidationError('userName is required');
    }
    if (!b.stats || typeof b.stats !== 'object') {
        throw new ValidationError('stats is required');
    }

    return {
        message: b.message,
        history: Array.isArray(b.history) ? b.history : [],
        stats: b.stats as Record<string, unknown>,
        userName: b.userName,
    };
}
