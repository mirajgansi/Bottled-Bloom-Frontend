"use client";

import { Search, LayoutGrid } from "lucide-react";
import { useState } from "react";

type ProductFilterBarProps = {
  onSubmit: (payload: { search: string; category: string }) => void;
};

export default function ProductFilterBar({ onSubmit }: ProductFilterBarProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <div className="bg-white shadow-md rounded-xl p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Find your products</h3>
        <h3 className="text-lg font-semibold text-gray-800">Choose type</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category */}
        <div className="relative w-full md:w-90">
          <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2
              focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            <option value="snacks">Snacks</option>
            <option value="bakery">Bakery</option>
            <option value="beverages">Beverages</option>
            <option value="meat">Meat & Fish</option>
          </select>
        </div>

        {/* Button */}
        <button
          onClick={() => onSubmit({ search, category })}
          className="w-full md:w-auto bg-[#13C906] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Find Product
        </button>
      </div>
    </div>
  );
}
