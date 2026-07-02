import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetOrderById } from "@/lib/actions/order-action";
import CancelOrderButton from "../components/CancelButton";
import { OrderStatusPill } from "@/app/_componets/OrderStatusPill";

function money(n: any) {
  const num = Number(n ?? 0);
  return `Rs ${num.toFixed(2)}`;
}

function dt(v: any) {
  const d = v ? new Date(v) : null;
  if (!d || isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  return `${base}/${image.replace(/^\/+/, "")}`;
}


export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await handleGetOrderById(id);
  if (!res.success) return notFound();

  const order = res.data;

  const items = order?.items ?? order?.orderItems ?? [];
  const shippingFee =
    order?.shippingFee ?? order?.deliveryFee ?? order?.shipping ?? 0;

  const subtotal =
    order?.subtotal ??
    items.reduce(
      (sum: number, it: any) =>
        sum +
        Number(it?.price ?? it?.product?.price ?? 0) *
          Number(it?.qty ?? it?.quantity ?? 1),
      0,
    );

  const total =
    order?.total ??
    order?.totalAmount ??
    order?.grandTotal ??
    (Number(subtotal) + Number(shippingFee));

  const status = order?.status;
  const createdAt = order?.createdAt ?? order?.date;

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/user/orders" className="text-sm text-gray-600 hover:underline">
            ← Back to orders
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Order Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Order ID:{" "}
            <span className="font-medium text-gray-800">
              {order?._id ?? order?.id ?? id}
            </span>
          </p>
          <p className="text-sm text-gray-500">Placed: {dt(createdAt)}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-xs font-semibold text-gray-500">STATUS</p>
          <div className="mt-2">
           <OrderStatusPill type="order" value={order.status} />

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 rounded-2xl border bg-white">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Items</h2>
          </div>

          <div className="divide-y">
            {items.map((it: any, idx: number) => {
              const name = it?.name ?? it?.product?.name ?? "Item";
              const qty = Number(it?.qty ?? it?.quantity ?? 1);
              const price = Number(it?.price ?? it?.product?.price ?? 0);
              const lineTotal = qty * price;

              const img =
                it?.image ||
                it?.product?.image ||
                it?.productId?.image ||
                "";

              return (
                <div
                  key={it?._id ?? `${name}-${idx}`}
                  className="flex items-start justify-between gap-4 p-4"
                >
                  <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={buildImageUrl(img)}
                        alt={name}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                        unoptimized
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Qty: <span className="font-medium text-gray-800">{qty}</span>
                        {"  "}• Price:{" "}
                        <span className="font-medium text-gray-800">{money(price)}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    {money(lineTotal)}
                  </p>
                </div>
              );
            })}

            {!items.length && (
              <div className="p-6 text-sm text-gray-500">
                No items found for this order.
              </div>
            )}
          </div>

          {/* Cancel button */}
          <div className="border-t p-4">
            <CancelOrderButton orderId={order?._id ?? id} status={order?.status} />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border bg-white">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Summary</h2>
          </div>

          <div className="space-y-3 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">{money(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping fee</span>
              <span className="font-semibold text-gray-900">{money(shippingFee)}</span>
            </div>

            <div className="my-2 flex items-center justify-between border-t pt-3">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-gray-900">{money(total)}</span>
            </div>
          </div>

          {/* Shipping info */}
          {order?.shippingAddress && (
            <div className="border-t p-4">
              <p className="text-sm font-semibold">Shipping Address</p>
              <p className="mt-2 text-sm text-gray-600">
                {order.shippingAddress?.userName ?? ""}<br />
                {order.shippingAddress?.phone ?? ""}<br />
                {order.shippingAddress?.address1 ?? ""}{" "}
                {order.shippingAddress?.address2 ?? ""}<br />
                {order.shippingAddress?.city ?? ""}{" "}
                {order.shippingAddress?.state ?? ""}{" "}
                {order.shippingAddress?.zip ?? ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
