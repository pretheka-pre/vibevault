import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { ArtworkImage } from '../components/ArtworkImage';
import { RatingStars } from '../components/RatingStars';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types/navigation';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatDuration, formatDate } from '../utils/formatters';

type SongDetailsRouteProp = RouteProp<RootStackParamList, 'SongDetails'>;

export const SongDetailsScreen: React.FC = () => {
  const route = useRoute<SongDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  const { songId } = route.params;

  const songs = useVibeVaultStore((state) => state.songs);
  const song = songs.find((s) => s.id === songId) || songs[0];

  const currentSong = useVibeVaultStore((state) => state.currentSong);
  const isPlaying = useVibeVaultStore((state) => state.isPlaying);
  const playbackProgress = useVibeVaultStore((state) => state.playbackProgress);
  const playSong = useVibeVaultStore((state) => state.playSong);
  const togglePlayback = useVibeVaultStore((state) => state.togglePlayback);
  const toggleFavorite = useVibeVaultStore((state) => state.toggleFavorite);
  const rateSong = useVibeVaultStore((state) => state.rateSong);
  const journalEntries = useVibeVaultStore((state) => state.journalEntries);

  const isCurrentSongPlaying = currentSong?.id === song.id && isPlaying;
  const songReflections = journalEntries.filter((e) => e.songId === song.id);

  const moodColor = colors.moods[song.mood]?.primary || colors.primary;
  const artworkSize = Math.min(width - 64, 300);

  const handlePlayToggle = () => {
    if (currentSong?.id === song.id) {
      togglePlayback();
    } else {
      playSong(song);
    }
  };

  const currentSeconds = Math.floor(song.duration * (currentSong?.id === song.id ? playbackProgress : 0));

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      {/* Navigation Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={10}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.iconCircle}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>NOW PLAYING</Text>

        <TouchableOpacity
          onPress={() => toggleFavorite(song.id)}
          hitSlop={10}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            song.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
          style={styles.iconCircle}
        >
          <Ionicons
            name={song.isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={song.isFavorite ? colors.favoriteActive : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Large Artwork */}
        <View style={styles.artworkSection}>
          <View style={[styles.artworkWrapper, { width: artworkSize, height: artworkSize }]}>
            <ArtworkImage
              uri={song.artwork}
              title={song.title}
              size={artworkSize}
              borderRadius={borderRadius.xxl}
            />
          </View>
        </View>

        {/* Title, Artist, & Badges */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{song.title}</Text>
              <Text style={styles.artist}>{song.artist}</Text>
              <Text style={styles.album}>
                {song.album} • {song.releaseYear}
              </Text>
            </View>

            <View style={[styles.moodTag, { backgroundColor: colors.surfaceSubtle }]}>
              <View style={[styles.moodDot, { backgroundColor: moodColor }]} />
              <Text style={[styles.moodTagText, { color: moodColor }]}>
                {song.mood.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Simulated Playback Scrubber */}
          <View style={styles.playbackContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${
                      currentSong?.id === song.id
                        ? Math.min(100, Math.max(0, playbackProgress * 100))
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatDuration(currentSeconds)}</Text>
              <Text style={styles.timeText}>{formatDuration(song.duration)}</Text>
            </View>
          </View>

          {/* Primary Controls Row */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={() => toggleFavorite(song.id)}
              hitSlop={10}
              activeOpacity={0.7}
              style={styles.secondaryControl}
              accessibilityLabel="Favorite"
            >
              <Ionicons
                name={song.isFavorite ? 'heart' : 'heart-outline'}
                size={26}
                color={song.isFavorite ? colors.favoriteActive : colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePlayToggle}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isCurrentSongPlaying ? 'Pause song' : 'Play song'}
              style={[styles.mainPlayBtn, isCurrentSongPlaying && styles.mainPlayBtnActive]}
            >
              <Ionicons
                name={isCurrentSongPlaying ? 'pause' : 'play'}
                size={34}
                color="#FFFFFF"
                style={!isCurrentSongPlaying ? { marginLeft: 3 } : undefined}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddJournalEntry', {
                  initialSongId: song.id,
                  initialMood: song.mood,
                })
              }
              hitSlop={10}
              activeOpacity={0.7}
              style={styles.secondaryControl}
              accessibilityLabel="Add journal entry"
            >
              <Ionicons name="create-outline" size={26} color={colors.primaryLight} />
            </TouchableOpacity>
          </View>

          {/* Interactive Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.sectionLabel}>TAP TO RATE THIS VIBE</Text>
            <RatingStars
              rating={song.rating}
              size={28}
              interactive
              onRate={(newRating) => rateSong(song.id, newRating)}
            />
          </View>

          {/* Description & Curatorial Notes */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>SONIC NOTES & TEXTURES</Text>
            <Text style={styles.descriptionText}>{song.description}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaItem}>Genre: <Text style={styles.metaHighlight}>{song.genre}</Text></Text>
              <Text style={styles.metaItem}>Tempo: <Text style={styles.metaHighlight}>92 BPM</Text></Text>
              <Text style={styles.metaItem}>Key: <Text style={styles.metaHighlight}>F# Minor</Text></Text>
            </View>
          </View>

          {/* Reflection / Journal Entries for this song */}
          <View style={styles.reflectionsSection}>
            <View style={styles.reflectionsHeader}>
              <Text style={styles.sectionLabel}>
                YOUR REFLECTIONS ({songReflections.length})
              </Text>
              <Button
                title="+ Add Note"
                size="sm"
                variant="outline"
                onPress={() =>
                  navigation.navigate('AddJournalEntry', {
                    initialSongId: song.id,
                    initialMood: song.mood,
                  })
                }
              />
            </View>

            {songReflections.length === 0 ? (
              <View style={styles.emptyReflectionCard}>
                <Ionicons name="journal-outline" size={24} color={colors.textMuted} />
                <Text style={styles.emptyReflectionText}>
                  No journal thoughts captured for this song yet. Record what you feel while listening!
                </Text>
              </View>
            ) : (
              songReflections.map((entry) => (
                <View key={entry.id} style={styles.reflectionCard}>
                  <View style={styles.reflectionTop}>
                    <RatingStars rating={entry.rating} size={12} />
                    <Text style={styles.reflectionDate}>{formatDate(entry.createdAt)}</Text>
                  </View>
                  <Text style={styles.reflectionNote}>{entry.note}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.sm,
  },
  topBarTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollContent: {
    paddingBottom: spacing.massive,
  },
  artworkSection: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  artworkWrapper: {
    ...shadows.lg,
    borderRadius: borderRadius.xxl,
  },
  infoSection: {
    paddingHorizontal: spacing.screenPadding,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  artist: {
    fontSize: typography.sizes.lg,
    color: colors.primaryLight,
    fontWeight: typography.weights.semibold,
    marginTop: 2,
  },
  album: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  moodTagText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  playbackContainer: {
    marginTop: spacing.lg,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: spacing.lg,
  },
  secondaryControl: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glowViolet,
  },
  mainPlayBtnActive: {
    backgroundColor: colors.secondary,
    ...shadows.glowPink,
  },
  ratingSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  descriptionSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  descriptionText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaItem: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  metaHighlight: {
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  reflectionsSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reflectionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  emptyReflectionCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  emptyReflectionText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  reflectionCard: {
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reflectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reflectionDate: {
    fontSize: 10,
    color: colors.textMuted,
  },
  reflectionNote: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
