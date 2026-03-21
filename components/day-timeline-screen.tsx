import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

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
  focusVisuals?: ReadonlyArray<{
    imageUrl: string;
    tint: string;
  }>;
};

export function DayTimelineScreen({
  eyebrow,
  title,
  items,
  currentDayIndex = 1,
  variant = 'default',
  focusVisuals,
}: DayTimelineScreenProps) {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const hasFocusVisual = variant === 'default' && !!focusVisuals?.length;
  const visual = hasFocusVisual ? focusVisuals[Math.min(focusedIndex, focusVisuals.length - 1)] : null;
  const compactRowStep = 102;
  const focusPanelHeight = Math.min(420, height * 0.45);

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
      {visual ? (
        <View
          style={[
            styles.focusVisualPanel,
            {
              height: focusPanelHeight,
            },
          ]}
        >
          <Image
            source={{ uri: visual.imageUrl }}
            style={styles.focusImage}
            contentFit="cover"
            transition={180}
          />
          <View style={[styles.focusImageTint, { backgroundColor: visual.tint }]} />
          <View style={styles.focusImageShade} />
          <View style={styles.focusImageLabel}>
            <ThemedText style={styles.focusLabelDay}>{`Day ${focusedIndex + 1}`}</ThemedText>
            <ThemedText style={styles.focusLabelTitle}>
              {items[Math.min(focusedIndex, items.length - 1)]?.title}
            </ThemedText>
          </View>
        </View>
      ) : null}

      <ScrollView
        style={hasFocusVisual ? styles.scrollWithVisual : undefined}
        contentContainerStyle={[
          styles.content,
          hasFocusVisual && {
            paddingBottom: focusPanelHeight + 56,
          },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          if (!hasFocusVisual) {
            return;
          }
          const nextIndex = Math.max(
            0,
            Math.min(
              items.length - 1,
              Math.round(event.nativeEvent.contentOffset.y / compactRowStep)
            )
          );
          if (nextIndex !== focusedIndex) {
            setFocusedIndex(nextIndex);
          }
        }}
      >
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>{eyebrow}</ThemedText>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
        </View>

        <View style={styles.timeline}>
          {items.map((item, index) => {
            const isCompleted = completedIds.includes(item.id);
            const isPast = index < currentDayIndex;
            const isCurrent = index === currentDayIndex;
            const isNext = index === currentDayIndex + 1;
            const isFadedFuture = index > currentDayIndex + 1;
            const isLast = index === items.length - 1;
            const isFocused = hasFocusVisual && index === focusedIndex;

            return (
              <View
                key={item.id}
                style={[
                  styles.row,
                  variant === 'default' && styles.rowCompact,
                  isFadedFuture && styles.rowFaded,
                ]}
              >
                {!isLast ? (
                  <View
                    style={[
                      styles.connectorSegment,
                      variant === 'default' && styles.connectorSegmentCompact,
                    ]}
                  />
                ) : null}

                <View
                  style={[
                    styles.markerColumn,
                    variant === 'default' && styles.markerColumnCompact,
                  ]}
                >
                  <View
                    style={[
                      styles.markerOuter,
                      variant === 'default' && styles.markerOuterCompact,
                      isCurrent && !isCompleted && styles.markerOuterCurrent,
                      variant === 'default' && isCurrent && !isCompleted && styles.markerOuterCurrentCompact,
                      (isPast || isCompleted) && styles.markerOuterPast,
                    ]}
                  >
                    {isCompleted || isPast ? (
                      <MaterialIcons name="check" size={22} color="#214C36" />
                    ) : isCurrent ? (
                      <View
                        style={[
                          styles.markerInnerCurrent,
                          variant === 'default' && styles.markerInnerCurrentCompact,
                        ]}
                      />
                    ) : (
                      <MaterialIcons
                        name={isNext ? 'radio-button-unchecked' : 'lock'}
                        size={variant === 'default' ? (isNext ? 14 : 13) : (isNext ? 18 : 16)}
                        color={isNext ? '#214C36' : '#B2A897'}
                      />
                    )}
                  </View>
                </View>

                <Pressable
                  onPress={() => router.push(`/lesson/${item.id}`)}
                  style={({ pressed }) => [
                    styles.card,
                    variant === 'default' && styles.cardCompact,
                    variant === 'orb' && styles.cardOrb,
                    isCurrent && styles.cardCurrent,
                    isFocused && styles.cardFocused,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <ThemedText style={[styles.dayLabel, variant === 'default' && styles.dayLabelCompact]}>
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
                      <ThemedText style={[styles.cardTitle, styles.cardTitleCompact]}>{item.title}</ThemedText>
                    </>
                  )}

                  <View style={[styles.cardFooter, variant === 'default' && styles.cardFooterCompact]}>
                    {variant === 'orb' ? <View /> : (
                      <View style={styles.durationWrap}>
                        <MaterialIcons name="schedule" size={16} color="#8A7B67" />
                        <ThemedText style={[styles.durationText, styles.durationTextCompact]}>{item.duration}</ThemedText>
                      </View>
                    )}
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
  scrollWithVisual: {
    zIndex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 42,
  },
  focusVisualPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: '#EDE2D3',
    zIndex: 3,
  },
  focusImage: {
    ...StyleSheet.absoluteFillObject,
  },
  focusImageTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22,
  },
  focusImageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,24,20,0.08)',
  },
  focusImageLabel: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 92,
  },
  focusLabelDay: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#FFF8F0',
    fontFamily: 'Inter_600SemiBold',
  },
  focusLabelTitle: {
    marginTop: 6,
    fontSize: 28,
    lineHeight: 32,
    color: '#FFF8F0',
    fontFamily: 'CrimsonPro_600SemiBold',
    maxWidth: '72%',
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
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 34,
  },
  rowCompact: {
    marginBottom: 20,
  },
  connectorSegment: {
    position: 'absolute',
    left: 30,
    top: 52,
    bottom: -34,
    width: 2,
    borderRadius: 999,
    backgroundColor: '#D8C9B6',
  },
  connectorSegmentCompact: {
    left: 21,
    top: 42,
    bottom: -20,
  },
  rowFaded: {
    opacity: 0.42,
  },
  markerColumn: {
    width: 62,
    alignItems: 'center',
    paddingTop: 4,
  },
  markerColumnCompact: {
    width: 44,
    paddingTop: 2,
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
  markerOuterCompact: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
  markerOuterCurrentCompact: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    shadowRadius: 12,
    elevation: 5,
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
  markerInnerCurrentCompact: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  card: {
    flex: 1,
    minHeight: 112,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#FFF9F0',
    justifyContent: 'space-between',
  },
  cardCompact: {
    minHeight: 82,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 11,
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
  cardFocused: {
    borderWidth: 1.5,
    borderColor: '#214C36',
    backgroundColor: '#FFFDF8',
    shadowColor: '#2B2116',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 7,
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
  dayLabelCompact: {
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1,
  },
  cardTitle: {
    marginTop: 7,
    fontSize: 21,
    lineHeight: 26,
    color: '#214C36',
    fontFamily: 'Inter_600SemiBold',
  },
  cardTitleCompact: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 20,
  },
  cardTitleOrb: {
    marginTop: 14,
    fontSize: 18,
    lineHeight: 23,
    color: '#214C36',
    fontFamily: 'CrimsonPro_600SemiBold',
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
  cardFooterCompact: {
    marginTop: 8,
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
  durationTextCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
});
