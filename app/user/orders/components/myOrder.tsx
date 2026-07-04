"use client";

import { OrderStatusPill } from "@/app/_componets/OrderStatusPill";
import Link from "next/link";
import { useMemo, useState } from "react";

function formatMoney(n: any) {
  const num = Number(n ?? 0);
  return `Rs ${num.toFixed(2)}`;
}

function formatDate(d: any) {
  const dt = d ? new Date(d) : null;
  if (!dt || isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

export default function OrdersList({ orders }: { orders: any[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((o) => {
      const id = String(o?._id ?? o?.id ?? "").toLowerCase();
      const status = String(o?.status ?? "").toLowerCase();
      const total = String(o?.total ?? o?.totalAmount ?? o?.grandTotal ?? "").toLowerCase();
      return id.includes(query) || status.includes(query) || total.includes(query);
    });
  }, [q, orders]);

  if (!orders?.length) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          No orders yet
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          When you place an order, it will show up here.
        </p>
        <Link
          href="/user/products"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "var(--gold-primary)",
            color: "var(--text-on-gold)",
            boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
          }}
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Orders
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {filtered.length} result(s)
            </p>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order id, status, total..."
            className="h-10 w-full rounded-lg px-3 text-sm outline-none transition-colors sm:w-80"
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

      {/* List */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          <div className="col-span-5">Order</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Status</div>
        </div>

        <div>
          {filtered.map((o, idx) => {
            const id = o?._id ?? o?.id;
            const createdAt = o?.createdAt ?? o?.date;
            const total = o?.total ?? o?.totalAmount ?? o?.grandTotal ?? 0;

            return (
              <Link
                key={String(id)}
                href={id ? `/user/orders/${id}` : "#"}
                className="grid grid-cols-12 gap-2 px-4 py-4 transition-colors"
                style={{
                  borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className="col-span-5">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Order #{String(id).slice(-8)}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Tap to view details
                  </p>
                </div>

                <div className="col-span-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {formatDate(createdAt)}
                </div>
                <div
                  className="col-span-2 text-sm font-semibold"
                  style={{ color: "var(--gold-primary)" }}
                >
                  {formatMoney(total)}
                </div>
                <div className="col-span-2">
                  <OrderStatusPill type="order" value={o.status} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}