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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
      <div
        className="w-full max-w-xl rounded-2xl p-5"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-deep)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--gold-primary)", fontFamily: "Georgia, serif" }}
          >
            Select a category
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search category..."
            className="h-10 w-full rounded-lg px-3 text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-strong)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-bright)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Results
          </p>

          <div className="mt-3 max-h-60 space-y-3 overflow-auto">
            {filtered.map((c) => (
              <label
                key={c.slug}
                className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors"
                style={{
                  backgroundColor: temp === c.slug ? "var(--bg-elevated)" : "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                onMouseLeave={(e) => {
                  if (temp !== c.slug) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <input
                  type="radio"
                  name="categoryPick"
                  checked={temp === c.slug}
                  onChange={() => setTemp(c.slug)}
                  className="mt-1 accent-[#C9A15D]"
                />

                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--gold-primary)" }}>
                    {c.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {c.description}
                  </p>
                </div>
              </label>
            ))}

            {!filtered.length && (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                No categories found.
              </p>
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
          className="mt-5 h-10 w-full rounded-lg text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          style={{
            backgroundColor: "var(--gold-primary)",
            color: "var(--text-on-gold)",
            boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}