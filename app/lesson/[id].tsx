import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows } from '@/constants/shadows';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { markAudioLessonCompleted } from '@/utils/storage';

type GroupedLesson = {
  id: string;
  title: string;
  duration: string;
  category: 'Theory' | 'Meditation' | 'Moment';
};

type LessonGroup = {
  author: string;
  description: string;
  accentColor: string;
  lessons: [GroupedLesson, GroupedLesson];
};

const lessonGroups: LessonGroup[] = [
  {
    author: 'Gillian Butler',
    description: 'Confidence Comes After Action',
    accentColor: '#6D7AB4',
    lessons: [
      { id: '1', title: 'Confidence Comes After Action', duration: '15:30', category: 'Theory' },
      { id: '2', title: 'Confidence Comes After Action', duration: '12:45', category: 'Meditation' },
    ],
  },
  {
    author: 'Susan Cain',
    description: 'Introversion Is Not Shyness',
    accentColor: '#B17390',
    lessons: [
      { id: '3', title: 'Introversion Is Not Shyness', duration: '18:20', category: 'Theory' },
      { id: '4', title: 'Introversion Is Not Shyness', duration: '22:10', category: 'Meditation' },
    ],
  },
  {
    author: 'Susan Jeffers',
    description: 'Confident People Act Despite Fear',
    accentColor: '#8A6CAC',
    lessons: [
      { id: '5', title: 'Confident People Act Despite Fear', duration: '16:55', category: 'Theory' },
      { id: '6', title: 'Confident People Act Despite Fear', duration: '14:30', category: 'Meditation' },
    ],
  },
  {
    author: 'Jon Kabat-Zinn',
    description: 'Full Catastrophe Living',
    accentColor: '#A77A56',
    lessons: [
      { id: '7', title: 'Full Catastrophe Living', duration: '16:55', category: 'Theory' },
      { id: '8', title: 'Full Catastrophe Living', duration: '14:30', category: 'Meditation' },
    ],
  },
];

const getLessonData = (id: string) => {
  for (const group of lessonGroups) {
    const match = group.lessons.find((lesson) => lesson.id === id);
    if (match) {
      return {
        ...match,
        author: group.author,
        description: group.description,
        accentColor: group.accentColor,
      };
    }
  }

  const fallbackGroup = lessonGroups[0];
  const fallbackLesson = fallbackGroup.lessons[0];
  return {
    ...fallbackLesson,
    author: fallbackGroup.author,
    description: fallbackGroup.description,
    accentColor: fallbackGroup.accentColor,
  };
};

