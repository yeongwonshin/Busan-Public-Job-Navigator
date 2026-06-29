import { UserProfile } from '@/types';

export const defaultProfile: UserProfile = {
  id: 'local-user',
  name: '부산 청년',
  birthYear: 2000,
  residence: '부산광역시',
  educationStatus: '졸업예정',
  major: '컴퓨터공학',
  certifications: ['정보처리기사', 'SQLD', '한국사능력검정시험'],
  experiences: [
    {
      id: 'exp-001',
      title: '공공데이터 분석 프로젝트',
      category: '데이터분석',
      description: '부산 공공데이터를 활용해 청년 유동인구와 일자리 밀집도를 시각화했습니다.',
      impact: '팀 프로젝트 발표에서 최우수 평가를 받았습니다.',
      keywords: ['데이터', '공공데이터', '문제해결', '협업']
    },
    {
      id: 'exp-002',
      title: '학과 학생회 예산 관리',
      category: '행정',
      description: '행사 예산을 관리하고 영수증 증빙 프로세스를 정리했습니다.',
      impact: '예산 누락 없이 정산 기간을 3일 단축했습니다.',
      keywords: ['책임감', '공공성', '문서관리', '정확성']
    },
    {
      id: 'exp-003',
      title: '지역 관광 SNS 콘텐츠 제작',
      category: '콘텐츠',
      description: '부산 로컬 관광지를 소개하는 숏폼 콘텐츠를 기획하고 제작했습니다.',
      impact: '게시물 평균 조회 수가 기존 대비 2배 증가했습니다.',
      keywords: ['관광', '콘텐츠', '홍보', '외국어']
    }
  ],
  targetCategories: ['도시·데이터', '교통·도시', '금융·행정'],
  interestedInstitutions: ['부산도시공사', '부산교통공사', '부산신용보증재단'],
  ncsReadiness: 62,
  essayReadiness: 55,
  interviewReadiness: 48,
  availableHoursPerWeek: 12
};
