import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';
import { useLocation } from '@hooks/useLocation';
import { CheckInCard } from '@components/CheckInCard';
import { Card } from '@components/ui/Card';
import { Loading } from '@components/ui/Loading';
import { Button } from '@components/ui/Button';
import { Text } from 'react-native';
import { COLORS, THEME } from '@constants/colors';
import { attendanceApi } from '@api/attendance';
import { formatTime, formatDuration } from '@utils/formatters';
import { getDistanceFromOffice } from '@utils/geolocation';
import { LogOut, Calendar, Clock } from 'lucide-react-native';

export default function HomeScreen() {
  const { state: authState, logout } = useAuth();
  const { location, loading: locationLoading, getCurrentLocation, getGeofenceStatus, error: locationError } = useLocation();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
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

  useFocusEffect(
    React.useCallback(() => {
      loadTodayAttendance();
      getCurrentLocation();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([loadTodayAttendance(), getCurrentLocation()]).finally(() => {
      setRefreshing(false);
    });
  }, []);

  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert('Location Required', 'Unable to get your location. Please enable location services.');
      return;
    }

    setCheckInLoading(true);
    try {
      const response = await attendanceApi.checkIn(location);
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
    if (!location) {
      Alert.alert('Location Required', 'Unable to get your location. Please enable location services.');
      return;
    }

    setCheckInLoading(true);
    try {
      const response = await attendanceApi.checkOut(location);
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

  const distance = location ? getDistanceFromOffice(location) : undefined;
  const geofenceStatus = location ? getGeofenceStatus() : 'unknown';

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
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
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

        {locationError && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{locationError}</Text>
          </Card>
        )}

        {/* Quick Stats */}
        {todayAttendance && (
          <View style={styles.statsContainer}>
            <Card>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Clock size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statLabel}>Working Hours</Text>
                  <Text style={styles.statValue}>
                    {todayAttendance.workingHours ? formatDuration(todayAttendance.workingHours) : '--'}
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
  logoutSection: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xl,
  },
});
