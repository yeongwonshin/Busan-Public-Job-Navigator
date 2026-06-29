import { EssayQuestion, EssaySuggestion, UserProfile } from '@/types';

function scoreExperience(question: EssayQuestion, keywords: string[]): number {
  const lower = keywords.map((keyword) => keyword.toLowerCase());
  return question.guideKeywords.reduce((acc, keyword) => acc + (lower.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

export function buildEssaySuggestion(profile: UserProfile, question: EssayQuestion): EssaySuggestion {
  const recommendedExperiences = [...profile.experiences]
    .sort((a, b) => scoreExperience(question, b.keywords) - scoreExperience(question, a.keywords))
    .slice(0, 2);
  const primary = recommendedExperiences[0];

  return {
    questionId: question.id,
    recommendedExperiences,
    structure: [
      '상황: 기관·팀·이해관계자가 있는 구체적 배경을 2문장으로 설명합니다.',
      '과제: 본인이 책임진 목표와 제약조건을 수치로 제시합니다.',
      '행동: 본인이 직접 한 판단과 실행을 동사 중심으로 작성합니다.',
      '결과: 변화, 개선, 배운 점을 공공기관 직무 가치와 연결합니다.'
    ],
    warnings: [
      '학교명, 교수명, 가족관계, 출신지 등 블라인드 위반 가능 표현을 제거하세요.',
      '팀 성과만 쓰지 말고 본인의 의사결정과 기여를 분리해서 작성하세요.',
      '기관 미션과 연결되지 않는 추상적 표현은 줄이세요.'
    ],
    sampleOpening: primary
      ? `저는 ${primary.title} 경험에서 ${question.competency}을 실천했습니다. 당시 ${primary.description}`
      : `저는 ${question.competency}이 공공기관 직무 수행의 기본이라고 생각합니다.`
  };
}
