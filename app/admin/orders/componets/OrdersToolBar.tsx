"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const tabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "unpaid", label: "Unpaid " },
] as const;

export function OrdersToolbar() {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("search") ?? "");

  const active = useMemo(() => sp.get("tab") ?? "all", [sp]);

  const push = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => push({ tab: t.key })}
            className="rounded-full px-4 py-2 text-sm cursor-pointer transition-colors"
            style={
              active === t.key
                ? {
                    backgroundColor: "var(--gold-primary)",
                    color: "var(--text-on-gold)",
                    boxShadow: "0 4px 14px -4px rgba(201, 161, 93, 0.4)",
                  }
                : {
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
                  }
            }
            onMouseEnter={(e) => {
              if (active !== t.key) e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
            }}
            onMouseLeave={(e) => {
              if (active !== t.key) e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-[320px]">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: "var(--text-secondary)" }}
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") push({ search: q.trim() || null });
          }}
          placeholder="Search orders..."
          className="w-full rounded-2xl py-2 pl-10 pr-3 text-sm outline-none transition-colors"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-strong)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-bright)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
        />
      </div>
    </div>
  );
}