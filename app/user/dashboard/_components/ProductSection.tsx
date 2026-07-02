"use client";

import ProductCard from "@/app/user/_components/Productcard";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { SkeletonCard } from "../../_components/skeletonCard";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import Link from "next/link";

import {
  getAllProduct,
  getProductsByCategory,
  getTopRatedProducts,
} from "@/lib/api/product";

import {
  handleGetPopularProducts,
  handleGetRecentProducts,
  handleGetTrendingProducts,
  handleToggleFavoriteProduct,
  handleGetFavoritesMe,
} from "@/lib/actions/product-action";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  inStock?: number;
};

export type Kind =
  | "recent"
  | "trending"
  | "popular"
  | "topRated"
  | "bestSeller"
  | "seasonal"
  | "category";

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

export default function ProductSection({
  title,
  kind,
  category,
}: {
  title: string;
  kind: Kind;
  category?: string;
}) {
  const SIZE = 4;

  const [pending, startTransition] = useTransition();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favLoaded, setFavLoaded] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await handleGetFavoritesMe();
        if (res?.success) {
          const map: Record<string, boolean> = {};
          for (const p of res.data ?? []) map[p._id] = true;
          setFavorites(map);
        }
      } catch {
        // ignore
      } finally {
        setFavLoaded(true);
      }
    })();
  }, []);

  const toggleFavorite = (id: string) => {
    startTransition(async () => {
      const current = !!favorites[id];

      // optimistic
      setFavorites((prev) => ({ ...prev, [id]: !current }));

      try {
        const res = await handleToggleFavoriteProduct(id);

        if (!res?.success) {
          setFavorites((prev) => ({ ...prev, [id]: current }));
          toast.error(res?.message || "Failed to toggle favorite");
          return;
        }

        toast.success(!current ? "Added to favorites" : "Removed from favorites");
      } catch (e: any) {
        setFavorites((prev) => ({ ...prev, [id]: current }));
        toast.error(e?.message || "Failed to toggle favorite");
      }
    });
  };

  const fetchProducts = async (nextPage = 1) => {
    try {
      setLoading(true);
      setError(null);

      let res: any;

      switch (kind) {
        case "recent":
          res = await handleGetRecentProducts(nextPage, SIZE);
          break;

        case "trending":
        case "bestSeller":
          res = await handleGetTrendingProducts(nextPage, SIZE);
          break;

        case "popular":
          res = await handleGetPopularProducts(nextPage, SIZE);
          break;

        case "topRated":
          res = await getTopRatedProducts(nextPage, SIZE);
          break;

        case "seasonal":
          res = await handleGetRecentProducts(nextPage, SIZE);
          break;

        case "category":
          res = await getProductsByCategory(category || "");
          break;

        default:
          res = await getAllProduct({ page: nextPage, size: SIZE });
          break;
      }

      // normalize
      const list: Product[] =
        res?.data?.products ?? res?.data ?? res?.products ?? [];

      const tp = res?.pagination?.totalPages ?? 1;

      setProducts(Array.isArray(list) ? list : []);
      setTotalPages(tp);
      setPage(nextPage);

      // ✅ if backend provides isFavorite in list, merge it (optional)
      setFavorites((prev) => {
        const next = { ...prev };
        for (const p of list ?? []) {
          if (typeof (p as any).isFavorite === "boolean") {
            next[p._id] = (p as any).isFavorite;
          }
        }
        return next;
      });
    } catch (e: any) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // reset to page 1 when section changes
  useEffect(() => {
    setPage(1);
    setTotalPages(1);
    setProducts([]);
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, category]);

  const onAddCart = async (p: Product) => {
    if ((p.inStock ?? 0) <= 0) {
      toast.error("Out of stock");
      return;
    }

    try {
      setAdding((prev) => ({ ...prev, [p._id]: true }));
      const res = await handleAddCartItem({ productId: p._id, quantity: 1 });

      if (!res?.success) {
        toast.error(res?.message || "Failed to add to cart");
        return;
      }

      toast.success(res.message || "Added to cart");
    } finally {
      setAdding((prev) => ({ ...prev, [p._id]: false }));
    }
  };

  const canLeft = page > 1;
  const canRight = page < totalPages;

  const goLeft = () => {
    if (!canLeft || loading) return;
    fetchProducts(page - 1);
  };

  const goRight = () => {
    if (!canRight || loading) return;
    fetchProducts(page + 1);
  };

  const showSkeleton = loading && products.length === 0;

  return (
    <section className="w-full py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg md:text-xl text-black font-semibold">{title}</h2>

      </div>

      {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

      <div className="relative">
        <button
          onClick={goLeft}
          disabled={!canLeft || loading}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-1.5 hover:bg-gray-100 ${
            !canLeft || loading ? "opacity-40 cursor-not-allowed" : ""
          }`}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={goRight}
          disabled={!canRight || loading}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-1.5 hover:bg-gray-100 ${
            !canRight || loading ? "opacity-40 cursor-not-allowed" : ""
          }`}
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>

        <div className="px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {showSkeleton
              ? Array.from({ length: SIZE }).map((_, i) => (
                  <SkeletonCard key={i} idx={i} />
                ))
              : products.map((p) => (
                  <div key={p._id} className="relative">
                    <ProductCard
                      id={p._id}
                      image={buildImageUrl(p.image)}
                      name={p.name}
                      price={Number(p.price)}
                      inStock={p.inStock ?? 0}
                      isFavorite={!!favorites[p._id]}
                      onToggleWishlist={() => toggleFavorite(p._id)}
                      onAddToCart={() => onAddCart(p)}
                    />

                    {adding[p._id] && (
                      <div className="absolute inset-0 grid place-items-center rounded-3xl bg-white/60">
                        <span className="text-xs font-medium">Adding…</span>
                      </div>
                    )}
                  </div>
                ))}
          </div>

          <div className="mt-3 text-xs text-gray-500 text-center">
            Page {page} of {totalPages}
          </div>
        </div>
      </div>
    </section>
  );
}