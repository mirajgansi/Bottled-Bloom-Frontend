"use client";

import { useMemo, useState } from "react";
import { Package, Truck, MapPin } from "lucide-react";
import OrderProgress from "../../componenets/OrderProgress";
import DriverSelectModal from "./DriverSelectModal";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

function fmt(ts?: string) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ShippingStatusSection({ order }: { order: any }) {
  const [openDriver, setOpenDriver] = useState(false);

  const events = useMemo(() => {
    const placed = {
      title: "Order Placed",
      time: fmt(order.createdAt),
      desc: "Order received",
      icon: Package,
      done: true,
    };

    const picked = {
      title: "Picked up",
      time:
        order.status === "shipped" || order.status === "delivered"
          ? fmt(order.updatedAt)
          : "—",
      desc:
        order.status === "pending" || order.status === "paid"
          ? "Waiting for pickup"
          : "Shipment picked up by carrier",
      icon: Truck,
      done: order.status === "shipped" || order.status === "delivered",
    };

    const delivered = {
      title: "Delivered",
      time: order.status === "delivered" ? fmt(order.updatedAt) : "—",
      desc:
        order.status === "delivered"
          ? "Delivered to destination"
          : "Not delivered yet",
      icon: MapPin,
      done: order.status === "delivered",
    };

    return [placed, picked, delivered];
  }, [order.status, order.createdAt, order.updatedAt]);

  const displayStatus: OrderStatus = order.status === "pending" ? "paid" : order.status;

  return (
    <div className="space-y-6">
      <div
        className="rounded-3xl p-5"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Shipping Status
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Track the shipment progress
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpenDriver(true)}
            className="rounded-2xl px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
          >
            Choose Driver
          </button>
        </div>

        <div className="mt-4">
          <OrderProgress status={displayStatus} animateOnMount />
        </div>
      </div>

      {/* Timeline */}
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
          Timeline
        </h3>

        <div className="mt-4 space-y-4">
          {events.map((e, idx) => {
            const Icon = e.icon;
            return (
              <div key={idx} className="flex gap-3">
                <div
                  className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl"
                  style={
                    e.done
                      ? { backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }
                      : {
                          backgroundColor: "var(--bg-elevated)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-subtle)",
                        }
                  }
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: e.done ? "var(--text-primary)" : "var(--text-secondary)" }}
                    >
                      {e.title}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {e.time}
                    </p>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {e.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DriverSelectModal
        open={openDriver}
        onClose={() => setOpenDriver(false)}
        orderId={order._id}
      />
    </div>
  );
}