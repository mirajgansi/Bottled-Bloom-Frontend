"use client";

import { FormSelect } from "@/app/_componets/dropdown";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { quantity: number; mode: "add" | "set" }) => Promise<void> | void;
  loading?: boolean;
};

type FormValues = {
  mode: "add" | "set";
  quantity: number;
};

export default function RestockModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      mode: "add",
      quantity: 1,
    },
  });

  // reset form whenever modal opens
  useEffect(() => {
    if (isOpen) reset({ mode: "add", quantity: 1 });
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const submit = async (values: FormValues) => {
    if (!values.quantity || values.quantity <= 0) return;
    await onConfirm({
      mode: values.mode,
      quantity: Number(values.quantity),
    });
    reset({ mode: "add", quantity: 1 });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div
        className="w-full max-w-md rounded-3xl p-6"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-deep)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Restock Product
            </h3>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Add stock or set exact stock amount.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-4">
          <FormSelect<FormValues>
            control={control}
            name="mode"
            label="Mode"
            placeholder="Select mode"
            options={[
              { value: "add", label: "Add to stock" },
              { value: "set", label: "Set exact stock" },
            ]}
            className="h-10 rounded-2xl"
            disabled={loading}
            error={errors.mode?.message as any}
          />

          <div>
            <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              Quantity
            </label>
            <input
              type="number"
              min={1}
              disabled={loading}
              {...register("quantity", {
                valueAsNumber: true,
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" },
              })}
              className="mt-1 h-10 w-full rounded-2xl px-3 text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-bright)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
              placeholder="e.g. 20"
            />
            {errors.quantity?.message ? (
              <p className="mt-1 text-xs" style={{ color: "#E57373" }}>
                {errors.quantity.message}
              </p>
            ) : null}
          </div>

          {/* Footer */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
              style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              type="button"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              style={{
                backgroundColor: "var(--gold-primary)",
                color: "var(--text-on-gold)",
                boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
              }}
            >
              {loading ? "Updating..." : "Update Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}