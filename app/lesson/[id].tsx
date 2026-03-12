import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

type GroupedLesson = {
  id: string;
  title: string;
  duration: string;
  category: 'Theory' | 'Meditation';
};

type LessonGroup = {
  author: string;
  description: string;
  accentColor: string;
  noteColor: string;
  lessons: [GroupedLesson, GroupedLesson];
};

const lessonGroups: LessonGroup[] = [
  {
    author: 'Gillian Butler',
    description: 'Confidence Comes After Action',
    accentColor: '#6D7AB4',
    noteColor: '#FDF8EE',
    lessons: [
      { id: '1', title: 'Confidence Comes After Action', duration: '15:30', category: 'Theory' },
      { id: '2', title: 'Confidence Comes After Action', duration: '12:45', category: 'Meditation' },
    ],
  },
  {
    author: 'Susan Cain',
    description: 'Introversion Is Not Shyness',
    accentColor: '#B17390',
    noteColor: '#FEF7F0',
    lessons: [
      { id: '3', title: 'Introversion Is Not Shyness', duration: '18:20', category: 'Theory' },
      { id: '4', title: 'Introversion Is Not Shyness', duration: '22:10', category: 'Meditation' },
    ],
  },
  {
    author: 'Susan Jeffers',
    description: 'Confident People Act Despite Fear',
    accentColor: '#8A6CAC',
    noteColor: '#FCF8F1',
    lessons: [
      { id: '5', title: 'Confident People Act Despite Fear', duration: '16:55', category: 'Theory' },
      { id: '6', title: 'Confident People Act Despite Fear', duration: '14:30', category: 'Meditation' },
    ],
  },
  {
    author: 'Jon Kabat-Zinn',
    description: 'Full Catastrophe Living',
    accentColor: '#A77A56',
    noteColor: '#FEF9F2',
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
        noteColor: group.noteColor,
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
    noteColor: fallbackGroup.noteColor,
  };
};

export default function LessonPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = (colorScheme ?? 'light') === 'dark';

  const palette = isDark
    ? {
        appBg: '#1A1720',
        cardBg: '#2A2433',
        cardBorder: '#3A334A',
        ink: '#F5F0E8',
        mutedInk: '#C9C2B6',
        rail: '#4B415E',
      }
    : {
        appBg: '#F6F0E8',
        cardBg: '#FFFDF9',
        cardBorder: '#E8DECF',
        ink: '#40362E',
        mutedInk: '#8A7A6A',
        rail: '#E6DCCF',
      };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressInterval, setProgressInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const lesson = getLessonData(id || '1');

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
    const [minutes, seconds] = lesson.duration.split(':').map(Number);
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
          <ThemedText style={[styles.headerLabel, { color: palette.mutedInk }]}>Journal Entry</ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.paperCard, { backgroundColor: lesson.noteColor, borderColor: palette.cardBorder }]}> 
          <View style={[styles.tape, { backgroundColor: '#F4E1C7', borderColor: palette.cardBorder }]} />

          <View style={styles.titleRow}>
            <View style={[styles.dot, { backgroundColor: lesson.accentColor }]} />
            <ThemedText style={[styles.authorText, { color: palette.ink }]}>{lesson.author}</ThemedText>
          </View>

          <ThemedText style={[styles.lessonHeadline, { color: palette.ink }]}>{lesson.title}</ThemedText>
          <ThemedText style={[styles.lessonDescription, { color: palette.mutedInk }]}>{lesson.description}</ThemedText>

          <View style={styles.metaRow}>
            <View style={[styles.metaChip, { backgroundColor: '#EAE0F7' }]}>
              <ThemedText style={[styles.metaChipText, { color: lesson.accentColor }]}>{lesson.category}</ThemedText>
            </View>
            <View style={[styles.metaChip, { backgroundColor: '#DCE8FD' }]}>
              <ThemedText style={[styles.metaChipText, { color: lesson.accentColor }]}>{lesson.duration}</ThemedText>
            </View>
          </View>

          <View style={[styles.rail, { backgroundColor: palette.rail }]}>
            <View style={[styles.railFill, { width: `${progress}%`, backgroundColor: lesson.accentColor }]} />
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
                { backgroundColor: lesson.accentColor, opacity: pressed ? 0.9 : 1 },
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
    borderRadius: 16,
    padding: 16,
    shadowColor: '#1F1720',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  tape: {
    width: 82,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: -26,
    marginBottom: 10,
    opacity: 0.88,
    transform: [{ rotate: '-2deg' }],
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
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'CrimsonPro_700Bold',
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
    fontStyle: 'italic',
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
    fontFamily: 'Inter_500Medium',
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
