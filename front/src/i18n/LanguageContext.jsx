import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_STORAGE_KEY = "app_language";

const translations = {
  fr: {
    navbar: {
      adminDashboard: "DASHBOARD ADMIN",
      juryGallery: "GALERIE JURY",
      participate: "PARTICIPER",
      logout: "Se déconnecter",
      switchLanguage: "Basculer en anglais",
    },
  },
  en: {
    navbar: {
      adminDashboard: "ADMIN DASHBOARD",
      juryGallery: "JURY GALLERY",
      participate: "PARTICIPATE",
      logout: "Log out",
      switchLanguage: "Switch to French",
    },
  },
};

const LanguageContext = createContext(null);

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage === "fr" || storedLanguage === "en") {
    return storedLanguage;
  }

  return "fr";
}

function findTranslation(language, keyPath) {
  return keyPath.split(".").reduce((current, chunk) => current?.[chunk], translations[language]);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const updateLanguage = (nextLanguage) => {
    const normalizedLanguage = nextLanguage === "en" ? "en" : "fr";
    setLanguage(normalizedLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  };

  const toggleLanguage = () => {
    updateLanguage(language === "fr" ? "en" : "fr");
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: updateLanguage,
      toggleLanguage,
      t: (keyPath, fallback = "") => findTranslation(language, keyPath) || fallback,
      tr: (frText, enText) => (language === "en" ? enText : frText),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
