import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Shadows } from "@/constants/shadows";
import { getCompletedAudioLessonIds } from "@/utils/storage";

type SessionItem = {
  id: string;
  title: string;
  duration: string;
  imageUrl: string;
};

const SPINE_CENTER_X = 28;
const SPINE_WIDTH = 4;
const MARKER_COLUMN_WIDTH = 56;

const sessions: SessionItem[] = [
  {
    id: "s1",
    title: "The Strength Within",
    duration: "08:30",
    imageUrl: "https://picsum.photos/seed/sessions-minimal-1/900/900?grayscale",
  },
  {
    id: "s2",
    title: "The Curious Child",
    duration: "12:45",
    imageUrl: "https://picsum.photos/seed/sessions-minimal-2/900/900?grayscale",
  },
  {
    id: "s3",
    title: "Subconscious Roots",
    duration: "15:20",
    imageUrl: "https://picsum.photos/seed/sessions-minimal-3/900/900?grayscale",
  },
  {
    id: "s4",
    title: "Beginner’s Mind",
    duration: "10:10",
    imageUrl: "https://picsum.photos/seed/sessions-minimal-4/900/900?grayscale",
  },
  {
    id: "s5",
    title: "The Calm Before Speaking",
    duration: "09:15",
    imageUrl: "https://picsum.photos/seed/sessions-minimal-5/900/900?grayscale",
  },
];

