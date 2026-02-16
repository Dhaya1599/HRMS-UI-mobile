import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { COLORS, THEME } from '@constants/colors';
import { formatTime, formatDistance } from '@utils/formatters';
import { LocationCoordinates } from '@types/index';
import { MapPin, Clock, AlertCircle } from 'lucide-react-native';

interface CheckInCardProps {
  hasCheckedIn: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  onCheckInPress: () => void;
  onCheckOutPress: () => void;
  geofenceStatus: 'inside' | 'outside' | 'unknown';
  distanceFromOffice?: number;
  loading?: boolean;
  disabled?: boolean;
}

export const CheckInCard: React.FC<CheckInCardProps> = ({
  hasCheckedIn,
  checkInTime,
  checkOutTime,
  onCheckInPress,
  onCheckOutPress,
  geofenceStatus,
  distanceFromOffice,
  loading = false,
  disabled = false,
}) => {
  const showCheckOut = hasCheckedIn && !checkOutTime;

  return (
    <Card elevation="lg" style={styles.container}>
      {/* Geofence Status */}
      <View style={styles.statusRow}>
        <View style={styles.statusContent}>
          <View style={[styles.statusIcon, { backgroundColor: getGeofenceColor(geofenceStatus) }]}>
            <MapPin size={16} color={COLORS.background} />
          </View>
          <View style={styles.statusText}>
            <Text style={styles.statusLabel}>Location Status</Text>
            <Text style={styles.statusValue}>
              {geofenceStatus === 'inside' ? 'At Office' : geofenceStatus === 'outside' ? 'Outside Office' : 'Unknown'}
            </Text>
          </View>
        </View>
        {distanceFromOffice !== undefined && (
          <Text style={styles.distance}>{formatDistance(distanceFromOffice)}</Text>
        )}
      </View>

      {geofenceStatus === 'outside' && (
        <View style={styles.warningContainer}>
          <AlertCircle size={16} color={COLORS.warning} />
          <Text style={styles.warningText}>
            Move closer to the office to check in
          </Text>
        </View>
      )}

      {/* Check In/Out Status */}
      <View style={styles.timeSection}>
        {checkInTime && (
          <View style={styles.timeRow}>
            <Clock size={16} color={COLORS.textSecondary} />
            <Text style={styles.timeLabel}>Check In</Text>
            <Text style={styles.timeValue}>{formatTime(checkInTime)}</Text>
          </View>
        )}
        {checkOutTime && (
          <View style={styles.timeRow}>
            <Clock size={16} color={COLORS.textSecondary} />
            <Text style={styles.timeLabel}>Check Out</Text>
            <Text style={styles.timeValue}>{formatTime(checkOutTime)}</Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        {!hasCheckedIn ? (
          <TouchableOpacity
            style={[styles.button, styles.checkInButton, disabled && styles.disabledButton]}
            onPress={onCheckInPress}
            disabled={disabled || geofenceStatus === 'outside' || loading}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Checking In...' : 'Check In'}
            </Text>
          </TouchableOpacity>
        ) : !checkOutTime ? (
          <TouchableOpacity
            style={[styles.button, styles.checkOutButton, disabled && styles.disabledButton]}
            onPress={onCheckOutPress}
            disabled={disabled || geofenceStatus === 'outside' || loading}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Checking Out...' : 'Check Out'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.button, styles.completedButton]}>
            <Text style={styles.buttonText}>Checked Out</Text>
          </View>
        )}
      </View>

      {/* Status Badge */}
      <View style={styles.badgeRow}>
        <Badge
          label={hasCheckedIn && !checkOutTime ? 'Checked In' : checkOutTime ? 'Completed' : 'Not Started'}
          variant={hasCheckedIn ? (checkOutTime ? 'success' : 'info') : 'default'}
        />
      </View>
    </Card>
  );
};

const getGeofenceColor = (status: string): string => {
  switch (status) {
    case 'inside':
      return COLORS.success;
    case 'outside':
      return COLORS.warning;
    default:
      return COLORS.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
  },
  statusValue: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: THEME.spacing.xs,
  },
  distance: {
    ...THEME.typography.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.warning}20`,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.lg,
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  warningText: {
    ...THEME.typography.caption,
    color: COLORS.warning,
    fontWeight: '500',
    flex: 1,
  },
  timeSection: {
    marginVertical: THEME.spacing.lg,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  timeLabel: {
    ...THEME.typography.bodySmall,
    color: COLORS.textSecondary,
    flex: 1,
  },
  timeValue: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  buttonContainer: {
    marginVertical: THEME.spacing.lg,
  },
  button: {
    paddingVertical: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInButton: {
    backgroundColor: COLORS.primary,
  },
  checkOutButton: {
    backgroundColor: COLORS.warning,
  },
  completedButton: {
    backgroundColor: COLORS.success,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    ...THEME.typography.body,
    color: COLORS.background,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
});
