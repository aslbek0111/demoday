"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./language-provider";
import { WishlistProvider } from "./wishlist-provider";
import { LocationProvider } from "./location-provider";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <LanguageProvider>
        <WishlistProvider>
          <LocationProvider>
            {children}
          </LocationProvider>
        </WishlistProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}