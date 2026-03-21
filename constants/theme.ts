/**
 * App colors aligned with a more editorial, premium mindfulness aesthetic.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#151A22',
    background: '#F3F4F6',
    tint: '#2E3645',
    icon: '#697386',
    tabIconDefault: 'rgba(210,217,255,0.62)',
    tabIconSelected: '#35255F',
    muted: '#6B7280',
    mutedLight: '#9CA3AF',
    card: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    border: '#E5E7EB',
    hairline: '#E5E7EB',
    accent: '#64748B',
    accentSoft: '#EEF2F7',
    success: '#16A34A',
    successSoft: '#DCFCE7',
    warning: '#A16207',
    warningSoft: '#FEF9C3',
    shadow: '#111827',
    tabBar: 'rgba(20,29,55,0.5)',
    tabBarActiveBg: '#BFC7FF',
    tabBarInactiveBg: 'transparent',
    link: '#4B5563',
  },
  dark: {
    text: '#E5E7EB',
    background: '#10131A',
    tint: '#E5E7EB',
    icon: '#A3ACBC',
    tabIconDefault: 'rgba(210,217,255,0.62)',
    tabIconSelected: '#35255F',
    muted: '#9CA3AF',
    mutedLight: '#6B7280',
    card: '#1A1F2B',
    surface: '#171C27',
    surfaceElevated: '#1E2431',
    border: '#2A3140',
    hairline: '#2A3140',
    accent: '#94A3B8',
    accentSoft: '#273042',
    success: '#4ADE80',
    successSoft: '#14532D',
    warning: '#EAB308',
    warningSoft: '#713F12',
    shadow: '#000000',
    tabBar: 'rgba(20,29,55,0.5)',
    tabBarActiveBg: '#BFC7FF',
    tabBarInactiveBg: 'transparent',
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
