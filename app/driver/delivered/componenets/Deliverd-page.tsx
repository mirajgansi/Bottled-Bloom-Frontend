"use client";

import { FormSelect } from "@/app/_componets/dropdown";
import { OrderStatusPill } from "@/app/_componets/OrderStatusPill";
import { handleGetMyAssignedOrders } from "@/lib/actions/order-action";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrderCardSkeleton from "../../_components/sekeleton-load-componet";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "unpaid" | "paid";

type Order = {
  _id: string;
  createdAt?: string;
  total?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items?: { quantity: number }[];
  shippingAddress?: {
    userName?: string;
    phone?: string;
    address1?: string;
    city?: string;
    country?: string;
  };
};

function fmtDate(d?: string) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
}

function money(n?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default function DriverDeliveredPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);

      const res: any = await handleGetMyAssignedOrders({ page, size });

      if (res?.success === false) {
        setErr(res.message);
        return;
      }

      const data = res?.data ?? res;

      const list =
        data?.orders ||
        data?.items ||
        (Array.isArray(data) ? data : []) ||
        [];

      // Delivered page: only show delivered orders
      const filtered = list.filter((o: any) => o.status === "delivered");

      setOrders(filtered);

      const meta = data?.pagination || data?.meta || {};
      setTotal(Number(meta?.total ?? data?.total ?? 0));
      setTotalPages(Number(meta?.totalPages ?? data?.totalPages ?? 1));
    } catch (e: any) {
      setErr(e?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  type PageSizeForm = { size: string };

  const { control, watch, setValue } = useForm<PageSizeForm>({
    defaultValues: { size: String(size) },
  });

  const sizeWatch = watch("size");

  useEffect(() => {
    if (!sizeWatch) return;
    const next = Number(sizeWatch);
    setPage(1);
    setSize(next);
  }, [sizeWatch]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Delivered Orders
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              {loading ? "Loading..." : `${orders.length} showing${total ? ` • ${total} total` : ""}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FormSelect<PageSizeForm>
              control={control}
              name="size"
              placeholder="Rows per page"
              className="h-10 rounded-xl px-3 text-sm"
              options={[5, 10, 20, 50].map((n) => ({
                value: String(n),
                label: `${n} / page`,
              }))}
            />
            <button
              onClick={load}
              className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")}
            >
              Refresh
            </button>
          </div>
        </div>

        {err ? (
          <div
            className="mt-6 rounded-2xl p-4 text-sm"
            style={{
              border: "1px solid rgba(225, 83, 83, 0.3)",
              backgroundColor: "rgba(225, 83, 83, 0.08)",
              color: "#E57373",
            }}
          >
            {err}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                No delivered orders found.
              </p>
            </div>
          ) : (
            orders.map((o) => (
              <Link
                key={o._id}
                href={`/driver/orders/${o._id}`}
                className="block rounded-2xl p-5 transition-colors"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-[240px]">
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Order ID
                    </p>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {o._id}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {fmtDate(o.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusPill type="order" value={o.status} />
                    <OrderStatusPill type="payment" value={o.paymentStatus} />
                  </div>

                  <div className="text-right">
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Total
                    </p>
                    <p className="text-lg font-bold" style={{ color: "var(--gold-primary)" }}>
                      {money(o.total)}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Items: {o.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    Customer:
                  </span>{" "}
                  {o.shippingAddress?.userName || "—"}{" "}
                  {o.shippingAddress?.phone ? `• ${o.shippingAddress.phone}` : ""}
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {[
                      o.shippingAddress?.address1,
                      o.shippingAddress?.city,
                      o.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between gap-2">
          <button
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
            }}
            disabled={loading || page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Page <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{page}</span>
            {totalPages ? (
              <>
                {" "}
                of <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{totalPages}</span>
              </>
            ) : null}
          </div>

          <button
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
            }}
            disabled={loading || (totalPages ? page >= totalPages : orders.length < size)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}