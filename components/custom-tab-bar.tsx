import { FontAwesome5 } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { isVisualisationOverdue } from "@/utils/storage";
import { CustomTabButton } from "./custom-tab-button";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [showVisualisationBadge, setShowVisualisationBadge] = useState(false);

  useEffect(() => {
    checkOverdue()
  }, []);

  const checkOverdue = async () => {
    const overdue = await isVisualisationOverdue();
    setShowVisualisationBadge(overdue);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBar,
          bottom: Platform.OS === "ios" ? 32 : 24,
          left: SCREEN_WIDTH / 2,
          transform: [{ translateX: '-50%' }],
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
          if (route.name === "moments") return "bolt";
          if (route.name === "visualisations") return "brain";
          return "circle";
        };

        const showBadge = route.name === "visualisations" && showVisualisationBadge ;

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
                size={18}
                color={isFocused ? colors.tabIconSelected : colors.tabIconDefault}
                solid
              />
              {showBadge && <View style={styles.badge} />}
            </View>
          </CustomTabButton>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 64,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
});
