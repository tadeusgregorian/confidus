import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows } from '@/constants/shadows';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getCommitmentDates,
  isCommitmentCompletedToday,
  markCommitmentCompleted,
} from '@/utils/storage';

const HOLD_DURATION_MS = 2200;
const COMMITMENT_MESSAGE =
  'I commit to challenge myself today, grow with intention, and become the person I want to be.';

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [commitmentDates, setCommitmentDates] = useState<string[]>([]);
  const [todayCommitted, setTodayCommitted] = useState(false);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [readyToConfirm, setReadyToConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdStartRef = useRef(0);
  const checkAnim = useRef(new Animated.Value(0)).current;
  const donePulseAnim = useRef(new Animated.Value(1)).current;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const todayDay = now.getDate();

  const monthLabel = now.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const cells: Array<{ day?: number; dateKey?: string }> = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({});
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = toLocalDateString(new Date(year, month, day));
    cells.push({ day, dateKey });
  }

  const clearTimers = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
  };

  const resetOverlayState = () => {
    setIsHolding(false);
    setIsSaving(false);
    setHoldProgress(0);
    setReadyToConfirm(false);
    setShowSuccess(false);
    checkAnim.setValue(0);
  };

  const loadData = useCallback(async () => {
    const [dates, completed] = await Promise.all([
      getCommitmentDates(),
      isCommitmentCompletedToday(),
    ]);
    setCommitmentDates(dates);
    setTodayCommitted(completed);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {
        clearTimers();
      };
    }, [loadData])
  );

  useEffect(() => {
    if (!todayCommitted) {
      donePulseAnim.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(donePulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(donePulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    return () => {
      pulse.stop();
    };
  }, [todayCommitted, donePulseAnim]);

  const openOverlay = () => {
    resetOverlayState();
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    if (isSaving) {
      return;
    }
    clearTimers();
    resetOverlayState();
    setOverlayVisible(false);
  };

  const finalizeCommitment = async () => {
    if (isSaving) {
      return;
    }

    clearTimers();
    setIsSaving(true);

    try {
      await markCommitmentCompleted();
      await loadData();

      setShowSuccess(true);
      Animated.spring(checkAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 8,
      }).start();

      successTimeoutRef.current = setTimeout(() => {
        resetOverlayState();
        setOverlayVisible(false);
      }, 950);
    } finally {
      setIsSaving(false);
    }
  };

  const startHold = () => {
    if (!overlayVisible || isSaving || isHolding || readyToConfirm || showSuccess) {
      return;
    }

    holdStartRef.current = Date.now();
    setHoldProgress(0);
    setReadyToConfirm(false);
    setIsHolding(true);

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION_MS, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        clearTimers();
        setIsHolding(false);
        setReadyToConfirm(true);
      }
    }, 16);
  };

  const releaseHold = () => {
    if (!overlayVisible || isSaving || showSuccess) {
      return;
    }

    if (readyToConfirm) {
      finalizeCommitment();
      return;
    }

    if (!isHolding) {
      return;
    }

    clearTimers();
    setIsHolding(false);
    setHoldProgress(0);
    setReadyToConfirm(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Calendar</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.muted }]}>Daily commitment streak</ThemedText>
      </ThemedView>

      <ThemedView
        style={[
          styles.calendarCard,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
        ]}
      >
        <ThemedText style={[styles.monthLabel, { color: colors.text }]}>{monthLabel}</ThemedText>

        <View style={styles.weekdayRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
            <View key={`${label}-${index}`} style={styles.weekdayCell}>
              <ThemedText style={[styles.weekdayText, { color: colors.muted }]}>{label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((cell, index) => {
            if (!cell.day || !cell.dateKey) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const completed = commitmentDates.includes(cell.dateKey);
            const isToday = cell.day === todayDay;

            return (
              <View key={cell.dateKey} style={styles.dayCell}>
                <View
                  style={[
                    styles.dayBubble,
                    {
                      backgroundColor: completed ? colors.accentSoft : colors.surface,
                      borderColor: isToday ? colors.accent : colors.border,
                    },
                  ]}
                >
                  {completed ? (
                    <MaterialIcons name="check" size={14} color={colors.accent} />
                  ) : (
                    <ThemedText style={[styles.dayNumber, { color: colors.text }]}>{cell.day}</ThemedText>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ThemedView>

      {todayCommitted ? (
        <ThemedView
          style={[
            styles.doneCard,
            {
              backgroundColor: colorScheme === 'dark' ? '#1F3B2B' : '#ECFDF3',
              borderColor: colors.border,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.doneIconWrap,
              {
                backgroundColor: colors.success,
                transform: [{ scale: donePulseAnim }],
              },
            ]}
          >
            <MaterialIcons name="check" size={30} color="#FFFFFF" />
          </Animated.View>
          <ThemedText style={[styles.doneTitle, { color: colors.success }]}>Commitment complete</ThemedText>
          <ThemedText style={[styles.doneText, { color: colors.success }]}>
            Commitment for today is done. Next one is due tomorrow.
          </ThemedText>
        </ThemedView>
      ) : (
        <Pressable
          onPress={openOverlay}
          style={({ pressed }) => [
            styles.commitButton,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={[styles.commitIcon, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <MaterialIcons name="pan-tool-alt" size={20} color={colors.accent} />
          </View>

          <ThemedText style={[styles.commitButtonText, { color: colors.text }]}>Make Commitment For Today</ThemedText>
        </Pressable>
      )}

      <Modal visible={overlayVisible} transparent animationType="fade" onRequestClose={closeOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={closeOverlay}>
          <Pressable
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
            onPress={() => {}}
          >
            <ThemedText style={[styles.messageLabel, { color: colors.muted }]}>Commitment</ThemedText>
            <ThemedText style={[styles.messageText, { color: colors.text }]}>{COMMITMENT_MESSAGE}</ThemedText>

            <View style={styles.holdCircleWrap}>
              <Pressable
                onPressIn={startHold}
                onPressOut={releaseHold}
                disabled={isSaving || showSuccess}
                style={({ pressed }) => [
                  styles.holdCircle,
                  {
                    borderColor: colors.accent,
                    backgroundColor: pressed ? colors.accentSoft : colors.surface,
                  },
                ]}
              >
                {showSuccess ? (
                  <Animated.View
                    style={{
                      transform: [{ scale: checkAnim }],
                      opacity: checkAnim,
                    }}
                  >
                    <MaterialIcons name="check-circle" size={58} color={colors.success} />
                  </Animated.View>
                ) : (
                  <MaterialIcons
                    name={readyToConfirm ? 'fingerprint' : 'touch-app'}
                    size={44}
                    color={colors.accent}
                  />
                )}
              </Pressable>
            </View>

            <View style={[styles.progressTrack, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${holdProgress * 100}%`,
                    backgroundColor: colors.accent,
                  },
                ]}
              />
            </View>

            <ThemedText style={[styles.holdHint, { color: colors.muted }]}> 
              {showSuccess
                ? 'Commitment saved'
                : isSaving
                  ? 'Saving...'
                  : readyToConfirm
                    ? 'Release to confirm commitment'
                    : isHolding
                      ? 'Keep holding...'
                      : 'Press and hold the circle'}
            </ThemedText>
          </Pressable>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  commitButton: {
    minHeight: 62,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    ...Shadows.surfaceMd,
  },
  commitIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  commitButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Inter_700Bold',
    flex: 1,
  },
  doneCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 18,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  doneIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.surfaceMd,
  },
  doneTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Inter_700Bold',
    marginTop: 2,
    textAlign: 'center',
  },
  doneText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    maxWidth: 280,
  },
  calendarCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    ...Shadows.surfaceMd,
  },
  monthLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    marginBottom: 8,
  },
  dayBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    ...Shadows.surfaceLg,
  },
  messageLabel: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  holdCircleWrap: {
    marginTop: 16,
    marginBottom: 14,
    alignItems: 'center',
  },
  holdCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  holdHint: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_600SemiBold',
  },
});
