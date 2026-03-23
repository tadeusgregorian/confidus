import React from 'react';

import { DayTimelineScreen, type DayTimelineItem } from '@/components/day-timeline-screen';

const lessons: DayTimelineItem[] = [
  {
    id: '1',
    title: 'Confidence Comes After Action',
    description: 'Start with the core theory from Gillian Butler and build confidence through movement.',
    duration: '15 Minutes',
  },
  {
    id: '2',
    title: 'Confidence Comes After Action',
    description: 'A guided meditation to turn the lesson into a calm embodied practice for today.',
    duration: '12 Minutes',
  },
  {
    id: '3',
    title: 'Introversion Is Not Shyness',
    description: 'Reframe quietness through Susan Cain’s lens and loosen the fear around being seen.',
    duration: '18 Minutes',
  },
  {
    id: '4',
    title: 'Introversion Is Not Shyness',
    description: 'Slow down, settle inward, and let the message land through a reflective meditation.',
    duration: '22 Minutes',
  },
  {
    id: '5',
    title: 'Confident People Act Despite Fear',
    description: 'Learn why confident people move first and let courage catch up afterward.',
    duration: '17 Minutes',
  },
  {
    id: '6',
    title: 'Confident People Act Despite Fear',
    description: 'Train your nervous system to stay softer while stepping toward what scares you.',
    duration: '14 Minutes',
  },
  {
    id: '7',
    title: 'Full Catastrophe Living',
    description: 'A practical theory session on meeting discomfort without shrinking away from it.',
    duration: '17 Minutes',
  },
  {
    id: '8',
    title: 'Full Catastrophe Living',
    description: 'Use mindful attention to stay present with intensity and recover your steadiness.',
    duration: '14 Minutes',
  },
];

export default function LessonsScreen() {
  return (
    <DayTimelineScreen
      eyebrow="Adaptive Learning Path"
      title="Lessons"
      items={lessons}
      currentDayIndex={1}
    />
  );
}
