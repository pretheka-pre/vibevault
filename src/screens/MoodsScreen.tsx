import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { MoodCard } from '../components/MoodCard';
import { RootStackParamList } from '../types/navigation';
import { mockMoods } from '../data/mockMoods';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const MoodsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const songs = useVibeVaultStore((state) => state.songs);

  const getSongCountForMood = (moodType: string): number => {
    return songs.filter((s) => s.mood === moodType).length;
  };

  return (
    <ScreenContainer withBottomOffset>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mood Discovery</Text>
        <Text style={styles.headerSubtitle}>
          Match your current state of mind with carefully tuned frequencies
        </Text>
      </View>

      <FlatList
        data={mockMoods}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <MoodCard
            mood={item}
            songCount={getSongCountForMood(item.type)}
            onPress={() => navigation.navigate('MoodDetails', { moodId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
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
    marginTop: 4,
    lineHeight: typography.lineHeights.sm,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
