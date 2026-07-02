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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Restock Product</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add stock or set exact stock amount.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50"
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
            <label className="text-xs font-semibold text-gray-600">
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
              className="mt-1 h-10 w-full rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400 disabled:opacity-50"
              placeholder="e.g. 20"
            />
            {errors.quantity?.message ? (
              <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>
            ) : null}
          </div>

          {/* Footer */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
              type="button"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
