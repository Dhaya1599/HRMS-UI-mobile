import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { LocationCoordinates } from '@types/index';
import { GEOFENCE_CONFIG } from '@constants/geofencing';
import { getGeofenceStatus as getGeofenceStatusFromCoords } from '@utils/geolocation';

/** Fallback mock location (office) when device location is unavailable — for demo/mock UI */
const MOCK_LOCATION: LocationCoordinates = {
  latitude: GEOFENCE_CONFIG.OFFICE_LAT,
  longitude: GEOFENCE_CONFIG.OFFICE_LNG,
  accuracy: 20,
  timestamp: Date.now(),
};

interface UseLocationReturn {
  location: LocationCoordinates | null;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
  isMockLocation: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationCoordinates | null>;
  getGeofenceStatus: () => string;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isMockLocation, setIsMockLocation] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === Location.PermissionStatus.GRANTED);
    } catch (err) {
      console.error('Error checking location permission:', err);
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === Location.PermissionStatus.GRANTED;
      setHasPermission(granted);
      return granted;
    } catch (err: any) {
      setError(err.message || 'Failed to request permission');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationCoordinates | null> => {
    try {
      setLoading(true);
      setError(null);
      setIsMockLocation(false);

      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setError('Location permission denied. Using mock office location for demo.');
          setLocation(MOCK_LOCATION);
          setIsMockLocation(true);
          return MOCK_LOCATION;
        }
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maxAge: 30000,
        timeout: 10000,
      });

      const coords: LocationCoordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy ?? undefined,
        timestamp: currentLocation.timestamp,
      };

      setLocation(coords);
      return coords;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to get location';
      setError(`Location unavailable. Using mock office location for demo.`);
      setLocation(MOCK_LOCATION);
      setIsMockLocation(true);
      return MOCK_LOCATION;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, requestPermission]);

  const getGeofenceStatus = useCallback((): string => {
    if (!location) return 'unknown';
    return getGeofenceStatusFromCoords(location);
  }, [location]);

  return {
    location,
    loading,
    error,
    hasPermission,
    isMockLocation,
    requestPermission,
    getCurrentLocation,
    getGeofenceStatus,
  };
};
