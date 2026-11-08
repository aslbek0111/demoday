import { Suspense } from "react";
import PlacesContent from "./PlacesContent";

export const metadata = {
  title: "Barcha Joylar Katalogi | JoyBand Platformasi",
  description: "Platformadagi barcha restoranlar, sport maydonlari, dacha va kovorking joylari katalogi",
};

export default function PlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-medium text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
            <span>Joylar katalogi yuklanmoqda...</span>
          </div>
        </div>
      }
    >
      <PlacesContent />
    </Suspense>
  );
}
