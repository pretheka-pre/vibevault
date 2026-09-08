import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { SearchBar } from '../components/SearchBar';
import { CompactSongCard } from '../components/CompactSongCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { SkeletonCard } from '../components/SkeletonCard';
import { RootStackParamList } from '../types/navigation';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { useVaultFilter } from '../hooks/useVaultFilter';
import { useDebounce } from '../hooks/useDebounce';
import { VaultFilter } from '../types/store';
import { Song } from '../types/song';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

const FILTER_TABS: { label: string; value: VaultFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Highest Rated', value: 'top_rated' },
];

export const VaultScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const songs = useVibeVaultStore((state) => state.songs);
  const vaultFilter = useVibeVaultStore((state) => state.vaultFilter);
  const setVaultFilter = useVibeVaultStore((state) => state.setVaultFilter);
  const searchQuery = useVibeVaultStore((state) => state.searchQuery);
  const setSearchQuery = useVibeVaultStore((state) => state.setSearchQuery);

  const isVaultLoading = useVibeVaultStore((state) => state.isVaultLoading);
  const vaultError = useVibeVaultStore((state) => state.vaultError);
  const resetVaultError = useVibeVaultStore((state) => state.resetVaultError);

  const currentSong = useVibeVaultStore((state) => state.currentSong);
  const isPlaying = useVibeVaultStore((state) => state.isPlaying);
  const playSong = useVibeVaultStore((state) => state.playSong);
  const togglePlayback = useVibeVaultStore((state) => state.togglePlayback);
  const toggleFavorite = useVibeVaultStore((state) => state.toggleFavorite);

  const debouncedSearch = useDebounce(searchQuery, 250);

  // Filtered and sorted songs
  const filteredSongs = useVaultFilter({
    songs,
    searchQuery: debouncedSearch,
    vaultFilter,
  });

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

  // 1. Error State
  if (vaultError) {
    return (
      <ScreenContainer withBottomOffset>
        <ErrorState
          title="Something went wrong"
          message={vaultError}
          onRetry={resetVaultError}
          retryText="Try again"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer withBottomOffset>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Vault</Text>
        <Text style={styles.headerSubtitle}>
          {songs.length} curated tracks in your private sonic sanctuary
        </Text>
      </View>

      {/* Dynamic Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search by title, artist, album, genre..."
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsRow}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = vaultFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => setVaultFilter(tab.value)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={`Filter vault by ${tab.label}`}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
              >
                <Text
                  style={[styles.tabChipText, isActive && styles.tabChipTextActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Vault Content / Loading / Empty */}
      {isVaultLoading ? (
        <View style={styles.loadingContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} compact />
          ))}
        </View>
      ) : filteredSongs.length === 0 ? (
        debouncedSearch.length > 0 ? (
          <EmptyState
            icon="search-outline"
            title="No vibes found"
            description="Try another song, artist, or genre."
            actionText="Clear search"
            onActionPress={() => setSearchQuery('')}
          />
        ) : vaultFilter === 'favorites' ? (
          <EmptyState
            icon="heart-dislike-outline"
            title="No favorites yet"
            description="Tap the heart icon on any track to save it to your favorite collection."
            actionText="Browse all vibes"
            onActionPress={() => setVaultFilter('all')}
          />
        ) : (
          <EmptyState
            icon="cube-outline"
            title="Your vault is waiting for its first vibe."
            description="Discover songs that resonate with your moods and build your personal sound journal."
            actionText="Explore music"
            onActionPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
          />
        )
      ) : (
        <FlatList
          data={filteredSongs}
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
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: spacing.screenPadding,
    marginVertical: spacing.sm,
  },
  filterTabsContainer: {
    marginBottom: spacing.md,
  },
  filterTabsRow: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: 2,
  },
  tabChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  tabChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabChipText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  tabChipTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  loadingContainer: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
});
