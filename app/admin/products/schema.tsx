import { CATEGORIES, CategorySlug } from "@/lib/categories";
import { z } from "zod";

const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as [
  CategorySlug,
  ...CategorySlug[],
];

const CONCENTRATIONS = [
  "parfum",
  "eau-de-parfum",
  "eau-de-toilette",
  "eau-de-cologne",
  "attar",
] as const;

const GENDERS = ["men", "women", "unisex"] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const ProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),

  brand: z.string().min(1, "Brand is required"),

  category: z.enum(CATEGORY_SLUGS, { message: "Category is required" }),
  concentration: z.enum(CONCENTRATIONS, { message: "Concentration is required" }),
  gender: z.enum(GENDERS, { message: "Gender is required" }),
  volumeMl: z.coerce.number().positive("Volume must be greater than 0"),

  fragranceNotes: z
    .object({
      top: z.array(z.string()).optional(),
      heart: z.array(z.string()).optional(),
      base: z.array(z.string()).optional(),
    })
    .optional(),

  image: z
    .array(z.instanceof(File))
    .min(1, "At least 1 image is required")
    .max(5, "You can upload up to 5 images")
    .refine((files) => files.every((f) => f.size <= MAX_FILE_SIZE), {
      message: "Each image must be max 5MB",
    })
    .refine((files) => files.every((f) => ACCEPTED_IMAGE_TYPES.includes(f.type)), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    })
    .optional(),

  inStock: z.coerce.number().int("Stock must be an integer").min(0).default(0),

  // server stats (should be set by backend usually)
  totalSold: z.number().int().min(0).default(0),
  totalRevenue: z.number().min(0).default(0),
  viewCount: z.number().int().min(0).default(0),

  averageRating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
});

export type ProductData = z.input<typeof ProductSchema>;

export const ProductEditSchema = ProductSchema.partial();
export type ProductEditData = z.input<typeof ProductEditSchema>;