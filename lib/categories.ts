export const CATEGORIES = [
  {
    slug: "eau-de-parfum",
    label: "Eau de Parfum",
    description:
      "Long-lasting, high-concentration fragrances for everyday luxury",
  },
  {
    slug: "eau-de-toilette",
    label: "Eau de Toilette",
    description: "Lighter, fresher fragrances perfect for daily wear",
  },
  {
    slug: "attar-oud",
    label: "Attar & Oud",
    description:
      "Traditional alcohol-free attars and rich oud-based fragrances",
  },
  {
    slug: "womens",
    label: "Women's Fragrance",
    description: "Floral, fruity, and oriental scents crafted for women",
  },
  {
    slug: "mens",
    label: "Men's Fragrance",
    description: "Woody, spicy, and fresh scents crafted for men",
  },
  {
    slug: "body-mist",
    label: "Body Mist",
    description: "Light, refreshing sprays for everyday use",
  },
  {
    slug: "gift-sets",
    label: "Gift Sets",
    description: "Curated fragrance sets and gift boxes for every occasion",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
