/**
 * App colors aligned with a more editorial, premium mindfulness aesthetic.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#14181F',
    background: '#F2F5FA',
    tint: '#111827',
    icon: '#4B5563',
    tabIconDefault: '#B7C0CE',
    tabIconSelected: '#F8FAFC',
    muted: '#64748B',
    mutedLight: '#94A3B8',
    card: '#FFFFFF',
    surface: '#EEF2F8',
    surfaceElevated: '#FFFFFF',
    border: '#E2E8F0',
    hairline: '#DCE4EF',
    accent: '#1D4ED8',
    accentSoft: '#DBEAFE',
    success: '#0F766E',
    successSoft: '#CCFBF1',
    warning: '#D97706',
    warningSoft: '#FEF3C7',
    shadow: '#0F172A',
    tabBar: '#0F172A',
    tabBarActiveBg: '#1E293B',
    tabBarInactiveBg: '#111827',
    link: '#334155',
  },
  dark: {
    text: '#EEF2F7',
    background: '#090D14',
    tint: '#F8FAFC',
    icon: '#CBD5E1',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#F8FAFC',
    muted: '#94A3B8',
    mutedLight: '#64748B',
    card: '#111827',
    surface: '#0F172A',
    surfaceElevated: '#152033',
    border: '#1E293B',
    hairline: '#22324A',
    accent: '#60A5FA',
    accentSoft: '#1E3A8A',
    success: '#5EEAD4',
    successSoft: '#134E4A',
    warning: '#FBBF24',
    warningSoft: '#78350F',
    shadow: '#000000',
    tabBar: '#05080F',
    tabBarActiveBg: '#182235',
    tabBarInactiveBg: '#0D1524',
    link: '#CBD5E1',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
