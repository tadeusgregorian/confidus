import { StyleSheet, View } from 'react-native';

type FutureCardOverlayProps = {
  borderRadius?: number;
};

export function FutureCardOverlay({ borderRadius = 10 }: FutureCardOverlayProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        styles.overlay,
        { borderRadius },
      ]}>
      <View style={styles.primaryVeil} />
      <View style={styles.secondaryVeil} />
      <View style={styles.innerGlow} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    overflow: 'hidden',
  },
  primaryVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.68)',
  },
  secondaryVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 241, 234, 0.28)',
    transform: [{ scale: 1.015 }],
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.42)',
  },
});
