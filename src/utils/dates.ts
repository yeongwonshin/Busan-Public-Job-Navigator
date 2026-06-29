import { JobPosting, JobStatus } from '@/types';

export function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function daysUntil(value?: string, now = new Date()): number | undefined {
  const date = toDate(value);
  if (!date) return undefined;
  const ms = date.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatDate(value?: string): string {
  const date = toDate(value);
  if (!date) return '일정 미정';
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatShortDate(value?: string): string {
  const date = toDate(value);
  if (!date) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function getJobStatus(job: JobPosting, now = new Date()): JobStatus {
  const start = toDate(job.applicationStartAt);
  const end = toDate(job.applicationEndAt);
  if (end && end.getTime() < now.getTime()) return 'closed';
  if (start && start.getTime() > now.getTime()) return 'upcoming';
  return 'open';
}

export function dDayLabel(value?: string): string {
  const days = daysUntil(value);
  if (days === undefined) return 'D-?';
  if (days < 0) return '마감';
  if (days === 0) return 'D-Day';
  return `D-${days}`;
}

export function addDays(base: Date, days: number): string {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
