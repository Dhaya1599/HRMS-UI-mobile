# Quick Reference Guide

## File Locations

### Screens
| Feature | File |
|---------|------|
| Login | `app/(auth)/login.tsx` |
| Home/Dashboard | `app/(app)/index.tsx` |
| Attendance History | `app/(app)/attendance.tsx` |
| Leave Management | `app/(app)/leave.tsx` |
| Team Members | `app/(app)/team.tsx` |
| User Profile | `app/(app)/profile.tsx` |

### Components
| Component | File |
|-----------|------|
| Button | `src/components/ui/Button.tsx` |
| Card | `src/components/ui/Card.tsx` |
| Input | `src/components/ui/Input.tsx` |
| Badge | `src/components/ui/Badge.tsx` |
| Loading | `src/components/ui/Loading.tsx` |
| Header | `src/components/Header.tsx` |
| Check-In Card | `src/components/CheckInCard.tsx` |

### Utilities
| Utility | File |
|---------|------|
| Colors & Theme | `src/constants/colors.ts` |
| API Endpoints | `src/constants/api.ts` |
| Geofence Config | `src/constants/geofencing.ts` |
| API Client | `src/utils/api.ts` |
| Geolocation | `src/utils/geolocation.ts` |
| Formatters | `src/utils/formatters.ts` |
| Validators | `src/utils/validators.ts` |
| Storage | `src/utils/storage.ts` |

## Common Tasks

### Add a New Component
```typescript
// src/components/MyComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, THEME } from '@constants/colors';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    ...THEME.typography.h3,
    color: COLORS.textPrimary,
  },
});
```

### Call an API
```typescript
import { apiClient } from '@utils/api';
import { API_CONFIG } from '@constants/api';

// GET request
const response = await apiClient.get('/api/endpoint');

// POST request
const response = await apiClient.post('/api/endpoint', {
  data: 'value'
});

// Automatic token handling - no manual setup needed!
```

### Use Authentication
```typescript
import { useAuth } from '@context/AuthContext';

function MyComponent() {
  const { state, login, logout, refreshUser } = useAuth();
  
  const handleLogin = async () => {
    await login('employee123', 'password');
  };
  
  return state.isAuthenticated ? <LoggedInComponent /> : <LoginScreen />;
}
```

### Get User Location
```typescript
import { useLocation } from '@hooks/useLocation';
import { getDistanceFromOffice } from '@utils/geolocation';

function MyComponent() {
  const { location, getCurrentLocation, getGeofenceStatus } = useLocation();
  
  const handleGetLocation = async () => {
    const coords = await getCurrentLocation();
    const distance = getDistanceFromOffice(coords);
    const status = getGeofenceStatus(); // 'inside' or 'outside'
  };
}
```

### Format Dates
```typescript
import { formatDate, formatTime, formatDuration } from '@utils/formatters';

formatDate('2024-03-15T10:30:00', 'MMM dd, yyyy') // Mar 15, 2024
formatTime('2024-03-15T10:30:00') // 10:30
formatDuration(480) // 8h (minutes to hours)
```

### Use the App Storage
```typescript
import { appStorage, secureStorage, STORAGE_KEYS } from '@utils/storage';

// Regular storage (AsyncStorage)
await appStorage.set(STORAGE_KEYS.USER_DATA, userData);
const data = await appStorage.get(STORAGE_KEYS.USER_DATA);
await appStorage.remove(STORAGE_KEYS.USER_DATA);

// Secure storage (for sensitive data)
await secureStorage.set('accessToken', token);
const token = await secureStorage.get('accessToken');
```

## Color Usage

```typescript
import { COLORS } from '@constants/colors';

// Primary elements
backgroundColor: COLORS.primary // Amber/Gold
backgroundColor: COLORS.background // Very dark
backgroundColor: COLORS.surface // Dark

// Text
color: COLORS.textPrimary // Light
color: COLORS.textSecondary // Gray
color: COLORS.textTertiary // Darker gray

// Status
color: COLORS.success // Green
color: COLORS.warning // Orange
color: COLORS.error // Red
color: COLORS.info // Blue
```

## Spacing Scale

```typescript
import { THEME } from '@constants/colors';

const spacing = {
  xs: THEME.spacing.xs, // 4px
  sm: THEME.spacing.sm, // 8px
  md: THEME.spacing.md, // 12px
  lg: THEME.spacing.lg, // 16px
  xl: THEME.spacing.xl, // 20px
  xxl: THEME.spacing.xxl, // 24px
  xxxl: THEME.spacing.xxxl, // 32px
};
```

## Typography

