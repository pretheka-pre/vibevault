import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius as radiusTheme } from '../theme/spacing';
import { typography } from '../theme/typography';
import { getInitials } from '../utils/formatters';

interface ArtworkImageProps {
  uri?: string;
  title: string;
  size?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  uri,
  title,
  size = 60,
  borderRadius = radiusTheme.md,
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(title);

  if (!uri || hasError) {
    return (
      <LinearGradient
        colors={['#7C3AED', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.fallback,
          { width: size, height: size, borderRadius },
          style,
        ]}
      >
        <Ionicons name="musical-notes" size={size * 0.35} color="#FFFFFF" />
        {size >= 50 && (
          <Text
            numberOfLines={1}
            style={[styles.initials, { fontSize: Math.max(10, size * 0.2) }]}
          >
            {initials}
          </Text>
        )}
      </LinearGradient>
    );
  }

  return (
    <View style={[{ width: size, height: size, borderRadius }, style]}>
      <Image
        source={{ uri }}
        style={[styles.image, { borderRadius }]}
        onError={() => setHasError(true)}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    marginTop: 2,
    letterSpacing: 1,
  },
});
