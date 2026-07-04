"use client";

import { BadgePercent, BadgeX, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  image: string;
  name: string;
  price: number;
  unit?: string;
  inStock?: number;
  isFavorite?: boolean;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
};

export default function ProductCard({
  id,
  image,
  name,
  price,
  isFavorite = false,
  unit,
  inStock = 0,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <div
      className="w-full rounded-2xl p-3 relative"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist?.();
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full transition-transform hover:scale-105"
        style={{ backgroundColor: "var(--bg-elevated)" }}
        aria-label="Toggle favorite"
      >
        <Heart
          className="h-5 w-5 transition-colors"
          style={{
            fill: isFavorite ? "#C9A15D" : "none",
            color: isFavorite ? "#C9A15D" : "var(--text-secondary)",
          }}
        />
      </button>

      <Link href={`/user/products/${id}`} className="block">
        {/* Image box */}
        <div
          className="rounded-xl w-full relative overflow-hidden flex items-center justify-center h-24 sm:h-28 md:h-32"
          style={{ backgroundColor: "var(--bg-elevated)" }}
        >
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            className="object-contain p-2"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          />
        </div>

        {/* Badge */}
        {inStock <= 0 ? (
          <div
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{ backgroundColor: "rgba(225, 83, 83, 0.12)", color: "#E57373" }}
          >
            <BadgeX className="h-4 w-4" />
            Out of stock
          </div>
        ) : (
          <div
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{ backgroundColor: "rgba(201, 161, 93, 0.12)", color: "var(--gold-primary)" }}
          >
            <BadgePercent className="h-4 w-4" />
            {inStock} in stock
          </div>
        )}

        {/* Name */}
        <h3
          className="mt-2 text-sm sm:text-base font-semibold line-clamp-2"
          style={{ color: "var(--text-primary)" }}
        >
          {name}
        </h3>
      </Link>

      {/* Price + Cart */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <p
          className="text-sm sm:text-base font-bold whitespace-nowrap"
          style={{ color: "var(--gold-primary)" }}
        >
          Rs {price.toFixed(2)}
          {unit && (
            <span
              className="text-[11px] sm:text-xs font-normal"
              style={{ color: "var(--text-secondary)" }}
            >
              /{unit}
            </span>
          )}
        </p>

        <button
          onClick={onAddToCart}
          disabled={inStock <= 0}
          className="shrink-0 rounded-full p-2 transition-colors"
          style={
            inStock <= 0
              ? { backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)", cursor: "not-allowed" }
              : { backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }
          }
          aria-label="Add to cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={16}
            viewBox="0 0 24 24"
          >
            <circle cx={10.5} cy={19.5} r={1.5} fill="currentColor" />
            <circle cx={17.5} cy={19.5} r={1.5} fill="currentColor" />
            <path
              fill="currentColor"
              d="M13 13h2v-2.99h2.99v-2H15V5.03h-2v2.98h-2.99v2H13z"
            />
            <path
              fill="currentColor"
              d="M10 17h8a1 1 0 0 0 .93-.64L21.76 9h-2.14l-2.31 6h-6.64L6.18 4.23A2 2 0 0 0 4.33 3H2v2h2.33l4.75 11.38A1 1 0 0 0 10 17"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}