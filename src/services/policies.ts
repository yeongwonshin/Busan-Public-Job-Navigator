import { JobPosting, PolicyProgram, UserProfile } from '@/types';
import { includesAny } from '@/utils/text';

export function matchPolicies(profile: UserProfile, job: JobPosting | undefined, policies: PolicyProgram[]): PolicyProgram[] {
  const profileText = [
    profile.major,
    profile.targetCategories.join(' '),
    profile.certifications.join(' '),
    profile.experiences.map((experience) => experience.keywords.join(' ')).join(' ')
  ].join(' ');
  const jobText = job ? [job.title, job.jobCategory, job.roles.join(' '), job.tags.join(' '), job.preferences.keywords?.join(' ')].join(' ') : '';
  const source = `${profileText} ${jobText}`;

  return policies
    .map((policy) => ({
      policy,
      score: policy.triggerKeywords.reduce((acc, keyword) => acc + (includesAny(source, [keyword]) ? 1 : 0), 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.policy);
}
