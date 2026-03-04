import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import QrCodeGeneratorTool from "./QrCodeGeneratorTool";

export const metadata: Metadata = {
  title: "QR Code Generator — Free Online Tool | DevTools Kit",
  description:
    "Generate QR codes for URLs, text, or any content. Download as PNG or SVG. Choose size and error correction level. Free, no signup, runs in your browser.",
};

export default function QrCodeGeneratorPage() {
  return (
    <ToolLayout slug="qr-code-generator">
      <QrCodeGeneratorTool />
    </ToolLayout>
  );
}
