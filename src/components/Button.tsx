import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; spinnerColor: string } => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
          text: { color: colors.textPrimary },
          spinnerColor: colors.textPrimary,
        };
      case 'outline':
        return {
          container: { backgroundColor: 'transparent', borderColor: colors.primary, borderWidth: 1.5 },
          text: { color: colors.primaryLight },
          spinnerColor: colors.primary,
        };
      case 'danger':
        return {
          container: { backgroundColor: colors.errorSubtle, borderColor: colors.error },
          text: { color: colors.error },
          spinnerColor: colors.error,
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent', borderWidth: 0 },
          text: { color: colors.textSecondary },
          spinnerColor: colors.textSecondary,
        };
      case 'primary':
      default:
        return {
          container: { backgroundColor: colors.primary, borderColor: colors.primary },
          text: { color: colors.textPrimary },
          spinnerColor: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: borderRadius.sm },
          text: { fontSize: typography.sizes.sm },
          iconSize: 16,
        };
      case 'lg':
        return {
          container: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: borderRadius.lg },
          text: { fontSize: typography.sizes.lg },
          iconSize: 22,
        };
      case 'md':
      default:
        return {
          container: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: borderRadius.md },
          text: { fontSize: typography.sizes.md },
          iconSize: 18,
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={[
        styles.baseButton,
        variantStyle.container,
        sizeStyle.container,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.spinnerColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={sizeStyle.iconSize}
              color={variantStyle.text.color as string}
              style={styles.iconLeft}
            />
          )}
          <Text style={[styles.baseText, variantStyle.text, sizeStyle.text, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={sizeStyle.iconSize}
              color={variantStyle.text.color as string}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  baseText: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
