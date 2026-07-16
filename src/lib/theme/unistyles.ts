import { UnistylesRegistry } from 'react-native-unistyles';
import { lightColors, darkColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { breakpoints } from './breakpoints';

const lightTheme = { colors: lightColors, spacing, typography };
const darkTheme = { colors: darkColors, spacing, typography };

UnistylesRegistry.addThemes({ light: lightTheme, dark: darkTheme })
  .addBreakpoints(breakpoints)
  .addConfig({ adaptiveThemes: true });

export type AppTheme = typeof lightTheme;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme;
    dark: AppTheme;
  }
  export interface UnistylesBreakpoints {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  }
}
