"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { handleDriverUpdateOrderStatus, handleGetOrderById } from "@/lib/actions/order-action";
import { OrderStatusPill } from "@/app/_componets/OrderStatusPill";

type OrderItem = {
  productId?: string;
  name?: string;
  price?: number;
  quantity: number;
  image?: string;
};

type ShippingAddress = {
  userName?: string;
  phone?: string;
  address1?: string;
  city?: string;
  country?: string;
};
type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "unpaid" | "paid";
type Order = {
  _id: string;
  createdAt?: string;
  subtotal?: number;
  shippingFee?: number;
  total?: number;
  status: OrderStatus;    
    paymentStatus: PaymentStatus;
    items: OrderItem[];
  shippingAddress?: ShippingAddress;
};

function money(n?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function fmtDate(d?: string) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
}

export default function DriverOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);

      const res: any = await handleGetOrderById(orderId);

      if (!res?.success) {
        setErr(res?.message || "Failed to fetch order");
        setOrder(null);
        return;
      }

      setOrder(res.data as Order);
    } catch (e: any) {
      setErr(e?.message || "Failed to fetch order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    load();
  }, [orderId]);

  const markAsDone = async () => {
  try {
    if (!orderId) return;

    if (order?.status === "delivered") {
      toast.info("Already delivered");
      return;
    }

    setSaving(true);

    const res: any = await handleDriverUpdateOrderStatus(orderId, "delivered");

    if (!res?.success) {
      toast.error(res?.message || "Failed to update status");
      return;
    }

    toast.success("Marked as delivered");
    await load(); // reload order detail
  } catch (e: any) {
    toast.error(e?.message || "Failed to update status");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm font-semibold text-gray-700 hover:underline"
            >
              ← Back
            </button>

            <h1 className="mt-2 text-2xl font-bold text-gray-900">Order Detail</h1>
            <p className="mt-1 text-sm text-gray-600">
              {loading ? "Loading..." : `Order ID: ${order?._id || "—"}`}
            </p>
          </div>

        </div>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 rounded-2xl border bg-white p-6 text-sm text-gray-600">
            Loading order...
          </div>
        ) : !order ? (
          <div className="mt-6 rounded-2xl border bg-white p-8 text-center">
            <p className="text-sm text-gray-600">Order not found.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left: Main */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-semibold text-gray-900">{fmtDate(order.createdAt)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                        <OrderStatusPill type="order" value={order.status} />
                      <OrderStatusPill type="payment" value={order.paymentStatus} />                  

                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-800">Customer</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {order.shippingAddress?.userName || "—"}{" "}
                    {order.shippingAddress?.phone ? `• ${order.shippingAddress.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {[
                      order.shippingAddress?.address1,
                      order.shippingAddress?.city,
                      order.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">Items</p>

                <div className="mt-3 divide-y">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {it.name || "Item"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {it.quantity} {it.price ? `• ${money(it.price)}` : ""}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {money((it.price || 0) * (it.quantity || 0))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="space-y-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">Summary</p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{money(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">{money(order.shippingFee)}</span>
                  </div>
                  <div className="my-2 border-t" />
                  <div className="flex justify-between text-gray-900">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold">{money(order.total)}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Mark as Done will set status to <span className="font-semibold">delivered</span>.
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">Actions</p>
                <button
                  onClick={markAsDone}
                  disabled={saving || order.status === "delivered" || order.status === "cancelled"}
                  className="mt-3 w-full rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-black hover:bg-green-700 
                   disabled:opacity-50  cursor-pointer"
                >
                  {order.status === "delivered" ? "Already Delivered" : saving ? "Updating..." : "Mark as Done"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


