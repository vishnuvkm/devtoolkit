import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JwtDecoderTool from "./JwtDecoderTool";

export const metadata: Metadata = {
  title: "JWT Decoder — Decode JSON Web Tokens Online",
  description:
    "Paste a JWT to instantly decode its header, payload, and signature. See expiry time, issued-at, and all claims in a readable format.",
  keywords: [
    "jwt decoder",
    "decode jwt",
    "json web token decoder",
    "jwt inspector",
    "jwt parser online",
  ],
};

export default function JwtDecoderPage() {
  return (
    <ToolLayout
      slug="jwt-decoder"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            What is a JWT?
          </h2>
          <p>
            A JSON Web Token (JWT) is a compact, URL-safe token format used for
            authentication and information exchange. It consists of three
            Base64URL-encoded sections separated by dots:{" "}
            <strong className="text-[#e6edf3]">Header</strong>,{" "}
            <strong className="text-[#e6edf3]">Payload</strong>, and{" "}
            <strong className="text-[#e6edf3]">Signature</strong>.
          </p>
          <p>
            This tool decodes the header and payload for inspection. The
            signature is not verified — for signature verification you need the
            secret key on your server.
          </p>
          <p className="text-xs text-[#484f58]">
            Note: JWTs may contain sensitive claims. This tool runs entirely in
            your browser — no data is sent anywhere.
          </p>
        </div>
      }
    >
      <JwtDecoderTool />
    </ToolLayout>
  );
}
