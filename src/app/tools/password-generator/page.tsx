import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PasswordGeneratorTool from "./PasswordGeneratorTool";

export const metadata: Metadata = {
  title: "Password Generator — Free Secure Random Password Generator | DevTools Kit",
  description:
    "Generate strong, secure, random passwords instantly. Customize length, character types, and exclude ambiguous characters. 100% client-side, never sent to any server.",
  keywords: [
    "password generator",
    "secure password generator",
    "random password generator",
    "strong password generator",
    "password creator",
  ],
};

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout
      slug="password-generator"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            About This Password Generator
          </h2>
          <p>
            All passwords are generated entirely in your browser using the{" "}
            <code className="rounded bg-[#1c2128] px-1 py-0.5 text-xs text-[#e6edf3]">
              crypto.getRandomValues()
            </code>{" "}
            API — a cryptographically secure random number generator. Your
            passwords are <strong>never sent to any server</strong>.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">
                Password Length
              </h3>
              <p>
                A minimum of 12–16 characters is recommended for most accounts.
                For high-security accounts (banking, email), use 20+ characters.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">
                Entropy &amp; Strength
              </h3>
              <p>
                Password strength is measured in entropy bits. 60+ bits is
                generally considered good. 100+ bits is very strong and
                resistant to brute-force attacks.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">
                Exclude Ambiguous Characters
              </h3>
              <p>
                Enabling this removes characters like{" "}
                <code className="rounded bg-[#1c2128] px-1 py-0.5 text-xs text-[#e6edf3]">
                  0 O I l 1
                </code>{" "}
                that look similar, making passwords easier to read and type
                manually.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-[#e6edf3]">Bulk Generate</h3>
              <p>
                Need multiple passwords at once? Use the bulk generator to
                create up to 20 unique passwords in a single click — useful for
                provisioning multiple accounts.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <PasswordGeneratorTool />
    </ToolLayout>
  );
}
