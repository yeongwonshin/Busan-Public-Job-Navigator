import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { JobCard } from '@/components/JobCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { useAppData } from '@/context/AppDataContext';
import { rankJobs } from '@/services/eligibility';
import { buildRoadmap } from '@/services/roadmap';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatShortDate } from '@/utils/dates';

export function RoadmapScreen() {
  const { profile, jobs } = useAppData();
  const ranked = useMemo(() => rankJobs(profile, jobs), [jobs, profile]);
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(ranked[0]?.job.id);
  const selected = ranked.find((item) => item.job.id === selectedJobId) ?? ranked[0];
  const [done, setDone] = useState<Record<string, boolean>>({});
  const tasks = useMemo(() => selected ? buildRoadmap(profile, selected.job, selected.result) : [], [profile, selected]);
  const completion = tasks.length ? Math.round((tasks.filter((task) => done[task.id]).length / tasks.length) * 100) : 0;

  if (!selected) return <Screen><EmptyState title="로드맵을 만들 공고가 없습니다" description="DIVE 데이터셋을 가져오면 개인별 준비 일정이 생성됩니다." /></Screen>;

  return (
    <Screen title="개인 취업 로드맵" subtitle="공고 마감일과 준비 수준을 기준으로 오늘 할 일을 자동 정렬합니다.">
      <Section title="로드맵 기준 공고">
        <JobCard job={selected.job} result={selected.result} />
        <View style={styles.picker}>
          {ranked.slice(0, 4).map(({ job }) => (
            <Pressable key={job.id} onPress={() => setSelectedJobId(job.id)}>
              <Badge label={job.institution} tone={selected.job.id === job.id ? 'primary' : 'neutral'} />
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title="진행률">
        <Card compact>
          <ProgressBar value={completion} label="로드맵 완료율" />
          <Text style={styles.description}>{tasks.length}개 중 {tasks.filter((task) => done[task.id]).length}개 완료</Text>
        </Card>
      </Section>

      <Section title="해야 할 일">
        {tasks.map((task) => (
          <Pressable key={task.id} onPress={() => setDone((prev) => ({ ...prev, [task.id]: !prev[task.id] }))}>
            <Card compact>
              <View style={styles.taskRow}>
                <Text style={styles.checkbox}>{done[task.id] ? '✅' : '⬜️'}</Text>
                <View style={styles.taskBody}>
                  <View style={styles.taskHeader}>
                    <Text style={[styles.taskTitle, done[task.id] && styles.completed]}>{task.title}</Text>
                    <Badge label={task.priority} tone={task.priority === '높음' ? 'danger' : 'primary'} />
                  </View>
                  <Text style={styles.description}>{task.description}</Text>
                  <Text style={styles.date}>{task.dueDate ? formatShortDate(task.dueDate) : '일정 미정'} · {task.category}</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        ))}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  picker: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  description: { ...typography.body, color: colors.muted },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: { fontSize: 22, marginRight: spacing.sm, marginTop: 2 },
  taskBody: { flex: 1 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  taskTitle: { ...typography.h3, color: colors.ink, flex: 1 },
  completed: { textDecorationLine: 'line-through', color: colors.muted },
  date: { ...typography.caption, color: colors.primary, marginTop: spacing.sm, fontWeight: '800' }
});
