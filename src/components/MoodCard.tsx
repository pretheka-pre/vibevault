import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Mood } from '../types/mood';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface MoodCardProps {
  mood: Mood;
  songCount: number;
  onPress: () => void;
  style?: ViewStyle;
}

export const MoodCard: React.FC<MoodCardProps> = ({
  mood,
  songCount,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Mood ${mood.title}, ${songCount} songs`}
      style={[styles.wrapper, style]}
    >
      <LinearGradient
        colors={mood.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        <View style={styles.topRow}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={mood.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{songCount} vibes</Text>
          </View>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.title}>{mood.title}</Text>
          <Text numberOfLines={1} style={styles.tagline}>
            {mood.tagline}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: '47%',
    margin: spacing.xs,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradientCard: {
    padding: spacing.md,
    height: 130,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  bottomContent: {
    marginTop: spacing.sm,
  },
  title: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
});
