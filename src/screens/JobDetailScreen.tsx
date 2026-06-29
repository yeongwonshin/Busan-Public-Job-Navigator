import React, { useMemo, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { useAppData } from '@/context/AppDataContext';
import { evaluateJob } from '@/services/eligibility';
import { addRoadmapToCalendar, scheduleDeadlineNotification } from '@/services/notifications';
import { matchPolicies } from '@/services/policies';
import { buildRoadmap } from '@/services/roadmap';
import { extractRiskHighlights, summarizeJob } from '@/services/summary';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function JobDetailScreen() {
  const route = useRoute<any>();
  const { jobs, profile, policies } = useAppData();
  const [saving, setSaving] = useState(false);
  const job = jobs.find((item) => item.id === route.params?.jobId);

  const result = useMemo(() => job ? evaluateJob(profile, job) : undefined, [job, profile]);
  const summary = useMemo(() => job ? summarizeJob(job) : undefined, [job]);
  const risks = useMemo(() => job ? extractRiskHighlights(job) : [], [job]);
  const roadmap = useMemo(() => job && result ? buildRoadmap(profile, job, result).slice(0, 5) : [], [job, profile, result]);
  const matchedPolicies = useMemo(() => job ? matchPolicies(profile, job, policies).slice(0, 2) : [], [job, policies, profile]);

  if (!job || !result || !summary) {
    return <Screen><EmptyState title="공고를 찾을 수 없습니다" description="공고 목록을 새로고침하거나 데이터셋을 다시 가져오세요." /></Screen>;
  }

  const openOriginal = () => {
    const url = job.applicationUrl ?? job.originalUrl;
    if (url) Linking.openURL(url);
    else Alert.alert('링크 없음', '원문 또는 접수 링크가 제공되지 않았습니다.');
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      await scheduleDeadlineNotification(job);
      await addRoadmapToCalendar(job, roadmap);
      Alert.alert('저장 완료', '마감 알림과 로드맵 일정을 기기에 저장했습니다.');
    } catch (error) {
      Alert.alert('저장 실패', '권한 또는 기기 설정을 확인하세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen title={job.institution} subtitle={job.title}>
      <Card>
        <View style={styles.badges}>
          <Badge label={job.employmentType} />
          <Badge label={job.jobCategory} tone="primary" />
          <Badge label={result.status === 'eligible' ? '바로 지원 가능' : result.status === 'needs-prep' ? '준비 후 가능' : '지원 어려움'} tone={result.status === 'eligible' ? 'success' : result.status === 'needs-prep' ? 'warning' : 'danger'} />
        </View>
        <Text style={styles.oneLine}>{summary.oneLine}</Text>
        <ProgressBar value={result.score} label="개인 준비 적합도" />
        <PrimaryButton title="원문/접수 링크 열기" onPress={openOriginal} />
        <PrimaryButton title={saving ? '저장 중...' : '마감 알림·캘린더 저장'} variant="ghost" onPress={saveSchedule} />
      </Card>

      <Section title="지원 판단 근거">
        <Card compact>
          <Text style={styles.subTitle}>강점</Text>
          {result.strengths.map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>)}
          <Text style={styles.subTitle}>보완 필요</Text>
          {result.gaps.length ? result.gaps.map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>) : <Text style={styles.bullet}>• 큰 보완 요소가 감지되지 않았습니다.</Text>}
        </Card>
      </Section>

      <Section title="AI 공고 요약">
        <InfoList title="지원자격" items={summary.qualification} />
        <InfoList title="우대조건" items={summary.preference} />
        <InfoList title="전형일정" items={summary.schedule} />
        <InfoList title="제출서류" items={summary.documents} />
      </Section>

      <Section title="놓치기 쉬운 위험요소">
        <Card compact>
          {risks.map((risk) => <Text key={risk} style={styles.warning}>⚠️ {risk}</Text>)}
        </Card>
      </Section>

      <Section title="오늘부터 할 일">
        {roadmap.map((task) => (
          <Card key={task.id} compact>
            <View style={styles.taskHeader}>
              <Text style={styles.cardTitle}>{task.title}</Text>
              <Badge label={task.priority} tone={task.priority === '높음' ? 'danger' : 'primary'} />
            </View>
            <Text style={styles.cardDescription}>{task.description}</Text>
          </Card>
        ))}
      </Section>

      <Section title="연결 가능한 청년 지원정책">
        {matchedPolicies.map((policy) => (
          <Card key={policy.id} compact>
            <Text style={styles.cardTitle}>{policy.title}</Text>
            <Text style={styles.cardDescription}>{policy.description}</Text>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card compact>
      <Text style={styles.subTitle}>{title}</Text>
      {items.map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>)}
    </Card>
  );
}

const styles = StyleSheet.create({
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  oneLine: { ...typography.h3, color: colors.ink, marginBottom: spacing.sm },
  subTitle: { ...typography.h3, color: colors.ink, marginTop: spacing.sm, marginBottom: spacing.xs },
  bullet: { ...typography.body, color: colors.muted, marginBottom: 4 },
  warning: { ...typography.body, color: colors.danger, marginBottom: 6 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...typography.h3, color: colors.ink, flex: 1 },
  cardDescription: { ...typography.body, color: colors.muted, marginTop: spacing.xs }
});
