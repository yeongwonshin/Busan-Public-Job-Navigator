import { EmploymentType, JobPosting } from '@/types';
import { splitKeywords, normalizeSpace } from '@/utils/text';

export type RawDatasetRow = Record<string, unknown>;

export interface DatasetMapping {
  fields: Record<string, string[]>;
}

const fallbackMapping: DatasetMapping = {
  fields: {
    id: ['id', '공고ID', '채용공고ID', '채용번호'],
    title: ['title', '공고명', '채용제목', '제목'],
    institution: ['institution', '기관명', '채용기관', '공사공단명'],
    department: ['department', '담당부서', '부서명'],
    employmentType: ['employmentType', '고용형태', '채용유형'],
    jobCategory: ['jobCategory', '직무분야', '분야', '직렬'],
    roles: ['roles', '모집분야', '채용분야', '직무'],
    recruitCount: ['recruitCount', '모집인원', '채용인원'],
    workRegion: ['workRegion', '근무지역', '지역'],
    workLocation: ['workLocation', '근무지', '근무장소'],
    applicationStartAt: ['applicationStartAt', '접수시작일', '접수시작'],
    applicationEndAt: ['applicationEndAt', '접수마감일', '접수마감', '마감일'],
    applicationUrl: ['applicationUrl', '접수URL', '지원링크'],
    originalUrl: ['originalUrl', '원문URL', '공고URL', '상세URL'],
    applicationMethod: ['applicationMethod', '접수방법'],
    eligibilityText: ['eligibilityText', '지원자격', '응시자격'],
    preferenceText: ['preferenceText', '우대사항', '가산점'],
    processText: ['processText', '전형절차', '전형일정'],
    documentsText: ['documentsText', '제출서류'],
    cautionText: ['cautionText', '유의사항', '주의사항']
  }
};

function pick(row: RawDatasetRow, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return undefined;
}

function asEmploymentType(value?: string): EmploymentType {
  const text = value ?? '기타';
  if (text.includes('정규')) return '정규직';
  if (text.includes('채용형')) return '채용형 인턴';
  if (text.includes('체험')) return '체험형 인턴';
  if (text.includes('기간')) return '기간제';
  if (text.includes('공무')) return '공무직';
  if (text.includes('계약')) return '계약직';
  return '기타';
}

