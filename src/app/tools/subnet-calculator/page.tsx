import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SubnetCalculatorTool from "./SubnetCalculatorTool";

export const metadata: Metadata = {
  title: "Subnet Calculator / CIDR — Network Range & Host Calculator",
  description:
    "Calculate subnet network address, broadcast address, usable host range, and total hosts from CIDR notation. Free, instant, client-side subnet calculator.",
  keywords: [
    "subnet calculator",
    "cidr calculator",
    "ip subnet calculator",
    "network address calculator",
    "subnet mask calculator",
    "cidr notation",
    "usable hosts calculator",
  ],
};

export default function SubnetCalculatorPage() {
  return (
    <ToolLayout
      slug="subnet-calculator"
      explainer={
        <div className="space-y-4 text-sm text-[#8b949e]">
          <h2 className="text-base font-semibold text-[#e6edf3]">
            Understanding CIDR Notation
          </h2>
          <p>
            CIDR (Classless Inter-Domain Routing) notation expresses an IP
            address and its routing prefix as a single string. For example,{" "}
            <code className="text-[#e6edf3]">192.168.1.0/24</code> means the
            first 24 bits are the network portion, leaving 8 bits for host
            addresses.
          </p>
          <h3 className="text-sm font-semibold text-[#e6edf3]">Common Subnet Sizes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-[#30363d] rounded">
              <thead>
                <tr className="border-b border-[#30363d] bg-[#0d1117]">
                  <th className="text-left px-3 py-2 text-[#e6edf3]">CIDR</th>
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Mask</th>
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Usable Hosts</th>
                  <th className="text-left px-3 py-2 text-[#e6edf3]">Common Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {[
                  ["/8", "255.0.0.0", "16,777,214", "Class A — large ISP / enterprise"],
                  ["/16", "255.255.0.0", "65,534", "Class B — mid-size network"],
                  ["/24", "255.255.255.0", "254", "Class C — typical LAN / VPC subnet"],
                  ["/28", "255.255.255.240", "14", "Small subnet — cloud security groups"],
                  ["/30", "255.255.255.252", "2", "Point-to-point links"],
                  ["/31", "255.255.255.254", "2", "P2P (RFC 3021, no broadcast)"],
                  ["/32", "255.255.255.255", "1", "Single host / loopback"],
                ].map(([cidr, mask, hosts, use]) => (
                  <tr key={cidr}>
                    <td className="px-3 py-2 font-mono text-[#3b82f6]">{cidr}</td>
                    <td className="px-3 py-2 font-mono text-[#e6edf3]">{mask}</td>
                    <td className="px-3 py-2 text-[#e6edf3]">{hosts}</td>
                    <td className="px-3 py-2">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-sm font-semibold text-[#e6edf3]">Private IP Ranges</h3>
          <p>
            RFC 1918 defines three private address ranges not routable on the
            public internet:{" "}
            <code className="text-[#e6edf3]">10.0.0.0/8</code>,{" "}
            <code className="text-[#e6edf3]">172.16.0.0/12</code>, and{" "}
            <code className="text-[#e6edf3]">192.168.0.0/16</code>. These are
            commonly used in LANs, VPCs, and Docker networks.
          </p>
        </div>
      }
    >
      <SubnetCalculatorTool />
    </ToolLayout>
  );
}
