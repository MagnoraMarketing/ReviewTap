import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "gray" | "blue";

const toneClass: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-brand-50 text-brand-700",
};

export function Badge({
  tone = "gray",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("badge", toneClass[tone], className)}>{children}</span>;
}
