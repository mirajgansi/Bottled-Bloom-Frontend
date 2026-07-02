"use client";

import { useEffect, useState } from "react";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const steps = [
  { key: "pending", label: "Review order" },
  { key: "paid", label: "Preparing order" },
  { key: "shipped", label: "Shipping" },
  { key: "delivered", label: "Delivered" },
] as const;

function getStepIndex(status: OrderStatus) {
  if (status === "cancelled") return 0;
  const idx = steps.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrderProgress({
  status,
  compact = false,
  animateOnMount = false, 
}: {
  status: OrderStatus;
  compact?: boolean;
  animateOnMount?: boolean;
}) {
  const target = getStepIndex(status);

  const [current, setCurrent] = useState(() =>
    animateOnMount ? 0 : target,
  );

  useEffect(() => {
    if (!animateOnMount) {
      setCurrent(target);
      return;
    }

    setCurrent(0);
    const t = window.setTimeout(() => setCurrent(target), 80);
    return () => window.clearTimeout(t);
  }, [target, animateOnMount]);

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => {
          const active = i <= current;
          return (
            <div key={s.key} className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ring-1",
                    "transition-all duration-500 ease-out",
                    active
                      ? "bg-green-800 text-white ring-green-900 scale-105"
                      : "bg-white text-gray-500 ring-gray-200 scale-100",
                  ].join(" ")}
                >
                  {i + 1}
                </div>

                {!compact && (
                  <p
                    className={[
                      "text-sm font-semibold transition-colors duration-500",
                      active ? "text-green-900" : "text-gray-500",
                    ].join(" ")}
                  >
                    {s.label}
                  </p>
                )}
              </div>

              {i !== steps.length - 1 && (
                <div className="mt-3 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={[
                      "h-1 rounded-full bg-gray-900",
                      "transition-all duration-700 ease-out", 
                      i < current ? "w-full" : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {status === "cancelled" && (
        <p className="text-sm font-semibold text-red-600">
          This order has been cancelled.
        </p>
      )}
    </div>
  );
}
