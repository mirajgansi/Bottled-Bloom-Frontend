        "use client";

        import Image from "next/image";
        import { useEffect, useMemo, useState, useTransition } from "react";
        import { Heart, Share2, Minus, Plus, BadgePercent, BadgeX } from "lucide-react";
        import { useRouter } from "next/navigation";
        import { toast } from "react-toastify";
        import { handleAddCartItem } from "@/lib/actions/cart-action";
        import { handleCreateOrder } from "@/lib/actions/order-action";
        import { handleIncrementProductView } from "@/lib/actions/product-action";
        import {
        handleToggleFavoriteProduct,
        handleRateProduct,
        handleAddProductComment,
        handleGetProductComments,
        } from "@/lib/actions/product-action";

        type Product = {
        _id: string;
        name: string;
        description?: string;
        image?: string;
        images?: string[];
        price: number;
        category?: string;
        inStock?: number;
        unit?: string;
        viewCount?: number;
        manufacturer?: string;
        manufactureDate?: string;
        expireDate?: string;
        averageRating?: number;  
        reviewCount?: number;     
        isFavorite?: boolean;
        };
        type Comment = {
        _id: string;
        comment: string;           
        userId?: string;
        username?: string;
        createdAt?: string;
        };

        function Stars({
        value,
        onChange,
        disabled,
        }: {
        value: number; // 0..5
        onChange: (v: number) => void;
        disabled?: boolean;
        }) {
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={() => onChange(s)}
                className={`text-lg leading-none transition ${
                  disabled ? "cursor-not-allowed opacity-60" : "hover:scale-105"
                } ${s <= value ? "text-yellow-500" : "text-gray-300"}`}
                aria-label={`Rate ${s} star`}
              >
                ★
              </button>
            ))}
          </div>
        );
        }
