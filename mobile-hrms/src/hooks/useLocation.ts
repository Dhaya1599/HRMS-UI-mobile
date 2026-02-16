import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { LocationCoordinates } from '@types/index';
import { GEOFENCE_CONFIG } from '@constants/geofencing';
import { getGeofenceStatus } from '@utils/geolocation';

interface UseLocationReturn {
  location: LocationCoordinates | null;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationCoordinates | null>;
  getGeofenceStatus: () => string;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Check permission on mount
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

      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setError('Location permission denied');
          return null;
        }
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      });

      const coords: LocationCoordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || undefined,
        timestamp: currentLocation.timestamp,
      };

      setLocation(coords);
      return coords;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to get location';
      setError(errorMsg);
      console.error('Error getting location:', errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, requestPermission]);

  const getGeofenceStatus = useCallback((): string => {
    if (!location) return 'Unknown';
    const status = getGeofenceStatus(location);
    return status;
  }, [location]);

  return {
    location,
    loading,
    error,
    hasPermission,
    requestPermission,
    getCurrentLocation,
    getGeofenceStatus,
  };
};
