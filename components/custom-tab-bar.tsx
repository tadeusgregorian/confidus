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
          bottom: 0,
          left: 0,
          right: 0,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.tabBar,
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
          if (route.name === "dashboard") return "home";
          if (route.name === "index") return "book-open";
          if (route.name === "sessions") return "brain";
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
                {showBadge && <View style={styles.badge} />}
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
    width: "100%",
    height: Platform.OS === "ios" ? 92 : 78,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 8,
    gap: 8,
    borderWidth: 0,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: "visible",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F43F5E",
    borderWidth: 0,
  },
});
