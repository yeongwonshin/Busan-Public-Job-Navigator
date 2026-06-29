import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { essayQuestions } from '@/data/essayQuestions';
import { useAppData } from '@/context/AppDataContext';
import { buildEssaySuggestion } from '@/services/essayCoach';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function EssayCoachScreen() {
  const { profile } = useAppData();
  const [questionId, setQuestionId] = useState(essayQuestions[0].id);
  const [draft, setDraft] = useState('');
  const question = essayQuestions.find((item) => item.id === questionId) ?? essayQuestions[0];
  const suggestion = useMemo(() => buildEssaySuggestion(profile, question), [profile, question]);
  const draftScore = useMemo(() => {
    const lengthScore = Math.min(40, Math.round(draft.length / 15));
    const keywordScore = question.guideKeywords.reduce((acc, keyword) => acc + (draft.includes(keyword) ? 10 : 0), 0);
    const starScore = ['상황', '목표', '행동', '결과'].reduce((acc, keyword) => acc + (draft.includes(keyword) ? 5 : 0), 0);
    return Math.min(100, lengthScore + keywordScore + starScore);
  }, [draft, question.guideKeywords]);

  return (
    <Screen title="자기소개서 코치" subtitle="공공기관 문항을 역량별로 분석하고 내 경험과 자동 매칭합니다.">
      <Section title="문항 선택">
        {essayQuestions.map((item) => (
          <Pressable key={item.id} onPress={() => setQuestionId(item.id)}>
            <Card compact>
              <View style={styles.questionHeader}>
                <Text style={styles.question}>{item.text}</Text>
                <Badge label={item.competency} tone={questionId === item.id ? 'primary' : 'neutral'} />
              </View>
            </Card>
          </Pressable>
        ))}
      </Section>

      <Section title="추천 경험">
        {suggestion.recommendedExperiences.map((experience) => (
          <Card key={experience.id} compact>
            <Text style={styles.cardTitle}>{experience.title}</Text>
            <Text style={styles.description}>{experience.description}</Text>
            {experience.impact ? <Text style={styles.impact}>성과: {experience.impact}</Text> : null}
            <View style={styles.badges}>{experience.keywords.map((keyword) => <Badge key={keyword} label={keyword} />)}</View>
          </Card>
        ))}
      </Section>

      <Section title="작성 구조">
        <Card compact>
          {suggestion.structure.map((line) => <Text key={line} style={styles.bullet}>• {line}</Text>)}
        </Card>
      </Section>

      <Section title="초안 작성">
        <Card compact>
          <Text style={styles.sample}>{suggestion.sampleOpening}</Text>
          <TextInput
            style={styles.textarea}
            placeholder="여기에 자기소개서 초안을 작성하세요."
            value={draft}
            onChangeText={setDraft}
            multiline
            placeholderTextColor={colors.muted}
          />
          <ProgressBar value={draftScore} label="문항 적합도 간이 점검" />
          {suggestion.warnings.map((warning) => <Text key={warning} style={styles.warning}>⚠️ {warning}</Text>)}
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  question: { ...typography.body, color: colors.ink, flex: 1, fontWeight: '700' },
  cardTitle: { ...typography.h3, color: colors.ink },
  description: { ...typography.body, color: colors.muted, marginTop: spacing.xs },
  impact: { ...typography.body, color: colors.primary, marginTop: spacing.xs, fontWeight: '700' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  bullet: { ...typography.body, color: colors.muted, marginBottom: spacing.xs },
  sample: { ...typography.body, color: colors.primaryDark, fontWeight: '700', marginBottom: spacing.md },
  textarea: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: spacing.md,
    textAlignVertical: 'top',
    ...typography.body,
    color: colors.ink,
    backgroundColor: colors.background
  },
  warning: { ...typography.caption, color: colors.danger, marginTop: spacing.xs }
});
