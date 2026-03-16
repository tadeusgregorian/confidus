import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SessionItem = {
  id: string;
  title: string;
  author: string;
  category: 'Hypnosis' | 'Visualization' | 'Meditation';
  duration: string;
  accentColor: string;
};

type Step = {
  lesson: SessionItem;
  side: 'left' | 'right';
  cardX: number;
  cardTop: number;
  entryX: number;
  entryY: number;
  exitX: number;
  exitY: number;
};

const sessions: SessionItem[] = [
  { id: 's1', title: 'The Strength Within', author: 'Inner Stability Series', category: 'Hypnosis', duration: '12:40', accentColor: '#5B8CFF' },
  { id: 's2', title: 'The Curious Child', author: 'Inner Stability Series', category: 'Visualization', duration: '10:55', accentColor: '#22C55E' },
  { id: 's3', title: 'Subconscious Roots', author: 'Inner Stability Series', category: 'Hypnosis', duration: '13:20', accentColor: '#5B8CFF' },
  { id: 's4', title: 'Beginner’s Mind', author: 'Calm Presence Series', category: 'Meditation', duration: '9:30', accentColor: '#A78BFA' },
  { id: 's5', title: 'The Calm Before Speaking', author: 'Calm Presence Series', category: 'Meditation', duration: '8:45', accentColor: '#A78BFA' },
  { id: 's6', title: 'Unshaken Presence', author: 'Calm Presence Series', category: 'Hypnosis', duration: '12:10', accentColor: '#5B8CFF' },
  { id: 's7', title: 'The Golden Self', author: 'Radiant Confidence Series', category: 'Visualization', duration: '11:12', accentColor: '#22C55E' },
  { id: 's8', title: 'The Quiet Power', author: 'Radiant Confidence Series', category: 'Meditation', duration: '9:20', accentColor: '#A78BFA' },
  { id: 's9', title: 'Walking With Certainty', author: 'Radiant Confidence Series', category: 'Visualization', duration: '10:30', accentColor: '#22C55E' },
  { id: 's10', title: 'The Fearless Spark', author: 'Courage Activation Series', category: 'Hypnosis', duration: '11:45', accentColor: '#5B8CFF' },
  { id: 's11', title: 'Soft Eyes, Strong Heart', author: 'Courage Activation Series', category: 'Meditation', duration: '9:58', accentColor: '#A78BFA' },
  { id: 's12', title: 'The Inner Throne', author: 'Courage Activation Series', category: 'Visualization', duration: '12:05', accentColor: '#22C55E' },
  { id: 's13', title: 'Beyond the Inner Critic', author: 'Self-Worth Series', category: 'Hypnosis', duration: '13:05', accentColor: '#5B8CFF' },
  { id: 's14', title: 'The River of Ease', author: 'Self-Worth Series', category: 'Meditation', duration: '8:50', accentColor: '#A78BFA' },
  { id: 's15', title: 'Magnetic Presence', author: 'Self-Worth Series', category: 'Visualization', duration: '11:08', accentColor: '#22C55E' },
  { id: 's16', title: 'The Door Opens', author: 'Expansive Confidence Series', category: 'Hypnosis', duration: '12:26', accentColor: '#5B8CFF' },
  { id: 's17', title: 'The Steady Flame', author: 'Expansive Confidence Series', category: 'Meditation', duration: '9:44', accentColor: '#A78BFA' },
  { id: 's18', title: 'A Larger Sky', author: 'Expansive Confidence Series', category: 'Visualization', duration: '10:50', accentColor: '#22C55E' },
  { id: 's19', title: 'The Brave Heart Rehearsal', author: 'Expansive Confidence Series', category: 'Visualization', duration: '11:35', accentColor: '#22C55E' },
  { id: 's20', title: 'Rewriting the Inner Story', author: 'Expansive Confidence Series', category: 'Hypnosis', duration: '13:12', accentColor: '#5B8CFF' },
];

const sidePattern: Array<'left' | 'right'> = [
  'left', 'left', 'right', 'right',
  'left', 'left', 'right', 'right',
  'left', 'left', 'right', 'right',
  'left', 'left', 'right', 'right',
  'left', 'left', 'right', 'right',
];

const CARD_HEIGHT = 100;
const TURN_RADIUS = 18;
const DOCK_INSET = 14;
const DOT_SIZE = 4;
const DOT_SPACING = 10;
const GROUP_STEP = 122;
const CROSSOVER_STEP = 182;
const TOP_PADDING = 24;
const BOTTOM_PADDING = 32;

function renderVerticalDots(keyPrefix: string, x: number, yStart: number, yEnd: number, color: string) {
  const start = Math.min(yStart, yEnd);
  const length = Math.abs(yEnd - yStart);
  const count = Math.max(1, Math.floor(length / DOT_SPACING) + 1);

  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    const y = start + t * length;
    return (
      <View
        key={`${keyPrefix}-v-${i}`}
        style={[styles.pathDot, { backgroundColor: color, left: x - DOT_SIZE / 2, top: y - DOT_SIZE / 2 }]}
      />
    );
  });
}

function renderHorizontalDots(keyPrefix: string, xStart: number, xEnd: number, y: number, color: string) {
  const start = Math.min(xStart, xEnd);
  const length = Math.abs(xEnd - xStart);
  const count = Math.max(1, Math.floor(length / DOT_SPACING) + 1);

  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    const x = start + t * length;
    return (
      <View
        key={`${keyPrefix}-h-${i}`}
        style={[styles.pathDot, { backgroundColor: color, left: x - DOT_SIZE / 2, top: y - DOT_SIZE / 2 }]}
      />
    );
  });
}

