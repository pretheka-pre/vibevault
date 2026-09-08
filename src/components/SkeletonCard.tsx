import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

interface SkeletonCardProps {
  compact?: boolean;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ compact = false, style }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <Animated.View style={[styles.compactArtwork, { opacity: pulseAnim }]} />
        <View style={styles.compactLines}>
          <Animated.View style={[styles.line, { width: '70%', opacity: pulseAnim }]} />
          <Animated.View
            style={[styles.line, { width: '45%', marginTop: 6, opacity: pulseAnim }]}
          />
        </View>
        <Animated.View style={[styles.compactCircle, { opacity: pulseAnim }]} />
      </View>
    );
  }

  return (
    <View style={[styles.cardContainer, style]}>
      <Animated.View style={[styles.cardArtwork, { opacity: pulseAnim }]} />
      <View style={styles.cardInfo}>
        <Animated.View style={[styles.line, { width: '85%', opacity: pulseAnim }]} />
        <Animated.View
          style={[styles.line, { width: '55%', marginTop: 6, opacity: pulseAnim }]}
        />
        <View style={styles.cardFooter}>
          <Animated.View style={[styles.line, { width: '30%', opacity: pulseAnim }]} />
          <Animated.View style={[styles.line, { width: '20%', opacity: pulseAnim }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardArtwork: {
    width: '100%',
    height: 140,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSubtle,
  },
  cardInfo: {
    marginTop: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactArtwork: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  compactLines: {
    flex: 1,
    marginLeft: spacing.md,
  },
  compactCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
  },
  line: {
    height: 12,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.surfaceHighlight,
  },
});
