import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SelectField, SelectOption } from '../components/SelectField';
import { RatingStars } from '../components/RatingStars';
import { RootStackParamList } from '../types/navigation';
import { JournalFormData } from '../types/journal';
import { MoodType } from '../types/mood';
import { mockMoods } from '../data/mockMoods';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

type AddJournalRouteProp = RouteProp<RootStackParamList, 'AddJournalEntry'>;

export const AddJournalEntryScreen: React.FC = () => {
  const route = useRoute<AddJournalRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const initialSongId = route.params?.initialSongId;
  const initialMood = route.params?.initialMood;

  const songs = useVibeVaultStore((state) => state.songs);
  const addJournalEntry = useVibeVaultStore((state) => state.addJournalEntry);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill options
  const defaultSong = initialSongId
    ? songs.find((s) => s.id === initialSongId)
    : songs[0];
  const defaultMood: MoodType = initialMood || defaultSong?.mood || 'chill';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JournalFormData>({
    defaultValues: {
      songId: defaultSong ? defaultSong.id : '',
      mood: defaultMood,
      rating: defaultSong ? defaultSong.rating : 5,
      note: '',
    },
  });

  const songOptions: SelectOption[] = songs.map((s) => ({
    label: s.title,
    value: s.id,
    subtitle: `${s.artist} • ${s.genre}`,
    icon: 'musical-note-outline',
  }));

  const moodOptions: SelectOption[] = mockMoods.map((m) => ({
    label: m.title,
    value: m.type,
    subtitle: m.tagline,
    icon: m.icon as keyof typeof Ionicons.glyphMap,
    color: m.accentColor,
  }));

  const onSubmit = async (data: JournalFormData) => {
    try {
      setIsSubmitting(true);
      // Small simulated async save delay for realistic UI responsiveness
      await new Promise((resolve) => setTimeout(resolve, 350));

      const success = addJournalEntry({
        songId: data.songId,
        mood: data.mood,
        rating: data.rating,
        note: data.note.trim(),
      });

      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Save Error', 'Could not save your reflection. Please check the song selection.');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred while saving your reflection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCancel}
            hitSlop={8}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Cancel entry"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>New Reflection</Text>

          <View style={{ width: 48 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.promptBanner}>
            <Ionicons name="bulb-outline" size={20} color={colors.primaryLight} />
            <Text style={styles.promptText}>
              Capture how this music made you feel, what memories it unlocked, or where it transported you.
            </Text>
          </View>

          {/* Song Selector */}
          <Controller
            control={control}
            name="songId"
            rules={{ required: 'Please select a song to reflect upon' }}
            render={({ field: { value, onChange } }) => (
              <SelectField
                label="Selected Song"
                value={value}
                options={songOptions}
                onSelect={onChange}
                placeholder="Choose a track..."
                error={errors.songId?.message}
              />
            )}
          />

          {/* Mood Selector */}
          <Controller
            control={control}
            name="mood"
            rules={{ required: 'Please choose a mood' }}
            render={({ field: { value, onChange } }) => (
              <SelectField
                label="Associated Mood"
                value={value}
                options={moodOptions}
                onSelect={(val) => onChange(val as MoodType)}
                placeholder="Choose the mood..."
                error={errors.mood?.message}
              />
            )}
          />

          {/* Rating Stars Input */}
          <View style={styles.ratingFieldContainer}>
            <Text style={styles.fieldLabel}>HOW HARD DID IT HIT? (RATING)</Text>
            <Controller
              control={control}
              name="rating"
              rules={{
                required: 'Please provide a rating',
                min: { value: 1, message: 'Rating must be at least 1 star' },
              }}
              render={({ field: { value, onChange } }) => (
                <View style={styles.ratingWrapper}>
                  <RatingStars
                    rating={value}
                    size={32}
                    interactive
                    onRate={onChange}
                  />
                  <Text style={styles.ratingValueText}>{value} / 5 Stars</Text>
                </View>
              )}
            />
            {errors.rating && (
              <Text style={styles.errorText}>{errors.rating.message}</Text>
            )}
          </View>

          {/* Reflection Note */}
          <Controller
            control={control}
            name="note"
            rules={{
              required: 'Reflection note is required',
              minLength: {
                value: 10,
                message: 'Please write at least 10 characters describing your feeling',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Your Sonic Reflection"
                placeholder="What feelings, thoughts, or visuals did this track evoke?"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                error={errors.note?.message}
                helperText="Min. 10 characters"
              />
            )}
          />

          {/* Actions */}
          <View style={styles.actionButtons}>
            <Button
              title="Save reflection"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              size="lg"
              icon="checkmark-circle-outline"
            />
            <Button
              title="Cancel"
              variant="ghost"
              size="md"
              onPress={handleCancel}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.massive,
  },
  promptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderActive,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  promptText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
  fieldLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  ratingFieldContainer: {
    marginBottom: spacing.md,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingValueText: {
    fontSize: typography.sizes.sm,
    color: colors.ratingStar,
    fontWeight: typography.weights.bold,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: 4,
    fontWeight: typography.weights.medium,
  },
  actionButtons: {
    marginTop: spacing.md,
  },
});