export default function LessonPlayerScreen() {
  const router = useRouter();
  const { id, title, duration: durationParam, author, category } = useLocalSearchParams<{
    id: string;
    title?: string;
    duration?: string;
    author?: string;
    category?: 'Theory' | 'Meditation' | 'Moment';
  }>();
  const colorScheme = useColorScheme();
  const isDark = (colorScheme ?? 'light') === 'dark';

  const palette = isDark
    ? {
        appBg: '#10131A',
        cardBg: '#1E2431',
        cardBorder: '#2A3140',
        ink: '#F3F4F6',
        mutedInk: '#9CA3AF',
        rail: '#313A4C',
        accent: '#94A3B8',
        accentSoft: '#273042',
      }
    : {
        appBg: '#F3F4F6',
        cardBg: '#FFFFFF',
        cardBorder: '#E5E7EB',
        ink: '#151A22',
        mutedInk: '#6B7280',
        rail: '#E5E7EB',
        accent: '#64748B',
        accentSoft: '#EEF2F7',
      };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressInterval, setProgressInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const lesson = getLessonData(id || '1');
  const resolvedLesson = {
    ...lesson,
    title: typeof title === 'string' ? title : lesson.title,
    duration: typeof durationParam === 'string' ? durationParam : lesson.duration,
    author: typeof author === 'string' ? author : lesson.author,
    category:
      category === 'Theory' || category === 'Meditation' || category === 'Moment'
        ? category
        : lesson.category,
  };

  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    const [minutes, seconds] = resolvedLesson.duration.split(':').map(Number);
    return (minutes * 60 + seconds) * 1000;
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        setIsPlaying(false);
        if (progressInterval) {
          clearInterval(progressInterval);
          setProgressInterval(null);
        }
        return;
      }

      setIsLoading(true);
      const totalDuration = getTotalDuration();

      if (duration === 0) {
        setDuration(totalDuration);
      }

      setIsPlaying(true);
      setIsLoading(false);

      const interval = setInterval(() => {
        setPosition((prev) => {
          const next = prev + 1000;
          if (next >= totalDuration) {
            clearInterval(interval);
            setIsPlaying(false);
            setProgressInterval(null);
            if (id) {
              void markAudioLessonCompleted(id);
            }
            setIsCompleted(true);
            return totalDuration;
          }
          return next;
        });
      }, 1000);

      setProgressInterval(interval);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
    }
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <ThemedView style={[styles.container, { backgroundColor: palette.appBg }]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerRow, { paddingTop: Platform.OS === 'ios' ? 56 : 28 }]}> 
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: palette.cardBg,
                borderColor: palette.cardBorder,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <MaterialIcons name="arrow-back" size={20} color={palette.ink} />
          </Pressable>
          <ThemedText style={[styles.headerLabel, { color: palette.mutedInk }]}>Audio Session</ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.paperCard, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}> 
          <View style={styles.titleRow}>
            <View style={[styles.dot, { backgroundColor: palette.accent }]} />
            <ThemedText style={[styles.authorText, { color: palette.ink }]}>{resolvedLesson.author}</ThemedText>
          </View>

          <ThemedText style={[styles.lessonHeadline, { color: palette.ink }]}>{resolvedLesson.title}</ThemedText>
          <ThemedText style={[styles.lessonDescription, { color: palette.mutedInk }]}>{lesson.description}</ThemedText>

          <View style={styles.metaRow}>
            <View style={[styles.metaChip, { backgroundColor: palette.accentSoft }]}>
              <ThemedText style={[styles.metaChipText, { color: palette.accent }]}>{resolvedLesson.category}</ThemedText>
            </View>
            <View style={[styles.metaChip, { backgroundColor: palette.accentSoft }]}>
              <ThemedText style={[styles.metaChipText, { color: palette.accent }]}>{resolvedLesson.duration}</ThemedText>
            </View>
            {isCompleted ? (
              <View style={[styles.metaChip, { backgroundColor: '#D8C3FF' }]}>
                <ThemedText style={[styles.metaChipText, { color: '#3C2E72' }]}>Done</ThemedText>
              </View>
            ) : null}
          </View>

          <View style={[styles.rail, { backgroundColor: palette.rail }]}>
            <View style={[styles.railFill, { width: `${progress}%`, backgroundColor: palette.accent }]} />
          </View>

          <View style={styles.timeRow}>
            <ThemedText style={[styles.timeText, { color: palette.mutedInk }]}>{formatTime(position)}</ThemedText>
            <ThemedText style={[styles.timeText, { color: palette.mutedInk }]}>{formatTime(duration || getTotalDuration())}</ThemedText>
          </View>

          <View style={styles.controlsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryControl,
                { backgroundColor: palette.cardBg, borderColor: palette.cardBorder, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <MaterialIcons name="skip-previous" size={24} color={palette.ink} />
            </Pressable>

            <Pressable
              onPress={handlePlayPause}
              style={({ pressed }) => [
                styles.primaryControl,
                { backgroundColor: palette.accent, opacity: pressed ? 0.9 : 1 },
              ]}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={30} color="#FFFFFF" />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryControl,
                { backgroundColor: palette.cardBg, borderColor: palette.cardBorder, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <MaterialIcons name="skip-next" size={24} color={palette.ink} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  paperCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    ...Shadows.surfaceMd,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  authorText: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: 'Inter_700Bold',
  },
  lessonHeadline: {
    marginTop: 6,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  },
  lessonDescription: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  metaChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaChipText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  rail: {
    marginTop: 14,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  railFill: {
    height: '100%',
    borderRadius: 999,
  },
  timeRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  controlsRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  secondaryControl: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryControl: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