```typescript
import { THEME } from '@constants/colors';

// Heading 1 - 28px Bold
...THEME.typography.h1

// Heading 2 - 22px SemiBold
...THEME.typography.h2

// Heading 3 - 18px SemiBold
...THEME.typography.h3

// Body - 16px Regular
...THEME.typography.body

// Body Small - 14px Regular
...THEME.typography.bodySmall

// Caption - 12px Regular
...THEME.typography.caption
```

## Component Props

### Button
```typescript
<Button
  title="Click me"
  onPress={() => {}}
  variant="primary" // | secondary | danger | outline
  size="medium" // | small | large
  loading={false}
  disabled={false}
  fullWidth={false}
  icon={<Icon />}
/>
```

### Card
```typescript
<Card elevation="sm" style={customStyle}>
  {/* Children */}
</Card>
// elevation: sm | md | lg
```

### Input
```typescript
<Input
  label="Email"
  placeholder="Enter email"
  value={value}
  onChangeText={(text) => {}}
  error="Invalid email"
  icon={<Icon />}
  secureTextEntry={false}
/>
```

### Badge
```typescript
<Badge
  label="Approved"
  variant="success" // | warning | error | info | default
  size="small" // | medium
/>
```

## Common Patterns

### Refresh Control
```typescript
const [refreshing, setRefreshing] = React.useState(false);

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  loadData().finally(() => setRefreshing(false));
}, []);

<FlatList
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={COLORS.primary}
    />
  }
/>
```

### Loading State
```typescript
import { Loading } from '@components/ui/Loading';

{loading ? (
  <Loading fullScreen message="Loading..." />
) : (
  <YourContent />
)}
```

### Empty State
```typescript
const renderEmpty = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No data found</Text>
  </View>
);

<FlatList ListEmptyComponent={renderEmpty} />
```

### Error Alert
```typescript
import { Alert } from 'react-native';

Alert.alert(
  'Error',
  'Something went wrong',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', onPress: () => {} }
  ]
);
```

## Debugging

### Console Logging
```typescript
// Add to understand flow
console.log('[v0] Location:', location);
console.log('[v0] API Response:', response);

// Remove after debugging
```

### Network Debugging
- Check API requests in console
- Verify request headers include `Authorization: Bearer <token>`
- Check response status codes
- Review error messages

### State Debugging
- Use React DevTools
- Log state changes
- Check Auth context updates
- Verify storage persistence

## Performance Tips

1. **Use FlatList** for long lists, not ScrollView
2. **Memoize components** with `React.memo` if needed
3. **Lazy load images** and content
4. **Debounce rapid updates** with custom hooks
5. **Cache API responses** where appropriate

## Common Imports

```typescript
// Navigation
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Components
import { View, Text, ScrollView, FlatList, SafeAreaView } from 'react-native';

// Hooks
import { useAuth } from '@context/AuthContext';
import { useLocation } from '@hooks/useLocation';

// Utilities
import { apiClient } from '@utils/api';
import { COLORS, THEME } from '@constants/colors';

// APIs
import { attendanceApi } from '@api/attendance';
import { leaveApi } from '@api/leave';
import { teamApi } from '@api/team';
```

## Environment Variables

```bash
# .env file
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_OFFICE_LAT=28.6139
EXPO_PUBLIC_OFFICE_LNG=77.2090
EXPO_PUBLIC_GEOFENCE_RADIUS=500
```

Access in code:
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## Icon Usage

```typescript
import { Clock, Home, LogOut, AlertCircle } from 'lucide-react-native';

<Clock size={24} color={COLORS.primary} />
<Home size={20} color={COLORS.textSecondary} />

// Common sizes: 16, 20, 24, 32
```

## Testing Features

### Test Check-In
1. Open app
2. Navigate to Home
3. Ensure location permission granted
4. Click "Check In"
5. Verify location displays
6. Check status updates

### Test Leave
1. Navigate to Leave tab
2. View leave balance
3. See leave history
4. Try applying (if implemented)

### Test Team
1. Login as manager
2. Navigate to Team tab
3. View team members
4. See current status
5. Login as employee - team tab shows message

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Check backend is running and credentials are correct |
| Location error | Enable location permission in device settings |
| API 401 | Check token in secure storage, refresh might be needed |
| UI overlapping | Check spacing and layout - use THEME.spacing |
| Colors wrong | Verify COLORS import and usage |
| FlatList stuttering | Switch to pagination or use `removeClippedSubviews` |
| Build fails | Run `expo prebuild --clean` |

## Resources

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Lucide Icons](https://lucide.dev)
- [React Navigation](https://reactnavigation.org)

---

**Last Updated**: February 2024
**App Version**: 1.0.0
**React Native**: 0.74+
**Expo**: 51.0+
