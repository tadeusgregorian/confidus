import React from 'react';

import { DayTimelineScreen, type DayTimelineItem } from '@/components/day-timeline-screen';

const sessions: DayTimelineItem[] = [
  {
    id: 's1',
    title: 'The Strength Within',
    description: 'Reconnect with your inner stability, self-trust, and quiet personal power.',
    duration: '13 Minutes',
    subtitle: 'Inner Stability',
    artVariant: 'mist',
  },
  {
    id: 's2',
    title: 'The Curious Child',
    description: 'A gentle journey into playfulness, openness, and the natural confidence of exploration.',
    duration: '11 Minutes',
    subtitle: 'Open Presence',
    artVariant: 'orb',
  },
  {
    id: 's3',
    title: 'Subconscious Roots',
    description: 'Feel grounded, steady, and supported from within through a deep hypnotic session.',
    duration: '13 Minutes',
    subtitle: 'Deep Grounding',
    artVariant: 'spiral',
  },
  {
    id: 's4',
    title: 'Beginner’s Mind',
    description: 'Release self-judgment and enter social moments with freshness and openness.',
    duration: '10 Minutes',
    subtitle: 'Fresh Awareness',
    artVariant: 'flare',
  },
  {
    id: 's5',
    title: 'The Calm Before Speaking',
    description: 'Relax body and mind before conversations, meetings, or socially charged moments.',
    duration: '9 Minutes',
    subtitle: 'Soft Landing',
    artVariant: 'mist',
  },
  {
    id: 's6',
    title: 'Unshaken Presence',
    description: 'Build emotional steadiness and stay centered while others are watching.',
    duration: '12 Minutes',
    subtitle: 'Steady Core',
    artVariant: 'spiral',
  },
  {
    id: 's7',
    title: 'The Golden Self',
    description: 'Step into a brighter, more radiant, and more confident version of yourself.',
    duration: '11 Minutes',
    subtitle: 'Radiant Identity',
    artVariant: 'flare',
  },
  {
    id: 's8',
    title: 'The Quiet Power',
    description: 'A meditation proving that confidence does not need to be loud to be real.',
    duration: '9 Minutes',
    subtitle: 'Silent Strength',
    artVariant: 'orb',
  },
  {
    id: 's9',
    title: 'Walking With Certainty',
    description: 'Visualize moving through the world with grounded energy and natural self-assurance.',
    duration: '11 Minutes',
    subtitle: 'Embodied Confidence',
    artVariant: 'mist',
  },
  {
    id: 's10',
    title: 'The Fearless Spark',
    description: 'Awaken courage and willingness to take small social risks with less resistance.',
    duration: '12 Minutes',
    subtitle: 'Courage Activation',
    artVariant: 'flare',
  },
  {
    id: 's11',
    title: 'Soft Eyes, Strong Heart',
    description: 'Blend gentleness and courage so you can stay open without feeling overwhelmed.',
    duration: '10 Minutes',
    subtitle: 'Gentle Power',
    artVariant: 'orb',
  },
  {
    id: 's12',
    title: 'The Inner Throne',
    description: 'Practice sitting firmly in your own worth, dignity, and right to be seen.',
    duration: '12 Minutes',
    subtitle: 'Inner Worth',
    artVariant: 'spiral',
  },
  {
    id: 's13',
    title: 'Beyond the Inner Critic',
    description: 'Loosen self-doubt and create more space for self-acceptance and self-respect.',
    duration: '13 Minutes',
    subtitle: 'Self Acceptance',
    artVariant: 'mist',
  },
  {
    id: 's14',
    title: 'The River of Ease',
    description: 'Release tension, overthinking, and social pressure through a softer inner rhythm.',
    duration: '9 Minutes',
    subtitle: 'Ease Response',
    artVariant: 'orb',
  },
  {
    id: 's15',
    title: 'Magnetic Presence',
    description: 'Feel warm, expressive, and naturally engaging in the presence of other people.',
    duration: '11 Minutes',
    subtitle: 'Warm Expression',
    artVariant: 'flare',
  },
  {
    id: 's16',
    title: 'The Door Opens',
    description: 'Step beyond hesitation and into new possibilities in life, connection, and visibility.',
    duration: '12 Minutes',
    subtitle: 'New Possibility',
    artVariant: 'mist',
  },
  {
    id: 's17',
    title: 'The Steady Flame',
    description: 'Build calm confidence that remains available even when life feels uncertain.',
    duration: '10 Minutes',
    subtitle: 'Calm Confidence',
    artVariant: 'flare',
  },
  {
    id: 's18',
    title: 'A Larger Sky',
    description: 'Feel less trapped by anxious thoughts and more open, spacious, and internally free.',
    duration: '11 Minutes',
    subtitle: 'Spacious Mind',
    artVariant: 'spiral',
  },
  {
    id: 's19',
    title: 'The Brave Heart Rehearsal',
    description: 'Rehearse showing up more courageously in daily conversations and challenges.',
    duration: '12 Minutes',
    subtitle: 'Courage Practice',
    artVariant: 'mist',
  },
  {
    id: 's20',
    title: 'Rewriting the Inner Story',
    description: 'Soften old limiting beliefs and plant new patterns of confidence and self-worth.',
    duration: '13 Minutes',
    subtitle: 'Pattern Shift',
    artVariant: 'orb',
  },
];

export default function SessionsScreen() {
  return (
    <DayTimelineScreen
      eyebrow="Guided Transformation Collection"
      title="Sessions"
      items={sessions}
      currentDayIndex={1}
      variant="orb"
    />
  );
}
