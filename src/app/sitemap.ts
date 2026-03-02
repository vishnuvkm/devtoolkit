import { MetadataRoute } from "next";
import { tools } from "@/lib/tools-registry";

const BASE_URL = "https://devtoolkit.dev";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: tool.wave === 1 ? 0.9 : tool.wave === 2 ? 0.8 : 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...toolPages,
  ];
}
