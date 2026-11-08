import { Suspense } from "react";
import BookingContent from "./BookingContent";

export const metadata = {
  title: "Joyni Band Qilish | JoyBand Platformasi",
  description: "Turli joylarni onlayn qidirish va oldindan band qilish xizmati",
};

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-medium text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
            <span>Yuklanmoqda...</span>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
