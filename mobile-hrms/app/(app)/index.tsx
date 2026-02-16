import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';
import { useLocation } from '@hooks/useLocation';
import { CheckInCard } from '@components/CheckInCard';
import { Card } from '@components/ui/Card';
import { Loading } from '@components/ui/Loading';
import { Button } from '@components/ui/Button';
import { COLORS, THEME } from '@constants/colors';
import { attendanceApi } from '@api/attendance';
import { leaveApi } from '@api/leave';
import { formatTime, formatDuration } from '@utils/formatters';
import { getDistanceFromOffice } from '@utils/geolocation';
import { LogOut, Calendar, Clock, MapPin, Briefcase } from 'lucide-react-native';

export default function HomeScreen() {
  const { state: authState, logout } = useAuth();
  const {
    location,
    loading: locationLoading,
    getCurrentLocation,
    getGeofenceStatus,
    error: locationError,
    isMockLocation,
  } = useLocation();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [leaveBalance, setLeaveBalance] = useState<{ sick: number; casual: number; earned: number } | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadTodayAttendance = async () => {
    try {
      const response = await attendanceApi.getTodayAttendance();
      if (response.success && response.data) {
        setTodayAttendance(response.data);
      }
    } catch (error) {
      console.error('Error loading today attendance:', error);
    }
  };

  const loadLeaveBalance = async () => {
    try {
      const response = await leaveApi.getLeaveBalance();
      if (response.success && response.data) {
        setLeaveBalance(response.data);
      }
    } catch (error) {
      console.error('Error loading leave balance:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTodayAttendance();
      loadLeaveBalance();
      getCurrentLocation();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([loadTodayAttendance(), loadLeaveBalance(), getCurrentLocation()]).finally(() => {
      setRefreshing(false);
    });
  }, []);

  const effectiveLocation = location;

  const handleCheckIn = async () => {
    if (!effectiveLocation) {
      Alert.alert('Location Required', 'Unable to get your location. Please enable location services or retry.');
      return;
    }

    setCheckInLoading(true);
    try {
      const response = await attendanceApi.checkIn(effectiveLocation);
      if (response.success) {
        Alert.alert('Success', 'Checked in successfully');
        loadTodayAttendance();
      } else {
        Alert.alert('Error', response.error || 'Failed to check in');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to check in');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!effectiveLocation) {
      Alert.alert('Location Required', 'Unable to get your location. Please enable location services or retry.');
      return;
    }

    setCheckInLoading(true);
    try {
      const response = await attendanceApi.checkOut(effectiveLocation);
      if (response.success) {
        Alert.alert('Success', 'Checked out successfully');
        loadTodayAttendance();
      } else {
        Alert.alert('Error', response.error || 'Failed to check out');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to check out');
    } finally {
      setCheckInLoading(false);
    }
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

  const distance = effectiveLocation ? getDistanceFromOffice(effectiveLocation) : undefined;
  const geofenceStatus = effectiveLocation ? getGeofenceStatus() : 'unknown';
  const workingHoursMinutes = todayAttendance?.workingHours != null ? todayAttendance.workingHours * 60 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* User Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hello, {authState.user?.name}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          {isMockLocation && (
            <View style={styles.mockBadge}>
              <MapPin size={12} color={COLORS.textSecondary} />
              <Text style={styles.mockBadgeText}>Demo location (mock data)</Text>
            </View>
          )}
        </View>

        {/* Check In/Out Card */}
        {locationLoading ? (
          <View style={styles.loadingContainer}>
            <Loading message="Getting your location..." />
          </View>
        ) : (
          <CheckInCard
            hasCheckedIn={todayAttendance?.hasCheckedIn || false}
            checkInTime={todayAttendance?.checkInTime}
            checkOutTime={todayAttendance?.checkOutTime}
            onCheckInPress={handleCheckIn}
            onCheckOutPress={handleCheckOut}
            geofenceStatus={geofenceStatus as any}
            distanceFromOffice={distance}
            loading={checkInLoading}
          />
        )}

        {locationError && !isMockLocation && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{locationError}</Text>
          </Card>
        )}
        {locationError && isMockLocation && (
          <Card style={styles.infoCard}>
            <Text style={styles.infoText}>{locationError}</Text>
          </Card>
        )}

        {/* Quick Stats — Today */}
        {todayAttendance && (
          <View style={styles.statsContainer}>
            <Card>
              <Text style={styles.sectionTitle}>Today</Text>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Clock size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statLabel}>Working Hours</Text>
                  <Text style={styles.statValue}>
                    {workingHoursMinutes > 0 ? formatDuration(workingHoursMinutes) : '--'}
                  </Text>
                </View>
                <View style={[styles.statItem, { borderLeftColor: COLORS.border, borderLeftWidth: 1 }]}>
                  <View style={styles.statIcon}>
                    <Calendar size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statLabel}>Status</Text>
                  <Text style={styles.statValue}>{todayAttendance.status || 'N/A'}</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Leave Balance */}
        {leaveBalance && (
          <View style={styles.statsContainer}>
            <Card>
              <Text style={styles.sectionTitle}>Leave Balance (mock)</Text>
              <View style={styles.leaveRow}>
                <View style={styles.leaveItem}>
                  <Briefcase size={18} color={COLORS.primary} />
                  <Text style={styles.leaveLabel}>Sick</Text>
                  <Text style={styles.leaveValue}>{leaveBalance.sick}d</Text>
                </View>
                <View style={styles.leaveItem}>
                  <Briefcase size={18} color={COLORS.primary} />
                  <Text style={styles.leaveLabel}>Casual</Text>
                  <Text style={styles.leaveValue}>{leaveBalance.casual}d</Text>
                </View>
                <View style={styles.leaveItem}>
                  <Briefcase size={18} color={COLORS.primary} />
                  <Text style={styles.leaveLabel}>Earned</Text>
                  <Text style={styles.leaveValue}>{leaveBalance.earned}d</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
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
  scrollView: {
    flex: 1,
  },
  greetingSection: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
  },
  greeting: {
    ...THEME.typography.h2,
    color: COLORS.textPrimary,
  },
  date: {
    ...THEME.typography.bodySmall,
    color: COLORS.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  loadingContainer: {
    paddingVertical: THEME.spacing.xl,
  },
  errorCard: {
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.md,
    backgroundColor: `${COLORS.error}20`,
    borderColor: COLORS.error,
  },
  errorText: {
    ...THEME.typography.bodySmall,
    color: COLORS.error,
  },
  infoCard: {
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.md,
    backgroundColor: `${COLORS.primary}12`,
    borderColor: COLORS.border,
  },
  infoText: {
    ...THEME.typography.bodySmall,
    color: COLORS.textSecondary,
  },
  mockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
    gap: THEME.spacing.xs,
  },
  mockBadgeText: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
    marginBottom: THEME.spacing.md,
    textTransform: 'uppercase',
  },
  statsContainer: {
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.spacing.lg,
  },
  statIcon: {
    marginBottom: THEME.spacing.md,
  },
  statLabel: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
    marginBottom: THEME.spacing.xs,
  },
  statValue: {
    ...THEME.typography.h3,
    color: COLORS.primary,
    fontWeight: '700',
  },
  leaveRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: THEME.spacing.sm,
  },
  leaveItem: {
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  leaveLabel: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
  },
  leaveValue: {
    ...THEME.typography.body,
    color: COLORS.primary,
    fontWeight: '700',
  },
  logoutSection: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xl,
  },
});
