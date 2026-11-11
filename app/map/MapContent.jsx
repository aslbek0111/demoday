"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { places, categories, getLocalizedPlace, getLocalizedCategoryName, formatPrice } from "../../data/places";
import { useLanguage } from "../language-provider";

// Leaflet faqat brauzerda ishlashi uchun ssr: false bilan yuklanadi
const InteractiveMap = dynamic(() => import("../../components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-sm font-semibold">Xarita yuklanmoqda...</p>
    </div>
  ),
});

export default function MapContent() {
  const { language, t } = useLanguage();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Filtr holatlari
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [minRating, setMinRating] = useState("all");

  // Tanlangan joy (xaritada ajratib ko'rsatish uchun)
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Batafsil modal holati
  const [detailModalPlace, setDetailModalPlace] = useState(null);

  // Mobil rejimda xarita yoki ro'yxatni almashtirish ('map' | 'list')
  const [mobileView, setMobileView] = useState("map");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" || theme === "dark" : false;

  // Joylar ma'lumotlarini xavfsiz massiv sifatida olish (massiv, { places: [...] } yoki { data: [...] } bo'lishidan qat'i nazar)
  const rawPlacesList = useMemo(() => {
    if (Array.isArray(places)) return places;
    if (places && Array.isArray(places.places)) return places.places;
    if (places && Array.isArray(places.data)) return places.data;
    return [];
  }, []);

  const rawCategoriesList = useMemo(() => {
    if (Array.isArray(categories)) return categories;
    if (categories && Array.isArray(categories.categories)) return categories.categories;
    return [];
  }, []);

  // Joylarni tanlangan tilga moslash
  const localizedPlaces = useMemo(() => {
    return rawPlacesList.map((p) => getLocalizedPlace(p, language));
  }, [rawPlacesList, language]);

  // Shaharlar ro'yxati
  const cities = useMemo(() => {
    const list = new Set();
    rawPlacesList.forEach((p) => {
      const loc = getLocalizedPlace(p, language);
      if (loc && loc.city) {
        const mainCity = loc.city.split(",")[0].trim();
        list.add(mainCity);
      }
    });
    return ["all", ...Array.from(list)];
  }, [rawPlacesList, language]);

  // Kategoriyalar bo'yicha hisoblagich
  const categoryCounts = useMemo(() => {
    const counts = { all: rawPlacesList.length };
    rawCategoriesList.forEach((c) => {
      if (c && c.id !== "all") {
        counts[c.id] = rawPlacesList.filter((p) => p && p.categoryKey === c.id).length;
      }
    });
    return counts;
  }, [rawPlacesList, rawCategoriesList]);

  // Filtrlash mantiqi
  const filteredPlaces = useMemo(() => {
    return localizedPlaces.filter((place) => {
      // Kategoriya
      const matchesCategory =
        selectedCategory === "all" || place.categoryKey === selectedCategory;

      // Shahar / Hudud
      const matchesCity =
        selectedCity === "all" ||
        place.city.toLowerCase().includes(selectedCity.toLowerCase());

      // Qidiruv so'rovi
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        place.name.toLowerCase().includes(query) ||
        place.city.toLowerCase().includes(query) ||
        place.address.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query) ||
        place.amenities.some((a) => a.toLowerCase().includes(query));

      // Narx filtri
      let matchesPrice = true;
      if (maxPrice !== "all") {
        const limit = Number(maxPrice);
        matchesPrice = place.price <= limit;
      }

      // Reyting filtri
      let matchesRating = true;
      if (minRating !== "all") {
        const ratingLimit = Number(minRating);
        matchesRating = place.rating >= ratingLimit;
      }

      return (
        matchesCategory &&
        matchesCity &&
        matchesSearch &&
        matchesPrice &&
        matchesRating
      );
    });
  }, [
    localizedPlaces,
    selectedCategory,
    selectedCity,
    searchQuery,
    maxPrice,
    minRating,
  ]);

  // Filtr parametrlarini tozalash
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCity("all");
    setMaxPrice("all");
    setMinRating("all");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedCity !== "all" ||
    maxPrice !== "all" ||
    minRating !== "all";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Yuqori qism: Sarlavha va Kengaytirilgan Filtr Paneli */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Sarlavha satri */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  <span>🗺️ {t("map_badge")}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                  <span>
                    {filteredPlaces.length} / {rawPlacesList.length} {t("places_badge_count")}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t("map_title")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-0.5">
                  {t("map_subtitle")}
                </p>
              </div>

              {/* Mobil rejimda Xarita / Ro'yxat o'tkazgich */}
              <div className="flex md:hidden items-center self-start bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMobileView("map")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mobileView === "map"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  🗺️ {t("map_toggle_map")}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mobileView === "list"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  📋 {t("map_toggle_list")} ({filteredPlaces.length})
                </button>
              </div>
            </div>

            {/* Filtr boshqaruv paneli */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
                {/* 1. Matnli qidiruv */}
                <div className="lg:col-span-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("search_placeholder_map")}
                    className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* 2. Shahar / Hudud tanlash */}
                <div className="lg:col-span-3">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full py-2 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">📍 {t("all_regions")}</option>
                    {cities
                      .filter((c) => c !== "all")
                      .map((c) => (
                        <option key={c} value={c}>
                          📍 {c}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 3. Narx filtri */}
                <div className="lg:col-span-2">
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full py-2 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">💰 {t("all_prices")}</option>
                    <option value="50000">≤ 50 000 so&apos;m</option>
                    <option value="150000">≤ 150 000 so&apos;m</option>
                    <option value="300000">≤ 300 000 so&apos;m</option>
                    <option value="1000000">≤ 1 000 000 so&apos;m</option>
                    <option value="2500000">≤ 2 500 000 so&apos;m</option>
                  </select>
                </div>

                {/* 4. Reyting filtri */}
                <div className="lg:col-span-2">
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full py-2 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">⭐ {t("all_ratings")}</option>
                    <option value="4.5">⭐ 4.5+</option>
                    <option value="4.7">⭐ 4.7+</option>
                    <option value="4.8">⭐ 4.8+</option>
                    <option value="4.9">⭐ 4.9+</option>
                  </select>
                </div>

                {/* 5. Tozalash tugmasi */}
                <div className="lg:col-span-1">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    disabled={!hasActiveFilters}
                    className={`w-full py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center flex items-center justify-center gap-1 ${
                      hasActiveFilters
                        ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed opacity-60"
                    }`}
                    title={t("reset_filters")}
                  >
                    <span>🔄</span>
                    <span className="sm:hidden lg:inline">{t("clear")}</span>
                  </button>
                </div>
              </div>

              {/* Kategoriya tugmalari (chiplar) */}
              <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
                {rawCategoriesList.map((cat) => {
                  const count = categoryCounts[cat.id] || 0;
                  const isActive = selectedCategory === cat.id;
                  const icons = {
                    all: "🌟",
                    restaurant: "🍽️",
                    sport: "⚽",
                    resort: "🏡",
                    coworking: "💻",
                    cafe: "☕",
                  };
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm scale-102"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span>{icons[cat.id] || "📍"}</span>
                      <span>{getLocalizedCategoryName(cat, language)}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Asosiy Ish Maydoni: Split-View (Desktop) / Toggle (Mobile) */}
        <section className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
            {/* Chap tomondagi ro'yxat (Desktop: doimiy, Mobile: tanlangan bo'lsa) */}
            <div
              className={`lg:col-span-5 xl:col-span-5 flex flex-col gap-3 ${
                mobileView === "list" ? "block" : "hidden lg:flex"
              }`}
            >
              {/* Ro'yxat sarlavhasi va statistika */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {filteredPlaces.length} {t("places_badge_count")} {t("results_count")}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Kartani tanlab xaritada ko&apos;ring
                </span>
              </div>

              {/* Agar filtr bo'yicha hech narsa topilmasa */}
              {filteredPlaces.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
                  <span className="text-4xl block">🔍</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t("no_places_map")}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    {t("no_places_map_desc")}
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    {t("reset_all_filters")}
                  </button>
                </div>
              ) : (
                /* Joylar kartochkalari ro'yxati (Scrollable) */
                <div className="space-y-3 max-h-[calc(100vh-290px)] overflow-y-auto pr-1">
                  {filteredPlaces.map((place) => {
                    const isSelected = selectedPlace?.id === place.id;
                    return (
                      <div
                        key={place.id}
                        onMouseEnter={() => setSelectedPlace(place)}
                        className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-3.5 flex gap-3.5 group cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                        }`}
                      >
                        {/* Rasm */}
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span
                            className={`absolute top-1.5 left-1.5 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                              place.badgeColor || "bg-indigo-600"
                            }`}
                          >
                            {place.badge}
                          </span>
                        </div>

                        {/* Ma'lumotlar */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                {place.category}
                              </span>
                              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-0.5">
                                ⭐ {place.rating}
                              </span>
                            </div>

                            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {place.name}
                            </h3>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                              <span>📍</span>
                              <span>{place.city}</span>
                            </p>
                          </div>

                          {/* Narx va tugmalar */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between gap-2 mt-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block leading-tight">
                                {t("price_label")}
                              </span>
                              <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                                {formatPrice(place.price, language)}{" "}
                                {t("currency")}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDetailModalPlace(place);
                                }}
                                className="px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                              >
                                {t("map_detail_btn")}
                              </button>

                              <Link
                                href={`/booking?id=${place.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-1.5 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors active:scale-95 shadow-xs"
                              >
                                {t("book_btn")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* O'ng tomondagi Katta Xarita (Desktop: doimiy, Mobile: tanlangan bo'lsa) */}
            <div
              className={`lg:col-span-7 xl:col-span-7 h-[calc(100vh-270px)] min-h-[500px] sticky top-20 ${
                mobileView === "map" ? "block" : "hidden lg:block"
              }`}
            >
              <InteractiveMap
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onSelectPlace={(place) => setSelectedPlace(place)}
                onOpenDetail={(place) => setDetailModalPlace(place)}
                isDark={isDark}
                language={language}
                t={t}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Joy haqida Batafsil Modal */}
      {detailModalPlace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setDetailModalPlace(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Banner Rasmi */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-100 dark:bg-slate-800">
              <img
                src={detailModalPlace.image}
                alt={detailModalPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {/* Yopish tugmasi */}
              <button
                type="button"
                onClick={() => setDetailModalPlace(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                aria-label="Yopish"
              >
                ✕
              </button>

              {/* Badge va Kategoriya */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                    detailModalPlace.badgeColor || "bg-indigo-600"
                  }`}
                >
                  {detailModalPlace.badge}
                </span>
                <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-800 dark:text-slate-100 text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  ⭐ {detailModalPlace.rating} ({detailModalPlace.reviewsCount}{" "}
                  {t("rating_unit")})
                </span>
              </div>

              {/* Rasm ustidagi nom va manzil */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs uppercase font-semibold text-indigo-300 tracking-wider mb-1">
                  {detailModalPlace.category}
                </p>
                <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-sm">
                  {detailModalPlace.name}
                </h2>
                <p className="text-xs text-slate-200 flex items-center gap-1 mt-1 opacity-90">
                  <span>📍</span>
                  <span>
                    {detailModalPlace.city} — {detailModalPlace.address}
                  </span>
                </p>
              </div>
            </div>

            {/* Modal Kontenti */}
            <div className="p-6 space-y-6">
              {/* Lokatsiya va holat */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {detailModalPlace.hasExactCoords
                      ? t("exact_location")
                      : t("unverified_location")}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>🕒 {detailModalPlace.openHours}</span>
                  <span>•</span>
                  <span>👥 {detailModalPlace.capacity}</span>
                </div>
              </div>

              {/* Tavsif */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Tavsif
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {detailModalPlace.description}
                </p>
              </div>

              {/* Qulayliklar */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  {t("amenities_title")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detailModalPlace.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 font-medium flex items-center gap-1.5"
                    >
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Narx va Pastki harakat tugmalari */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block leading-tight">
                    {t("price_label")}
                  </span>
                  <div className="font-black text-2xl text-slate-900 dark:text-white">
                    {formatPrice(detailModalPlace.price, language)}{" "}
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {t("currency")}
                    </span>
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      {" "}
                      / {detailModalPlace.priceUnit}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Link
                    href={`/places/${detailModalPlace.id}`}
                    className="flex-1 sm:flex-initial px-3.5 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors text-center"
                  >
                    📄 {t("map_detail_btn")}
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlace(detailModalPlace);
                      setDetailModalPlace(null);
                      setMobileView("map");
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer text-center"
                  >
                    🗺️ {t("map_view_on_map")}
                  </button>

                  <Link
                    href={`/booking?id=${detailModalPlace.id}`}
                    className="flex-1 sm:flex-initial px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-2xl shadow-md transition-all active:scale-95 text-center"
                  >
                    {t("map_book_btn")} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
