import AsyncStorage from '@react-native-async-storage/async-storage';

const COMMITMENT_DATES_KEY = '@confidus:commitmentDates';
const COMPLETED_AUDIO_LESSONS_KEY = '@confidus:completedAudioLessons';

/**
 * Get a local date string in YYYY-MM-DD format
 */
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayDateString(): string {
  return toLocalDateString(new Date());
}

/**
 * Get all committed dates (YYYY-MM-DD)
 */
export async function getCommitmentDates(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(COMMITMENT_DATES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value): value is string => typeof value === 'string');
  } catch (error) {
    console.error('Error getting commitment dates:', error);
    return [];
  }
}

/**
 * Mark commitment completed for a date (defaults to today)
 */
export async function markCommitmentCompleted(dateString?: string): Promise<void> {
  try {
    const date = dateString ?? getTodayDateString();
    const existing = await getCommitmentDates();
    if (existing.includes(date)) {
      return;
    }
    const updated = [...existing, date].sort();
    await AsyncStorage.setItem(COMMITMENT_DATES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving commitment completion:', error);
    throw error;
  }
}

/**
 * Check if commitment was completed today
 */
export async function isCommitmentCompletedToday(): Promise<boolean> {
  try {
    const today = getTodayDateString();
    const dates = await getCommitmentDates();
    return dates.includes(today);
  } catch (error) {
    console.error('Error checking commitment completion:', error);
    return false;
  }
}

export async function getCompletedAudioLessonIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(COMPLETED_AUDIO_LESSONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value): value is string => typeof value === 'string');
  } catch (error) {
    console.error('Error getting completed audio lessons:', error);
    return [];
  }
}

export async function markAudioLessonCompleted(id: string): Promise<void> {
  try {
    const existing = await getCompletedAudioLessonIds();
    if (existing.includes(id)) {
      return;
    }
    const updated = [...existing, id];
    await AsyncStorage.setItem(COMPLETED_AUDIO_LESSONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving completed audio lesson:', error);
    throw error;
  }
}
