import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function PrimaryButton({ title, onPress, variant = 'primary' }: { title: string; onPress: () => void; variant?: 'primary' | 'ghost' }) {
  const ghost = variant === 'ghost';
  return (
    <Pressable style={[styles.button, ghost && styles.ghost]} onPress={onPress} accessibilityRole="button">
      <Text style={[styles.text, ghost && styles.ghostText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: spacing.sm
  },
  ghost: {
    backgroundColor: colors.primaryLight
  },
  text: {
    ...typography.button,
    color: colors.surface
  },
  ghostText: {
    color: colors.primary
  }
});
