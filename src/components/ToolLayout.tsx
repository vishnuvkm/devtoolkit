import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ToolCard from "./ToolCard";
import { getRelatedTools, toolsBySlug } from "@/lib/tools-registry";

interface ToolLayoutProps {
  slug: string;
  children: React.ReactNode;
  /** Override tool title (defaults to registry name) */
  title?: string;
  /** Override tool description (defaults to registry description) */
  description?: string;
  /** Extra content below the tool (e.g. SEO copy) */
  explainer?: React.ReactNode;
}

export default function ToolLayout({
  slug,
  children,
  title,
  description,
  explainer,
}: ToolLayoutProps) {
  const tool = toolsBySlug[slug];
  const relatedTools = getRelatedTools(slug);

  const displayTitle = title ?? tool?.name ?? "Tool";
  const displayDescription = description ?? tool?.description ?? "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Tools
      </Link>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e6edf3] sm:text-3xl mb-2">
          {displayTitle}
        </h1>
        <p className="text-[#8b949e] text-sm sm:text-base max-w-2xl">
          {displayDescription}
        </p>
      </div>

      {/* Tool UI */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 sm:p-6">
        {children}
      </div>

      {/* Explainer / SEO copy */}
      {explainer && (
        <div className="mt-10 prose prose-invert prose-sm max-w-none text-[#8b949e]">
          {explainer}
        </div>
      )}

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58] mb-4">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
