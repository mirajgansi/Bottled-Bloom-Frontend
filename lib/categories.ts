export const CATEGORIES = [
  {
    slug: "meat",
    label: "Meat & Fish",
    description: "Fresh meat, poultry, and seafood products",
  },
  {
    slug: "oil",
    label: "Cooking Oil & Ghee",
    description: "Edible oils, ghee, and cooking fats",
  },
  {
    slug: "pulses",
    label: "Pulses",
    description: "Lentils, beans, chickpeas, and dals",
  },
  {
    slug: "bakery",
    label: "Bakery",
    description: "Bread, cakes, biscuits, and baked goods",
  },
  {
    slug: "snacks",
    label: "Snacks",
    description: "Chips, namkeen, instant and ready-to-eat snacks",
  },
  {
    slug: "beverages",
    label: "Beverages",
    description: "Soft drinks, juices, tea, coffee, and water",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
