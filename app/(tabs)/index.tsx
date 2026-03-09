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
  category: 'theory' | 'meditation';
  duration: string;
};

type LessonGroup = {
  id: string;
  author: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  lessons: [AudioLesson, AudioLesson];
};

const lessonGroups: LessonGroup[] = [
  {
    id: 'butler',
    author: 'Gillian Butler',
    description: 'Confidence Comes After Action',
    imageUrl: 'https://picsum.photos/seed/lesson-butler/900/600',
    accentColor: '#4F46E5',
    lessons: [
      { id: '1', title: 'Confidence Comes After Action', category: 'theory', duration: '15:30' },
      { id: '2', title: 'Confidence Comes After Action', category: 'meditation', duration: '12:45' },
    ],
  },
  {
    id: 'cain',
    author: 'Susan Cain',
    description: 'Introversion Is Not Shyness',
    imageUrl: 'https://picsum.photos/seed/lesson-cain/900/600',
    accentColor: '#DB2777',
    lessons: [
      { id: '3', title: 'Introversion Is Not Shyness', category: 'theory', duration: '18:20' },
      { id: '4', title: 'Introversion Is Not Shyness', category: 'meditation', duration: '22:10' },
    ],
  },
  {
    id: 'jeffers',
    author: 'Susan Jeffers',
    description: 'Confident People Act Despite Fear',
    imageUrl: 'https://picsum.photos/seed/lesson-jeffers/900/600',
    accentColor: '#7C3AED',
    lessons: [
      { id: '5', title: 'Confident People Act Despite Fear', category: 'theory', duration: '16:55' },
      { id: '6', title: 'Confident People Act Despite Fear', category: 'meditation', duration: '14:30' },
    ],
  },
  {
    id: 'kabat-zinn',
    author: 'Jon Kabat-Zinn',
    description: 'Full Catastrophe Living',
    imageUrl: 'https://picsum.photos/seed/lesson-kabat-zinn/900/600',
    accentColor: '#D97706',
    lessons: [
      { id: '7', title: 'Full Catastrophe Living', category: 'theory', duration: '16:55' },
      { id: '8', title: 'Full Catastrophe Living', category: 'meditation', duration: '14:30' },
    ],
  },
];

export default function LessonsScreen() {
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
          <View
            style={[
              styles.categoryTag,
              {
                backgroundColor: lesson.category === 'theory' ? '#DBEAFE' : '#F3E8FF',
              },
            ]}
          >
            <ThemedText
              style={[
                styles.categoryTagText,
                {
                  color: lesson.category === 'theory' ? '#1D4ED8' : '#7E22CE',
                },
              ]}
            >
              {lesson.category === 'theory' ? 'Theory' : 'Meditation'}
            </ThemedText>
          </View>
          <ThemedText style={[styles.audioDot, { color: colors.mutedLight }]}>•</ThemedText>
          <ThemedText style={[styles.audioDuration, { color: colors.muted }]}>{lesson.duration}</ThemedText>
        </View>
      </View>

      <View style={[styles.audioChevron, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <IconSymbol name="chevron.right" size={15} color={colors.muted} />
      </View>
    </Pressable>
  );

  const renderGroupItem = ({ item }: { item: LessonGroup }) => (
    <View style={styles.groupContainer}>
      <View style={[styles.groupCardShadow, { shadowColor: colors.shadow }]}>
        <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.groupImageWrap}>
            <Image source={{ uri: item.imageUrl }} style={styles.groupImage} contentFit="cover" transition={200} />
            <View style={styles.imageOverlay} />
            <View style={styles.imageTopMeta}>
              <View style={[styles.imageBadge, { backgroundColor: 'rgba(15,23,42,0.68)' }]}>
                <IconSymbol name="headphones" size={12} color="#FFFFFF" />
                <ThemedText style={styles.imageBadgeText}>2 lessons</ThemedText>
              </View>
            </View>
            <View style={styles.imageTitleWrap}>
              <ThemedText type="cardTitle" style={styles.imageTitle}>
                {item.author}
              </ThemedText>
            </View>
          </View>

          <View style={styles.groupBody}>
            <View style={styles.descriptionRow}>
              <View style={[styles.accentDot, { backgroundColor: item.accentColor }]} />
              <ThemedText style={[styles.groupDescription, { color: colors.muted }]} numberOfLines={2}>
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
        data={lessonGroups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
        style={[styles.list, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View
              style={[
                styles.headerCard,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <View style={styles.headerTextBlock}>
                <ThemedText type="title">Lessons</ThemedText>
                <ThemedText style={[styles.subtitle, { color: colors.muted }]}>Grouped by author with two lesson tiles per card.</ThemedText>
              </View>
              <View style={styles.headerPillsRow}>
                <View style={[styles.headerPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <ThemedText style={[styles.headerPillText, { color: colors.text }]}>4 authors</ThemedText>
                </View>
                <View style={[styles.headerPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <ThemedText style={[styles.headerPillText, { color: colors.text }]}>8 lessons</ThemedText>
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
  groupContainer: {
    marginBottom: 20,
  },
  groupCardShadow: {
    borderRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  groupCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
  },
  groupImageWrap: {
    position: 'relative',
  },
  groupImage: {
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
  groupBody: {
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
  groupDescription: {
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
  categoryTag: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  categoryTagText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  audioDot: {
    marginHorizontal: 5,
    fontSize: 10,
    lineHeight: 14,
  },
  audioDuration: {
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
