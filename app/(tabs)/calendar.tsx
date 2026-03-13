import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
  const [isHolding, setIsHolding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef(0);
  const completionTriggeredRef = useRef(false);

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

  const clearHoldTimer = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
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
        clearHoldTimer();
      };
    }, [loadData])
  );

  const finishCommitment = async () => {
    setIsSubmitting(true);
    try {
      await markCommitmentCompleted();
      await loadData();
    } finally {
      setIsSubmitting(false);
      setHoldProgress(0);
    }
  };

  const handlePressIn = () => {
    if (todayCommitted || isSubmitting || isHolding) {
      return;
    }

    completionTriggeredRef.current = false;
    holdStartRef.current = Date.now();
    setHoldProgress(0);
    setIsHolding(true);

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION_MS, 1);
      setHoldProgress(progress);

      if (progress >= 1 && !completionTriggeredRef.current) {
        completionTriggeredRef.current = true;
        clearHoldTimer();
        setIsHolding(false);
        finishCommitment();
      }
    }, 16);
  };

  const handlePressOut = () => {
    if (!isHolding || completionTriggeredRef.current) {
      return;
    }

    clearHoldTimer();
    setIsHolding(false);
    setHoldProgress(0);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Calendar</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.muted }]}>Daily commitment streak</ThemedText>
      </ThemedView>

      <ThemedView
        style={[
          styles.messageCard,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <ThemedText style={[styles.messageLabel, { color: colors.muted }]}>Commitment</ThemedText>
        <ThemedText style={[styles.messageText, { color: colors.text }]}>{COMMITMENT_MESSAGE}</ThemedText>

        <View style={[styles.progressTrack, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(todayCommitted ? 1 : holdProgress) * 100}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
      </ThemedView>

      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={todayCommitted || isSubmitting}
        style={({ pressed }) => [
          styles.commitButton,
          {
            backgroundColor: todayCommitted ? colors.surface : colors.tint,
            borderColor: todayCommitted ? colors.border : colors.tint,
            shadowColor: colors.shadow,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.commitIcon,
            {
              backgroundColor: todayCommitted ? colors.successSoft : 'rgba(255,255,255,0.2)',
              borderColor: todayCommitted ? colors.border : 'rgba(255,255,255,0.25)',
            },
          ]}
        >
          <MaterialIcons
            name={todayCommitted ? 'check' : 'pan-tool-alt'}
            size={22}
            color={todayCommitted ? colors.success : '#FFFFFF'}
          />
        </View>

        <ThemedText
          style={[
            styles.commitButtonText,
            {
              color: todayCommitted ? colors.text : '#FFFFFF',
            },
          ]}
        >
          {todayCommitted
            ? 'Commitment Completed Today'
            : isSubmitting
              ? 'Saving...'
              : isHolding
                ? 'Keep Holding...'
                : 'Make Commitment For Today'}
        </ThemedText>
      </Pressable>

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
  messageCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
    marginBottom: 12,
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
  progressTrack: {
    marginTop: 12,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  commitButton: {
    minHeight: 62,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
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
  calendarCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  monthLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'CrimsonPro_600SemiBold',
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
});
