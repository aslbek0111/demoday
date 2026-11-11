"use client";

import Link from "next/link";
import { formatPrice } from "../data/places";
import { useLanguage } from "../app/language-provider";
import { useWishlist } from "../app/wishlist-provider";
import { useLocation } from "../app/location-provider";

export default function PlaceCard({ place, isWishlist = false, onRemove }) {
  const { language, t } = useLanguage();
  const { isInWishlist, toggleWishlist, removeFromWishlist } = useWishlist();
  const { status: locationStatus, getDistanceFromUser, requestLocation } = useLocation();

  const isFav = isInWishlist(place.id);
  const distanceInfo = place?.coords ? getDistanceFromUser(place.coords, language) : null;

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(place.id, place.name);
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(place.id);
    } else {
      removeFromWishlist(place.id, place.name);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-slate-950/50 transition-all flex flex-col group">
      {/* Rasm, Badgelar va Yurakcha */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={`/places/${place.id}`} className="block w-full h-full">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Kategoriya/Holat Badge */}
        {place.badge && (
          <span
            className={`absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm pointer-events-none ${
              place.badgeColor || "bg-indigo-600"
            }`}
          >
            {place.badge}
          </span>
        )}

        {/* Yurakcha (Wishlist) Tugmasi */}
        <button
          onClick={handleHeartClick}
          aria-label={isFav ? t("remove_from_wishlist") : t("add_to_wishlist")}
          title={isFav ? t("remove_from_wishlist") : t("add_to_wishlist")}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md cursor-pointer z-10 active:scale-75 ${
            isFav
              ? "bg-rose-50/95 dark:bg-rose-950/90 text-rose-500 border border-rose-200 dark:border-rose-800 shadow-md scale-105"
              : "bg-white/90 dark:bg-slate-900/90 text-slate-500 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 shadow-sm"
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isFav ? "fill-rose-500 stroke-rose-500 scale-110" : "fill-none stroke-current"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Distance Badge (Masofa Nishoni) */}
        {place.coords && (
          <div className="absolute bottom-3 left-3 z-10">
            {locationStatus === "loading" ? (
              <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-500 dark:text-slate-400 text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                <span>{t("location_detecting")}</span>
              </span>
            ) : distanceInfo ? (
              <span
                className="inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-800 dark:text-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-slate-200/60 dark:border-slate-700/60 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-all hover:scale-105"
                title={`${place.name} — ${distanceInfo.formatted}`}
              >
                <svg
                  className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{distanceInfo.formatted}</span>
              </span>
            ) : locationStatus === "idle" ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  requestLocation();
                }}
                className="inline-flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 backdrop-blur text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-medium px-2 py-1 rounded-md shadow-sm border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer active:scale-95"
                title={t("enable_location")}
              >
                <svg
                  className="w-3 h-3 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{t("enable_location")}</span>
              </button>
            ) : null}
          </div>
        )}

        {/* Reyting */}
        <span className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-800 dark:text-slate-100 text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/50 pointer-events-none">
          ⭐ {place.rating}
          <span className="text-slate-400 dark:text-slate-500 font-normal">
            ({place.reviewsCount})
          </span>
        </span>
      </div>

      {/* Joy ma'lumotlari */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1 uppercase tracking-wide">
          <span>{place.category}</span>
          <span className="text-slate-400 dark:text-slate-500 font-normal normal-case">
            {place.openHours}
          </span>
        </div>

        <Link href={`/places/${place.id}`} className="block">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 line-clamp-1">
            {place.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 gap-2">
          <p className="flex items-center gap-1 truncate">
            <span>📍</span> {place.city} {place.address ? `(${place.address})` : ""}
          </p>
          {distanceInfo && (
            <span className="shrink-0 font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded text-[10px]">
              {distanceInfo.formatted}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {place.description}
        </p>

        {/* Qulayliklar */}
        {place.amenities && place.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {place.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-transparent dark:border-slate-700/50"
              >
                ✓ {amenity}
              </span>
            ))}
            {place.amenities.length > 3 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 px-1 py-0.5">
                +{place.amenities.length - 3} {t("more_amenities")}
              </span>
            )}
          </div>
        )}

        {/* Narx va Harakat tugmalari */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block leading-tight">
              {t("price_label")}
            </span>
            <div className="font-extrabold text-slate-900 dark:text-white text-base">
              {formatPrice(place.price, language)}{" "}
              {t("currency")}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                {" "}
                / {place.priceUnit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isWishlist && (
              <button
                onClick={handleRemoveClick}
                className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 dark:text-rose-400 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900/60 rounded-xl transition-all cursor-pointer active:scale-95"
                title={t("remove_from_wishlist")}
                aria-label={t("remove_from_wishlist")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            <Link
              href={`/places/${place.id}`}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all"
            >
              {t("view_details")}
            </Link>

            <Link
              href={`/booking?id=${place.id}`}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all active:scale-95 flex items-center gap-1"
            >
              <span>{t("book_btn")}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
