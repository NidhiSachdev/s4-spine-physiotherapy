import { MetadataRoute } from "next";
import treatmentsData from "@/data/treatments.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://s4spine.com";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/treatments`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Get unique categories
  const categories = [
    ...new Set(
      (treatmentsData as { category: string }[]).map((t) => t.category)
    ),
  ];
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/treatments/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Individual treatment pages
  const treatmentPages = (
    treatmentsData as { category: string; slug: string }[]
  ).map((t) => ({
    url: `${baseUrl}/treatments/${t.category}/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...treatmentPages];
}
