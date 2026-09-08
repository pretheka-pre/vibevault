import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { ArtworkImage } from '../components/ArtworkImage';
import { RatingStars } from '../components/RatingStars';
import { RootStackParamList } from '../types/navigation';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatDate } from '../utils/formatters';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const profile = useVibeVaultStore((state) => state.profile);
  const songs = useVibeVaultStore((state) => state.songs);
  const favorites = useVibeVaultStore((state) => state.favorites);
  const journalEntries = useVibeVaultStore((state) => state.journalEntries);
  const deleteJournalEntry = useVibeVaultStore((state) => state.deleteJournalEntry);

  const simulateVaultError = useVibeVaultStore((state) => state.simulateVaultError);
  const simulateVaultLoading = useVibeVaultStore((state) => state.simulateVaultLoading);
  const resetToDemoData = useVibeVaultStore((state) => state.resetToDemoData);

  const handleDeleteReflection = (id: string, songTitle: string) => {
    Alert.alert(
      'Delete Reflection',
      `Are you sure you want to remove your reflection for "${songTitle}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteJournalEntry(id),
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Demo Data',
      'This will reset your favorites, journal entries, and profile back to the initial assessment state.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetToDemoData() },
      ]
    );
  };

  return (
    <ScreenContainer withBottomOffset>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <ArtworkImage
              uri={profile.avatarUrl}
              title={profile.name}
              size={84}
              borderRadius={42}
            />
          </View>

          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          <Button
            title="Edit Profile"
            variant="outline"
            size="sm"
            icon="pencil-outline"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editBtn}
          />
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{songs.length}</Text>
            <Text style={styles.statLabel}>Songs in Vault</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxBorder]}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{journalEntries.length}</Text>
            <Text style={styles.statLabel}>Reflections</Text>
          </View>
        </View>

        {/* Music Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>MUSIC PREFERENCES</Text>

          <View style={styles.prefRow}>
            <View style={styles.prefItem}>
              <Text style={styles.prefLabel}>FAVORITE GENRE</Text>
              <View style={styles.prefBadge}>
                <Ionicons name="disc-outline" size={14} color={colors.primaryLight} />
                <Text style={styles.prefValue}>{profile.favoriteGenre}</Text>
              </View>
            </View>

            <View style={styles.prefItem}>
              <Text style={styles.prefLabel}>CORE VIBE</Text>
              <View style={styles.prefBadge}>
                <Ionicons name="pulse-outline" size={14} color={colors.secondary} />
                <Text style={styles.prefValue}>
                  {profile.favoriteMood.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Journal Activity / Diary Reflections */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              JOURNAL ACTIVITY ({journalEntries.length})
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddJournalEntry', {})}
              hitSlop={8}
            >
              <Text style={styles.actionLink}>+ New Entry</Text>
            </TouchableOpacity>
          </View>

          {journalEntries.length === 0 ? (
            <View style={styles.emptyJournal}>
              <Ionicons name="book-outline" size={28} color={colors.textMuted} />
              <Text style={styles.emptyJournalText}>
                No thoughts recorded yet. Start capturing your musical memories!
              </Text>
            </View>
          ) : (
            journalEntries.map((entry) => (
              <View key={entry.id} style={styles.journalCard}>
                <View style={styles.journalTop}>
                  <View style={styles.journalSongInfo}>
                    <ArtworkImage
                      uri={entry.artwork}
                      title={entry.songTitle}
                      size={36}
                      borderRadius={borderRadius.sm}
                    />
                    <View style={styles.journalSongText}>
                      <Text numberOfLines={1} style={styles.journalSongTitle}>
                        {entry.songTitle}
                      </Text>
                      <Text numberOfLines={1} style={styles.journalArtist}>
                        {entry.artist}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteReflection(entry.id, entry.songTitle)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Delete reflection"
                    style={styles.deleteReflectionBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>

                <View style={styles.journalMetaRow}>
                  <RatingStars rating={entry.rating} size={12} />
                  <Text style={styles.journalDate}>
                    {formatDate(entry.createdAt)} •{' '}
                    <Text style={{ color: colors.primaryLight }}>{entry.mood}</Text>
                  </Text>
                </View>

                <Text style={styles.journalNote}>{entry.note}</Text>
              </View>
            ))
          )}
        </View>

        {/* Assessment Evaluation Panel */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ASSESSMENT REVIEW CONTROLS</Text>
          <Text style={styles.evalDescription}>
            Easily trigger loading states, empty states, or simulated storage errors to review error-handling.
          </Text>

          <View style={styles.evalButtons}>
            <Button
              title="Simulate Vault Error State"
              variant="danger"
              size="sm"
              icon="alert-circle-outline"
              onPress={() => {
                simulateVaultError();
                navigation.navigate('MainTabs', { screen: 'VaultTab' });
              }}
              style={{ marginBottom: spacing.xs }}
            />
            <Button
              title="Simulate Vault Loading Skeletons"
              variant="secondary"
              size="sm"
              icon="hourglass-outline"
              onPress={() => {
                simulateVaultLoading();
                navigation.navigate('MainTabs', { screen: 'VaultTab' });
              }}
              style={{ marginBottom: spacing.xs }}
            />
            <Button
              title="Reset to Initial Demo State"
              variant="outline"
              size="sm"
              icon="refresh-outline"
              onPress={handleResetData}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.massive,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    ...shadows.glowViolet,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  username: {
    fontSize: typography.sizes.sm,
    color: colors.primaryLight,
    marginTop: 2,
    fontWeight: typography.weights.medium,
  },
  bio: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
  },
  editBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  prefItem: {
    flex: 1,
  },
  prefLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  prefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  prefValue: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionLink: {
    fontSize: typography.sizes.xs,
    color: colors.primaryLight,
    fontWeight: typography.weights.semibold,
  },
  emptyJournal: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  emptyJournalText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  journalCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  journalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journalSongInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  journalSongText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  journalSongTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  journalArtist: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  deleteReflectionBtn: {
    padding: 6,
  },
  journalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 4,
  },
  journalDate: {
    fontSize: 10,
    color: colors.textMuted,
  },
  journalNote: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  evalDescription: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  evalButtons: {
    gap: 4,
  },
});
