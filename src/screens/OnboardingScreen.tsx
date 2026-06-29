import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { useAppData } from '@/context/AppDataContext';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { splitKeywords } from '@/utils/text';

export function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const { profile, setProfile } = useAppData();
  const [name, setName] = useState(profile.name);
  const [residence, setResidence] = useState(profile.residence);
  const [major, setMajor] = useState(profile.major);
  const [certifications, setCertifications] = useState(profile.certifications.join(', '));
  const [targets, setTargets] = useState(profile.targetCategories.join(', '));
  const [institutions, setInstitutions] = useState(profile.interestedInstitutions.join(', '));
  const [ncs, setNcs] = useState(String(profile.ncsReadiness));
  const [essay, setEssay] = useState(String(profile.essayReadiness));
  const [interview, setInterview] = useState(String(profile.interviewReadiness));

  const save = async () => {
    await setProfile({
      ...profile,
      name: name.trim() || profile.name,
      residence: residence.trim() || profile.residence,
      major: major.trim() || profile.major,
      certifications: splitKeywords(certifications),
      targetCategories: splitKeywords(targets),
      interestedInstitutions: splitKeywords(institutions),
      ncsReadiness: Number(ncs) || profile.ncsReadiness,
      essayReadiness: Number(essay) || profile.essayReadiness,
      interviewReadiness: Number(interview) || profile.interviewReadiness
    });
    Alert.alert('저장 완료', '프로필 기반 추천이 갱신되었습니다.');
    navigation.goBack();
  };

  return (
    <Screen title="프로필 설정" subtitle="지원 가능 공고 판단과 로드맵 생성을 위한 최소 정보입니다.">
      <Section title="기본 정보">
        <Card compact>
          <Field label="이름" value={name} onChangeText={setName} />
          <Field label="거주지" value={residence} onChangeText={setResidence} placeholder="예: 부산광역시 해운대구" />
          <Field label="전공" value={major} onChangeText={setMajor} placeholder="예: 컴퓨터공학" />
        </Card>
      </Section>
      <Section title="취업 준비 정보">
        <Card compact>
          <Field label="보유 자격증" value={certifications} onChangeText={setCertifications} placeholder="쉼표로 구분" />
          <Field label="희망 직무 분야" value={targets} onChangeText={setTargets} placeholder="도시·데이터, 금융·행정" />
          <Field label="관심 기관" value={institutions} onChangeText={setInstitutions} placeholder="부산도시공사, 부산교통공사" />
        </Card>
      </Section>
      <Section title="준비도 점수">
        <Card compact>
          <View style={styles.scoreRow}>
            <Field label="NCS" value={ncs} onChangeText={setNcs} keyboardType="number-pad" />
            <Field label="자소서" value={essay} onChangeText={setEssay} keyboardType="number-pad" />
            <Field label="면접" value={interview} onChangeText={setInterview} keyboardType="number-pad" />
          </View>
        </Card>
      </Section>
      <PrimaryButton title="프로필 저장" onPress={save} />
    </Screen>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboardType?: 'default' | 'number-pad' }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={styles.input}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, marginBottom: spacing.md },
  label: { ...typography.caption, color: colors.muted, marginBottom: 6, fontWeight: '800' },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: spacing.md,
    ...typography.body,
    color: colors.ink
  },
  scoreRow: { flexDirection: 'row', gap: spacing.sm }
});