export default function SessionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;

      const loadCompleted = async () => {
        const ids = await getCompletedAudioLessonIds();
        if (mounted) {
          setCompletedIds(ids);
        }
      };

      void loadCompleted();

      return () => {
        mounted = false;
      };
    }, []),
  );

  const currentIndex = Math.max(
    0,
    sessions.findIndex((item) => !completedIds.includes(item.id)),
  );
  const resolvedCurrentIndex =
    currentIndex === -1 ? sessions.length - 1 : currentIndex;
  const completedCount = sessions.filter((item) =>
    completedIds.includes(item.id),
  ).length;
  const progressRatio =
    sessions.length === 0 ? 0 : completedCount / sessions.length;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top + 10, 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Current Path</ThemedText>
          <ThemedText style={styles.heroTitle}>Mind{"\n"}Awakening</ThemedText>
          <View style={styles.heroRule} />
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressLabel}>Journey Progress</ThemedText>
              <ThemedText style={styles.progressValue}>
                {`${completedCount}/${sessions.length}`}
              </ThemedText>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(progressRatio * 100, completedCount > 0 ? 8 : 0)}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.timeline}>
          <View style={styles.spine} />

          {sessions.map((item, index) => {
            const isCompleted = completedIds.includes(item.id);
            const isCurrent = index === resolvedCurrentIndex;
            const isLocked = index > resolvedCurrentIndex;

            return (
              <View key={item.id} style={styles.step}>
                <View style={styles.markerColumn}>
                  <View
                    style={[
                      styles.marker,
                      isCurrent && styles.markerCurrent,
                      isLocked && styles.markerLocked,
                    ]}
                  >
                    {isCurrent ? (
                      <MaterialIcons
                        name="play-arrow"
                        size={16}
                        color="#D7FF00"
                        style={styles.markerPlayIcon}
                      />
                    ) : isCompleted ? (
                      <View style={styles.markerDotDone} />
                    ) : (
                      <View style={styles.markerDot} />
                    )}
                  </View>
                </View>

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/lesson/[id]",
                      params: {
                        id: item.id,
                        title: item.title,
                        duration: item.duration,
                        author: "Sessions",
                        category: "Meditation",
                      },
                    })
                  }
                  style={({ pressed }) => [
                    styles.card,
                    isCurrent && styles.cardCurrent,
                    isLocked && styles.cardFuture,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={[styles.heroImage, isLocked && styles.heroImageFuture]}
                    contentFit="cover"
                    transition={120}
                  />

                  <View style={[styles.lessonBadge, isLocked && styles.lessonBadgeFuture]}>
                    <ThemedText
                      style={[
                        styles.lessonBadgeText,
                        isLocked && styles.lessonBadgeTextFuture,
                      ]}
                    >
                      {`Lesson ${index + 1}`}
                    </ThemedText>
                  </View>

                  {isLocked ? (
                    <View style={styles.lockBadge}>
                      <MaterialIcons name="lock" size={14} color="#111111" />
                    </View>
                  ) : null}

                  <View style={styles.cardInner}>
                    <View style={styles.metaRow}>
                      <ThemedText
                        style={[styles.lessonMeta, isLocked && styles.lessonMetaFuture]}
                      >
                        {`Lesson ${String(index + 1).padStart(2, "0")} · ${item.duration}`}
                      </ThemedText>

                      {isCompleted ? (
                        <View style={styles.doneChip}>
                          <ThemedText style={styles.doneChipText}>
                            Done
                          </ThemedText>
                        </View>
                      ) : isCurrent ? (
                        <ThemedText style={styles.activeLabel}>
                          • Active
                        </ThemedText>
                      ) : null}
                    </View>

                    <View style={styles.titleRow}>
                      <View
                        style={[
                          styles.titlePlayBadge,
                          isLocked && styles.titlePlayBadgeFuture,
                        ]}
                      >
                        <MaterialIcons
                          name="play-arrow"
                          size={22}
                          color={isLocked ? "#FFFFFF" : "#111111"}
                        />
                      </View>
                      <ThemedText
                        style={[styles.cardTitle, isLocked && styles.cardTitleFuture]}
                      >
                        {item.title}
                      </ThemedText>
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingTop: 20,
    paddingBottom: 120,
    paddingHorizontal: 10,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#7D7A73",
    fontFamily: "Inter_600SemiBold",
  },
  heroTitle: {
    marginTop: 8,
    color: "#111111",
    fontSize: 58,
    lineHeight: 50,
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
  },
  heroRule: {
    marginTop: 18,
    width: 88,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#111111",
  },
  progressBlock: {
    marginTop: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DCD4C7",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.72)",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#7D7A73",
    fontFamily: "Inter_600SemiBold",
  },
  progressValue: {
    fontSize: 11,
    lineHeight: 14,
    color: "#111111",
    fontFamily: "Inter_700Bold",
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F1ECE3",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E3DBCF",
    padding: 1,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#111111",
  },
  timeline: {
    position: "relative",
  },
  spine: {
    position: "absolute",
    top: 6,
    bottom: 0,
    left: SPINE_CENTER_X - SPINE_WIDTH / 2,
    width: SPINE_WIDTH,
    borderRadius: 999,
    backgroundColor: "#111111",
  },
  step: {
    position: "relative",
    paddingLeft: MARKER_COLUMN_WIDTH,
    marginBottom: 30,
  },
  markerColumn: {
    position: "absolute",
    top: 0,
    left: SPINE_CENTER_X - MARKER_COLUMN_WIDTH / 2,
    width: MARKER_COLUMN_WIDTH,
    alignItems: "center",
    paddingTop: 12,
    zIndex: 3,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#BDBDBD",
  },
  markerDotDone: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D7FF00",
  },
  markerCurrent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#111111",
    borderWidth: 2,
    borderColor: "#D7FF00",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  markerLocked: {
    backgroundColor: "#111111",
  },
  markerPlayIcon: {
    marginLeft: 1,
  },
  card: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 10,
    backgroundColor: "#050505",
    overflow: "hidden",
    position: "relative",
    ...Shadows.surfaceMd,
  },
  cardFuture: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8D2C8",
  },
  cardCurrent: {
    borderWidth: 1,
    borderColor: "#D7FF00",
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 14,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardInner: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  heroImage: {
    width: "100%",
    aspectRatio: 2.2,
    backgroundColor: "#1B1B1C",
  },
  heroImageFuture: {
    opacity: 0.24,
  },
  lessonBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(5, 5, 5, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  lessonBadgeFuture: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderColor: "#D8D2C8",
  },
  lessonBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
  },
  lessonBadgeTextFuture: {
    color: "#111111",
  },
  lockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "#D8D2C8",
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  lessonMeta: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: "#B0B0B0",
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  lessonMetaFuture: {
    color: "#5F5A53",
  },
  doneChip: {
    backgroundColor: "#D7FF00",
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  doneChipText: {
    color: "#111111",
    fontSize: 11,
    lineHeight: 13,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
  },
  activeLabel: {
    color: "#D7FF00",
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
  },
  titleRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titlePlayBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#D7FF00",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  titlePlayBadgeFuture: {
    backgroundColor: "#111111",
    shadowOpacity: 0.06,
  },
  cardTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 30,
    fontFamily: "Inter_700Bold",
  },
  cardTitleFuture: {
    color: "#111111",
  },
});
