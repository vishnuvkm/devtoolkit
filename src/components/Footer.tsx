import Link from "next/link";
import { Wrench } from "lucide-react";
import { tools } from "@/lib/tools-registry";

export default function Footer() {
  const wave1Tools = tools.filter((t) => t.wave === 1);
  const wave2Tools = tools.filter((t) => t.wave === 2);

  return (
    <footer className="border-t border-[#30363d] bg-[#161b22] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-[#e6edf3] hover:text-[#3b82f6] transition-colors mb-3"
            >
              <Wrench className="h-4 w-4 text-[#3b82f6]" />
              <span className="font-semibold">DevTools Kit</span>
            </Link>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Fast, free, client-side tools for developers and DevOps engineers.
              No signup. No tracking. Just tools.
            </p>
          </div>

          {/* Wave 1 Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#484f58] mb-3">
              Popular Tools
            </h3>
            <ul className="space-y-1.5">
              {wave1Tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wave 2 Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#484f58] mb-3">
              More Tools
            </h3>
            <ul className="space-y-1.5">
              {wave2Tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#484f58] mb-3">
              Site
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#30363d] pt-6 text-center text-xs text-[#484f58]">
          <p>
            © {new Date().getFullYear()} DevTools Kit — All tools run
            client-side. Zero data sent to any server.
          </p>
        </div>
      </div>
    </footer>
  );
}
