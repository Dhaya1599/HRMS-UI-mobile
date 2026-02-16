import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, THEME } from '@constants/colors';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}) => {
  const styles = getStyles(variant, size, fullWidth);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {icon && !loading && icon}
      {loading ? (
        <ActivityIndicator color={styles.text.color} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (variant: string, size: string, fullWidth: boolean) => {
  const baseSize = {
    small: { paddingVertical: THEME.spacing.sm, paddingHorizontal: THEME.spacing.lg },
    medium: { paddingVertical: THEME.spacing.md, paddingHorizontal: THEME.spacing.xl },
    large: { paddingVertical: THEME.spacing.lg, paddingHorizontal: THEME.spacing.xxl },
  };

  const variantStyle = {
    primary: {
      button: { backgroundColor: COLORS.primary },
      text: { color: COLORS.background },
    },
    secondary: {
      button: { backgroundColor: COLORS.surfaceVariant },
      text: { color: COLORS.textPrimary },
    },
    danger: {
      button: { backgroundColor: COLORS.error },
      text: { color: COLORS.textPrimary },
    },
    outline: {
      button: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
      text: { color: COLORS.primary },
    },
  };

  const selectedVariant = variantStyle[variant as keyof typeof variantStyle] || variantStyle.primary;

  return StyleSheet.create({
    button: {
      ...baseSize[size as keyof typeof baseSize],
      ...selectedVariant.button,
      borderRadius: THEME.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: THEME.spacing.sm,
      width: fullWidth ? '100%' : 'auto',
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      ...THEME.typography.body,
      ...selectedVariant.text,
      fontWeight: '600',
    },
  });
};
