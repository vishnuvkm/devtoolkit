import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DaysBetweenDatesTool from "./DaysBetweenDatesTool";

export const metadata: Metadata = {
  title: "Days Between Dates Calculator — Free Online Tool | DevTools Kit",
  description:
    "Calculate the exact number of days between two dates. Shows working days, weekends, total weeks, and a human-readable breakdown. Free, instant, browser-based.",
};

export default function DaysBetweenDatesPage() {
  return (
    <ToolLayout slug="days-between-dates">
      <DaysBetweenDatesTool />
    </ToolLayout>
  );
}
