"use client";

import { Search, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";

type ProductFilterBarProps = {
  onSubmit: (payload: { search: string; category: string }) => void;
};

export default function ProductFilterBar({ onSubmit }: ProductFilterBarProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <div className="rounded-xl p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
        >
          Find your fragrance
        </h3>
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
        >
          Choose type
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-secondary)" }}
          />
          <input
            type="text"
            placeholder="What are you looking for"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmit({ search, category });
              }
            }}
            className="w-full rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-strong)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-bright)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
          />
        </div>

      

        {/* Button */}
        <button
          onClick={() => onSubmit({ search, category })}
          className="w-full md:w-auto px-6 py-2 rounded-lg font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "var(--gold-primary)",
            color: "var(--text-on-gold)",
            boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
          }}
        >
          Find Product
        </button>
      </div>
    </div>
  );
}