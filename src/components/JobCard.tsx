import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { EligibilityResult, JobPosting } from '@/types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dDayLabel, formatDate } from '@/utils/dates';

const statusLabel = {
  eligible: { label: '바로 지원 가능', tone: 'success' as const },
  'needs-prep': { label: '준비 후 가능', tone: 'warning' as const },
  'not-eligible': { label: '지원 어려움', tone: 'danger' as const }
};

export function JobCard({ job, result, onPress }: { job: JobPosting; result?: EligibilityResult; onPress?: () => void }) {
  const matched = result ? statusLabel[result.status] : undefined;
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card>
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <Text style={styles.institution}>{job.institution}</Text>
            <Text style={styles.title}>{job.title}</Text>
          </View>
          <Badge label={dDayLabel(job.applicationEndAt)} tone="primary" />
        </View>
        <View style={styles.badges}>
          <Badge label={job.employmentType} />
          <Badge label={job.jobCategory} />
          {matched ? <Badge label={matched.label} tone={matched.tone} /> : null}
        </View>
        <Text style={styles.meta}>접수마감 {formatDate(job.applicationEndAt)}</Text>
        <Text style={styles.roles}>{job.roles.join(' · ')}</Text>
        {result ? <ProgressBar value={result.score} label="준비 적합도" /> : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleWrap: { flex: 1, paddingRight: spacing.sm },
  institution: { ...typography.caption, color: colors.primary, fontWeight: '800', marginBottom: 3 },
  title: { ...typography.h3, color: colors.ink },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  meta: { ...typography.caption, color: colors.muted, marginTop: spacing.xs },
  roles: { ...typography.body, color: colors.ink, marginTop: spacing.xs }
});
