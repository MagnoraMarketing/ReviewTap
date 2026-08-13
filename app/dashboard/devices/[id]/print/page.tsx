import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { deviceRedirectUrl, generateQrPngDataUrl } from "@/lib/qr";
import { PrintButton } from "./PrintButton";

export const metadata = { title: "Print QR card" };

export default async function PrintQrPage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(`/login?next=/dashboard/devices/${params.id}/print`);

  const supabase = createClient();
  const { data: device } = await supabase.from("devices").select("*").eq("id", params.id).single();
  if (!device) notFound();

  const url = deviceRedirectUrl(device.public_id);
  const qrDataUrl = await generateQrPngDataUrl(url);

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 print:hidden">
        <Link href={`/dashboard/devices/${device.id}`} className="text-sm text-gray-500 hover:text-ink-900">
          ← Back to device
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto mt-8 flex aspect-[3/4] w-full max-w-sm flex-col items-center justify-center gap-6 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-soft print:aspect-auto print:h-screen print:rounded-none print:border-0 print:shadow-none">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          {device.name}
        </p>
        <h1 className="text-2xl font-semibold text-ink-900">Scan to leave us a review</h1>
        <div className="rounded-2xl border border-gray-100 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="ReviewTap QR code" width={260} height={260} />
        </div>
        <p className="text-xs text-gray-400">Powered by ReviewTap</p>
      </div>
    </div>
  );
}
