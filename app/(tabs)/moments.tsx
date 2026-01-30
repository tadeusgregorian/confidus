import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type AudioLesson = {
  id: string;
  title: string;
  duration: string;
};

type Moment = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  lessons: AudioLesson[];
};

const dummyMoments: Moment[] = [
  {
    id: "1",
    title: "Before a Big Meeting",
    description:
      "Calm your nerves and boost your confidence before important conversations",
    imageUrl: "https://picsum.photos/seed/meeting-calm/400/250",
    accentColor: "#6366F1",
    lessons: [
      { id: "1a", title: "3-Minute Calm Breathing", duration: "3:00" },
      { id: "1b", title: "Confidence Affirmations", duration: "5:30" },
      { id: "1c", title: "Power Pose Visualization", duration: "4:15" },
    ],
  },
  {
    id: "2",
    title: "Feeling Overwhelmed",
    description:
      "Reset your mind when everything feels like too much to handle",
    imageUrl: "https://picsum.photos/seed/overwhelmed-peace/400/250",
    accentColor: "#EC4899",
    lessons: [
      { id: "2a", title: "Grounding Exercise", duration: "4:00" },
      { id: "2b", title: "Release the Pressure", duration: "6:45" },
    ],
  },
  {
    id: "3",
    title: "Can't Fall Asleep",
    description:
      "Gentle meditations to quiet your racing mind and drift into rest",
    imageUrl: "https://picsum.photos/seed/sleep-night/400/250",
    accentColor: "#8B5CF6",
    lessons: [
      { id: "3a", title: "Body Scan Relaxation", duration: "8:00" },
      { id: "3b", title: "Counting Breaths", duration: "5:00" },
      { id: "3c", title: "Sleep Story: The Forest", duration: "12:30" },
    ],
  },
  {
    id: "4",
    title: "Need an Energy Boost",
    description:
      "Quick exercises to re-energize your body and sharpen your focus",
    imageUrl: "https://picsum.photos/seed/energy-boost/400/250",
    accentColor: "#F59E0B",
    lessons: [
      { id: "4a", title: "Energizing Breathwork", duration: "3:30" },
      { id: "4b", title: "Quick Mindful Movement", duration: "5:00" },
    ],
  },
];

export default function MomentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const renderAudioLesson = (lesson: AudioLesson, accentColor: string) => (
    <Pressable
      key={lesson.id}
      style={({ pressed }) => [
        styles.audioLesson,
        { backgroundColor: colors.card },
        pressed && { opacity: 0.8 },
      ]}
      onPress={() => router.push(`/lesson/${lesson.id}`)}
    >
      <View style={[styles.playIconContainer, { backgroundColor: accentColor }]}>
        <IconSymbol name="play.fill" size={12} color="#FFFFFF" />
      </View>
      <ThemedText style={[styles.audioTitle, { color: colors.text }]} numberOfLines={1}>
        {lesson.title}
      </ThemedText>
      <ThemedText style={[styles.audioDuration, { color: colors.mutedLight }]}>
        {lesson.duration}
      </ThemedText>
    </Pressable>
  );

  const renderMomentItem = ({ item }: { item: Moment }) => (
    <View style={styles.momentContainer}>
      <View style={styles.momentCardShadow}>
        <View style={[styles.momentCard, { backgroundColor: colors.card }]}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.momentImage}
            contentFit="cover"
            transition={200}
          />
          <View style={[styles.accentBar, { backgroundColor: item.accentColor }]} />
          <View style={styles.momentTextContainer}>
            <ThemedText
              type="cardTitle"
              style={[styles.momentTitle, { color: colors.text }]}
            >
              {item.title}
            </ThemedText>
            <ThemedText
              style={[styles.momentDescription, { color: colors.muted }]}
              numberOfLines={2}
            >
              {item.description}
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.lessonsContainer}>
        {item.lessons.map((lesson) => renderAudioLesson(lesson, item.accentColor))}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Moments</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
          Quick help for specific situations
        </ThemedText>
      </ThemedView>
      <FlatList
        data={dummyMoments}
        renderItem={renderMomentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: colors.background },
        ]}
        style={[styles.list, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  list: {},
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  momentContainer: {
    marginBottom: 24,
  },
  momentCardShadow: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  momentCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  momentImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#E0E6EB",
  },
  accentBar: {
    height: 4,
    width: "100%",
  },
  momentTextContainer: {
    padding: 16,
  },
  momentTitle: {
    fontSize: 20,
    marginBottom: 6,
  },
  momentDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  lessonsContainer: {
    marginTop: 12,
    gap: 8,
  },
  audioLesson: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingLeft: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  playIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  audioTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  audioDuration: {
    fontSize: 12,
    marginLeft: 8,
  },
});
