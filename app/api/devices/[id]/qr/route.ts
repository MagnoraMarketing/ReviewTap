import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQrPngBuffer, generateQrSvg, deviceRedirectUrl } from "@/lib/qr";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS ensures this only returns a row if the caller owns the device (or is an admin).
  const { data: device } = await supabase
    .from("devices")
    .select("public_id")
    .eq("id", params.id)
    .single();

  if (!device) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get("format") === "svg" ? "svg" : "png";
  const download = request.nextUrl.searchParams.get("download") === "1";
  const url = deviceRedirectUrl(device.public_id);
  const filename = `reviewtap-${device.public_id.toLowerCase()}.${format}`;
  const disposition = `${download ? "attachment" : "inline"}; filename="${filename}"`;

  if (format === "svg") {
    const svg = await generateQrSvg(url);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": disposition,
        "Cache-Control": "private, max-age=60",
      },
    });
  }

  const png = await generateQrPngBuffer(url);
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": disposition,
      "Cache-Control": "private, max-age=60",
    },
  });
}
