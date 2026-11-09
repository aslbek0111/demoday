import { Suspense } from "react";
import MapContent from "./MapContent";

export const metadata = {
  title: "Interaktiv Xarita | JoyBand Platformasi",
  description: "O'zbekistondagi barcha restoranlar, sport maydonlari, dachalar va kovorkinglarni interaktiv xaritada qidiring",
};

export default function MapPage() {
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
      <MapContent />
    </Suspense>
  );
}
