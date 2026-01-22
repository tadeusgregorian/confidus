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

  // Get label from route name
  const getLabel = () => {
    if (!routeName) return "";
    if (routeName === "index") return "Lessons";
    if (routeName === "visualisations") return "Mind";
    if (routeName === "profile") return "Profile";
    return "";
  };

  return (
    <PlatformPressable
      {...pressableProps}
      style={[
        styles.button,
        isSelected
          ? [styles.selectedButton, { backgroundColor: colors.tabBarActiveBg }]
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
  },
  unselectedButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  selectedButton: {
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 26,
    flexDirection: "row",
    width: 110,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
