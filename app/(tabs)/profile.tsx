import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

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
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={[styles.avatarContainer, { borderColor: colors.icon }]}>
          <ThemedText type="title" style={styles.avatarText}>
            JD
          </ThemedText>
        </ThemedView>
        <ThemedText type="title" style={styles.userName}>
          John Doe
        </ThemedText>
        <ThemedText style={styles.userEmail}>john.doe@example.com</ThemedText>
      </ThemedView>

      <ThemedView style={styles.settingsContainer}>
        {dummySettings.map((section, sectionIndex) => (
          <ThemedView key={sectionIndex} style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {section.title}
            </ThemedText>
            <ThemedView style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <ThemedView
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder,
                    { borderColor: colors.icon },
                  ]}>
                  <ThemedText style={styles.settingItemText}>{item}</ThemedText>
                  <ThemedText style={styles.chevron}>›</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
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
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
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
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  settingItemBorder: {
    borderBottomWidth: 1,
  },
  settingItemText: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 24,
    opacity: 0.5,
  },
});
