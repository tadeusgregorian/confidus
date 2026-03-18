import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AudioItem = {
  id: string;
  title: string;
  duration: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const TITLES = [
  'The Curious Child',
  'The Strength Within',
  'Subconscious Roots',
  'Beginner’s Mind',
  'The Fearless Spark',
  'The Quiet Power',
  'The Hidden Giant',
  'The Courage Code',
  'The Inner Flame',
  'The Unshaken Self',
  'The Brave Unknown',
  'The Secret of Ease',
  'The Magnetic Presence',
  'The Confidence Instinct',
  'The Wild Heart',
  'The Open Door Within',
  'The Lion Beneath',
  'The Confident Current',
  'The Original Self',
  'The Bold Awakening',
] as const;

const DURATIONS = [
  '4:12',
  '6:08',
  '5:44',
  '7:03',
  '3:58',
  '6:30',
  '5:21',
  '4:47',
  '6:54',
  '5:11',
  '7:22',
  '4:25',
  '6:03',
  '5:36',
  '4:50',
  '6:42',
  '5:07',
  '4:40',
  '6:18',
  '5:33',
] as const;

const ICONS: ReadonlyArray<React.ComponentProps<typeof MaterialCommunityIcons>['name']> = [
  'flower-tulip-outline',
  'sprout-outline',
  'butterfly-outline',
  'meditation',
  'moon-waning-crescent',
  'weather-sunny',
  'star-four-points-outline',
  'shimmer',
  'waves',
  'water-outline',
  'fire',
  'lightning-bolt-outline',
  'heart-outline',
  'bird',
  'cloud-outline',
  'snowflake',
  'diamond-stone',
  'head-heart-outline',
  'compass-outline',
  'lightbulb-on-outline',
];

const audioItems: AudioItem[] = TITLES.map((title, index) => ({
  id: `m-${index + 1}`,
  title,
  duration: DURATIONS[index],
  icon: ICONS[index % ICONS.length],
}));

export default function MomentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={audioItems}
        numColumns={5}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
        columnWrapperStyle={styles.column}
        ListHeaderComponent={
          <View style={[styles.headerCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <ThemedText type="title">Moments</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
              Tap any symbol to open and play a short audio moment.
            </ThemedText>
          </View>
        }
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/lesson/[id]',
                params: {
                  id: item.id,
                  title: item.title,
                  duration: item.duration,
                  author: 'Moments',
                  category: 'Moment',
                },
              })
            }
            style={({ pressed }) => [
              styles.gridItem,
              index > 1 && styles.gridItemInactive,
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.glyphStack,
                {
                  backgroundColor: colors.surfaceElevated,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={17}
                  color={colors.accent}
                  style={index > 1 ? styles.softBlurIcon : undefined}
                />
              </View>
              <ThemedText
                style={[
                  styles.index,
                  { color: colors.muted },
                  index > 1 && styles.softBlurText,
                ]}
              >
                {`${index + 1}`.padStart(2, '0')}
              </ThemedText>
            </View>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 52,
    paddingHorizontal: 30,
    paddingBottom: 28,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gridItem: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
  },
  gridItemInactive: {
    opacity: 0.38,
    transform: [{ scale: 0.97 }],
  },
  glyphStack: {
    width: 56,
    borderRadius: 16,
    paddingTop: 6,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  index: {
    marginTop: 5,
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
  },
  softBlurIcon: {
    textShadowColor: 'rgba(17,24,39,0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  softBlurText: {
    textShadowColor: 'rgba(17,24,39,0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
