import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface BadgeProps {
  label: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const toneColor = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    neutral: colors.muted
  }[tone];

  return (
    <View style={[styles.wrap, { backgroundColor: `${toneColor}18` }]}>
      <Text style={[styles.text, { color: toneColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6
  },
  text: {
    ...typography.caption,
    fontWeight: '800'
  }
});
