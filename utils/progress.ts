/** Lesson IDs used on the Lessons timeline (must match `app/(tabs)/index.tsx`). */
export const LESSON_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

/** Session IDs (must match `app/(tabs)/sessions.tsx`). */
export const SESSION_IDS = ['s1', 's2', 's3', 's4', 's5'] as const;

export function countCompletedLessons(completedIds: string[]): number {
  return LESSON_IDS.filter((id) => completedIds.includes(id)).length;
}

export function countCompletedSessions(completedIds: string[]): number {
  return SESSION_IDS.filter((id) => completedIds.includes(id)).length;
}

export const TOTAL_LESSONS = LESSON_IDS.length;
export const TOTAL_SESSIONS = SESSION_IDS.length;

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Monday 00:00:00 local for the week that contains `date`. */
export function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export type WeekDaySlot = {
  label: string;
  dateKey: string;
  completed: boolean;
};

/** Seven slots Mon–Sun for the week containing `reference`, with commitment completion flags. */
export function buildWeekSlots(
  reference: Date,
  commitmentDateKeys: string[],
): WeekDaySlot[] {
  const monday = getMondayOfWeek(reference);
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const slots: WeekDaySlot[] = [];
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const dateKey = toLocalDateString(day);
    slots.push({
      label: labels[i],
      dateKey,
      completed: commitmentDateKeys.includes(dateKey),
    });
  }
  return slots;
}
