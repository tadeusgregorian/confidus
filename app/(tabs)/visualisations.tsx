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
        <ThemedView style={[styles.loadingWrap, { backgroundColor: colors.background }]}>
          <View style={[styles.loadingCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <View style={[styles.loadingPulse, { backgroundColor: colors.surface }]} />
            <ThemedText style={{ color: colors.muted }}>Preparing your session...</ThemedText>
          </View>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.heroShell, { shadowColor: colors.shadow }]}> 
          <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.heroTopBand, { backgroundColor: isCompleted ? colors.success : colors.accent }]} />
            <View style={styles.header}>
              <ThemedText type="title">Visualisations</ThemedText>
              <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
                A daily guided reset to steady your breath and build mental clarity.
              </ThemedText>
            </View>

            <View style={styles.contentArea}>
              {isCompleted ? (
                <View style={styles.completedContainer}>
                  <View
                    style={[
                      styles.statusOrb,
                      { backgroundColor: colors.successSoft, borderColor: colors.border },
                    ]}
                  >
                    <View style={[styles.statusOrbInner, { backgroundColor: colors.success }]}>
                      <IconSymbol name="checkmark" size={30} color={colorScheme === 'dark' ? '#062A27' : '#FFFFFF'} />
                    </View>
                  </View>

                  <View style={styles.statusTextBlock}>
                    <View style={[styles.statusBadge, { backgroundColor: colors.successSoft, borderColor: colors.border }]}>
                      <ThemedText style={[styles.statusBadgeText, { color: colors.success }]}>Completed today</ThemedText>
                    </View>
                    <ThemedText type="subtitle" style={[styles.completedText, { color: colors.text }]}>
                      Today&apos;s visualisation is done
                    </ThemedText>
                    <ThemedText style={[styles.completedSubtext, { color: colors.muted }]}> 
                      Nice work. Your daily practice is recorded. Return tomorrow for a fresh session.
                    </ThemedText>
                  </View>
                </View>
              ) : (
                <View style={styles.startContainer}>
                  <View style={[styles.sessionPreview, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <View style={styles.previewRow}>
                      <View style={[styles.previewIcon, { backgroundColor: colors.accentSoft }]}>
                        <IconSymbol name="brain" size={20} color={colors.accent} />
                      </View>
                      <View style={styles.previewTextBlock}>
                        <ThemedText type="subtitle" style={[styles.startTitle, { color: colors.text }]}>
                          Daily Visualisation
                        </ThemedText>
                        <ThemedText style={[styles.startDescription, { color: colors.muted }]}> 
                          Gentle breathing, grounding, and imagery to reset focus in a few minutes.
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.previewMetaRow}>
                      <View style={[styles.metaPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <IconSymbol name="clock" size={13} color={colors.muted} />
                        <ThemedText style={[styles.metaText, { color: colors.muted }]}>~5 min</ThemedText>
                      </View>
                      <View style={[styles.metaPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <IconSymbol name="headphones" size={13} color={colors.muted} />
                        <ThemedText style={[styles.metaText, { color: colors.muted }]}>Audio guided</ThemedText>
                      </View>
                    </View>
                  </View>

                  <Pressable
                    onPress={handleStartVisualisation}
                    style={({ pressed }) => [
                      styles.startButton,
                      {
                        backgroundColor: colors.tint,
                        shadowColor: colors.shadow,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <View style={styles.startButtonContent}>
                      <View style={styles.startButtonIconWrap}>
                        <IconSymbol name="play.fill" size={14} color="#FFFFFF" />
                      </View>
                      <ThemedText style={[styles.startButtonText, { color: '#FFFFFF' }]}>
                        Start visualisation
                      </ThemedText>
                    </View>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 20,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    gap: 10,
  },
  loadingPulse: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  heroShell: {
    flex: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  heroCard: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroTopBand: {
    height: 8,
    width: '100%',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  contentArea: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },
  completedContainer: {
    alignItems: 'center',
    gap: 14,
  },
  statusOrb: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOrbInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextBlock: {
    alignItems: 'center',
    maxWidth: 320,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  completedText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 22,
  },
  completedSubtext: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  startContainer: {
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
  sessionPreview: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 14,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTextBlock: {
    flex: 1,
  },
  startTitle: {
    fontSize: 22,
    marginBottom: 4,
  },
  startDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  previewMetaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  startButton: {
    width: '100%',
    borderRadius: 18,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 5,
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startButtonIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Inter_700Bold',
  },
});
