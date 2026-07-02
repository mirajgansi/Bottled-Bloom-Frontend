"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../../_components/Productcard";

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

export default function CategoryProductsClient({ products }: { products: any[] }) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
const safeProducts = products ?? []; 
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {safeProducts.map((p) => (
        <ProductCard
          key={p._id}
          id={p._id}
          image={buildImageUrl(p.image)}
          name={p.name}
          price={Number(p.price)}
          unit={p.unit ?? "per kg"}
          inStock={Number(p.inStock ?? 0)}
          isFavorite={!!favorites[p._id]}
          onToggleWishlist={() => {
            setFavorites((prev) => ({ ...prev, [p._id]: !prev[p._id] }));
            toast.success("Wishlist updated");
          }}
          onAddToCart={() => {
            // call your cart action here
            toast.success("Added to cart");
          }}
        />
      ))}
    </div>
  );
}
