"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "reviewtap-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white p-4 shadow-soft">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-xs text-gray-500">
          We only use strictly necessary cookies to keep you logged in and to record anonymous
          review-link scans. No advertising or tracking cookies. See our{" "}
          <Link href="/cookies" className="underline hover:text-gray-700">
            Cookie Policy
          </Link>
          .
        </p>
        <button
          type="button"
          className="btn-primary shrink-0 px-4 py-1.5 text-xs"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "acknowledged");
            setVisible(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
