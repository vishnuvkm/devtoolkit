"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import {
  Tool,
  ToolCategory,
  categoryLabels,
} from "@/lib/tools-registry";

interface HomeToolsGridProps {
  tools: Tool[];
}

const WAVE_LABELS: Record<number, { title: string; badge?: string }> = {
  1: { title: "Popular Tools", badge: "Most searched" },
  2: { title: "More Tools" },
  3: { title: "Networking & More" },
  4: { title: "New — Broad Audience" },
};

// Active pill colours mirror ToolCard category badge colours exactly
const CATEGORY_PILL_ACTIVE: Record<ToolCategory, string> = {
  encoding:   "bg-[#2d1f0a] text-[#f0883e] border-[#f0883e]",
  devops:     "bg-[#0d1f3c] text-[#3b82f6] border-[#3b82f6]",
  networking: "bg-[#0a1f2d] text-[#a5d6ff] border-[#a5d6ff]",
  text:       "bg-[#1a0d2d] text-[#bc8cff] border-[#bc8cff]",
  conversion: "bg-[#0a2d1a] text-[#3fb950] border-[#3fb950]",
  generators: "bg-[#2d2a0a] text-[#d29922] border-[#d29922]",
  math:       "bg-[#2d0a20] text-[#f472b6] border-[#f472b6]",
};

const INACTIVE_PILL =
  "bg-transparent text-[#8b949e] border-[#30363d] hover:border-[#484f58] hover:text-[#e6edf3]";
const ALL_ACTIVE_PILL =
  "bg-[#1e3a5f] text-[#3b82f6] border-[#3b82f6]";

type SortBy = "popular" | "az" | "category";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "az",      label: "A–Z" },
  { value: "category", label: "By Category" },
];

export default function HomeToolsGrid({ tools }: HomeToolsGridProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("popular");

  // All unique categories present in the current tool list, in registry order
  const categories = useMemo(
    () =>
      (Object.keys(categoryLabels) as ToolCategory[]).filter((cat) =>
        tools.some((t) => t.category === cat)
      ),
    [tools]
  );

  const isFiltering = useMemo(
    () => search.trim() !== "" || activeCategory !== "all" || sortBy !== "popular",
    [search, activeCategory, sortBy]
  );

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = tools.filter((t) => {
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.targetKeyword.toLowerCase().includes(q) ||
        categoryLabels[t.category].toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "all" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      result = [...result].sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      );
    } else {
      // "popular" — Wave 1 first (highest search-volume tools)
      result = [...result].sort((a, b) => a.wave - b.wave);
    }
    return result;
  }, [tools, search, activeCategory, sortBy]);

  // Wave-grouped map for the default (no filter) view
  const byWave = useMemo(() => {
    const waves = new Map<number, Tool[]>();
    for (const t of tools) {
      if (!waves.has(t.wave)) waves.set(t.wave, []);
      waves.get(t.wave)!.push(t);
    }
    return waves;
  }, [tools]);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Most Popular";

  function clearFilters() {
    setSearch("");
    setActiveCategory("all");
  }

  return (
    <div>
      {/* ── Search + Sort Row ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#484f58]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools…"
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] pl-9 pr-9 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#8b949e] transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden text-xs text-[#8b949e] sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-xs text-[#e6edf3] focus:border-[#3b82f6] focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            activeCategory === "all" ? ALL_ACTIVE_PILL : INACTIVE_PILL
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? "all" : cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                isActive ? CATEGORY_PILL_ACTIVE[cat] : INACTIVE_PILL
              }`}
            >
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      {/* ── Grid ── */}
      {isFiltering ? (
        /* Filtered flat view */
        filteredAndSorted.length > 0 ? (
          <div>
            <p className="mb-4 text-xs text-[#484f58]">
              {filteredAndSorted.length}{" "}
              {filteredAndSorted.length === 1 ? "tool" : "tools"} · sorted by{" "}
              {sortLabel}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSorted.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-lg border border-[#30363d] bg-[#161b22] py-16 text-center">
            <Search className="mb-3 h-8 w-8 text-[#484f58]" />
            <p className="text-sm text-[#8b949e]">
              No tools match{" "}
              {search ? (
                <>
                  &ldquo;
                  <span className="text-[#e6edf3]">{search}</span>
                  &rdquo;
                </>
              ) : (
                "your filters"
              )}
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-md border border-[#30363d] px-4 py-1.5 text-xs text-[#8b949e] transition-colors hover:border-[#484f58] hover:text-[#e6edf3]"
            >
              Clear filters
            </button>
          </div>
        )
      ) : (
        /* Default: wave-sectioned view */
        <div className="space-y-12">
          {[...byWave.entries()]
            .sort(([a], [b]) => a - b)
            .map(([wave, waveTools]) => {
              const label = WAVE_LABELS[wave];
              return (
                <section key={wave}>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#484f58]">
                      {label?.title ?? `Wave ${wave}`}
                    </h2>
                    {label?.badge && (
                      <span className="rounded-full border border-[#30363d] bg-[#1c2128] px-2 py-0.5 text-xs text-[#484f58]">
                        {label.badge}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {waveTools.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}
    </div>
  );
}
