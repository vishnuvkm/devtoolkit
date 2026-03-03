import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ColorConverterTool from "./ColorConverterTool";

export const metadata: Metadata = {
  title: "Color Converter — HEX, RGB, HSL & Tailwind CSS",
  description:
    "Convert colors between HEX, RGB, and HSL instantly with a live preview. Find the nearest Tailwind CSS color class. Supports color picker. Free, client-side tool.",
  keywords: [
    "hex to rgb converter",
    "rgb to hex",
    "hsl converter",
    "color converter online",
    "tailwind color",
    "css color converter",
    "color picker",
  ],
};

export default function ColorConverterPage() {
  return (
    <ToolLayout
      slug="color-converter"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            Color Formats in CSS
          </h2>
          <p>
            CSS supports several ways to express the same color. Each format has
            its own strengths depending on the use case.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-[#30363d] rounded">
              <thead>
                <tr className="border-b border-[#30363d] bg-[#0d1117]">
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Format</th>
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Example</th>
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Best for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                <tr>
                  <td className="px-3 py-2 font-mono text-[#e6edf3]">HEX</td>
                  <td className="px-3 py-2 font-mono text-[#3b82f6]">#3b82f6</td>
                  <td className="px-3 py-2">Design tools, HTML attributes, compact notation</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-[#e6edf3]">RGB</td>
                  <td className="px-3 py-2 font-mono text-[#3b82f6]">rgb(59, 130, 246)</td>
                  <td className="px-3 py-2">CSS variables, computed channel values</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-[#e6edf3]">HSL</td>
                  <td className="px-3 py-2 font-mono text-[#3b82f6]">hsl(217, 91%, 60%)</td>
                  <td className="px-3 py-2">Human-readable, easy to create color variations</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-[#e6edf3]">Tailwind</td>
                  <td className="px-3 py-2 font-mono text-[#3b82f6]">blue-500</td>
                  <td className="px-3 py-2">Utility-first CSS, design system consistency</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            HSL: More Intuitive Than RGB
          </h3>
          <p>
            HSL stands for <strong className="text-[#e6edf3]">Hue</strong>{" "}
            (0–360°, the color wheel position),{" "}
            <strong className="text-[#e6edf3]">Saturation</strong> (0–100%, how
            vivid), and <strong className="text-[#e6edf3]">Lightness</strong>{" "}
            (0–100%, black to white). Creating a lighter or darker shade is as
            simple as adjusting the L value — much easier than RGB arithmetic.
          </p>
        </div>
      }
    >
      <ColorConverterTool />
    </ToolLayout>
  );
}
