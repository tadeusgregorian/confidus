import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

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

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <MaterialIcons name="menu" size={24} color="#101010" />
          <ThemedText style={styles.brand}>Celestial Sanctuary</ThemedText>
          <MaterialIcons name="search" size={22} color="#101010" />
        </View>

        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Current Path</ThemedText>
          <ThemedText style={styles.heroTitle}>Mind{"\n"}Awakening</ThemedText>
          <View style={styles.heroRule} />
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
                    ) : isLocked ? (
                      <MaterialIcons name="lock" size={14} color="#5C5C5C" />
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
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.cardInner}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.thumb}
                      contentFit="cover"
                      transition={120}
                    />

                    <View style={styles.metaRow}>
                      <ThemedText style={styles.lessonMeta}>
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

                    <ThemedText style={styles.cardTitle}>
                      {item.title}
                    </ThemedText>

                    {isCurrent ? (
                      <View style={styles.ctaButton}>
                        <MaterialIcons
                          name="play-arrow"
                          size={14}
                          color="#101010"
                        />
                        <ThemedText style={styles.ctaText}>
                          Continue Listening
                        </ThemedText>
                      </View>
                    ) : null}
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
  topBar: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  brand: {
    flex: 1,
    marginLeft: 14,
    color: "#101010",
    fontSize: 18,
    lineHeight: 22,
    fontFamily: "Inter_700Bold",
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
    backgroundColor: "#D9D6CF",
  },
  markerPlayIcon: {
    marginLeft: 1,
  },
  card: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 10,
    backgroundColor: "#050505",
    ...Shadows.surfaceMd,
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
    paddingHorizontal: 28,
    paddingVertical: 30,
  },
  thumb: {
    width: 58,
    height: 58,
    borderRadius: 4,
    backgroundColor: "#2A2A2A",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
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
  cardTitle: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 30,
    fontFamily: "Inter_700Bold",
  },
  ctaButton: {
    marginTop: 24,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#D7FF00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ctaText: {
    color: "#111111",
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
  },
});
