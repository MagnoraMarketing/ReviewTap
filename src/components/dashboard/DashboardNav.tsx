"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/devices", label: "Devices" },
  { href: "/dashboard/nfc", label: "NFC setup" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-ink-900 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-ink-900",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      {isAdmin && (
        <>
          <div className="my-2 border-t border-gray-200" />
          <Link
            href="/admin"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname?.startsWith("/admin")
                ? "bg-ink-900 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-ink-900",
            )}
          >
            Admin
          </Link>
        </>
      )}
    </nav>
  );
}
