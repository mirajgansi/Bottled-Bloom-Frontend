"use client";

import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export function CategoryModal({
  open,
  onClose,
  onSave,
  selected,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (value: CategorySlug) => void;
  selected?: CategorySlug;
  
}) {
  const [q, setQ] = useState("");
  const [temp, setTemp] = useState<CategorySlug | "">(selected || "");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return CATEGORIES;

    return CATEGORIES.filter(
      (c) =>
        c.label.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        (c.description || "").toLowerCase().includes(query),
    );
  }, [q]);

  useEffect(() => {
    if (open) setTemp(selected || "");
  }, [open, selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-lime-700">Select a category</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search category..."
            className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-black/40"
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">Results</p>

          <div className="mt-3 max-h-60 space-y-3 overflow-auto">
            {filtered.map((c) => (
              <label
                key={c.slug}
                className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-black/5"
              >
                <input
                  type="radio"
                  name="categoryPick"
                  checked={temp === c.slug}
                  onChange={() => setTemp(c.slug)}
                  className="mt-1"
                />

                <div>
                  <p className="text-sm font-semibold text-lime-700">{c.label}</p>
                  <p className="text-xs text-gray-500">{c.description}</p>
                </div>
              </label>
            ))}

            {!filtered.length && (
              <p className="text-sm text-gray-500">No categories found.</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!temp) return toast.error("Please select a category");
            onSave(temp as CategorySlug);
            onClose();
          }}
          className="mt-5 h-10 w-full rounded-lg bg-lime-800 text-sm font-semibold text-white hover:opacity-90 cursor-pointer" 
        >
          Save
        </button>
      </div>
    </div>
  );
}
