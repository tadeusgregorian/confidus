/**
 * App colors aligned with a more editorial, premium mindfulness aesthetic.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#214C36',
    background: '#F7F1E7',
    tint: '#214C36',
    icon: '#7E766A',
    tabIconDefault: '#FFFFFF',
    tabIconSelected: '#FFFFFF',
    muted: '#7A7367',
    mutedLight: '#B2A897',
    card: '#FFFDF8',
    surface: '#FBF6EE',
    surfaceElevated: '#FFFDF8',
    border: '#E4D9C7',
    hairline: '#E4D9C7',
    accent: '#2D6A4F',
    accentSoft: '#E9F1E7',
    success: '#2D6A4F',
    successSoft: '#E2F0E6',
    warning: '#B8693B',
    warningSoft: '#F7E0C8',
    shadow: '#2B2116',
    tabBar: '#0F0F10',
    tabBarActiveBg: '#202124',
    tabBarInactiveBg: 'transparent',
    link: '#7A7367',
  },
  dark: {
    text: '#214C36',
    background: '#F7F1E7',
    tint: '#214C36',
    icon: '#7E766A',
    tabIconDefault: '#FFFFFF',
    tabIconSelected: '#FFFFFF',
    muted: '#7A7367',
    mutedLight: '#B2A897',
    card: '#FFFDF8',
    surface: '#FBF6EE',
    surfaceElevated: '#FFFDF8',
    border: '#E4D9C7',
    hairline: '#E4D9C7',
    accent: '#2D6A4F',
    accentSoft: '#E9F1E7',
    success: '#2D6A4F',
    successSoft: '#E2F0E6',
    warning: '#B8693B',
    warningSoft: '#F7E0C8',
    shadow: '#2B2116',
    tabBar: '#0F0F10',
    tabBarActiveBg: '#202124',
    tabBarInactiveBg: 'transparent',
    link: '#7A7367',
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
