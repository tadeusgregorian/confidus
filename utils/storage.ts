import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_VISUALISATION_DATE_KEY = '@confidus:lastVisualisationDate';

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
    await AsyncStorage.setItem(LAST_VISUALISATION_DATE_KEY, today);
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
