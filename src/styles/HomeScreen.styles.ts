import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';

export function useHomeStyles() {
  const theme = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
          gap: theme.spacing.sm,
        },
        title: {
          ...theme.typography.subheading,
          color: theme.colors.text,
        },
        subtitle: {
          ...theme.typography.caption,
          color: theme.colors.textMuted,
          marginBottom: theme.spacing.lg,
        },
        button: {
          backgroundColor: theme.colors.primary,
          borderRadius: 8,
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
        },
        buttonText: {
          color: theme.colors.onPrimary,
          ...theme.typography.body,
          fontWeight: '600',
        },
      }),
    [theme],
  );
}
