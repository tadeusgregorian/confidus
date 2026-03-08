import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Lesson = {
  id: string;
  title: string;
  description: string;
  tag: 'theory' | 'meditation';
  duration: string;
  separationLine?: boolean;
  sectionNumber?: number;
};

const dummyLessons: Lesson[] = [
  {
    id: 'intro',
    title: 'Introduction',
    description:
      'Start your journey here. It explains the Lessons and how the App works.',
    tag: 'theory',
    duration: '20:00',
    separationLine: true,
    sectionNumber: 1,
  },
  {
    id: '1',
    title: 'Gillian Butler',
    description: 'Confidence Comes After Action',
    tag: 'theory',
    duration: '15:30',
  },
  {
    id: '2',
    title: 'Gillian Butler',
    description: 'Confidence Comes After Action',
    tag: 'meditation',
    duration: '12:45',
    separationLine: true,
    sectionNumber: 2,
  },
  {
    id: '3',
    title: 'Susan Cain',
    description: 'Introversion Is Not Shyness',
    tag: 'theory',
    duration: '18:20',
  },
  {
    id: '4',
    title: 'Susan Cain',
    description: 'Introversion Is Not Shyness',
    tag: 'meditation',
    duration: '22:10',
    separationLine: true,
    sectionNumber: 3,
  },
  {
    id: '5',
    title: 'Susan Jeffers ',
    description: 'Confident people act despite fear',
    tag: 'theory',
    duration: '16:55',
  },
  {
    id: '6',
    title: 'Susan Jeffers ',
    description: 'Confident people act despite fear',
    tag: 'meditation',
    duration: '14:30',
  },
  {
    id: '7',
    title: 'Jon Kabat-Zinn',
    description: 'Full Catastrophe Living',
    tag: 'theory',
    duration: '16:55',
  },
  {
    id: '8',
    title: 'Jon Kabat-Zinn',
    description: 'Full Catastrophe Living',
    tag: 'meditation',
    duration: '14:30',
  },
];

