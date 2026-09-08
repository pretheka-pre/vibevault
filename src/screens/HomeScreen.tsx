import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { SongCard } from '../components/SongCard';
import { CompactSongCard } from '../components/CompactSongCard';
import { SectionHeader } from '../components/SectionHeader';
import { RootStackParamList } from '../types/navigation';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { mockMoods } from '../data/mockMoods';
import { MoodType } from '../types/mood';
import { Song } from '../types/song';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { getDayGreeting } from '../utils/formatters';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const songs = useVibeVaultStore((state) => state.songs);
  const selectedMood = useVibeVaultStore((state) => state.selectedMood);
  const setMood = useVibeVaultStore((state) => state.setMood);
  const currentSong = useVibeVaultStore((state) => state.currentSong);
  const isPlaying = useVibeVaultStore((state) => state.isPlaying);
  const playSong = useVibeVaultStore((state) => state.playSong);
  const togglePlayback = useVibeVaultStore((state) => state.togglePlayback);
  const toggleFavorite = useVibeVaultStore((state) => state.toggleFavorite);
  const profile = useVibeVaultStore((state) => state.profile);

  const { greeting, subtitle } = getDayGreeting();

  // Filtered lists
  const moodRecommendedSongs = selectedMood
    ? songs.filter((s) => s.mood === selectedMood)
    : songs.slice(0, 6);

  const popularInVault = [...songs]
    .filter((s) => s.isFavorite || s.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const recentlyAdded = [...songs]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);

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
    <ScreenContainer withBottomOffset>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting}, {profile.name.split(' ')[0]}
            </Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
            style={styles.avatarButton}
          >
            <Ionicons name="sparkles-outline" size={20} color={colors.primaryLight} />
          </TouchableOpacity>
        </View>

        {/* Your Vibe Today - Mood Selector */}
        <View style={styles.moodSelectorSection}>
          <Text style={styles.sectionLabel}>YOUR VIBE TODAY</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodChipsRow}
          >
            {mockMoods.map((mood) => {
              const isSelected = selectedMood === mood.type;
              return (
                <TouchableOpacity
                  key={mood.id}
                  onPress={() => setMood(isSelected ? null : mood.type)}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${mood.title} mood`}
                  style={[
                    styles.moodChip,
                    isSelected && {
                      backgroundColor: mood.accentColor,
                      borderColor: mood.accentColor,
                    },
                  ]}
                >
                  <Ionicons
                    name={mood.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={isSelected ? '#FFFFFF' : colors.textSecondary}
                    style={styles.moodChipIcon}
                  />
                  <Text
                    style={[
                      styles.moodChipText,
                      isSelected && styles.moodChipTextSelected,
                    ]}
                  >
                    {mood.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Recommended for your mood */}
        <SectionHeader
          title={selectedMood ? `Vibes for ${selectedMood}` : 'Recommended For You'}
          subtitle={
            selectedMood
              ? `Curated sounds matching your ${selectedMood} frequency`
              : 'Trending frequencies matched to your taste'
          }
          actionText="Explore"
          onActionPress={() => {
            if (selectedMood) {
              const target = mockMoods.find((m) => m.type === selectedMood);
              if (target) {
                navigation.navigate('MoodDetails', { moodId: target.id });
              }
            } else {
              navigation.navigate('MainTabs', { screen: 'MoodsTab' });
            }
          }}
        />
        <FlatList
          data={moodRecommendedSongs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              isPlaying={currentSong?.id === item.id && isPlaying}
              onPress={() => handleSongPress(item)}
              onPlay={() => handlePlayToggle(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Popular in your Vault */}
        <SectionHeader
          title="Popular in Your Vault"
          subtitle="Your most cherished and highest-rated vibes"
          actionText="View Vault"
          onActionPress={() =>
            navigation.navigate('MainTabs', { screen: 'VaultTab' })
          }
          style={styles.sectionMargin}
        />
        <FlatList
          data={popularInVault}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `pop-${item.id}`}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              isPlaying={currentSong?.id === item.id && isPlaying}
              onPress={() => handleSongPress(item)}
              onPlay={() => handlePlayToggle(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Recently Added */}
        <SectionHeader
          title="Recently Added"
          subtitle="Fresh additions ready for reflection"
          style={styles.sectionMargin}
        />
        <View style={styles.verticalList}>
          {recentlyAdded.map((song) => (
            <CompactSongCard
              key={`recent-${song.id}`}
              song={song}
              isPlaying={currentSong?.id === song.id && isPlaying}
              onPress={() => handleSongPress(song)}
              onPlay={() => handlePlayToggle(song)}
              onToggleFavorite={() => toggleFavorite(song.id)}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodSelectorSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  moodChipsRow: {
    paddingVertical: 2,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  moodChipIcon: {
    marginRight: 6,
  },
  moodChipText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  moodChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  horizontalList: {
    paddingVertical: 4,
    paddingRight: spacing.md,
  },
  sectionMargin: {
    marginTop: spacing.xl,
  },
  verticalList: {
    marginTop: 4,
  },
});
