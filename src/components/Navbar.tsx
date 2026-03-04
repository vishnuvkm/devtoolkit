"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Wrench, Github } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Tools" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[#e6edf3] hover:text-[#3b82f6] transition-colors"
        >
          <Wrench className="h-5 w-5 text-[#3b82f6]" />
          <span className="text-lg font-semibold tracking-tight">
            DevTools Kit
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/tools")
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-[#3b82f6] font-medium"
                    : "text-[#8b949e] hover:text-[#e6edf3]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[#8b949e] hover:text-[#e6edf3] transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-[#8b949e] hover:text-[#e6edf3] p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[#30363d] bg-[#161b22] px-4 py-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block py-2 text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
