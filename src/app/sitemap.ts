import type { MetadataRoute } from "next"
import { getProperties } from "@/lib/properties/adapter"
import { siteUrl } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties()
  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/propiedades`, changeFrequency: "daily", priority: 0.9 },
    ...properties.map((p) => ({
      url: `${siteUrl}/propiedades/${p.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]
}
