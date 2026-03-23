import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows } from '@/constants/shadows';
import { getCompletedAudioLessonIds } from '@/utils/storage';

type SessionItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  tag: string;
  imageUrl: string;
};

const sessions: SessionItem[] = [
  {
    id: 's1',
    title: 'The Strength Within',
    description: 'Reconnect with your inner stability, self-trust, and quiet personal power.',
    duration: '13 MIN',
    tag: 'INNER STABILITY',
    imageUrl: 'https://picsum.photos/seed/confidus-session-1/1200/1100',
  },
  {
    id: 's2',
    title: 'The Curious Child',
    description: 'A gentle journey into playfulness, openness, and the natural confidence of exploration.',
    duration: '11 MIN',
    tag: 'OPEN PRESENCE',
    imageUrl: 'https://picsum.photos/seed/confidus-session-2/1200/1100',
  },
  {
    id: 's3',
    title: 'Subconscious Roots',
    description: 'Feel grounded, steady, and supported from within through a deep hypnotic session.',
    duration: '13 MIN',
    tag: 'DEEP GROUNDING',
    imageUrl: 'https://picsum.photos/seed/confidus-session-3/1200/1100',
  },
  {
    id: 's4',
    title: 'Beginner’s Mind',
    description: 'Release self-judgment and enter social moments with freshness and openness.',
    duration: '10 MIN',
    tag: 'FRESH AWARENESS',
    imageUrl: 'https://picsum.photos/seed/confidus-session-4/1200/1100',
  },
  {
    id: 's5',
    title: 'The Calm Before Speaking',
    description: 'Relax body and mind before conversations, meetings, or socially charged moments.',
    duration: '9 MIN',
    tag: 'SOFT LANDING',
    imageUrl: 'https://picsum.photos/seed/confidus-session-5/1200/1100',
  },
  {
    id: 's6',
    title: 'Unshaken Presence',
    description: 'Build emotional steadiness and stay centered while others are watching.',
    duration: '12 MIN',
    tag: 'STEADY CORE',
    imageUrl: 'https://picsum.photos/seed/confidus-session-6/1200/1100',
  },
];

export default function SessionsScreen() {
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const load = async () => {
        const ids = await getCompletedAudioLessonIds();
        if (isMounted) {
          setCompletedIds(ids);
        }
      };

      void load();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const firstIncompleteIndex = sessions.findIndex((item) => !completedIds.includes(item.id));
  const currentIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : sessions.length - 1;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Current Path</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Your Curated Journey
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Follow the guided resonance through the archive. Each step opens the next session.
          </ThemedText>
        </View>

        <View style={styles.timeline}>
          {sessions.map((item, index) => {
            const isCompleted = completedIds.includes(item.id);
            const isCurrent = index === currentIndex;
            const isLocked = index > currentIndex;
            const isLast = index === sessions.length - 1;

            return (
              <View key={item.id} style={[styles.stepWrap, isLocked && styles.stepLocked]}>
                {!isLast ? <View style={styles.connectorToNext} /> : null}

                <View style={styles.markerWrap}>
                  <View
                    style={[
                      styles.marker,
                      isCompleted && styles.markerCompleted,
                      isCurrent && styles.markerCurrent,
                    ]}
                  >
                    {isCompleted ? (
                      <MaterialIcons name="check" size={18} color="#FFF9F0" />
                    ) : isCurrent ? (
                      <MaterialIcons name="play-arrow" size={22} color="#FFF9F0" />
                    ) : (
                      <MaterialIcons name="lock" size={16} color="#B8B0A2" />
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
                        duration: item.duration.replace(' MIN', ':00'),
                        author: 'Sessions',
                        category: 'Meditation',
                      },
                    })
                  }
                  style={({ pressed }) => [
                    styles.card,
                    isCurrent && styles.cardCurrent,
                    isLocked && styles.cardLocked,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.cardImage}
                    contentFit="cover"
                    transition={150}
                  />

                  <View style={styles.cardBody}>
                    <View style={styles.topMetaRow}>
                      <ThemedText style={[styles.statusLabel, isCurrent && styles.statusLabelCurrent]}>
                        {`Lesson ${index + 1} • ${isCompleted ? 'Completed' : isCurrent ? 'Current Resonance' : 'Locked'}`}
                      </ThemedText>
                      <View style={[styles.durationPill, isCurrent && styles.durationPillCurrent]}>
                        <ThemedText style={[styles.durationText, isCurrent && styles.durationTextCurrent]}>
                          {item.duration}
                        </ThemedText>
                      </View>
                    </View>

                    <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.tag}>{item.tag}</ThemedText>
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
    backgroundColor: '#F7F1E7',
  },
  content: {
    paddingTop: 54,
    paddingBottom: 120,
    paddingHorizontal: 10,
  },
  header: {
    paddingHorizontal: 6,
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#8A7B67',
    fontFamily: 'Inter_600SemiBold',
  },
  title: {
    marginTop: 8,
    color: '#214C36',
    fontSize: 34,
    lineHeight: 42,
    maxWidth: '80%',
  },
  subtitle: {
    marginTop: 18,
    fontSize: 15,
    lineHeight: 26,
    color: '#6E665B',
    maxWidth: '92%',
  },
  timeline: {
    position: 'relative',
  },
  stepWrap: {
    position: 'relative',
    marginBottom: 34,
    paddingTop: 18,
    zIndex: 2,
  },
  connectorToNext: {
    position: 'absolute',
    left: '50%',
    marginLeft: -1,
    top: '100%',
    width: 2,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#DDD1BF',
    zIndex: 0,
  },
  stepLocked: {
    opacity: 0.5,
  },
  markerWrap: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -22,
    width: 44,
    height: 44,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2E6D7',
    borderWidth: 3,
    borderColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCompleted: {
    backgroundColor: '#214C36',
  },
  markerCurrent: {
    backgroundColor: '#B85E35',
    ...Shadows.surfaceLg,
  },
  card: {
    marginTop: 14,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFF9F0',
    position: 'relative',
    zIndex: 2,
    ...Shadows.surfaceLg,
    shadowColor: '#2B2116',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
  cardCurrent: {
    shadowColor: '#B85E35',
    shadowOpacity: 0.14,
  },
  cardLocked: {
    shadowOpacity: 0.04,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardImage: {
    width: '100%',
    height: 168,
    backgroundColor: '#E9DECF',
  },
  cardBody: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 16,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusLabel: {
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#8A7B67',
    fontFamily: 'Inter_600SemiBold',
  },
  statusLabelCurrent: {
    color: '#B85E35',
  },
  cardTitle: {
    marginTop: 12,
    fontSize: 20,
    lineHeight: 26,
    color: '#214C36',
    fontFamily: 'CrimsonPro_600SemiBold',
  },
  durationPill: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1E6D7',
  },
  durationPillCurrent: {
    backgroundColor: '#F3C1AA',
  },
  durationText: {
    fontSize: 10,
    lineHeight: 12,
    color: '#8A7B67',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
  },
  durationTextCurrent: {
    color: '#A84E2E',
  },
  tag: {
    marginTop: 12,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#B2A897',
    fontFamily: 'Inter_600SemiBold',
  },
});
