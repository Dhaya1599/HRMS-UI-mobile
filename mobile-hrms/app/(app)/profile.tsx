import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Loading } from '@components/ui/Loading';
import { COLORS, THEME } from '@constants/colors';
import { profileApi } from '@api/profile';
import { User as UserIcon, Mail, Phone, Building, Briefcase, LogOut, Edit2, Lock } from 'lucide-react-native';

export default function ProfileScreen() {
  const { state: authState, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality to be implemented');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Change password functionality to be implemented');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ]
    );
  };

  const user = authState.user;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Loading fullScreen message="Loading..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            <UserIcon size={56} color={COLORS.primary} />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>
        </View>

        {/* Contact Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mail size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          {user.phone && (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Phone size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Professional Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Professional Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Briefcase size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Employee ID</Text>
              <Text style={styles.infoValue}>{user.employeeId}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Building size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{user.department}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <UserIcon size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{user.role}</Text>
            </View>
          </View>

          {user.joinDate && (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Building size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Join Date</Text>
                <Text style={styles.infoValue}>{new Date(user.joinDate).toLocaleDateString()}</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingRow} onPress={handleEditProfile}>
            <View style={styles.settingIcon}>
              <Edit2 size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, styles.borderTop]}
            onPress={handleChangePassword}
          >
            <View style={styles.settingIcon}>
              <Lock size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Change Password</Text>
          </TouchableOpacity>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            icon={<LogOut size={20} color={COLORS.textPrimary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xxxl,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  name: {
    ...THEME.typography.h2,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.xs,
  },
  role: {
    ...THEME.typography.bodySmall,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  infoCard: {
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.lg,
  },
  settingsCard: {
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.lg,
  },
  sectionTitle: {
    ...THEME.typography.h3,
    color: COLORS.textPrimary,
    marginBottom: THEME.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
    marginBottom: THEME.spacing.xs,
  },
  infoValue: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  borderTop: {
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  actionButtons: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
});
