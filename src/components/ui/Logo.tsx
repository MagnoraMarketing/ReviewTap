import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("notranslate inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-900 text-white">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path
            d="M7 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </span>
      ReviewTap
    </span>
  );
}
