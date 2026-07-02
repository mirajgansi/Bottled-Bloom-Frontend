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


  if (loading) return <p className="mt-4 text-sm text-gray-600">Loading orders...</p>;
  if (error) return <p className="mt-4 text-sm text-red-600">{error}</p>;

  return (
    <div className="mt-4 overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
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

          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => {
              const itemsCount = (o.items || []).reduce(
                (s, it) => s + (Number(it.quantity) || 0),
                0
              );

              return (
                <tr key={o._id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    #{o._id.slice(-6).toUpperCase()}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">
                      {o.shippingAddress?.userName ?? "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {o.shippingAddress?.phone ?? "No phone"}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <OrderStatusPill type="payment" value={o.paymentStatus} />
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {money(o.total)}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    {o.shippingAddress?.city
                      ? `${o.shippingAddress.city}, ${o.shippingAddress.country ?? ""}`
                      : "N/A"}
                  </td>

                  <td className="px-5 py-4 text-gray-700">{itemsCount} items</td>

                  <td className="px-5 py-4">
                    <OrderStatusPill type="order" value={o.status} />
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${o._id}`}
                      className="rounded-xl px-3 py-2 text-sm ring-1 ring-gray-200 hover:bg-gray-50"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}

            {!orders.length ? (
              <tr>
                <td className="px-5 py-10 text-center text-gray-500" colSpan={9}>
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
