"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Kategoriya bo'yicha ranglar va emojilar
const categoryStyles = {
  restaurant: {
    color: "#f59e0b", // amber-500
    bgClass: "bg-amber-500",
    borderClass: "border-amber-400",
    icon: "🍽️",
    label: "Restoran",
  },
  sport: {
    color: "#10b981", // emerald-500
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-400",
    icon: "⚽",
    label: "Sport",
  },
  resort: {
    color: "#0284c7", // sky-600
    bgClass: "bg-sky-600",
    borderClass: "border-sky-400",
    icon: "🏡",
    label: "Dacha",
  },
  coworking: {
    color: "#8b5cf6", // purple-500
    bgClass: "bg-purple-600",
    borderClass: "border-purple-400",
    icon: "💻",
    label: "Kovorking",
  },
  cafe: {
    color: "#f43f5e", // rose-500
    bgClass: "bg-rose-500",
    borderClass: "border-rose-400",
    icon: "☕",
    label: "Kafe",
  },
};

// Custom zamonaviy marker yaratish funksiyasi
function createCustomPin(place, isSelected) {
  const meta = categoryStyles[place.categoryKey] || {
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

// Xaritani tanlangan joyga silliq boshqarish komponenti
function MapController({ selectedPlace, places }) {
  const map = useMap();
  const prevSelectedIdRef = useRef(null);

  useEffect(() => {
    if (selectedPlace && selectedPlace.coords && selectedPlace.id !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedPlace.id;
      map.flyTo(selectedPlace.coords, Math.max(map.getZoom(), 13), {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [selectedPlace, map]);

  return null;
}

export default function Map({
  places = [],
  selectedPlace = null,
  onSelectPlace,
  onOpenDetail,
  isDark = false,
  language = "uz",
  t = (k) => k,
}) {
  // Standart markaz (O'zbekiston / Toshkent)
  const defaultCenter = [41.3111, 69.2797];

  const markerInstances = useMemo(() => {
    return places
      .filter((p) => Array.isArray(p.coords) && p.coords.length === 2)
      .map((place) => {
        const isSelected = selectedPlace && selectedPlace.id === place.id;
        const icon = createCustomPin(place, isSelected);
        return { place, icon, isSelected };
      });
  }, [places, selectedPlace]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
      <MapContainer
        center={selectedPlace?.coords || defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        style={{ minHeight: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController selectedPlace={selectedPlace} places={places} />

        {markerInstances.map(({ place, icon }) => (
          <Marker
            key={place.id}
            position={place.coords}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onSelectPlace) {
                  onSelectPlace(place);
                }
              },
            }}
          >
            <Popup minWidth={280} maxWidth={320} className="custom-popup">
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-sans">
                {/* Rasm va Badge */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  
                  <span
                    className={`absolute top-2.5 left-2.5 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
                      place.badgeColor || "bg-indigo-600"
                    }`}
                  >
                    {place.badge}
                  </span>

                  <span className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-800 dark:text-slate-100 text-xs font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60">
                    ⭐ {place.rating}
                    <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">
                      ({place.reviewsCount})
                    </span>
                  </span>

                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <p className="text-[11px] font-medium text-slate-200 opacity-90 uppercase tracking-wider flex items-center gap-1">
                      <span>{categoryStyles[place.categoryKey]?.icon || "📍"}</span>
                      <span>{place.category}</span>
                    </p>
                  </div>
                </div>

                {/* Asosiy ma'lumotlar */}
                <div className="p-3.5 space-y-2">
                  <a
                    href={`/places/${place.id}`}
                    className="font-bold text-sm text-slate-900 dark:text-white leading-tight line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                  >
                    {place.name}
                  </a>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 line-clamp-1">
                    <span>📍</span>
                    <span>{place.city}</span>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <span className="text-[11px] truncate">{place.address}</span>
                  </p>

                  {/* Lokatsiya holati (haqiqiy koordinata yoki tekshirish) */}
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 w-fit">
                    <span>✓</span>
                    <span className="font-medium">
                      {place.hasExactCoords ? t("exact_location") : t("unverified_location")}
                    </span>
                  </div>

                  {/* Narx */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-tight">
                        {t("price_label")}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {place.price?.toLocaleString(language === "ru" ? "ru-RU" : "uz-UZ")}{" "}
                        {t("currency")}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {" "}
                        / {place.priceUnit}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      🕒 {place.openHours}
                    </span>
                  </div>

                  {/* Tugmalar */}
                  <div className="pt-1 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenDetail) onOpenDetail(place);
                      }}
                      className="w-full text-center py-2 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      {t("map_detail_btn")}
                    </button>

                    <a
                      href={`/booking?id=${place.id}`}
                      className="w-full text-center py-2 px-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-sm transition-all block active:scale-95"
                    >
                      {t("map_book_btn")} →
                    </a>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
