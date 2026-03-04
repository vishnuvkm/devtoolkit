import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AgeCalculatorTool from "./AgeCalculatorTool";

export const metadata: Metadata = {
  title: "Age Calculator — Free Online Tool | DevTools Kit",
  description:
    "Calculate your exact age in years, months, and days from any birthdate. See total days lived, weeks, and days until your next birthday. Free, instant, browser-based.",
};

export default function AgeCalculatorPage() {
  return (
    <ToolLayout slug="age-calculator">
      <AgeCalculatorTool />
    </ToolLayout>
  );
}
