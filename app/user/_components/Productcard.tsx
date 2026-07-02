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

  unit = "per kg",
  inStock = 0,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-3 shadow-sm relative">
    
 <button
        onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("clicked fav", id); // ✅ debug
  onToggleWishlist?.();
}}
        className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow hover:scale-105 transition"
        aria-label="Toggle favorite"
      >
        <Heart
          className={`h-5 w-5 transition ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      <Link href={`/user/products/${id}`} className="block">
        {/* Smaller image box */}
        <div className="bg-gray-100 rounded-xl w-full relative overflow-hidden flex items-center justify-center h-24 sm:h-28 md:h-32">
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
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-medium text-red-700">
            <BadgeX className="h-4 w-4" />
            Out of stock
          </div>
        ) : (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
            <BadgePercent className="h-4 w-4" />
            {inStock} in stock
          </div>
        )}

        {/* Name */}
        <h3 className="mt-2 text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>
      </Link>

      {/* Price + Cart */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-green-600 text-sm sm:text-base font-bold whitespace-nowrap">
          RS{price.toFixed(2)}
          <span className="text-gray-500 text-[11px] sm:text-xs font-normal">
            /{unit}
          </span>
        </p>

        <button
          onClick={onAddToCart}
          disabled={inStock <= 0}
          className={`shrink-0 rounded-full p-2 shadow transition ${
            inStock <= 0
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
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
