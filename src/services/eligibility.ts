import { EligibilityResult, EligibilityStatus, JobPosting, UserProfile } from '@/types';
import { daysUntil, getJobStatus } from '@/utils/dates';
import { includesAny } from '@/utils/text';

function overlaps(a: string[], b: string[]): string[] {
  const lowerB = b.map((item) => item.toLowerCase());
  return a.filter((item) => lowerB.includes(item.toLowerCase()));
}

function inferMajorMatch(profile: UserProfile, job: JobPosting): boolean {
  if (!job.eligibility.major?.length) return true;
  return job.eligibility.major.some((major) => profile.major.includes(major) || major.includes(profile.major));
}

function inferResidenceMatch(profile: UserProfile, job: JobPosting): boolean {
  const rule = job.eligibility.residence ?? '';
  if (!rule || rule.includes('제한 없음')) return true;
  if (rule.includes('부산') && profile.residence.includes('부산')) return true;
  if (rule.includes('울산') && profile.residence.includes('울산')) return true;
  if (rule.includes('경남') && (profile.residence.includes('경남') || profile.residence.includes('경상남도'))) return true;
  return !rule.includes('지원 가능') && !rule.includes('거주');
}

function inferCertificationMatch(profile: UserProfile, job: JobPosting): { hasRequired: boolean; matched: string[]; missing: string[] } {
  const required = job.eligibility.certifications ?? [];
  const matched = overlaps(profile.certifications, required);
  if (!required.length) return { hasRequired: true, matched, missing: [] };
  const missing = required.filter((cert) => !matched.some((item) => item.toLowerCase() === cert.toLowerCase()));
  return { hasRequired: missing.length === 0, matched, missing };
}

export function evaluateJob(profile: UserProfile, job: JobPosting): EligibilityResult {
  const strengths: string[] = [];
  const gaps: string[] = [];
  const requiredActions: string[] = [];
  const reasons: string[] = [];
  let score = 40;
  let hardBlock = false;

  const status = getJobStatus(job);
  if (status === 'closed') {
    return {
      jobId: job.id,
      status: 'not-eligible',
      score: 0,
      strengths: [],
      gaps: ['접수기간이 종료되었습니다.'],
      requiredActions: ['다음 공고 알림을 설정하세요.'],
      reasons: ['마감된 공고']
    };
  }

  if (inferResidenceMatch(profile, job)) {
    score += 12;
    strengths.push('거주지 요건과 충돌하지 않습니다.');
  } else {
    hardBlock = true;
    gaps.push(`거주지 요건 확인 필요: ${job.eligibility.residence}`);
    requiredActions.push('주민등록초본 기준 거주 요건을 원문 공고에서 재확인하세요.');
  }

  if (inferMajorMatch(profile, job)) {
    score += 12;
    if (job.eligibility.major?.length) strengths.push('전공 요건과 유사도가 높습니다.');
    else strengths.push('전공 제한이 없거나 넓게 열려 있습니다.');
  } else {
    score -= 18;
    gaps.push(`전공 요건과 현재 전공이 다릅니다: ${job.eligibility.major?.join(', ')}`);
    requiredActions.push('동일계열 인정 범위 또는 관련 경험 대체 가능 여부를 확인하세요.');
  }

  const cert = inferCertificationMatch(profile, job);
  if (cert.hasRequired) {
    score += 18;
    if (cert.matched.length) strengths.push(`필수 자격증 충족: ${cert.matched.join(', ')}`);
    else strengths.push('필수 자격증 제한이 없습니다.');
  } else {
    hardBlock = true;
    gaps.push(`필수 자격증 부족: ${cert.missing.join(', ')}`);
    requiredActions.push('필수 자격증 취득 전에는 지원이 어려울 수 있습니다.');
  }

  const preferredCerts = overlaps(profile.certifications, job.preferences.certifications ?? []);
  if (preferredCerts.length) {
    score += Math.min(12, preferredCerts.length * 5);
    strengths.push(`우대 자격과 일치: ${preferredCerts.join(', ')}`);
  } else if (job.preferences.certifications?.length) {
    gaps.push(`우대 자격 보완 가능: ${job.preferences.certifications.slice(0, 3).join(', ')}`);
    requiredActions.push('가점 또는 우대 자격을 확인하고 단기 취득 가능성을 검토하세요.');
  }

  if (profile.targetCategories.includes(job.jobCategory)) {
    score += 10;
    strengths.push('희망 직무 분야와 일치합니다.');
  }

  if (profile.interestedInstitutions.includes(job.institution)) {
    score += 8;
    strengths.push('관심 기관으로 등록되어 있습니다.');
  }

  const experienceKeywords = profile.experiences.flatMap((exp) => exp.keywords);
  const jobKeywords = [...(job.preferences.keywords ?? []), ...job.roles, job.jobCategory];
  const experienceMatch = overlaps(experienceKeywords, jobKeywords);
  if (experienceMatch.length) {
    score += 12;
    strengths.push(`경험 키워드 일치: ${experienceMatch.slice(0, 4).join(', ')}`);
  } else {
    gaps.push('직무와 바로 연결되는 경험 키워드가 부족합니다.');
    requiredActions.push('자기소개서에서 직무 관련 경험을 한 가지 이상 구조화하세요.');
  }

  const dDay = daysUntil(job.applicationEndAt);
  if (dDay !== undefined) {
    if (dDay <= 2) {
      score -= 10;
      gaps.push('마감이 임박했습니다.');
      requiredActions.push('증빙서류와 최종 제출 여부를 오늘 확인하세요.');
    } else if (dDay <= 7) {
      score += 3;
      reasons.push('일주일 이내 마감으로 우선순위가 높습니다.');
    } else {
      score += 8;
      strengths.push('준비 시간을 확보할 수 있습니다.');
    }
  }

  if (includesAny(job.title + job.tags.join(' '), ['NCS', '필기']) && profile.ncsReadiness < 60) {
    gaps.push('NCS 준비도가 낮습니다.');
    requiredActions.push('수리·문제해결 영역을 중심으로 7일 학습 루틴을 생성하세요.');
  }

  const clippedScore = Math.max(0, Math.min(100, Math.round(score)));
  let resultStatus: EligibilityStatus = 'eligible';
  if (hardBlock || clippedScore < 45) resultStatus = 'not-eligible';
  else if (gaps.length || clippedScore < 75) resultStatus = 'needs-prep';

  return {
    jobId: job.id,
    status: resultStatus,
    score: clippedScore,
    strengths,
    gaps,
    requiredActions: Array.from(new Set(requiredActions)),
    reasons
  };
}

export function rankJobs(profile: UserProfile, jobs: JobPosting[]): Array<{ job: JobPosting; result: EligibilityResult }> {
  return jobs
    .map((job) => ({ job, result: evaluateJob(profile, job) }))
    .sort((a, b) => b.result.score - a.result.score);
}
