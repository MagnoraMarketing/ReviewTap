"use client";

import { useEffect, useState } from "react";
import { SUPPORTED_LANGUAGES, getCurrentLanguage, setLanguage } from "@/lib/i18n";

/**
 * Custom-styled language dropdown driving Google's Website Translator
 * (see GoogleTranslateLoader). Reads the current language from the
 * googtrans cookie on mount rather than at render time, since that cookie
 * doesn't exist during server rendering.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    setLanguageState(getCurrentLanguage());
  }, []);

  return (
    <select
      aria-label="Language"
      value={language}
      onChange={(e) => {
        setLanguageState(e.target.value);
        setLanguage(e.target.value);
      }}
      className={`notranslate rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-600 hover:border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${className ?? ""}`}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
