import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Shadows } from "@/constants/shadows";
import {
  TOTAL_LESSONS,
  TOTAL_SESSIONS,
  buildWeekSlots,
  countCompletedLessons,
  countCompletedSessions,
} from "@/utils/progress";
import {
  getCommitmentDates,
  getCompletedAudioLessonIds,
  isCommitmentCompletedToday,
} from "@/utils/storage";

const MOTIVATION =
  "Small steps today become the path you trust tomorrow.";

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lessonDone, setLessonDone] = useState(0);
  const [sessionDone, setSessionDone] = useState(0);
  const [weekSlots, setWeekSlots] = useState(buildWeekSlots(new Date(), []));
  const [todayCommitted, setTodayCommitted] = useState(false);

  const load = useCallback(async () => {
    const [completedIds, commitmentDates, committedToday] = await Promise.all([
      getCompletedAudioLessonIds(),
      getCommitmentDates(),
      isCommitmentCompletedToday(),
    ]);

    setLessonDone(countCompletedLessons(completedIds));
    setSessionDone(countCompletedSessions(completedIds));
    setWeekSlots(buildWeekSlots(new Date(), commitmentDates));
    setTodayCommitted(committedToday);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const lessonPct =
    TOTAL_LESSONS > 0 ? Math.min(1, lessonDone / TOTAL_LESSONS) : 0;
  const sessionPct =
    TOTAL_SESSIONS > 0 ? Math.min(1, sessionDone / TOTAL_SESSIONS) : 0;
  const commitmentDone = weekSlots.filter((slot) => slot.completed).length;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top + 10, 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.heroPanelCompact}>
            <View style={styles.heroCompactTopRow}>
              <View style={styles.heroCompactCopy}>
                <ThemedText style={styles.eyebrow}>Daily Overview</ThemedText>
                <ThemedText style={styles.heroTitleCompact}>
                  Your stats at a glance
                </ThemedText>
                <ThemedText style={styles.headerCopyCompact}>
                  {MOTIVATION}
                </ThemedText>
              </View>

              <View style={styles.heroCompactBadge}>
                <MaterialIcons name="insights" size={18} color="#214C36" />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <ThemedText style={styles.statValue}>
                  {lessonDone}/{TOTAL_LESSONS}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Lessons</ThemedText>
              </View>
              <View style={styles.statCard}>
                <ThemedText style={styles.statValue}>
                  {sessionDone}/{TOTAL_SESSIONS}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Sessions</ThemedText>
              </View>
              <View style={styles.statCard}>
                <ThemedText style={styles.statValue}>{commitmentDone}/7</ThemedText>
                <ThemedText style={styles.statLabel}>This Week</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/(tabs)")}
          style={({ pressed }) => [
            styles.widget,
            styles.widgetDark,
            pressed && styles.widgetPressed,
          ]}
        >
          <View style={styles.widgetDiagnosticLine} />
          <View style={styles.widgetMetaRow}>
            <ThemedText style={styles.widgetEyebrow}>
              Lessons Journey
            </ThemedText>
            <ThemedText style={styles.widgetMetaValue}>
              {lessonDone}/{TOTAL_LESSONS}
            </ThemedText>
          </View>

          <ThemedText style={styles.widgetTitleDark}>
            Keep moving through the lesson path.
          </ThemedText>

          <View style={styles.progressTrackDark}>
            <View
              style={[
                styles.progressFillAccent,
                { width: `${Math.max(lessonPct * 100, lessonDone > 0 ? 8 : 0)}%` },
              ]}
            />
          </View>

          <View style={styles.insightStrip}>
            <View style={styles.insightPillDark} />
            <View style={styles.insightPillDarkWide} />
            <View style={styles.insightPillDark} />
          </View>

          <View style={styles.widgetFooterRow}>
            <ThemedText style={styles.widgetFootnoteDark}>
              Core guidance and theory sessions
            </ThemedText>
            <View style={styles.ctaPill}>
              <MaterialIcons name="arrow-forward" size={14} color="#101010" />
              <ThemedText style={styles.ctaPillText}>Open Lessons</ThemedText>
            </View>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/sessions")}
          style={({ pressed }) => [
            styles.widget,
            styles.widgetLight,
            pressed && styles.widgetPressed,
          ]}
        >
          <View style={styles.widgetImageWrap}>
            <Image
              source={{
                uri: "https://picsum.photos/seed/dashboard-session-editorial/1200/700?grayscale",
              }}
              style={styles.widgetImage}
              contentFit="cover"
              transition={180}
            />
            <View style={styles.imageOverlayBadge}>
              <View style={styles.imageOverlayDot} />
              <View style={styles.imageOverlayDot} />
              <View style={styles.imageOverlayDotSoft} />
            </View>
          </View>

          <View style={styles.widgetBody}>
            <View style={styles.widgetMetaRow}>
              <ThemedText style={styles.widgetEyebrowMuted}>
                Sessions Archive
              </ThemedText>
              <ThemedText style={styles.widgetMetaValueDark}>
                {sessionDone}/{TOTAL_SESSIONS}
              </ThemedText>
            </View>

            <ThemedText style={styles.widgetTitleLight}>
              Continue the deeper guided sessions.
            </ThemedText>

            <View style={styles.progressTrackLight}>
              <View
                style={[
                  styles.progressFillDark,
                  { width: `${Math.max(sessionPct * 100, sessionDone > 0 ? 8 : 0)}%` },
                ]}
              />
            </View>

            <View style={styles.analysisRail}>
              <View style={styles.analysisRailNode} />
              <View style={styles.analysisRailLine} />
              <View style={styles.analysisRailNodeSoft} />
              <View style={styles.analysisRailLine} />
              <View style={styles.analysisRailNode} />
            </View>

            <ThemedText style={styles.widgetFootnoteLight}>
              Hypnosis, meditation, and visualization paths
            </ThemedText>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/calendar")}
          style={({ pressed }) => [
            styles.widget,
            styles.widgetDark,
            pressed && styles.widgetPressed,
          ]}
        >
          <View style={styles.commitmentBackdropArc} />
          <View style={styles.commitmentHeader}>
            <View>
              <ThemedText style={styles.widgetEyebrow}>
                Commitment Rhythm
              </ThemedText>
              <ThemedText style={styles.commitmentTitleDark}>
                {todayCommitted
                  ? "Today’s commitment is complete."
                  : "A commitment is waiting for today."}
              </ThemedText>
            </View>

            <View
              style={[
                styles.commitmentBadge,
                todayCommitted
                  ? styles.commitmentBadgeDone
                  : styles.commitmentBadgeOpen,
              ]}
            >
              <MaterialIcons
                name={todayCommitted ? "check" : "schedule"}
                size={16}
                color={todayCommitted ? "#214C36" : "#101010"}
              />
            </View>
          </View>

          <View style={styles.weekStrip}>
            {weekSlots.map((slot) => (
              <View key={slot.dateKey} style={styles.dayCell}>
                <ThemedText style={styles.dayLabelDark}>{slot.label}</ThemedText>
                <View
                  style={[
                    styles.dayCircleDark,
                    slot.completed && styles.dayCircleComplete,
                  ]}
                >
                  {slot.completed ? (
                    <MaterialIcons name="check" size={15} color="#214C36" />
                  ) : null}
                </View>
                <View
                  style={[
                    styles.dayBaseline,
                    slot.completed && styles.dayBaselineComplete,
                  ]}
                />
              </View>
            ))}
          </View>

          <View style={styles.commitmentFooter}>
            <View style={styles.progressInline}>
              <ThemedText style={styles.progressInlineTextDark}>
                {commitmentDone}/7 this week
              </ThemedText>
            </View>
            <ThemedText style={styles.widgetFootnoteDark}>
              Tap to open the calendar and add today’s ritual
            </ThemedText>
          </View>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  heroPanelCompact: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FAF7F1",
    borderWidth: 1,
    borderColor: "#E7DCCB",
    ...Shadows.surfaceSm,
  },
  heroCompactTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  heroCompactCopy: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#7D7A73",
    fontFamily: "Inter_600SemiBold",
  },
  heroTitleCompact: {
    marginTop: 6,
    color: "#111111",
    fontSize: 24,
    lineHeight: 28,
    fontFamily: "Inter_700Bold",
  },
  heroCompactBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E9F1E7",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopyCompact: {
    marginTop: 8,
    maxWidth: 240,
    color: "#7D7A73",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minHeight: 68,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE2D2",
    justifyContent: "space-between",
  },
  statValue: {
    color: "#111111",
    fontSize: 18,
    lineHeight: 22,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    color: "#7D7A73",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "Inter_600SemiBold",
  },
  widget: {
    marginHorizontal: 10,
    marginBottom: 18,
    borderRadius: 18,
    overflow: "hidden",
    ...Shadows.surfaceLg,
  },
  widgetDark: {
    backgroundColor: "#050505",
    paddingHorizontal: 22,
    paddingVertical: 22,
  },
  widgetLight: {
    backgroundColor: "#FBFAF7",
    borderWidth: 1,
    borderColor: "#E4D9C7",
  },
  widgetPressed: {
    opacity: 0.94,
  },
  widgetBody: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
  },
  widgetDiagnosticLine: {
    width: "100%",
    height: 1,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  widgetMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  widgetEyebrow: {
    flex: 1,
    color: "#B0B0B0",
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "Inter_600SemiBold",
  },
  widgetEyebrowMuted: {
    flex: 1,
    color: "#7D7A73",
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "Inter_600SemiBold",
  },
  widgetMetaValue: {
    color: "#D7FF00",
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "Inter_700Bold",
  },
  widgetMetaValueDark: {
    color: "#111111",
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "Inter_700Bold",
  },
  widgetTitleDark: {
    marginTop: 14,
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "Inter_700Bold",
    maxWidth: 300,
  },
  widgetTitleLight: {
    marginTop: 12,
    color: "#111111",
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "Inter_700Bold",
    maxWidth: 300,
  },
  progressTrackDark: {
    marginTop: 18,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  progressTrackLight: {
    marginTop: 16,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#E6E1D7",
  },
  progressFillAccent: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#D7FF00",
  },
  progressFillDark: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#111111",
  },
  widgetFooterRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },
  widgetFootnoteDark: {
    flex: 1,
    color: "#A0A0A0",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
  widgetFootnoteLight: {
    color: "#7D7A73",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
  insightStrip: {
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
  },
  insightPillDark: {
    width: 36,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  insightPillDarkWide: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(215,255,0,0.36)",
  },
  ctaPill: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 14,
    backgroundColor: "#D7FF00",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ctaPillText: {
    color: "#101010",
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
  },
  widgetImageWrap: {
    position: "relative",
    height: 212,
    backgroundColor: "#ECE8DE",
  },
  widgetImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlayBadge: {
    position: "absolute",
    right: 16,
    top: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(251,250,247,0.84)",
    borderWidth: 1,
    borderColor: "rgba(17,17,17,0.08)",
  },
  imageOverlayDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#111111",
  },
  imageOverlayDotSoft: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#111111",
    opacity: 0.24,
  },
  analysisRail: {
    marginTop: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  analysisRailNode: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: "#111111",
  },
  analysisRailNodeSoft: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: "#111111",
    opacity: 0.32,
  },
  analysisRailLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D7D1C6",
    marginHorizontal: 6,
  },
  commitmentHeader: {
    position: "relative",
    paddingHorizontal: 22,
    paddingTop: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  commitmentTitleDark: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "Inter_700Bold",
    maxWidth: 260,
  },
  commitmentBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  commitmentBadgeDone: {
    backgroundColor: "#E2F0E6",
  },
  commitmentBadgeOpen: {
    backgroundColor: "#D7FF00",
  },
  commitmentBackdropArc: {
    position: "absolute",
    right: -16,
    top: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  weekStrip: {
    paddingHorizontal: 18,
    paddingTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  dayLabelDark: {
    color: "#B0B0B0",
    fontSize: 10,
    lineHeight: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
  },
  dayCircleDark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleComplete: {
    backgroundColor: "#E9F1E7",
  },
  dayBaseline: {
    width: 18,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#DED6CA",
  },
  dayBaselineComplete: {
    backgroundColor: "#214C36",
  },
  commitmentFooter: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
    gap: 10,
  },
  progressInline: {
    alignSelf: "flex-start",
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressInlineTextDark: {
    color: "#D7FF00",
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
  },
});
