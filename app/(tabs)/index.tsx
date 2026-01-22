import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Lesson = {
  id: string;
  title: string;
  description: string;
  tag: 'theory' | 'meditation';
  duration: string;
};

const dummyLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to React Native',
    description: 'Learn the fundamentals of React Native development',
    tag: 'theory',
    duration: '15:30',
  },
  {
    id: '2',
    title: 'Building Your First Component',
    description: 'Create reusable components for your app',
    tag: 'meditation',
    duration: '12:45',
  },
  {
    id: '3',
    title: 'State Management Basics',
    description: 'Understanding state and props in React Native',
    tag: 'theory',
    duration: '18:20',
  },
  {
    id: '4',
    title: 'Navigation and Routing',
    description: 'Implement navigation between screens',
    tag: 'meditation',
    duration: '22:10',
  },
  {
    id: '5',
    title: 'Working with APIs',
    description: 'Fetch and display data from remote sources',
    tag: 'theory',
    duration: '16:55',
  },
  {
    id: '6',
    title: 'Styling and Theming',
    description: 'Create beautiful UIs with styled components',
    tag: 'meditation',
    duration: '14:30',
  },
];

export default function LessonsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderLessonItem = ({ item }: { item: Lesson }) => (
    <Pressable
      style={({ pressed }) => [
        styles.lessonItem,
        { backgroundColor: colors.card },
        pressed && { opacity: 0.9 },
      ]}
      onPress={() => router.push(`/lesson/${item.id}`)}>
      <View style={styles.lessonContent}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${item.id}-dark/200/200` }}
          style={styles.lessonImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.lessonTextContainer}>
          <ThemedText type="cardTitle" style={[styles.lessonTitle, { color: colors.text }]}>
            {item.title}
          </ThemedText>
          <ThemedText style={[styles.lessonDescription, { color: colors.muted }]} numberOfLines={2}>
            {item.description}
          </ThemedText>
          <View style={styles.tagRow}>
            <View style={[
              styles.tag,
              item.tag === 'theory' 
                ? { backgroundColor: '#DBEAFE' } 
                : { backgroundColor: '#EDE9FE' }
            ]}>
              <ThemedText style={[
                styles.tagText,
                { color: item.tag === 'theory' ? '#3B82F6' : '#8B5CF6' }
              ]}>
                {item.tag === 'theory' ? 'Theory' : 'Meditation'}
              </ThemedText>
            </View>
            <ThemedText style={[styles.duration, { color: colors.mutedLight }]}>
              {item.duration}
            </ThemedText>
            <View style={styles.headphonesIconContainer}>
              <IconSymbol name="headphones" size={18} color={colors.muted} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Lessons</ThemedText>
      </ThemedView>
      <FlatList
        data={dummyLessons}
        renderItem={renderLessonItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
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
    paddingBottom: 16,
  },
  list: {},
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  lessonItem: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    minHeight: 96,
    position: 'relative',
  },
  lessonImage: {
    width: 92,
    height: 92,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#E0E6EB',
  },
  lessonTextContainer: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 12,
    justifyContent: 'center',
  },
  lessonTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  headphonesIconContainer: {
    // position: 'absolute',
    // bottom: 12,
    // right: 12,
  },
  lessonDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 0,
    borderRadius: 2,
    marginBottom: 2,
    marginRight: 'auto'
  },
  tagText: {
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 18,
  },
  duration: {
    fontSize: 10,
    marginRight: 4
  },
});