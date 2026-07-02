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
      <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Shipping Status
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Track the shipment progress
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpenDriver(true)}
            className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Choose Driver
          </button>
        </div>

        <div className="mt-4">
          <OrderProgress status={displayStatus} animateOnMount />
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-100">
        <h3 className="text-base font-semibold text-gray-900">Timeline</h3>

        <div className="mt-4 space-y-4">
          {events.map((e, idx) => {
            const Icon = e.icon;
            return (
              <div key={idx} className="flex gap-3">
                <div
                  className={`mt-0.5 grid h-9 w-9 place-items-center rounded-2xl ring-1 ${
                    e.done
                      ? "bg-green-700 text-white ring-gren-900"
                      : "bg-white text-gray-400 ring-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm font-semibold ${
                        e.done ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {e.title}
                    </p>
                    <p className="text-xs text-gray-500">{e.time}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{e.desc}</p>
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
