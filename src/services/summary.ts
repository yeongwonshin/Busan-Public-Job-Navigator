import { JobPosting } from '@/types';
import { dDayLabel, formatDate } from '@/utils/dates';

export interface JobSummary {
  oneLine: string;
  qualification: string[];
  preference: string[];
  schedule: string[];
  documents: string[];
  cautions: string[];
}

export function summarizeJob(job: JobPosting): JobSummary {
  return {
    oneLine: `${job.institution}에서 ${job.roles.join('·')} 분야 ${job.recruitCount ? `${job.recruitCount}명` : ''}을 ${job.employmentType}로 채용합니다.`.replace('  ', ' '),
    qualification: [
      job.eligibility.education,
      job.eligibility.major?.length ? `전공: ${job.eligibility.major.join(', ')}` : '전공 제한 없음 또는 공고 확인 필요',
      job.eligibility.certifications?.length ? `필수 자격: ${job.eligibility.certifications.join(', ')}` : '필수 자격증 제한 없음 또는 공고 확인 필요',
      job.eligibility.residence ? `거주지: ${job.eligibility.residence}` : undefined,
      ...(job.eligibility.otherRequirements ?? [])
    ].filter(Boolean) as string[],
    preference: [
      job.preferences.certifications?.length ? `우대 자격: ${job.preferences.certifications.join(', ')}` : undefined,
      job.preferences.targets?.length ? `우대 대상: ${job.preferences.targets.join(', ')}` : undefined,
      job.preferences.keywords?.length ? `핵심 키워드: ${job.preferences.keywords.join(', ')}` : undefined
    ].filter(Boolean) as string[],
    schedule: [
      `접수: ${formatDate(job.applicationStartAt)} ~ ${formatDate(job.applicationEndAt)} (${dDayLabel(job.applicationEndAt)})`,
      ...job.process.map((stage) => `${stage.name}: ${stage.date ?? '일정 미정'}${stage.description ? ` · ${stage.description}` : ''}`)
    ],
    documents: job.documents,
    cautions: job.cautions
  };
}

export function extractRiskHighlights(job: JobPosting): string[] {
  const base = job.cautions ?? [];
  const text = [job.title, job.applicationMethod, ...job.documents, ...base].join(' ');
  const rules = [
    { keyword: '중복', message: '중복지원 제한 여부를 반드시 확인하세요.' },
    { keyword: '최종 제출', message: '최종 제출 후 수정 가능 여부를 확인하세요.' },
    { keyword: '마감', message: '마감 시간이 날짜와 별도로 정해져 있습니다.' },
    { keyword: '블라인드', message: '학교명·가족관계·출신지 등 블라인드 위반 표현을 제거하세요.' },
    { keyword: '증빙', message: '우대사항은 증빙서류 인정 기준을 확인해야 합니다.' },
    { keyword: '교대', message: '교대근무 가능 여부가 직무 적합도에 영향을 줍니다.' }
  ];
  const inferred = rules.filter((rule) => text.includes(rule.keyword)).map((rule) => rule.message);
  return Array.from(new Set([...base, ...inferred]));
}
