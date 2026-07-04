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

type FragranceNotes = {
  top?: string[];
  heart?: string[];
  base?: string[];
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  price: number;
  category?: string;
  inStock?: number;
  viewCount?: number;
  brand?: string;
  concentration?: string;
  gender?: string;
  volumeMl?: number;
  fragranceNotes?: FragranceNotes;
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
          }`}
          style={{ color: s <= value ? "var(--gold-primary)" : "var(--border-strong)" }}
          aria-label={`Rate ${s} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function formatConcentration(value?: string) {
  if (!value) return "—";
  return value
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function formatGender(value?: string) {
  if (!value) return "—";
  return value[0].toUpperCase() + value.slice(1);
}

function formatNotes(notes?: string[]) {
  if (!notes || notes.length === 0) return "—";
  return notes.join(", ");
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
  const [myRating, setMyRating] = useState<number>(0);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  // Load comments
  useEffect(() => {
    if (!product?._id) return;

    (async () => {
      const res = await handleGetProductComments(product._id);
      if (res?.success) {
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
          <div
            className="relative aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
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
                  className="h-16 w-20 rounded-xl p-2 transition-colors"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    border: isActive
                      ? "2px solid var(--gold-primary)"
                      : "1px solid var(--border-subtle)",
                  }}
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
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {product.brand ?? "Brand"}
            </p>
            <h1
              className="mt-1 text-2xl font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              {product.name}
            </h1>
            <p className="mt-1.5 text-xl font-bold" style={{ color: "var(--gold-primary)" }}>
              Rs {Number(product.price).toFixed(2)}
              {product.volumeMl ? (
                <span
                  className="ml-1 text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  / {product.volumeMl}ml
                </span>
              ) : null}
            </p>

            {/* Rating row */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Stars value={myRating || Math.round(avgRating)} onChange={onRate} disabled={pending} />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {avgRating.toFixed(1)} ({ratingCount})
                </span>
              </div>
              <button
                className="rounded-full p-2 transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                aria-label="Favorite"
                type="button"
                onClick={onToggleFav}
                disabled={pending}
              >
                <Heart
                  className="h-5 w-5"
                  style={{
                    fill: isFav ? "#C9A15D" : "none",
                    color: isFav ? "#C9A15D" : "var(--text-secondary)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-3"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
          >
            Product details
          </h3>

          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Brand
              </p>
              <p className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                {product.brand ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Concentration
              </p>
              <p className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                {formatConcentration(product.concentration)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Gender
              </p>
              <p className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                {formatGender(product.gender)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Volume
              </p>
              <p className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                {product.volumeMl ? `${product.volumeMl}ml` : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Category
              </p>
              <p className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                {product.category ?? "—"}
              </p>
            </div>
          </div>

          {product.fragranceNotes && (
            <div
              className="mt-4 pt-4"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Fragrance Notes
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs" style={{ color: "var(--gold-primary)" }}>
                    Top
                  </p>
                  <p className="mt-1" style={{ color: "var(--text-primary)" }}>
                    {formatNotes(product.fragranceNotes.top)}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--gold-primary)" }}>
                    Heart
                  </p>
                  <p className="mt-1" style={{ color: "var(--text-primary)" }}>
                    {formatNotes(product.fragranceNotes.heart)}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--gold-primary)" }}>
                    Base
                  </p>
                  <p className="mt-1" style={{ color: "var(--text-primary)" }}>
                    {formatNotes(product.fragranceNotes.base)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
          Description
        </p>

        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {expanded ? fullDescription : shortDescription}

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="ml-2 font-semibold hover:underline"
              style={{ color: "var(--gold-primary)" }}
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </p>

        <hr style={{ borderColor: "var(--border-subtle)" }} />

        {/* Controls row */}
        <div className="grid gap-3 sm:grid-cols-3 items-end">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => clamp(q - 1, 1, 999))}
              className="rounded-full p-2 transition-colors"
              style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
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
              className="no-spinner w-20 rounded-xl px-2 py-2 text-center text-sm font-semibold outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-bright)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
            />

            <button
              type="button"
              onClick={() => setQuantity((q) => clamp(q + 1, 1, 999))}
              className="rounded-full p-2 transition-colors"
              style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Stock badge */}
          <div className="flex items-end">
            {outOfStock ? (
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold"
                style={{ backgroundColor: "rgba(225, 83, 83, 0.12)", color: "#E57373" }}
              >
                <BadgeX className="h-5 w-5" />
                Out of stock
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold"
                style={{ backgroundColor: "rgba(201, 161, 93, 0.12)", color: "var(--gold-primary)" }}
              >
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
            className="w-full sm:w-auto sm:min-w-55 flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            style={
              outOfStock
                ? { backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)", cursor: "not-allowed" }
                : {
                    backgroundColor: "var(--gold-primary)",
                    color: "var(--text-on-gold)",
                    boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
                  }
            }
          >
            {pending ? "Working..." : `Add to Cart Rs ${totalPrice}`}
          </button>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Comments
            </h3>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {comments.length}
            </span>
          </div>

          {/* Add comment */}
          <div className="mt-3 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-bright)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
            />
            <button
              type="button"
              onClick={onAddComment}
              disabled={pending || !commentText.trim()}
              className="rounded-xl px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
            >
              Post
            </button>
          </div>

          {/* Comments list */}
          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                No comments yet.
              </p>
            ) : (
              comments.slice(0, 10).map((c) => (
                <div
                  key={c._id}
                  className="rounded-xl p-3"
                  style={{ backgroundColor: "var(--bg-elevated)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {c.username ?? "User"}
                    </p>

                    <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>

                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {c.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}