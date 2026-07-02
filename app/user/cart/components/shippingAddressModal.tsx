"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type ShippingAddress = {
  userName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export default function ShippingAddressModal({
  open,
  initialData,
  onClose,
  onSave,
}: {
  open: boolean;
  initialData?: ShippingAddress;
  onClose: () => void;
  onSave: (data: ShippingAddress) => void;
}) {
  const [form, setForm] = useState<ShippingAddress>({});

  useEffect(() => {
    if (open) {
      setForm(initialData ?? {});
    }
  }, [initialData, open]);

  if (!open) return null;

  const update = (k: keyof ShippingAddress, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.userName || !form.phone || !form.address1) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-lg ring-1 ring-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-base font-bold text-gray-900">
              Shipping Address
            </p>
            <p className="text-sm text-gray-500">
              Add or update your shipping details
            </p>
          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl ring-1 ring-gray-200 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-3">
          <Field
            label="Full name *"
            value={form.userName || ""}
            onChange={(v) => update("userName", v)}
          />
          <Field
            label="Phone *"
            value={form.phone || ""}
            onChange={(v) => update("phone", v)}
          />
          <Field
            label="Address line 1 *"
            value={form.address1 || ""}
            onChange={(v) => update("address1", v)}
          />
          <Field
            label="Address line 2"
            value={form.address2 || ""}
            onChange={(v) => update("address2", v)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="City"
              value={form.city || ""}
              onChange={(v) => update("city", v)}
            />
            <Field
              label="ZIP"
              value={form.zip || ""}
              onChange={(v) => update("zip", v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!form.userName || !form.phone || !form.address1}
            className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
      />
    </div>
  );
}
