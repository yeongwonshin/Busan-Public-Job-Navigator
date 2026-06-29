import { ChangeLog, JobPosting } from '@/types';

const WATCH_FIELDS: Array<keyof JobPosting> = [
  'title',
  'institution',
  'employmentType',
  'jobCategory',
  'recruitCount',
  'applicationStartAt',
  'applicationEndAt',
  'applicationUrl',
  'applicationMethod'
];

function comparable(value: unknown): string {
  if (Array.isArray(value)) return value.join('|');
  if (value === undefined || value === null) return '';
  return String(value);
}

export function detectChanges(previous: JobPosting[], next: JobPosting[], now = new Date()): ChangeLog[] {
  const changes: ChangeLog[] = [];
  const prevMap = new Map(previous.map((job) => [job.id, job]));
  const nextMap = new Map(next.map((job) => [job.id, job]));

  next.forEach((job) => {
    const prev = prevMap.get(job.id);
    if (!prev) {
      changes.push({
        id: `change-${job.id}-new-${now.getTime()}`,
        jobId: job.id,
        type: 'new',
        field: 'job',
        before: null,
        after: job.title,
        detectedAt: now.toISOString()
      });
      return;
    }

    WATCH_FIELDS.forEach((field) => {
      const before = comparable(prev[field]);
      const after = comparable(job[field]);
      if (before !== after) {
        changes.push({
          id: `change-${job.id}-${String(field)}-${now.getTime()}`,
          jobId: job.id,
          type: 'updated',
          field: String(field),
          before,
          after,
          detectedAt: now.toISOString()
        });
      }
    });
  });

  previous.forEach((job) => {
    if (!nextMap.has(job.id)) {
      changes.push({
        id: `change-${job.id}-deleted-${now.getTime()}`,
        jobId: job.id,
        type: 'deleted',
        field: 'job',
        before: job.title,
        after: null,
        detectedAt: now.toISOString()
      });
    }
  });

  return changes;
}
