"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { places, categories, getLocalizedPlace, getLocalizedCategoryName } from "../data/places";
import { useLanguage } from "./language-provider";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { language, t } = useLanguage();

  // Bosh sahifa uchun faqat tanlangan asosiy joylar ko'rsatiladi va tilga moslanadi
  const homePlaces = places
    .filter((place) => place.showOnHome !== false)
    .map((place) => getLocalizedPlace(place, language));

  // Joylarni filtr qilish
  const filteredPlaces = homePlaces.filter((place) => {
    const matchesCategory =
      selectedCategory === "all" || place.categoryKey === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      place.name.toLowerCase().includes(query) ||
      place.city.toLowerCase().includes(query) ||
      place.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Hero Bo'limi */}
        <section className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 sm:py-16 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
                {t("hero_badge")}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                {t("hero_title_1")}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {t("hero_title_highlight")}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {t("hero_desc")}
              </p>
            </div>

            {/* Qidiruv paneli */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-3 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-sm max-w-4xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
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
                    placeholder={t("search_placeholder_home")}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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

                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-95"
                >
                  {t("direct_booking")}
                </Link>
              </div>

              {/* Kategoriyalar filtri */}
              <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap pl-1">
                  {t("categories_label")}
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {getLocalizedCategoryName(cat, language)}
                  </button>
                ))}
              </div>
            </div>

            {/* Qisqa statistika */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{t("stat_places_count")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("stat_places_label")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{t("stat_bookings_count")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("stat_bookings_label")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{t("stat_rating_val")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("stat_rating_label")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{t("stat_support_val")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("stat_support_label")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Joylar Ro'yxati Bo'limi */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {t("home_places_title")}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("home_places_subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                {t("recommended_label")}{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {filteredPlaces.length} {t("places_badge_count")}
                </strong>
              </span>
              <Link
                href="/places"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>{t("view_all_places_count")}</span>
              </Link>
            </div>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                {t("empty_title")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                &quot;{searchQuery}&quot; {t("empty_desc_home")}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
              >
                {t("reset_filters")}
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
                      <span>📍</span> {place.city}
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

          {/* Barcha joylarga o'tish tugmasi */}
          <div className="mt-10 text-center">
            <Link
              href="/places"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-md transition-all active:scale-95"
            >
              <span>{t("view_all_button")}</span>
            </Link>
          </div>
        </section>

        {/* Qanday ishlaydi bo'limi */}
        <section className="bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-12 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-xs font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
                {t("how_it_works_badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("how_it_works_title")}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {t("how_it_works_subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 1-qadam */}
              <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-3">
                  01
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  {t("step_1_title")}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t("step_1_desc")}
                </p>
              </div>

              {/* 2-qadam */}
              <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-3">
                  02
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  {t("step_2_title")}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t("step_2_desc")}
                </p>
              </div>

              {/* 3-qadam */}
              <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-3">
                  03
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  {t("step_3_title")}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t("step_3_desc")}
                </p>
              </div>

              {/* 4-qadam */}
              <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-3">
                  04
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                  {t("step_4_title")}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t("step_4_desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platforma afzalliklari */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("why_us_title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t("why_us_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold mb-4">
                ⏱️
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {t("feature_1_title")}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t("feature_1_desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold mb-4">
                💯
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {t("feature_2_title")}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t("feature_2_desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl font-bold mb-4">
                🛎️
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {t("feature_3_title")}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t("feature_3_desc")}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
