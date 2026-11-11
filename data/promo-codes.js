// Promo Codes data and validation service for BookSpace (JoyBand)

export const demoPromoCodes = [
  {
    id: "promo-1",
    code: "JOYBAND20",
    description: "Barcha joylar uchun 20% maxsus chegirma",
    descriptionRu: "Специальная скидка 20% на все бронирования",
    discountType: "percent",
    discountValue: 20,
    minBookingAmount: 100000,
    maxDiscountAmount: 200000,
    validUntil: "2027-12-31T23:59:59Z",
    isActive: true,
    applicableCategories: null, // Barchasi uchun
  },
  {
    id: "promo-2",
    code: "WELCOME10",
    description: "Yangi foydalanuvchilar uchun 10% qutlov chegirmasi",
    descriptionRu: "Приветственная скидка 10% для новых пользователей",
    discountType: "percent",
    discountValue: 10,
    minBookingAmount: 50000,
    maxDiscountAmount: 100000,
    validUntil: "2027-12-31T23:59:59Z",
    isActive: true,
    applicableCategories: null,
  },
  {
    id: "promo-3",
    code: "BAHOR50",
    description: "50 000 so'm qat'iy chegirma",
    descriptionRu: "Фиксированная скидка 50 000 сум",
    discountType: "fixed",
    discountValue: 50000,
    minBookingAmount: 250000,
    maxDiscountAmount: null,
    validUntil: "2027-06-30T23:59:59Z",
    isActive: true,
    applicableCategories: null,
  },
  {
    id: "promo-4",
    code: "DACHA100",
    description: "Dachalar va dam olish maskanlari uchun 100 000 so'm chegirma",
    descriptionRu: "Скидка 100 000 сум на дачи и зоны отдыха",
    discountType: "fixed",
    discountValue: 100000,
    minBookingAmount: 1000000,
    maxDiscountAmount: null,
    validUntil: "2027-12-31T23:59:59Z",
    isActive: true,
    applicableCategories: ["resort"], // Faqat dacha va resort
  },
  {
    id: "promo-5",
    code: "SPORT15",
    description: "Sport maydonlari uchun 15% chegirma",
    descriptionRu: "Скидка 15% на спортивные площадки",
    discountType: "percent",
    discountValue: 15,
    minBookingAmount: 150000,
    maxDiscountAmount: 150000,
    validUntil: "2027-12-31T23:59:59Z",
    isActive: true,
    applicableCategories: ["sport"],
  },
];

/**
 * Promokodni tekshirish va chegirma hisoblash funksiyasi
 */
export function validatePromoCode({ code, totalPrice, categoryKey }) {
  if (!code || typeof code !== "string") {
    return { valid: false, errorKey: "promo_enter_code" };
  }

  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, errorKey: "promo_enter_code" };
  }

  // Demo bazadan izlash
  const promo = demoPromoCodes.find((p) => p.code === cleanCode);

  if (!promo) {
    return { valid: false, errorKey: "promo_invalid" };
  }

  if (!promo.isActive) {
    return { valid: false, errorKey: "promo_inactive" };
  }

  // Amal qilish muddatini tekshirish
  if (promo.validUntil && new Date(promo.validUntil) < new Date()) {
    return { valid: false, errorKey: "promo_expired" };
  }

  // Toifani tekshirish
  if (
    promo.applicableCategories &&
    promo.applicableCategories.length > 0 &&
    categoryKey &&
    !promo.applicableCategories.includes(categoryKey)
  ) {
    return { valid: false, errorKey: "promo_category_mismatch" };
  }

  // Minimal summani tekshirish
  const subtotal = Number(totalPrice) || 0;
  if (promo.minBookingAmount && subtotal < promo.minBookingAmount) {
    return {
      valid: false,
      errorKey: "promo_min_amount",
      minAmount: promo.minBookingAmount,
    };
  }

  // Chegirmani hisoblash
  let discountAmount = 0;
  if (promo.discountType === "percent") {
    discountAmount = Math.round((subtotal * promo.discountValue) / 100);
    if (promo.maxDiscountAmount && discountAmount > promo.maxDiscountAmount) {
      discountAmount = promo.maxDiscountAmount;
    }
  } else if (promo.discountType === "fixed") {
    discountAmount = Math.min(promo.discountValue, subtotal);
  }

  const finalPrice = Math.max(0, subtotal - discountAmount);

  return {
    valid: true,
    code: promo.code,
    description: promo.description,
    descriptionRu: promo.descriptionRu,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    discountAmount,
    finalPrice,
  };
}
