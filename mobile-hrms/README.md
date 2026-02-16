# HRMS Mobile App

A professional React Native HRMS (Human Resource Management System) mobile application for Android and iOS. This app enables employees and managers to manage attendance, leave requests, and access team information with geofencing-based check-in/check-out functionality.

## Features

### Core Features
- **Authentication**: Secure login for employees and managers
- **Check-in/Check-out**: One-tap attendance with geofencing verification
- **Attendance Tracking**: View daily and historical attendance records
- **Leave Management**: Apply for leave, view leave balance and history
- **Team Management**: Managers can view team member status and attendance (Manager only)
- **Profile Management**: View and edit user profile information

### Technical Features
- Dark-themed professional UI design
- Compact, efficient layout optimized for mobile
- Geofencing-based location verification
- Secure token-based authentication
- Offline-capable with local storage
- Real-time status updates
- Push notifications support (future)

## Project Structure

```
mobile-hrms/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx
│   │   └── _layout.tsx
│   ├── (app)/                   # Main app screens
│   │   ├── index.tsx            # Home/Dashboard
│   │   ├── attendance.tsx       # Attendance history
│   │   ├── leave.tsx            # Leave management
│   │   ├── team.tsx             # Team members
│   │   ├── profile.tsx          # User profile
│   │   └── _layout.tsx
│   └── _layout.tsx              # Root layout
├── src/
│   ├── api/                     # API endpoints
│   │   ├── attendance.ts
│   │   ├── auth.ts
│   │   ├── leave.ts
│   │   ├── profile.ts
│   │   └── team.ts
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Loading.tsx
│   │   ├── Header.tsx
│   │   └── CheckInCard.tsx
│   ├── context/                 # Global state management
│   │   └── AuthContext.tsx
│   ├── hooks/                   # Custom hooks
│   │   ├── useLocation.ts       # Geolocation hook
│   │   └── useAsync.ts          # Async state hook
│   ├── utils/                   # Utility functions
│   │   ├── api.ts               # API client
│   │   ├── geolocation.ts       # Geofencing logic
│   │   ├── formatters.ts        # Date/time formatting
│   │   ├── validators.ts        # Form validation
│   │   ├── storage.ts           # Secure storage
│   │   └── errorHandler.ts      # Error handling
│   ├── constants/               # App constants
│   │   ├── colors.ts            # Color system & theme
│   │   ├── api.ts               # API endpoints
│   │   └── geofencing.ts        # Geofence config
│   ├── navigation/              # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── AppNavigator.tsx
│   └── types/                   # TypeScript types
│       └── index.ts
├── assets/
│   ├── images/                  # App icons and images
│   └── fonts/                   # Custom fonts (if any)
├── app.json                     # Expo configuration
├── babel.config.js              # Babel configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
├── .env.example                 # Environment variables template
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/pnpm/yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Xcode (for running on device/emulator)

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd mobile-hrms
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure:
   - `EXPO_PUBLIC_API_URL`: Your Node.js/Express backend URL
   - `EXPO_PUBLIC_OFFICE_LAT`: Office latitude
   - `EXPO_PUBLIC_OFFICE_LNG`: Office longitude
   - `EXPO_PUBLIC_GEOFENCE_RADIUS`: Geofence radius in meters (default: 500m)

4. **Start the development server**
   ```bash
   # For iOS
   pnpm ios

   # For Android
   pnpm android

   # Web preview
   pnpm web

   # General start
   pnpm start
   ```

## API Requirements

The app expects a Node.js/Express backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token

### Attendance
- `POST /api/attendance/check-in` - Check-in with location
- `POST /api/attendance/check-out` - Check-out with location
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/history` - Get attendance history

### Leave
- `POST /api/leave/apply` - Apply for leave
- `GET /api/leave/requests` - Get leave requests
- `GET /api/leave/balance` - Get leave balance

### Team
- `GET /api/team/members` - Get team members (Manager only)
- `GET /api/team/members/:id` - Get employee details (Manager only)

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/change-password` - Change password

## Design System

### Colors (Dark Theme)
- **Primary**: #d4a574 (Amber/Gold) - Main brand color
- **Background**: #0f1419 (Very dark) - App background
- **Surface**: #1a1f36 (Dark) - Cards and containers
- **Text Primary**: #f1f5f9 (Light) - Main text
- **Text Secondary**: #94a3b8 (Gray) - Secondary text
- **Success**: #10b981 (Emerald)
- **Warning**: #f97316 (Orange)
- **Error**: #ef4444 (Red)

### Typography
- **Fonts**: Inter (default system fonts as fallback)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Line height**: 1.4-1.6 for readability

## Building for Production

### Build with EAS (Recommended)
```bash
# First time setup
eas build --platform ios --profile preview
eas build --platform android --profile preview

# For production
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Local Build (Android)
```bash
eas build --platform android --local
```

## Environment Setup for Geofencing

Location permissions need to be properly configured:

**iOS** (in `app.json`):
- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription`

**Android** (in `app.json`):
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `CAMERA`

## Security Considerations

1. **Token Storage**: Access tokens stored in Expo Secure Store
2. **API Security**: All requests include Bearer token authentication
3. **Input Validation**: Form validation on client and server
4. **Location Verification**: Geofencing prevents unauthorized check-ins
5. **HTTPS**: All API calls should use HTTPS in production

## Testing

The app has been designed with manual testing in mind:

1. **Login Testing**
   - Test with valid and invalid credentials
   - Test token refresh functionality

2. **Check-in/Out Testing**
   - Test geofencing (inside and outside boundary)
   - Test location permissions

3. **Navigation Testing**
   - Test smooth transitions between screens
   - Test back button functionality

4. **Data Loading**
   - Test with empty states
   - Test with large datasets
   - Test refresh functionality

## Performance Optimizations

- Lazy loading of list data
- Efficient re-renders using React hooks
- Image compression and caching
- API request caching where appropriate
- Minimal bundle size with tree shaking

## Troubleshooting

### Location not working
- Ensure location permissions are granted in device settings
- Verify `EXPO_PUBLIC_OFFICE_LAT` and `EXPO_PUBLIC_OFFICE_LNG` are correct
- Check GPS accuracy and indoor positioning

### API connection issues
- Verify `EXPO_PUBLIC_API_URL` in `.env`
- Check backend is running and accessible
- Ensure correct authentication tokens

### Build issues
- Clear cache: `expo prebuild --clean`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API response errors in console logs
3. Verify backend connectivity

## Future Enhancements

- Biometric authentication (Face ID, Fingerprint)
- Offline support with SQLite
- Advanced reporting and analytics
- Push notifications for leave approvals
- Multiple language support
- Advanced geofencing with map visualization
- Attendance history export
- Video call integration for remote approvals

## License

Proprietary - All rights reserved
