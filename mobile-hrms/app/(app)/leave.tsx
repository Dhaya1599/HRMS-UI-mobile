import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '@components/ui/Card';
import { Loading } from '@components/ui/Loading';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { COLORS, THEME } from '@constants/colors';
import { leaveApi, LeaveRecord } from '@api/leave';
import { formatDate } from '@utils/formatters';
import { Plus, Calendar } from 'lucide-react-native';

export default function LeaveScreen() {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaveRecords = async () => {
    try {
      const response = await leaveApi.getLeaveRequests();
      if (response.success && response.data) {
        setLeaveRecords(response.data.records);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load leave records');
      console.error('Error loading leave records:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadLeaveRecords();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadLeaveRecords();
  }, []);

  const handleApplyLeave = () => {
    Alert.alert('Apply Leave', 'Redirect to leave application form (to be implemented)');
  };

  const renderLeaveCard = ({ item }: { item: LeaveRecord }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateRange}>
            {formatDate(item.startDate, 'MMM dd')} - {formatDate(item.endDate, 'MMM dd, yyyy')}
          </Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>
        <Badge label={item.status} variant={getStatusVariant(item.status)} />
      </View>

      <View style={styles.reasonSection}>
        <Text style={styles.reasonLabel}>Reason</Text>
        <Text style={styles.reason}>{item.reason}</Text>
      </View>

      {item.approvedBy && (
        <Text style={styles.approvedBy}>Approved by {item.approvedBy}</Text>
      )}
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Calendar size={48} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>No leave records found</Text>
      <Button
        title="Apply for Leave"
        onPress={handleApplyLeave}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading fullScreen message="Loading leave records..." />
      ) : (
        <>
          <FlatList
            data={leaveRecords}
            renderItem={renderLeaveCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
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
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={styles.fab}
              onPress={handleApplyLeave}
              activeOpacity={0.7}
            >
              <Plus size={24} color={COLORS.background} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
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
    flexGrow: 1,
  },
  card: {
    marginBottom: THEME.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  dateRange: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: THEME.spacing.xs,
  },
  type: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
  },
  reasonSection: {
    marginBottom: THEME.spacing.lg,
  },
  reasonLabel: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
    marginBottom: THEME.spacing.xs,
  },
  reason: {
    ...THEME.typography.bodySmall,
    color: COLORS.textPrimary,
  },
  approvedBy: {
    ...THEME.typography.caption,
    color: COLORS.success,
    paddingTop: THEME.spacing.lg,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
  },
  emptyText: {
    ...THEME.typography.body,
    color: COLORS.textSecondary,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
  },
  emptyButton: {
    marginTop: THEME.spacing.xl,
  },
  fabContainer: {
    position: 'absolute',
    bottom: THEME.spacing.lg,
    right: THEME.spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
