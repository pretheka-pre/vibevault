import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface RatingStarsProps {
  rating: number; // 0 to 5
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  style?: ViewStyle;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  interactive = false,
  onRate,
  style,
}) => {
  const stars = Array.from({ length: maxRating }, (_, index) => index + 1);

  return (
    <View style={[styles.container, style]}>
      {stars.map((starValue) => {
        const isFilled = starValue <= rating;
        const starIcon = (
          <Ionicons
            key={starValue}
            name={isFilled ? 'star' : 'star-outline'}
            size={size}
            color={isFilled ? colors.ratingStar : colors.ratingStarEmpty}
            style={styles.star}
          />
        );

        if (interactive && onRate) {
          return (
            <TouchableOpacity
              key={starValue}
              onPress={() => onRate(starValue)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              {starIcon}
            </TouchableOpacity>
          );
        }

        return <View key={starValue}>{starIcon}</View>;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 3,
  },
});
