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

  const DEFAULT_AVATAR = "/cookie.jpg";

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
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-colors"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")}
              aria-label="Back"
            >
              ←
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
                >
                  Order-{String(order._id).slice(-5).toUpperCase()}
                </h1>
                <OrderStatusPill type="payment" value={order.paymentStatus as PaymentStatus} />
                <OrderStatusPill type="order" value={order.status as OrderStatus} />
              </div>

              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                Order date{" "}
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"} • Purchased
                via online store
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center">
            <OrderButton
              id={order._id}
              disabled={["cancelled", "shipped", "delivered"].includes(order.status)}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            {showProgress && (
              <div
                className="rounded-3xl p-5"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {progressTitle ? (
                  <>
                    <h2
                      className="text-base font-semibold"
                      style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
                    >
                      {progressTitle}
                    </h2>
                    {progressSubtitle ? (
                      <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {progressSubtitle}
                      </p>
                    ) : null}
                  </>
                ) : null}

                <div className="mt-4 flex justify-end">
                  <Link
                    href={shippingHref}
                    className="rounded-2xl px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: "var(--gold-primary)",
                      color: "var(--text-on-gold)",
                      boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
                    }}
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
            <div
              className="rounded-3xl p-5"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
              >
                Customer
              </h3>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className="relative h-10 w-10 overflow-hidden rounded-2xl"
                  style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                >
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
                  <p className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Total: {countItems(items)} items
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div
              className="rounded-3xl p-5"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-base font-semibold"
                  style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
                >
                  Shipping Address
                </h3>
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
                <div
                  className="mt-4 h-32 w-full rounded-2xl flex items-center justify-center text-sm"
                  style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                >
                  Address not available
                </div>
              )}
              <p className="mt-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {addr?.userName || "N/A"}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatAddress(addr)}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(addr))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold transition-colors"
                style={{ color: "var(--gold-primary)" }}
              >
                View on Map
              </a>
            </div>

            {/* Contact */}
            <div
              className="rounded-3xl p-5"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-base font-semibold"
                  style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
                >
                  Contact Information
                </h3>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div
                  className="inline-flex items-center rounded-2xl px-3 py-2"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
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