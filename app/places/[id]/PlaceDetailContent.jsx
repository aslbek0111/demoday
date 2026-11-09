"use client";

import { useMemo } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { places, getLocalizedPlace } from "../../../data/places";
import { useLanguage } from "../../language-provider";

export default function PlaceDetailContent({ id }) {
  const { language, t } = useLanguage();

  const place = useMemo(() => {
    const raw = places.find((p) => p.id === Number(id)) || places[0];
    return getLocalizedPlace(raw, language);
  }, [id, language]);

  if (!place) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-xl font-bold mb-2">Joy topilmadi</h2>
            <Link href="/barcha" className="text-indigo-600 underline text-sm">
              Barcha joylarga qaytish
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              {t("nav_home")}
            </Link>
            <span>/</span>
            <Link href="/barcha" className="hover:text-indigo-600 transition-colors">
              {t("nav_places")}
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
              {place.name}
            </span>
          </nav>

          {/* Banner va Asosiy Rasm */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-lg bg-slate-200 dark:bg-slate-800">
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className={`text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                  place.badgeColor || "bg-indigo-600"
                }`}
              >
                {place.badge}
              </span>
              <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-800 dark:text-slate-100 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                ⭐ {place.rating} ({place.reviewsCount} {t("rating_unit")})
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs uppercase font-semibold text-indigo-300 tracking-wider mb-1">
                {place.category}
              </p>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md">
                {place.name}
              </h1>
              <p className="text-sm text-slate-200 flex items-center gap-1.5 mt-2 opacity-90">
                <span>📍</span>
                <span>
                  {place.city} — {place.address}
                </span>
              </p>
            </div>
          </div>

          {/* Asosiy Kontent va Yon Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Chap tomondagi ma'lumotlar */}
            <div className="lg:col-span-8 space-y-8">
              {/* Lokatsiya va Status Paneli */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {place.hasExactCoords ? t("exact_location") : t("unverified_location")}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span>🕒</span> {place.openHours}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>👥</span> {place.capacity}
                  </span>
                </div>
              </div>

              {/* Tavsif */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Tavsif
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Qulayliklar */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  {t("amenities_title")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {place.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Xaritada ko'rish CTA */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-indigo-900 dark:text-indigo-200">
                    Interaktiv xaritada qulay ko&apos;rish
                  </h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                    Ushbu joyning xaritadagi aniq joylashuvi va atrofidagi boshqa maskanlar
                  </p>
                </div>
                <Link
                  href="/map"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center shrink-0 active:scale-95"
                >
                  🗺️ {t("map_view_on_map")}
                </Link>
              </div>
            </div>

            {/* O'ng tomondagi Narx va Band qilish kartasi (Sticky) */}
            <div className="lg:col-span-4 sticky top-20 space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div>
                  <span className="text-xs text-slate-400 block leading-tight">
                    {t("price_label")}
                  </span>
                  <div className="font-black text-3xl text-slate-900 dark:text-white mt-1">
                    {place.price?.toLocaleString(language === "ru" ? "ru-RU" : "uz-UZ")}{" "}
                    <span className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                      {t("currency")}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    / {place.priceUnit}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{t("rating_label") || "Mijozlar reytingi"}:</span>
                    <strong className="text-slate-900 dark:text-white">
                      ⭐ {place.rating} / 5
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{t("capacity_label")}:</span>
                    <strong className="text-slate-900 dark:text-white">
                      {place.capacity}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{t("working_hours_label")}:</span>
                    <strong className="text-slate-900 dark:text-white">
                      {place.openHours}
                    </strong>
                  </div>
                </div>

                <Link
                  href={`/booking?id=${place.id}`}
                  className="w-full block py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm text-center rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                >
                  {t("book_btn")} →
                </Link>

                <p className="text-[11px] text-slate-400 text-center">
                  🔒 Tezkor tasdiqlash va xavfsiz bron qilish
                </p>
              </div>

              {/* Orqaga qaytish havolalari */}
              <div className="text-center space-y-2">
                <Link
                  href="/barcha"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline block"
                >
                  ← {t("back_to_places")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
