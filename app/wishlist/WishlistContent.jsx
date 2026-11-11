"use client";

import { useMemo } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PlaceCard from "../../components/PlaceCard";
import { places, getLocalizedPlace } from "../../data/places";
import { useLanguage } from "../language-provider";
import { useWishlist } from "../wishlist-provider";

export default function WishlistContent() {
  const { language, t } = useLanguage();
  const { wishlist, wishlistCount, isMounted, clearWishlist } = useWishlist();

  // Saqlangan joylarni tanlangan tilga moslab olish
  const savedPlaces = useMemo(() => {
    if (!isMounted) return [];
    return places
      .filter((p) => wishlist.includes(p.id))
      .map((p) => getLocalizedPlace(p, language));
  }, [wishlist, isMounted, language]);

  const handleClearAll = () => {
    if (window.confirm(t("clear_wishlist_confirm"))) {
      clearWishlist();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Yuqori Sarlavha Bo'limi */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 sm:py-14 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                {t("nav_home")}
              </Link>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                {t("nav_wishlist")}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
                  <span>❤️ {t("wishlist_badge")}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>
                    {isMounted ? wishlistCount : 0} {t("wishlist_items_count")}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t("wishlist_title")}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {t("wishlist_subtitle")}
                </p>
              </div>

              {/* Boshqaruv tugmalari (agar ro'yxat bo'sh bo'lmasa) */}
              {isMounted && savedPlaces.length > 0 && (
                <div className="flex items-center gap-3 self-start md:self-auto">
                  <button
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>{t("clear_all_wishlist")}</span>
                  </button>

                  <Link
                    href="/barcha"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
                  >
                    <span>{t("explore_places")}</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Asosiy Kontent Bo'limi */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {!isMounted ? (
            /* Hydration yuklanish holati */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 h-72 animate-pulse flex flex-col justify-between"
                >
                  <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : savedPlaces.length === 0 ? (
            /* Bo'sh holat (Empty State) */
            <div className="max-w-xl mx-auto text-center py-16 sm:py-24 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-4xl shadow-inner">
                <svg
                  className="w-10 h-10 text-rose-500 fill-rose-500/20"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                {t("wishlist_empty_title")}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-8 leading-relaxed">
                {t("wishlist_empty_desc")}
              </p>

              <Link
                href="/barcha"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-indigo-300/40 transition-all active:scale-95"
              >
                <span>🔍 {t("explore_places")}</span>
                <span>→</span>
              </Link>
            </div>
          ) : (
            /* Saqlangan joylar ro'yxati */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} isWishlist={true} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
