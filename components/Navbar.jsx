"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLanguage } from "../app/language-provider";
import { useWishlist } from "../app/wishlist-provider";
import { places, categories } from "../data/places";
import { FlagUz, FlagRu } from "./FlagIcons";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const { wishlistCount, isMounted } = useWishlist();
  const [mounted, setMounted] = useState(false);

  const totalPlaces = places.length;
  const restaurantCount = places.filter((p) => p.categoryKey === "restaurant").length;
  const sportCount = places.filter((p) => p.categoryKey === "sport").length;
  const resortCount = places.filter((p) => p.categoryKey === "resort").length;
  const coworkingCount = places.filter((p) => p.categoryKey === "coworking").length;
  const cafeCount = places.filter((p) => p.categoryKey === "cafe").length;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === "dark" || theme === "dark") : false;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const toggleLanguage = () => {
    changeLanguage(language === "uz" ? "ru" : "uz");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
            JB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">JoyBand</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
              {t("logo_subtitle")}
            </p>
          </div>
        </Link>

        {/* Asosiy havolalar (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {t("nav_home")}
          </Link>

          {/* Barcha joylar (Dropdown bilan) */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              href="/barcha"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-2 group"
            >
              <span>{t("nav_places")}</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-transparent dark:border-indigo-800 font-bold px-1.5 py-0.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {totalPlaces}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform ${dropdownOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-slate-950/60 border border-slate-200 dark:border-slate-800 py-2 z-50">
                <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t("nav_categories_title")}
                  </p>
                </div>
                <Link
                  href="/barcha"
                  className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🌟</span>
                    <span>{t("cat_all")}</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded-md">{totalPlaces}</span>
                </Link>
                <Link
                  href="/barcha?category=restaurant"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🍽️</span>
                    <span>{t("cat_restaurant")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{restaurantCount}</span>
                </Link>
                <Link
                  href="/barcha?category=sport"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>⚽</span>
                    <span>{t("cat_sport")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{sportCount}</span>
                </Link>
                <Link
                  href="/barcha?category=resort"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🏡</span>
                    <span>{t("cat_resort")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{resortCount}</span>
                </Link>
                <Link
                  href="/barcha?category=coworking"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>💻</span>
                    <span>{t("cat_coworking")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{coworkingCount}</span>
                </Link>
                <Link
                  href="/barcha?category=cafe"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>☕</span>
                    <span>{t("cat_cafe")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{cafeCount}</span>
                </Link>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3">
                  <Link
                    href="/barcha"
                    className="block text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1"
                  >
                    {t("nav_view_all")}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/map"
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <span>🗺️</span>
            <span>{t("nav_map")}</span>
          </Link>

          <Link
            href="/booking"
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {t("nav_booking")}
          </Link>

          {/* Sevimlilar (Wishlist) havolasi */}
          <Link
            href="/wishlist"
            className="relative flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2 py-1.5 rounded-lg group"
            title={t("nav_wishlist")}
            aria-label={t("nav_wishlist")}
          >
            <span className="relative flex items-center justify-center">
              <svg
                className="w-5 h-5 text-rose-500 fill-rose-500/20 group-hover:fill-rose-500 group-hover:scale-110 transition-all"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>
            <span className="hidden xl:inline">{t("nav_wishlist")}</span>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full transition-all ${
                isMounted && wishlistCount > 0
                  ? "bg-rose-500 text-white shadow-xs scale-100"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {isMounted ? wishlistCount : 0}
            </span>
          </Link>

          <Link
            href="/booking"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-all shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 active:scale-95"
          >
            {t("nav_book_now")}
          </Link>

          {/* Tilni almashtirish tugmasi (Desktop - haqiqiy SVG bayroq) */}
          <button
            onClick={toggleLanguage}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            aria-label={t("language_switch")}
            title={language === "uz" ? "O'zbekcha (O'zgartirish uchun bosing)" : "Русский (Нажмите для переключения)"}
          >
            {language === "uz" ? (
              <FlagUz className="w-6 h-4 rounded-[3px] shadow-sm overflow-hidden" />
            ) : (
              <FlagRu className="w-6 h-4 rounded-[3px] shadow-sm overflow-hidden ring-1 ring-slate-300 dark:ring-slate-600" />
            )}
          </button>

          {/* Rejimni almashtirish (Desktop) */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center transition-colors text-base"
            aria-label={isDark ? t("theme_light") : t("theme_dark")}
            title={isDark ? t("theme_light") : t("theme_dark")}
          >
            {mounted ? (isDark ? "☀️" : "🌙") : <span className="opacity-0">🌙</span>}
          </button>
        </div>

        {/* Mobil menyu tugmalari, Til va Rejim tugmasi */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobil til almashtirgich (haqiqiy SVG bayroq) */}
          <button
            onClick={toggleLanguage}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label={t("language_switch")}
            title={language === "uz" ? "O'zbekcha" : "Русский"}
          >
            {language === "uz" ? (
              <FlagUz className="w-5 h-3.5 rounded-[2px] shadow-sm overflow-hidden" />
            ) : (
              <FlagRu className="w-5 h-3.5 rounded-[2px] shadow-sm overflow-hidden ring-1 ring-slate-300 dark:ring-slate-600" />
            )}
          </button>

          {/* Mobil rejim almashtirgich */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center transition-colors text-sm"
            aria-label={isDark ? t("theme_light") : t("theme_dark")}
            title={isDark ? t("theme_light") : t("theme_dark")}
          >
            {mounted ? (isDark ? "☀️" : "🌙") : <span className="opacity-0">🌙</span>}
          </button>

          {/* Mobil Wishlist tugmasi */}
          <Link
            href="/wishlist"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all relative active:scale-95"
            aria-label={t("nav_wishlist")}
            title={t("nav_wishlist")}
          >
            <svg
              className="w-4 h-4 text-rose-500 fill-rose-500/30"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {isMounted && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/barcha"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <span>{t("all_short")}</span>
            <span className="bg-indigo-600 text-white text-[10px] px-1 rounded-full">{totalPlaces}</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            aria-label="Menyu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobil menyu ochilganda */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-1"
          >
            {t("nav_home")}
          </Link>
          <Link
            href="/barcha"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-sm font-bold text-indigo-600 dark:text-indigo-400 py-1"
          >
            <span>{t("nav_places")}</span>
            <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-transparent dark:border-indigo-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {totalPlaces}
            </span>
          </Link>
          <div className="pl-3 py-1 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-l-2 border-indigo-200 dark:border-indigo-800 ml-1">
            <Link href="/barcha?category=restaurant" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">🍽️ {t("cat_restaurant")} ({restaurantCount})</Link>
            <Link href="/barcha?category=sport" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">⚽ {t("cat_sport")} ({sportCount})</Link>
            <Link href="/barcha?category=resort" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">🏡 {t("cat_resort")} ({resortCount})</Link>
            <Link href="/barcha?category=coworking" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">💻 {t("cat_coworking")} ({coworkingCount})</Link>
            <Link href="/barcha?category=cafe" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">☕ {t("cat_cafe")} ({cafeCount})</Link>
          </div>

          {/* Mobil Sevimlilar havolasi */}
          <Link
            href="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-sm font-semibold text-rose-600 dark:text-rose-400 py-1"
          >
            <span className="flex items-center gap-2">
              <span>❤️</span>
              <span>{t("nav_wishlist")}</span>
            </span>
            <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs px-2 py-0.5 rounded-full font-bold">
              {isMounted ? wishlistCount : 0}
            </span>
          </Link>

          <Link
            href="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-1"
          >
            <span>🗺️</span>
            <span>{t("nav_map")}</span>
          </Link>
          <Link
            href="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-1"
          >
            {t("nav_booking")}
          </Link>
          <Link
            href="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-sm"
          >
            {t("nav_book_now")}
          </Link>

          {/* Mobil til tanlash (bitta bosishda o'zgaradi) */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {t("language_switch")}
            </span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {language === "uz" ? (
                <FlagUz className="w-5 h-3.5 rounded-[2px] shadow-sm overflow-hidden" />
              ) : (
                <FlagRu className="w-5 h-3.5 rounded-[2px] shadow-sm overflow-hidden ring-1 ring-slate-300 dark:ring-slate-600" />
              )}
            </button>
          </div>

          {/* Mobil rejim o'zgartirish tugmasi */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {t("theme_switch")}
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span>{isDark ? t("theme_light") : t("theme_dark")}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
