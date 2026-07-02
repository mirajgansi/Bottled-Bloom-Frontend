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

  // If your backend returns meta, we’ll read it safely
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);

    // inside load()

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

const filtered = list.filter(
  (o: any) => o.status === "pending" || o.status === "delivered"
);

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
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assigned Orders</h1>
            <p className="mt-1 text-sm text-gray-600">
              {loading ? "Loading..." : `${orders.length} showing${total ? ` • ${total} total` : ""}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FormSelect<PageSizeForm>
                control={control}
                name="size"
                placeholder="Rows per page"
                className="h-10 rounded-xl border bg-white px-3 text-sm"
                options={[5, 10, 20, 50].map((n) => ({
                  value: String(n),
                  label: `${n} / page`,
                }))}
              />
            <button
              onClick={load}
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100"
            >
              Refresh
            </button>
          </div>
        </div>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
): orders.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center">
              <p className="text-sm text-gray-600">No assigned orders found.</p>
            </div>
          ) : (
            orders.map((o) => (
              <Link
                key={o._id}
                href={`/driver/orders/${o._id}`}
                className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-[240px]">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">{o._id}</p>
                    <p className="mt-1 text-xs text-gray-500">{fmtDate(o.createdAt)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                      <OrderStatusPill type="order" value={o.status} />
                      <OrderStatusPill type="payment" value={o.paymentStatus} />

                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold text-gray-900">{money(o.total)}</p>
                    <p className="text-xs text-gray-500">
                      Items:{" "}
                      {o.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-700">
                  <span className="font-semibold">Customer:</span>{" "}
                  {o.shippingAddress?.userName || "—"}{" "}
                  {o.shippingAddress?.phone ? `• ${o.shippingAddress.phone}` : ""}
                  <div className="text-xs text-gray-500">
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
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-50"
            disabled={loading || page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <div className="text-sm text-gray-700">
            Page <span className="font-semibold">{page}</span>
            {totalPages ? (
              <>
                {" "}
                of <span className="font-semibold">{totalPages}</span>
              </>
            ) : null}
          </div>

          <button
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-50"
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
