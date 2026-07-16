import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme';

export function useOnboardingStyles() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        content: {
          flex: 1,
          paddingHorizontal: theme.spacing.xl,
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 32,
          justifyContent: 'space-between',
          zIndex: 1,
        },
        top: {
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: 48,
          gap: theme.spacing.md,
        },
        title: {
          fontSize: 36,
          fontWeight: '700',
          lineHeight: 44,
          color: theme.colors.text,
        },
        description: {
          ...theme.typography.body,
          color: theme.colors.textMuted,
          lineHeight: 24,
        },
        bottom: {
          gap: theme.spacing.md,
        },
        button: {
          backgroundColor: theme.colors.primary,
          borderRadius: 100,
          paddingVertical: 16,
          alignItems: 'center',
        },
        buttonText: {
          color: theme.colors.onPrimary,
          ...theme.typography.body,
          fontWeight: '600',
        },
      }),
    [theme, insets],
  );
}
