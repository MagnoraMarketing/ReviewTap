"use client";

import { useState } from "react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { DESTINATION_LABELS } from "@/lib/display";
import type { DestinationType } from "@/types/database";

/**
 * Each platform opens in a new tab rather than navigating the chooser page
 * away, so a visitor who wants to review a business on several platforms
 * can work through the list one at a time instead of losing the chooser
 * after the first click. Visited state is purely client-side UI feedback
 * (a checkmark) - it never claims a review was actually submitted, matching
 * the rest of the app's "review visits, not confirmed reviews" wording.
 */
export function DestinationChooserList({
  publicId,
  destinations,
}: {
  publicId: string;
  destinations: DestinationType[];
}) {
  const [visited, setVisited] = useState<ReadonlySet<DestinationType>>(new Set());

  return (
    <div className="mt-6 space-y-2">
      {destinations.map((type) => {
        const isVisited = visited.has(type);
        return (
          <a
            key={type}
            href={`/r/${publicId}/go/${type}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setVisited((prev) => new Set(prev).add(type))}
            className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
              isVisited
                ? "border-emerald-200 bg-emerald-50"
                : "border-gray-200 hover:border-brand-500 hover:bg-brand-50"
            }`}
          >
            <span className="flex items-center gap-3">
              <PlatformIcon type={type} />
              <span className="font-medium text-ink-900">{DESTINATION_LABELS[type]}</span>
            </span>
            {isVisited && (
              <span className="text-sm font-medium text-emerald-700" aria-hidden>
                ✓
              </span>
            )}
          </a>
        );
      })}

      {destinations.length > 1 && visited.size > 0 && visited.size < destinations.length && (
        <p className="pt-1 text-xs text-gray-400">
          Thank you! Feel free to leave a review on the other platforms too — each opens in a new
          tab, so this page stays open.
        </p>
      )}
      {destinations.length > 1 && visited.size === destinations.length && (
        <p className="pt-1 text-xs text-emerald-700">Thank you for reviewing us everywhere! 🎉</p>
      )}
    </div>
  );
}
