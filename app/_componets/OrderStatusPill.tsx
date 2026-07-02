"use client";

import { CheckCircle2, Clock, Truck, XCircle, CreditCard } from "lucide-react";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "unpaid" | "paid";

export function OrderStatusPill({
  type,
  value,
}: {
  type: "order" | "payment";
  value: OrderStatus | PaymentStatus;
}) {
  const ui =
    type === "payment"
      ? value === "paid"
        ? {
            label: "Success",
            Icon: CreditCard,
            cls: "bg-green-50 text-green-700 ring-green-200",
            dot: "bg-green-500",
          }
        : {
            label: "Unpaid",
            Icon: Clock,
            cls: "bg-yellow-50 text-yellow-800 ring-yellow-200",
            dot: "bg-yellow-500",
          }
      : value === "pending"
        ? {
            label: "Pending",
            Icon: Clock,
            cls: "bg-yellow-50 text-yellow-800 ring-yellow-200",
            dot: "bg-yellow-500",
          }
        : value === "paid"
          ? {
              label: "Paid",
              Icon: CreditCard,
              cls: "bg-blue-50 text-blue-700 ring-blue-200",
              dot: "bg-blue-500",
            }
          : value === "shipped"
            ? {
                label: "Shipped",
                Icon: Truck,
                cls: "bg-purple-50 text-purple-700 ring-purple-200",
                dot: "bg-purple-500",
              }
            : value === "delivered"
              ? {
                  label: "Delivered",
                  Icon: CheckCircle2,
                  cls: "bg-green-50 text-green-700 ring-green-200",
                  dot: "bg-green-500",
                }
              : {
                  label: "Cancelled",
                  Icon: XCircle,
                  cls: "bg-red-50 text-red-700 ring-red-200",
                  dot: "bg-red-500",
                };

  const Icon = ui.Icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${ui.cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {ui.label}
    </span>
  );
}
