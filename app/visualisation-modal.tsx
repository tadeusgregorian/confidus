import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { markVisualisationCompleted } from '@/utils/storage';
import { getTodaysPrompt } from '@/utils/visualisation-prompts';

type Step = 'breatheIn' | 'breatheOut' | 'visualizationReady' | 'visualizationStarting' | 'visualizationActive';

export default function VisualisationModal() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentStep, setCurrentStep] = useState<Step>('breatheIn');
  const prompt = getTodaysPrompt();
  
  // Animation for breathing circle
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

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
        setCurrentStep('visualizationReady');
      }, 4000); // 4 seconds for "Breathe out..."

      return () => clearTimeout(breatheOutTimer);
    }
  }, [currentStep]);

  // Start breathing animation when visualization becomes active
  useEffect(() => {
    if (currentStep === 'visualizationActive') {
      scale.value = withRepeat(
        withTiming(1.3, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
      opacity.value = withRepeat(
        withTiming(0.3, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      scale.value = 1;
      opacity.value = 0.6;
    }
  }, [currentStep, scale, opacity]);

  const handleReady = () => {
    setCurrentStep('visualizationStarting');
  };

  const handleStarting = () => {
    setCurrentStep('visualizationActive');
  };

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

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

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
      case 'visualizationReady':
        return (
          <ThemedView style={styles.visualizationContainer}>
            <ThemedText type="title" style={styles.visualizationTitle}>
              Close your eyes and imagine for 3 breath cycles the following scene:
            </ThemedText>
          </ThemedView>
        );
      case 'visualizationStarting':
        return (
          <ThemedView style={styles.visualizationContainer}>
            <ThemedText type="subtitle" style={styles.visualizationPrompt}>
              {prompt}
            </ThemedText>
          </ThemedView>
        );
      case 'visualizationActive':
        return (
          <ThemedView style={styles.visualizationActiveContainer}>
            <View style={styles.circleContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  { backgroundColor: colors.tint },
                  animatedCircleStyle,
                ]}
              />
            </View>
            <ThemedText type="subtitle" style={styles.visualizationPrompt}>
              {prompt}
            </ThemedText>
          </ThemedView>
        );
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 'visualizationReady':
        return "I'm Ready";
      case 'visualizationStarting':
        return "I'm Starting";
      case 'visualizationActive':
        return "I'm Done";
      default:
        return '';
    }
  };

  const handleButtonPress = () => {
    switch (currentStep) {
      case 'visualizationReady':
        handleReady();
        break;
      case 'visualizationStarting':
        handleStarting();
        break;
      case 'visualizationActive':
        handleDone();
        break;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ThemedView style={styles.content}>
        {getStepContent()}
      </ThemedView>

      {(currentStep === 'visualizationReady' ||
        currentStep === 'visualizationStarting' ||
        currentStep === 'visualizationActive') && (
        <ThemedView style={styles.buttonContainer}>
          <Pressable
            onPress={handleButtonPress}
            style={({ pressed }) => [
              styles.doneButton,
              { backgroundColor: colors.tint },
              pressed && { opacity: 0.8 },
            ]}>
            <ThemedText style={[styles.doneButtonText, { color: colors.card }]}>
              {getButtonText()}
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
  visualizationActiveContainer: {
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
    marginTop: 24,
  },
  circleContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  doneButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
