"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getPlaceGallery } from "../data/places";
import { useLanguage } from "../app/language-provider";
import { useWishlist } from "../app/wishlist-provider";
import { useLocation } from "../app/location-provider";

export default function AdvancedGallery({ place }) {
  const { language, t } = useLanguage();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getDistanceFromUser } = useLocation();

  const distanceInfo = place?.coords
    ? getDistanceFromUser(place.coords, language)
    : null;

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  const isFav = isInWishlist(place?.id);

  // Joyning to'liq rasmlar galereyasi
  const gallery = useMemo(() => {
    return getPlaceGallery(place);
  }, [place]);

  // Faol toifa bo'yicha filtrlangan rasmlar
  const filteredGallery = useMemo(() => {
    if (activeFilter === "all") return gallery;
    return gallery.filter((img) => img.category === activeFilter);
  }, [gallery, activeFilter]);

  // Lightbox ni ochish
  const openLightbox = (index = 0) => {
    setCurrentIndex(index);
    setActiveFilter("all");
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Orqa fon skrollini to'xtatish
  };

  // Lightbox ni yopish
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  // Keyingi rasm
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
  }, [filteredGallery.length]);

  // Oldingi rasm
  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  }, [filteredGallery.length]);

  // Klaviatura hodisalari (Esc, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, closeLightbox, nextImage, prevImage]);

  // Filtrlangan rasmlar o'zgarganda indeksni to'g'rilash
  useEffect(() => {
    if (currentIndex >= filteredGallery.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentIndex(0);
    }
  }, [filteredGallery.length, currentIndex]);

  const currentImage = filteredGallery[currentIndex] || gallery[0];

  // Kategoriyalar
  const categories = [
    { key: "all", label: t("gallery_filter_all") },
    { key: "interior", label: t("gallery_filter_interior") },
    { key: "exterior", label: t("gallery_filter_exterior") },
    { key: "amenity", label: t("gallery_filter_amenity") },
    { key: "food", label: t("gallery_filter_food") },
  ];

  // Mavjud toifalarni tekshirish (agar o'sha toifada rasm bo'lsa)
  const availableCategories = categories.filter(
    (c) => c.key === "all" || gallery.some((img) => img.category === c.key)
  );

  return (
    <>
      {/* 1. Bento / Mosaic Grid (Joy tafsilotlari sahifasining boshida) */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-slate-200 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
        {/* Desktop Bento Grid (1 ta katta, 4 ta kichik) */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-80 sm:h-96 md:h-[460px]">
          {/* Asosiy Katta Rasm (chapdagi 2 ta ustun, 2 ta qator) */}
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden group bg-slate-900"
          >
            <img
              src={gallery[0]?.url || place.image}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 group-hover:opacity-90 transition-opacity"></div>

            {/* Badgelar (Chap yuqorida) */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              {place.badge && (
                <span
                  className={`text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                    place.badgeColor || "bg-indigo-600"
                  }`}
                >
                  {place.badge}
                </span>
              )}
              <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-800 dark:text-slate-100 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                ⭐ {place.rating} ({place.reviewsCount} {t("rating_unit")})
              </span>
            </div>

            {/* Asosiy Sarlavha (Katta rasm pastida) */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-10">
              <span className="text-[11px] uppercase font-semibold text-indigo-300 tracking-wider">
                {place.category}
              </span>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                {place.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 opacity-90 truncate">
                  <span>📍</span>
                  <span>
                    {place.city} — {place.address}
                  </span>
                </p>
                {distanceInfo?.formatted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-xs">
                    {distanceInfo.formatted}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* O'ng tarafdagi 4 ta kichik rasm (Faqat md ekranda ko'rinadi) */}
          {gallery.slice(1, 5).map((img, idx) => {
            const actualIndex = idx + 1;
            const isLast = idx === 3;
            const remainingCount = gallery.length - 5;

            return (
              <div
                key={idx}
                onClick={() => openLightbox(actualIndex)}
                className="hidden md:block relative cursor-pointer overflow-hidden group bg-slate-900 h-full"
              >
                <img
                  src={img.url}
                  alt={language === "ru" ? img.captionRu : img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

                {/* 5-rasm ustidagi "+N ta rasm" overlay qatlami */}
                {isLast && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-3 text-center transition-all group-hover:bg-slate-950/70">
                    <span className="text-2xl font-black">+{remainingCount}</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5">
                      {t("gallery_view_all")}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Wishlist ❤️ Tugmasi (O'ng yuqorida) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(place.id, place.name);
          }}
          className={`absolute top-4 right-4 px-3.5 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer active:scale-95 z-20 ${
            isFav
              ? "bg-rose-500 text-white font-bold shadow-rose-500/30"
              : "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-rose-500 font-semibold"
          }`}
          title={isFav ? t("remove_from_wishlist") : t("add_to_wishlist")}
          aria-label={isFav ? t("remove_from_wishlist") : t("add_to_wishlist")}
        >
          <svg
            className={`w-5 h-5 transition-transform ${
              isFav ? "fill-white stroke-white scale-110" : "fill-none stroke-current"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span className="text-xs hidden sm:inline">
            {isFav ? t("nav_wishlist") : t("add_to_wishlist")}
          </span>
        </button>

        {/* Pastki O'ngdagi "Barcha rasmlar" tugmasi */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg backdrop-blur border border-slate-200/60 dark:border-slate-700 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer"
        >
          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{t("gallery_view_all")} ({gallery.length})</span>
        </button>
      </div>

      {/* 2. Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 select-none">
          {/* Lightbox Yuqori Paneli */}
          <div className="flex items-center justify-between p-4 sm:px-6 border-b border-white/10 text-white z-10">
            {/* Rasm hisoblagichi va Joy nomi */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded-lg">
                {currentIndex + 1} / {filteredGallery.length}
              </span>
              <span className="text-sm font-semibold truncate max-w-[200px] sm:max-w-md text-slate-200">
                {place.name}
              </span>
            </div>

            {/* Toifalar filtri (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5">
              {availableCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveFilter(cat.key);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeFilter === cat.key
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white/10 hover:bg-white/20 text-slate-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Yopish tugmasi */}
            <button
              onClick={closeLightbox}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
              title={t("gallery_close")}
              aria-label={t("gallery_close")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lightbox Asosiy Rasm Maydoni */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            {/* Oldingi Rasm Tugmasi */}
            <button
              onClick={prevImage}
              className="absolute left-3 sm:left-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 text-white flex items-center justify-center backdrop-blur transition-all z-20 cursor-pointer shadow-lg"
              title={t("gallery_prev")}
              aria-label={t("gallery_prev")}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Rasm konteyneri */}
            <div className="max-w-5xl max-h-[75vh] sm:max-h-[80vh] flex flex-col items-center justify-center">
              <img
                src={currentImage?.url}
                alt={language === "ru" ? currentImage?.captionRu : currentImage?.caption}
                className="max-h-[68vh] sm:max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />

              {/* Rasm izohi (Caption) */}
              {(currentImage?.caption || currentImage?.captionRu) && (
                <p className="mt-3 text-xs sm:text-sm text-slate-300 font-medium text-center bg-black/60 px-4 py-1.5 rounded-full backdrop-blur">
                  {language === "ru" ? currentImage.captionRu : currentImage.caption}
                </p>
              )}
            </div>

            {/* Keyingi Rasm Tugmasi */}
            <button
              onClick={nextImage}
              className="absolute right-3 sm:right-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 active:scale-90 text-white flex items-center justify-center backdrop-blur transition-all z-20 cursor-pointer shadow-lg"
              title={t("gallery_next")}
              aria-label={t("gallery_next")}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Lightbox Pastki Eskizlar (Thumbnails) Lentasi */}
          <div className="p-3 sm:p-4 border-t border-white/10 bg-black/40 backdrop-blur flex items-center justify-center gap-2 overflow-x-auto max-w-full">
            {filteredGallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "ring-2 ring-indigo-500 scale-105 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
