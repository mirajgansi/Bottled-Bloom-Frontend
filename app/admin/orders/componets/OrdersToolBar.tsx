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
            className={`rounded-full px-4 py-2 text-sm ring-1 cursor-pointer ${
              active === t.key
                ? "bg-green-700 text-white ring-green-900 "
                : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-[320px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") push({ search: q.trim() || null });
          }}
          placeholder="Search orders..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-gray-400"
        />
      </div>
    </div>
  );
}
