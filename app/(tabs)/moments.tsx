import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AudioItem = {
  id: string;
  title: string;
  duration: string;
  imageUrl: string;
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

const audioItems: AudioItem[] = TITLES.map((title, index) => ({
  id: `${index + 1}`,
  title,
  duration: DURATIONS[index],
  imageUrl: `https://picsum.photos/seed/confidus-bw-${index + 1}/300/300?grayscale`,
}));

export default function MomentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = (colorScheme ?? 'light') === 'dark';

  const renderAudioItem = ({ item, index }: { item: AudioItem; index: number }) => (
    <Pressable
      onPress={() => router.push(`/lesson/${item.id}`)}
      style={({ pressed }) => [
        styles.audioCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={[styles.thumbFrame, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={120}
          cachePolicy="disk"
        />
      </View>

      <View style={styles.audioBody}>
        <ThemedText style={[styles.audioTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </ThemedText>
        <View style={styles.metaRow}>
          <View style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="headphones" size={12} color={colors.muted} />
            <ThemedText style={[styles.metaText, { color: colors.muted }]}>Audio</ThemedText>
          </View>
          <ThemedText style={[styles.dot, { color: colors.mutedLight }]}>•</ThemedText>
          <ThemedText style={[styles.metaText, { color: colors.muted }]}>{item.duration}</ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.playButton,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.06)',
            borderColor: colors.border,
          },
        ]}
      >
        <IconSymbol name="play.fill" size={14} color={colors.accent} />
      </View>

      <View style={[styles.rowIndexPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText style={[styles.rowIndexText, { color: colors.muted }]}>{`${index + 1}`.padStart(2, '0')}</ThemedText>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={audioItems}
        renderItem={renderAudioItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
        style={[styles.list, { backgroundColor: colors.background }]}
        ListHeaderComponent={
          <View style={[styles.headerCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, shadowColor: colors.shadow }]}> 
            <ThemedText type="title">Moments</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.muted }]}>A curated stream of short audio moments with monochrome art.</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 24,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  audioCard: {
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 92,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    position: 'relative',
  },
  thumbFrame: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  audioBody: {
    flex: 1,
    minWidth: 0,
  },
  audioTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'CrimsonPro_600SemiBold',
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Inter_500Medium',
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 11,
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  rowIndexPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  rowIndexText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
  },
});
