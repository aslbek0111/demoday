"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { places, getLocalizedPlace, formatPrice } from "../../data/places";
import { validatePromoCode } from "../../data/promo-codes";
import { useLanguage } from "../language-provider";

export default function BookingContent() {
  const searchParams = useSearchParams();
  const initialId = Number(searchParams?.get("id")) || 1;
  const { language, t } = useLanguage();

  // Tanlangan joy
  const [selectedPlaceId, setSelectedPlaceId] = useState(initialId);

  // Form maydonlari
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [durationHours, setDurationHours] = useState(2);
  const [guestCount, setGuestCount] = useState(2);
  const [notes, setNotes] = useState("");

  // Promokod holatlari
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [promoSuccess, setPromoSuccess] = useState(false);

  // Natija holati (Muvaffaqiyatli band qilindi)
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingTicket, setBookingTicket] = useState(null);

  const rawPlace =
    places.find((p) => p.id === Number(selectedPlaceId)) || places[0];
  const currentPlace = getLocalizedPlace(rawPlace, language);

  const durationUnit = currentPlace.categoryKey === "resort" ? t("day_unit") : t("hour_unit");

  // Narxni avtomatik hisoblash
  const subtotal = currentPlace.price * durationHours;

  // Agar promokod qo'llangan bo'lsa, chegirmasini jonli hisoblash
  const currentPromoValidation = appliedPromo
    ? validatePromoCode({
        code: appliedPromo.code,
        totalPrice: subtotal,
        categoryKey: currentPlace.categoryKey,
      })
    : null;

  const discountAmount =
    currentPromoValidation && currentPromoValidation.valid
      ? currentPromoValidation.discountAmount
      : 0;

  const finalPrice = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (codeToApply = null) => {
    const targetCode = typeof codeToApply === "string" ? codeToApply : promoInput;
    setPromoError(null);
    setPromoSuccess(false);

    const res = validatePromoCode({
      code: targetCode,
      totalPrice: subtotal,
      categoryKey: currentPlace.categoryKey,
    });

    if (!res.valid) {
      if (res.errorKey === "promo_min_amount") {
        setPromoError(
          t("promo_min_amount", { amount: formatPrice(res.minAmount, language) })
        );
      } else {
        setPromoError(t(res.errorKey));
      }
      setAppliedPromo(null);
      return;
    }

    setAppliedPromo(res);
    setPromoInput(res.code);
    setPromoSuccess(true);
    setPromoError(null);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
    setPromoSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !date) {
      alert(t("validation_alert"));
      return;
    }

    // Band qilish cheki
    const ticket = {
      // eslint-disable-next-line react-hooks/purity
      orderId: "JB-" + Math.floor(100000 + Math.random() * 900000),
      placeName: currentPlace.name,
      category: currentPlace.category,
      city: currentPlace.city,
      fullName,
      phone,
      date,
      startTime,
      durationHours,
      durationUnit,
      guestCount,
      originalPrice: subtotal,
      discountAmount,
      totalPrice: finalPrice,
      promoCode: appliedPromo?.code || null,
      createdAt: new Date().toLocaleDateString(language === "en" ? "en-US" : "ru-RU"),
    };

    setBookingTicket(ticket);
    setIsSuccess(true);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setBookingTicket(null);
    setFullName("");
    setPhone("+998 ");
    setDate("");
    setNotes("");
    handleRemovePromo();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ortga qaytish va non bo'laklari (Breadcrumbs) */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span>←</span>
              <span>{t("back_to_places")}</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {t("booking_online_badge")}
            </span>
          </div>

          {/* Muvaffaqiyatli buyurtma cheki (Success Modal / Card) */}
          {isSuccess && bookingTicket ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 p-6 sm:p-10 shadow-lg dark:shadow-slate-950/50 max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200 dark:border-emerald-800/70">
                ✓
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                {t("success_badge")}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3 mb-2">
                {t("success_title")}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
                {t("success_desc_1")}{" "}
                <strong className="text-slate-900 dark:text-white">{bookingTicket.fullName}</strong>
                , {t("success_desc_2")}{" "}
                <strong className="text-slate-900 dark:text-white">{bookingTicket.phone}</strong>{" "}
                {t("success_desc_3")}
              </p>

              {/* Chek kartasi */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-left mb-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs">{t("ticket_order_id")}</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    #{bookingTicket.orderId}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs">{t("ticket_place_name")}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-right">
                    {bookingTicket.placeName}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs">{t("ticket_date_time")}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {bookingTicket.date} {bookingTicket.startTime} ({bookingTicket.durationHours} {bookingTicket.durationUnit})
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs">{t("ticket_guests")}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {bookingTicket.guestCount} {t("guests_unit")}
                  </span>
                </div>

                {bookingTicket.discountAmount > 0 && (
                  <>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">{t("promo_subtotal")}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 line-through">
                        {formatPrice(bookingTicket.originalPrice, language)} {t("currency")}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <span>🏷️</span>
                        <span>{t("promo_discount_label")} ({bookingTicket.promoCode})</span>
                      </span>
                      <span className="font-bold">
                        -{formatPrice(bookingTicket.discountAmount, language)} {t("currency")}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-1">
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{t("ticket_calculated")}</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {formatPrice(bookingTicket.totalPrice, language)} {t("currency")}
                  </span>
                </div>
              </div>

              {/* Tugmalar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                >
                  {t("book_another")}
                </button>
                <Link
                  href="/"
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl transition-all"
                >
                  {t("return_home")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chap qism: Tanlangan joy ma'lumotlari */}
              <div className="lg:col-span-5 space-y-6">
                {/* Joyni almashtirish selektori */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    {t("select_place_label")}
                  </label>
                  <select
                    value={selectedPlaceId}
                    onChange={(e) => setSelectedPlaceId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {places.map((p) => {
                      const loc = getLocalizedPlace(p, language);
                      return (
                        <option key={p.id} value={p.id}>
                          {loc.name} ({loc.category})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Tanlangan joy kartasi */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="relative h-56 w-full">
                    <img
                      src={currentPlace.image}
                      alt={currentPlace.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full shadow ${currentPlace.badgeColor}`}
                    >
                      {currentPlace.badge}
                    </span>
                    <span className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-800 dark:text-slate-100 text-xs font-bold px-2.5 py-1 rounded-lg shadow border border-slate-200/50 dark:border-slate-700/50">
                      ⭐ {currentPlace.rating} ({currentPlace.reviewsCount} {t("rating_unit")})
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {currentPlace.category}
                      </span>
                      <h1 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                        {currentPlace.name}
                      </h1>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <span>📍</span> {currentPlace.city} ({currentPlace.address})
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentPlace.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block">{t("work_hours")}</span>
                        <strong className="text-slate-700 dark:text-slate-200">{currentPlace.openHours}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block">{t("capacity")}</span>
                        <strong className="text-slate-700 dark:text-slate-200">{currentPlace.capacity}</strong>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        {t("amenities_services")}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPlace.amenities.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between bg-indigo-50/70 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60">
                      <div>
                        <span className="text-xs text-indigo-900 dark:text-indigo-300 font-medium">{t("base_price")}</span>
                        <div className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                          {formatPrice(currentPlace.price, language)} {t("currency")}
                          <span className="text-xs font-normal text-indigo-500 dark:text-indigo-400">
                            {" "}
                            / {currentPlace.priceUnit}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-indigo-600 dark:text-indigo-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md font-semibold border border-indigo-200 dark:border-indigo-800">
                        {t("guaranteed")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* To'lov haqida ma'lumot */}
                <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300">
                    <span>💡</span>
                    <span>{t("payment_title")}</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                    {t("payment_desc")}
                  </p>
                </div>
              </div>

              {/* O'ng qism: Band Qilish Formasi */}
              <div className="lg:col-span-7">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {t("form_step")}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {t("form_title")}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {t("form_subtitle")}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Foydalanuvchi ma'lumotlari */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t("full_name")} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t("full_name_placeholder")}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t("phone_number")} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+998 90 123 45 67"
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Sana va Boshlanish vaqti */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t("booking_date")} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t("start_time")} <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="09:00">09:00 ({t("time_morning")})</option>
                          <option value="11:00">11:00</option>
                          <option value="13:00">13:00 ({t("time_lunch")})</option>
                          <option value="15:00">15:00</option>
                          <option value="17:00">17:00</option>
                          <option value="19:00">19:00 ({t("time_evening")})</option>
                          <option value="21:00">21:00</option>
                        </select>
                      </div>
                    </div>

                    {/* Soatlar soni va Mehmonlar soni */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t("duration")}
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDurationHours(Math.max(1, durationHours - 1))}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-base"
                          >
                            -
                          </button>
                          <div className="flex-1 text-center py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100">
                            {durationHours} {durationUnit}
                          </div>
                          <button
                            type="button"
                            onClick={() => setDurationHours(durationHours + 1)}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-base"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t("guest_count")}
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-base"
                          >
                            -
                          </button>
                          <div className="flex-1 text-center py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100">
                            {guestCount} {t("guests_unit")}
                          </div>
                          <button
                            type="button"
                            onClick={() => setGuestCount(guestCount + 1)}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-base"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Qo'shimcha istaklar */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t("notes")}
                      </label>
                      <textarea
                        rows="3"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t("notes_placeholder")}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      ></textarea>
                    </div>

                    {/* Promokod Bo'limi (Promo Code System) */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span>🏷️</span>
                          <span>{t("promo_code_label")}</span>
                        </label>
                        {!appliedPromo && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{language === "ru" ? "Попробуйте:" : "Masalan:"}</span>
                            <button
                              type="button"
                              onClick={() => handleApplyPromo("JOYBAND20")}
                              className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              JOYBAND20
                            </button>
                            <span>|</span>
                            <button
                              type="button"
                              onClick={() => handleApplyPromo("WELCOME10")}
                              className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              WELCOME10
                            </button>
                          </div>
                        )}
                      </div>

                      {appliedPromo ? (
                        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                              ✓
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-emerald-800 dark:text-emerald-300 tracking-wider">
                                  {appliedPromo.code}
                                </span>
                                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold px-1.5 py-0.2 rounded-md">
                                  {appliedPromo.discountType === "percent"
                                    ? `-${appliedPromo.discountValue}%`
                                    : `-${formatPrice(appliedPromo.discountValue, language)} ${t("currency")}`}
                                </span>
                              </div>
                              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                                {language === "ru" ? appliedPromo.descriptionRu : appliedPromo.description}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-100/50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          >
                            {t("promo_remove_btn")}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => {
                                setPromoInput(e.target.value.toUpperCase());
                                setPromoError(null);
                              }}
                              placeholder={t("promo_code_placeholder")}
                              className="flex-1 uppercase font-mono tracking-wider px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:normal-case placeholder:font-sans placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyPromo()}
                              disabled={!promoInput.trim()}
                              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                              {t("promo_apply_btn")}
                            </button>
                          </div>

                          {promoError && (
                            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                              <span>⚠️</span>
                              <span>{promoError}</span>
                            </p>
                          )}

                          {promoSuccess && (
                            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                              <span>✓</span>
                              <span>{t("promo_applied_success")}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Jonli hisob-kitob (Kalkulyator) */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-300 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>
                          {formatPrice(currentPlace.price, language)} {t("currency")} × {durationHours}{" "}
                          {durationUnit}:
                        </span>
                        <span
                          className={`font-semibold ${
                            discountAmount > 0
                              ? "line-through text-slate-400 dark:text-slate-500"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {formatPrice(subtotal, language)} {t("currency")}
                        </span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <span>🏷️</span>
                            <span>
                              {t("promo_discount_label")} ({appliedPromo?.code})
                            </span>
                          </span>
                          <span>
                            -{formatPrice(discountAmount, language)} {t("currency")}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                        <span>{t("commission_label")}</span>
                        <span className="font-bold">{t("commission_free")}</span>
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {t("total_payment")}
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 block">
                            {formatPrice(finalPrice, language)} {t("currency")}
                          </span>
                          {discountAmount > 0 && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                              {t("promo_savings")} {formatPrice(discountAmount, language)}{" "}
                              {t("currency")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tasdiqlash tugmasi */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <span>{t("confirm_booking")}</span>
                      <span>→</span>
                    </button>

                    <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                      {t("security_notice")}
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
