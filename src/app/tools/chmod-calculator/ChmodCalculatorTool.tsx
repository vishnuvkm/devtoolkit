"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import {
  type GroupPerms,
  type Permissions,
  groupToNumber,
  groupToSymbol,
  parseOctal,
} from "@/lib/chmod";

type PermGroup = "owner" | "group" | "others";
type PermBit = "read" | "write" | "execute";

const DEFAULT_PERMS: Permissions = {
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: true },
  others: { read: true, write: false, execute: true },
};

const BIT_VALUE: Record<PermBit, number> = { read: 4, write: 2, execute: 1 };
const SYMBOL: Record<PermBit, string> = { read: "r", write: "w", execute: "x" };

const PRESETS = [
  { value: "644", desc: "Standard file" },
  { value: "755", desc: "Executable / dir" },
  { value: "600", desc: "Private file" },
  { value: "700", desc: "Owner only" },
  { value: "777", desc: "World-writable" },
  { value: "400", desc: "Read-only" },
];

export default function ChmodCalculatorTool() {
  const [perms, setPerms] = useState<Permissions>(DEFAULT_PERMS);
  const [inputValue, setInputValue] = useState("");

  const numeric = `${groupToNumber(perms.owner)}${groupToNumber(perms.group)}${groupToNumber(perms.others)}`;
  const symbolic = `${groupToSymbol(perms.owner)}${groupToSymbol(perms.group)}${groupToSymbol(perms.others)}`;

  const toggle = (group: PermGroup, bit: PermBit) => {
    setPerms((prev) => ({
      ...prev,
      [group]: { ...prev[group], [bit]: !prev[group][bit] },
    }));
    setInputValue("");
  };

  const applyNumeric = (val: string) => {
    setInputValue(val);
    if (/^[0-7]{3}$/.test(val)) {
      setPerms({
        owner: parseOctal(parseInt(val[0])),
        group: parseOctal(parseInt(val[1])),
        others: parseOctal(parseInt(val[2])),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Output row */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-1.5">
            Numeric
          </label>
          <input
            type="text"
            maxLength={3}
            value={inputValue || numeric}
            onChange={(e) => applyNumeric(e.target.value)}
            className="w-24 rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-center font-mono text-2xl font-bold text-[#3b82f6] focus:outline-none focus:border-[#3b82f6] transition-colors"
            placeholder="755"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#484f58] uppercase tracking-wider mb-1.5">
            Symbolic
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 font-mono text-sm text-[#e6edf3]">
              {symbolic}
            </span>
            <CopyButton text={symbolic} />
          </div>
        </div>

        <div className="ml-auto">
          <CopyButton text={`chmod ${numeric} filename`} label="Copy command" />
        </div>
      </div>

      {/* Permission grid */}
      <div className="overflow-x-auto rounded border border-[#30363d]">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-[#30363d] bg-[#0d1117]">
              <th className="text-left text-xs font-medium text-[#484f58] uppercase tracking-wider py-2.5 px-4 w-28">
                Group
              </th>
              {(["read", "write", "execute"] as PermBit[]).map((bit) => (
                <th
                  key={bit}
                  className="text-center text-xs font-medium text-[#484f58] uppercase tracking-wider py-2.5 px-4"
                >
                  {bit}
                  <span className="ml-1 text-[#484f58]">({BIT_VALUE[bit]})</span>
                </th>
              ))}
              <th className="text-center text-xs font-medium text-[#484f58] uppercase tracking-wider py-2.5 px-4">
                Value
              </th>
              <th className="text-center text-xs font-medium text-[#484f58] uppercase tracking-wider py-2.5 px-4">
                Symbolic
              </th>
            </tr>
          </thead>
          <tbody>
            {(["owner", "group", "others"] as PermGroup[]).map((grp, i) => (
              <tr
                key={grp}
                className={
                  i < 2 ? "border-b border-[#21262d]" : ""
                }
              >
                <td className="py-3 px-4 text-sm font-medium text-[#e6edf3] capitalize">
                  {grp}
                </td>
                {(["read", "write", "execute"] as PermBit[]).map((bit) => (
                  <td key={bit} className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggle(grp, bit)}
                      className={`w-10 h-10 rounded border text-sm font-mono font-bold transition-all ${
                        perms[grp][bit]
                          ? "border-[#3b82f6] bg-[#1e3a5f] text-[#3b82f6]"
                          : "border-[#30363d] bg-[#0d1117] text-[#484f58] hover:border-[#3b82f6]/30 hover:text-[#8b949e]"
                      }`}
                      title={`Toggle ${grp} ${bit}`}
                    >
                      {SYMBOL[bit]}
                    </button>
                  </td>
                ))}
                <td className="py-3 px-4 text-center">
                  <span className="font-mono text-lg font-bold text-[#3b82f6]">
                    {groupToNumber(perms[grp])}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-mono text-sm text-[#e6edf3]">
                    {groupToSymbol(perms[grp])}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick presets */}
      <div>
        <p className="text-xs font-medium text-[#484f58] uppercase tracking-wider mb-2">
          Common Presets
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value + p.desc}
              onClick={() => applyNumeric(p.value)}
              className={`rounded border px-3 py-1.5 text-xs transition-colors ${
                numeric === p.value && !inputValue
                  ? "border-[#3b82f6]/50 bg-[#1e3a5f] text-[#3b82f6]"
                  : "border-[#30363d] bg-[#1c2128] text-[#8b949e] hover:border-[#3b82f6]/30 hover:text-[#e6edf3]"
              }`}
            >
              <span className="font-mono font-bold">{p.value}</span>
              <span className="ml-1.5 text-[#484f58]">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