function toIsoDate(value?: string): string {
  if (!value) return new Date().toISOString();
  const cleaned = value.replace(/[.]/g, '-').replace(/년|월/g, '-').replace(/일/g, '').trim();
  const hasTime = /\d{1,2}:\d{2}/.test(cleaned);
  const date = new Date(hasTime ? cleaned : `${cleaned}T09:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function inferCategory(title: string, roles: string[]): string {
  const source = `${title} ${roles.join(' ')}`;
  if (/환경|에너지|수질|대기/.test(source)) return '환경·에너지';
  if (/교통|도시철도|전기|차량/.test(source)) return '교통·도시';
  if (/관광|콘텐츠|마케팅|홍보/.test(source)) return '관광·콘텐츠';
  if (/데이터|전산|정보|IT|AI/.test(source)) return '도시·데이터';
  if (/금융|보증|기업지원/.test(source)) return '금융·행정';
  if (/시설|안전|토목|건축/.test(source)) return '시설·안전';
  return '행정·공통';
}

function extractCertifications(text?: string): string[] {
  if (!text) return [];
  const candidates = ['정보처리기사', 'SQLD', 'ADsP', '전기기사', '일반기계기사', '수질환경기사', '대기환경기사', '산업안전기사', '컴퓨터활용능력', '한국사능력검정시험', '신용분석사'];
  return candidates.filter((cert) => text.includes(cert));
}

function extractCautions(text?: string): string[] {
  const source = text ?? '';
  const result: string[] = [];
  if (source.includes('중복')) result.push('중복지원 제한 여부를 확인하세요.');
  if (source.includes('수정')) result.push('최종 제출 후 수정 가능 여부를 확인하세요.');
  if (source.includes('블라인드')) result.push('블라인드 채용 위반 표현을 제거하세요.');
  if (source.includes('마감')) result.push('마감시간 이후 접수는 인정되지 않을 수 있습니다.');
  return result.length ? result : splitKeywords(source).slice(0, 5);
}

export function normalizeRows(rows: RawDatasetRow[], mapping: DatasetMapping = fallbackMapping): JobPosting[] {
  return rows.map((row, index) => {
    const f = mapping.fields;
    const title = pick(row, f.title) ?? `미제목 공고 ${index + 1}`;
    const institution = pick(row, f.institution) ?? '기관 미상';
    const roleText = pick(row, f.roles) ?? pick(row, f.jobCategory) ?? '공통';
    const roles = splitKeywords(roleText);
    const eligibilityText = normalizeSpace(pick(row, f.eligibilityText));
    const preferenceText = normalizeSpace(pick(row, f.preferenceText));
    const processText = normalizeSpace(pick(row, f.processText));
    const documentsText = normalizeSpace(pick(row, f.documentsText));
    const cautionText = normalizeSpace(pick(row, f.cautionText));
    const rawId = pick(row, f.id);

    return {
      id: rawId ? `dive-${rawId}` : `dive-${institution}-${title}-${index}`.replace(/\s+/g, '-'),
      sourceId: rawId,
      title,
      institution,
      department: pick(row, f.department),
      employmentType: asEmploymentType(pick(row, f.employmentType)),
      jobCategory: pick(row, f.jobCategory) ?? inferCategory(title, roles),
      roles: roles.length ? roles : ['공통'],
      recruitCount: Number(pick(row, f.recruitCount)) || undefined,
      workRegion: pick(row, f.workRegion) ?? '부산광역시',
      workLocation: pick(row, f.workLocation),
      applicationStartAt: toIsoDate(pick(row, f.applicationStartAt)),
      applicationEndAt: toIsoDate(pick(row, f.applicationEndAt)),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationUrl: pick(row, f.applicationUrl),
      originalUrl: pick(row, f.originalUrl),
      attachmentUrls: [],
      applicationMethod: pick(row, f.applicationMethod),
      eligibility: {
        education: eligibilityText || '원문 공고 확인 필요',
        major: splitKeywords(eligibilityText).filter((item) => /공학|관광|마케팅|통계|경제|컴퓨터|환경|안전/.test(item)),
        experience: eligibilityText.includes('경력') ? eligibilityText : '원문 공고 확인 필요',
        certifications: extractCertifications(eligibilityText),
        residence: eligibilityText.includes('부산') ? '부산 거주 요건 또는 우대 가능성 있음' : '원문 공고 확인 필요',
        otherRequirements: splitKeywords(eligibilityText).slice(0, 5)
      },
      preferences: {
        certifications: extractCertifications(preferenceText),
        targets: splitKeywords(preferenceText).filter((item) => /장애|유공|청년|저소득|보훈/.test(item)),
        keywords: splitKeywords(`${preferenceText} ${roleText}`).slice(0, 8)
      },
      process: splitKeywords(processText).map((name) => ({ name })).slice(0, 6),
      documents: splitKeywords(documentsText).length ? splitKeywords(documentsText) : ['입사지원서', '증빙서류 원문 확인'],
      cautions: extractCautions(cautionText),
      tags: Array.from(new Set([...roles, asEmploymentType(pick(row, f.employmentType))])).slice(0, 6),
      originalPayload: row
    };
  });
}

export function parseJsonDataset(raw: string): RawDatasetRow[] {
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return parsed as RawDatasetRow[];
  if (Array.isArray(parsed.data)) return parsed.data as RawDatasetRow[];
  if (Array.isArray(parsed.items)) return parsed.items as RawDatasetRow[];
  throw new Error('JSON 데이터셋은 배열, data 배열, items 배열 중 하나여야 합니다.');
}

export function parseCsvDataset(raw: string): RawDatasetRow[] {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((header) => header.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim().replace(/^"|"$/g, ''));
    return headers.reduce<RawDatasetRow>((row, header, index) => {
      row[header] = values[index] ?? '';
      return row;
    }, {});
  });
}

export function normalizeDatasetFromText(raw: string, filename = 'dataset.json'): JobPosting[] {
  const rows = filename.toLowerCase().endsWith('.csv') ? parseCsvDataset(raw) : parseJsonDataset(raw);
  return normalizeRows(rows);
}
