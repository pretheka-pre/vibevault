import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ArtworkImage } from './ArtworkImage';

interface MiniPlayerProps {
  onPress: () => void;
  style?: ViewStyle;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress, style }) => {
  const currentSong = useVibeVaultStore((state) => state.currentSong);
  const isPlaying = useVibeVaultStore((state) => state.isPlaying);
  const progress = useVibeVaultStore((state) => state.playbackProgress);
  const togglePlayback = useVibeVaultStore((state) => state.togglePlayback);
  const stopPlayback = useVibeVaultStore((state) => state.stopPlayback);

  if (!currentSong) return null;

  return (
    <View style={[styles.outerContainer, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.92}
        accessibilityRole="button"
        accessibilityLabel={`Now playing ${currentSong.title} by ${currentSong.artist}. Tap to open full player.`}
        style={styles.innerContainer}
      >
        {/* Animated simulated progress line across the top */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(0, progress * 100))}%` },
            ]}
          />
        </View>

        <View style={styles.contentRow}>
          <ArtworkImage
            uri={currentSong.artwork}
            title={currentSong.title}
            size={44}
            borderRadius={borderRadius.md}
          />

          <View style={styles.textColumn}>
            <Text numberOfLines={1} style={styles.title}>
              {currentSong.title}
            </Text>
            <Text numberOfLines={1} style={styles.artist}>
              {currentSong.artist}
            </Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                togglePlayback();
              }}
              hitSlop={8}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause song' : 'Play song'}
              style={styles.playPauseBtn}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={18}
                color="#FFFFFF"
                style={!isPlaying ? { marginLeft: 2 } : undefined}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                stopPlayback();
              }}
              hitSlop={8}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Dismiss player"
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
  innerContainer: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.lg,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primaryLight,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textColumn: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  artist: {
    fontSize: typography.sizes.xs,
    color: colors.primaryLight,
    marginTop: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  playPauseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 6,
  },
});
