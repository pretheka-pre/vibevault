import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types/song';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ArtworkImage } from './ArtworkImage';
import { RatingStars } from './RatingStars';
import { formatDuration } from '../utils/formatters';

interface SongCardProps {
  song: Song;
  onPress: () => void;
  onPlay: () => void;
  onToggleFavorite: () => void;
  isPlaying?: boolean;
  style?: ViewStyle;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onPress,
  onPlay,
  onToggleFavorite,
  isPlaying = false,
  style,
}) => {
  const moodColor = colors.moods[song.mood]?.primary || colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={`Song ${song.title} by ${song.artist}`}
      style={[styles.card, isPlaying && styles.cardActive, style]}
    >
      <View style={styles.artworkContainer}>
        <ArtworkImage
          uri={song.artwork}
          title={song.title}
          size={140}
          borderRadius={borderRadius.lg}
        />
        
        {/* Play overlay button */}
        <TouchableOpacity
          onPress={onPlay}
          activeOpacity={0.8}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause song' : 'Play song'}
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={18}
            color="#FFFFFF"
            style={!isPlaying ? { marginLeft: 2 } : undefined}
          />
        </TouchableOpacity>

        {/* Mood Badge */}
        <View style={[styles.moodBadge, { backgroundColor: colors.surfaceSubtle }]}>
          <View style={[styles.moodDot, { backgroundColor: moodColor }]} />
          <Text style={[styles.moodText, { color: moodColor }]}>
            {song.mood.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {song.title}
          </Text>
          <TouchableOpacity
            onPress={onToggleFavorite}
            hitSlop={10}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              song.isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Ionicons
              name={song.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={song.isFavorite ? colors.favoriteActive : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={styles.artist}>
          {song.artist}
        </Text>

        <View style={styles.footerRow}>
          <RatingStars rating={song.rating} size={12} />
          <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardActive: {
    borderColor: colors.primary,
    ...shadows.glowViolet,
  },
  artworkContainer: {
    position: 'relative',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    alignItems: 'center',
  },
  playButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  playButtonActive: {
    backgroundColor: colors.secondary,
  },
  moodBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(10, 12, 22, 0.85)',
  },
  moodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  moodText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  infoContainer: {
    marginTop: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginRight: 6,
  },
  artist: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  duration: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
});
