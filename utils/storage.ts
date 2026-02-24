import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_VISUALISATION_DATE_KEY = '@confidus:lastVisualisationDate';
const LAST_VISUALISATION_TIMESTAMP_KEY = '@confidus:lastVisualisationTimestamp';

/**
 * Get the date string for today in YYYY-MM-DD format
 */
function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
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
