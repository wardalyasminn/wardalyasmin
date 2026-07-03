"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, TranslationKey } from "@/lib/translations";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
    toggleLanguage: () => void;
      t: (key: TranslationKey) => string;
        dir: "rtl" | "ltr";
        }

        const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
        const STORAGE_KEY = "wardalyasmin_lang";

        export function LanguageProvider({ children }: { children: ReactNode }) {
          const [language, setLanguage] = useState<Language>("ar");
            const [isLoaded, setIsLoaded] = useState(false);

              useEffect(() => {
                  try {
                        const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
                              if (saved === "ar" || saved === "en") setLanguage(saved);
                                  } catch (e) {
                                        console.error("فشل تحميل إعداد اللغة", e);
                                            }
                                                setIsLoaded(true);
                                                  }, []);

                                                    useEffect(() => {
                                                        if (!isLoaded) return;
                                                            localStorage.setItem(STORAGE_KEY, language);
                                                                document.documentElement.lang = language;
                                                                    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
                                                                      }, [language, isLoaded]);

                                                                        const toggleLanguage = () => setLanguage((prev) => (prev === "ar" ? "en" : "ar"));

                                                                          const t = (key: TranslationKey) => translations[language][key] ?? key;

                                                                            const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";

                                                                              return (
                                                                                  <LanguageContext.Provider value={{ language, toggleLanguage, t, dir }}>
                                                                                        {children}
                                                                                            </LanguageContext.Provider>
                                                                                              );
                                                                                              }

                                                                                              export function useLanguage() {
                                                                                                const context = useContext(LanguageContext);
                                                                                                  if (!context) throw new Error("useLanguage لازم يستخدم داخل LanguageProvider");
                                                                                                    return context;
                                                                                                    }