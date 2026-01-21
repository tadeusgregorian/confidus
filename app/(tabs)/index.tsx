import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
};

const dummyLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to React Native',
    description: 'Learn the fundamentals of React Native development',
    duration: '15:30',
  },
  {
    id: '2',
    title: 'Building Your First Component',
    description: 'Create reusable components for your app',
    duration: '12:45',
  },
  {
    id: '3',
    title: 'State Management Basics',
    description: 'Understanding state and props in React Native',
    duration: '18:20',
  },
  {
    id: '4',
    title: 'Navigation and Routing',
    description: 'Implement navigation between screens',
    duration: '22:10',
  },
  {
    id: '5',
    title: 'Working with APIs',
    description: 'Fetch and display data from remote sources',
    duration: '16:55',
  },
  {
    id: '6',
    title: 'Styling and Theming',
    description: 'Create beautiful UIs with styled components',
    duration: '14:30',
  },
];

export default function LessonsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderLessonItem = ({ item, index }: { item: Lesson; index: number }) => {
    const isLeftImageLayout = index % 2 === 1; // Alternate: odd indices get left image

    return (
      <Pressable
        style={({ pressed }) => [
          styles.lessonItem,
          { backgroundColor: colors.background },
          pressed && { opacity: 0.7 },
        ]}
        onPress={() => router.push(`/lesson/${item.id}`)}>
        <ThemedView style={styles.lessonContent}>
          {isLeftImageLayout ? (
            <View style={styles.horizontalLayout}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.id}-dark/200/150` }}
                style={styles.lessonImageLeft}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.lessonTextContainer}>
                <ThemedText type="cardTitle" style={styles.lessonTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.lessonDescription} numberOfLines={2}>
                  {item.description}{' '}
                  <ThemedText style={styles.lessonDurationInline}>
                    {item.duration}
                  </ThemedText>
                </ThemedText>
              </View>
            </View>
          ) : (
            <>
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.id}-dark/400/200` }}
                style={styles.lessonImageTop}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.lessonTextContainer}>
                <ThemedText type="cardTitle" style={styles.lessonTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.lessonDescription} numberOfLines={2}>
                  {item.description}{' '}
                  <ThemedText style={styles.lessonDurationInline}>
                    {item.duration}
                  </ThemedText>
                </ThemedText>
              </View>
            </>
          )}
        </ThemedView>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Lessons</ThemedText>
      </ThemedView>
      <FlatList
        data={dummyLessons}
        renderItem={renderLessonItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        style={styles.list}
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
    paddingBottom: 16,
  },
  list: {
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#F5F5F5',
  },
  lessonItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonContent: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  horizontalLayout: {
    flexDirection: 'row',
    minHeight: 120,
  },
  lessonImageTop: {
    width: '100%',
    height: 140,
    backgroundColor: '#E0E0E0',
  },
  lessonImageLeft: {
    width: 120,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  lessonTextContainer: {
    padding: 16,
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
    lineHeight: 22,
  },
  lessonDurationInline: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});