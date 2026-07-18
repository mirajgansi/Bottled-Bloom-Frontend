"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { PackageX, RotateCcw } from "lucide-react";
import ProductCard from "@/app/user/_components/Productcard";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import { SkeletonCard } from "./skeletonCard";
import {
  handleToggleFavoriteProduct,
  handleGetFavoritesMe,
  handleGetAllProducts,
} from "@/lib/actions/product-action";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  inStock?: number;
  unit?: string;
  category?: string;
  isFavorite?: boolean;
};

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

// Forces any hung/never-resolving request to settle so loading state can never get stuck.
function withTimeout<T>(promise: Promise<T>, ms = 12000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. Please try again.")), ms),
    ),
  ]);
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

  const search = sp.get("search") ?? "";
  const category = sp.get("category") ?? "all";

  const [pending, startTransition] = useTransition();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favLoaded, setFavLoaded] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => setPage(1), [search, category, mode]);

  const loadAll = async () =>
  withTimeout(
    handleGetAllProducts({
      page,
      size: pageSize,
      search: search.trim(),
      category: category === "all" ? undefined : category,
    }),
  );

  const loadFavorites = async () => withTimeout(handleGetFavoritesMe());

  const loadPrefetched = async () => ({
    success: true,
    data: initialProducts ?? [],
  });

  const loadFavoritesMap = async () => {
    const res = await withTimeout(handleGetFavoritesMe());
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

      if (res?.success === false) {
        setError(res?.message || "Failed to load products");
        setProducts([]);
        return;
      }

      const safe = normalizeList(res);
      setProducts(safe);

      // favorites map is best-effort — its failure must never affect
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
      // fires for failures/timeouts in the PRIMARY product fetch only
      setError(e?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
      setHasFetched(true);
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
      setFavorites((prev) => ({ ...prev, [id]: !current }));

      if (mode === "favorites" && current === true) {
        setProducts((cur) => cur.filter((p) => p._id !== id));
      }

      try {
        const res = await handleToggleFavoriteProduct(id);

        if (!res?.success) {
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

  // Skeleton only shows on the very first attempt for the current query.
  // After that, we always land on a definite state — results, empty, or error.
  const showSkeleton = loading && !hasFetched;
  const showEmpty = !loading && hasFetched && !error && products.length === 0;
  const showError = !loading && hasFetched && !!error;

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

      {showSkeleton && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <SkeletonCard key={i} idx={i} />
          ))}
        </div>
      )}

      {!showSkeleton && !showEmpty && !showError && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
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
                    <span className="text-sm font-medium" style={{ color: "var(--gold-primary)" }}>
                      Adding…
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No matching / unavailable products */}
      {showEmpty && (
        <div
          className="mt-10 flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="mb-4 grid h-16 w-16 place-items-center rounded-full"
            style={{ backgroundColor: "rgba(201, 161, 93, 0.12)" }}
          >
            <PackageX className="h-8 w-8" style={{ color: "var(--gold-primary)" }} />
          </div>

          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {mode === "favorites" ? "No favorites yet" : "Product unavailable"}
          </p>

          <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--text-secondary)" }}>
            {mode === "favorites"
              ? "You haven't saved any fragrances yet. Tap the heart on a product to add it here."
              : search
                ? `We couldn't find anything matching "${search}". Try a different name or browse by category instead.`
                : "There are no products available right now. Please check back soon."}
          </p>
        </div>
      )}

      {/* Request failed (timeout, network, server error) */}
      {showError && (
        <div
          className="mt-10 flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid rgba(225, 83, 83, 0.3)",
          }}
        >
          <div
            className="mb-4 grid h-16 w-16 place-items-center rounded-full"
            style={{ backgroundColor: "rgba(225, 83, 83, 0.1)" }}
          >
            <PackageX className="h-8 w-8" style={{ color: "#E57373" }} />
          </div>

          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Something went wrong
          </p>
          <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {/* Pagination only for all mode */}
      {mode === "all" && !showEmpty && !showError && (
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