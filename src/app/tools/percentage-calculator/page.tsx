import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PercentageCalculatorTool from "./PercentageCalculatorTool";

export const metadata: Metadata = {
  title: "Percentage Calculator — Free Online % Calculator | DevTools Kit",
  description:
    "Calculate percentages instantly. Find what X% of a number is, what percentage one number is of another, or calculate % increase and decrease.",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "percentage increase calculator",
    "percentage decrease calculator",
    "what percent of",
    "percentage change calculator",
  ],
};

export default function PercentageCalculatorPage() {
  return (
    <ToolLayout
      slug="percentage-calculator"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            How to Use the Percentage Calculator
          </h2>
          <p>
            This calculator handles the four most common percentage problems in
            one place. No switching between tabs or separate calculators.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">
                What is X% of Y?
              </h3>
              <p>
                Use this to find a percentage of a number. For example:{" "}
                <em>What is 15% of 80?</em> Answer: 12. Useful for calculating
                tips, discounts, and tax amounts.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">
                X is what % of Y?
              </h3>
              <p>
                Use this to find what percentage one number is of another. For
                example: <em>12 is what % of 80?</em> Answer: 15%. Useful for
                grades, progress tracking, and ratios.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">
                Percentage Change
              </h3>
              <p>
                Calculate the percentage increase or decrease between two
                values. For example: <em>from 80 to 96</em> is a 20% increase.
                Useful for growth rates, price changes, and performance metrics.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">
                Add / Subtract a Percentage
              </h3>
              <p>
                Quickly add or remove a percentage from a value. For example:
                adding 20% to 80 gives 96, and subtracting 20% gives 64.
                Perfect for VAT, discounts, and markup calculations.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <PercentageCalculatorTool />
    </ToolLayout>
  );
}
