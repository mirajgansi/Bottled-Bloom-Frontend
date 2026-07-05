"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OrderStatusPill } from "../../../_componets/OrderStatusPill";
import { handleGetAllOrders } from "@/lib/actions/order-action";

type Order = {
  _id: string;
  createdAt: string;
  total: number;
  paymentStatus: "unpaid" | "paid";
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  items: { quantity: number }[];
  shippingAddress?: {
    userName?: string;
    phone?: string;
    address1?: string;
    city?: string;
    country?: string;
  };
};

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const sp = useSearchParams();

  const tab = sp.get("tab") ?? "all";
  const search = sp.get("search") ?? "";
  const page = Number(sp.get("page") ?? "1");
  const size = Number(sp.get("size") ?? "20");

  const [orders, setOrders] = useState<Order[]>(initialOrders ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await handleGetAllOrders({
          page,
          size,
          tab,
          search,
        });

        if (!res?.success) throw new Error(res?.message || "Failed to fetch orders");

        setOrders(Array.isArray(res.orders) ? res.orders : []);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [tab, search, page, size]);

  if (loading)
    return (
      <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
        Loading orders...
      </p>
    );
  if (error)
    return (
      <p className="mt-4 text-sm" style={{ color: "#E57373" }}>
        {error}
      </p>
    );

  return (
    <div
      className="mt-4 overflow-hidden rounded-3xl"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            <tr>
              <th className="px-5 py-4 font-semibold">Order</th>
              <th className="px-5 py-4 font-semibold">Date</th>
              <th className="px-5 py-4 font-semibold">Customer</th>
              <th className="px-5 py-4 font-semibold">Payment</th>
              <th className="px-5 py-4 font-semibold">Total</th>
              <th className="px-5 py-4 font-semibold">Delivery</th>
              <th className="px-5 py-4 font-semibold">Items</th>
              <th className="px-5 py-4 font-semibold">Fulfillment</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, idx) => {
              const itemsCount = (o.items || []).reduce(
                (s, it) => s + (Number(it.quantity) || 0),
                0
              );

              return (
                <tr
                  key={o._id}
                  className="transition-colors"
                  style={{ borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-5 py-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                    #{o._id.slice(-6).toUpperCase()}
                  </td>

                  <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {o.shippingAddress?.userName ?? "Unknown"}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {o.shippingAddress?.phone ?? "No phone"}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <OrderStatusPill type="payment" value={o.paymentStatus} />
                  </td>

                  <td className="px-5 py-4 font-semibold" style={{ color: "var(--gold-primary)" }}>
                    {money(o.total)}
                  </td>

                  <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                    {o.shippingAddress?.city
                      ? `${o.shippingAddress.city}, ${o.shippingAddress.country ?? ""}`
                      : "N/A"}
                  </td>

                  <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                    {itemsCount} items
                  </td>

                  <td className="px-5 py-4">
                    <OrderStatusPill type="order" value={o.status} />
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${o._id}`}
                      className="rounded-xl px-3 py-2 text-sm transition-colors"
                      style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}

            {!orders.length ? (
              <tr>
                <td className="px-5 py-10 text-center" style={{ color: "var(--text-secondary)" }} colSpan={9}>
                  No orders found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}