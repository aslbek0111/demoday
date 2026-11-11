"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "../data/places";

// Kategoriya bo'yicha ranglar va emojilar
const categoryStyles = {
  restaurant: {
    color: "#f59e0b", // amber-500
    icon: "🍽️",
    label: "Restoran",
  },
  sport: {
    color: "#10b981", // emerald-500
    icon: "⚽",
    label: "Sport",
  },
  resort: {
    color: "#0284c7", // sky-600
    icon: "🏡",
    label: "Dacha",
  },
  coworking: {
    color: "#8b5cf6", // purple-500
    icon: "💻",
    label: "Kovorking",
  },
  cafe: {
    color: "#f43f5e", // rose-500
    icon: "☕",
    label: "Kafe",
  },
};

// Custom zamonaviy marker yaratish funksiyasi
function createCustomPin(place, isSelected) {
  const meta = (place && place.categoryKey && categoryStyles[place.categoryKey]) || {
    color: "#6366f1",
    icon: "📍",
  };
  const color = meta.color;
  const icon = meta.icon;

  const size = isSelected ? 44 : 36;
  const innerSize = isSelected ? 20 : 16;
  const ringStyle = isSelected
    ? "box-shadow: 0 0 0 4px #ffffff, 0 8px 24px rgba(0,0,0,0.35); transform: rotate(-45deg) scale(1.15);"
    : "box-shadow: 0 4px 14px rgba(0,0,0,0.25); transform: rotate(-45deg);";

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50% 50% 50% 0; ${ringStyle} display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; transition: all 0.25s ease;">
        <span style="transform: rotate(45deg); font-size: ${innerSize}px; line-height: 1; user-select: none;">
          ${icon}
        </span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: "custom-map-marker-icon",
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function createPopupHtml(place, language, t) {
  if (!place) return "";
  const categoryIcon = (place.categoryKey && categoryStyles[place.categoryKey]?.icon) || "📍";
  const verifiedBadge = place.hasExactCoords
    ? (t("exact_location") || "Aniq lokatsiya")
    : (t("unverified_location") || "Taxminiy lokatsiya");
  const formattedPrice = formatPrice ? formatPrice(place.price, language) : (place.price || "");
  const currency = t("currency") || "so'm";
  const priceLabel = t("price_label") || "Narxi:";
  const detailBtnText = t("map_detail_btn") || "Batafsil";
  const bookBtnText = t("map_book_btn") || "Band qilish";
  const placeName = place.name || "";
  const placeImage = place.image || "";
  const placeBadge = place.badge || "";
  const placeRating = place.rating ?? 0;
  const placeReviewsCount = place.reviewsCount ?? 0;
  const placeCategory = place.category || "";
  const placeCity = place.city || "";
  const placeAddress = place.address || "";
  const placePriceUnit = place.priceUnit || "";
  const placeOpenHours = place.openHours || "";

  return `
    <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-sans" style="width: 290px;">
      <!-- Rasm va Badge -->
      <div style="position: relative; height: 9rem; width: 100%; overflow: hidden; background-color: #f1f5f9;">
        <img
          src="${placeImage}"
          alt="${placeName}"
          style="width: 100%; height: 100%; object-fit: cover;"
          loading="lazy"
        />
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.6), transparent);"></div>
        
        <span class="${place.badgeColor || 'bg-indigo-600'}" style="position: absolute; top: 0.625rem; left: 0.625rem; color: #ffffff; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 9999px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
          ${placeBadge}
        </span>

        <span style="position: absolute; top: 0.625rem; right: 0.625rem; background: rgba(255,255,255,0.95); color: #1e293b; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 4px; border: 1px solid rgba(226,232,240,0.6);">
          ⭐ ${placeRating}
          <span style="color: #94a3b8; font-weight: 400; font-size: 11px;">
            (${placeReviewsCount})
          </span>
        </span>

        <div style="position: absolute; bottom: 0.5rem; left: 0.625rem; right: 0.625rem; color: #ffffff;">
          <p style="font-size: 11px; font-weight: 500; color: #e2e8f0; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 4px; margin: 0;">
            <span>${categoryIcon}</span>
            <span>${placeCategory}</span>
          </p>
        </div>
      </div>

      <!-- Asosiy ma'lumotlar -->
      <div style="padding: 0.875rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <a
          href="/places/${place.id}"
          style="font-weight: 700; font-size: 14px; color: inherit; text-decoration: none; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        >
          ${placeName}
        </a>

        <p style="font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 4px; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <span>📍</span>
          <span>${placeCity}</span>
          <span style="color: #cbd5e1;">•</span>
          <span style="font-size: 11px;">${placeAddress}</span>
        </p>

        <!-- Lokatsiya holati -->
        <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: #047857; background-color: #ecfdf5; padding: 2px 8px; border-radius: 6px; border: 1px solid #a7f3d0; width: fit-content;">
          <span>✓</span>
          <span style="font-weight: 500;">
            ${verifiedBadge}
          </span>
        </div>

        <!-- Narx -->
        <div style="padding-top: 0.5rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <span style="font-size: 10px; color: #94a3b8; display: block; line-height: 1.2;">
              ${priceLabel}
            </span>
            <span style="font-weight: 800; font-size: 14px;">
              ${formattedPrice} ${currency}
            </span>
            <span style="font-size: 11px; color: #64748b;">
              / ${placePriceUnit}
            </span>
          </div>

          <span style="font-size: 11px; color: #64748b; background-color: #f1f5f9; padding: 4px 8px; border-radius: 6px;">
            🕒 ${placeOpenHours}
          </span>
        </div>

        <!-- Tugmalar -->
        <div style="padding-top: 0.25rem; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <button
            type="button"
            data-open-detail="${place.id}"
            style="width: 100%; text-align: center; padding: 8px 10px; font-size: 12px; font-weight: 700; color: #334155; background-color: #f1f5f9; border-radius: 12px; border: none; cursor: pointer;"
          >
            ${detailBtnText}
          </button>

          <a
            href="/booking?id=${place.id}"
            style="width: 100%; text-align: center; padding: 8px 10px; font-size: 12px; font-weight: 700; color: #ffffff; background-color: #4f46e5; border-radius: 12px; text-decoration: none; display: block; box-sizing: border-box;"
          >
            ${bookBtnText} →
          </a>
        </div>
      </div>
    </div>
  `;
}

export default function PlacesMap({
  places = [],
  selectedPlace = null,
  onSelectPlace,
  onOpenDetail,
  isDark = false,
  language = "uz",
  t = (k) => k,
} = {}) {
  // places massiv yoki obyekt ichida kelsa ham to'g'ri qabul qilish (fallback)
  const safePlaces = Array.isArray(places)
    ? places
    : Array.isArray(places?.places)
    ? places.places
    : Array.isArray(places?.data)
    ? places.data
    : [];

  const defaultCenter = [41.3111, 69.2797];
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersMapRef = useRef(new globalThis.Map());
  const prevSelectedIdRef = useRef(null);
  const onOpenDetailRef = useRef(onOpenDetail);
  const placesRef = useRef(safePlaces);

  useEffect(() => {
    onOpenDetailRef.current = onOpenDetail;
    placesRef.current = safePlaces;
  }, [onOpenDetail, safePlaces]);

  // 1. Initialize Map once
  useEffect(() => {
    if (!containerRef.current) return;
    const markersMap = markersMapRef.current;

    // React Strict Mode (mount -> cleanup -> mount) da Leaflet id qolib ketishining oldini olish
    if (containerRef.current._leaflet_id && !mapInstanceRef.current) {
      delete containerRef.current._leaflet_id;
    }

    if (!mapInstanceRef.current) {
      const initialCenter = selectedPlace?.coords || defaultCenter;
      const map = L.map(containerRef.current, {
        center: initialCenter,
        zoom: 12,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Delegate detail button clicks inside Leaflet popups
      map.on("popupopen", (e) => {
        const popupEl = e.popup.getElement();
        if (!popupEl) return;
        const btn = popupEl.querySelector("[data-open-detail]");
        if (btn) {
          btn.onclick = (evt) => {
            evt.preventDefault();
            const id = Number(btn.getAttribute("data-open-detail"));
            const found = placesRef.current.find((p) => p.id === id);
            if (found && onOpenDetailRef.current) {
              onOpenDetailRef.current(found);
            }
          };
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        markersMap.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Update Markers when safePlaces, selectedPlace, or language changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markersMapRef.current.clear();

    const validPlaces = safePlaces.filter(
      (p) => p && Array.isArray(p.coords) && p.coords.length === 2 && !isNaN(p.coords[0]) && !isNaN(p.coords[1])
    );

    validPlaces.forEach((place) => {
      const isSelected = selectedPlace && selectedPlace.id === place.id;
      const icon = createCustomPin(place, isSelected);

      const marker = L.marker(place.coords, { icon });
      const html = createPopupHtml(place, language, t);

      marker.bindPopup(html, {
        minWidth: 280,
        maxWidth: 320,
        className: "custom-popup",
      });

      marker.on("click", () => {
        if (onSelectPlace) {
          onSelectPlace(place);
        }
      });

      marker.addTo(markersLayer);
      markersMapRef.current.set(place.id, marker);
    });
  }, [safePlaces, selectedPlace, language, t, onSelectPlace]);

  // 3. Smooth flyTo and popup sync when selectedPlace changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace?.coords) return;

    if (selectedPlace.id !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedPlace.id;
      map.flyTo(selectedPlace.coords, Math.max(map.getZoom(), 13), {
        duration: 1.0,
        easeLinearity: 0.25,
      });

      const marker = markersMapRef.current.get(selectedPlace.id);
      if (marker && !marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }, [selectedPlace]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
      <div
        ref={containerRef}
        className="w-full h-full z-10"
        style={{ minHeight: "100%", width: "100%" }}
      />
    </div>
  );
}
