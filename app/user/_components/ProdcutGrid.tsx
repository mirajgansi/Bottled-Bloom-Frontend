"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import ProductCard from "@/app/user/_components/Productcard";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import { getAllProduct } from "@/lib/api/product";
import { SkeletonCard } from "./skeletonCard";
import {
  handleToggleFavoriteProduct,
  handleGetFavoritesMe,
} from "@/lib/actions/product-action";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  inStock?: number;
  unit?: string;
  category?: string;

  // optional if backend provides it
  isFavorite?: boolean;
};

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

export default function ProductsGrid({
  title,
  pageSize = 20,
  refreshMs = 0,
  mode = "all",
  initialProducts,
}: {
  title?: string;
  pageSize?: number;
  refreshMs?: number;
  mode?: "all" | "favorites" | "prefetched";
  initialProducts?: Product[];
}) {
  const sp = useSearchParams();

  // used for "all" mode
  const search = sp.get("search") ?? "";
  const category = sp.get("category") ?? "all";

  const [pending, startTransition] = useTransition();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favLoaded, setFavLoaded] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // reset page when filters change
  useEffect(() => setPage(1), [search, category, mode]);

  // ---------- Loaders ----------
  const loadAll = async () =>
    getAllProduct({
      page,
      size: pageSize,
      search: search.trim(),
      category: category === "all" ? undefined : category,
    } as any);

  const loadFavorites = async () => handleGetFavoritesMe();

  const loadPrefetched = async () => ({
    success: true,
    data: initialProducts ?? [],
  });

  // favorites map (source of truth for heart color across all pages)
  const loadFavoritesMap = async () => {
    const res = await handleGetFavoritesMe();
    if (!res?.success) return {};

    const list = (res.data ?? []) as Product[];
    const map: Record<string, boolean> = {};
    for (const p of list) map[p._id] = true;
    return map;
  };

  const normalizeList = (res: any): Product[] => {
    const list =
      (res?.data?.products ??
        res?.data ??
        res?.products ??
        res?.data?.data?.products ??
        []) as Product[];

    return Array.isArray(list) ? list : [];
  };

 const fetchProducts = async () => {
  setLoading(true);
  setError(null);

  try {
    let res: any;

    if (mode === "favorites") res = await loadFavorites();
    else if (mode === "prefetched") res = await loadPrefetched();
    else res = await loadAll();

    const safe = normalizeList(res);
    setProducts(safe);

    // ✅ favorites map is best-effort — its failure must never affect
    // the already-successfully-loaded product list
    if (!favLoaded) {
      try {
        const favMap = await loadFavoritesMap();
        setFavorites(favMap);
      } catch {
        // silently degrade — hearts just won't be pre-filled this load
      } finally {
        setFavLoaded(true);
      }
    }

    setFavorites((prev) => {
      const next = { ...prev };
      if (mode === "favorites") {
        for (const p of safe) next[p._id] = true;
      }
      for (const p of safe) {
        if (typeof p.isFavorite === "boolean") next[p._id] = p.isFavorite;
      }
      return next;
    });
  } catch (e: any) {
    // this catch now only fires for failures in the PRIMARY product fetch
    setError(e?.message || "Failed to load products");
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();

    if (!refreshMs) return;
    const id = setInterval(fetchProducts, refreshMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, refreshMs, search, category, mode, initialProducts]);

  const toggleFavorite = (id: string) => {
    startTransition(async () => {
      const current = favorites[id] ?? false;

      // optimistic
      setFavorites((prev) => ({ ...prev, [id]: !current }));

      // if on favorites page and removing => remove card immediately
      if (mode === "favorites" && current === true) {
        setProducts((cur) => cur.filter((p) => p._id !== id));
      }

      try {
        const res = await handleToggleFavoriteProduct(id);

        if (!res?.success) {
          // revert
          setFavorites((prev) => ({ ...prev, [id]: current }));
          if (mode === "favorites" && current === true) fetchProducts();
          toast.error(res?.message || "Failed to toggle favorite");
          return;
        }

        toast.success(!current ? "Added to favorites" : "Removed from favorites");
      } catch (err: any) {
        setFavorites((prev) => ({ ...prev, [id]: current }));
        if (mode === "favorites" && current === true) fetchProducts();
        toast.error(err?.message || "Failed to toggle favorite");
      }
    });
  };

  const onAddCart = async (p: Product) => {
    if ((p.inStock ?? 0) <= 0) {
      toast.error("Out of stock");
      return;
    }

    try {
      setAdding((prev) => ({ ...prev, [p._id]: true }));

      const res = await handleAddCartItem({
        productId: p._id,
        quantity: 1,
      } as any);

      if (!res?.success) {
        toast.error(res?.message || "Failed to add to cart");
        return;
      }

      toast.success(res.message || "Added to cart");
    } finally {
      setAdding((prev) => ({ ...prev, [p._id]: false }));
    }
  };

  const showSkeleton = loading && products.length === 0;

  return (
    <section className="w-full px-6" style={{ backgroundColor: "var(--bg-primary)" }}>
      {title && (
        <div className="mb-2">
          <h2
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
          >
            {title}
          </h2>

          {mode === "all" && (
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              {search ? (
                <>
                  Search:{" "}
                  <span className="font-medium" style={{ color: "var(--gold-primary)" }}>
                    {search}
                  </span>
                </>
              ) : (
                "All products"
              )}
              {category !== "all" ? (
                <>
                  {" "}
                  • Category:{" "}
                  <span className="font-medium" style={{ color: "var(--gold-primary)" }}>
                    {category}
                  </span>
                </>
              ) : null}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mb-4 text-sm" style={{ color: "#E57373" }}>
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showSkeleton
          ? Array.from({ length: pageSize }).map((_, i) => (
              <SkeletonCard key={i} idx={i} />
            ))
          : products.map((p) => {
              const isFav = favorites[p._id] ?? false;

              return (
                <div key={p._id} className="relative">
                  <ProductCard
                    id={p._id}
                    image={buildImageUrl(p.image)}
                    name={p.name}
                    price={Number(p.price)}
                    unit={p.unit}
                    inStock={p.inStock ?? 0}
                    isFavorite={isFav}
                    onToggleWishlist={() => toggleFavorite(p._id)}
                    onAddToCart={() => onAddCart(p)}
                  />

                  {adding[p._id] && (
                    <div
                      className="absolute inset-0 grid place-items-center rounded-3xl"
                      style={{ backgroundColor: "rgba(15, 11, 8, 0.7)" }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--gold-primary)" }}
                      >
                        Adding…
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {!loading && products.length === 0 && (
        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          {mode === "favorites"
            ? "No favorite products yet."
            : "No products found."}
        </p>
      )}

      {/* Pagination only for all mode */}
      {mode === "all" && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            className="rounded-md px-4 py-2 text-sm transition-colors disabled:opacity-50"
            style={{
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-elevated)",
            }}
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>

          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Page {page}
          </span>

          <button
            className="rounded-md px-4 py-2 text-sm transition-colors disabled:opacity-50"
            style={{
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-elevated)",
            }}
            disabled={loading || products.length < pageSize}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}