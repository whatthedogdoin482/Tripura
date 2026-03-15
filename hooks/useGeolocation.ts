import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
  isSupported: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isLoading: true,
    isSupported: false,
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    }));
  }, []);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState((prev) => ({
      ...prev,
      position,
      error: null,
      isLoading: false,
    }));
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const getPosition = useCallback(() => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: {
          code: 0,
          message: 'Geolocation is not supported by this browser',
        } as GeolocationPositionError,
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [state.isSupported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  useEffect(() => {
    if (!state.isSupported) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        { enableHighAccuracy, timeout, maximumAge }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      getPosition();
    }
  }, [watch, enableHighAccuracy, timeout, maximumAge, state.isSupported, handleSuccess, handleError, getPosition]);

  return {
    ...state,
    latitude: state.position?.coords.latitude ?? null,
    longitude: state.position?.coords.longitude ?? null,
    accuracy: state.position?.coords.accuracy ?? null,
    refresh: getPosition,
  };
}

// Default location (Paris) for demo purposes
export const DEFAULT_LOCATION = {
  lat: 48.8566,
  lng: 2.3522,
};
