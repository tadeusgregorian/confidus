import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SettingSection = {
  title: string;
  items: string[];
};

const dummySettings: SettingSection[] = [
  {
    title: 'Account',
    items: ['Edit Profile', 'Change Password', 'Email Preferences', 'Privacy Settings'],
  },
  {
    title: 'Preferences',
    items: ['Language', 'Theme', 'Notifications', 'Auto-play Lessons'],
  },
  {
    title: 'About',
    items: ['Version 1.0.0', 'Terms of Service', 'Privacy Policy', 'Contact Support'],
  },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.tabBar }]}>
          <ThemedText type="title" style={styles.avatarText}>
            JD
          </ThemedText>
        </View>
        <ThemedText type="title" style={styles.userName}>
          John Doe
        </ThemedText>
        <ThemedText style={[styles.userEmail, { color: colors.muted }]}>
          john.doe@example.com
        </ThemedText>
      </ThemedView>

      <View style={styles.settingsContainer}>
        {dummySettings.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {section.title}
            </ThemedText>
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder,
                    { borderColor: colors.tabBar },
                  ]}>
                  <ThemedText style={styles.settingItemText}>{item}</ThemedText>
                  <ThemedText style={[styles.chevron, { color: colors.mutedLight }]}>›</ThemedText>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  settingsContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
  },
  settingItemText: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 22,
  },
});