export default function LessonsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const isDark = (colorScheme ?? 'light') === 'dark';

  const tagStyles = (tag: Lesson['tag']) => {
    if (tag === 'theory') {
      return {
        bg: isDark ? '#172554' : '#DBEAFE',
        text: isDark ? '#BFDBFE' : '#1D4ED8',
        label: 'Theory',
      };
    }

    return {
      bg: isDark ? '#3B0764' : '#F3E8FF',
      text: isDark ? '#E9D5FF' : '#7E22CE',
      label: 'Meditation',
    };
  };

  const renderSeparator = (item: Lesson) =>
    item.separationLine ? (
      <View style={styles.separationContainer}>
        <View style={[styles.separationLine, { backgroundColor: colors.hairline }]} />
        <View style={[styles.sectionNumberContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <ThemedText style={[styles.sectionNumber, { color: colors.muted }]}>
            {item.sectionNumber}
          </ThemedText>
        </View>
        <View style={[styles.separationLine, { backgroundColor: colors.hairline }]} />
      </View>
    ) : null;

  const renderLessonItem = ({ item }: { item: Lesson }) => {
    const isIntro = item.id === 'intro';
    const tag = tagStyles(item.tag);

    if (isIntro) {
      return (
        <View style={styles.groupWrap}>
          <View style={[styles.shadowWrap, { shadowColor: colors.shadow }]}>
            <Pressable
              style={({ pressed }) => [
                styles.introLessonItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.95 : 1,
                },
              ]}
              onPress={() => router.push(`/lesson/${item.id}`)}
            >
              <View style={[styles.introMediaFrame, { backgroundColor: colors.surface }]}> 
                <Image
                  source={{
                    uri: `https://picsum.photos/seed/${item.id}-dark/800/500`,
                  }}
                  style={styles.introImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.introOverlay}>
                  <View style={[styles.heroPill, { backgroundColor: 'rgba(15,23,42,0.72)' }]}>
                    <IconSymbol name="sparkles" size={13} color="#FFFFFF" />
                    <ThemedText style={styles.heroPillText}>Featured Start</ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.introTextContainer}>
                <ThemedText type="cardTitle" style={[styles.introTitle, { color: colors.text }]}> 
                  {item.title}
                </ThemedText>
                <ThemedText style={[styles.introDescription, { color: colors.muted }]}> 
                  {item.description}
                </ThemedText>

                <View style={styles.metaRow}>
                  <View style={[styles.tag, { backgroundColor: tag.bg }]}>
                    <ThemedText style={[styles.tagText, { color: tag.text }]}>{tag.label}</ThemedText>
                  </View>

                  <View style={[styles.metaPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <IconSymbol name="clock" size={13} color={colors.muted} />
                    <ThemedText style={[styles.metaPillText, { color: colors.muted }]}> 
                      {item.duration}
                    </ThemedText>
                  </View>

                  <View style={[styles.metaIconPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <IconSymbol name="headphones" size={16} color={colors.muted} />
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
          {renderSeparator(item)}
        </View>
      );
    }

    return (
      <View style={styles.groupWrap}>
        <View style={[styles.shadowWrap, { shadowColor: colors.shadow }]}>
          <Pressable
            style={({ pressed }) => [
              styles.lessonItem,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.94 : 1,
              },
            ]}
            onPress={() => router.push(`/lesson/${item.id}`)}
          >
            <View style={styles.lessonContent}>
              <View style={[styles.lessonImageFrame, { backgroundColor: colors.surface }]}> 
                <Image
                  source={{
                    uri: `https://picsum.photos/seed/${item.id}-dark/220/220`,
                  }}
                  style={styles.lessonImage}
                  contentFit="cover"
                  transition={200}
                />
              </View>

              <View style={styles.lessonTextContainer}>
                <View style={styles.lessonTopRow}>
                  <View style={[styles.tag, styles.tagCompact, { backgroundColor: tag.bg }]}>
                    <ThemedText style={[styles.tagText, { color: tag.text }]}>{tag.label}</ThemedText>
                  </View>
                  <View style={[styles.durationInline, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <IconSymbol name="clock" size={12} color={colors.muted} />
                    <ThemedText style={[styles.durationInlineText, { color: colors.muted }]}> 
                      {item.duration}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText type="cardTitle" style={[styles.lessonTitle, { color: colors.text }]}> 
                  {item.title}
                </ThemedText>
                <ThemedText
                  style={[styles.lessonDescription, { color: colors.muted }]}
                  numberOfLines={2}
                >
                  {item.description}
                </ThemedText>

                <View style={styles.footerRow}>
                  <ThemedText style={[styles.listenHint, { color: colors.mutedLight }]}>Tap to open lesson</ThemedText>
                  <View style={[styles.iconCapsule, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <IconSymbol name="headphones" size={15} color={colors.muted} />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
        {renderSeparator(item)}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={dummyLessons}
        renderItem={({ item }) => renderLessonItem({ item })}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
        style={[styles.list, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={[styles.heroCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, shadowColor: colors.shadow }]}>
              <View style={[styles.heroAccent, { backgroundColor: colors.accent }]} />
              <View style={styles.header}>
                <ThemedText type="title">Lessons</ThemedText>
                <ThemedText style={[styles.subtitle, { color: colors.muted }]}> 
                  Structured sessions for confidence, calm, and focus.
                </ThemedText>
                <View style={styles.headerStatsRow}>
                  <View style={[styles.statPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <ThemedText style={[styles.statValue, { color: colors.text }]}>8</ThemedText>
                    <ThemedText style={[styles.statLabel, { color: colors.muted }]}>Sessions</ThemedText>
                  </View>
                  <View style={[styles.statPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <ThemedText style={[styles.statValue, { color: colors.text }]}>3</ThemedText>
                    <ThemedText style={[styles.statLabel, { color: colors.muted }]}>Modules</ThemedText>
                  </View>
                  <View style={[styles.statPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <ThemedText style={[styles.statValue, { color: colors.text }]}>2h+</ThemedText>
                    <ThemedText style={[styles.statLabel, { color: colors.muted }]}>Audio</ThemedText>
                  </View>
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
    paddingBottom: 16,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  heroAccent: {
    height: 6,
    width: '100%',
  },
  header: {
    padding: 18,
    gap: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  headerStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statPill: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 3,
  },
  groupWrap: {
    marginBottom: 12,
  },
  shadowWrap: {
    borderRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  lessonItem: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 10,
    gap: 12,
  },
  lessonImageFrame: {
    width: 92,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 2,
  },
  lessonImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  lessonTextContainer: {
    flex: 1,
    paddingVertical: 2,
  },
  lessonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 3,
  },
  lessonDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listenHint: {
    fontSize: 11,
    lineHeight: 14,
  },
  iconCapsule: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  introLessonItem: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  introMediaFrame: {
    padding: 2,
    position: 'relative',
  },
  introImage: {
    width: '100%',
    height: 208,
    borderRadius: 16,
  },
  introOverlay: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 14,
  },
  introTextContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
  },
  introTitle: {
    fontSize: 21,
    lineHeight: 26,
    marginBottom: 4,
  },
  introDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  tagCompact: {
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  metaPillText: {
    fontSize: 11,
    lineHeight: 14,
  },
  metaIconPill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  durationInline: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  durationInlineText: {
    fontSize: 10,
    lineHeight: 12,
  },
  separationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 2,
    marginHorizontal: 12,
    gap: 10,
  },
  separationLine: {
    flex: 1,
    height: 1,
  },
  sectionNumberContainer: {
    minWidth: 34,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  sectionNumber: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 14,
  },
});
