# Getting Started with HRMS Mobile App

## Quick Start Guide

### 1. Install Dependencies
```bash
cd mobile-hrms
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_OFFICE_LAT=28.6139
EXPO_PUBLIC_OFFICE_LNG=77.2090
EXPO_PUBLIC_GEOFENCE_RADIUS=500
```

### 3. Start Development Server
```bash
pnpm start
```

Then choose:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web preview

### 4. Test Login
Use employee credentials provided by HR to login. The app will:
- Authenticate against your backend API
- Request location permissions
- Load today's attendance status
- Display check-in/out controls

## Key Components Overview

### Authentication Flow
1. **Login Screen** (`app/(auth)/login.tsx`)
   - Employee ID + Password input
   - Form validation
   - Error handling
   - Secure token storage

2. **AuthContext** (`src/context/AuthContext.tsx`)
   - Global auth state management
   - Token refresh logic
   - Auto-redirect based on auth state

### Home/Dashboard (`app/(app)/index.tsx`)
- **Main Features**:
  - Location status (inside/outside geofence)
  - One-tap check-in/out
  - Today's attendance summary
  - Working hours calculation
  - Quick refresh functionality

### Attendance Screen (`app/(app)/attendance.tsx`)
- View historical attendance records
- Filter by date
- Location verification details
- Pagination for large datasets

### Leave Management (`app/(app)/leave.tsx`)
- Apply for leave
- View pending/approved/rejected requests
- Check leave balance
- Floating action button for quick access

### Team Management (`app/(app)/team.tsx`)
- **Manager only feature**
- View all team members
- See real-time status (in/out/on leave)
- Check-in times and attendance

### Profile Screen (`app/(app)/profile.tsx`)
- View user information
- Edit profile details
- Change password
- Logout option

## API Integration

### Attendance API
```typescript
// Check-in
const response = await attendanceApi.checkIn(location);

// Check-out
const response = await attendanceApi.checkOut(location);

// Get history
const response = await attendanceApi.getAttendanceHistory(page, pageSize);
```

### Leave API
```typescript
// Apply leave
const response = await leaveApi.applyLeave({
  startDate: '2024-03-01',
  endDate: '2024-03-03',
  type: 'casual',
  reason: 'Personal reasons'
});

// Get balance
const response = await leaveApi.getLeaveBalance();
```

### Team API (Manager Only)
```typescript
// Get team members
const response = await teamApi.getTeamMembers(page, pageSize);

// Get member details
const response = await teamApi.getTeamMemberDetails(id);
```

## Geofencing Setup

### Configuration in `.env`
```
EXPO_PUBLIC_OFFICE_LAT=28.6139        # Office latitude
EXPO_PUBLIC_OFFICE_LNG=77.2090        # Office longitude
EXPO_PUBLIC_GEOFENCE_RADIUS=500       # Radius in meters
```

### How It Works
1. When user taps check-in, app fetches current location
2. Calculates distance from office using Haversine formula
3. If within radius, allows check-in
4. If outside, shows warning and prevents check-in
5. Location is sent with check-in/out request for server verification

### Testing Geofencing
- Use location simulator in emulator settings
- Test inside boundary (successful check-in)
- Test outside boundary (check-in blocked)
- Verify accurate distances

## Common Issues & Solutions

### Issue: "Location permission denied"
**Solution**: 
- Grant location permission in device settings
- For Android: Settings > Apps > HRMS Mobile > Permissions > Location
- For iOS: Settings > HRMS Mobile > Location > While Using

### Issue: "Cannot connect to API"
**Solution**:
- Check backend is running
- Verify `EXPO_PUBLIC_API_URL` in `.env`
- For local testing: use your machine's IP instead of localhost
- Check firewall settings

### Issue: "Check-in button is disabled"
**Solution**:
- Ensure location services are enabled
- Grant location permissions
- Move closer to office (if outside geofence)
- Restart the app

### Issue: "Login always fails"
**Solution**:
- Verify correct employee ID and password
- Check backend API is running
- Review network connectivity
- Check server logs for errors

## Development Tips

### Using the Location Hook
```typescript
import { useLocation } from '@hooks/useLocation';

function MyComponent() {
  const { location, loading, error, getCurrentLocation } = useLocation();

  const handleGetLocation = async () => {
    const coords = await getCurrentLocation();
    // Use coordinates...
  };
}
```

### Using API Client
```typescript
import { apiClient } from '@utils/api';

// Automatic token management
const response = await apiClient.get('/api/attendance/today');

// Tokens refresh automatically on 401
// No need to handle token refresh manually
```

### Styling Components
All components use the consistent theme from `src/constants/colors.ts`:
```typescript
import { COLORS, THEME } from '@constants/colors';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    backgroundColor: COLORS.background,
  },
  text: {
    ...THEME.typography.body,
    color: COLORS.textPrimary,
  }
});
```

## Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Check-in works when inside geofence
- [ ] Check-in blocked when outside geofence
- [ ] Check-out available after check-in
- [ ] Attendance history loads correctly
- [ ] Leave applications can be viewed
- [ ] Leave balance displays correctly
- [ ] Team members visible (for managers)
- [ ] Profile shows correct user info
- [ ] Logout works properly
- [ ] App handles network errors gracefully
- [ ] App handles location permission denial
- [ ] Refresh functionality works on all screens
- [ ] Navigation between tabs is smooth
- [ ] Back button works correctly

## Next Steps

1. **Connect to Real Backend**: Update `EXPO_PUBLIC_API_URL` with production backend
2. **Configure Geofence**: Set office coordinates and radius
3. **Test on Real Device**: Use Expo Go or build standalone app
4. **User Testing**: Validate workflows with actual employees
5. **Production Build**: Use EAS Build for iOS/Android app store

## Useful Commands

```bash
# Clear all cache
expo prebuild --clean

# Reset project
rm -rf node_modules .expo
pnpm install

# Build for iOS
eas build --platform ios --profile preview

# Build for Android
eas build --platform android --profile preview

# Publish app
eas submit --platform ios --latest
eas submit --platform android --latest
```

## Documentation Links

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Router](https://docs.expo.dev/routing/introduction)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location)

## Support

For issues and questions, refer to:
1. `README.md` for detailed documentation
2. Code comments for implementation details
3. Error messages in console logs
4. Network request logs in API client

Happy coding!
