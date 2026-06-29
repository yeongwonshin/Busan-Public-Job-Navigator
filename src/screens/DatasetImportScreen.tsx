import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { useAppData } from '@/context/AppDataContext';
import { normalizeDatasetFromText } from '@/services/datasetAdapter';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function DatasetImportScreen() {
  const { importJobs, resetToSample } = useAppData();
  const [log, setLog] = useState<string>('아직 가져온 데이터셋이 없습니다.');

  const pickDataset = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/csv', 'text/comma-separated-values', '*/*'], copyToCacheDirectory: true });
      if (result.canceled) return;
      const asset = result.assets[0];
      const raw = await FileSystem.readAsStringAsync(asset.uri);
      const normalized = normalizeDatasetFromText(raw, asset.name);
      const changes = await importJobs(normalized);
      setLog(`${asset.name}에서 ${normalized.length}개 공고를 변환했습니다. 변경 감지 ${changes.length}건.`);
      Alert.alert('가져오기 완료', `${normalized.length}개 공고가 반영되었습니다.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      setLog(`가져오기 실패: ${message}`);
      Alert.alert('가져오기 실패', message);
    }
  };

  return (
    <Screen title="DIVE 2026 데이터셋 가져오기" subtitle="제공받은 JSON/CSV 파일을 표준 채용공고 스키마로 변환합니다.">
      <Section title="데이터셋 준비 방식">
        <Card compact>
          <Text style={styles.text}>1. 운영 측에서 받은 원본 데이터셋을 JSON 또는 CSV로 저장합니다.</Text>
          <Text style={styles.text}>2. 컬럼명이 다르면 `data/mappings/dive2026.mapping.json`의 후보 컬럼명을 추가합니다.</Text>
          <Text style={styles.text}>3. 앱에서 파일을 선택하면 지원자격·우대조건·일정·주의사항을 표준 구조로 변환합니다.</Text>
        </Card>
      </Section>
      <Section title="가져오기 실행">
        <Card compact>
          <Text style={styles.log}>{log}</Text>
          <PrimaryButton title="JSON/CSV 데이터셋 선택" onPress={pickDataset} />
          <PrimaryButton title="샘플 데이터로 되돌리기" variant="ghost" onPress={resetToSample} />
        </Card>
      </Section>
      <Section title="변환 후 사용되는 기능">
        <Card compact>
          <Text style={styles.text}>• 개인 프로필 기반 지원 가능/준비 후 가능/지원 어려움 분류</Text>
          <Text style={styles.text}>• 공고 요약, 주의사항 하이라이트, 마감 D-Day</Text>
          <Text style={styles.text}>• 공고 변경 감지와 로드맵 자동 생성</Text>
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: { ...typography.body, color: colors.muted, marginBottom: spacing.sm },
  log: { ...typography.body, color: colors.ink, fontWeight: '700', marginBottom: spacing.md }
});
