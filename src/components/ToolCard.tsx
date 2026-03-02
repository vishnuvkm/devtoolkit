import Link from "next/link";
import {
  Clock,
  ArrowLeftRight,
  KeyRound,
  FileCode,
  SearchCode,
  ShieldCheck,
  Hash,
  Fingerprint,
  Link as LinkIcon,
  Calendar,
  Globe,
  Network,
  Palette,
  LucideIcon,
} from "lucide-react";
import { Tool, categoryLabels } from "@/lib/tools-registry";

const iconMap: Record<string, LucideIcon> = {
  Clock,
  ArrowLeftRight,
  KeyRound,
  FileCode,
  SearchCode,
  ShieldCheck,
  Hash,
  Fingerprint,
  Link: LinkIcon,
  Calendar,
  Globe,
  Network,
  Palette,
};

const categoryColors: Record<string, string> = {
  encoding: "text-[#f0883e] bg-[#2d1f0a]",
  devops: "text-[#3b82f6] bg-[#0d2145]",
  networking: "text-[#a5d6ff] bg-[#0d1e35]",
  text: "text-[#bc8cff] bg-[#1e0d35]",
  conversion: "text-[#3fb950] bg-[#0d2a1a]",
  generators: "text-[#d29922] bg-[#2a1f0d]",
};

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = iconMap[tool.icon] ?? FileCode;
  const categoryStyle =
    categoryColors[tool.category] ?? "text-[#8b949e] bg-[#1c2128]";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-lg border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#3b82f6]/50 hover:bg-[#1c2128] hover:shadow-lg hover:shadow-[#3b82f6]/5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1c2128] border border-[#30363d] group-hover:border-[#3b82f6]/30 transition-colors">
          <Icon className="h-4 w-4 text-[#3b82f6]" />
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyle}`}
        >
          {categoryLabels[tool.category]}
        </span>
      </div>

      <h2 className="text-sm font-semibold text-[#e6edf3] mb-1.5 group-hover:text-white transition-colors">
        {tool.name}
      </h2>
      <p className="text-xs text-[#8b949e] leading-relaxed flex-1">
        {tool.description}
      </p>

      <div className="mt-3 text-xs text-[#3b82f6] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool →
      </div>
    </Link>
  );
}
