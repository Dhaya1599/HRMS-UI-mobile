export const GEOFENCE_CONFIG = {
  // Office coordinates
  OFFICE_LAT: parseFloat(process.env.EXPO_PUBLIC_OFFICE_LAT || '28.6139'),
  OFFICE_LNG: parseFloat(process.env.EXPO_PUBLIC_OFFICE_LNG || '77.2090'),
  
  // Geofence radius in meters (500m default)
  RADIUS: parseInt(process.env.EXPO_PUBLIC_GEOFENCE_RADIUS || '500'),
  
  // Location timeout in milliseconds
  LOCATION_TIMEOUT: 15000,
  
  // Check interval for background location (in milliseconds)
  CHECK_INTERVAL: 60000,
  
  // Accuracy threshold for location
  ACCURACY_THRESHOLD: 50, // meters
};

export const LOCATION_PERMISSIONS = {
  FINE: 'fine_location',
  COARSE: 'coarse_location',
  BACKGROUND: 'background_location',
};

// Geofencing status enum
export enum GeofenceStatus {
  INSIDE = 'inside',
  OUTSIDE = 'outside',
  UNKNOWN = 'unknown',
}

// Location accuracy enum
export enum LocationAccuracy {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}
