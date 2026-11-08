"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { places, categories, getLocalizedPlace, getLocalizedCategoryName } from "../../data/places";
import { useLanguage } from "../language-provider";

export default function PlacesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "all";
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  // URL query o'zgarsa kategoriyani yangilash
  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Joylarni tanlangan tilga moslash
  const localizedPlaces = useMemo(() => {
    return places.map((p) => getLocalizedPlace(p, language));
  }, [language]);

  // Shaharlar ro'yxati
  const cities = useMemo(() => {
    const list = new Set();
    places.forEach((p) => {
      const loc = getLocalizedPlace(p, language);
      const mainCity = loc.city.split(",")[0].trim();
      list.add(mainCity);
    });
    return ["all", ...Array.from(list)];
  }, [language]);

  // Har bir kategoriya bo'yicha joylar soni
  const categoryCounts = useMemo(() => {
    const counts = { all: places.length };
    categories.forEach((c) => {
      if (c.id !== "all") {
        counts[c.id] = places.filter((p) => p.categoryKey === c.id).length;
      }
    });
    return counts;
  }, []);

  // Barcha joylarni filtrlash va saralash
  const filteredPlaces = useMemo(() => {
    let result = localizedPlaces.filter((place) => {
      const matchesCategory =
        selectedCategory === "all" || place.categoryKey === selectedCategory;

      const matchesCity =
        selectedCity === "all" || place.city.toLowerCase().includes(selectedCity.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        place.name.toLowerCase().includes(query) ||
        place.city.toLowerCase().includes(query) ||
        place.address.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query) ||
        place.amenities.some((a) => a.toLowerCase().includes(query));

      return matchesCategory && matchesCity && matchesSearch;
    });

    // Saralash
    if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "reviews") {
      result = [...result].sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [localizedPlaces, searchQuery, selectedCategory, selectedCity, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCity("all");
    setSortBy("recommended");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Yuqori Sarlavha Bo'limi */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 sm:py-14 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
                  <span>{t("places_badge")}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                  <span>{places.length} {t("places_badge_count")}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t("places_title")}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {t("places_subtitle")}
                </p>
              </div>

              <Link
                href="/booking"
                className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition-all self-start md:self-auto active:scale-95"
              >
                {t("direct_booking_arrow")}
              </Link>
            </div>

            {/* Qidiruv va saralash boshqaruvi */}
            <div className="mt-8 bg-slate-100 dark:bg-slate-800/80 p-3 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Matnli qidiruv */}
                <div className="md:col-span-6 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <svg
                      className="w-5 h-5"
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
                    placeholder={t("search_placeholder_places")}
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {t("clear")}
                    </button>
                  )}
                </div>

                {/* Shahar filtri */}
                <div className="md:col-span-3">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="all">{t("all_regions")}</option>
                    {cities
                      .filter((c) => c !== "all")
                      .map((c) => (
                        <option key={c} value={c}>
                          📍 {c}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Saralash */}
                <div className="md:col-span-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="recommended">{t("sort_recommended")}</option>
                    <option value="rating">{t("sort_rating")}</option>
                    <option value="reviews">{t("sort_reviews")}</option>
                    <option value="price_asc">{t("sort_price_asc")}</option>
                    <option value="price_desc">{t("sort_price_desc")}</option>
                  </select>
                </div>
              </div>

              {/* Kategoriyalar tugmalari */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
                {categories.map((cat) => {
                  const count = categoryCounts[cat.id] || 0;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
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

        {/* Joylar Ro'yxati */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("results_found_title")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("total_database", { count: places.length })}
              </p>
            </div>
            <div className="text-xs bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {t("results_count")}{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">
                {filteredPlaces.length} {t("places_badge_count")}
              </strong>
            </div>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-lg mx-auto">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t("empty_title")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                {t("empty_desc_places")}
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                {t("reset_all_filters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-slate-950/50 transition-all flex flex-col group"
                >
                  {/* Rasm va Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span
                      className={`absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${place.badgeColor}`}
                    >
                      {place.badge}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-800 dark:text-slate-100 text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/50">
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

                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 line-clamp-1">
                      {place.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-3">
                      <span>📍</span> {place.city} ({place.address})
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                      {place.description}
                    </p>

                    {/* Qulayliklar */}
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

                    {/* Narx va Band qilish tugmasi */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block leading-tight">
                          {t("price_label")}
                        </span>
                        <div className="font-extrabold text-slate-900 dark:text-white text-base">
                          {place.price.toLocaleString(language === "ru" ? "ru-RU" : "uz-UZ")}{" "}
                          {t("currency")}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            {" "}
                            / {place.priceUnit}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/booking?id=${place.id}`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all active:scale-95 flex items-center gap-1"
                      >
                        {t("book_btn")}
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
