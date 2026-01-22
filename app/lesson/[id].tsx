import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Dummy lesson data - in a real app, this would come from an API or database
const getLessonData = (id: string) => {
  const lessons: Record<string, { title: string; description: string; duration: string }> = {
    '1': {
      title: 'Introduction to React Native',
      description: 'Learn the fundamentals of React Native development',
      duration: '15:30',
    },
    '2': {
      title: 'Building Your First Component',
      description: 'Create reusable components for your app',
      duration: '12:45',
    },
    '3': {
      title: 'State Management Basics',
      description: 'Understanding state and props in React Native',
      duration: '18:20',
    },
    '4': {
      title: 'Navigation and Routing',
      description: 'Implement navigation between screens',
      duration: '22:10',
    },
    '5': {
      title: 'Working with APIs',
      description: 'Fetch and display data from remote sources',
      duration: '16:55',
    },
    '6': {
      title: 'Styling and Theming',
      description: 'Create beautiful UIs with styled components',
      duration: '14:30',
    },
  };
  return lessons[id] || lessons['1'];
};

export default function LessonPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

  const lesson = getLessonData(id || '1');

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [sound, progressInterval]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    try {
      // For demo purposes, simulate audio playback
      // In a real app, you would load the actual audio file:
      // const { sound: newSound } = await Audio.Sound.createAsync(
      //   { uri: lesson.audioUrl },
      //   { shouldPlay: true },
      //   (status) => {
      //     if (status.isLoaded) {
      //       setPosition(status.positionMillis || 0);
      //       setDuration(status.durationMillis || 0);
      //       setIsPlaying(status.isPlaying || false);
      //     }
      //   }
      // );
      // setSound(newSound);

      if (isPlaying) {
        // Pause
        setIsPlaying(false);
        if (progressInterval) {
          clearInterval(progressInterval);
          setProgressInterval(null);
        }
      } else {
        // Play
        setIsLoading(true);
        const [minutes, seconds] = lesson.duration.split(':').map(Number);
        const totalDuration = (minutes * 60 + seconds) * 1000;
        
        if (duration === 0) {
          setDuration(totalDuration);
        }
        
        setIsPlaying(true);
        setIsLoading(false);
        
        // Simulate progress update
        const interval = setInterval(() => {
          setPosition((prev) => {
            const newPosition = prev + 1000;
            if (newPosition >= totalDuration) {
              clearInterval(interval);
              setIsPlaying(false);
              setProgressInterval(null);
              return totalDuration;
            }
            return newPosition;
          });
        }, 1000);
        
        setProgressInterval(interval);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
    }
  };

  const handleSeek = async (newPosition: number) => {
    if (sound) {
      try {
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header with back button */}
      <ThemedView style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Now Playing
        </ThemedText>
        <ThemedView style={styles.placeholder} />
      </ThemedView>

      {/* Lesson content */}
      <ThemedView style={styles.content}>
        <ThemedView style={styles.albumArtContainer}>
          <ThemedView style={[styles.albumArt, { backgroundColor: colors.tabBar }]}>
            <IconSymbol name="music.note" size={64} color={colors.muted} />
          </ThemedView>
        </ThemedView>

        <ThemedText type="title" style={styles.lessonTitle}>
          {lesson.title}
        </ThemedText>
        <ThemedText style={[styles.lessonDescription, { color: colors.muted }]}>
          {lesson.description}
        </ThemedText>

        {/* Progress bar */}
        <ThemedView style={styles.progressContainer}>
          <ThemedView style={styles.progressBar}>
            <ThemedView
              style={[
                styles.progressFill,
                {
                  width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
                  backgroundColor: colors.tint,
                },
              ]}
            />
          </ThemedView>
          <ThemedView style={styles.timeContainer}>
            <ThemedText style={[styles.timeText, { color: colors.mutedLight }]}>
              {formatTime(position)}
            </ThemedText>
            <ThemedText style={[styles.timeText, { color: colors.mutedLight }]}>
              {formatTime(
                duration ||
                  (parseInt(lesson.duration.split(':')[0]) * 60000 +
                    parseInt(lesson.duration.split(':')[1]) * 1000)
              )}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Controls */}
        <ThemedView style={styles.controls}>
          <Pressable
            style={({ pressed }) => [styles.controlButton, pressed && { opacity: 0.7 }]}>
            <IconSymbol name="backward.fill" size={32} color={colors.text} />
          </Pressable>

          <Pressable
            onPress={handlePlayPause}
            style={({ pressed }) => [
              styles.playButton,
              { backgroundColor: colors.tint },
              pressed && { opacity: 0.8 },
            ]}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <IconSymbol
                name={isPlaying ? 'pause.fill' : 'play.fill'}
                size={48}
                color={colors.card}
              />
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.controlButton, pressed && { opacity: 0.7 }]}>
            <IconSymbol name="forward.fill" size={32} color={colors.text} />
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  albumArtContainer: {
    marginBottom: 32,
  },
  albumArt: {
    width: 240,
    height: 240,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  lessonTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  lessonDescription: {
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 48,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E6EB',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});