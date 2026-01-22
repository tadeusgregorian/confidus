import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type CustomTabButtonProps = BottomTabBarButtonProps & {
  routeName?: string;
};

export function CustomTabButton(props: CustomTabButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { accessibilityState, children, routeName, ...pressableProps } = props;
  const isSelected = accessibilityState?.selected ?? false;
  
  // Get label from route name
  const getLabel = () => {
    if (!routeName) return '';
    if (routeName === 'index') return 'Lessons';
    if (routeName === 'visualisations') return 'Mind';
    if (routeName === 'profile') return 'Profile';
    return '';
  };

  return (
    <View style={styles.container}>
      <PlatformPressable
        {...pressableProps}
        style={[
          styles.button,
          isSelected 
            ? [styles.selectedButton, { backgroundColor: colors.tabBarActiveBg }]
            : [styles.unselectedButton, { backgroundColor: colors.tabBarInactiveBg }],
        ]}
        onPressIn={(ev) => {
          if (process.env.EXPO_OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}>
        <View style={[styles.content, isSelected && styles.selectedContent]}>
          {children}
          {isSelected && (
            <Text style={[styles.label, { color: colors.tabIconSelected }]}>
              {getLabel()}
            </Text>
          )}
        </View>
      </PlatformPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  selectedButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 22,
    flexDirection: 'row',
    minHeight: 44,
    maxHeight: 52,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
