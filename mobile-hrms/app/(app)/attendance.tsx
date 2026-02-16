import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '@components/ui/Card';
import { Loading } from '@components/ui/Loading';
import { Badge } from '@components/ui/Badge';
import { COLORS, THEME } from '@constants/colors';
import { attendanceApi, AttendanceRecord } from '@api/attendance';
import { formatDate, formatTime } from '@utils/formatters';
import { Clock, MapPin } from 'lucide-react-native';

export default function AttendanceScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadAttendance = async (pageNum = 1) => {
    try {
      const response = await attendanceApi.getAttendanceHistory(pageNum, 20);
      if (response.success && response.data) {
        if (pageNum === 1) {
          setRecords(response.data.records);
        } else {
          setRecords((prev) => [...prev, ...response.data.records]);
        }
        setHasMore(response.data.records.length === 20);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load attendance records');
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setPage(1);
      loadAttendance(1);
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadAttendance(1);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadAttendance(nextPage);
    }
  };

  const renderAttendanceCard = ({ item }: { item: AttendanceRecord }) => (
    <Card style={styles.card}>
      <View style={styles.dateSection}>
        <Text style={styles.date}>{formatDate(item.date, 'MMM dd, yyyy')}</Text>
        <Badge label={item.status} variant={getStatusVariant(item.status)} />
      </View>

      <View style={styles.timeSection}>
        {item.checkInTime && (
          <View style={styles.timeRow}>
            <Clock size={16} color={COLORS.success} />
            <View style={styles.timeContent}>
              <Text style={styles.timeLabel}>Check In</Text>
              <Text style={styles.timeValue}>{formatTime(item.checkInTime)}</Text>
            </View>
          </View>
        )}
        {item.checkOutTime && (
          <View style={styles.timeRow}>
            <Clock size={16} color={COLORS.warning} />
            <View style={styles.timeContent}>
              <Text style={styles.timeLabel}>Check Out</Text>
              <Text style={styles.timeValue}>{formatTime(item.checkOutTime)}</Text>
            </View>
          </View>
        )}
      </View>

      {item.checkInLocation && (
        <View style={styles.locationSection}>
          <MapPin size={14} color={COLORS.textSecondary} />
          <Text style={styles.locationText}>
            {item.checkInLocation.latitude.toFixed(4)}, {item.checkInLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </Card>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return <Loading />;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No attendance records found</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && page === 1 ? (
        <Loading fullScreen message="Loading attendance..." />
      ) : (
        <FlatList
          data={records}
          renderItem={renderAttendanceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </SafeAreaView>
  );
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'present':
      return 'success';
    case 'absent':
      return 'error';
    case 'late':
      return 'warning';
    default:
      return 'default';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.lg,
  },
  card: {
    marginBottom: THEME.spacing.lg,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  date: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
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
  timeContent: {
    flex: 1,
  },
  timeLabel: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
  },
  timeValue: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: THEME.spacing.xs,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: THEME.spacing.lg,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    gap: THEME.spacing.sm,
  },
  locationText: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: THEME.spacing.xxxl,
  },
  emptyText: {
    ...THEME.typography.body,
    color: COLORS.textSecondary,
  },
});
