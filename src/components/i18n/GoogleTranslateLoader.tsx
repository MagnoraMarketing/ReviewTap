"use client";

import Script from "next/script";
import { useEffect } from "react";
import { detectBrowserLanguage, hasLanguageCookie, setLanguage } from "@/lib/i18n";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string,
        ) => unknown;
      };
    };
  }
}

/**
 * Loads Google's Website Translator in the background on every page (see
 * LanguageSwitcher for the custom-styled control that drives it) and, on a
 * visitor's first visit only, auto-applies their browser language if it's
 * one of the ones we support. Renders nothing visible itself - the widget's
 * own banner/UI is hidden via CSS (see globals.css); the styled dropdown in
 * the header/dashboard is what visitors actually interact with.
 */
export function GoogleTranslateLoader() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,da,es,pt", autoDisplay: false },
        "google_translate_element",
      );

      if (!hasLanguageCookie()) {
        const detected = detectBrowserLanguage();
        if (detected) setLanguage(detected);
      }
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" className="hidden" aria-hidden />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
