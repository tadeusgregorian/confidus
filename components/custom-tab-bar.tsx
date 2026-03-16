import { FontAwesome5 } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { isCommitmentCompletedToday } from "@/utils/storage";
import { CustomTabButton } from "./custom-tab-button";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [showCalendarBadge, setShowCalendarBadge] = useState(false);

  useEffect(() => {
    checkCalendarStatus();
  }, [state.index]);

  const checkCalendarStatus = async () => {
    const commitmentCompleted = await isCommitmentCompletedToday();
    setShowCalendarBadge(!commitmentCompleted);
  };

  return (
    <View
      style={[
        styles.shell,
        {
          bottom: Platform.OS === "ios" ? 26 : 18,
          left: 16,
          right: 16,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.tabBar,
            borderColor: colors.hairline,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const getIconName = () => {
          if (route.name === "index") return "book-open";
          if (route.name === "sessions") return "layer-group";
          if (route.name === "moments") return "bolt";
          if (route.name === "calendar") return "calendar-check";
          return "circle";
        };

        const showBadge = route.name === "calendar" && showCalendarBadge;

          return (
            <CustomTabButton
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              routeName={route.name}
            >
              <View>
                <FontAwesome5
                  name={getIconName()}
                  size={17}
                  color={isFocused ? colors.tabIconSelected : colors.tabIconDefault}
                  solid
                />
                {showBadge && <View style={[styles.badge, { borderColor: colors.tabBar }]} />}
              </View>
            </CustomTabButton>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "relative",
    height: 70,
    borderRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    gap: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F43F5E",
    borderWidth: 2,
  },
});
