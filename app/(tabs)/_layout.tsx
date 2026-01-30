import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { CustomTabBar } from '@/components/custom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneContainerStyle: {
          paddingBottom: Platform.OS === 'ios' ? 104 : 96,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Lessons' }} />
      <Tabs.Screen name="moments" options={{ title: 'Moments' }} />
      <Tabs.Screen name="visualisations" options={{ title: 'Mind' }} />
    </Tabs>
  );
}
