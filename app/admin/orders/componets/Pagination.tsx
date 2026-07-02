"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2),
  );

  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl px-3 py-2 text-sm ring-1 ring-gray-200 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-9 w-9 rounded-xl text-sm ring-1 ${p === page
                ? "bg-gray-900 text-white ring-gray-900"
                : "ring-gray-200 hover:bg-gray-50"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl px-3 py-2 text-sm ring-1 ring-gray-200 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
