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
import { useAuth } from '@context/AuthContext';
import { Card } from '@components/ui/Card';
import { Loading } from '@components/ui/Loading';
import { Badge } from '@components/ui/Badge';
import { COLORS, THEME } from '@constants/colors';
import { teamApi, TeamMember } from '@api/team';
import { formatTime } from '@utils/formatters';
import { Clock, User, Building } from 'lucide-react-native';

export default function TeamScreen() {
  const { state: authState } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTeamMembers = async () => {
    try {
      const response = await teamApi.getTeamMembers();
      if (response.success && response.data) {
        setMembers(response.data.members);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load team members');
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (authState.user?.role === 'manager') {
        loadTeamMembers();
      } else {
        setLoading(false);
      }
    }, [authState.user?.role])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTeamMembers();
  }, []);

  const renderTeamMember = ({ item }: { item: TeamMember }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.memberInfo}>
          <View style={styles.avatar}>
            <User size={24} color={COLORS.primary} />
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.employeeId}>{item.employeeId}</Text>
          </View>
        </View>
        <Badge
          label={getStatusLabel(item.currentStatus)}
          variant={getStatusVariant(item.currentStatus)}
        />
      </View>

      <View style={styles.department}>
        <Building size={14} color={COLORS.textSecondary} />
        <Text style={styles.departmentText}>{item.department}</Text>
      </View>

      {item.currentStatus === 'in' && item.lastCheckIn && (
        <View style={styles.timeInfo}>
          <Clock size={14} color={COLORS.success} />
          <Text style={styles.timeText}>Checked in at {formatTime(item.lastCheckIn)}</Text>
        </View>
      )}
    </Card>
  );

  const renderNotManager = () => (
    <View style={styles.restrictedContainer}>
      <User size={48} color={COLORS.textSecondary} />
      <Text style={styles.restrictedText}>Team view is only available for managers</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No team members found</Text>
    </View>
  );

  if (authState.user?.role !== 'manager') {
    return (
      <SafeAreaView style={styles.container}>
        {renderNotManager()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading fullScreen message="Loading team members..." />
      ) : (
        <FlatList
          data={members}
          renderItem={renderTeamMember}
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
      )}
    </SafeAreaView>
  );
}

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'in':
      return 'In Office';
    case 'out':
      return 'Out';
    case 'on_leave':
      return 'On Leave';
    default:
      return 'Unknown';
  }
};

const getStatusVariant = (status?: string) => {
  switch (status) {
    case 'in':
      return 'success';
    case 'out':
      return 'default';
    case 'on_leave':
      return 'info';
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: THEME.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
  },
  name: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  employeeId: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  department: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  departmentText: {
    ...THEME.typography.caption,
    color: COLORS.textSecondary,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    paddingTop: THEME.spacing.md,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
  timeText: {
    ...THEME.typography.caption,
    color: COLORS.success,
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
  },
  restrictedText: {
    ...THEME.typography.body,
    color: COLORS.textSecondary,
    marginTop: THEME.spacing.lg,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...THEME.typography.body,
    color: COLORS.textSecondary,
  },
});
