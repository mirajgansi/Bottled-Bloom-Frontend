"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleUpdateOrderStatus } from "@/lib/actions/order-action";
import ConfirmModal from "@/app/_componets/CofirmModal";

export default function OrderButton({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCancelConfirm = () => {
    setError(null);

    startTransition(async () => {
      const res = await handleUpdateOrderStatus(id, { status: "cancelled" });

      if (!res?.success) {
        setError(res?.message || "Failed to cancel order");
        return;
      }

      setOpen(false);
      router.refresh();
    });
  };

  const isDisabled = disabled || pending;

  return (
    <>
     

      <ConfirmModal
        open={open}
        title="Cancel Order?"
        description="This will cancel the order and stop shipping actions."
        confirmText={pending ? "Cancelling..." : "Yes, cancel"}
        cancelText="No, keep it"
        disabled={pending}
        error={error}
        onClose={() => {
          if (!pending) setOpen(false);
        }}
        onConfirm={onCancelConfirm}
      />
    </>
  );
}
