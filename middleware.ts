import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets, the redirect endpoint (kept
     * lean/fast on purpose), and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|r/).*)",
  ],
};
