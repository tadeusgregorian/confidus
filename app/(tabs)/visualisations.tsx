import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { markVisualisationCompleted } from '@/utils/storage';

type PhraseRound = {
  positive: string;
  negatives: string[];
};

const ROUNDS: PhraseRound[] = [
  {
    positive: 'I can do this',
    negatives: ['I will fail', 'I should stay quiet'],
  },
  {
    positive: 'My voice matters',
    negatives: ['No one listens', 'I sound silly'],
  },
  {
    positive: 'I stay calm',
    negatives: ['I am too nervous', 'I will panic'],
  },
  {
    positive: 'I belong here',
    negatives: ['I do not fit in', 'I will be rejected'],
  },
  {
    positive: 'I grow with action',
    negatives: ['Better not try', 'I cannot change'],
  },
];

const HOLD_MS = 1800;
const NEGATIVE_STACK_Y = [-74, 72] as const;

export default function VisualisationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();

  const [roundIndex, setRoundIndex] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [burstProgress, setBurstProgress] = useState(0);
  const [isBursting, setIsBursting] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const burstTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentRound = ROUNDS[roundIndex];
  const cardWidth = Math.min(width - 32, 560);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (burstTimerRef.current) {
      clearInterval(burstTimerRef.current);
      burstTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const finishRound = async () => {
    clearTimer();
    setIsHolding(false);
    setHoldProgress(1);
    setIsTransitioning(true);
    setIsBursting(true);
    setBurstProgress(0);

    const burstStart = Date.now();
    burstTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - burstStart;
      const progress = Math.min(elapsed / 220, 1);
      setBurstProgress(progress);

      if (progress >= 1) {
        if (burstTimerRef.current) {
          clearInterval(burstTimerRef.current);
          burstTimerRef.current = null;
        }
      }
    }, 16);

    if (roundIndex >= ROUNDS.length - 1) {
      setTimeout(async () => {
        await markVisualisationCompleted();
        setIsBursting(false);
        setBurstProgress(0);
        setIsFinished(true);
        setIsTransitioning(false);
      }, 260);
      return;
    }

    setTimeout(() => {
      setRoundIndex((prev) => prev + 1);
      setHoldProgress(0);
      setIsBursting(false);
      setBurstProgress(0);
      setIsTransitioning(false);
    }, 260);
  };

  const handlePressIn = () => {
    if (isFinished || isTransitioning || isHolding) {
      return;
    }

    setIsHolding(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / HOLD_MS, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        finishRound();
      }
    }, 16);
  };

  const handlePressOut = () => {
    if (!isHolding || isTransitioning || isFinished) {
      return;
    }

    clearTimer();
    setIsHolding(false);
    setHoldProgress(0);
  };

  const resetGame = () => {
    clearTimer();
    setRoundIndex(0);
    setHoldProgress(0);
    setIsHolding(false);
    setIsTransitioning(false);
    setIsFinished(false);
  };

  const easedProgress = holdProgress * holdProgress * (3 - 2 * holdProgress);
  const holdElapsed = isHolding ? Math.max(0, Date.now() - startTimeRef.current) : 0;
  const wave = isHolding ? (Math.sin(holdElapsed / 120) + 1) / 2 : 0;
  const baseGrowth = easedProgress * 0.16;
  const pulseGrowth = easedProgress * 0.14 * wave;
  const burstScale = isBursting ? burstProgress * 1.65 : 0;
  const positiveScale = 1 + baseGrowth + pulseGrowth + burstScale;
  const positiveOpacity = isBursting ? Math.max(0, 1 - burstProgress * 1.8) : 1;
  const positiveBlur = isBursting ? burstProgress * 12 : 0;
  const negativeOpacity = Math.max(0, 1 - easedProgress * 1.3);
  const negativeBlur = easedProgress * 16;
  const ringScale1 =
    1 + easedProgress * 1.25 + (isHolding ? 0.1 * Math.sin(holdElapsed / 180) : 0);
  const ringScale2 =
    1 + easedProgress * 1.65 + (isHolding ? 0.1 * Math.sin(holdElapsed / 220 + 1.2) : 0);
  const ringScale3 =
    1 + easedProgress * 2.05 + (isHolding ? 0.1 * Math.sin(holdElapsed / 260 + 2.1) : 0);
  const ringOpacity = Math.max(0, 0.65 - easedProgress * 0.42);

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <ThemedText type="title">Mind Game</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.muted }]}>Hold the positive phrase and push fear away.</ThemedText>
      </View>

      <View
        style={[
          styles.gameCard,
          {
            width: cardWidth,
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {isFinished ? (
          <View style={styles.finishedWrap}>
            <View style={[styles.finishedBadge, { backgroundColor: colors.successSoft, borderColor: colors.border }]}>
              <ThemedText style={[styles.finishedBadgeText, { color: colors.success }]}>5 / 5</ThemedText>
            </View>
            <ThemedText type="subtitle" style={[styles.finishedTitle, { color: colors.text }]}>Great work</ThemedText>
            <ThemedText style={[styles.finishedText, { color: colors.muted }]}>You trained your focus on confidence and let negative thoughts fade.</ThemedText>
            <Pressable
              onPress={resetGame}
              style={({ pressed }) => [
                styles.playAgainBtn,
                { backgroundColor: colors.tint, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <ThemedText style={[styles.playAgainText, { color: '#FFFFFF' }]}>Play Again</ThemedText>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.topRow}>
              <ThemedText style={[styles.roundText, { color: colors.muted }]}>Round {roundIndex + 1} / {ROUNDS.length}</ThemedText>
              <ThemedText style={[styles.hintText, { color: colors.mutedLight }]}>Hold to complete</ThemedText>
            </View>

            <View style={styles.stage}>
              <View
                style={[
                  styles.radiationRing,
                  {
                    borderColor: colors.accent,
                    backgroundColor: `${colors.accent}1A`,
                    transform: [{ scale: ringScale1 }],
                    opacity: isHolding ? ringOpacity : 0,
                  },
                ]}
              />
              <View
                style={[
                  styles.radiationRing,
                  {
                    borderColor: colors.success,
                    backgroundColor: `${colors.success}14`,
                    transform: [{ scale: ringScale2 }],
                    opacity: isHolding ? Math.max(0, ringOpacity - 0.16) : 0,
                  },
                ]}
              />
              <View
                style={[
                  styles.radiationRing,
                  {
                    borderColor: colors.warning,
                    backgroundColor: `${colors.warning}10`,
                    transform: [{ scale: ringScale3 }],
                    opacity: isHolding ? Math.max(0, ringOpacity - 0.22) : 0,
                  },
                ]}
              />

              {currentRound.negatives.slice(0, 2).map((negative, idx) => {
                const baseY = NEGATIVE_STACK_Y[idx % NEGATIVE_STACK_Y.length];
                const directionY = idx === 0 ? -1 : 1;
                const y = baseY + easedProgress * directionY * 85;
                const negScale = 1 - easedProgress * 0.1;

                return (
                  <View
                    key={`${roundIndex}-${negative}`}
                    style={[
                      styles.negativeBubble,
                      {
                        transform: [{ translateY: y }, { scale: negScale }],
                        opacity: negativeOpacity,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.negativeText,
                        {
                          color: colors.muted,
                          textShadowColor: colors.muted,
                          textShadowOffset: { width: 0, height: 0 },
                          textShadowRadius: negativeBlur,
                        },
                      ]}
                    >
                      {negative}
                    </ThemedText>
                  </View>
                );
              })}

              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={({ pressed }) => [
                  styles.positiveBubble,
                  {
                    transform: [{ scale: positiveScale }],
                    opacity: positiveOpacity,
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accent,
                    shadowColor: colors.accent,
                    shadowOpacity: pressed ? 0.35 : 0.24,
                  },
                ]}
              >
                <View
                  style={[
                    styles.positiveFill,
                    {
                      width: `${holdProgress * 100}%`,
                      backgroundColor: `${colors.accent}3D`,
                    },
                  ]}
                />
                <ThemedText
                  style={[
                    styles.positiveText,
                    {
                      color: colors.accent,
                      textShadowColor: colors.accent,
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: positiveBlur,
                    },
                  ]}
                >
                  {currentRound.positive}
                </ThemedText>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    marginBottom: 12,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  gameCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundText: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  hintText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Inter_500Medium',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 18,
  },
  radiationRing: {
    position: 'absolute',
    width: 228,
    height: 228,
    borderRadius: 114,
    borderWidth: 3,
  },
  positiveBubble: {
    minWidth: 210,
    minHeight: 74,
    paddingHorizontal: 20,
    borderRadius: 35,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
  },
  positiveFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  positiveText: {
    fontSize: 26,
    lineHeight: 30,
    fontFamily: 'CrimsonPro_700Bold',
    textAlign: 'center',
  },
  negativeBubble: {
    position: 'absolute',
    maxWidth: 320,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  negativeText: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'CrimsonPro_700Bold',
    textAlign: 'center',
  },
  finishedWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  finishedBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 12,
  },
  finishedBadgeText: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'Inter_700Bold',
  },
  finishedTitle: {
    marginBottom: 8,
  },
  finishedText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18,
  },
  playAgainBtn: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playAgainText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Inter_700Bold',
  },
});
