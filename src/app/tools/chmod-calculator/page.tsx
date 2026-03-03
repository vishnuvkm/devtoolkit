import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ChmodCalculatorTool from "./ChmodCalculatorTool";

export const metadata: Metadata = {
  title: "Chmod Calculator — Unix File Permission Calculator",
  description:
    "Calculate Unix file permissions with a visual grid. Click checkboxes for owner/group/other permissions and get the numeric (e.g. 755) and symbolic (rwxr-xr-x) output instantly.",
  keywords: [
    "chmod calculator",
    "unix permissions",
    "file permissions calculator",
    "chmod 755",
    "linux file permissions",
    "chmod symbolic",
  ],
};

export default function ChmodCalculatorPage() {
  return (
    <ToolLayout
      slug="chmod-calculator"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            Understanding Unix File Permissions
          </h2>
          <p>
            Unix permissions control who can read, write, or execute a file.
            They are divided into three groups:{" "}
            <strong className="text-[#e6edf3]">Owner</strong>,{" "}
            <strong className="text-[#e6edf3]">Group</strong>, and{" "}
            <strong className="text-[#e6edf3]">Others</strong>. Each group has
            three permission bits: read (r = 4), write (w = 2), and execute (x
            = 1).
          </p>
          <p>
            The numeric value is the sum of active bits per group. For example,{" "}
            <strong className="text-[#e6edf3]">755</strong> means the owner has
            7 (rwx), group has 5 (r-x), and others have 5 (r-x). This is the
            standard for executables and directories. Use{" "}
            <strong className="text-[#e6edf3]">644</strong> for regular files
            and <strong className="text-[#e6edf3]">600</strong> for private
            files like SSH keys.
          </p>
          <h3 className="text-sm font-semibold text-[#e6edf3]">
            Common chmod values
          </h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <code className="text-[#e6edf3]">644</code> — Standard file
              (owner rw, others r)
            </li>
            <li>
              <code className="text-[#e6edf3]">755</code> — Executable /
              directory (owner rwx, others rx)
            </li>
            <li>
              <code className="text-[#e6edf3]">600</code> — Private file (owner
              rw only)
            </li>
            <li>
              <code className="text-[#e6edf3]">700</code> — Private executable
              (owner rwx only)
            </li>
            <li>
              <code className="text-[#e6edf3]">777</code> — World-writable
              (avoid in production)
            </li>
          </ul>
        </div>
      }
    >
      <ChmodCalculatorTool />
    </ToolLayout>
  );
}
