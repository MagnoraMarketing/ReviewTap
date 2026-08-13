import type { Metadata, Viewport } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://reviewtap.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "ReviewTap — Turn every customer into a review",
    template: "%s · ReviewTap",
  },
  description:
    "One NFC tap or QR scan sends customers straight to Google, Trustpilot or Tripadvisor. Change the destination anytime from your dashboard — the physical card never changes.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "ReviewTap — Turn every customer into a review",
    description:
      "NFC + QR review cards with a dynamic destination you control from your dashboard.",
    url: appUrl,
    siteName: "ReviewTap",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans">{children}</body>
    </html>
  );
}
