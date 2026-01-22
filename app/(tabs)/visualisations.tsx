import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isVisualisationCompletedToday } from '@/utils/storage';

export default function VisualisationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkCompletionStatus = useCallback(async () => {
    try {
      const completed = await isVisualisationCompletedToday();
      setIsCompleted(completed);
    } catch (error) {
      console.error('Error checking completion status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkCompletionStatus();
  }, [checkCompletionStatus]);

  // Refresh completion status when screen comes into focus (e.g., returning from modal)
  useFocusEffect(
    useCallback(() => {
      checkCompletionStatus();
    }, [checkCompletionStatus])
  );

  const handleStartVisualisation = () => {
    router.push('/visualisation-modal');
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Visualisations</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {isCompleted ? (
          <ThemedView style={styles.completedContainer}>
            <View style={[styles.checkmarkCircle, { backgroundColor: colors.tabBar }]}>
              <IconSymbol name="checkmark" size={48} color={colors.tint} />
            </View>
            <ThemedText type="subtitle" style={styles.completedText}>
              Todays visualisation done
            </ThemedText>
            <ThemedText style={[styles.completedSubtext, { color: colors.muted }]}>
              You have completed your daily visualization. Come back tomorrow for a new experience.
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.startContainer}>
            <ThemedText type="subtitle" style={styles.startTitle}>
              Daily Visualisation
            </ThemedText>
            <ThemedText style={[styles.startDescription, { color: colors.muted }]}>
              Take a moment to center yourself with a guided breathing exercise and visualization.
            </ThemedText>
            <Pressable
              onPress={handleStartVisualisation}
              style={({ pressed }) => [
                styles.startButton,
                { backgroundColor: colors.tint },
                pressed && { opacity: 0.85 },
              ]}>
              <ThemedText style={[styles.startButtonText, { color: colors.card }]}>
                Start visualisation
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  completedText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  completedSubtext: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  startContainer: {
    alignItems: 'center',
    maxWidth: 320,
  },
  startTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  startDescription: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 32,
  },
  startButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