function renderCurveDots(
  keyPrefix: string,
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  color: string
) {
  const estimate =
    Math.hypot(control.x - start.x, control.y - start.y) +
    Math.hypot(end.x - control.x, end.y - control.y);
  const count = Math.max(3, Math.floor(estimate / DOT_SPACING) + 1);

  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    const x =
      (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * control.x + t * t * end.x;
    const y =
      (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * control.y + t * t * end.y;

    return (
      <View
        key={`${keyPrefix}-c-${i}`}
        style={[styles.pathDot, { backgroundColor: color, left: x - DOT_SIZE / 2, top: y - DOT_SIZE / 2 }]}
      />
    );
  });
}

export default function SessionsScreen() {
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
  const cardWidth = Math.floor(contentWidth * 0.9);
  const leftCardX = 0;
  const rightCardX = contentWidth - cardWidth;

  const centerYs: number[] = [];
  let currentCenterY = TOP_PADDING + CARD_HEIGHT / 2;
  sessions.forEach((_, index) => {
    if (index > 0) {
      const prevSide = sidePattern[index - 1] ?? 'right';
      const nextSide = sidePattern[index] ?? 'right';
      currentCenterY += prevSide === nextSide ? GROUP_STEP : CROSSOVER_STEP;
    }
    centerYs.push(currentCenterY);
  });

  const steps: Step[] = sessions.map((lesson, index) => {
    const side = sidePattern[index] ?? 'right';
    const cardX = side === 'left' ? leftCardX : rightCardX;
    const cardTop = centerYs[index] - CARD_HEIGHT / 2;
    const dockX = side === 'left' ? cardX + DOCK_INSET : cardX + cardWidth - DOCK_INSET;

    return {
      lesson,
      side,
      cardX,
      cardTop,
      entryX: dockX,
      entryY: cardTop + DOCK_INSET,
      exitX: dockX,
      exitY: cardTop + CARD_HEIGHT - DOCK_INSET,
    };
  });

  const pathHeight = centerYs[centerYs.length - 1] + CARD_HEIGHT / 2 + BOTTOM_PADDING;

  return (
    <ThemedView style={[styles.container, { backgroundColor: palette.appBg }]}> 
      <ScrollView
        contentContainerStyle={[styles.listContent, { backgroundColor: palette.appBg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerCard, { backgroundColor: palette.panelBg, borderColor: palette.panelBorder }]}> 
          <ThemedText style={[styles.pathLabel, { color: palette.subtle }]}>Guided Transformation Collection</ThemedText>
          <ThemedText type="title" style={{ color: palette.title }}>
            Sessions
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: palette.text }]}>Grouped confidence sessions across hypnosis, meditation, and visualization.</ThemedText>
        </View>

        <View style={[styles.pathCanvas, { height: pathHeight }]}> 
          {steps.slice(0, -1).map((current, index) => {
            const next = steps[index + 1];
            const x1 = current.exitX;
            const y1 = current.exitY;
            const x2 = next.entryX;
            const y2 = next.entryY;
            const dx = x2 - x1;
            const movingRight = dx > 0;
            const straightDrop = Math.abs(dx) < 2;

            if (straightDrop) {
              return (
                <React.Fragment key={`segment-${index}`}>
                  {renderVerticalDots(`segment-${index}`, x1, y1, y2, palette.path)}
                </React.Fragment>
              );
            }

            const midY = y1 + (y2 - y1) * 0.52;
            const r = Math.min(
              TURN_RADIUS,
              Math.abs(dx) / 2 - 4,
              Math.abs(midY - y1) - 4,
              Math.abs(y2 - midY) - 4
            );
            if (r < 4) {
              return (
                <React.Fragment key={`segment-${index}`}>
                  {renderVerticalDots(`segment-${index}`, x1, y1, y2, palette.path)}
                </React.Fragment>
              );
            }

            const horizontalLeft = Math.min(x1, x2) + r;
            const horizontalWidth = Math.abs(x2 - x1) - r * 2;

            return (
              <React.Fragment key={`segment-${index}`}>
                {renderVerticalDots(`segment-${index}-a`, x1, y1, Math.max(y1, midY - r), palette.path)}

                {movingRight
                  ? renderCurveDots(
                      `segment-${index}-b`,
                      { x: x1, y: midY - r },
                      { x: x1, y: midY },
                      { x: x1 + r, y: midY },
                      palette.path
                    )
                  : renderCurveDots(
                      `segment-${index}-b`,
                      { x: x1, y: midY - r },
                      { x: x1, y: midY },
                      { x: x1 - r, y: midY },
                      palette.path
                    )}

                {renderHorizontalDots(`segment-${index}-c`, horizontalLeft, horizontalLeft + horizontalWidth, midY, palette.path)}

                {movingRight
                  ? renderCurveDots(
                      `segment-${index}-d`,
                      { x: x2 - r, y: midY },
                      { x: x2, y: midY },
                      { x: x2, y: midY + r },
                      palette.path
                    )
                  : renderCurveDots(
                      `segment-${index}-d`,
                      { x: x2 + r, y: midY },
                      { x: x2, y: midY },
                      { x: x2, y: midY + r },
                      palette.path
                    )}

                {renderVerticalDots(`segment-${index}-e`, x2, midY + r, y2, palette.path)}
              </React.Fragment>
            );
          })}

          {steps.map((step) => {
            const { lesson, side } = step;

            return (
              <View key={lesson.id} style={[styles.stepRow, { top: step.cardTop, height: CARD_HEIGHT }]}> 
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
  pathDot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
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
