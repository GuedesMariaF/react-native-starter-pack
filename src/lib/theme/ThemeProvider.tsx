import { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

const lightTheme = { colors: lightColors, spacing, typography };
const darkTheme = { colors: darkColors, spacing, typography };

export type AppTheme = typeof lightTheme;

const ThemeContext = createContext<AppTheme>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = useMemo(
    () => (scheme === 'dark' ? darkTheme : lightTheme),
    [scheme],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
