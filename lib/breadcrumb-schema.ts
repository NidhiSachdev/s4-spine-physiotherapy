const BASE_URL = "https://www.s4spine.com";

export function breadcrumbSchema(
  items: { name: string; path?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        ...(item.path ? { item: `${BASE_URL}${item.path}` } : {}),
      })),
    ],
  };
}
