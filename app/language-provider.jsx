"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { translations } from "./translations";

const LanguageContext = createContext({
  language: "uz",
  changeLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("uz");

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage && (savedLanguage === "uz" || savedLanguage === "ru" || savedLanguage === "en")) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguage(savedLanguage);
      }
    } catch {
      // ignore localStorage errors in restricted environments
    }
  }, []);

  const changeLanguage = (lang) => {
    if (lang === "uz" || lang === "ru" || lang === "en") {
      setLanguage(lang);
      try {
        localStorage.setItem("language", lang);
      } catch {
        // ignore storage errors
      }
    }
  };

  const t = (key, params) => {
    if (!key) return "";
    const currentDict = translations[language] || translations.uz;
    let text = currentDict[key] ?? translations.uz[key] ?? key;

    if (params && typeof params === "object") {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), params[paramKey]);
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{ language, changeLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "uz",
      changeLanguage: () => {},
      t: (key) => translations.uz?.[key] || key,
    };
  }
  return context;
}
