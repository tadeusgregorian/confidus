import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PathLesson = {
  id: string;
  title: string;
  author: string;
  category: 'Theory' | 'Meditation';
  duration: string;
  accentColor: string;
};

type Step = {
  lesson: PathLesson;
  side: 'left' | 'right';
  y: number;
  cardX: number;
  joinX: number;
};

const lessons: PathLesson[] = [
  {
    id: '1',
    title: 'Confidence Comes After Action',
    author: 'Gillian Butler',
    category: 'Theory',
    duration: '15:30',
    accentColor: '#5B8CFF',
  },
  {
    id: '2',
    title: 'Confidence Comes After Action',
    author: 'Gillian Butler',
    category: 'Meditation',
    duration: '12:45',
    accentColor: '#5B8CFF',
  },
  {
    id: '3',
    title: 'Introversion Is Not Shyness',
    author: 'Susan Cain',
    category: 'Theory',
    duration: '18:20',
    accentColor: '#F973B8',
  },
  {
    id: '4',
    title: 'Introversion Is Not Shyness',
    author: 'Susan Cain',
    category: 'Meditation',
    duration: '22:10',
    accentColor: '#F973B8',
  },
  {
    id: '5',
    title: 'Confident People Act Despite Fear',
    author: 'Susan Jeffers',
    category: 'Theory',
    duration: '16:55',
    accentColor: '#A78BFA',
  },
  {
    id: '6',
    title: 'Confident People Act Despite Fear',
    author: 'Susan Jeffers',
    category: 'Meditation',
    duration: '14:30',
    accentColor: '#A78BFA',
  },
  {
    id: '7',
    title: 'Full Catastrophe Living',
    author: 'Jon Kabat-Zinn',
    category: 'Theory',
    duration: '16:55',
    accentColor: '#F59E0B',
  },
  {
    id: '8',
    title: 'Full Catastrophe Living',
    author: 'Jon Kabat-Zinn',
    category: 'Meditation',
    duration: '14:30',
    accentColor: '#F59E0B',
  },
];

const sidePattern: Array<'left' | 'right'> = [
  'left',
  'right',
  'right',
  'left',
  'left',
  'right',
  'right',
  'left',
];

const ROW_HEIGHT = 124;
const CARD_HEIGHT = 100;
const TURN_RADIUS = 18;

