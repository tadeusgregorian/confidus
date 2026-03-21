import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows } from '@/constants/shadows';
import { getCompletedAudioLessonIds } from '@/utils/storage';

export type DayTimelineItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  subtitle?: string;
  artVariant?: 'mist' | 'orb' | 'spiral' | 'flare';
};

type DayTimelineScreenProps = {
  eyebrow: string;
  title: string;
  items: DayTimelineItem[];
  currentDayIndex?: number;
  variant?: 'default' | 'orb';
};

export function DayTimelineScreen({
  eyebrow,
  title,
  items,
  currentDayIndex = 1,
  variant = 'default',
}: DayTimelineScreenProps) {
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const loadCompleted = async () => {
        const ids = await getCompletedAudioLessonIds();
        if (isMounted) {
          setCompletedIds(ids);
        }
      };

      void loadCompleted();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>{eyebrow}</ThemedText>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
        </View>

        <View style={styles.timeline}>
          <View style={styles.rail} />

          {items.map((item, index) => {
            const isCompleted = completedIds.includes(item.id);
            const isPast = index < currentDayIndex;
            const isCurrent = index === currentDayIndex;
            const isNext = index === currentDayIndex + 1;
            const isFadedFuture = index > currentDayIndex + 1;

            return (
              <View
                key={item.id}
                style={[
                  styles.row,
                  isFadedFuture && styles.rowFaded,
                ]}
              >
                <View style={styles.markerColumn}>
                  <View
                    style={[
                      styles.markerOuter,
                      isCurrent && !isCompleted && styles.markerOuterCurrent,
                      (isPast || isCompleted) && styles.markerOuterPast,
                    ]}
                  >
                    {isCompleted || isPast ? (
                      <MaterialIcons name="check" size={22} color="#214C36" />
                    ) : isCurrent ? (
                      <View style={styles.markerInnerCurrent} />
                    ) : (
                      <MaterialIcons
                        name={isNext ? 'radio-button-unchecked' : 'lock'}
                        size={isNext ? 18 : 16}
                        color={isNext ? '#214C36' : '#B2A897'}
                      />
                    )}
                  </View>
                </View>

                <Pressable
                  onPress={() => router.push(`/lesson/${item.id}`)}
                  style={({ pressed }) => [
                    styles.card,
                    variant === 'orb' && styles.cardOrb,
                    isCurrent && styles.cardCurrent,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <ThemedText style={styles.dayLabel}>
                    {`Day ${index + 1}`.toUpperCase()}
                    {isCurrent ? ' • Active' : ''}
                  </ThemedText>

                  {variant === 'orb' ? (
                    <>
                      <View style={styles.artCard}>
                        <View style={styles.artBackdrop} />
                        <View
                          style={[
                            styles.artGlow,
                            item.artVariant === 'mist' && styles.artGlowMist,
                            item.artVariant === 'orb' && styles.artGlowOrb,
                            item.artVariant === 'spiral' && styles.artGlowSpiral,
                            item.artVariant === 'flare' && styles.artGlowFlare,
                          ]}
                        />
                        <View
                          style={[
                            styles.artSecondaryGlow,
                            item.artVariant === 'mist' && styles.artSecondaryGlowMist,
                            item.artVariant === 'orb' && styles.artSecondaryGlowOrb,
                            item.artVariant === 'spiral' && styles.artSecondaryGlowSpiral,
                            item.artVariant === 'flare' && styles.artSecondaryGlowFlare,
                          ]}
                        />
                        <View style={styles.durationPill}>
                          <ThemedText style={styles.durationPillText}>{item.duration}</ThemedText>
                        </View>
                      </View>

                      <ThemedText style={[styles.cardTitle, styles.cardTitleOrb]}>
                        {item.title}
                      </ThemedText>
                      {item.subtitle ? (
                        <ThemedText style={styles.subtitleTag}>{item.subtitle}</ThemedText>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                      <ThemedText style={styles.cardDescription}>
                        {item.description}
                      </ThemedText>
                    </>
                  )}

                  <View style={styles.cardFooter}>
                    {variant === 'orb' ? <View /> : (
                      <View style={styles.durationWrap}>
                        <MaterialIcons name="schedule" size={16} color="#8A7B67" />
                        <ThemedText style={styles.durationText}>{item.duration}</ThemedText>
                      </View>
                    )}

                    {isCurrent ? (
                      <View style={styles.ctaButton}>
                        <ThemedText style={styles.ctaText}>Start Now</ThemedText>
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
    backgroundColor: '#F7F1E7',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 42,
  },
  header: {
    marginBottom: 18,
    paddingLeft: 58,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#8A7B67',
    fontFamily: 'Inter_600SemiBold',
  },
  title: {
    marginTop: 6,
    color: '#214C36',
    fontSize: 30,
    lineHeight: 34,
  },
  timeline: {
    position: 'relative',
    paddingBottom: 20,
  },
  rail: {
    position: 'absolute',
    left: 30,
    top: 26,
    bottom: 52,
    width: 2,
    borderRadius: 999,
    backgroundColor: '#D8C9B6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 34,
  },
  rowFaded: {
    opacity: 0.42,
  },
  markerColumn: {
    width: 62,
    alignItems: 'center',
    paddingTop: 4,
  },
  markerOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1E8DA',
    borderWidth: 1,
    borderColor: '#DCCFBC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerOuterPast: {
    backgroundColor: '#FFF9F0',
    borderColor: '#DCCFBC',
    ...Shadows.surfaceLg,
  },
  markerOuterCurrent: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1E5D6',
    borderColor: '#214C36',
    borderWidth: 4,
    shadowColor: '#D9B998',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  markerInnerCurrent: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#214C36',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    minHeight: 136,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#FFF9F0',
    justifyContent: 'space-between',
  },
  cardOrb: {
    minHeight: 318,
    paddingTop: 14,
    paddingBottom: 18,
  },
  cardCurrent: {
    borderWidth: 1,
    borderColor: '#E0D2BF',
    backgroundColor: '#FFFDF8',
    ...Shadows.surfaceLg,
  },
  cardPressed: {
    opacity: 0.9,
  },
  dayLabel: {
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: '#8A7B67',
    fontFamily: 'Inter_600SemiBold',
  },
  cardTitle: {
    marginTop: 7,
    fontSize: 21,
    lineHeight: 26,
    color: '#214C36',
    fontFamily: 'Inter_600SemiBold',
  },
  cardTitleOrb: {
    marginTop: 14,
    fontSize: 18,
    lineHeight: 23,
    color: '#214C36',
    fontFamily: 'CrimsonPro_600SemiBold',
  },
  cardDescription: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    color: '#756C60',
    maxWidth: '94%',
  },
  subtitleTag: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#8A7B67',
    fontFamily: 'Inter_600SemiBold',
  },
  artCard: {
    height: 210,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#D46E3F',
    marginTop: 10,
  },
  artBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D9794B',
  },
  artGlow: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    opacity: 0.85,
  },
  artGlowMist: {
    top: 10,
    left: 58,
    backgroundColor: 'rgba(255,244,222,0.42)',
  },
  artGlowOrb: {
    top: 50,
    left: 62,
    backgroundColor: 'rgba(255,222,198,0.5)',
  },
  artGlowSpiral: {
    top: 30,
    left: 46,
    backgroundColor: 'rgba(250,240,209,0.4)',
  },
  artGlowFlare: {
    top: 24,
    left: 72,
    backgroundColor: 'rgba(255,241,229,0.44)',
  },
  artSecondaryGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.95,
  },
  artSecondaryGlowMist: {
    top: 58,
    left: 108,
    backgroundColor: 'rgba(35,103,78,0.22)',
  },
  artSecondaryGlowOrb: {
    top: 62,
    left: 104,
    backgroundColor: 'rgba(255,247,237,0.58)',
  },
  artSecondaryGlowSpiral: {
    top: 88,
    left: 94,
    backgroundColor: 'rgba(33,76,54,0.24)',
  },
  artSecondaryGlowFlare: {
    top: 74,
    left: 94,
    backgroundColor: 'rgba(255,247,235,0.62)',
  },
  durationPill: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    paddingHorizontal: 9,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,249,240,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPillText: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: '#FFFDF8',
    fontFamily: 'Inter_600SemiBold',
  },
  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  durationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationText: {
    fontSize: 13,
    lineHeight: 16,
    color: '#7A7164',
    fontFamily: 'Inter_600SemiBold',
  },
  ctaButton: {
    minWidth: 116,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#214C36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 15,
    lineHeight: 18,
    color: '#FFF9F0',
    fontFamily: 'Inter_700Bold',
  },
});
