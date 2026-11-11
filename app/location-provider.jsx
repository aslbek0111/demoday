"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { calculateHaversineDistance, formatDistance } from "../lib/geo";

const LocationContext = createContext({
  userLocation: null,
  status: "idle", // 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable'
  error: null,
  isMounted: false,
  requestLocation: () => {},
  getDistanceFromUser: () => null,
});

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Koordinatalarni olish funksiyasi
  const fetchCurrentPosition = useCallback(() => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      setStatus("unavailable");
      setError("Geolocation is not supported by your browser");
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setStatus("granted");
        setError(null);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        if (err.code === 1) {
          // PERMISSION_DENIED
          setStatus("denied");
        } else {
          setStatus("unavailable");
        }
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 120000, // 2 daqiqa keshlash
      }
    );
  }, []);

  // SSR Hydration xavfsizligi
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    // Agar brauzerda lokatsiyaga oldinroq ruxsat berilgan bo'lsa, avtomatik aniqlash
    if (typeof window !== "undefined" && navigator?.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            fetchCurrentPosition();
          }
          permissionStatus.onchange = () => {
            if (permissionStatus.state === "granted") {
              fetchCurrentPosition();
            } else if (permissionStatus.state === "denied") {
              setStatus("denied");
              setUserLocation(null);
            }
          };
        })
        .catch(() => {
          // Permissions API qo'llab-quvvatlanmagan brauzerlar uchun
        });
    }
  }, [fetchCurrentPosition]);

  // Foydalanuvchi tugmani bosganda chaqiriladigan funksiya
  const requestLocation = useCallback(() => {
    fetchCurrentPosition();
  }, [fetchCurrentPosition]);

  // Berilgan joy koordinatalari bo'yicha masofani hisoblash helperi
  const getDistanceFromUser = useCallback(
    (coords, language = "uz") => {
      if (!userLocation || !coords || !Array.isArray(coords) || coords.length < 2) {
        return null;
      }

      const destLat = Number(coords[0]);
      const destLng = Number(coords[1]);

      if (isNaN(destLat) || isNaN(destLng)) {
        return null;
      }

      const rawKm = calculateHaversineDistance(
        userLocation.lat,
        userLocation.lng,
        destLat,
        destLng
      );

      if (rawKm === null) return null;

      return {
        rawKm,
        formatted: formatDistance(rawKm, language),
        isNear: rawKm < 5, // 5 km dan yaqin bo'lsa
      };
    },
    [userLocation]
  );

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        status,
        error,
        isMounted,
        requestLocation,
        getDistanceFromUser,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
