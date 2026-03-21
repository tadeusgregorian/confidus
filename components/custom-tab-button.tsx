import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type CustomTabButtonProps = BottomTabBarButtonProps & {
  routeName?: string;
};

export function CustomTabButton(props: CustomTabButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { accessibilityState, children, routeName, ...pressableProps } = props;
  const isSelected = accessibilityState?.selected ?? false;

  const getLabel = () => {
    if (!routeName) return "";
    if (routeName === "index") return "Lessons";
    if (routeName === "sessions") return "Sessions";
    if (routeName === "moments") return "Moments";
    if (routeName === "calendar") return "Calendar";
    return "";
  };

  return (
    <PlatformPressable
      {...pressableProps}
      style={[
        styles.button,
        isSelected
          ? [
              styles.selectedButton,
              {
                backgroundColor: colors.tabBarActiveBg,
                shadowColor: colors.tabBarActiveBg,
              },
            ]
          : [
              styles.unselectedButton,
              { backgroundColor: colors.tabBarInactiveBg },
            ],
      ]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    >
      <View style={styles.content}>
        {children}
        {isSelected && (
          <Text style={[styles.label, { color: colors.tabIconSelected }]}>
            {getLabel()}
          </Text>
        )}
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  unselectedButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  selectedButton: {
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 27,
    flexDirection: "row",
    minWidth: 118,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
});
