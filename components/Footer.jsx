"use client";

import Link from "next/link";
import { useLanguage } from "../app/language-provider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 mt-auto border-t border-slate-800 dark:border-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo va tavsif */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
                JB
              </div>
              <span className="font-bold text-xl text-white tracking-tight">JoyBand.uz</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t("footer_desc")}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 dark:bg-slate-900 text-xs text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {t("footer_safe_platform")}
            </div>
          </div>

          {/* Havolalar */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
              {t("footer_pages_title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t("nav_home")}
                </Link>
              </li>
              <li>
                <Link href="/places" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>{t("nav_places")}</span>
                  <span className="text-[10px] bg-slate-800 dark:bg-slate-900 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.2 rounded-full font-bold">24</span>
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white transition-colors">
                  {t("nav_booking")}
                </Link>
              </li>
              <li className="text-slate-500 text-xs pt-1">
                {t("footer_catalog_updated")}
              </li>
            </ul>
          </div>

          {/* Xizmatlarimiz */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
              {t("footer_services_title")}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> {t("footer_service_1")}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> {t("footer_service_2")}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> {t("footer_service_3")}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> {t("footer_service_4")}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t("footer_rights")}</p>
          <p className="bg-slate-800/80 dark:bg-slate-900/80 px-3 py-1 rounded text-slate-400 border border-slate-700 dark:border-slate-800">
            {t("footer_tech")}
          </p>
        </div>
      </div>
    </footer>
  );
}
