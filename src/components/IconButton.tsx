import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Insets,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

type IconButtonVariant = 'default' | 'filled' | 'primary' | 'ghost';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress: () => void;
  variant?: IconButtonVariant;
  style?: ViewStyle;
  hitSlop?: Insets | number;
  accessibilityLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 22,
  color,
  onPress,
  variant = 'ghost',
  style,
  hitSlop = 10,
  accessibilityLabel,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.surfaceSubtle,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'primary':
        return {
          backgroundColor: colors.primary,
        };
      case 'default':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'ghost':
      default:
        return {
          backgroundColor: 'transparent',
        };
    }
  };

  const defaultColor =
    variant === 'primary'
      ? '#FFFFFF'
      : color || colors.textPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={
        typeof hitSlop === 'number'
          ? { top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop }
          : hitSlop
      }
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, getContainerStyle(), style]}
    >
      <Ionicons name={icon} size={size} color={defaultColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: borderRadius.full,
  },
});
