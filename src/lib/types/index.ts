export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

// ---- Analytics types ----

export interface MeetingSeriesResult {
    seriesKey: string;
    title: string;
    avgPostMeetingCommits: number;
    baselineCommits: number;
    valueScore: number;
    numOccurrences: number;
    statusLabel: string | null;
    explanation: string | null;
    recommendation: string | null;
}

export interface UserStatsResult {
    userId: number;
    commitsByHour: number[];
    meetingHoursPerDay: Record<number, number>;
    totalMeetingHours: number;
    totalCommits: number;
    burnoutFlag: boolean;
}

export interface OrgPulseResult {
    id: number;
    orgId: number;
    timestamp: Date;
    activeSeriesCount: number;
    teamVelocity: number;
    focusScore: number;
    burnoutRisk: number;
    signalsDetected: number;
    summarySnippet: string | null;
}

export interface CorrelationResult {
    meetingId: number;
    orgId: number;
    correlationScore: number;
    insights: string;
    topSignals: { sha: string; relevance: number }[];
    timestamp: string;
}

export interface HeatmapCell {
    userId: number;
    userName: string;
    meetingHours: number;
    commitCount: number;
    burnoutRisk: boolean;
}

// ---- Integration types ----

export type IntegrationProvider = 'github' | 'google_calendar' | 'slack' | 'jira';

export interface IntegrationConnectResult {
    success: boolean;
    provider: IntegrationProvider;
    orgId: number;
    connectedAt: string;
}

// ---- Sync types ----

export type SyncStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface SyncTriggerResult {
    jobId: string;
    orgId: number;
    status: SyncStatus;
    queuedAt: string;
}
