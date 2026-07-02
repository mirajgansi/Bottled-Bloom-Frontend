import Image from "next/image";
import Link from "next/link";
import { handleGetOrderById } from "@/lib/actions/order-action";
import { OrderStatusPill } from "../../../_componets/OrderStatusPill"; // adjust path
import OrderProgress from "./componenets/OrderProgress";
import OrderDetailShell from "./componenets/OrderDetailShell";


function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

function formatAddress(a: any) {
  if (!a) return "N/A";
  const parts = [
    a.address1,
    a.address2,
    a.city,
    a.state,
    a.zip,
    a.country,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "N/A";
}

function countItems(items: any[]) {
  return (items || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await handleGetOrderById(id);

  if (!res.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-gray-100">
            <p className="text-red-600">Failed to load order: {res.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const order: any = res.data;
  const items = order?.items ?? [];
  const addr = order?.shippingAddress;

   return (
   <OrderDetailShell
  order={order}
  shippingHref={`/admin/orders/${order._id}/shipping`}
  showProgress={true}  
>
        <div className="rounded-3xl bg-white ring-1 ring-gray-100">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Products
                </h2>
                <div className="flex items-center gap-2">
                  <OrderStatusPill type="order" value={order.status} />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((it: any, idx: number) => (
                  <div key={idx} className="flex gap-4 px-5 py-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-100">
                      <Image
                        src={buildImageUrl(it.image)}
                        alt={it.name || "Product"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {it.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {it.quantity} • Price: {money(it.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {money(it.lineTotal)}
                      </p>
                    </div>
                  </div>
                ))}

                {!items.length ? (
                  <div className="px-5 py-10 text-center text-sm text-gray-500">
                    No items found
                  </div>
                ) : null}
              </div>
            </div>

            {/* Payment details */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Payment Details
                </h2>
                <OrderStatusPill type="payment" value={order.paymentStatus} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                <KeyVal label="Subtotal" value={money(order.subtotal)} />
                <KeyVal label="Items" value={`${countItems(items)} items`} />
                <KeyVal label="Shipping Fee" value={money(order.shippingFee)} />
                <KeyVal
                  label="Total"
                  value={money(order.total)}
                  strong
                />
              </div>

              {/* admin update */}
              
            </div>
     </OrderDetailShell>
  );
}
function KeyVal({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className={strong ? "font-bold text-gray-900" : "font-semibold text-gray-900"}>
        {value}
      </span>
    </div>
  );
}