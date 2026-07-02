"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleCancelMyOrder } from "@/lib/actions/order-action";

export default function CancelOrderButton({
  orderId,
  status,
}: {
  orderId: string;
  status?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

const canCancel = (status ?? "").toLowerCase() === "pending";

  const onCancel = () => {
    if (!canCancel) {
      toast.info("You can only cancel a pending order.");
      return;
    }

    startTransition(async () => {
      const res = await handleCancelMyOrder(orderId);

      if (!res.success) {
        toast.error(res.message || "Cancel failed");
        return;
      }

      toast.success(res.message || "Order cancelled");
      router.refresh(); 
    });
  };

  return (
    <button
      type="button"
      onClick={onCancel}
      disabled={!canCancel || pending}
      className={[
        "h-10 rounded-lg px-4 text-sm font-semibold transition",
        canCancel
          ? "bg-red-600 text-white hover:opacity-90"
          : "bg-gray-200 text-gray-500 cursor-not-allowed",
        pending ? "opacity-60" : "",
      ].join(" ")}
      title={!canCancel ? "Only pending orders can be cancelled" : "Cancel this order"}
    >
      {pending ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}
