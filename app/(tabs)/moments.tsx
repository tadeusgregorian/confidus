import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AudioLesson = {
  id: string;
  title: string;
  duration: string;
};

type Moment = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  lessons: AudioLesson[];
};

const dummyMoments: Moment[] = [
  {
    id: '1',
    title: 'Before a Big Meeting',
    description:
      'Calm your nerves and boost your confidence before important conversations',
    imageUrl: 'https://picsum.photos/seed/meeting-calm/400/250',
    accentColor: '#4F46E5',
    lessons: [
      { id: '1a', title: '3-Minute Calm Breathing', duration: '3:00' },
      { id: '1b', title: 'Confidence Affirmations', duration: '5:30' },
      { id: '1c', title: 'Power Pose Visualization', duration: '4:15' },
    ],
  },
  {
    id: '2',
    title: 'Feeling Overwhelmed',
    description:
      'Reset your mind when everything feels like too much to handle',
    imageUrl: 'https://picsum.photos/seed/overwhelmed-peace/400/250',
    accentColor: '#DB2777',
    lessons: [
      { id: '2a', title: 'Grounding Exercise', duration: '4:00' },
      { id: '2b', title: 'Release the Pressure', duration: '6:45' },
    ],
  },
  {
    id: '3',
    title: "Can't Fall Asleep",
    description:
      'Gentle meditations to quiet your racing mind and drift into rest',
    imageUrl: 'https://picsum.photos/seed/sleep-night/400/250',
    accentColor: '#7C3AED',
    lessons: [
      { id: '3a', title: 'Body Scan Relaxation', duration: '8:00' },
      { id: '3b', title: 'Counting Breaths', duration: '5:00' },
      { id: '3c', title: 'Sleep Story: The Forest', duration: '12:30' },
    ],
  },
  {
    id: '4',
    title: 'Need an Energy Boost',
    description:
      'Quick exercises to re-energize your body and sharpen your focus',
    imageUrl: 'https://picsum.photos/seed/energy-boost/400/250',
    accentColor: '#D97706',
    lessons: [
      { id: '4a', title: 'Energizing Breathwork', duration: '3:30' },
      { id: '4b', title: 'Quick Mindful Movement', duration: '5:00' },
    ],
  },
];

export default function MomentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderAudioLesson = (lesson: AudioLesson, accentColor: string) => (
    <Pressable
      key={lesson.id}
      style={({ pressed }) => [
        styles.audioLesson,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      onPress={() => router.push(`/lesson/${lesson.id}`)}
    >
      <View style={[styles.playIconContainer, { backgroundColor: accentColor }]}>
        <IconSymbol name="play.fill" size={12} color="#FFFFFF" />
      </View>

      <View style={styles.audioTextBlock}>
        <ThemedText style={[styles.audioTitle, { color: colors.text }]} numberOfLines={1}>
          {lesson.title}
        </ThemedText>
        <View style={styles.audioMetaRow}>
          <ThemedText style={[styles.audioDuration, { color: colors.muted }]}>
            {lesson.duration}
          </ThemedText>
          <ThemedText style={[styles.audioDot, { color: colors.mutedLight }]}>•</ThemedText>
          <ThemedText style={[styles.audioType, { color: colors.mutedLight }]}>Guided audio</ThemedText>
        </View>
      </View>

      <View style={[styles.audioChevron, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <IconSymbol name="chevron.right" size={15} color={colors.muted} />
      </View>
    </Pressable>
  );

  const renderMomentItem = ({ item }: { item: Moment }) => (
    <View style={styles.momentContainer}>
      <View style={[styles.momentCardShadow, { shadowColor: colors.shadow }]}> 
        <View style={[styles.momentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.momentImageWrap}>
            <Image source={{ uri: item.imageUrl }} style={styles.momentImage} contentFit="cover" transition={200} />
            <View style={styles.imageOverlay} />
            <View style={styles.imageTopMeta}>
              <View style={[styles.imageBadge, { backgroundColor: 'rgba(15,23,42,0.68)' }]}>
                <IconSymbol name="headphones" size={12} color="#FFFFFF" />
                <ThemedText style={styles.imageBadgeText}>{item.lessons.length} tracks</ThemedText>
              </View>
            </View>
            <View style={styles.imageTitleWrap}>
              <ThemedText type="cardTitle" style={styles.imageTitle}>
                {item.title}
              </ThemedText>
            </View>
          </View>

          <View style={styles.momentBody}>
            <View style={styles.descriptionRow}>
              <View style={[styles.accentDot, { backgroundColor: item.accentColor }]} />
              <ThemedText style={[styles.momentDescription, { color: colors.muted }]} numberOfLines={3}>
                {item.description}
              </ThemedText>
            </View>
            <View style={styles.lessonsContainer}>
              {item.lessons.map((lesson) => renderAudioLesson(lesson, item.accentColor))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={dummyMoments}
        renderItem={renderMomentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
        style={[styles.list, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={[styles.headerCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, shadowColor: colors.shadow }]}>
              <View style={styles.headerTextBlock}>
                <ThemedText type="title">Moments</ThemedText>
                <ThemedText style={[styles.subtitle, { color: colors.muted }]}> 
                  Quick, situational audio collections for real-life pressure points.
                </ThemedText>
              </View>
              <View style={styles.headerPillsRow}>
                <View style={[styles.headerPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <ThemedText style={[styles.headerPillText, { color: colors.text }]}>4 scenarios</ThemedText>
                </View>
                <View style={[styles.headerPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <ThemedText style={[styles.headerPillText, { color: colors.text }]}>Fast relief</ThemedText>
                </View>
              </View>
            </View>
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
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerWrap: {
    paddingTop: 52,
    paddingBottom: 14,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 5,
    gap: 12,
  },
  headerTextBlock: {
    gap: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  headerPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  headerPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  headerPillText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  momentContainer: {
    marginBottom: 20,
  },
  momentCardShadow: {
    borderRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  momentCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
  },
  momentImageWrap: {
    position: 'relative',
  },
  momentImage: {
    width: '100%',
    height: 190,
    backgroundColor: '#E2E8F0',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.18)',
  },
  imageTopMeta: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  imageTitleWrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
  },
  imageTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  momentBody: {
    padding: 14,
    gap: 12,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
  },
  momentDescription: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  lessonsContainer: {
    gap: 8,
  },
  audioLesson: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  playIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  audioTextBlock: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  audioMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  audioDuration: {
    fontSize: 11,
    lineHeight: 14,
  },
  audioDot: {
    marginHorizontal: 5,
    fontSize: 10,
    lineHeight: 14,
  },
  audioType: {
    fontSize: 11,
    lineHeight: 14,
  },
  audioChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
