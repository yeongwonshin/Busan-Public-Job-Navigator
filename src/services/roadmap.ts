import { EligibilityResult, JobPosting, RoadmapTask, UserProfile } from '@/types';
import { addDays, daysUntil, toDate } from '@/utils/dates';

function task(id: string, title: string, category: RoadmapTask['category'], priority: RoadmapTask['priority'], description: string, dueDate?: string): RoadmapTask {
  return { id, title, category, priority, description, dueDate };
}

export function buildRoadmap(profile: UserProfile, job: JobPosting, result: EligibilityResult): RoadmapTask[] {
  const now = new Date();
  const end = toDate(job.applicationEndAt) ?? addDays(now, 7);
  const daysLeft = daysUntil(job.applicationEndAt) ?? 7;
  const tasks: RoadmapTask[] = [];

  tasks.push(task(
    `${job.id}-check-eligibility`,
    '지원자격 원문 대조',
    '자격확인',
    '높음',
    '학력·전공·자격증·거주지 요건을 원문 공고와 프로필 기준으로 다시 확인합니다.',
    addDays(now, 1)
  ));

  result.gaps.slice(0, 3).forEach((gap, index) => {
    tasks.push(task(
      `${job.id}-gap-${index}`,
      `보완 필요: ${gap}`,
      gap.includes('자격') ? '자격확인' : '서류',
      '높음',
      '지원 전 탈락 리스크를 줄이기 위한 우선 조치입니다.',
      addDays(now, Math.min(index + 1, Math.max(1, daysLeft - 2)))
    ));
  });

  tasks.push(task(
    `${job.id}-documents`,
    '증빙서류 폴더 만들기',
    '증빙',
    '높음',
    `${job.documents.join(', ')} 항목을 PDF 또는 이미지로 정리하고 파일명을 기관 양식에 맞춥니다.`,
    addDays(now, Math.max(1, daysLeft - 4))
  ));

  tasks.push(task(
    `${job.id}-essay`,
    '자기소개서 경험 매칭',
    '서류',
    '높음',
    `${profile.experiences[0]?.title ?? '대표 경험'}을 STAR 구조로 정리하고 블라인드 위반 표현을 제거합니다.`,
    addDays(now, Math.max(1, daysLeft - 3))
  ));

  if (job.process.some((stage) => stage.name.includes('필기')) || job.tags.includes('NCS')) {
    tasks.push(task(
      `${job.id}-ncs`,
      'NCS 7일 집중 루틴',
      '필기',
      profile.ncsReadiness < 60 ? '높음' : '중간',
      '의사소통·수리·문제해결 영역을 하루 2시간씩 풀고 오답 노트를 만듭니다.',
      addDays(now, Math.max(2, daysLeft - 2))
    ));
  }

  tasks.push(task(
    `${job.id}-submit`,
    '최종 제출 및 접수번호 캡처',
    '서류',
    '높음',
    '지원서 최종 제출 후 접수번호와 제출 완료 화면을 캡처합니다.',
    job.applicationEndAt
  ));

  job.process
    .filter((stage) => stage.name.includes('면접'))
    .forEach((stage, index) => {
      tasks.push(task(
        `${job.id}-interview-${index}`,
        `${stage.name} 예상질문 준비`,
        '면접',
        '중간',
        '기관 미션, 공공성, 직무 경험, 조직 적합성 질문에 대한 답변을 준비합니다.',
        stage.date ? `${stage.date}T09:00:00+09:00` : undefined
      ));
    });

  return tasks.sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}
