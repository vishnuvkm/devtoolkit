import QRCode from "qrcode";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrOptions {
  errorCorrectionLevel: ErrorCorrectionLevel;
  size: number; // 128 to 512, step 32
}

export async function generateQrDataUrl(
  text: string,
  options: QrOptions
): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: options.errorCorrectionLevel,
    width: options.size,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });
}

export async function generateQrSvgString(
  text: string,
  options: QrOptions
): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: options.errorCorrectionLevel,
    width: options.size,
    margin: 2,
  });
}

export function isValidQrInput(text: string): boolean {
  return text.trim().length > 0 && text.length <= 4296;
}

export function getCharCount(text: string): number {
  return text.length;
}

export const MAX_QR_CHARS = 4296;
export const ERROR_CORRECTION_LABELS: Record<ErrorCorrectionLevel, string> = {
  L: "Low (7%)",
  M: "Medium (15%)",
  Q: "Quartile (25%)",
  H: "High (30%)",
};
