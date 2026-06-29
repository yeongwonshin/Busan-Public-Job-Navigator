import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { JobCard } from '@/components/JobCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { useAppData } from '@/context/AppDataContext';
import { evaluateJob, rankJobs } from '@/services/eligibility';
import { matchPolicies } from '@/services/policies';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { JobPosting } from '@/types';
import { daysUntil } from '@/utils/dates';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { profile, jobs, policies, changes } = useAppData();
  const ranked = useMemo(() => rankJobs(profile, jobs), [jobs, profile]);
  const top = ranked[0];
  const suggestedPolicies = useMemo(() => matchPolicies(profile, top?.job, policies).slice(0, 3), [policies, profile, top?.job]);

  const stats = useMemo(() => {
    const eligible = jobs.filter((job) => evaluateJob(profile, job).status === 'eligible').length;
    const urgent = jobs.filter((job) => {
      const left = daysUntil(job.applicationEndAt);
      return left !== undefined && left >= 0 && left <= 7;
    }).length;
    return { eligible, urgent, total: jobs.length, changes: changes.length };
  }, [changes.length, jobs, profile]);

  return (
    <Screen title={`${profile.name}님, 오늘의 공공채용 내비`} subtitle="지원 가능한 공고와 오늘 해야 할 일을 먼저 보여드립니다.">
      <View style={styles.statsRow}>
        <Stat label="전체 공고" value={stats.total} />
        <Stat label="지원 가능" value={stats.eligible} />
        <Stat label="7일 내 마감" value={stats.urgent} />
      </View>

      {top ? (
        <Section title="가장 추천하는 공고">
          <JobCard job={top.job} result={top.result} onPress={() => navigation.navigate('JobDetail', { jobId: top.job.id })} />
        </Section>
      ) : null}

      <Section title="실시간 변경 감지">
        <Card compact>
          <View style={styles.changeRow}>
            <View>
              <Text style={styles.cardTitle}>{stats.changes}건의 변경 이력</Text>
              <Text style={styles.cardDescription}>마감일, 모집인원, 신규 공고를 놓치지 않도록 추적합니다.</Text>
            </View>
            <Badge label="변경센터" tone="warning" />
          </View>
          <PrimaryButton title="변경센터 보기" variant="ghost" onPress={() => navigation.navigate('ChangeCenter')} />
        </Card>
      </Section>

      <Section title="맞춤 청년지원 정책">
        {suggestedPolicies.map((policy) => (
          <Card key={policy.id} compact>
            <Text style={styles.cardTitle}>{policy.title}</Text>
            <Text style={styles.cardDescription}>{policy.description}</Text>
            <View style={styles.badgeLine}>
              <Badge label={policy.category} tone="primary" />
              {policy.triggerKeywords.slice(0, 2).map((keyword) => <Badge key={keyword} label={keyword} />)}
            </View>
          </Card>
        ))}
      </Section>

      <Section title="추천 공고 더 보기">
        {ranked.slice(1, 4).map(({ job, result }: { job: JobPosting; result: any }) => (
          <JobCard key={job.id} job={job} result={result} onPress={() => navigation.navigate('JobDetail', { jobId: job.id })} />
        ))}
      </Section>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card compact>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statValue: { ...typography.h2, color: colors.primary, textAlign: 'center' },
  statLabel: { ...typography.caption, color: colors.muted, textAlign: 'center' },
  changeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  cardTitle: { ...typography.h3, color: colors.ink },
  cardDescription: { ...typography.body, color: colors.muted, marginTop: spacing.xs },
  badgeLine: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md }
});
