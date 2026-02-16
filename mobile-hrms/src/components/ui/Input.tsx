import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, THEME } from '@constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  icon,
  rightIcon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          {...props}
          style={[
            styles.input,
            icon && { paddingLeft: THEME.spacing.lg },
            rightIcon && { paddingRight: THEME.spacing.lg },
            style,
          ]}
          placeholderTextColor={COLORS.textTertiary}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.lg,
  },
  label: {
    ...THEME.typography.bodySmall,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.sm,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    paddingVertical: THEME.spacing.md,
  },
  iconLeft: {
    marginRight: THEME.spacing.sm,
  },
  iconRight: {
    marginLeft: THEME.spacing.sm,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...THEME.typography.caption,
    color: COLORS.error,
    marginTop: THEME.spacing.xs,
  },
});
