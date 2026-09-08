import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { CompactSongCard } from '../components/CompactSongCard';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { RootStackParamList } from '../types/navigation';
import { mockMoods } from '../data/mockMoods';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { Song } from '../types/song';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

type MoodDetailsRouteProp = RouteProp<RootStackParamList, 'MoodDetails'>;

export const MoodDetailsScreen: React.FC = () => {
  const route = useRoute<MoodDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { moodId } = route.params;
  const mood = mockMoods.find((m) => m.id === moodId) || mockMoods[0];

  const songs = useVibeVaultStore((state) => state.songs);
  const currentSong = useVibeVaultStore((state) => state.currentSong);
  const isPlaying = useVibeVaultStore((state) => state.isPlaying);
  const playSong = useVibeVaultStore((state) => state.playSong);
  const togglePlayback = useVibeVaultStore((state) => state.togglePlayback);
  const toggleFavorite = useVibeVaultStore((state) => state.toggleFavorite);

  const moodSongs = songs.filter((s) => s.mood === mood.type);

  const handleSongPress = (song: Song) => {
    navigation.navigate('SongDetails', { songId: song.id });
  };

  const handlePlayToggle = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayback();
    } else {
      playSong(song);
    }
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      {/* Top Header Banner */}
      <LinearGradient
        colors={mood.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={10}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.moodBadge}>
            <Ionicons
              name={mood.icon as keyof typeof Ionicons.glyphMap}
              size={14}
              color="#FFFFFF"
            />
            <Text style={styles.moodBadgeText}>{mood.type.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.bannerContent}>
          <Text style={styles.moodTitle}>{mood.title}</Text>
          <Text style={styles.moodTagline}>{mood.tagline}</Text>
          <Text style={styles.moodDescription}>{mood.description}</Text>
        </View>

        {/* Action Button: Quick Add Journal Entry */}
        <View style={styles.bannerActions}>
          <Button
            title="Reflect on this mood"
            icon="create-outline"
            size="sm"
            onPress={() =>
              navigation.navigate('AddJournalEntry', { initialMood: mood.type })
            }
            style={styles.reflectBtn}
          />
        </View>
      </LinearGradient>

      {/* Songs List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            TRACKS IN {mood.title.toUpperCase()} ({moodSongs.length})
          </Text>
        </View>

        {moodSongs.length === 0 ? (
          <EmptyState
            icon="musical-note-outline"
            title={`No songs in ${mood.title} yet`}
            description="Explore our vault to discover and categorize tracks for this frequency."
            actionText="Browse all music"
            onActionPress={() => navigation.navigate('MainTabs', { screen: 'VaultTab' })}
          />
        ) : (
          <FlatList
            data={moodSongs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CompactSongCard
                song={item}
                isPlaying={currentSong?.id === item.id && isPlaying}
                onPress={() => handleSongPress(item)}
                onPlay={() => handlePlayToggle(item)}
                onToggleFavorite={() => toggleFavorite(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heroBanner: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    ...shadows.lg,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    gap: 5,
  },
  moodBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  bannerContent: {
    marginTop: spacing.xs,
  },
  moodTitle: {
    color: '#FFFFFF',
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.heavy,
    letterSpacing: -0.5,
  },
  moodTagline: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginTop: 2,
  },
  moodDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.sizes.sm,
    marginTop: 8,
    lineHeight: typography.lineHeights.sm,
  },
  bannerActions: {
    marginTop: spacing.md,
  },
  reflectBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'flex-start',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  listHeader: {
    marginBottom: spacing.sm,
  },
  listTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
});
