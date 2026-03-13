import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_VISUALISATION_DATE_KEY = '@confidus:lastVisualisationDate';
const LAST_VISUALISATION_TIMESTAMP_KEY = '@confidus:lastVisualisationTimestamp';
const COMMITMENT_DATES_KEY = '@confidus:commitmentDates';

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
 * Check if visualization was completed today
 */
export async function isVisualisationCompletedToday(): Promise<boolean> {
  try {
    const lastDate = await AsyncStorage.getItem(LAST_VISUALISATION_DATE_KEY);
    const today = getTodayDateString();
    return lastDate === today;
  } catch (error) {
    console.error('Error checking visualization completion:', error);
    return false;
  }
}

/**
 * Mark visualization as completed for today
 */
export async function markVisualisationCompleted(): Promise<void> {
  try {
    const today = getTodayDateString();
    const timestamp = Date.now().toString();
    await AsyncStorage.setItem(LAST_VISUALISATION_DATE_KEY, today);
    await AsyncStorage.setItem(LAST_VISUALISATION_TIMESTAMP_KEY, timestamp);
  } catch (error) {
    console.error('Error saving visualization completion:', error);
    throw error;
  }
}

/**
 * Get the last completion date (for debugging/testing)
 */
export async function getLastCompletionDate(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_VISUALISATION_DATE_KEY);
  } catch (error) {
    console.error('Error getting last completion date:', error);
    return null;
  }
}

/**
 * Get the last completion timestamp
 */
export async function getLastCompletionTimestamp(): Promise<number | null> {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_VISUALISATION_TIMESTAMP_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last completion timestamp:', error);
    return null;
  }
}

/**
 * Check if visualization is overdue (more than 24 hours since last completion)
 */
export async function isVisualisationOverdue(): Promise<boolean> {
  try {
    const lastTimestamp = await getLastCompletionTimestamp();
    if (lastTimestamp === null) {
      // No visualization ever done, show badge
      return true;
    }
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (now - lastTimestamp) > twentyFourHours;
  } catch (error) {
    console.error('Error checking if visualization is overdue:', error);
    return true;
  }
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
