import "server-only";
import QRCode from "qrcode";

export async function generateQrPngDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    color: { dark: "#0b0f1a", light: "#ffffff" },
  });
}

export async function generateQrPngBuffer(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 1024,
    color: { dark: "#0b0f1a", light: "#ffffff" },
  });
}

export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: "#0b0f1a", light: "#ffffff" },
  });
}

export function deviceRedirectUrl(publicId: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://reviewtap.app";
  return `${appUrl}/r/${publicId}`;
}
