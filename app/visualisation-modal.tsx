import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { getTodaysPrompt } from '@/utils/visualisation-prompts';
import { markVisualisationCompleted } from '@/utils/storage';

type Step = 'breatheIn' | 'breatheOut' | 'visualization';

export default function VisualisationModal() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentStep, setCurrentStep] = useState<Step>('breatheIn');
  const [showDoneButton, setShowDoneButton] = useState(false);
  const prompt = getTodaysPrompt();

  useEffect(() => {
    // Start the breathing flow
    const breatheInTimer = setTimeout(() => {
      setCurrentStep('breatheOut');
    }, 4000); // 4 seconds for "Breathe in..."

    return () => clearTimeout(breatheInTimer);
  }, []);

  useEffect(() => {
    if (currentStep === 'breatheOut') {
      const breatheOutTimer = setTimeout(() => {
        setCurrentStep('visualization');
        setShowDoneButton(true);
      }, 4000); // 4 seconds for "Breathe out..."

      return () => clearTimeout(breatheOutTimer);
    }
  }, [currentStep]);

  const handleDone = async () => {
    try {
      await markVisualisationCompleted();
      router.back();
    } catch (error) {
      console.error('Error marking visualization as completed:', error);
      // Still close the modal even if saving fails
      router.back();
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'breatheIn':
        return (
          <ThemedText type="title" style={styles.breathingText}>
            Breathe in...
          </ThemedText>
        );
      case 'breatheOut':
        return (
          <ThemedText type="title" style={styles.breathingText}>
            Breathe out...
          </ThemedText>
        );
      case 'visualization':
        return (
          <ThemedView style={styles.visualizationContainer}>
            <ThemedText type="title" style={styles.visualizationTitle}>
              Close your eyes for 3 breath cycles and imagine:
            </ThemedText>
            <ThemedText type="subtitle" style={styles.visualizationPrompt}>
              {prompt}
            </ThemedText>
          </ThemedView>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <ThemedView style={styles.content}>
        {getStepContent()}
      </ThemedView>

      {showDoneButton && (
        <ThemedView style={styles.buttonContainer}>
          <Pressable
            onPress={handleDone}
            style={({ pressed }) => [
              styles.doneButton,
              { backgroundColor: colors.tint },
              pressed && { opacity: 0.8 },
            ]}>
            <ThemedText style={[styles.doneButtonText, { color: colors.background }]}>
              Done
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  breathingText: {
    textAlign: 'center',
    fontSize: 36,
  },
  visualizationContainer: {
    alignItems: 'center',
    maxWidth: 320,
    padding: 20,
  },
  visualizationTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 28,
  },
  visualizationPrompt: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 28,
    opacity: 0.9,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  doneButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
