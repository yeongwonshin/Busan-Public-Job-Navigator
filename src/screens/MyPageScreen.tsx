import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { useAppData } from '@/context/AppDataContext';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function MyPageScreen() {
  const navigation = useNavigation<any>();
  const { profile, jobs, resetToSample } = useAppData();

  return (
    <Screen title="마이페이지" subtitle="프로필과 데이터셋을 관리합니다.">
      <Section title="내 프로필">
        <Card>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.description}>{profile.residence} · {profile.educationStatus} · {profile.major}</Text>
          <View style={styles.badges}>
            {profile.certifications.map((cert) => <Badge key={cert} label={cert} tone="primary" />)}
          </View>
          <ProgressBar value={profile.ncsReadiness} label="NCS 준비도" />
          <ProgressBar value={profile.essayReadiness} label="자기소개서 준비도" />
          <ProgressBar value={profile.interviewReadiness} label="면접 준비도" />
          <PrimaryButton title="프로필 수정" onPress={() => navigation.navigate('Onboarding')} />
        </Card>
      </Section>

      <Section title="DIVE 2026 데이터셋 연동">
        <Card compact>
          <Text style={styles.cardTitle}>현재 {jobs.length}개 공고가 앱에 로드되어 있습니다.</Text>
          <Text style={styles.description}>제공받는 JSON/CSV 파일을 가져오면 표준 채용공고 스키마로 변환하고 변경사항을 추적합니다.</Text>
          <PrimaryButton title="데이터셋 가져오기" onPress={() => navigation.navigate('DatasetImport')} />
          <PrimaryButton title="샘플 데이터로 초기화" variant="ghost" onPress={resetToSample} />
        </Card>
      </Section>

      <Section title="변경센터">
        <Card compact>
          <Text style={styles.cardTitle}>공고 변경 감지</Text>
          <Text style={styles.description}>마감일, 모집인원, 신규 공고, 링크 변경을 추적합니다.</Text>
          <PrimaryButton title="변경센터 열기" variant="ghost" onPress={() => navigation.navigate('ChangeCenter')} />
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { ...typography.h2, color: colors.ink },
  description: { ...typography.body, color: colors.muted, marginTop: spacing.xs },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  cardTitle: { ...typography.h3, color: colors.ink }
});
