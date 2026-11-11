"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const STORAGE_KEY = "bookspace_wishlist";

const WishlistContext = createContext({
  wishlist: [],
  wishlistCount: 0,
  isMounted: false,
  isInWishlist: () => false,
  toggleWishlist: () => {},
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  clearWishlist: () => {},
  toast: null,
});

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast ko'rsatish funksiyasi
  const showToast = useCallback((message, type = "info") => {
    setToast({ id: Date.now(), message, type });
  }, []);

  // Toast avtomatik yo'qolishi
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  // Dastlabki localStorage o'qish (Hydration xatolarini oldini oladi)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Duplikatlarni olib tashlash va faqat to'g'ri id larni saqlash
          const uniqueIds = Array.from(
            new Set(parsed.map((id) => Number(id)).filter((id) => !isNaN(id)))
          );
          setWishlist(uniqueIds);
        }
      }
    } catch (e) {
      console.warn("Failed to read wishlist from localStorage:", e);
    }
  }, []);

  // localStorage ga yozish funksiyasi
  const saveToStorage = useCallback((newList) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.warn("Failed to save wishlist to localStorage:", e);
    }
  }, []);

  // Brauzer tablari o'rtasida sinxronizatsiya
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(parsed)) {
            const uniqueIds = Array.from(
              new Set(parsed.map((id) => Number(id)).filter((id) => !isNaN(id)))
            );
            setWishlist(uniqueIds);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isInWishlist = useCallback(
    (id) => {
      const numId = Number(id);
      return wishlist.includes(numId);
    },
    [wishlist]
  );

  const addToWishlist = useCallback(
    (id, placeName = "") => {
      const numId = Number(id);
      if (isNaN(numId)) return;

      setWishlist((prev) => {
        if (prev.includes(numId)) return prev;
        const next = [numId, ...prev];
        saveToStorage(next);
        return next;
      });

      showToast(
        placeName
          ? `"${placeName}" sevimlilarga qo'shildi ❤️`
          : "Joy sevimlilarga qo'shildi ❤️",
        "added"
      );
    },
    [saveToStorage, showToast]
  );

  const removeFromWishlist = useCallback(
    (id, placeName = "") => {
      const numId = Number(id);
      setWishlist((prev) => {
        const next = prev.filter((item) => item !== numId);
        saveToStorage(next);
        return next;
      });

      showToast(
        placeName
          ? `"${placeName}" sevimlilardan o'chirildi`
          : "Joy sevimlilardan o'chirildi",
        "removed"
      );
    },
    [saveToStorage, showToast]
  );

  const toggleWishlist = useCallback(
    (id, placeName = "") => {
      const numId = Number(id);
      if (isNaN(numId)) return;

      if (wishlist.includes(numId)) {
        removeFromWishlist(numId, placeName);
      } else {
        addToWishlist(numId, placeName);
      }
    },
    [wishlist, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    saveToStorage([]);
    showToast("Barcha saqlangan joylar o'chirildi", "info");
  }, [saveToStorage, showToast]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isMounted,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        toast,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold">
            <span className="text-base">
              {toast.type === "added" ? "💖" : toast.type === "removed" ? "🗑️" : "ℹ️"}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
