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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SelectField, SelectOption } from '../components/SelectField';
import { RootStackParamList } from '../types/navigation';
import { ProfileFormData } from '../types/profile';
import { GenreType } from '../types/song';
import { MoodType } from '../types/mood';
import { mockMoods } from '../data/mockMoods';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const GENRE_OPTIONS: SelectOption[] = [
  { label: 'Synthwave', value: 'Synthwave', icon: 'pulse-outline' },
  { label: 'Lofi Beats', value: 'Lofi Beats', icon: 'cafe-outline' },
  { label: 'Indie Electronic', value: 'Indie Electronic', icon: 'radio-outline' },
  { label: 'Ambient', value: 'Ambient', icon: 'water-outline' },
  { label: 'Chillhop', value: 'Chillhop', icon: 'headset-outline' },
  { label: 'Dream Pop', value: 'Dream Pop', icon: 'cloud-outline' },
  { label: 'R&B / Soul', value: 'R&B / Soul', icon: 'heart-half-outline' },
  { label: 'Deep House', value: 'Deep House', icon: 'disc-outline' },
  { label: 'Acoustic', value: 'Acoustic', icon: 'musical-notes-outline' },
];

const MOOD_OPTIONS: SelectOption[] = mockMoods.map((m) => ({
  label: m.title,
  value: m.type,
  subtitle: m.tagline,
  icon: m.icon as keyof typeof Ionicons.glyphMap,
  color: m.accentColor,
}));

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const profile = useVibeVaultStore((state) => state.profile);
  const updateProfile = useVibeVaultStore((state) => state.updateProfile);

  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile.name,
      username: profile.username,
      favoriteGenre: profile.favoriteGenre,
      favoriteMood: profile.favoriteMood,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      // Small simulated delay to demonstrate loading state
      await new Promise((resolve) => setTimeout(resolve, 350));

      updateProfile({
        name: data.name.trim(),
        username: data.username.trim().replace(/^@/, ''),
        favoriteGenre: data.favoriteGenre,
        favoriteMood: data.favoriteMood,
      });

      navigation.goBack();
    } catch {
      Alert.alert('Update Failed', 'Could not update profile information. Please try again.');
    } finally {
      setIsSaving(false);
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
            accessibilityLabel="Cancel changes"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <View style={{ width: 48 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Name Field */}
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Display name is required',
              minLength: { value: 2, message: 'Name must have at least 2 characters' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          {/* Username Field */}
          <Controller
            control={control}
            name="username"
            rules={{
              required: 'Username is required',
              pattern: {
                value: /^[a-zA-Z0-9_]{3,20}$/,
                message: 'Username must be 3-20 characters without spaces or special symbols',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                placeholder="vibe_curator"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username?.message}
                helperText="Allowed: letters, numbers, underscores"
              />
            )}
          />

          {/* Favorite Genre */}
          <Controller
            control={control}
            name="favoriteGenre"
            rules={{ required: 'Please pick your favorite genre' }}
            render={({ field: { value, onChange } }) => (
              <SelectField
                label="Favorite Genre"
                value={value}
                options={GENRE_OPTIONS}
                onSelect={(val) => onChange(val as GenreType)}
                placeholder="Pick a genre..."
                error={errors.favoriteGenre?.message}
              />
            )}
          />

          {/* Favorite Mood */}
          <Controller
            control={control}
            name="favoriteMood"
            rules={{ required: 'Please select your core mood' }}
            render={({ field: { value, onChange } }) => (
              <SelectField
                label="Core Vibe / Mood"
                value={value}
                options={MOOD_OPTIONS}
                onSelect={(val) => onChange(val as MoodType)}
                placeholder="Select your default mood..."
                error={errors.favoriteMood?.message}
              />
            )}
          />

          {/* Save & Cancel Actions */}
          <View style={styles.actionRow}>
            <Button
              title="Save Changes"
              onPress={handleSubmit(onSubmit)}
              loading={isSaving}
              size="lg"
              icon="save-outline"
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
  actionRow: {
    marginTop: spacing.lg,
  },
});
