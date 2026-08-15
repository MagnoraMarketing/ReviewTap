"use client";

export interface SupportedLanguage {
  code: string;
  label: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", label: "English" },
  { code: "da", label: "Dansk" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
];

const COOKIE_NAME = "googtrans";
const DEFAULT_LANGUAGE = "en";

/**
 * Reads the current translation language from the googtrans cookie (the
 * format Google's Website Translator element uses: "/en/<target>"). No
 * cookie, or a target matching the source language, both mean "English".
 */
export function getCurrentLanguage(): string {
  if (typeof document === "undefined") return DEFAULT_LANGUAGE;
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  if (!match) return DEFAULT_LANGUAGE;
  const value = decodeURIComponent(match[1] ?? "");
  const target = value.split("/")[2];
  return target && SUPPORTED_LANGUAGES.some((l) => l.code === target) ? target : DEFAULT_LANGUAGE;
}

/**
 * Sets the googtrans cookie Google's translate widget reads, then nudges
 * its hidden <select> so the page translates without a full reload. Setting
 * the cookie to English removes it instead, since "/en/en" doesn't reliably
 * revert already-translated text.
 */
export function setLanguage(code: string) {
  if (typeof document === "undefined") return;

  if (code === DEFAULT_LANGUAGE) {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
    document.cookie = `${COOKIE_NAME}=; path=/; domain=${window.location.hostname}; max-age=0`;
    window.location.reload();
    return;
  }

  const value = `/${DEFAULT_LANGUAGE}/${code}`;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${oneYear}`;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=${window.location.hostname}; max-age=${oneYear}`;

  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = code;
    select.dispatchEvent(new Event("change"));
  } else {
    // Widget hasn't finished initialising yet - the cookie is already set,
    // so a reload picks it up on the next load.
    window.location.reload();
  }
}

/** Maps a browser locale (e.g. "da-DK") to one of our supported languages, or null if none match. */
export function detectBrowserLanguage(): string | null {
  if (typeof navigator === "undefined") return null;
  const primary = navigator.language?.slice(0, 2).toLowerCase();
  const match = SUPPORTED_LANGUAGES.find((l) => l.code === primary && l.code !== DEFAULT_LANGUAGE);
  return match?.code ?? null;
}

export function hasLanguageCookie(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|; )googtrans=/.test(document.cookie);
}
