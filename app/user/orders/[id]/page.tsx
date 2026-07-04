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

  const createdAt = order?.createdAt ?? order?.date;

  return (
    <div
      className="mx-auto max-w-5xl p-6 min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/user/orders"
            className="text-sm transition-colors hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Back to orders
          </Link>
          <h1
            className="mt-2 text-2xl font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
          >
            Order Details
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Order ID:{" "}
            <span className="font-medium" style={{ color: "var(--gold-primary)" }}>
              {order?._id ?? order?.id ?? id}
            </span>
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Placed: {dt(createdAt)}
          </p>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            STATUS
          </p>
          <div className="mt-2">
            <OrderStatusPill type="order" value={order.status} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div
          className="lg:col-span-2 rounded-2xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Items
            </h2>
          </div>

          <div>
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
                  style={{
                    borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="relative h-16 w-16 overflow-hidden rounded-xl"
                      style={{ backgroundColor: "var(--bg-elevated)" }}
                    >
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
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {name}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                        Qty:{" "}
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {qty}
                        </span>
                        {"  "}• Price:{" "}
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {money(price)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold" style={{ color: "var(--gold-primary)" }}>
                    {money(lineTotal)}
                  </p>
                </div>
              );
            })}

            {!items.length && (
              <div className="p-6 text-sm" style={{ color: "var(--text-secondary)" }}>
                No items found for this order.
              </div>
            )}
          </div>

          {/* Cancel button */}
          <div className="p-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <CancelOrderButton orderId={order?._id ?? id} status={order?.status} />
          </div>
        </div>

        {/* Summary */}
        <div
          className="rounded-2xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Summary
            </h2>
          </div>

          <div className="space-y-3 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {money(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ color: "var(--text-secondary)" }}>Shipping fee</span>
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {money(shippingFee)}
              </span>
            </div>

            <div
              className="my-2 flex items-center justify-between pt-3"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Total
              </span>
              <span className="font-bold text-lg" style={{ color: "var(--gold-primary)" }}>
                {money(total)}
              </span>
            </div>
          </div>

          {/* Shipping info */}
          {order?.shippingAddress && (
            <div className="p-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Shipping Address
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {order.shippingAddress?.userName ?? ""}
                <br />
                {order.shippingAddress?.phone ?? ""}
                <br />
                {order.shippingAddress?.address1 ?? ""}{" "}
                {order.shippingAddress?.address2 ?? ""}
                <br />
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