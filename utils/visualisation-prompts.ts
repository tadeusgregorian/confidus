/**
 * Daily visualization prompts for the meditation/visualization exercise
 */

const VISUALISATION_PROMPTS = [
  'a peaceful garden where you feel completely at ease',
  'your ideal future self, living your best life',
  'healing light surrounding and filling your body',
  'a serene beach with gentle waves and warm sand',
  'a mountain peak with a breathtaking view',
  'a cozy cabin in a quiet forest',
  'your happiest memory, reliving every detail',
  'a place where you feel completely safe and loved',
  'your goals and dreams coming true',
  'a field of flowers under a clear blue sky',
  'a warm embrace from someone you love',
  'your body healing and becoming stronger',
  'a calm lake reflecting the sky',
  'success and achievement in your life',
];

/**
 * Get today's visualization prompt based on the day of year
 * This ensures the same prompt appears throughout the day
 */
export function getTodaysPrompt(): string {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  
  const promptIndex = dayOfYear % VISUALISATION_PROMPTS.length;
  return VISUALISATION_PROMPTS[promptIndex];
}

/**
 * Get all available prompts (for reference)
 */
export function getAllPrompts(): string[] {
  return [...VISUALISATION_PROMPTS];
}
