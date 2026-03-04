import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UnitConverterTool from "./UnitConverterTool";

export const metadata: Metadata = {
  title: "Unit Converter — Free Online Tool | DevTools Kit",
  description:
    "Convert between 60+ units of length, weight, temperature, area, volume, speed, and data instantly. Free, browser-based, no signup.",
};

export default function UnitConverterPage() {
  return (
    <ToolLayout slug="unit-converter">
      <UnitConverterTool />
    </ToolLayout>
  );
}
