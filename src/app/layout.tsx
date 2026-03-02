import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "DevTools Kit — Free Online Developer Tools",
    template: "%s | DevTools Kit",
  },
  description:
    "Fast, free, client-side tools for developers and DevOps engineers. Cron generator, JWT decoder, JSON↔YAML converter, Base64, Regex tester, and more. No signup required.",
  keywords: [
    "developer tools",
    "devops tools",
    "online tools",
    "cron generator",
    "jwt decoder",
    "json yaml converter",
    "base64 encoder",
    "regex tester",
  ],
  authors: [{ name: "DevTools Kit" }],
  creator: "DevTools Kit",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevTools Kit",
    title: "DevTools Kit — Free Online Developer Tools",
    description:
      "Fast, free, client-side tools for developers and DevOps engineers. No signup required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTools Kit — Free Online Developer Tools",
    description:
      "Fast, free, client-side tools for developers and DevOps engineers. No signup required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-[#0d1117] text-[#e6edf3]">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
