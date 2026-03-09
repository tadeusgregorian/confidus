import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
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
  imageUrl: string;
  accentColor: string;
  lessons: [GroupedLesson, GroupedLesson];
};

const lessonGroups: LessonGroup[] = [
  {
    author: 'Gillian Butler',
    description: 'Confidence Comes After Action',
    imageUrl: 'https://picsum.photos/seed/lesson-butler/1200/900',
    accentColor: '#4F46E5',
    lessons: [
      { id: '1', title: 'Confidence Comes After Action', duration: '15:30', category: 'Theory' },
      { id: '2', title: 'Confidence Comes After Action', duration: '12:45', category: 'Meditation' },
    ],
  },
  {
    author: 'Susan Cain',
    description: 'Introversion Is Not Shyness',
    imageUrl: 'https://picsum.photos/seed/lesson-cain/1200/900',
    accentColor: '#DB2777',
    lessons: [
      { id: '3', title: 'Introversion Is Not Shyness', duration: '18:20', category: 'Theory' },
      { id: '4', title: 'Introversion Is Not Shyness', duration: '22:10', category: 'Meditation' },
    ],
  },
  {
    author: 'Susan Jeffers',
    description: 'Confident People Act Despite Fear',
    imageUrl: 'https://picsum.photos/seed/lesson-jeffers/1200/900',
    accentColor: '#7C3AED',
    lessons: [
      { id: '5', title: 'Confident People Act Despite Fear', duration: '16:55', category: 'Theory' },
      { id: '6', title: 'Confident People Act Despite Fear', duration: '14:30', category: 'Meditation' },
    ],
  },
  {
    author: 'Jon Kabat-Zinn',
    description: 'Full Catastrophe Living',
    imageUrl: 'https://picsum.photos/seed/lesson-kabat-zinn/1200/900',
    accentColor: '#D97706',
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
        imageUrl: group.imageUrl,
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
    imageUrl: fallbackGroup.imageUrl,
    accentColor: fallbackGroup.accentColor,
  };
};

export default function LessonPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerRow, { paddingTop: Platform.OS === 'ios' ? 56 : 28 }]}> 
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <ThemedText style={[styles.headerLabel, { color: colors.muted }]}>Now Playing</ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.playerCardShadow, { shadowColor: colors.shadow }]}> 
          <View style={[styles.playerCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.heroImageWrap}>
              <Image source={{ uri: lesson.imageUrl }} style={styles.heroImage} contentFit="cover" transition={200} />
              <View style={styles.imageOverlay} />
              <View style={styles.imageMetaRow}>
                <View style={[styles.imageBadge, { backgroundColor: 'rgba(15,23,42,0.68)' }]}> 
                  <MaterialIcons name="headset" size={12} color="#FFFFFF" />
                  <ThemedText style={styles.imageBadgeText}>{lesson.duration}</ThemedText>
                </View>
                <View style={[styles.imageBadge, { backgroundColor: 'rgba(15,23,42,0.68)' }]}> 
                  <ThemedText style={styles.imageBadgeText}>{lesson.category}</ThemedText>
                </View>
              </View>
              <View style={styles.imageTitleWrap}>
                <ThemedText type="cardTitle" style={styles.imageTitle}>
                  {lesson.author}
                </ThemedText>
              </View>
            </View>

            <View style={styles.playerBody}>
              <ThemedText style={[styles.lessonHeadline, { color: colors.text }]}>{lesson.title}</ThemedText>
              <ThemedText style={[styles.lessonDescription, { color: colors.muted }]}> 
                {lesson.description}
              </ThemedText>

              <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}> 
                  <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: lesson.accentColor }]} />
                </View>

                <View style={styles.timeRow}>
                  <ThemedText style={[styles.timeText, { color: colors.mutedLight }]}>{formatTime(position)}</ThemedText>
                  <ThemedText style={[styles.timeText, { color: colors.mutedLight }]}>{formatTime(duration || getTotalDuration())}</ThemedText>
                </View>
              </View>

              <View style={styles.controlsRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryControl,
                    { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <MaterialIcons name="skip-previous" size={26} color={colors.text} />
                </Pressable>

                <Pressable
                  onPress={handlePlayPause}
                  style={({ pressed }) => [
                    styles.primaryControl,
                    { backgroundColor: colors.tint, shadowColor: colors.shadow, opacity: pressed ? 0.9 : 1 },
                  ]}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <MaterialIcons
                      name={isPlaying ? 'pause' : 'play-arrow'}
                      size={32}
                      color="#FFFFFF"
                    />
                  )}
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryControl,
                    { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <MaterialIcons name="skip-next" size={26} color={colors.text} />
                </Pressable>
              </View>
            </View>
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
    paddingBottom: 20,
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
  playerCardShadow: {
    borderRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  playerCard: {
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroImageWrap: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#E2E8F0',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.2)',
  },
  imageMetaRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  imageBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  imageTitleWrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
  },
  imageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    textShadowColor: 'rgba(0,0,0,0.26)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  playerBody: {
    padding: 16,
    gap: 16,
  },
  lessonDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  lessonHeadline: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'CrimsonPro_600SemiBold',
  },
  progressCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Inter_500Medium',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  secondaryControl: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryControl: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
});