function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  // Option 1: nice readable (Jan 31, 2026)
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
        export default function ProductDetailClient({
        product,
        images,
        }: {
        product: Product;
        images: string[];
        }) {
        const router = useRouter();
        const [pending, startTransition] = useTransition();

        useEffect(() => {
          if (!product?._id) return;
          handleIncrementProductView(product._id);
        }, [product?._id]);

        const inStock = product.inStock ?? 0;
        const outOfStock = inStock <= 0;

        const safeImages = images?.length ? images : ["/cookie.jpg"];
        const [activeImage, setActiveImage] = useState(safeImages[0]);

        const [quantity, setQuantity] = useState(1);

        const [expanded, setExpanded] = useState(false);
        const DESCRIPTION_LIMIT = 160;
        const fullDescription = product.description || "No description available.";
        const isLong = fullDescription.length > DESCRIPTION_LIMIT;

        const shortDescription = isLong
          ? fullDescription.slice(0, DESCRIPTION_LIMIT) + "..."
          : fullDescription;

        const totalPrice = useMemo(() => {
          const base = Number(product.price || 0);
          return (base * quantity).toFixed(2);
        }, [product.price, quantity]);

        const clamp = (v: number, min: number, max: number) =>
          Math.max(min, Math.min(max, v));

        const [isFav, setIsFav] = useState<boolean>(!!product.isFavorite);
        useEffect(() => {
        setIsFav(!!product.isFavorite);
        }, [product.isFavorite]);

        const initialAvg = Number(product.averageRating ?? 0);
        const [avgRating, setAvgRating] = useState(Number.isFinite(initialAvg) ? initialAvg : 0);

        const [ratingCount, setRatingCount] = useState<number>(
        Number(product.reviewCount ?? 0) || 0
        );
        const [myRating, setMyRating] = useState<number>(0); // if you have "myRating" from backend, set it here


        const [comments, setComments] = useState<Comment[]>([]);
        const [commentText, setCommentText] = useState("");

        // Load comments
        useEffect(() => {
          if (!product?._id) return;

          (async () => {
            const res = await handleGetProductComments(product._id);
            if (res?.success) {
              // backend might return {data: [...] } or {data: {comments:[...]}}
              const list =
                (res?.data?.comments as Comment[]) ??
                (res?.data as Comment[]) ??
                [];
              setComments(list);
            }
          })();
        }, [product?._id]);

        const onToggleFav = () => {
          startTransition(async () => {
            const prev = isFav;
            setIsFav(!prev); // optimistic

            try {
              const res = await handleToggleFavoriteProduct(product._id);
              if (!res?.success) {
                setIsFav(prev);
                toast.error(res?.message || "Failed to toggle favorite");
                return;
              }
              toast.success(!prev ? "Added to favorites" : "Removed from favorites");
              router.refresh();
            } catch (e: any) {
              setIsFav(prev);
              toast.error(e?.message || "Failed to toggle favorite");
            }
          });
        };

        const onRate = (rating: number) => {
          startTransition(async () => {
            setMyRating(rating);

            try {
              const res = await handleRateProduct(product._id, { rating });

              if (!res?.success) {
                toast.error(res?.message || "Failed to rate");
                return;
              }

              const nextAvg = Number(res?.data?.averageRating ?? NaN);
        const nextCount = Number(res?.data?.reviewCount ?? NaN);

        if (Number.isFinite(nextAvg)) setAvgRating(nextAvg);
        if (Number.isFinite(nextCount)) setRatingCount(nextCount);

              toast.success("Thanks for rating!");
              router.refresh();
            } catch (e: any) {
              toast.error(e?.message || "Failed to rate");
            }
          });
        };

        const onAddComment = () => {
          const text = commentText.trim();
          if (!text) return;

          startTransition(async () => {
            try {
              const res = await handleAddProductComment(product._id, { comment: text });

              if (!res?.success) {
                toast.error(res?.message || "Failed to add comment");
                return;
              }

              toast.success("Comment added!");
              setCommentText("");

              const latest = await handleGetProductComments(product._id);
              if (latest?.success) {
                const list =
                  (latest?.data?.comments as Comment[]) ??
                  (latest?.data as Comment[]) ??
                  [];
                setComments(list);
              }

              router.refresh();
            } catch (e: any) {
              toast.error(e?.message || "Failed to add comment");
            }
          });
        };
        const onAddToCart = () => {
          if (outOfStock) return;

          startTransition(async () => {
            try {
              const res = await handleAddCartItem({
                productId: product._id,
                quantity,
              } as any);

              if (res?.success) {
                toast.success("Added to cart!");
                router.refresh();
              } else {
                toast.error(res?.message || "Failed to add to cart");
              }
            } catch (e: any) {
              toast.error(e?.message || "Failed to add to cart");
            }
          });
        };

        const onShopNow = () => {
          if (outOfStock) return;

          startTransition(async () => {
            try {
              const res = await handleCreateOrder({
                items: [{ productId: product._id, quantity }],
              } as any);

              if (res?.success) {
                toast.success("Order created!");
                router.refresh();
              } else {
                toast.error(res?.message || "Failed to create order");
              }
            } catch (e: any) {
              toast.error(e?.message || "Failed to create order");
            }
          });
        };

        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT: Gallery */}
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl bg-gray-50">
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    className="object-contain"
                    unoptimized
                    priority
                  />
                </div>

                <div className="mt-4 flex justify-center gap-2">
                  {safeImages.slice(0, 4).map((img, idx) => {
                    const isActive = img === activeImage;
                    return (
                      <button
                        key={`${img}-${idx}`}
                        type="button"
                        onClick={() => setActiveImage(img)}
                        className={`h-16 w-20 rounded-xl border bg-white p-2 shadow-sm transition ${
                          isActive
                            ? "border-green-500 ring-2 ring-green-200"
                            : "border-transparent hover:border-gray-200"
                        }`}
                      >
                        <div className="relative h-full w-full">
                          <Image
                            src={img}
                            alt="thumb"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                          
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: Details */}
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">
                    {product.category ?? "Category"}
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                    {product.name}
                  </h1>
                  <p className="mt-1.5 text-xl font-bold text-green-600">
                    ${Number(product.price).toFixed(2)}
                    <span className="ml-1 text-sm font-medium text-gray-500">
                      /{product.unit ?? "per kg"}
                    </span>
                  </p>

                  {/* Rating row */}
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Stars value={myRating || Math.round(avgRating)} onChange={onRate} disabled={pending} />
                      <span className="text-xs text-gray-500">
        {avgRating.toFixed(1)} ({ratingCount})
        </span>
                    </div>
                     <button
                    className="rounded-full p-2 hover:bg-gray-100"
                    aria-label="Favorite"
                    type="button"
                    onClick={onToggleFav}
                    disabled={pending}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFav ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </button>
                  </div>
                </div>

               
              </div>

              <div className="rounded-2xl border bg-white p-3 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900">Product details</h3>

                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Manufacturer</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {product.manufacturer ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500">Expiry date</p>
                    <p className="mt-1 font-medium text-gray-900">
  {formatDate(product.expireDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Manufacture date
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
            {formatDate(product.manufactureDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500">Category</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {product.category ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-500">Description</p>

              <p className="text-sm leading-relaxed text-gray-600">
                {expanded ? fullDescription : shortDescription}

                {isLong && (
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="ml-2 font-semibold text-green-600 hover:underline"
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                )}
              </p>

              <hr />

              {/* Controls row */}
              <div className="grid gap-3 sm:grid-cols-3 items-end">
                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => clamp(q - 1, 1, 999))}
                    className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setQuantity(1);
                        return;
                      }
                      const num = Number(value);
                      if (!Number.isFinite(num)) return;
                      setQuantity(clamp(Math.floor(num), 1, 999));
                    }}
                    className="no-spinner w-20 rounded-xl border border-gray-200 bg-white px-2 py-2 text-center text-sm font-semibold shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => clamp(q + 1, 1, 999))}
                    className="rounded-full bg-green-600 p-2 text-white hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Stock badge */}
                <div className="flex items-end">
                  {outOfStock ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-700">
                      <BadgeX className="h-5 w-5" />
                      Out of stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs sm:text-sm font-semibold text-green-700">
                      <BadgePercent className="h-5 w-5" />
                      {inStock}+ in stock
                    </span>
                  )}
                </div>
              </div>

              {/* Buttons row */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onAddToCart}
                  disabled={pending || outOfStock}
                  className={`w-full sm:w-auto sm:min-w-55 flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
                    outOfStock
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {pending ? "Working..." : `Add to Cart $${totalPrice}`}
                </button>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Comments</h3>
                  <span className="text-xs text-gray-500">{comments.length}</span>
                </div>

                {/* Add comment */}
                <div className="mt-3 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />
                  <button
                    type="button"
                    onClick={onAddComment}
                    disabled={pending || !commentText.trim()}
                    className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    Post
                  </button>
                </div>

                {/* Comments list */}
        <div className="mt-4 space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.slice(0, 10).map((c) => (
            <div key={c._id} className="rounded-xl bg-gray-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-gray-700">
                  {c.username ?? "User"}
                </p>

                <p className="text-[11px] text-gray-400">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                </p>
              </div>

              <p className="mt-1 text-sm text-gray-700">{c.comment}</p>
            </div>
          ))
        )}
        </div>
              </div>
            </div>
          </div>
        );
        }