export default function LessonsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isDark = (colorScheme ?? 'light') === 'dark';

  const palette = isDark
    ? {
        appBg: '#070D1A',
        panelBg: '#0B1328',
        panelBorder: '#1F2A44',
        title: '#F8FAFF',
        text: '#D3DBEC',
        subtle: '#8EA1C6',
        cardBg: '#101A31',
        cardBorder: '#243452',
        path: '#6CA0FF',
      }
    : {
        appBg: '#EEF4FF',
        panelBg: '#F8FBFF',
        panelBorder: '#D4E3FF',
        title: '#12203D',
        text: '#385073',
        subtle: '#5B7298',
        cardBg: '#FFFFFF',
        cardBorder: '#D7E3F8',
        path: '#5B8CFF',
      };

  const contentWidth = width - 32;
  const cardWidth = Math.min(Math.floor(contentWidth * 0.82), 420);
  const leftCardX = 0;
  const rightCardX = contentWidth - cardWidth;
  const joinOffset = 12;

  const steps: Step[] = lessons.map((lesson, index) => {
    const side = sidePattern[index] ?? 'right';
    const cardX = side === 'left' ? leftCardX : rightCardX;
    const joinX = side === 'left' ? cardX + cardWidth + joinOffset : cardX - joinOffset;
    const y = index * ROW_HEIGHT + ROW_HEIGHT / 2;

    return {
      lesson,
      side,
      y,
      cardX,
      joinX,
    };
  });

  const pathHeight = lessons.length * ROW_HEIGHT;

  return (
    <ThemedView style={[styles.container, { backgroundColor: palette.appBg }]}> 
      <ScrollView
        contentContainerStyle={[styles.listContent, { backgroundColor: palette.appBg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerCard, { backgroundColor: palette.panelBg, borderColor: palette.panelBorder }]}> 
          <ThemedText style={[styles.pathLabel, { color: palette.subtle }]}>Adaptive Learning Path</ThemedText>
          <ThemedText type="title" style={{ color: palette.title }}>
            Lessons
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: palette.text }]}>A curved dotted route connects every lesson as one continuous journey.</ThemedText>
        </View>

        <View style={[styles.pathCanvas, { height: pathHeight }]}> 
          {steps.slice(0, -1).map((current, index) => {
            const next = steps[index + 1];
            const x1 = current.joinX;
            const y1 = current.y;
            const x2 = next.joinX;
            const y2 = next.y;
            const dx = x2 - x1;
            const midY = (y1 + y2) / 2;
            const dir = dx > 0 ? 'right' : 'left';
            const r = Math.min(TURN_RADIUS, Math.abs(dx) / 2 - 4, Math.abs(y2 - y1) / 2 - 4);

            if (Math.abs(dx) < 2 || r < 4) {
              return (
                <View
                  key={`segment-${index}`}
                  style={[
                    styles.pathSegmentVertical,
                    {
                      left: x1,
                      top: y1,
                      height: y2 - y1,
                      borderColor: palette.path,
                    },
                  ]}
                />
              );
            }

            const horizontalLeft = Math.min(x1, x2) + r;
            const horizontalWidth = Math.abs(x2 - x1) - r * 2;

            return (
              <View key={`segment-${index}`}>
                <View
                  style={[
                    styles.pathSegmentVertical,
                    {
                      left: x1,
                      top: y1,
                      height: midY - y1 - r,
                      borderColor: palette.path,
                    },
                  ]}
                />

                {dir === 'right' ? (
                  <View
                    style={[
                      styles.cornerDownRight,
                      {
                        left: x1,
                        top: midY - r,
                        width: r,
                        height: r,
                        borderColor: palette.path,
                        borderBottomLeftRadius: r,
                      },
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      styles.cornerDownLeft,
                      {
                        left: x1 - r,
                        top: midY - r,
                        width: r,
                        height: r,
                        borderColor: palette.path,
                        borderBottomRightRadius: r,
                      },
                    ]}
                  />
                )}

                <View
                  style={[
                    styles.pathSegmentHorizontal,
                    {
                      top: midY,
                      left: horizontalLeft,
                      width: horizontalWidth,
                      borderColor: palette.path,
                    },
                  ]}
                />

                {dir === 'right' ? (
                  <View
                    style={[
                      styles.cornerRightDown,
                      {
                        left: x2 - r,
                        top: midY,
                        width: r,
                        height: r,
                        borderColor: palette.path,
                        borderTopRightRadius: r,
                      },
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      styles.cornerLeftDown,
                      {
                        left: x2,
                        top: midY,
                        width: r,
                        height: r,
                        borderColor: palette.path,
                        borderTopLeftRadius: r,
                      },
                    ]}
                  />
                )}

                <View
                  style={[
                    styles.pathSegmentVertical,
                    {
                      left: x2,
                      top: midY + r,
                      height: y2 - (midY + r),
                      borderColor: palette.path,
                    },
                  ]}
                />
              </View>
            );
          })}

          {steps.map((step, index) => {
            const { lesson, side } = step;

            return (
              <View key={lesson.id} style={[styles.stepRow, { top: index * ROW_HEIGHT, height: ROW_HEIGHT }]}> 
                <Pressable
                  style={({ pressed }) => [
                    styles.lessonCard,
                    {
                      width: cardWidth,
                      height: CARD_HEIGHT,
                      backgroundColor: palette.cardBg,
                      borderColor: palette.cardBorder,
                      opacity: pressed ? 0.9 : 1,
                    },
                    side === 'left' ? styles.lessonLeft : styles.lessonRight,
                  ]}
                  onPress={() => router.push(`/lesson/${lesson.id}`)}
                >
                  <View style={[styles.lessonTopRow, side === 'right' && styles.lessonTopRowRight]}>
                    <View style={[styles.playIcon, { backgroundColor: lesson.accentColor }]}> 
                      <IconSymbol name="play.fill" size={11} color="#FFFFFF" />
                    </View>
                    <ThemedText style={[styles.lessonAuthor, { color: lesson.accentColor }, side === 'right' && styles.rightAlignedText]}>
                      {lesson.author}
                    </ThemedText>
                  </View>

                  <ThemedText
                    style={[styles.lessonTitle, { color: palette.title }, side === 'right' && styles.rightAlignedText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {lesson.title}
                  </ThemedText>

                  <View style={[styles.lessonMetaRow, side === 'right' && styles.lessonMetaRowRight]}>
                    <ThemedText style={[styles.lessonMeta, { color: palette.text }]}>{lesson.category}</ThemedText>
                    <ThemedText style={[styles.lessonMetaDot, { color: palette.text }]}>•</ThemedText>
                    <ThemedText style={[styles.lessonMeta, { color: palette.text }]}>{lesson.duration}</ThemedText>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 32,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  pathLabel: {
    fontSize: 12,
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  pathCanvas: {
    position: 'relative',
  },
  pathSegmentVertical: {
    position: 'absolute',
    borderLeftWidth: 3,
    borderStyle: 'dotted',
  },
  pathSegmentHorizontal: {
    position: 'absolute',
    borderTopWidth: 3,
    borderStyle: 'dotted',
  },
  cornerDownRight: {
    position: 'absolute',
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderStyle: 'dotted',
  },
  cornerDownLeft: {
    position: 'absolute',
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderStyle: 'dotted',
  },
  cornerRightDown: {
    position: 'absolute',
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderStyle: 'dotted',
  },
  cornerLeftDown: {
    position: 'absolute',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderStyle: 'dotted',
  },
  stepRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  lessonCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    shadowColor: '#0B1222',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  lessonLeft: {
    marginRight: 'auto',
  },
  lessonRight: {
    marginLeft: 'auto',
    alignSelf: 'flex-end',
  },
  lessonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lessonTopRowRight: {
    flexDirection: 'row-reverse',
  },
  playIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonAuthor: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  lessonTitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  rightAlignedText: {
    textAlign: 'right',
  },
  lessonMetaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonMetaRowRight: {
    justifyContent: 'flex-end',
  },
  lessonMeta: {
    fontSize: 11,
    lineHeight: 13,
  },
  lessonMetaDot: {
    marginHorizontal: 6,
    fontSize: 10,
  },
});
