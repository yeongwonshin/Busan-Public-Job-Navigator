import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { useAppData } from '@/context/AppDataContext';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatDate } from '@/utils/dates';

const toneByType = {
  new: 'success' as const,
  updated: 'warning' as const,
  closed: 'danger' as const,
  deleted: 'danger' as const
};

const labelByField: Record<string, string> = {
  job: '공고',
  title: '제목',
  institution: '기관명',
  employmentType: '고용형태',
  jobCategory: '직무분야',
  recruitCount: '모집인원',
  applicationStartAt: '접수시작',
  applicationEndAt: '접수마감',
  applicationUrl: '접수링크',
  applicationMethod: '접수방법'
};

export function ChangeCenterScreen() {
  const { changes, jobs } = useAppData();
  const jobMap = new Map(jobs.map((job) => [job.id, job]));

  return (
    <Screen title="공고 변경센터" subtitle="사용자가 원문을 다시 뒤지지 않아도 변경사항을 한눈에 확인합니다.">
      <Section title="변경 이력">
        {changes.length ? changes.map((change) => {
          const job = jobMap.get(change.jobId);
          return (
            <Card key={change.id} compact>
              <View style={styles.header}>
                <Text style={styles.title}>{job?.institution ?? '알 수 없는 기관'}</Text>
                <Badge label={change.type} tone={toneByType[change.type]} />
              </View>
              <Text style={styles.jobTitle}>{job?.title ?? change.after ?? change.before}</Text>
              <Text style={styles.description}>{labelByField[change.field] ?? change.field} 변경</Text>
              <Text style={styles.diff}>이전: {change.before ?? '-'}</Text>
              <Text style={styles.diff}>현재: {change.after ?? '-'}</Text>
              <Text style={styles.date}>{formatDate(change.detectedAt)}</Text>
            </Card>
          );
        }) : <EmptyState title="변경 이력이 없습니다" description="새 데이터셋을 가져오면 이전 데이터와 비교해 이력이 생성됩니다." />}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  title: { ...typography.h3, color: colors.ink, flex: 1 },
  jobTitle: { ...typography.body, color: colors.primary, fontWeight: '700', marginTop: spacing.xs },
  description: { ...typography.body, color: colors.muted, marginTop: spacing.sm },
  diff: { ...typography.caption, color: colors.muted, marginTop: 3 },
  date: { ...typography.caption, color: colors.primary, fontWeight: '800', marginTop: spacing.sm }
});
