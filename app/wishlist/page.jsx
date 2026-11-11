import { Suspense } from "react";
import WishlistContent from "./WishlistContent";

export const metadata = {
  title: "Saqlangan Joylar (Sevimlilar) | JoyBand",
  description: "Siz saqlagan va yoqtirgan sevimli joylaringiz ro'yxati",
};

export default function WishlistPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-medium text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>Yuklanmoqda...</span>
          </div>
        </div>
      }
    >
      <WishlistContent />
    </Suspense>
  );
}
