"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLanguage } from "../app/language-provider";
import { categories } from "../data/places";
import { FlagUz, FlagRu } from "./FlagIcons";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

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
              href="/places"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 py-2 group"
            >
              <span>{t("nav_places")}</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-transparent dark:border-indigo-800 font-bold px-1.5 py-0.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                24
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
                  href="/places"
                  className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🌟</span>
                    <span>{t("cat_all")}</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded-md">24</span>
                </Link>
                <Link
                  href="/places?category=restaurant"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🍽️</span>
                    <span>{t("cat_restaurant")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">5</span>
                </Link>
                <Link
                  href="/places?category=sport"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>⚽</span>
                    <span>{t("cat_sport")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">6</span>
                </Link>
                <Link
                  href="/places?category=resort"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🏡</span>
                    <span>{t("cat_resort")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">5</span>
                </Link>
                <Link
                  href="/places?category=coworking"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>💻</span>
                    <span>{t("cat_coworking")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">4</span>
                </Link>
                <Link
                  href="/places?category=cafe"
                  className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg mx-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>☕</span>
                    <span>{t("cat_cafe")}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">4</span>
                </Link>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3">
                  <Link
                    href="/places"
                    className="block text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1"
                  >
                    {t("nav_view_all")}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/booking"
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {t("nav_booking")}
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

          <Link
            href="/places"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <span>{t("all_short")}</span>
            <span className="bg-indigo-600 text-white text-[10px] px-1 rounded-full">24</span>
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
            href="/places"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-sm font-bold text-indigo-600 dark:text-indigo-400 py-1"
          >
            <span>{t("nav_places")}</span>
            <span className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-transparent dark:border-indigo-800 text-xs px-2 py-0.5 rounded-full font-bold">
              24
            </span>
          </Link>
          <div className="pl-3 py-1 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-l-2 border-indigo-200 dark:border-indigo-800 ml-1">
            <Link href="/places?category=restaurant" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">🍽️ {t("cat_restaurant")} (5)</Link>
            <Link href="/places?category=sport" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">⚽ {t("cat_sport")} (6)</Link>
            <Link href="/places?category=resort" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">🏡 {t("cat_resort")} (5)</Link>
            <Link href="/places?category=coworking" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">💻 {t("cat_coworking")} (4)</Link>
            <Link href="/places?category=cafe" onClick={() => setMobileMenuOpen(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">☕ {t("cat_cafe")} (4)</Link>
          </div>
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
