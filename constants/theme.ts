/**
 * App colors aligned with a clean, calm mindfulness aesthetic.
 * Light: soft off-white background, dark charcoal primary, muted greys.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#F5F8FA',
    tint: '#1A1A1A',
    icon: '#1A1A1A',
    tabIconDefault: '#555555',
    tabIconSelected: '#1A1A1A',
    muted: '#555555',
    mutedLight: '#AAAAAA',
    card: '#FFFFFF',
    tabBar: '#E0E6EB',
    tabBarActiveBg: '#FFFFFF',
    link: '#555555',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#ECEDEE',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#ECEDEE',
    muted: '#9BA1A6',
    mutedLight: '#687076',
    card: '#1C1E1F',
    tabBar: '#1C1E1F',
    tabBarActiveBg: '#2A2D2E',
    link: '#9BA1A6',
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
