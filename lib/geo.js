/**
 * Geolocation and Distance Calculation Utilities using Haversine Formula
 */

/**
 * Calculates the great-circle distance between two points on the Earth
 * using the Haversine formula.
 *
 * @param {number} lat1 Latitude of point 1 in degrees
 * @param {number} lon1 Longitude of point 1 in degrees
 * @param {number} lat2 Latitude of point 2 in degrees
 * @param {number} lon2 Longitude of point 2 in degrees
 * @returns {number|null} Distance in kilometers, or null if coordinates are invalid
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined ||
    lat1 === null ||
    lon1 === undefined ||
    lon1 === null ||
    lat2 === undefined ||
    lat2 === null ||
    lon2 === undefined ||
    lon2 === null ||
    isNaN(Number(lat1)) ||
    isNaN(Number(lon1)) ||
    isNaN(Number(lat2)) ||
    isNaN(Number(lon2))
  ) {
    return null;
  }

  const R = 6371; // Earth's mean radius in kilometers
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Formats a distance in kilometers into a human-friendly string (meters or kilometers)
 *
 * @param {number} distanceKm Distance in kilometers
 * @param {string} language 'uz' | 'ru' | 'en'
 * @returns {string} Formatted string like "350 m away" or "1.2 km away"
 */
export function formatDistance(distanceKm, language = "uz") {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return "";
  }

  // Masofa 1 km dan kam bo'lsa metrda ko'rsatish
  if (distanceKm < 1) {
    const meters = Math.max(10, Math.round(distanceKm * 1000));
    if (language === "ru") {
      return `${meters} м от вас`;
    }
    if (language === "en") {
      return `${meters} m away`;
    }
    return `${meters} m masofada`;
  }

  // 1 km dan 10 km gacha: 1 ta o'nlik kasr (masalan: 1.2 km)
  // 10 km dan oshiq bo'lsa: 1 ta o'nlik kasr (masalan: 12.5 km)
  const formattedKm =
    distanceKm < 100 ? distanceKm.toFixed(1) : Math.round(distanceKm).toString();

  if (language === "ru") {
    return `${formattedKm} км от вас`;
  }
  if (language === "en") {
    return `${formattedKm} km away`;
  }
  return `${formattedKm} km masofada`;
}
