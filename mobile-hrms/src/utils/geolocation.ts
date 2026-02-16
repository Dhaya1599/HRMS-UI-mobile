import { LocationCoordinates } from '@types/index';
import { GEOFENCE_CONFIG, GeofenceStatus } from '@constants/geofencing';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Check if a location is within the geofence
 */
export const isWithinGeofence = (location: LocationCoordinates): boolean => {
  const distance = calculateDistance(
    location.latitude,
    location.longitude,
    GEOFENCE_CONFIG.OFFICE_LAT,
    GEOFENCE_CONFIG.OFFICE_LNG
  );

  return distance <= GEOFENCE_CONFIG.RADIUS;
};

/**
 * Get geofence status for a location
 */
export const getGeofenceStatus = (location: LocationCoordinates): GeofenceStatus => {
  if (!location.latitude || !location.longitude) {
    return GeofenceStatus.UNKNOWN;
  }

  return isWithinGeofence(location) ? GeofenceStatus.INSIDE : GeofenceStatus.OUTSIDE;
};

/**
 * Get distance from office in meters
 */
export const getDistanceFromOffice = (location: LocationCoordinates): number => {
  return calculateDistance(
    location.latitude,
    location.longitude,
    GEOFENCE_CONFIG.OFFICE_LAT,
    GEOFENCE_CONFIG.OFFICE_LNG
  );
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  }
  return `${(distanceInMeters / 1000).toFixed(2)}km`;
};

/**
 * Get location accuracy description
 */
export const getAccuracyDescription = (accuracy?: number): string => {
  if (!accuracy) return 'Unknown';
  if (accuracy < 10) return 'Very High';
  if (accuracy < 30) return 'High';
  if (accuracy < 100) return 'Medium';
  return 'Low';
};
