export type EmploymentType = '정규직' | '채용형 인턴' | '체험형 인턴' | '기간제' | '공무직' | '계약직' | '기타';

export type EligibilityStatus = 'eligible' | 'needs-prep' | 'not-eligible';

export type JobStatus = 'open' | 'upcoming' | 'closed';

export interface RecruitmentStage {
  name: string;
  date?: string;
  description?: string;
}

export interface JobEligibility {
  education?: string;
  major?: string[];
  experience?: string;
  certifications?: string[];
  residence?: string;
  otherRequirements?: string[];
}

export interface JobPreferences {
  certifications?: string[];
  targets?: string[];
  keywords?: string[];
}

export interface JobPosting {
  id: string;
  sourceId?: string;
  title: string;
  institution: string;
  department?: string;
  employmentType: EmploymentType;
  jobCategory: string;
  roles: string[];
  recruitCount?: number;
  workRegion?: string;
  workLocation?: string;
  applicationStartAt: string;
  applicationEndAt: string;
  publishedAt?: string;
  updatedAt?: string;
  applicationUrl?: string;
  originalUrl?: string;
  attachmentUrls?: string[];
  applicationMethod?: string;
  eligibility: JobEligibility;
  preferences: JobPreferences;
  process: RecruitmentStage[];
  documents: string[];
  cautions: string[];
  tags: string[];
  status?: JobStatus;
  originalPayload?: Record<string, unknown>;
}

export interface UserExperience {
  id: string;
  title: string;
  category: string;
  description: string;
  impact?: string;
  keywords: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  birthYear?: number;
  residence: string;
  educationStatus: '재학' | '졸업예정' | '졸업' | '기타';
  major: string;
  certifications: string[];
  experiences: UserExperience[];
  targetCategories: string[];
  interestedInstitutions: string[];
  ncsReadiness: number;
  essayReadiness: number;
  interviewReadiness: number;
  availableHoursPerWeek: number;
}

export interface EligibilityResult {
  jobId: string;
  status: EligibilityStatus;
  score: number;
  strengths: string[];
  gaps: string[];
  requiredActions: string[];
  reasons: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  dueDate?: string;
  priority: '높음' | '중간' | '낮음';
  category: '자격확인' | '서류' | '필기' | '면접' | '증빙' | '정책연계';
  description: string;
  completed?: boolean;
}

export interface PolicyProgram {
  id: string;
  title: string;
  category: string;
  target: string[];
  triggerKeywords: string[];
  description: string;
  url?: string;
}

export interface ChangeLog {
  id: string;
  jobId: string;
  type: 'new' | 'updated' | 'closed' | 'deleted';
  field: string;
  before?: string | number | null;
  after?: string | number | null;
  detectedAt: string;
}

export interface EssayQuestion {
  id: string;
  text: string;
  competency: string;
  guideKeywords: string[];
}

export interface EssaySuggestion {
  questionId: string;
  recommendedExperiences: UserExperience[];
  structure: string[];
  warnings: string[];
  sampleOpening: string;
}

export interface AppDataset {
  jobs: JobPosting[];
  policies: PolicyProgram[];
  changes: ChangeLog[];
}
