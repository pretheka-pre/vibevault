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
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ArtworkImage } from './ArtworkImage';
import { RatingStars } from './RatingStars';
import { formatDuration } from '../utils/formatters';

interface CompactSongCardProps {
  song: Song;
  onPress: () => void;
  onPlay: () => void;
  onToggleFavorite: () => void;
  isPlaying?: boolean;
  style?: ViewStyle;
}

export const CompactSongCard: React.FC<CompactSongCardProps> = ({
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
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Song ${song.title} by ${song.artist}`}
      style={[styles.container, isPlaying && styles.containerActive, style]}
    >
      <View style={styles.leftSection}>
        <View style={styles.artworkWrapper}>
          <ArtworkImage
            uri={song.artwork}
            title={song.title}
            size={52}
            borderRadius={borderRadius.md}
          />
          {isPlaying && (
            <View style={styles.playingIndicatorOverlay}>
              <Ionicons name="volume-high" size={18} color="#FFFFFF" />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={[styles.title, isPlaying && styles.titlePlaying]}>
            {song.title}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {song.artist} • <Text style={{ color: moodColor }}>{song.mood}</Text>
          </Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={song.rating} size={11} />
            <Text style={styles.genreText}> • {song.genre}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Text style={styles.duration}>{formatDuration(song.duration)}</Text>

        <TouchableOpacity
          onPress={onToggleFavorite}
          hitSlop={12}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            song.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
          style={styles.actionBtn}
        >
          <Ionicons
            name={song.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={song.isFavorite ? colors.favoriteActive : colors.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPlay}
          hitSlop={10}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={14}
            color="#FFFFFF"
            style={!isPlaying ? { marginLeft: 1 } : undefined}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSubtle,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  artworkWrapper: {
    position: 'relative',
    marginRight: spacing.md,
  },
  playingIndicatorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 92, 246, 0.65)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  titlePlaying: {
    color: colors.primaryLight,
  },
  artist: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  genreText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  duration: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginRight: 4,
  },
  actionBtn: {
    padding: 6,
  },
  playBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnActive: {
    backgroundColor: colors.secondary,
  },
});
