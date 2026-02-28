import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data in reverse order of dependencies
    await prisma.userStats.deleteMany({});
    await prisma.meetingSeriesStats.deleteMany({});
    await prisma.commit.deleteMany({});
    await prisma.meeting.deleteMany({});
    await prisma.repo.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.orgPulse.deleteMany({});
    await prisma.organization.deleteMany({});

    console.log('Cleared all data.');

    // Create Organizations
    const acme = await prisma.organization.create({
        data: { name: 'Acme Corp', slug: 'acme' },
    });
    const globex = await prisma.organization.create({
        data: { name: 'Globex', slug: 'globex' },
    });

    console.log('Created organizations.');

    // Create Teams
    const frontend = await prisma.team.create({
        data: { name: 'Frontend', orgId: acme.id },
    });
    const backend = await prisma.team.create({
        data: { name: 'Backend', orgId: acme.id },
    });

    console.log('Created teams.');

    // Create Users for Acme
    const alex = await prisma.user.create({
        data: { name: 'Alex', email: 'alex@acme.com', orgId: acme.id, teamId: frontend.id },
    });
    const sarah = await prisma.user.create({
        data: { name: 'Sarah', email: 'sarah@acme.com', orgId: acme.id, teamId: backend.id },
    });

    // Create User for Globex (demonstrate isolation)
    const hank = await prisma.user.create({
        data: { name: 'Hank Scorpio', email: 'hank@globex.com', orgId: globex.id },
    });

    console.log('Created users.');

    // Create Repos
    const acmeRepo = await prisma.repo.create({
        data: { name: 'Acme-Main-App', orgId: acme.id },
    });

    // Generate 14 days of data for Acme
    const now = new Date();
    const series = [
        { key: 'daily-standup', title: 'Daily Standup', hour: 10, duration: 30 },
        { key: 'sprint-planning', title: 'Sprint Planning', hour: 11, duration: 60, day: 1 }, // Monday
        { key: 'status-check', title: 'Weekly Status', hour: 15, duration: 45, day: 5 }, // Friday
    ];

    for (let i = 0; i < 14; i++) {
        const day = new Date();
        day.setDate(now.getDate() - i);
        day.setHours(0, 0, 0, 0);

        const dayOfWeek = day.getDay(); // 0 (Sun) to 6 (Sat)
        if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

        for (const s of series) {
            // Check for weekly meetings
            if (s.day !== undefined && s.day !== dayOfWeek) continue;

            const start = new Date(day);
            start.setHours(s.hour, 0, 0, 0);
            const end = new Date(start);
            end.setMinutes(s.duration);

            const meeting = await prisma.meeting.create({
                data: {
                    title: s.title,
                    startTime: start,
                    endTime: end,
                    seriesKey: s.key,
                    orgId: acme.id,
                    attendees: { connect: [{ id: alex.id }, { id: sarah.id }] },
                },
            });

            // Generate Commits for this day
            // Alex is productive after standup
            if (s.key === 'daily-standup') {
                for (let c = 0; c < 3; c++) {
                    const commitTime = new Date(end);
                    commitTime.setMinutes(end.getMinutes() + (c + 1) * 45);
                    await prisma.commit.create({
                        data: {
                            sha: `sha-alex-${i}-${c}`,
                            timestamp: commitTime,
                            authorId: alex.id,
                            repoId: acmeRepo.id,
                        },
                    });
                }
            }

            // Sarah is productive after Sprint Planning
            if (s.key === 'sprint-planning') {
                for (let c = 0; c < 5; c++) {
                    const commitTime = new Date(end);
                    commitTime.setMinutes(end.getMinutes() + (c + 1) * 30);
                    await prisma.commit.create({
                        data: {
                            sha: `sha-sarah-${i}-${c}`,
                            timestamp: commitTime,
                            authorId: sarah.id,
                            repoId: acmeRepo.id,
                        },
                    });
                }
            }
        }

        // Random baseline commits
        for (let r = 0; r < 2; r++) {
            const commitTime = new Date(day);
            commitTime.setHours(14, Math.random() * 60);
            await prisma.commit.create({
                data: {
                    sha: `sha-baseline-alex-${i}-${r}`,
                    timestamp: commitTime,
                    authorId: alex.id,
                    repoId: acmeRepo.id,
                },
            });
        }
    }

    console.log('Database initialization complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
