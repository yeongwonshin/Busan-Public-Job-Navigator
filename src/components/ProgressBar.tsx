import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clipped = Math.max(0, Math.min(100, value));
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {label ? <Text style={styles.label}>{label}</Text> : <View />}
        <Text style={styles.value}>{clipped}점</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clipped}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { ...typography.caption, color: colors.muted },
  value: { ...typography.caption, color: colors.primary, fontWeight: '800' },
  track: { height: 8, backgroundColor: colors.subtle, borderRadius: 999, overflow: 'hidden' },
  fill: { height: 8, backgroundColor: colors.primary, borderRadius: 999 }
});
