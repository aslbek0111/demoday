import { Suspense } from "react";
import PlacesContent from "../places/PlacesContent";

export const metadata = {
  title: "Barcha Joylar | JoyBand Platformasi",
  description: "Platformadagi barcha joylar ro'yxati",
};

export default function BarchaPage() {
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
      <PlacesContent />
    </Suspense>
  );
}
