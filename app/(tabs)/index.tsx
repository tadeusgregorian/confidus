import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows } from '@/constants/shadows';
import { getCompletedAudioLessonIds } from '@/utils/storage';

type LessonItem = {
  id: string;
  title: string;
  duration: string;
  description: string;
};

const SPINE_CENTER_X = 28;
const SPINE_WIDTH = 4;
const MARKER_COLUMN_WIDTH = 56;

const lessons: LessonItem[] = [
  { id: '1', title: 'Confidence Comes After Action', duration: '15:00', description: 'A grounded starting point for building real social courage.' },
  { id: '2', title: 'Confidence Comes After Action', duration: '12:00', description: 'A shorter practice to turn intention into visible movement.' },
  { id: '3', title: 'Introversion Is Not Shyness', duration: '18:00', description: 'A reframing lesson on quiet presence and self-trust.' },
  { id: '4', title: 'Introversion Is Not Shyness', duration: '22:00', description: 'A deeper reflection on calm identity beyond fear.' },
  { id: '5', title: 'Confident People Act Despite Fear', duration: '17:00', description: 'A practical reset for action even when nerves are present.' },
  { id: '6', title: 'Confident People Act Despite Fear', duration: '14:00', description: 'A concise reminder that courage can come before certainty.' },
  { id: '7', title: 'Full Catastrophe Living', duration: '17:00', description: 'An invitation to meet intensity with steadiness.' },
  { id: '8', title: 'Full Catastrophe Living', duration: '14:00', description: 'A lighter integration session for everyday resilience.' },
];

export default function LessonsScreen() {
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;

      const loadCompleted = async () => {
        const ids = await getCompletedAudioLessonIds();
        if (mounted) {
          setCompletedIds(ids);
        }
      };

      void loadCompleted();

      return () => {
        mounted = false;
      };
    }, [])
  );

  const currentIndex = Math.max(0, lessons.findIndex((item) => !completedIds.includes(item.id)));
  const resolvedCurrentIndex = currentIndex === -1 ? lessons.length - 1 : currentIndex;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <MaterialIcons name="menu" size={24} color="#101010" />
          <ThemedText style={styles.brand}>Celestial Sanctuary</ThemedText>
          <MaterialIcons name="search" size={22} color="#101010" />
        </View>

        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Adaptive Path</ThemedText>
          <ThemedText style={styles.heroTitle}>
            {'Lessons\nJourney'}
          </ThemedText>
          <View style={styles.heroRule} />
        </View>

        <View style={styles.timeline}>
          <View style={styles.spine} />

          {lessons.map((item, index) => {
            const isCompleted = completedIds.includes(item.id);
            const isCurrent = index === resolvedCurrentIndex;
            const isLocked = index > resolvedCurrentIndex;

            return (
              <View key={item.id} style={styles.step}>
                <View style={styles.markerColumn}>
                  <View
                    style={[
                      styles.marker,
                      isCurrent && styles.markerCurrent,
                      isLocked && styles.markerLocked,
                    ]}
                  >
                    {isCurrent ? (
                      <MaterialIcons name="play-arrow" size={16} color="#D7FF00" />
                    ) : isLocked ? (
                      <MaterialIcons name="lock" size={14} color="#5C5C5C" />
                    ) : isCompleted ? (
                      <View style={styles.markerDotDone} />
                    ) : (
                      <View style={styles.markerDot} />
                    )}
                  </View>
                </View>

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/lesson/[id]',
                      params: {
                        id: item.id,
                        title: item.title,
                        duration: item.duration,
                        author: 'Lessons',
                        category: 'Lesson',
                      },
                    })
                  }
                  style={({ pressed }) => [
                    styles.card,
                    isCurrent && styles.cardCurrent,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.cardInner}>
                    <View style={styles.metaRow}>
                      <ThemedText style={styles.lessonMeta}>
                        {`Lesson ${String(index + 1).padStart(2, '0')} · ${item.duration}`}
                      </ThemedText>

                      {isCompleted ? (
                        <View style={styles.doneChip}>
                          <ThemedText style={styles.doneChipText}>Done</ThemedText>
                        </View>
                      ) : isCurrent ? (
                        <ThemedText style={styles.activeLabel}>• Active</ThemedText>
                      ) : null}
                    </View>

                    <ThemedText style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </ThemedText>

                    <ThemedText style={styles.cardDescription} numberOfLines={1}>
                      {item.description}
                    </ThemedText>

                    {isCurrent ? (
                      <View style={styles.ctaButton}>
                        <MaterialIcons name="play-arrow" size={14} color="#101010" />
                        <ThemedText style={styles.ctaText}>Continue Listening</ThemedText>
                      </View>
                    ) : null}
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingTop: 20,
    paddingBottom: 120,
    paddingHorizontal: 10,
  },
  topBar: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  brand: {
    flex: 1,
    marginLeft: 14,
    color: '#101010',
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Inter_700Bold',
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#7D7A73',
    fontFamily: 'Inter_600SemiBold',
  },
  heroTitle: {
    marginTop: 8,
    color: '#111111',
    fontSize: 52,
    lineHeight: 46,
    textTransform: 'uppercase',
    fontFamily: 'Inter_700Bold',
  },
  heroRule: {
    marginTop: 16,
    width: 88,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#111111',
  },
  timeline: {
    position: 'relative',
  },
  spine: {
    position: 'absolute',
    top: 6,
    bottom: 0,
    left: SPINE_CENTER_X - SPINE_WIDTH / 2,
    width: SPINE_WIDTH,
    borderRadius: 999,
    backgroundColor: '#111111',
  },
  step: {
    position: 'relative',
    paddingLeft: MARKER_COLUMN_WIDTH,
    marginBottom: 18,
  },
  markerColumn: {
    position: 'absolute',
    top: 0,
    left: SPINE_CENTER_X - MARKER_COLUMN_WIDTH / 2,
    width: MARKER_COLUMN_WIDTH,
    alignItems: 'center',
    paddingTop: 8,
    zIndex: 3,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BDBDBD',
  },
  markerDotDone: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D7FF00',
  },
  markerCurrent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#D7FF00',
  },
  markerLocked: {
    backgroundColor: '#D9D6CF',
  },
  card: {
    flex: 1,
    marginLeft: 24,
    borderRadius: 10,
    backgroundColor: '#050505',
    ...Shadows.surfaceMd,
  },
  cardCurrent: {
    borderWidth: 1,
    borderColor: '#D7FF00',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 14,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardInner: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  lessonMeta: {
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#B0B0B0',
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  doneChip: {
    backgroundColor: '#D7FF00',
    paddingHorizontal: 8,
    height: 20,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneChipText: {
    color: '#111111',
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  activeLabel: {
    color: '#D7FF00',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'Inter_700Bold',
  },
  cardTitle: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Inter_700Bold',
  },
  cardDescription: {
    marginTop: 4,
    color: '#9A9A9A',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  ctaButton: {
    marginTop: 12,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#D7FF00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ctaText: {
    color: '#111111',
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontFamily: 'Inter_700Bold',
  },
});
