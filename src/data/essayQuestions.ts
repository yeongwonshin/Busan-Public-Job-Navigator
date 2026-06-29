import { EssayQuestion } from '@/types';

export const essayQuestions: EssayQuestion[] = [
  {
    id: 'essay-001',
    text: '공공기관 직원으로서 책임감을 발휘한 경험을 구체적으로 작성하시오.',
    competency: '책임감·공공성',
    guideKeywords: ['책임감', '공공성', '정확성', '문서관리']
  },
  {
    id: 'essay-002',
    text: '팀 내 갈등 또는 어려움을 해결한 경험과 본인의 역할을 작성하시오.',
    competency: '협업·문제해결',
    guideKeywords: ['협업', '문제해결', '소통', '갈등관리']
  },
  {
    id: 'essay-003',
    text: '지원 직무와 관련해 준비한 역량과 입사 후 기여 방안을 작성하시오.',
    competency: '직무역량',
    guideKeywords: ['직무', '데이터', '관광', '안전', '행정', '분석']
  }
];
