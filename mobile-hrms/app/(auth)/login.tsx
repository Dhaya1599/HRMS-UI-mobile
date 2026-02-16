import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@context/AuthContext';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Loading } from '@components/ui/Loading';
import { COLORS, THEME } from '@constants/colors';
import { validateEmail, validatePassword } from '@utils/validators';
import { Lock, Mail } from 'lucide-react-native';

export default function LoginScreen() {
  const { state, login } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ employeeId?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(employeeId, password);
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error?.response?.data?.error || error?.message || 'Please check your credentials'
      );
    }
  };

  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <Loading fullScreen message="Loading..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.appName}>HRMS</Text>
              <Text style={styles.appSubtitle}>Mobile</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.descriptionText}>
              Sign in to access your HR management dashboard
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Input
              label="Employee ID"
              placeholder="Enter your employee ID"
              value={employeeId}
              onChangeText={(text) => {
                setEmployeeId(text);
                if (errors.employeeId) setErrors({ ...errors, employeeId: '' });
              }}
              error={errors.employeeId}
              icon={<Mail size={20} color={COLORS.textSecondary} />}
              editable={!state.isLoading}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              secureTextEntry={!showPassword}
              icon={<Lock size={20} color={COLORS.textSecondary} />}
              editable={!state.isLoading}
            />

            {state.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{state.error}</Text>
              </View>
            )}

            <Button
              title={state.isLoading ? 'Signing in...' : 'Sign In'}
              onPress={handleLogin}
              loading={state.isLoading}
              disabled={state.isLoading}
              fullWidth
              style={styles.loginButton}
            />
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              For Admin access, please use the web portal
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xxxl,
  },
  logoContainer: {
    marginBottom: THEME.spacing.xl,
    alignItems: 'center',
  },
  appName: {
    ...THEME.typography.h1,
    color: COLORS.primary,
    fontWeight: '700',
  },
  appSubtitle: {
    ...THEME.typography.bodySmall,
    color: COLORS.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  welcomeText: {
    ...THEME.typography.h2,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  descriptionText: {
    ...THEME.typography.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginHorizontal: THEME.spacing.lg,
  },
  formSection: {
    marginBottom: THEME.spacing.xxxl,
  },
  errorContainer: {
    backgroundColor: COLORS.error,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.lg,
  },
  errorText: {
    ...THEME.typography.bodySmall,
    color: COLORS.textPrimary,
  },
  loginButton: {
    marginTop: THEME.spacing.lg,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: THEME.spacing.lg,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
  footerText: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
  },
});
