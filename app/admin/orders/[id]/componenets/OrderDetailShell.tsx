"use client";

import { OrderStatusPill } from "@/app/_componets/OrderStatusPill";
import Link from "next/link";
import OrderProgress from "./OrderProgress";
import OrderButton from "./orderButton";
import { useEffect, useState } from "react";
import Image from "next/image";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "unpaid" | "paid";

function formatAddress(a: any) {
  if (!a) return "N/A";
  const parts = [a.address1, a.address2, a.city, a.state, a.zip, a.country].filter(Boolean);
  return parts.length ? parts.join(", ") : "N/A";
}

function countItems(items: any[]) {
  return (items || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0);
}
export default function OrderDetailShell({
  order,
  backHref = "/admin/orders",
  shippingHref,
  children,
  showProgress = true,       
  progressTitle,              
  progressSubtitle,
    progressStatus,
}: {
  order: any;
  backHref?: string;
  shippingHref: string;
  children?: React.ReactNode;
  showProgress?: boolean;
  progressTitle?: string;
  progressSubtitle?: string;
    progressStatus?: OrderStatus; 
}) {
  const items = order?.items ?? [];
  const addr = order?.shippingAddress;


  const DEFAULT_AVATAR = "/cookie.jpg"; // put happy.png inside /public

const user =
  order?.user || order?.customer || order?.userId || order?.createdBy || null;

const name =
  user?.username || user?.name || addr?.userName || "Unknown";

const avatar =
  user?.avatar || user?.image || user?.profileImage || null;

const avatarUrl =
  avatar && typeof avatar === "string"
    ? avatar.startsWith("http")
      ? avatar
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${avatar.replace(/^\/+/, "")}`
    : null;

const [imgSrc, setImgSrc] = useState<string>(avatarUrl || DEFAULT_AVATAR);

useEffect(() => {
  setImgSrc(avatarUrl || DEFAULT_AVATAR);
}, [avatarUrl]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
  {/* LEFT */}
  <div className="flex items-center gap-3">
    <Link
      href={backHref}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-gray-200 hover:bg-gray-50"
      aria-label="Back"
    >
      ←
    </Link>

    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Order-{String(order._id).slice(-5).toUpperCase()}
        </h1>
        <OrderStatusPill type="payment" value={order.paymentStatus as PaymentStatus} />
        <OrderStatusPill type="order" value={order.status as OrderStatus} />
      </div>

      <p className="mt-1 text-sm text-gray-500">
        Order date{" "}
        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"} • Purchased
        via online store
      </p>
    </div>
  </div>

  {/* RIGHT */}
  <div className="flex items-center ">
   

                <OrderButton
                id={order._id}
                disabled={["cancelled", "shipped", "delivered"].includes(order.status)}
                />
            </div>
            </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
                {showProgress && (
                <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
                    {progressTitle ? (
                    <>
                        <h2 className="text-base font-semibold text-gray-900">{progressTitle}</h2>
                        {progressSubtitle ? (
                        <p className="mt-1 text-sm text-gray-600">{progressSubtitle}</p>
                        ) : null}
                    </>
                    ) : null}

                    <div className="mt-4 flex justify-end">
                    <Link
                        href={shippingHref}
                        className="rounded-2xl bg-green-600 ring-green-900 ring-1 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Create Shipping Label →
                    </Link>
                    </div>

                    <div className="mt-4">
           <OrderProgress status={(progressStatus ?? order.status) as OrderStatus} animateOnMount />
                
             </div>
                </div>
                )}


            {children}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
  <h3 className="text-base font-semibold text-gray-900">Customer</h3>

  <div className="mt-4 flex items-center gap-3">
    <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
      <Image
        src={imgSrc}
        alt={name}
        fill
        className="object-cover"
        sizes="40px"
        onError={() => setImgSrc(DEFAULT_AVATAR)}
      />
    </div>

    <div className="min-w-0">
      <p className="font-semibold text-gray-900 truncate">{name}</p>
      <p className="text-xs text-gray-500">Total: {countItems(items)} items</p>
    </div>
  </div>
</div>
            {/* Shipping Address */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Shipping Address</h3>
              </div>

              {addr ? (
                <iframe
                  className="mt-4 h-32 w-full rounded-2xl border-0"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    formatAddress(addr)
                  )}&z=15&output=embed`}
                />
              ) : (
                <div className="mt-4 h-32 w-full rounded-2xl bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                  Address not available
                </div>
              )}
              <p className="mt-3 text-sm font-semibold text-gray-900">{addr?.userName || "N/A"}</p>
              <p className="mt-1 text-sm text-gray-600">{formatAddress(addr)}</p>

             <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(addr))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View on Map
          </a>
            </div>

            {/* Contact */}
            <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Contact Information</h3>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="inline-flex items-center rounded-2xl bg-gray-50 px-3 py-2 ring-1 ring-gray-200">
                  📞 <span className="ml-2">{addr?.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
