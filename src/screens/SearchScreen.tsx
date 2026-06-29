import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/EmptyState';
import { JobCard } from '@/components/JobCard';
import { Screen } from '@/components/Screen';
import { useAppData } from '@/context/AppDataContext';
import { evaluateJob } from '@/services/eligibility';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const FILTERS = ['전체', '바로 지원 가능', '준비 후 가능', '7일 내 마감', '데이터', '행정', '관광', '환경'];

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const { profile, jobs } = useAppData();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('전체');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs
      .map((job) => ({ job, result: evaluateJob(profile, job) }))
      .filter(({ job, result }) => {
        const haystack = [job.title, job.institution, job.jobCategory, job.roles.join(' '), job.tags.join(' ')].join(' ').toLowerCase();
        if (q && !haystack.includes(q)) return false;
        if (filter === '바로 지원 가능') return result.status === 'eligible';
        if (filter === '준비 후 가능') return result.status === 'needs-prep';
        if (filter === '7일 내 마감') {
          const days = Math.ceil((new Date(job.applicationEndAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return days >= 0 && days <= 7;
        }
        if (filter !== '전체') return haystack.includes(filter.toLowerCase());
        return true;
      })
      .sort((a, b) => b.result.score - a.result.score);
  }, [filter, jobs, profile, query]);

  return (
    <Screen title="공고 검색" subtitle="기관명보다 직무·자격·마감 기준으로 빠르게 찾으세요.">
      <TextInput
        style={styles.search}
        placeholder="기관, 직무, 자격증, 키워드 검색"
        value={query}
        onChangeText={setQuery}
        placeholderTextColor={colors.muted}
      />
      <View style={styles.filters}>
        {FILTERS.map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)}>
            <Badge label={item} tone={filter === item ? 'primary' : 'neutral'} />
          </Pressable>
        ))}
      </View>
      <Text style={styles.count}>{filtered.length}개 공고</Text>
      {filtered.length ? filtered.map(({ job, result }) => (
        <JobCard key={job.id} job={job} result={result} onPress={() => navigation.navigate('JobDetail', { jobId: job.id })} />
      )) : <EmptyState title="검색 결과가 없습니다" description="DIVE 데이터셋을 가져오거나 다른 키워드로 검색해보세요." />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
    ...typography.body,
    color: colors.ink,
    marginBottom: spacing.md
  },
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  count: { ...typography.caption, color: colors.muted, marginBottom: spacing.md }
});
